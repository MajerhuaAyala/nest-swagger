import {UserEntity} from "../user.entity";
import {UserRegisterDto} from "../../auth/dto/user-register.dto";
import {FindOptionsWhere} from "typeorm";

export interface UserServiceInterface {
  createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity>;

  findOne(findDate: FindOptionsWhere<UserEntity>): Promise<UserEntity>;
}