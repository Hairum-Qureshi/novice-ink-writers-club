import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { Role } from '@repo/shared-types';
import crypto from 'crypto';
import { EmailService } from '../../email/email.service';
import { UserRepository } from '../../repositories/user.repository';
import { CookieService } from './cookie.service';
import { TokensService } from './tokens.service';

@Injectable()
export class VerificationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokensService: TokensService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
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
    const user = await this.userRepository.findUserByVerificationCode(code);

    if (!user) {
      throw new HttpException(
        'Invalid verification code',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      user.verification_code_expiry &&
      user.verification_code_expiry < new Date()
    ) {
      throw new HttpException(
        'Verification code has expired. Please request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepository.updateUser(user.id, {
      isVerified: true,
      verificationCode: null,
      verificationCodeExpiry: null,
    });

    const { accessToken, refreshToken } =
      await this.tokensService.generateTokens(user.id, user.email, Role.USER);

    const sessionId = crypto.randomBytes(16).toString('hex');
    await this.tokensService.setRefreshToken(user.id, sessionId, refreshToken);

    const refreshExpiry = this.configService.get<number>(
      'JWT_REFRESH_EXPIRY',
    ) as number;
    this.cookieService.createCookie(
      response,
      'sessionId',
      sessionId,
      refreshExpiry,
    );
    this.cookieService.createCookie(
      response,
      'refreshToken',
      refreshToken,
      refreshExpiry,
    );
    this.cookieService.createCookie(
      response,
      'accessToken',
      accessToken,
      this.configService.get<number>('JWT_ACCESS_EXPIRY') as number,
    );
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.is_verified) {
      throw new HttpException(
        'User is already verified',
        HttpStatus.BAD_REQUEST,
      );
    }

    const verificationCode = this.generateVerificationCode();
    await this.userRepository.updateUser(user.id, {
      verificationCode,
      verificationCodeExpiry: new Date(Date.now() + 5 * 60 * 1000),
    });

    await this.emailService.sendVerificationEmail(user.email, verificationCode);
  }
}
