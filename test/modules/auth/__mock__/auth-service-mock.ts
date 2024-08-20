import {AuthServiceInterface} from "../../../../src/modules/auth/interfaces/auth-service.interface";
import {RoleType} from "../../../../src/common/constants/role-type";
import {Uuid} from "../../../../src/common/dto/abstract.dto";
import {TokenPayloadDto} from "../../../../src/modules/auth/dto/token-payload.dto";
import {UserLoginDto} from "../../../../src/modules/auth/dto/user-login.dto";
import {UserEntity} from "../../../../src/modules/user/user.entity";

export class AuthServiceMock implements AuthServiceInterface {
  async createAccessToken(data: { role: RoleType; userId: Uuid }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: 3600,
      accessToken: "mockToken"
    })
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    if (userLoginDto.password === "123@123" && userLoginDto.email === "test@gmail.com") {
      const userResponse = new UserEntity()
      userResponse.firstName = 'marcelino'
      return Promise.resolve(userResponse)
    } else {
      throw new Error("User not found")
    }
  }
}