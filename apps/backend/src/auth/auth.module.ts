import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { NeonDBProvider } from '../providers/postgres-db';
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { TokensService } from './services/tokens.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   imports: [ConfigModule],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       secret: config.get<string>('JWT_SECRET'),
    //       signOptions: {
    //         expiresIn: Number(config.get<string>('JWT_EXPIRES')),
    //       },
    //     };
    //   },
    // }),
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    NeonDBProvider,
    UserRepository,
    RefreshTokenStrategy,
    AccessTokenStrategy,
    TokensService,
  ],
  controllers: [AuthController],
  exports: [PassportModule, JwtStrategy, AuthService],
})
export class AuthModule {}
