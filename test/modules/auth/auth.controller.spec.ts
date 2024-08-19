import { AuthService } from '../../../src/modules/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../../../src/modules/user/user.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../src/modules/user/user.entity';
import { forwardRef } from '@nestjs/common';
import { UserService } from '../../../src/modules/user/user.service';
import { TokenPayloadDto } from '../../../src/modules/auth/dto/token-payload.dto';

const mockUserService = {
  findOne: jest.fn().mockResolvedValue({ id: 1, username: 'userTest' }),
};

const MockUserModule = {
  module: class MockUserModule {},
  providers: [
    {
      provide: UserService,
      useValue: mockUserService,
    },
    {
      provide: getRepositoryToken(UserEntity),
      useValue: {
        findOne: jest.fn().mockResolvedValue({ id: 1, username: 'userTest' }),
      },
    },
  ],
  exports: [UserService],
};

describe('AuthController', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        forwardRef(() => MockUserModule),
        JwtModule.registerAsync({
          useFactory: () => ({
            privateKey: 'privateKey',
            publicKey: 'publicKey',
            signOptions: {
              algorithm: 'RS256',
            },
            verifyOptions: {
              algorithms: ['RS256'],
            },
          }),
        }),
      ],
      providers: [
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockReturnValue('mockToken'),
            verify: jest.fn().mockReturnValue({ userId: 1 }),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue({ id: 1, username: 'userTest' }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            createAccessToken: jest.fn().mockReturnValue(
              new TokenPayloadDto({
                expiresIn: 3600,
                accessToken: '',
              }),
            ),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
