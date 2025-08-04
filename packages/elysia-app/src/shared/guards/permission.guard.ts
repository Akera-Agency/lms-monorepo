import { Elysia } from 'elysia';
import { AppError } from '../Errors/AppError';
import {
  BasePermission,
  ROLES,
  hasRolePermission,
  getAllRolePermissions,
} from '../constants/permissions';
import { IDb } from 'src/database/types/IDb';
import { AuthContext } from './auth.guard';
import { RoleContext, createRoleGuard } from './role.guard';
import { TContext } from '../types/context';

// Extended context with permission information
export interface PermissionContext extends RoleContext {
  permissions: {
    checkPermission: (
      entity: keyof IDb,
      permission: BasePermission
    ) => Promise<boolean>;
    requirePermission: (
      entity: keyof IDb,
      permission: BasePermission
    ) => Promise<void>;
    canManageEntity: (entity: keyof IDb) => Promise<boolean>;
    getUserId: () => string;
    getRolePermissions: () => Record<keyof IDb, BasePermission[]>;
    checkRolePermission: (
      entity: keyof IDb,
      permission: BasePermission
    ) => boolean;
  };
}

// Permission check interface
export interface PermissionCheck {
  entity: keyof IDb;
  permission: BasePermission;
}

// Helper function to get user ID from auth context
const getUserIdFromAuth = (auth: AuthContext['auth']): string => {
  return auth.user.sub; // Use the 'sub' field from JWT as user ID
};

// Permission guard factory
export const createPermissionGuard = (checks: PermissionCheck[]) => {
  return new Elysia<string, RoleContext>().derive(
    { as: 'global' },
    async (context) => {
      const { auth, role, store } = context as unknown as TContext &
        RoleContext;

      const userId = getUserIdFromAuth(auth);

      // Helper function to check permissions
      const checkPermission = async (
        entity: keyof IDb,
        permission: BasePermission
      ): Promise<boolean> => {
        if (!userId) {
          return false;
        }

        // First check if user has admin role (bypass permission checks)
        if (role.hasRole(ROLES.ADMIN)) {
          return true;
        }

        // Check with the RoleService for database-based permissions
        return await store.RoleService.hasPermission(
          userId,
          entity,
          permission
        );
      };

      // Helper function to require permissions (throws if not authorized)
      const requirePermission = async (
        entity: keyof IDb,
        permission: BasePermission
      ): Promise<void> => {
        const hasPermission = await checkPermission(entity, permission);
        if (!hasPermission) {
          throw new AppError(
            `Insufficient permissions: ${permission} on ${entity}`
          );
        }
      };

      // Helper function to check if user can manage a specific entity
      const canManageEntity = async (entity: keyof IDb): Promise<boolean> => {
        if (!userId) {
          return false;
        }

        // Admin can manage all entities
        if (role.hasRole(ROLES.ADMIN)) {
          return true;
        }

        return await store.RoleService.hasPermission(userId, entity, 'manage');
      };

      // Helper function to get role-based permissions
      const getRolePermissions = (): Record<keyof IDb, BasePermission[]> => {
        return getAllRolePermissions(role.currentRole);
      };

      // Helper function to check role-based permissions
      const checkRolePermission = (
        entity: keyof IDb,
        permission: BasePermission
      ): boolean => {
        return hasRolePermission(role.currentRole, entity, permission);
      };

      // Check all required permissions
      for (const check of checks) {
        await requirePermission(check.entity, check.permission);
      }

      return {
        permissions: {
          checkPermission,
          requirePermission,
          canManageEntity,
          getUserId: () => userId,
          getRolePermissions,
          checkRolePermission,
        },
      };
    }
  );
};

