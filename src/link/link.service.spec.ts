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


// import { Test, TestingModule } from '@nestjs/testing';
// import { LinkService } from './link.service';
// import { getModelToken } from '@nestjs/mongoose';

// describe('LinkService', () => {
//   let service: LinkService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         LinkService,
//         {
//           provide: getModelToken('Link'),
//           useValue: {
//             // Provide mock methods as needed
//             find: jest.fn(),
//             findOne: jest.fn(),
//             create: jest.fn(),
//             // ... any other Mongoose model methods your service calls
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<LinkService>(LinkService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


// import { Test, TestingModule } from '@nestjs/testing';
// import { LinkService } from './link.service';
// import { getModelToken } from '@nestjs/mongoose';
// import { Link } from './schemas/link.schema';
// import { LinkAnalytics } from './schemas/analytics.schema';

// describe('LinkService', () => {
//   let service: LinkService;

//   const mockLinkModel = {
//     findOne: jest.fn(),
//     save: jest.fn(),
//     create: jest.fn(),
//   };

//   const mockAnalyticsModel = {
//     create: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         LinkService,
//         {
//           provide: getModelToken(Link.name),
//           useValue: mockLinkModel,
//         },
//         {
//           provide: getModelToken(LinkAnalytics.name),
//           useValue: mockAnalyticsModel,
//         },
//       ],
//     }).compile();

//     service = module.get<LinkService>(LinkService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


// import { CACHE_MANAGER } from '@nestjs/cache-manager';

// import { Test, TestingModule } from '@nestjs/testing';
// import { LinkService } from './link.service';
// import { getModelToken } from '@nestjs/mongoose';
// import { Link } from './schemas/link.schema';
// import { LinkAnalytics } from './schemas/analytics.schema';

// describe('LinkService', () => {
//   let service: LinkService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         LinkService,
//         {
//           provide: getModelToken(Link.name),
//           useValue: {}, // You can stub this further as needed
//         },
//         {
//           provide: getModelToken(LinkAnalytics.name),
//           useValue: {}, // Stub as needed
//         },
//         {
//           provide: CACHE_MANAGER,
//           useValue: {
//             get: jest.fn().mockResolvedValue(undefined),
//             set: jest.fn().mockResolvedValue(undefined),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<LinkService>(LinkService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


// import { Test, TestingModule } from '@nestjs/testing';
// import { LinkService } from './link.service';
// import { getModelToken } from '@nestjs/mongoose';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Link } from './schemas/link.schema';
// import { LinkAnalytics } from './schemas/analytics.schema';
// import { ConflictException, UnauthorizedException } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';

// describe('LinkService', () => {
//   let service: LinkService;

//   const mockLinkModel = {
//     findOne: jest.fn(),
//     create: jest.fn(),
//     save: jest.fn(),
//   };

//   const mockAnalyticsModel = {
//     create: jest.fn(),
//     find: jest.fn(),
//   };

//   const mockCache = {
//     get: jest.fn(),
//     set: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         LinkService,
//         {
//           provide: getModelToken(Link.name),
//           useValue: mockLinkModel,
//         },
//         {
//           provide: getModelToken(LinkAnalytics.name),
//           useValue: mockAnalyticsModel,
//         },
//         {
//           provide: CACHE_MANAGER,
//           useValue: mockCache,
//         },
//       ],
//     }).compile();

//     service = module.get<LinkService>(LinkService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('createLink', () => {
//     it('should throw ConflictException if shortcode exists', async () => {
//       mockLinkModel.findOne.mockResolvedValueOnce(true);

//       await expect(
//         service.createLink({ longUrl: 'http://test.com', customAlias: 'abc123' }, 'token'),
//       ).rejects.toThrow(ConflictException);
//     });

//     it('should create and return shortUrl if shortcode is new', async () => {
//       mockLinkModel.findOne.mockResolvedValueOnce(null);
//       mockLinkModel.create = jest.fn().mockResolvedValue({
//         shortCode: 'abc123',
//         expiresAt: new Date(),
//       });

//    //   jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user123' });
//    //  jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user123' });
//    jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user123' } as any);


//       const result = await service.createLink(
//         { longUrl: 'http://test.com', customAlias: 'abc123' },
//         'validToken',
//       );

//       expect(result.shortUrl).toContain('/links/shortcode/abc123');
//     });

//     it('should throw UnauthorizedException for invalid token', async () => {
//       jest.spyOn(jwt, 'verify').mockImplementation(() => {
//         throw new Error('Invalid');
//       });

//       mockLinkModel.findOne.mockResolvedValueOnce(null);

//       await expect(
//         service.createLink({ longUrl: 'http://test.com', customAlias: 'uniqueCode' }, 'badtoken'),
//       ).rejects.toThrow(UnauthorizedException);
//     });
//   });

//   describe('handleRedirectAnalytics', () => {
//     it('should return longUrl from cache if exists', async () => {
//       mockCache.get.mockResolvedValueOnce({ longUrl: 'http://cached.com', _id: '123' });

//       const req = {
//         headers: {
//           'user-agent': 'Mozilla',
//           referer: 'http://google.com',
//           'x-forwarded-for': '127.0.0.1',
//         },
//         ip: '::1',
//       } as any;

//       mockAnalyticsModel.create.mockResolvedValueOnce({});

//       const url = await service.handleRedirectAnalytics('abc123', req);
//       expect(url).toBe('http://cached.com');
//     });

//     it('should return longUrl from DB if not in cache', async () => {
//       mockCache.get.mockResolvedValueOnce(null);
//       mockLinkModel.findOne.mockResolvedValueOnce({
//         longUrl: 'http://fromdb.com',
//         _id: '456',
//       });

//       const req = {
//         headers: {
//           'user-agent': 'Mozilla',
//           referer: '',
//         },
//         ip: '::1',
//       } as any;

//       const url = await service.handleRedirectAnalytics('abc123', req);
//       expect(url).toBe('http://fromdb.com');
//       expect(mockCache.set).toHaveBeenCalled();
//     });
//   });
// });


// import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// import { LinkService } from './link.service';
// import { Link } from './schemas/link.schema';
// import { Model } from 'mongoose';

// const mockLinkModel = {
//   findOne: jest.fn(),
//   create: jest.fn(),
//   findByIdAndUpdate: jest.fn(),
// };

// describe('LinkService', () => {
//   let service: LinkService;
//   let model: Model<Link>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         LinkService,
//         {
//           provide: getModelToken('Link'),
//           useValue: mockLinkModel,
//         },
//       ],
//     }).compile();

//     service = module.get<LinkService>(LinkService);
//     model = module.get<Model<Link>>(getModelToken('Link'));
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('createLink', () => {
//     it('should create and return shortUrl if shortcode is new', async () => {
//       const dto = {
//         longUrl: 'https://example.com',
//         customAlias: 'testAlias',
//         expiresAt: '2025-12-31',
//       };

//       const savedLink = {
//         _id: '1',
//         shortCode: 'testAlias',
//         longUrl: dto.longUrl,
//         createdAt: new Date(),
//         createdBy: 'user123',
//         expiresAt: new Date(dto.expiresAt),
//         toObject: () => this,
//       };

//       mockLinkModel.findOne.mockResolvedValue(null); // shortCode is not in use
//       mockLinkModel.create.mockResolvedValue(savedLink);

//       const result = await service.createLink(dto as any, 'user123');

//       expect(mockLinkModel.findOne).toHaveBeenCalledWith({ shortCode: 'testAlias' });
//       expect(mockLinkModel.create).toHaveBeenCalled();
//       expect(result.shortCode).toEqual('testAlias');
//     });
//   });
// });


// import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// import { LinkService } from './link.service';
// import { Link } from './schemas/link.schema';
// import { LinkAnalytics } from './schemas/analytics.schema';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Model } from 'mongoose';

// const mockLinkModel = {
//   findOne: jest.fn(),
//   create: jest.fn(),
//   save: jest.fn(),
// };

// const mockAnalyticsModel = {
//   create: jest.fn(),
// };

// const mockCacheManager = {
//   get: jest.fn(),
//   set: jest.fn(),
// };

// describe('LinkService', () => {
//   let service: LinkService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         LinkService,
//         {
//           provide: getModelToken(Link.name),
//           useValue: mockLinkModel,
//         },
//         {
//           provide: getModelToken(LinkAnalytics.name),
//           useValue: mockAnalyticsModel,
//         },
//         {
//           provide: CACHE_MANAGER,
//           useValue: mockCacheManager,
//         },
//       ],
//     }).compile();

//     service = module.get<LinkService>(LinkService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('createLink', () => {
//     it('should create and return shortUrl if shortcode is new', async () => {
//       const dto = {
//         longUrl: 'https://example.com',
//         customAlias: 'testAlias',
//         expiresAt: '2025-12-31',
//       };

//       const savedLink = {
//         _id: '1',
//         shortCode: 'testAlias',
//         longUrl: dto.longUrl,
//         createdAt: new Date(),
//         createdBy: 'user123',
//         expiresAt: new Date(dto.expiresAt),
//         toObject: () => this,
//       };

//       mockLinkModel.findOne.mockResolvedValue(null);
//       mockLinkModel.create.mockResolvedValue(savedLink);

//       const result = await service.createLink(dto as any, 'user123');

//       expect(mockLinkModel.findOne).toHaveBeenCalledWith({ shortCode: 'testAlias' });
//       expect(mockLinkModel.create).toHaveBeenCalled();
//       expect(result.shortUrl).toContain('testAlias');
//     });
//   });
// });



import { Test, TestingModule } from '@nestjs/testing';
import { LinkService } from './link.service';
import { getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

describe('LinkService', () => {
  let service: LinkService;

  const mockLinkModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAnalyticsModel = {
    create: jest.fn(),
    find: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkService,
        { provide: getModelToken('Link'), useValue: mockLinkModel },
        { provide: getModelToken('LinkAnalytics'), useValue: mockAnalyticsModel },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<LinkService>(LinkService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return shortUrl if shortcode is new', async () => {
    // ✅ Mock jwt.verify
//    jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'test-user-id' });

//jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'test-user-id' });
    jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'test-user-id' } as any);


    const createLinkDto = {
      longUrl: 'https://example.com',
      customAlias: 'test123',
    };

    mockLinkModel.findOne.mockResolvedValue(null);
    mockLinkModel.create.mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ ...data, expiresAt: new Date() }),
    }));

    const result = await service.createLink(createLinkDto, 'mock-token');

    expect(result.shortUrl).toContain('/links/shortcode/test123');
    expect(result.message).toBe('Short URL created successfully');
  });
});



