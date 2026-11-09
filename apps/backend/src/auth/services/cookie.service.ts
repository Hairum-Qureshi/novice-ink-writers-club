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

  removeCookies(res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
  }
}
