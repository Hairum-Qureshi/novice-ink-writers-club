import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '@repo/shared-types';
import { ConfigService } from '@nestjs/config';
import * as postgresDb from '../providers/postgres-db';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('NeonDBProvider') private readonly db: postgresDb.Database,
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
