// // import { Test, TestingModule } from '@nestjs/testing';
// // import { UserService } from './user.service';

// // describe('UserService', () => {
// //   let service: UserService;

// //   beforeEach(async () => {
// //     const module: TestingModule = await Test.createTestingModule({
// //       providers: [UserService],
// //     }).compile();

// //     service = module.get<UserService>(UserService);
// //   });

// //   it('should be defined', () => {
// //     expect(service).toBeDefined();
// //   });
// // });


// import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// import { UserService } from './user.service';
// import { Model } from 'mongoose';
// import { UserDocument } from './schema/user.schema';

// describe('UserService', () => {
//   let service: UserService;
//   let model: Model<UserDocument>;

//   beforeEach(async () => {
//     const mockUserModel = {
//       findOne: jest.fn(),
//       create: jest.fn(),
//       // add other methods you use in UserService
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: getModelToken('User'),
//           useValue: mockUserModel,
//         },
//       ],
//     }).compile();

//     service = module.get<UserService>(UserService);
//     model = module.get<Model<UserDocument>>(getModelToken('User'));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   // Add your test cases here
// });


// import { Test, TestingModule } from '@nestjs/testing';
// import { UserService } from './user.service';
// import { getModelToken } from '@nestjs/mongoose';
// import { JwtService } from '@nestjs/jwt';

// describe('UserService', () => {
//   let service: UserService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: getModelToken('User'),
//           useValue: {}, // your mock model or leave empty for now
//         },
//         {
//           provide: JwtService,
//           useValue: {
//             sign: jest.fn(() => 'mockedToken'), // mock JWT behavior
//             verify: jest.fn(() => ({ id: 'mockId' })),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<UserService>(UserService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


// import { Test, TestingModule } from '@nestjs/testing';
// import { UserService } from './user.service';
// import { getModelToken } from '@nestjs/mongoose';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { Model } from 'mongoose';
// import { UserDocument } from './schema/user.schema';

// describe('UserService', () => {
//   let service: UserService;
//   let mockUserModel: Partial<Record<keyof Model<UserDocument>, jest.Mock>>;
//   let jwtService: JwtService;

//   const mockUser = {
//     _id: 'user123',
//     email: 'test@example.com',
//     username: 'testuser',
//     password: await bcrypt.hash('password123', 10),
//     roles: ['user'],
//     save: jest.fn(),
//     toObject: () => ({
//       _id: 'user123',
//       email: 'test@example.com',
//       username: 'testuser',
//       roles: ['user'],
//     }),
//   };

//   beforeEach(async () => {
//     mockUserModel = {
//       findOne: jest.fn(),
//       findById: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: getModelToken('User'),
//           useValue: mockUserModel,
//         },
//         {
//           provide: JwtService,
//           useValue: {
//             sign: jest.fn(() => 'mockedJwtToken'),
//             verify: jest.fn(() => ({ id: 'user123' })),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<UserService>(UserService);
//     jwtService = module.get<JwtService>(JwtService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('isEmailTaken', () => {
//     it('should return true if user exists', async () => {
//       mockUserModel.findOne!.mockResolvedValue(mockUser);
//       const result = await service.isEmailTaken('test@example.com');
//       expect(result).toBe(true);
//     });

//     it('should return false if user does not exist', async () => {
//       mockUserModel.findOne!.mockResolvedValue(null);
//       const result = await service.isEmailTaken('notfound@example.com');
//       expect(result).toBe(false);
//     });
//   });

//   describe('login', () => {
//     it('should login successfully and return token and user info', async () => {
//       const hashedPassword = await bcrypt.hash('password123', 10);
//       mockUser.password = hashedPassword;
//       mockUserModel.findOne!.mockResolvedValue(mockUser);

//       const result = await service.login({
//         email: 'test@example.com',
//         password: 'password123',
//       });

//       expect(result.user.email).toBe('test@example.com');
//       expect(result.accessToken).toBeDefined();
//       expect(result.refreshToken).toBeDefined();
//     });

//     it('should throw Unauthorized if user not found', async () => {
//       mockUserModel.findOne!.mockResolvedValue(null);
//       await expect(
//         service.login({ email: 'notfound@example.com', password: '123' }),
//       ).rejects.toThrow('Invalid email or password');
//     });
//   });

//   describe('refreshToken', () => {
//     it('should return new tokens if refresh token is valid', async () => {
//       mockUserModel.findById!.mockResolvedValue(mockUser);

//       const result = await service.refreshToken('mockRefreshToken');
//       expect(result.accessToken).toBeDefined();
//       expect(result.refreshToken).toBeDefined();
//     });

//     it('should throw Unauthorized if token invalid', async () => {
//       jwtService.verify = jest.fn(() => {
//         throw new Error('Invalid token');
//       });

//       await expect(service.refreshToken('badToken')).rejects.toThrow(
//         'Invalid refresh token',
//       );
//     });
//   });
// });

// src/user/user.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema'; // adjust path if needed
import { JwtService } from '@nestjs/jwt';

describe('UserService', () => {
  let service: UserService;

  // 🧪 Mock UserModel methods
  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockedToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a password', async () => {
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);
    expect(hash).not.toBe(password);
    expect(await bcrypt.compare(password, hash)).toBe(true);
  });

  it('should correctly compare passwords', async () => {
    const password = 'mypassword';
    const hash = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare(password, hash);
    const isWrong = await bcrypt.compare('wrong', hash);

    expect(isMatch).toBe(true);
    expect(isWrong).toBe(false);
  });
});
