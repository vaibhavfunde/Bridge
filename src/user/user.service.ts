


import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
     private readonly jwtService: JwtService, // Ensure JwtService is imported and injected
  ) {}

  // Sign up a user
  async signup(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    // Check if email exists
    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Check if username exists
    const existingUsername = await this.userModel.findOne({ username });
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new this.userModel({
      email,
      username,
      password: hashedPassword,
       roles: ['user'],
    });

    // Save user to DB
    const savedUser = await newUser.save();

    return {
      message: 'User created successfully and logged in',
      user: {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
        roles: savedUser.roles,
      },
    };
  }

   async createAdmin(createUserDto: CreateUserDto) {
         const { email, username, password } = createUserDto;

    // Check if email exists
    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Check if username exists
    const existingUsername = await this.userModel.findOne({ username });
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new this.userModel({
      email,
      username,
      password: hashedPassword,
       roles: ['admin'],
    });

    // Save user to DB
    const savedUser = await newUser.save();
    return {
      message: 'Admin created successfully',
      user: {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
        roles: savedUser.roles,
      },
    };
   }







  async login(loginDto: LoginDto) {
  const { email, password } = loginDto;

  const user = await this.userModel.findOne({ email });
  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const token = this.generateTokens(user);

  // Update user document with access token and last login
  user.accessToken = token.accessToken;
  user.lastLogin = new Date();
  await user.save();

  const { password: _removedPassword, ...safeUser } = user.toObject();

  return {
    message: 'Login successful',
    user: safeUser,
    ...token,
  };
}
  

 async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }


  

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET || 'secret123',
      });

      const user = await this.userModel.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = this.generateTokens(user);
      return {
        message: 'Token refreshed successfully',
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }


    async isEmailTaken(email: string): Promise<boolean> {
  const user = await this.userModel.findOne({ email });
  return !!user;
}


  private generateTokens(user: User) {
    return {
      accessToken :this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    }
  }

  private generateAccessToken(user: User) :string{
        const payload = {
          id: user._id,
            email: user.email,
             roles: user.roles 
            };

    return this.jwtService.sign(payload, {
      expiresIn: '15m', // Access token expires in 15 minutes
      secret: process.env.JWT_SECRET || 'secret123'
    });

          
  }


   private generateRefreshToken(user: User) :string{
     const payload = {
          id: user._id,
           
            };

    return this.jwtService.sign(payload, {
      expiresIn: '15m', // Access token expires in 15 minutes
      secret: process.env.JWT_SECRET || 'secret123'
    });
  }


async getUserById(userId: number): Promise<User> {
  const user = await this.userModel
    .findById(userId)
    .select('-password'); // ⛔ exclude the password field

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  return user;
}


  
}
