import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { NeonDBProvider } from '../providers/postgres-db';
import { UserRepository } from '../repositories/user.repository';

@Module({
  controllers: [GenresController],
  providers: [GenresService, UserRepository, NeonDBProvider],
})
export class GenresModule {}
