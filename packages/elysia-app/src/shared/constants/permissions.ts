import { IDb } from 'src/database/types/IDb';

// Permission types for type safety
export type BasePermission = 'create' | 'read' | 'update' | 'delete' | 'manage';

export const PERMISSIONS: BasePermission[] = [
  'create',
  'read',
  'update',
  'delete',
  'manage',
];

export const ENTITIES: (keyof IDb)[] = [
  'users',
  'tenants',
  'roles',
  'tenant_roles',
  'tenant_users',
];

// Role definitions aligned with the guard system
export enum ROLES {
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

// Role hierarchy (higher roles have access to lower roles)
export const ROLE_HIERARCHY: Record<ROLES, number> = {
  [ROLES.ADMIN]: 100,
  [ROLES.TEACHER]: 60,
  [ROLES.STUDENT]: 20,
};

// Default role permissions mapping - aligned with the guard system
export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    users: ['create', 'read', 'update', 'delete', 'manage'],
    tenants: ['create', 'read', 'update', 'delete', 'manage'],
    roles: ['create', 'read', 'update', 'delete', 'manage'],
    tenant_roles: ['create', 'read', 'update', 'delete', 'manage'],
    tenant_users: ['create', 'read', 'update', 'delete', 'manage'],
  },
  [ROLES.TEACHER]: {
    users: ['read'],
    tenants: ['read'],
    roles: ['read'],
    tenant_roles: ['read'],
    tenant_users: ['read', 'update'],
  },
  [ROLES.STUDENT]: {
    users: ['read'],
    tenants: ['read'],
    roles: ['read'],
    tenant_roles: ['read'],
    tenant_users: ['read'],
  },
} as const satisfies Record<ROLES, Record<keyof IDb, BasePermission[]>>;

// Helper function to get permissions for a role
export function getRolePermissions(
  role: ROLES
): Record<keyof IDb, BasePermission[]> {
  return DEFAULT_ROLE_PERMISSIONS[role];
}

// Helper function to check if a role has a specific permission
export function hasRolePermission(
  role: ROLES,
  entity: keyof IDb,
  permission: BasePermission
): boolean {
  const rolePermissions = getRolePermissions(role);
  return rolePermissions[entity]?.includes(permission) || false;
}

// Helper function to check if a role has access to another role
export function hasRoleAccess(userRole: ROLES, requiredRole: ROLES): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// Helper function to get all permissions for a role (including inherited)
export function getAllRolePermissions(
  role: ROLES
): Record<keyof IDb, BasePermission[]> {
  const permissions: Record<keyof IDb, BasePermission[]> = {
    ...DEFAULT_ROLE_PERMISSIONS[role],
  };

  // Add permissions from all roles that this role has access to
  Object.entries(ROLE_HIERARCHY).forEach(([roleName, level]) => {
    if (hasRoleAccess(role, roleName as ROLES)) {
      const rolePerms = DEFAULT_ROLE_PERMISSIONS[roleName as ROLES];
      Object.entries(rolePerms).forEach(([entity, perms]) => {
        if (!permissions[entity as keyof IDb]) {
          permissions[entity as keyof IDb] = [];
        }
        permissions[entity as keyof IDb] = [
          ...new Set([...permissions[entity as keyof IDb], ...perms]),
        ];
      });
    }
  });

  return permissions;
}

export function validatePermissions(
  permissions: Record<keyof IDb, BasePermission[]>
): boolean {
  const validEntities = ENTITIES;

  for (const [entity, perms] of Object.entries(permissions)) {
    if (!validEntities.includes(entity as keyof IDb)) {
      return false;
    }

    if (!Array.isArray(perms)) {
      return false;
    }

    for (const perm of perms) {
      if (!PERMISSIONS.includes(perm)) {
        return false;
      }
    }
  }

  return true;
}

// Helper function to merge permissions
export function mergePermissions(
  permissions1: Record<keyof IDb, BasePermission[]>,
  permissions2: Record<keyof IDb, BasePermission[]>
): Record<keyof IDb, BasePermission[]> {
  const merged = { ...permissions1 };

  for (const [entity, perms] of Object.entries(permissions2) as [
    keyof IDb,
    BasePermission[]
  ][]) {
    if (merged[entity]) {
      merged[entity] = [...new Set([...merged[entity], ...perms])];
    } else {
      merged[entity] = [...perms];
    }
  }

  return merged;
}

// Helper function to check if permissions overlap
export function hasPermissionOverlap(
  permissions1: Record<keyof IDb, BasePermission[]>,
  permissions2: Record<keyof IDb, BasePermission[]>
): boolean {
  for (const [entity, perms1] of Object.entries(permissions1) as [
    keyof IDb,
    BasePermission[]
  ][]) {
    const perms2 = permissions2[entity];
    if (perms2) {
      for (const perm of perms1) {
        if (perms2.includes(perm)) {
          return true;
        }
      }
    }
  }
  return false;
}
