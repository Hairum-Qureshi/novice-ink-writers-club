import {
  Injectable,
  Inject,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CookieService } from '../auth/services/cookie.service';
import { UserRepository } from '../repositories/user.repository';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { SafeUser } from '@repo/shared-types';
import * as cacheManager from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import type {
  User,
  UserSettingsFormData as UserSettingsFormDto,
} from '@repo/shared-types';
import type { Response } from 'express';
import { CommentRepository } from '../repositories/comment.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject('S3ClientProvider') private readonly s3Client: S3Client,
    @Inject(CACHE_MANAGER) private cacheManager: cacheManager.Cache,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService,
    private readonly commentRepository: CommentRepository,
  ) {}

  private profilePictureObject = (userId: string) => ({
    Bucket: 'profile-pictures',
    Key: `${userId}/profilePicture`,
  });

  private backdropObject = (userId: string) => ({
    Bucket: 'backdrops',
    Key: `${userId}/backgroundPicture`,
  });

  async getAllUsers() {
    const cachedUsers = await this.cacheManager.get<SafeUser[]>('users:all');

    if (cachedUsers != null) return cachedUsers;

    const allUsers = await this.userRepository.getAllUsers();

    await this.cacheManager.set('users:all', allUsers);

    return allUsers;
  }

  async getUserById(id: string) {
    return this.userRepository.getCachedUserById(id);
  }

  private async uploadToS3(
    bucket: string,
    key: string,
    file: Express.Multer.File,
  ) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `${this.configService.get<string>('AWS_ENDPOINT_URL_S3')}/${bucket}/${key}`;
  }

  async uploadProfilePicture(
    currUserId: string,
    profilePictureFile: Express.Multer.File,
  ) {
    if (!profilePictureFile)
      throw new NotFoundException('Profile picture file not found');

    const { Bucket, Key } = this.profilePictureObject(currUserId);

    const publicFileUrl = await this.uploadToS3(
      Bucket,
      Key,
      profilePictureFile,
    );

    // update the user's profile picture in the database
    const user: SafeUser = await this.userRepository.updateUser(currUserId, {
      profilePicture: publicFileUrl,
      updatedAt: new Date(),
    });

    return user;
  }

  async uploadBackdrop(
    currUserId: string,
    backdropPictureFile: Express.Multer.File,
  ) {
    if (!backdropPictureFile)
      throw new NotFoundException('Backdrop picture file not found');

    const { Bucket, Key } = this.backdropObject(currUserId);

    const publicFileUrl = await this.uploadToS3(
      Bucket,
      Key,
      backdropPictureFile,
    );

    // update the user's backdrop in the database
    const user: SafeUser = await this.userRepository.updateUser(currUserId, {
      backdropImage: publicFileUrl,
      updatedAt: new Date(),
    });

    return user;
  }

  async updateUser(currUserId: string, signInFormDto: UserSettingsFormDto) {
    const updateData = {
      ...signInFormDto,
      updatedAt: new Date(),
    } as Partial<User>;

    const user: SafeUser = await this.userRepository.updateUser(
      currUserId,
      updateData,
    );

    return user;
  }

  private async deleteUserImages(currUserId: string) {
    await this.s3Client.send(
      new DeleteObjectCommand(this.backdropObject(currUserId)),
    );
    await this.s3Client.send(
      new DeleteObjectCommand(this.profilePictureObject(currUserId)),
    );
  }

  async deleteAccount(currUserId: string, res: Response, sessionId: string) {
    await this.deleteUserImages(currUserId);
    await this.commentRepository.deleteAllCommentsByUserId(currUserId);
    await this.userRepository.deleteUser(currUserId);

    const RT_KEY = `rt:${sessionId}`;
    const sessionData = await this.cacheManager.get<{
      refreshTokenHash: string;
      userId: string;
    }>(RT_KEY);

    if (!sessionData || sessionData.userId !== currUserId)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    await this.cacheManager.del(RT_KEY);

    this.cookieService.removeCookies(res);
    return { message: 'Account successfully deleted' };
  }
}
