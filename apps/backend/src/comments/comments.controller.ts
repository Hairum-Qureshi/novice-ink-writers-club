import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
  Patch,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { IsOwnerGuard } from '../guards/is-owner.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':contentId/new')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  createComment(
    @CurrentUser('sub') currUserId: string,
    @Body('comment') comment: string,
    @Param('contentId') contentId: string,
  ) {
    return this.commentsService.createComment(currUserId, comment, contentId);
  }

  @Patch(':commentId/edit')
  @UseGuards(AuthGuard('jwt'), IsOwnerGuard)
  @HttpCode(HttpStatus.OK)
  editComment(
    @CurrentUser('sub') currUserId: string,
    @Body('comment') comment: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.editComment(currUserId, comment, commentId);
  }

  @Delete(':commentId/delete')
  @UseGuards(AuthGuard('jwt'), IsOwnerGuard)
  @HttpCode(HttpStatus.OK)
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentsService.deleteComment(commentId);
  }

  @Get(':contentId')
  @HttpCode(HttpStatus.OK)
  getComments(@Param('contentId') contentId: string) {
    return this.commentsService.getComments(contentId);
  }
}
