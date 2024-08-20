import {UserServiceInterface} from "../../../../src/modules/user/interfaces/user-service.interface";
import {UserRegisterDto} from "../../../../src/modules/auth/dto/user-register.dto";
import {UserEntity} from "../../../../src/modules/user/user.entity";
import {FindOptionsWhere} from "typeorm";
import {RoleType} from "../../../../src/common/constants/role-type";
import {Uuid} from "../../../../src/common/dto/abstract.dto";

export class UserServiceMock implements UserServiceInterface {
  createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = {
      id: this.generateUuid(),
      firstName: "Juan",
      lastName: null,
      role: RoleType.USER,
      email: null,
      password: null,
      phone: null,
      avatar: null,
      fullName: "Juan",
    } as unknown as UserEntity;

    return Promise.resolve(user);
  }

  findOne(findDate: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    const user = {
      id: this.generateUuid(),
      firstName: "Juan",
      lastName: null,
      role: RoleType.USER,
      email: null,
      password: null,
      phone: null,
      avatar: null,
      fullName: "Juan",
    } as unknown as UserEntity;

    return Promise.resolve(user);
  }

  generateUuid = (): Uuid => {
    return '009bf1b3-bc35-437c-bc46-058b2ca81259' as Uuid;
  };

}