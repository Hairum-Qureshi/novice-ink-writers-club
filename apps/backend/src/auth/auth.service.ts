import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, SignUpFormData as SignUpFormDataDto } from '@repo/shared-types';
import * as argon2 from 'argon2';

import { ConfigService } from '@nestjs/config';
import * as postgresDb from '../providers/postgres-db';
import { UserRepository } from '../repositories/user.repository';
import nanoid, { customAlphabet } from 'nanoid';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('NeonDBProvider') private readonly db: postgresDb.Database,
    private userRepository: UserRepository,
  ) {}

  getAuthCookieOptions() {
    return {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
    };
  }

  async signUp(signUpFormDto: SignUpFormDataDto) {
    const { firstName, lastName, email, password } = signUpFormDto;

    // check if account exists with email
    if (await this.userRepository.findUserByEmail(email)) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // hash password
    const hashedPassword = await argon2.hash(password);

    // save user to database
    const generatedId = customAlphabet(
      '1234567890abcdefghijklmnopqrstuvwxyz',
      15,
    );

    const user = {
      id: generatedId(),
      firstName,
      lastName,
      email,
      profilePicture: `https://api.dicebear.com/10.x/waves/svg?seed=${generatedId()}`,
      password: hashedPassword,
    };

    await this.userRepository.createUser(user);

    // send email with verification code
  }

  async verifyEmail() {
    // generate access and refresh tokens + cookies
    // mark user as verified in the database + clear verification code
    // return response with tokens and cookies
  }

  getCurrentUser(user: User): User {
    return user;
  }
}
