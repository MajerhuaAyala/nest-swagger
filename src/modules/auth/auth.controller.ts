import {Body, Controller, Get, HttpCode, HttpStatus, Post, Version} from '@nestjs/common';
import {ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {UserDto} from '../user/dto/user.dto';
import {UserRegisterDto} from './dto/user-register.dto';
import {UserService} from '../user/user.service';
import {LoginPayloadDto} from './dto/login-payload.dto';
import {UserLoginDto} from './dto/user-login.dto';
import {AuthService} from "./auth.service";
import {Auth} from "../../decorators/http.decorators";
import {RoleType} from "../../common/constants/role-type";
import {AuthUser} from "../../decorators/auth-user.decorator";
import {UserEntity} from "../user/user.entity";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto)

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: userEntity.role
    })

    return new LoginPayloadDto(userEntity.toDto(), token)
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: UserDto, description: 'Successfully Registered'})
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(userRegisterDto);
    return createdUser.toDto({
      isActive: true,
    });
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({type: UserDto, description: 'current user info'})
  async getCurrentUser(@AuthUser() user: UserEntity): Promise<UserDto> {
    return user.toDto()
  }
}
