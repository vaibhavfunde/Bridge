
// // import {
// //   PipeTransform,
// //   Injectable,
// //   BadRequestException,
// // } from '@nestjs/common';
// // import { UserService } from '../user.service';

// // @Injectable()
// // export class UserExistsPipe implements PipeTransform {
// //   constructor(private readonly userService: UserService) {}

// //   async transform(email: string) {
// //     const exists = await this.userService.isEmailTaken(email);
// //     if (exists) {
// //       throw new BadRequestException('User with this email already exists');
// //     }
// //     return email;
// //   }
// // }


// import {
//   PipeTransform,
//   Injectable,
//   BadRequestException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { UserService } from '../user.service';

// @Injectable()
// export class UserExistsPipe implements PipeTransform {
//   constructor(private readonly userService: UserService) {}

//   async transform(email: string) {
//     try {
//       const exists = await this.userService.isEmailTaken(email);
//       if (exists) {
//         throw new BadRequestException('User with this email already exists');
//       }
//       return email;
//     } catch (error) {
//       // If error is already an HTTP Exception, rethrow it
//       if (error instanceof BadRequestException) {
//         throw error;
//       }

//       // Otherwise, it's an unexpected internal error
//       throw new InternalServerErrorException('Something went wrong while checking user existence');
//     }
//   }
// }


import {
  PipeTransform,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(email: string) {
    try {
      const exists = await this.userService.isEmailTaken(email);
      if (exists) {
        throw new BadRequestException('User with this email already exists');
      }
      return email;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Something went wrong while checking user existence',
      );
    }
  }
}
