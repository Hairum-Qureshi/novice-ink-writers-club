import { Inject, Injectable } from '@nestjs/common';
import * as postgresDb from '../providers/postgres-db';
import { usersTable } from '../schema';
import { eq } from 'drizzle-orm';
import { User, SafeUser, Grade, Gender } from '@repo/shared-types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('NeonDBProvider') private readonly db: postgresDb.Database,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private async invalidateUserCaches(id: string) {
    await Promise.all([
      this.cacheManager.del(`user:${id}`),
      this.cacheManager.del('users:all'),
    ]);
  }

  async getAllUsers() {
    return await this.db.query.usersTable.findMany({
      columns: {
        password: false,
      },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
  }

  async findUserByEmail(email: string) {
    return await this.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
  }

  async getUserById(id: string) {
    return await this.db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
      columns: {
        password: false,
      },
    });
  }

  async getCachedUserById(id: string): Promise<SafeUser | undefined> {
    const key = `user:${id}`;
    const cachedUser = await this.cacheManager.get<SafeUser>(key);
    if (cachedUser != null) return cachedUser;

    const user = await this.getUserById(id);
    if (user) await this.cacheManager.set(key, user, 30 * 60 * 1000);
    return user;
  }

  async createUser(user: User) {
    const result = await this.db.insert(usersTable).values({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      grade: user.grade as Grade,
      gender: user.gender as Gender,
      biography: user.biography,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture,
      isLegacyMember: user.isLegacyMember,
      backdropImage: user.backdropImage,
      password: user.password,
    });
    await this.cacheManager.del('users:all');
    return result;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<SafeUser> {
    const [user]: SafeUser[] = await this.db
      .update(usersTable)
      .set({
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
        profilePicture: updateData.profilePicture,
        password: updateData.password,
        biography: updateData.biography,
        grade: updateData.grade as Grade,
        gender: updateData.gender as Gender,
        role: updateData.role,
        isVerified: updateData.isVerified,
        isLegacyMember: updateData.isLegacyMember,
        backdropImage: updateData.backdropImage,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning();

    await this.invalidateUserCaches(id);
    return user;
  }

  async deleteUser(id: string) {
    const [user]: SafeUser[] = await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    await this.invalidateUserCaches(id);
    return user;
  }
}
