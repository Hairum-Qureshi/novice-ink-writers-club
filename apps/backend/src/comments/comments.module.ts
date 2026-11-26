import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentRepository } from '../repositories/comment.repository';
import { NeonDBProvider } from '../providers/postgres-db';
import { UserRepository } from '../repositories/user.repository';

@Module({
  controllers: [CommentsController],
  providers: [
    CommentRepository,
    NeonDBProvider,
    UserRepository,
    CommentsService,
  ],
})
export class CommentsModule {}
