// // import { Test, TestingModule } from '@nestjs/testing';
// // import { UserController } from './user.controller';

// // describe('UserController', () => {
// //   let controller: UserController;

// //   beforeEach(async () => {
// //     const module: TestingModule = await Test.createTestingModule({
// //       controllers: [UserController],
// //     }).compile();

// //     controller = module.get<UserController>(UserController);
// //   });

// //   it('should be defined', () => {
// //     expect(controller).toBeDefined();
// //   });
// // });


// // import { Test, TestingModule } from '@nestjs/testing';
// // import { UserController } from './user.controller';
// // import { UserService } from './user.service';
// // import { UserExistsPipe } from './pipes/user-exists.pipe';
// // import { UserNotFoundPipe } from './pipes/user-not-found.pipe';

// // describe('UserController', () => {
// //   let controller: UserController;

// //   beforeEach(async () => {
// //     const module: TestingModule = await Test.createTestingModule({
// //       controllers: [UserController],
// //       providers: [
// //         UserService,
// //         UserExistsPipe,
// //         UserNotFoundPipe,
// //       ],
// //     }).compile();

// //     controller = module.get<UserController>(UserController);
// //   });

// //   it('should be defined', () => {
// //     expect(controller).toBeDefined();
// //   });
// // });


// import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { getModelToken } from '@nestjs/mongoose';

// describe('UserController', () => {
//   let controller: UserController;

//   beforeEach(async () => {
//     const mockUserModel = {
//       findOne: jest.fn(),
//       create: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         UserService,
//         {
//           provide: getModelToken('User'),
//           useValue: mockUserModel,
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

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {}, // minimal mock or actual mock functions
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

