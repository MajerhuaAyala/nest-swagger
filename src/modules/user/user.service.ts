import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import {UserServiceInterface} from "./interfaces/user-service.interface";

@Injectable()
export class UserService implements UserServiceInterface{
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  @Transactional()
  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);

    await this.userRepository.save(user);

    return user;
  }

  async findOne(
    findData: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }
}
