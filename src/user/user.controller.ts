// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { LoginDto } from './dto/login-user.dto';


// @Controller('user')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post('signup')
//   async signup(@Body() createUserDto: CreateUserDto) {
//     return this.userService.signup(createUserDto);
//   }

//   @Post('login')
//   async login(@Body() loginUserDto: LoginDto) {
//     return this.userService.login(loginUserDto);
//   }
// }


import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { UserExistsPipe } from './pipes/user-exists.pipe';
import { UserNotFoundPipe } from './pipes/user-not-found.pipe';
// import { SignupResponseDto } from './dto/signup-response.dto';
// import { LoginResponseDto } from './dto/login-response.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED) // or use 201 directly
 
//   async signup(@Body() createUserDto: CreateUserDto): Promise<SignupResponseDto> {
//     return this.userService.signup(createUserDto);
//   }

 async signup(
    @Body('email', UserExistsPipe) email: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    return this.userService.signup(createUserDto);
  }

//   @Post('login')
//   @HttpCode(HttpStatus.OK) // 200
//   async login(@Body() loginUserDto: LoginDto): Promise<LoginResponseDto> {
//     return this.userService.login(loginUserDto);
//   }

@Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('email', UserNotFoundPipe) email: string,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    // Now email is already validated and confirmed to exist
    return this.userService.login(loginDto); // You can use loginDto.email
  }

  
}
