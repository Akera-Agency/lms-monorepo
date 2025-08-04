import { Elysia } from 'elysia';
import { AppError } from '../Errors/AppError';
import { authGuard, AuthContext, ITokenPayload } from './auth.guard';
import { ROLES, hasRoleAccess } from '../constants/permissions';

// Extended context with role information
export interface RoleContext extends AuthContext {
  role: {
    currentRole: ROLES;
    hasRole: (role: ROLES) => boolean;
    hasAnyRole: (roles: ROLES[]) => boolean;
    hasAllRoles: (roles: ROLES[]) => boolean;
    hasMinimumRole: (minimumRole: ROLES) => boolean;
  };
}

// Helper function to get role from token
const getRoleFromToken = (user: ITokenPayload): ROLES => {
  // Check if user has a role in the token
  if (user.role && Object.values(ROLES).includes(user.role as ROLES)) {
    return user.role as ROLES;
  }

  // Check user_metadata for role
  if (
    user.user_metadata?.role &&
    Object.values(ROLES).includes(user.user_metadata.role as ROLES)
  ) {
    return user.user_metadata.role as ROLES;
  }

  // Default to STUDENT if no role is found
  return ROLES.STUDENT;
};

// Role guard factory
export const createRoleGuard = (requiredRole: ROLES) => {
  return new Elysia<string, AuthContext>()
    .use(authGuard)
    .derive({ as: 'global' }, (context) => {
      const { auth } = context;
      const userRole = getRoleFromToken(auth.user);

      // Check if user has the required role or higher
      if (!hasRoleAccess(userRole, requiredRole)) {
        throw new AppError(
          `Required role: ${requiredRole}, User role: ${userRole}`
        );
      }

      return {
        role: {
          currentRole: userRole,
          hasRole: (role: ROLES) => hasRoleAccess(userRole, role),
          hasAnyRole: (roles: ROLES[]) =>
            roles.some((role) => hasRoleAccess(userRole, role)),
          hasAllRoles: (roles: ROLES[]) =>
            roles.every((role) => hasRoleAccess(userRole, role)),
          hasMinimumRole: (minimumRole: ROLES) =>
            hasRoleAccess(userRole, minimumRole),
        },
      };
    });
};

// Multi-role guard factory
export const createMultiRoleGuard = (
  requiredRoles: ROLES[],
  requireAll: boolean = false
) => {
  return new Elysia<string, AuthContext>()
    .use(authGuard)
    .derive({ as: 'global' }, (context) => {
      const { auth } = context;
      const userRole = getRoleFromToken(auth.user);

      let hasAccess = false;

      if (requireAll) {
        // User must have ALL required roles
        hasAccess = requiredRoles.every((role) =>
          hasRoleAccess(userRole, role)
        );
      } else {
        // User must have ANY of the required roles
        hasAccess = requiredRoles.some((role) => hasRoleAccess(userRole, role));
      }

      if (!hasAccess) {
        const requirement = requireAll ? 'all' : 'any';
        throw new AppError(
          `Required ${requirement} of roles: ${requiredRoles.join(
            ', '
          )}, User role: ${userRole}`
        );
      }

      return {
        role: {
          currentRole: userRole,
          hasRole: (role: ROLES) => hasRoleAccess(userRole, role),
          hasAnyRole: (roles: ROLES[]) =>
            roles.some((role) => hasRoleAccess(userRole, role)),
          hasAllRoles: (roles: ROLES[]) =>
            roles.every((role) => hasRoleAccess(userRole, role)),
          hasMinimumRole: (minimumRole: ROLES) =>
            hasRoleAccess(userRole, minimumRole),
        },
      };
    });
};

// Flexible role guard that accepts any role
export const flexibleRoleGuard = new Elysia<string, AuthContext>()
  .use(authGuard)
  .derive({ as: 'global' }, (context) => {
    const { auth } = context;
    const userRole = getRoleFromToken(auth.user);

    return {
      role: {
        currentRole: userRole,
        hasRole: (role: ROLES) => hasRoleAccess(userRole, role),
        hasAnyRole: (roles: ROLES[]) =>
          roles.some((role) => hasRoleAccess(userRole, role)),
        hasAllRoles: (roles: ROLES[]) =>
          roles.every((role) => hasRoleAccess(userRole, role)),
        hasMinimumRole: (minimumRole: ROLES) =>
          hasRoleAccess(userRole, minimumRole),
      },
    };
  });
