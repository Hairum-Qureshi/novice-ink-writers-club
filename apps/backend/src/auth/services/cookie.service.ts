import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  createCookie(res: Response, name: string, token: string, age: number) {
    res.cookie(name, token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: age,
    });
  }

  setAuthCookies(
    res: Response,
    refreshToken: string,
    accessToken: string,
    sessionId?: string,
  ) {
    const refreshExpiry = this.configService.get<number>(
      'JWT_REFRESH_EXPIRY',
    ) as number;
    const accessExpiry = this.configService.get<number>(
      'JWT_ACCESS_EXPIRY',
    ) as number;

    if (sessionId)
      this.createCookie(res, 'sessionId', sessionId, refreshExpiry);

    this.createCookie(res, 'refreshToken', refreshToken, refreshExpiry);
    this.createCookie(res, 'accessToken', accessToken, accessExpiry);
  }

  removeCookies(res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
  }
}
