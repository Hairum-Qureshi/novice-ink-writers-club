import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { StoryRepository } from '../repositories/story.repository';
import * as postgresDb from '../providers/postgres-db';
import { Genre } from '@repo/shared-types';

@Injectable()
export class GenresService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storyRepository: StoryRepository,
    @Inject('NeonDBProvider') private readonly db: postgresDb.Database,
  ) {}

  async getAllPublishedInGenre(genre: Genre) {
    const publishedStories =
      await this.storyRepository.getAllPublishedInGenre(genre);
    return publishedStories;
  }
}
