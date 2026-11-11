import {
  Controller,
  Post,
  UseGuards,
  Body,
  Cookies,
  HttpCode,
  HttpStatus,
  Req,
  HttpException,
  Res,
  Get,
  Put,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { VerificationService } from './services/verification.service';
import type { Request, Response } from 'express';
import {
  signUpSchema,
  signInSchema,
  passwordResetSchema,
} from '@repo/shared-types';
import type {
  SignUpFormData as SignUpFormDataDto,
  SignInFormData as SignInFormDataDto,
  PasswordResetFormData as PasswordResetFormDataDto,
} from '@repo/shared-types';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationService: VerificationService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body({ schema: signUpSchema }) signUpFormDto: SignUpFormDataDto) {
    return this.authService.signUp(signUpFormDto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body({ schema: signInSchema }) signInFormDto: SignInFormDataDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(response, signInFormDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const sessionId = request.cookies['sessionId'] as string;
    return this.authService.signOut(response, sessionId, user['sub'] as string);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Cookies('sessionId') sessionId: string,
  ) {
    const user = request.user!;

    return this.authService.refreshTokens(
      user['sub'] as string,
      user['refreshToken'] as string,
      sessionId,
      response,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('current-user')
  getCurrentUser(@Req() request: Request) {
    const user = request.user!;

    return {
      id: user['sub'],
      firstName: user['firstName'],
      lastName: user['lastName'],
      email: user['email'],
      profilePicture: user['profilePicture'],
      role: user['role'],
    };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(
    @Body('code') code: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.verificationService.verifyEmail(response, code);
  }

  @Post('resend-verification-email')
  @HttpCode(HttpStatus.OK)
  resendVerificationEmail(@Body('email') email: string) {
    return this.verificationService.resendVerificationEmail(email);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Put('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body({ schema: passwordResetSchema })
    passwordResetDto: PasswordResetFormDataDto,
  ) {
    return this.authService.resetPassword(passwordResetDto);
  }
}
