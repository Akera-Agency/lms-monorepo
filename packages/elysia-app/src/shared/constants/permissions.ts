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
