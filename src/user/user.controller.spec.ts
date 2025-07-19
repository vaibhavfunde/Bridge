


// import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { getModelToken } from '@nestjs/mongoose';
// import { JwtService } from '@nestjs/jwt';

// describe('UserController', () => {
//   let controller: UserController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         UserService,
//         {
//           provide: getModelToken('User'),
//           useValue: {}, // minimal mock or actual mock functions
//         },
//         {
//           provide: JwtService,
//           useValue: {
//             sign: jest.fn(() => 'mockToken'),
//             verify: jest.fn(() => ({ id: 'mockUserId' })),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<UserController>(UserController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });



import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getModelToken('User'),
          useValue: {}, // mock model
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockToken'),
            verify: jest.fn(() => ({ id: 'mockUserId' })),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup()', () => {
    it('should return created user data', async () => {
     const dto: CreateUserDto = {
  username: 'testuser',
  email: 'test@example.com',
  password: '123456',
};


      const result = { message: 'User created', user: dto };
      mockUserService.signup.mockResolvedValue(result);

      const response = await controller.signup(dto.email, dto);

      expect(response).toEqual(result);
      expect(mockUserService.signup).toHaveBeenCalledWith(dto);
    });
  });

  describe('login()', () => {
    it('should return login token', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = { access_token: 'mockToken' };
      mockUserService.login.mockResolvedValue(result);

      const response = await controller.login(dto.email, dto);

      expect(response).toEqual(result);
      expect(mockUserService.login).toHaveBeenCalledWith(dto);
    });
  });
});
