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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../decorators/currentUser.decorator';

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
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('backdrop-picture'))
  @HttpCode(HttpStatus.OK)
  updateBackdrop(
    @CurrentUser('sub') currUserId: string,
    @UploadedFile() backdropPictureFile: Express.Multer.File,
  ) {
    return this.usersService.uploadBackdrop(currUserId, backdropPictureFile);
  }
}
