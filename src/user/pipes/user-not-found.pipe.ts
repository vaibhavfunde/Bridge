// src/user/pipes/user-not-found.pipe.ts

import {
  PipeTransform,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class UserNotFoundPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(email: string) {
    try {
      const exists = await this.userService.isEmailTaken(email);
      if (!exists) {
        throw new BadRequestException('User with this email does not exist');
      }
      return email;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Failed to verify user existence',
      );
    }
  }
}
