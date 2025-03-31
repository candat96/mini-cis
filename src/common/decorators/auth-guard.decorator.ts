import { AuthGuard } from '@common/guards/auth.guard';
import { RoleGuard } from '@common/guards/role.guard';
import { UserRole } from '@modules/database/enums/user-role.enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';

/**
 * Auth guard decorator
 * @param roles - User roles that are allowed to access the route
 * @returns Decorator
 */
export function AuthGuardDecorator(...roles: UserRole[]) {
  return applyDecorators(
    //Roles(roles),
    UseGuards(AuthGuard, RoleGuard),
  );
}
