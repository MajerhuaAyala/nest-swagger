import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserService } from '../user/user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserEntity } from '../user/user.entity';
import { validateHash } from '../../common/utils';
import {RoleType} from "../../common/constants/role-type";
import {Uuid} from "../../common/dto/abstract.dto";
import {TokenPayloadDto} from "./dto/token-payload.dto";
import {TokenType} from "../../common/constants/token-type";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async createAccessToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }


  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      email: userLoginDto.email,
    });

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new Error('User not found');
    }

    return user!;
  }
}
