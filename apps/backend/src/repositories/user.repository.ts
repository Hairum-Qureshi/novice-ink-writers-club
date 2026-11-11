import { Inject, Injectable } from '@nestjs/common';
import * as postgresDb from '../providers/postgres-db';
import { usersTable } from '../schema';
import { eq } from 'drizzle-orm';
import { User } from '@repo/shared-types';
// import { User, Role } from '@repo/shared-types';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('NeonDBProvider') private readonly db: postgresDb.Database,
  ) {}

  async getAllUsers() {
    return await this.db.query.usersTable.findMany();
  }

  async findUserByEmail(email: string) {
    return await this.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
  }

  async getUserById(id: string) {
    return await this.db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });
  }

  async createUser(user: User) {
    return await this.db.insert(usersTable).values({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      role: user.role,
      is_verified: user.isVerified,
      profile_picture: user.profilePicture,
      password: user.password,
    });
  }

  async updateUser(id: string, updateData: Partial<User>) {
    return await this.db
      .update(usersTable)
      .set({
        first_name: updateData.firstName,
        last_name: updateData.lastName,
        email: updateData.email,
        profile_picture: updateData.profilePicture,
        password: updateData.password,
        role: updateData.role,
        is_verified: updateData.isVerified,
      })
      .where(eq(usersTable.id, id));
  }

  //   async deleteUser(id: string) {}

  //   async updateUserRole(id: string, role: Role) {}
}
