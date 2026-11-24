import { Inject, Injectable } from '@nestjs/common';
import * as postgresDb from '../providers/postgres-db';
import { eq } from 'drizzle-orm';
import { Genre } from '@repo/shared-types';
import { storiesTable } from '../schema';

@Injectable()
export class StoryRepository {
  constructor(
    @Inject('NeonDBProvider') private readonly db: postgresDb.Database,
  ) {}

  async getAllPublishedInGenre(genre: Genre) {
    const publishedStories = await this.db.query.storiesTable.findMany({
      where: eq(storiesTable.genre, genre),
      columns: {
        content: false,
      },
    });
    return publishedStories;
  }

  async getPublishedGenreContentById(storyId: string) {
    const storyContent = await this.db.query.storiesTable.findFirst({
      where: eq(storiesTable.id, storyId),
      columns: {
        title: true,
        content: true,
        authorName: true,
      },
    });
    return storyContent;
  }
}
