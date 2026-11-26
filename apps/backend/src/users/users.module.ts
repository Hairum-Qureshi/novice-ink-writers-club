import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from '../repositories/user.repository';
import { NeonDBProvider } from '../providers/postgres-db';
import { S3ClientProvider } from '../providers/s3Client';
import { CookieService } from '../auth/services/cookie.service';

@Module({
  providers: [
    UsersService,
    UserRepository,
    NeonDBProvider,
    S3ClientProvider,
    CookieService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
