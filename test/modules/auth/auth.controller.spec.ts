import {AuthService} from '../../../src/modules/auth/auth.service';
import {Test, TestingModule} from '@nestjs/testing';
import {JwtModule, JwtService} from '@nestjs/jwt';
import {getRepositoryToken} from '@nestjs/typeorm';
import {UserEntity} from '../../../src/modules/user/user.entity';
import {forwardRef} from '@nestjs/common';
import {UserService} from '../../../src/modules/user/user.service';
import {AuthServiceMock} from "./__mock__/auth-service-mock";
import {RoleType} from "../../../src/common/constants/role-type";
import {Uuid} from "../../../src/common/dto/abstract.dto";
import {UserServiceMock} from "../user/__mock__/user-service.mock";
import {AuthController} from "../../../src/modules/auth/auth.controller";
import {TokenPayloadDto} from "../../../src/modules/auth/dto/token-payload.dto";
import {UserLoginDto} from "../../../src/modules/auth/dto/user-login.dto";

const MockUserModule = {
  module: class MockUserModule {
  },
  providers: [
    {
      provide: UserService,
      useClass: UserServiceMock,
    },
    {
      provide: getRepositoryToken(UserEntity),
      useValue: {
        findOne: jest.fn().mockResolvedValue({id: 1, username: 'userTest'}),
      },
    },
  ],
  exports: [UserService],
};

const generateUuid = (): Uuid => {
  return '009bf1b3-bc35-437c-bc46-058b2ca81259' as Uuid;
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
            signAsync: jest.fn().mockReturnValue('mockToken')
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue({id: 1, username: 'userTest'}),
          },
        },
        {
          provide: AuthService,
          useClass: AuthServiceMock
        },
      ],
      controllers: [AuthController]
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });


  it("should be create to a new token", async () => {
    const result = await authService.createAccessToken({
      role: RoleType.USER,
      userId: generateUuid()
    })

    expect(result).toBeInstanceOf(TokenPayloadDto)
    expect(result.accessToken).toBe('mockToken')
    expect(result.expiresIn).toBe(3600)
  })

  it("should be validate user", async () => {

    const userLogin = {
      password: "123@123",
      email: "test@gmail.com"
    } as unknown as UserLoginDto

    const result = await authService.validateUser(userLogin)
    expect(result).toBeInstanceOf(UserEntity)
    expect(result.firstName).toBe("marcelino")
  })
  describe("test", () => {
    it("should be validate user and password is bad", async () => {
      const userLogin = {
        password: "123@12312",
        email: "test@gmail.com"
      } as unknown as UserLoginDto
      await expect(authService.validateUser(userLogin)).rejects.toMatchObject({message: "User not found"})
    })
  })
});

