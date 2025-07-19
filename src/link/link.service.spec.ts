

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



