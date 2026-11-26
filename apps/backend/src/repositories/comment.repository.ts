import { Inject, Injectable } from '@nestjs/common';
import * as postgresDb from '../providers/postgres-db';
import { commentsTable } from '../schema';
import { eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';

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

  async getCommentsByContentId(contentId: string) {
    const comments = await this.db.query.commentsTable.findMany({
      where: eq(commentsTable.storyId, contentId),
    });

    return comments;
  }

  async createComment(currUserId: string, comment: string, contentId: string) {
    const generatedId = customAlphabet(
      '1234567890abcdefghijklmnopqrstuvwxyz',
      15,
    );

    const newComment = await this.db
      .insert(commentsTable)
      .values({
        id: generatedId(),
        authorId: currUserId,
        content: comment,
        storyId: contentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newComment;
  }

  async deleteComment(commentId: string) {
    const deletedComment = await this.db
      .delete(commentsTable)
      .where(eq(commentsTable.id, commentId))
      .returning();

    return deletedComment;
  }
}
