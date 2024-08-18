import {CanActivate, ExecutionContext} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

import type {UserEntity} from '../modules/user/user.entity';
import {RoleType} from "../common/constants/role-type";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleType[] | undefined>(
      'roles',
      context.getHandler(),
    );
    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: UserEntity }>();
    const user = request.user;

    return roles.includes(user.role);
  }
}
