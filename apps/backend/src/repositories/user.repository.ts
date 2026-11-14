import { Inject, Injectable } from '@nestjs/common';
import * as postgresDb from '../providers/postgres-db';
import { usersTable } from '../schema';
import { eq } from 'drizzle-orm';
import { User } from '@repo/shared-types';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('NeonDBProvider') private readonly db: postgresDb.Database,
  ) {}

  async getAllUsers() {
    return await this.db.query.usersTable.findMany({
      columns: {
        password: false,
      },
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

  async createUser(user: User) {
    return await this.db.insert(usersTable).values({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      grade: user.grade,
      gender: user.gender,
      biography: user.biography,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture,
      isLegacyMember: user.isLegacyMember,
      password: user.password,
    });
  }

  async updateUser(id: string, updateData: Partial<User>) {
    return await this.db
      .update(usersTable)
      .set({
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
        profilePicture: updateData.profilePicture,
        password: updateData.password,
        biography: updateData.biography,
        grade: updateData.grade,
        gender: updateData.gender,
        role: updateData.role,
        isVerified: updateData.isVerified,
        isLegacyMember: updateData.isLegacyMember,
      })
      .where(eq(usersTable.id, id));
  }

  //   async deleteUser(id: string) {}

  //   async updateUserRole(id: string, role: Role) {}
}
