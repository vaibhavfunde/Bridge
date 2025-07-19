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


import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {}, // your mock model or leave empty for now
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockedToken'), // mock JWT behavior
            verify: jest.fn(() => ({ id: 'mockId' })),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
