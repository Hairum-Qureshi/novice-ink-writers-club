import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Role } from '@repo/shared-types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import crypto from 'crypto';

@Injectable()
export class TokensService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async generateTokens(userId: string, email: string, role: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      // access token
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: 60 * 15,
        },
      ),

      // refresh token
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async setRefreshToken(
    userId: string,
    sessionId: string,
    refreshToken: string,
  ) {
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    await this.cacheManager.set(
      `rt:${sessionId}`,
      {
        refreshTokenHash,
        userId,
      },
      this.configService.get<number>('JWT_REFRESH_EXPIRY'), // TTL for the refresh token in milliseconds (1 week)
    );
  }

  hashRefreshToken(refreshToken: string) {
    return crypto.createHash('sha256').update(refreshToken).digest('hex');
  }
}
