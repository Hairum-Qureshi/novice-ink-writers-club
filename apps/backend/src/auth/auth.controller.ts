import { Controller, Get, Post, Res, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from '../decorators/currentUser.decorator';
import type { Response } from 'express';
import type { UserPayload } from '@repo/shared-types';
import type { SignUpFormData as SignUpFormDataDto } from '@repo/shared-types';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() formData: SignUpFormDataDto) {
    console.log(formData);
  }

  @Post('sign-out')
  signOut(@Res({ passthrough: true }) res: Response): {
    message: string;
  } {
    res.clearCookie('auth-session', this.authService.getAuthCookieOptions());
    return { message: 'success' };
  }

  @Get('current-user')
  @UseGuards(AuthGuard())
  getCurrentUser(@CurrentUser() user: UserPayload): UserPayload {
    return this.authService.getCurrentUser(user);
  }
}
