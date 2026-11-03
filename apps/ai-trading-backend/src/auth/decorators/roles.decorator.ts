import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../users/entities/user.entity.js';


export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserType[]) =>
    SetMetadata(ROLES_KEY, roles);