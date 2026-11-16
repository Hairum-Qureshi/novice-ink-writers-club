import {
  Controller,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../decorators/currentUser.decorator';
import type { UserSettingsFormData as UserSettingsFormDto } from '@repo/shared-types';
import { userSettingsSchema } from '@repo/shared-types';
import { LegacyProfileGuard } from '../guards/legacy-profile.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch('update-pfp')
  @UseGuards(AuthGuard('jwt'), LegacyProfileGuard)
  @UseInterceptors(FileInterceptor('profile-picture'))
  @HttpCode(HttpStatus.OK)
  updateProfilePicture(
    @CurrentUser('sub') currUserId: string,
    @UploadedFile() profilePictureFile: Express.Multer.File,
  ) {
    return this.usersService.uploadProfilePicture(
      currUserId,
      profilePictureFile,
    );
  }

  @Patch('update-backdrop')
  @UseGuards(AuthGuard('jwt'), LegacyProfileGuard)
  @UseInterceptors(FileInterceptor('backdrop-image'))
  @HttpCode(HttpStatus.OK)
  updateBackdrop(
    @CurrentUser('sub') currUserId: string,
    @UploadedFile() backdropPictureFile: Express.Multer.File,
  ) {
    return this.usersService.uploadBackdrop(currUserId, backdropPictureFile);
  }

  @Patch('update-user')
  @UseGuards(AuthGuard('jwt'), LegacyProfileGuard)
  @HttpCode(HttpStatus.OK)
  updateUser(
    @CurrentUser('sub') currUserId: string,
    @Body({ schema: userSettingsSchema }) signInFormDto: UserSettingsFormDto,
  ) {
    return this.usersService.updateUser(currUserId, signInFormDto);
  }
}
