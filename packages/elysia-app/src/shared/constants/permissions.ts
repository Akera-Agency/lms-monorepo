import { IDb } from 'src/database/types/IDb';

// Permission types for type safety
export type BasePermission = 'create' | 'read' | 'update' | 'delete';

export const PERMISSIONS: BasePermission[] = [
  'create',
  'read',
  'update',
  'delete',
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

// Default role permissions mapping - aligned with the guard system
export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    users: ['create', 'read', 'update', 'delete'],
    tenants: ['create', 'read', 'update', 'delete'],
    roles: ['create', 'read', 'update', 'delete'],
    tenant_roles: ['create', 'read', 'update', 'delete'],
    tenant_users: ['create', 'read', 'update', 'delete'],
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
  rolePermissions: Record<string, string[]>,
  entity: keyof IDb,
  permission: BasePermission
): boolean {
  return rolePermissions[entity]?.includes(permission) || false;
}

// Helper function to merge multiple role permissions
export function mergeRolePermissions(
  roles: Array<{ permissions: Record<string, string[]> }>
): Record<keyof IDb, BasePermission[]> {
  const permissions: Record<keyof IDb, BasePermission[]> = {
    users: [],
    tenants: [],
    roles: [],
    tenant_roles: [],
    tenant_users: [],
  };

  roles.forEach((role) => {
    Object.entries(role.permissions).forEach(([entity, perms]) => {
      permissions[entity as keyof IDb] = [
        ...permissions[entity as keyof IDb],
        ...(perms as BasePermission[]),
      ];
    });
  });

  // Remove duplicates
  Object.keys(permissions).forEach((entity) => {
    permissions[entity as keyof IDb] = [
      ...new Set(permissions[entity as keyof IDb]),
    ];
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
