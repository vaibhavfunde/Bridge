import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Username must be a string' })
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
  readonly username: string;

  @IsEmail({}, { message: 'Please enter a valid email' })
  readonly email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;
}
