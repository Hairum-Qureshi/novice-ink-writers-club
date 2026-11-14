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
  PasswordResetFormData as PasswordResetFormDataDto,
  SafeUser,
} from '@repo/shared-types';
import { EmailService } from '../../email/email.service';
import * as argon2 from 'argon2';
import * as postgresDb from '../../providers/postgres-db';
import { UserRepository } from '../../repositories/user.repository';
import { customAlphabet, nanoid } from 'nanoid';
import { TokensService } from './tokens.service';
import crypto, { createHash } from 'crypto';
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

    if (await this.userRepository.findUserByEmail(email)) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await argon2.hash(password);

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
      grade: null,
      gender: null,
      biography: 'This user prefers to keep an air of mystery about them',
      verificationCodeExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      profilePicture: `https://api.dicebear.com/10.x/waves/svg?seed=${generatedId()}`,
      password: hashedPassword,
      isLegacyMember: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.userRepository.createUser(user);

    await this.cacheManager.set(
      `verification-code-${verificationCode}`,
      {
        userId: user.id,
      },
      10 * 60 * 1000, // 10 minutes in milliseconds
    );

    await this.emailService.sendVerificationEmail(user.email, verificationCode);
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
    const user = await this.userRepository.findUserByEmail(signInFormDto.email);

    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    if (!user.isVerified) {
      const verificationCode =
        this.verificationService.generateVerificationCode();

      await this.cacheManager.set(
        `verification-code-${verificationCode}`,
        {
          userId: user.id,
        },
        10 * 60 * 1000, // 10 minutes in milliseconds
      );

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
      user.password,
      signInFormDto.password,
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
    const tokenHash = createHash('sha256').update(resetToken).digest('hex');

    await this.cacheManager.set(
      `password-reset:${tokenHash}`,
      {
        userId: user.id,
      },
      10 * 60 * 1000, // 10 minutes in milliseconds
    );

    await this.emailService.sendPasswordResetEmail(
      email,
      `${this.configService.getOrThrow<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`,
      10,
    );
  }

  async resetPassword(
    passwordResetDto: PasswordResetFormDataDto,
    token: string,
  ) {
    const { newPassword, confirmedNewPassword } = passwordResetDto;

    if (!token) throw new NotFoundException('Token not found');

    const tokenHash = createHash('sha256').update(token).digest('hex');

    const cachedResetToken = await this.cacheManager.get<{ userId: string }>(
      `password-reset:${tokenHash}`,
    );

    if (!cachedResetToken)
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );

    if (newPassword !== confirmedNewPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.getUserById(cachedResetToken.userId);
    if (!user) throw new NotFoundException('User not found');

    const hashedPassword = createHash('sha256')
      .update(newPassword)
      .digest('hex');

    await this.userRepository.updateUser(user.id, { password: hashedPassword });

    await this.cacheManager.del(`password-reset:${tokenHash}`);
  }

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const key = `user:${userId}`;
    const cachedUser = await this.cacheManager.get<User>(key);

    if (cachedUser) return cachedUser;

    const user = await this.userRepository.getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    await this.cacheManager.set(key, user, 30 * 60 * 1000); // expires after 30 minutes
    return user;
  }
}
