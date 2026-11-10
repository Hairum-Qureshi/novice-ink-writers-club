import { Global, Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { CookieService } from './services/cookie.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { NeonDBProvider } from '../providers/postgres-db';
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { TokensService } from './services/tokens.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    EmailModule,
  ],
  providers: [
    AuthService,
    NeonDBProvider,
    UserRepository,
    RefreshTokenStrategy,
    AccessTokenStrategy,
    TokensService,
    CookieService,
  ],
  controllers: [AuthController],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
