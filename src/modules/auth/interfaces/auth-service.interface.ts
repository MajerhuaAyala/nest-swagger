import { RoleType } from '../../../common/constants/role-type';
import { Uuid } from '../../../common/dto/abstract.dto';
import { TokenPayloadDto } from '../dto/token-payload.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserEntity } from '../../user/user.entity';

export interface AuthServiceInterface {
  createAccessToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDto>;

  validateUser(userLoginDto: UserLoginDto): Promise<UserEntity>;
}
