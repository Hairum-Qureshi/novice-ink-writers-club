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
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import type { Request, Response } from 'express';
import { signUpSchema, signInSchema } from '@repo/shared-types';
import type {
  Role,
  SignUpFormData as SignUpFormDataDto,
  SignInFormData as SignInFormDataDto,
} from '@repo/shared-types';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(
    @Body({ schema: signUpSchema }) signUpFormDto: SignUpFormDataDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signUp(response, signUpFormDto);
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
  refreshTokens(@Req() req: Request, @Cookies('sessionId') sessionId: string) {
    const user = req.user;

    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.authService.refreshTokens(
      user['sub'] as string,
      user['refreshToken'] as string,
      user['role'] as Role,
      user['email'] as string,
      sessionId,
    );
  }

  // @Get('current-user')
  // @UseGuards(AuthGuard())
  // getCurrentUser(@CurrentUser() user: User): User {
  //   return this.authService.getCurrentUser(user);
  // }
}
