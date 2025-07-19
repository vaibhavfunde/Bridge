

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
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
