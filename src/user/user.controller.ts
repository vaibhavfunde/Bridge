


import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { UserExistsPipe } from './pipes/user-exists.pipe';
import { UserNotFoundPipe } from './pipes/user-not-found.pipe';
import { Throttle } from '@nestjs/throttler';




@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED) // or use 201 directly
 


 async signup(
    @Body('email', UserExistsPipe) email: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    return this.userService.signup(createUserDto);
  }



@Post('login')
  @HttpCode(HttpStatus.OK)



  async login(
    @Body('email', UserNotFoundPipe) email: string,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
   
    return this.userService.login(loginDto); 
  }


}
