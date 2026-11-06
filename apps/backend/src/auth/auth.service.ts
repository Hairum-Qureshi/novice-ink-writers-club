import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '@repo/shared-types';
import { ConfigService } from '@nestjs/config';
import type { Database } from 'src/providers/postgres-db';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('NeonDBProvider') private readonly db: Database,
  ) {}

  getAuthCookieOptions() {
    return {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
    };
  }

  signUp() {}

  getCurrentUser(user: UserPayload): UserPayload {
    return user;
  }
}
