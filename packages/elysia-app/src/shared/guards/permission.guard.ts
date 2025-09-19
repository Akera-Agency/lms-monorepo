import { Elysia } from 'elysia';
import { AppError } from '../Errors/AppError';
import { BasePermission, ROLES } from '../constants/permissions';
import { IDb } from 'src/database/types/IDb';
import { AuthContext } from './auth.guard';

// Extended context with permission information
export interface PermissionContext extends AuthContext {
  permissions: {
    checkPermission: (entity: keyof IDb, permission: BasePermission) => boolean;
    requirePermission: (entity: keyof IDb, permission: BasePermission) => void;
    getRolePermissions: () => RolePermissionsByScope;
    checkRolePermission: (entity: keyof IDb, permission: BasePermission) => boolean;
    getTenantIds: () => string[];
  };
}

// Permission check interface
export interface PermissionCheck {
  entity: keyof IDb;
  permission: BasePermission;
}

// Structured role permissions separated by scope
export type RolePermissionsByScope = {
  main: Record<keyof IDb, BasePermission[]>;
  tenants: Record<string, Record<keyof IDb, BasePermission[]>>;
};

const createEmptyPermissions = (): Record<keyof IDb, BasePermission[]> => ({
  users: [],
  roles: [],
  tenants: [],
  tenant_roles: [],
  tenant_users: [],
  notifications: [],
  notification_preferences: [],
  notification_logs: [],
  activities: [],
});

const dedupePermissionSets = (
  permissions: Record<keyof IDb, BasePermission[]>,
): Record<keyof IDb, BasePermission[]> => {
  const deduped = createEmptyPermissions();
  (Object.keys(permissions) as Array<keyof IDb>).forEach((entity) => {
    deduped[entity] = [...new Set(permissions[entity])];
  });
  return deduped;
};

// Unified access guard options
export type AccessGuardOptions = {
  permissions?: PermissionCheck[];
  require?: 'all' | 'any';
  requireTenant?: boolean;
};

// Unified access guard that can enforce role checks, all/any permission checks, or just provide utilities
export const createAccessGuard = (options?: AccessGuardOptions) =>
  new Elysia<string, PermissionContext>().derive({ as: 'global' }, async (context) => {
    const { auth, store } = context as unknown as typeof context & AuthContext;

    if (!auth) {
      throw new AppError({
        error: 'authentication_token_required',
        statusCode: 401,
      });
    }

    const { main_roles, tenant_roles } = await store.RoleService.findByUserId(auth.user.sub);

    // Permission utilities use already-fetched roles for consistency and performance
    const checkPermission = (
      entity: keyof IDb,
      permission: BasePermission,
      tenantId?: string,
    ): boolean => {
      if (!auth.user.sub) {
        return false;
      }

      if (
        main_roles.some((role) => role.name === ROLES.ADMIN) ||
        main_roles.some((role) => role.name === ROLES.SUPER_ADMIN)
      ) {
        return true;
      }

      for (const role of main_roles) {
        const permissions = role.permissions[entity] || [];
        if (permissions.includes(permission)) {
          return true;
        }
      }

      if (tenantId) {
        const tenantRolesForTenant = tenant_roles.filter((role) => role.tenant_id === tenantId);
        for (const role of tenantRolesForTenant) {
          const permissions = role.permissions[entity] || [];
          if (permissions.includes(permission)) {
            return true;
          }
        }
        return false;
      }

      for (const role of tenant_roles) {
        const permissions = role.permissions[entity] || [];
        if (permissions.includes(permission)) {
          return true;
        }
      }

      return false;
    };

    const requirePermission = (
      entity: keyof IDb,
      permission: BasePermission,
      tenantId?: string,
    ): void => {
      const hasPermission = checkPermission(entity, permission, tenantId);
      if (!hasPermission) {
        throw new AppError({
          error: 'insufficient_permissions',
          statusCode: 403,
        });
      }
    };

    const getRolePermissions = (): RolePermissionsByScope => {
      // Build main (platform-wide) permissions
      const mainPermissions = createEmptyPermissions();
      main_roles.forEach((role) => {
        Object.entries(role.permissions).forEach(([entity, perms]) => {
          const entityKey = entity as keyof IDb;
          mainPermissions[entityKey] = [
            ...mainPermissions[entityKey],
            ...(perms as BasePermission[]),
          ];
        });
      });

      // Build tenant-scoped permissions grouped by tenant_id
      const tenantsPermissions: Record<string, Record<keyof IDb, BasePermission[]>> = {};
      tenant_roles.forEach((role) => {
        if (!tenantsPermissions[role.tenant_id]) {
          tenantsPermissions[role.tenant_id] = createEmptyPermissions();
        }
        Object.entries(role.permissions).forEach(([entity, perms]) => {
          const entityKey = entity as keyof IDb;
          tenantsPermissions[role.tenant_id][entityKey] = [
            ...tenantsPermissions[role.tenant_id][entityKey],
            ...(perms as BasePermission[]),
          ];
        });
      });

      // Dedupe
      const dedupedMain = dedupePermissionSets(mainPermissions);
      const dedupedTenants: Record<string, Record<keyof IDb, BasePermission[]>> = {};
      Object.entries(tenantsPermissions).forEach(([tenantId, perms]) => {
        dedupedTenants[tenantId] = dedupePermissionSets(perms);
      });

      return { main: dedupedMain, tenants: dedupedTenants };
    };

    const checkRolePermission = (
      entity: keyof IDb,
      permission: BasePermission,
      tenantId?: string,
    ): boolean => {
      for (const role of main_roles) {
        const permissions = role.permissions[entity] || [];
        if (permissions.includes(permission)) {
          return true;
        }
      }
      if (tenantId) {
        const tenantRolesForTenant = tenant_roles.filter((role) => role.tenant_id === tenantId);
        for (const role of tenantRolesForTenant) {
          const permissions = role.permissions[entity] || [];
          if (permissions.includes(permission)) {
            return true;
          }
        }
        return false;
      }
      for (const role of tenant_roles) {
        const permissions = role.permissions[entity] || [];
        if (permissions.includes(permission)) {
          return true;
        }
      }
      return false;
    };

    const checkTenantAccess = (tenantId?: string) => {
      const isSuperAdmin = main_roles.some((role) => role.name === ROLES.SUPER_ADMIN);
      if (options?.requireTenant && !isSuperAdmin) {
        if (!tenantId || auth.tenantId !== tenantId) {
          throw new AppError({
            error: 'unauthorized_tenant',
            statusCode: 403,
          });
        }
      }
    };

    // Permission checks if requested
    if (options?.permissions && options.permissions.length > 0) {
      const mode: 'all' | 'any' = options.require ?? 'all';
      if (mode === 'all') {
        for (const check of options.permissions) {
          checkTenantAccess(options.requireTenant ? auth.tenantId : undefined);
          requirePermission(
            check.entity,
            check.permission,
            options.requireTenant ? auth.tenantId : undefined,
          );
        }
      } else {
        const hasAnyPermission = options.permissions.some((check) => {
          checkTenantAccess(options.requireTenant ? auth.tenantId : undefined);
          checkPermission(
            check.entity,
            check.permission,
            options.requireTenant ? auth.tenantId : undefined,
          );
        });
        if (!hasAnyPermission) {
          throw new AppError({
            error: `insufficient_permissions`,
            statusCode: 403,
          });
        }
      }
    }

    return {
      permissions: {
        checkPermission,
        requirePermission,
        getRolePermissions,
        checkRolePermission,
        getTenantIds: () => {
          return [...new Set(tenant_roles.map((role) => role.tenant_id))];
        },
      },
    };
  });
