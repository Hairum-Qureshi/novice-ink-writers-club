import { Inject, Injectable } from '@nestjs/common';
import * as postgresDb from '../providers/postgres-db';
import { commentsTable } from '../schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CommentRepository {
  constructor(
    @Inject('NeonDBProvider') private readonly db: postgresDb.Database,
  ) {}

  async getCommentById(commentId: string) {
    const comment = await this.db.query.commentsTable.findFirst({
      where: eq(commentsTable.id, commentId),
    });

    return comment;
  }
}
