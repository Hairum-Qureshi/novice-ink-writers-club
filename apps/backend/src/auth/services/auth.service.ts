import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  User,
  SignUpFormData as SignUpFormDataDto,
  SignInFormData as SignInFormDataDto,
  Role,
} from '@repo/shared-types';
import { EmailService } from '../../email/email.service';
import * as argon2 from 'argon2';
import * as postgresDb from '../../providers/postgres-db';
import { UserRepository } from '../../repositories/user.repository';
import { customAlphabet, nanoid } from 'nanoid';
import { TokensService } from './tokens.service';
import crypto from 'crypto';
import { CookieService } from './cookie.service';
import { VerificationService } from './verification.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('NeonDBProvider') private readonly db: postgresDb.Database,
    private userRepository: UserRepository,
    private tokensService: TokensService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private cookieService: CookieService,
    private verificationService: VerificationService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpFormDto: SignUpFormDataDto) {
    const { firstName, lastName, email, password } = signUpFormDto;

    if (await this.userRepository.findUserByEmail(email as string)) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await argon2.hash(password as string);

    const generatedId = customAlphabet(
      '1234567890abcdefghijklmnopqrstuvwxyz',
      15,
    );

    const verificationCode =
      this.verificationService.generateVerificationCode();

    const user = {
      id: generatedId(),
      firstName,
      lastName,
      email,
      role: Role.MEMBER,
      isVerified: false,
      verificationCode,
      resetToken: null,
      resetTokenExpiry: null,
      verificationCodeExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      profilePicture: `https://api.dicebear.com/10.x/waves/svg?seed=${generatedId()}`,
      password: hashedPassword,
    };

    await this.userRepository.createUser(user);
    await this.emailService.sendVerificationEmail(
      user.email as string,
      verificationCode,
    );
  }

  async signOut(response: Response, sessionId: string, userId: string) {
    // find the refresh token in the cache using the sessionId
    const RT_KEY = `rt:${sessionId}`;
    const sessionData = await this.cacheManager.get<{
      refreshTokenHash: string;
      userId: string;
    }>(RT_KEY);

    if (!sessionData || sessionData.userId !== userId)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    await this.cacheManager.del(RT_KEY);

    this.cookieService.removeCookies(response);
  }

  async signIn(response: Response, signInFormDto: SignInFormDataDto) {
    const user = await this.userRepository.findUserByEmail(
      signInFormDto.email as string,
    );

    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    if (!user.is_verified) {
      const verificationCode =
        this.verificationService.generateVerificationCode();

      await this.userRepository.updateUser(user.id, {
        verificationCode,
        verificationCodeExpiry: new Date(Date.now() + 5 * 60 * 1000),
      });

      await this.emailService.sendVerificationEmail(
        user.email,
        verificationCode,
      );

      throw new HttpException(
        'Email not verified. A verification code has been sent to your email.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await argon2.verify(
      user.password as string,
      signInFormDto.password as string,
    );

    if (!isPasswordValid)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const { accessToken, refreshToken } =
      await this.tokensService.generateTokens(user.id, user.email, user.role);

    const sessionId = crypto.randomBytes(16).toString('hex');

    await this.tokensService.setRefreshToken(user.id, sessionId, refreshToken);

    this.cookieService.setAuthCookies(
      response,
      refreshToken,
      accessToken,
      sessionId,
    );
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
    sessionId: string,
    response: Response,
  ) {
    const RT_KEY = `rt:${sessionId}`;
    const sessionData = await this.cacheManager.get<{
      refreshTokenHash: string;
      userId: string;
    }>(RT_KEY);

    if (!sessionData || sessionData.userId !== userId)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    // hash the refresh token being passed in
    const currentHashedRefreshToken =
      this.tokensService.hashRefreshToken(refreshToken);

    // compare the hashed refresh token with the stored hash via crypto
    if (currentHashedRefreshToken !== sessionData.refreshTokenHash) {
      throw new ForbiddenException('Access Denied');
    }

    const user = await this.userRepository.getUserById(userId);

    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    await this.cacheManager.del(RT_KEY);

    const tokens = await this.tokensService.generateTokens(
      user.id,
      user.email,
      user.role,
    );

    await this.tokensService.setRefreshToken(
      userId,
      sessionId,
      tokens.refreshToken,
    );

    this.cookieService.setAuthCookies(
      response,
      tokens.refreshToken,
      tokens.accessToken,
    );

    return tokens;
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const resetToken = nanoid(64);
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await this.userRepository.updateUser(user.id, {
      resetToken: resetToken,
      resetTokenExpiry: resetTokenExpiry,
    });

    await this.emailService.sendPasswordResetEmail(
      email,
      `${this.configService.getOrThrow<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`,
      10,
    );
  }

  getCurrentUser(user: User): User {
    return user;
  }
}
