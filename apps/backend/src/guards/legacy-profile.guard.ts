import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '@repo/shared-types';

@Injectable()
export class LegacyProfileGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const profileId = request.user.sub as string | undefined;

    if (!profileId) throw new NotFoundException('Profile ID not found');

    const user = (await this.userRepository.getUserById(
      profileId,
    )) as User | null;

    if (!user) throw new NotFoundException('User not found');

    if (user.isLegacyMember)
      throw new ForbiddenException('Legacy profiles cannot be modified');

    return true;
  }
}
