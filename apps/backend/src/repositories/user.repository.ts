import { Inject, Injectable } from '@nestjs/common';
import * as postgresDb from '../providers/postgres-db';
import { usersTable } from '../schema';
import { eq } from 'drizzle-orm';
// import { UserPayload, Role } from '@repo/shared-types';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('NeonDBProvider') private readonly db: postgresDb.Database,
  ) {}

  async getAllUsers() {
    return await this.db.query.usersTable.findMany();
  }

  async getUserById(id: string) {
    return await this.db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });
  }

  //   async createUser(user: UserPayload) {}

  //   async deleteUser(id: string) {}

  //   async updateUserRole(id: string, role: Role) {}
}
