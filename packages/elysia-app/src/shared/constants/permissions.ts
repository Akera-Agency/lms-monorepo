import { IDb } from 'src/database/types/IDb';

// Permission types for type safety
export type BasePermission = 'create' | 'read' | 'update' | 'delete';

export const PERMISSIONS: BasePermission[] = ['create', 'read', 'update', 'delete'];

export const ENTITIES: (keyof IDb)[] = [
  'users',
  'tenants',
  'roles',
  'tenant_roles',
  'tenant_users',
  'notifications',
  'notification_logs',
  'notification_preferences',
];

// Role definitions aligned with the guard system
export enum ROLES {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

// Default role permissions mapping - aligned with the guard system
export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    users: ['create', 'read', 'update', 'delete'],
    tenants: ['create', 'read', 'update', 'delete'],
    roles: ['create', 'read', 'update', 'delete'],
    tenant_roles: ['create', 'read', 'update', 'delete'],
    tenant_users: ['create', 'read', 'update', 'delete'],
    notifications: ['create', 'read', 'update', 'delete'],
    notification_logs: ['create', 'read', 'update', 'delete'],
    notification_preferences: ['create', 'read', 'update', 'delete'],
  },
  [ROLES.ADMIN]: {
    users: ['create', 'read', 'update', 'delete'],
    tenants: ['create', 'read', 'update', 'delete'],
    roles: ['create', 'read', 'update', 'delete'],
    tenant_roles: ['create', 'read', 'update', 'delete'],
    tenant_users: ['create', 'read', 'update', 'delete'],
    notifications: ['create', 'read', 'update', 'delete'],
    notification_logs: ['create', 'read', 'update', 'delete'],
    notification_preferences: ['create', 'read', 'update', 'delete'],
  },
  [ROLES.TEACHER]: {
    users: ['read'],
    tenants: ['read'],
    roles: ['read'],
    tenant_roles: ['read'],
    tenant_users: ['read', 'update'],
    notifications: ['read'],
    notification_logs: ['read'],
    notification_preferences: ['read'],
  },
  [ROLES.STUDENT]: {
    users: ['read'],
    tenants: ['read'],
    roles: ['read'],
    tenant_roles: ['read'],
    tenant_users: ['read'],
    notifications: ['read'],
    notification_logs: ['read'],
    notification_preferences: ['read'],
  },
} as const satisfies Record<ROLES, Record<keyof IDb, BasePermission[]>>;

// Helper function to get permissions for a role
export function getRolePermissions(role: ROLES): Record<keyof IDb, BasePermission[]> {
  return DEFAULT_ROLE_PERMISSIONS[role];
}
