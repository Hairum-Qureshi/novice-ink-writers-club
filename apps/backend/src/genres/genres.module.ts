import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { NeonDBProvider } from '../providers/postgres-db';
import { UserRepository } from '../repositories/user.repository';
import { StoryRepository } from '../repositories/story.repository';

@Module({
  controllers: [GenresController],
  providers: [GenresService, UserRepository, StoryRepository, NeonDBProvider],
})
export class GenresModule {}
