import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import type { Response } from 'express';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import {
  User,
  SignUpFormData as SignUpFormDataDto,
  SignInFormData as SignInFormDataDto,
  Role,
} from '@repo/shared-types';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import * as postgresDb from '../../providers/postgres-db';
import { UserRepository } from '../../repositories/user.repository';
import { customAlphabet } from 'nanoid';
import { TokensService } from './tokens.service';
import crypto from 'crypto';
import { CookieService } from './cookie.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('NeonDBProvider') private readonly db: postgresDb.Database,
    private userRepository: UserRepository,
    private tokensService: TokensService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private cookieService: CookieService,
  ) {}

  async signUp(response: Response, signUpFormDto: SignUpFormDataDto) {
    const { firstName, lastName, email, password } = signUpFormDto;

    // check if account exists with email
    if (await this.userRepository.findUserByEmail(email)) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // hash password
    const hashedPassword = await argon2.hash(password);

    // save user to database
    const generatedId = customAlphabet(
      '1234567890abcdefghijklmnopqrstuvwxyz',
      15,
    );

    const user = {
      id: generatedId(),
      firstName,
      lastName,
      email,
      profilePicture: `https://api.dicebear.com/10.x/waves/svg?seed=${generatedId()}`,
      password: hashedPassword,
    };

    await this.userRepository.createUser(user);

    // TODO send email with verification code

    // ! - for now, just generate the tokens and later come back and implement the verification logic
    const { accessToken, refreshToken } =
      await this.tokensService.generateTokens(
        user.id,
        user.email as string,
        Role.USER,
      );

    const sessionId = crypto.randomBytes(16).toString('hex');

    await this.tokensService.setRefreshToken(user.id, sessionId, refreshToken);

    this.cookieService.createCookie(
      response,
      'sessionId',
      sessionId,
      this.configService.get<number>('JWT_REFRESH_EXPIRY') as number,
    );

    this.cookieService.createCookie(
      response,
      'refreshToken',
      refreshToken,
      this.configService.get<number>('JWT_REFRESH_EXPIRY') as number,
    );

    this.cookieService.createCookie(
      response,
      'accessToken',
      accessToken,
      this.configService.get<number>('JWT_ACCESS_EXPIRY') as number, // 15 minutes
    );
  }

  async verifyEmail() {
    // generate access and refresh tokens + cookies
    // mark user as verified in the database + clear verification code
    // return response with tokens and cookies
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

    // compare passwords with argon2
    const isPasswordValid = await argon2.verify(
      user.password as string,
      signInFormDto.password as string,
    );

    if (!isPasswordValid)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const { accessToken, refreshToken } =
      await this.tokensService.generateTokens(user.id, user.email, Role.USER);

    const sessionId = crypto.randomBytes(16).toString('hex');

    await this.tokensService.setRefreshToken(user.id, sessionId, refreshToken);

    this.cookieService.createCookie(
      response,
      'sessionId',
      sessionId,
      1000 * 60 * 60 * 24 * 7,
    );

    this.cookieService.createCookie(
      response,
      'refreshToken',
      refreshToken,
      1000 * 60 * 60 * 24 * 7,
    );

    this.cookieService.createCookie(
      response,
      'accessToken',
      accessToken,
      1000 * 60 * 15,
    );
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
    role: Role,
    email: string,
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

    await this.cacheManager.del(RT_KEY);

    const tokens = await this.tokensService.generateTokens(userId, email, role);

    await this.tokensService.setRefreshToken(
      userId,
      sessionId,
      tokens.refreshToken,
    );

    this.cookieService.createCookie(
      response,
      'refreshToken',
      tokens.refreshToken,
      1000 * 60 * 60 * 24 * 7,
    );

    this.cookieService.createCookie(
      response,
      'accessToken',
      tokens.accessToken,
      1000 * 60 * 15,
    );

    return tokens;
  }

  getCurrentUser(user: User): User {
    return user;
  }
}
