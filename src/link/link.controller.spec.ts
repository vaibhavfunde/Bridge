// import { Test, TestingModule } from '@nestjs/testing';
// import { LinkController } from './link.controller';

// describe('LinkController', () => {
//   let controller: LinkController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [LinkController],
//     }).compile();

//     controller = module.get<LinkController>(LinkController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });


// import { Test, TestingModule } from '@nestjs/testing';
// import { LinkController } from './link.controller';
// import { LinkService } from './link.service';


// describe('LinkController', () => {
//   let controller: LinkController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [LinkController],
//       providers: [
//         {
//           provide: LinkService,
//           useValue: {
//             // mock methods used in controller
//             create: jest.fn(),
//             findAll: jest.fn(),
//             // etc.
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<LinkController>(LinkController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });

// link.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { Request } from 'express';

describe('LinkController', () => {
  let controller: LinkController;
  let service: LinkService;

  const mockLinkService = {
    createLink: jest.fn(),
    handleRedirectAnalytics: jest.fn(),
    getLinkStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkController],
      providers: [
        {
          provide: LinkService,
          useValue: mockLinkService,
        },
      ],
    }).compile();

    controller = module.get<LinkController>(LinkController);
    service = module.get<LinkService>(LinkService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createLink', () => {
    it('should call createLink with token and dto', async () => {
      const dto: CreateLinkDto = {
        longUrl: 'https://example.com',
        customAlias: 'example',
        expiresAt: new Date().toISOString(),
      };
      const mockToken = 'abc123';
      const mockResult = { shortUrl: 'https://short.ly/example' };

      mockLinkService.createLink.mockResolvedValue(mockResult);

      const result = await controller.createLink(dto, `Bearer ${mockToken}`);
      expect(result).toEqual(mockResult);
      expect(service.createLink).toHaveBeenCalledWith(dto, mockToken);
    });
  });

  describe('getLink', () => {
    it('should call handleRedirectAnalytics with shortCode and request', async () => {
      const mockReq = {} as Request;
      const shortCode = 'abc123';
      const mockResult = { longUrl: 'https://example.com' };

      mockLinkService.handleRedirectAnalytics.mockResolvedValue(mockResult);

      const result = await controller.getLink(shortCode, mockReq);
      expect(result).toEqual(mockResult);
      expect(service.handleRedirectAnalytics).toHaveBeenCalledWith(shortCode, mockReq);
    });
  });

  describe('getLinkStats', () => {
    it('should call getLinkStats with shortCode and token', async () => {
      const shortCode = 'abc123';
      const mockToken = 'xyz789';
      const mockStats = { visits: 10 };

      mockLinkService.getLinkStats.mockResolvedValue(mockStats);

      const result = await controller.getLinkStats(shortCode, `Bearer ${mockToken}`);
      expect(result).toEqual(mockStats);
      expect(service.getLinkStats).toHaveBeenCalledWith(shortCode, mockToken);
    });
  });
});



