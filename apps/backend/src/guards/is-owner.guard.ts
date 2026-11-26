import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '@repo/shared-types';
import { CommentRepository } from '../repositories/comment.repository';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const commentId = request.params.commentId as string | undefined;

    const userId = request.user.sub as string | undefined;

    if (!commentId) throw new NotFoundException('Comment ID not found');

    const comment = await this.commentRepository.getCommentById(commentId);

    if (!userId) throw new NotFoundException('User ID not found');

    const user = (await this.userRepository.getUserById(userId)) as User | null;

    if (!user) throw new NotFoundException('User not found');

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.authorId !== userId)
      throw new ForbiddenException('You are not the owner of this comment');

    return true;
  }
}
