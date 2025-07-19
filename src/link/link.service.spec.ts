// import { Test, TestingModule } from '@nestjs/testing';
// import { LinkService } from './link.service';

// describe('LinkService', () => {
//   let service: LinkService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [LinkService],
//     }).compile();

//     service = module.get<LinkService>(LinkService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


import { Test, TestingModule } from '@nestjs/testing';
import { LinkService } from './link.service';
import { getModelToken } from '@nestjs/mongoose';

describe('LinkService', () => {
  let service: LinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkService,
        {
          provide: getModelToken('Link'),
          useValue: {
            // Provide mock methods as needed
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            // ... any other Mongoose model methods your service calls
          },
        },
      ],
    }).compile();

    service = module.get<LinkService>(LinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
