import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Cookies,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CurrentUser } from '../decorators/currentUser.decorator';
import type { Response } from 'express';
import { signUpSchema, type User } from '@repo/shared-types';
import type { SignUpFormData as SignUpFormDataDto } from '@repo/shared-types';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body({ schema: signUpSchema }) signUpFormDto: SignUpFormDataDto) {
    return this.authService.signUp(signUpFormDto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn() {}

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(@Cookies('sessionId') sessionId: string) {
    return this.authService.signOut(sessionId);
  }

  @Get('current-user')
  @UseGuards(AuthGuard())
  getCurrentUser(@CurrentUser() user: User): User {
    return this.authService.getCurrentUser(user);
  }
}
