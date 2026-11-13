import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async getUserById(id: string) {
    return this.userRepository.getUserById(id);
  }
}