// Any permission guard factory (user must have ANY of the specified permissions)
export const createAnyPermissionGuard = (checks: PermissionCheck[]) => {
  return new Elysia<string, RoleContext>().derive(
    { as: 'global' },
    async (context) => {
      const { auth, role, store } = context as unknown as TContext &
        RoleContext;

      const userId = getUserIdFromAuth(auth);

      // Helper function to check permissions
      const checkPermission = async (
        entity: keyof IDb,
        permission: BasePermission
      ): Promise<boolean> => {
        if (!userId) {
          return false;
        }

        // First check if user has admin role (bypass permission checks)
        if (role.hasRole(ROLES.ADMIN)) {
          return true;
        }

        // Check with the RoleService
        return await store.RoleService.hasPermission(
          userId,
          entity,
          permission
        );
      };

      // Helper function to require permissions (throws if not authorized)
      const requirePermission = async (
        entity: keyof IDb,
        permission: BasePermission
      ): Promise<void> => {
        const hasPermission = await checkPermission(entity, permission);
        if (!hasPermission) {
          throw new AppError(
            `Insufficient permissions: ${permission} on ${entity}`
          );
        }
      };

      // Helper function to check if user can manage a specific entity
      const canManageEntity = async (entity: keyof IDb): Promise<boolean> => {
        if (!userId) {
          return false;
        }

        if (role.hasRole(ROLES.ADMIN)) {
          return true;
        }

        return await store.RoleService.hasPermission(userId, entity, 'manage');
      };

      // Helper function to get role-based permissions
      const getRolePermissions = (): Record<keyof IDb, BasePermission[]> => {
        return getAllRolePermissions(role.currentRole);
      };

      // Helper function to check role-based permissions
      const checkRolePermission = (
        entity: keyof IDb,
        permission: BasePermission
      ): boolean => {
        return hasRolePermission(role.currentRole, entity, permission);
      };

      // Check if user has ANY of the required permissions
      let hasAnyPermission = false;

      for (const check of checks) {
        const hasPermission = await checkPermission(
          check.entity,
          check.permission
        );
        if (hasPermission) {
          hasAnyPermission = true;
          break;
        }
      }

      if (!hasAnyPermission) {
        throw new AppError(
          `User does not have any of the required permissions`
        );
      }

      return {
        permissions: {
          checkPermission,
          requirePermission,
          canManageEntity,
          getUserId: () => userId,
          getRolePermissions,
          checkRolePermission,
        },
      };
    }
  );
};

// Flexible permission guard (provides permission utilities without requiring specific permissions)
export const flexiblePermissionGuard = new Elysia<string, RoleContext>().derive(
  { as: 'global' },
  async (context) => {
    const { auth, role, store } = context as unknown as TContext & RoleContext;

    const userId = getUserIdFromAuth(auth);

    // Helper function to check permissions
    const checkPermission = async (
      entity: keyof IDb,
      permission: BasePermission
    ): Promise<boolean> => {
      if (!userId) {
        return false;
      }

      // First check if user has admin role (bypass permission checks)
      if (role.hasRole(ROLES.ADMIN)) {
        return true;
      }

      // Check with the RoleService
      return await store.RoleService.hasPermission(userId, entity, permission);
    };

    // Helper function to require permissions (throws if not authorized)
    const requirePermission = async (
      entity: keyof IDb,
      permission: BasePermission
    ): Promise<void> => {
      const hasPermission = await checkPermission(entity, permission);
      if (!hasPermission) {
        throw new AppError(
          `Insufficient permissions: ${permission} on ${entity}`
        );
      }
    };

    // Helper function to check if user can manage a specific entity
    const canManageEntity = async (entity: keyof IDb): Promise<boolean> => {
      if (!userId) {
        return false;
      }

      if (role.hasRole(ROLES.ADMIN)) {
        return true;
      }

      return await store.RoleService.hasPermission(userId, entity, 'manage');
    };

    // Helper function to get role-based permissions
    const getRolePermissions = (): Record<keyof IDb, BasePermission[]> => {
      return getAllRolePermissions(role.currentRole);
    };

    // Helper function to check role-based permissions
    const checkRolePermission = (
      entity: keyof IDb,
      permission: BasePermission
    ): boolean => {
      return hasRolePermission(role.currentRole, entity, permission);
    };

    return {
      permissions: {
        checkPermission,
        requirePermission,
        canManageEntity,
        getUserId: () => userId,
        getRolePermissions,
        checkRolePermission,
      },
    };
  }
);

// Combined role and permission guard factory
export const createRolePermissionGuard = (
  requiredRole: ROLES,
  permissions?: PermissionCheck[]
) => {
  const guards: any[] = [];

  // Add role guard
  guards.push(createRoleGuard(requiredRole));

  // Add permission guards if specified
  if (permissions && permissions.length > 0) {
    guards.push(createPermissionGuard(permissions));
  } else {
    guards.push(flexiblePermissionGuard);
  }

  return guards;
};
