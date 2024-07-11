import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role_User } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const role = this.reflector.getAllAndOverride<Role_User>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!role) return true
    const { user } = context.switchToHttp().getRequest()

    if (user.role === Role_User.ADMIN) return true

    return role === user.role
  }
}
