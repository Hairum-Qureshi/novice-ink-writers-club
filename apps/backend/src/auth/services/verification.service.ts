import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import type { Response } from 'express';
import crypto from 'crypto';
import { EmailService } from '../../email/email.service';
import { UserRepository } from '../../repositories/user.repository';
import { CookieService } from './cookie.service';
import { TokensService } from './tokens.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class VerificationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokensService: TokensService,
    private readonly cookieService: CookieService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  generateVerificationCode() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let verificationCode = '';
    for (let i = 0; i < 6; i++) {
      verificationCode += numbers[crypto.randomInt(numbers.length)];
    }

    return verificationCode;
  }

  async verifyEmail(response: Response, code: string) {
    const cached = await this.cacheManager.get<{
      userId: string;
    }>(`verification-code-${code}`);

    if (!cached) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const { userId } = cached;

    if (!userId) {
      throw new HttpException(
        'Invalid verification code',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = userId ? await this.userRepository.getUserById(userId) : null;

    if (!user) {
      throw new HttpException(
        'Invalid verification code',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepository.updateUser(user.id, {
      isVerified: true,
    });

    await this.cacheManager.del(`verification-code-${code}`);

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

  async resendVerificationEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (user.is_verified) {
      throw new HttpException(
        'User is already verified',
        HttpStatus.BAD_REQUEST,
      );
    }

    const verificationCode = this.generateVerificationCode();

    await this.cacheManager.set(
      `verification-code-${verificationCode}`,
      {
        userId: user.id,
      },
      10 * 60 * 1000, // 10 minutes in milliseconds
    );

    // await this.userRepository.updateUser(user.id, {
    //   verificationCode,
    //   verificationCodeExpiry: new Date(Date.now() + 5 * 60 * 1000),
    // });

    await this.emailService.sendVerificationEmail(user.email, verificationCode);
  }
}
