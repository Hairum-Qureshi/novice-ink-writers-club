import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(currUserId: string, comment: string, contentId: string) {
    if (!comment.trim())
      throw new HttpException(
        'Comment cannot be empty',
        HttpStatus.BAD_REQUEST,
      );

    if (comment.length > 500)
      throw new HttpException(
        'Comment cannot exceed 500 characters',
        HttpStatus.BAD_REQUEST,
      );

    await this.commentRepository.createComment(currUserId, comment, contentId);
  }

  editComment(comment: string, commentId: string) {
    if (!comment.trim())
      throw new HttpException(
        'Comment cannot be empty',
        HttpStatus.BAD_REQUEST,
      );

    if (comment.length > 500)
      throw new HttpException(
        'Comment cannot exceed 500 characters',
        HttpStatus.BAD_REQUEST,
      );

    return this.commentRepository.editComment(comment, commentId);
  }

  deleteComment(commentId: string) {
    return this.commentRepository.deleteComment(commentId);
  }

  getComments(contentId: string) {
    return this.commentRepository.getCommentsByContentId(contentId);
  }
}
