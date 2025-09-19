import { z } from 'zod';

export const createTenantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name cannot exceed 255 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  logo_url: z.string().url('Invalid URL format').optional(),
  is_public: z.boolean(),
});

export const updateTenantSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name cannot exceed 255 characters')
    .optional(),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  logo_url: z.string().url('Invalid URL format').optional(),
  is_public: z.boolean().optional(),
});

export const createTenantRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(255, 'Role name cannot exceed 255 characters'),
  permissions: z
    .record(
      z.string().min(1, 'Entity name is required'),
      z.array(z.string().min(1, 'Permission name is required')),
    )
    .refine((permissions) => Object.keys(permissions).length > 0, {
      message: 'At least one permission entity is required',
    }),
  is_default: z.boolean(),
  is_system_role: z.boolean(),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
});

export const updateTenantRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(255, 'Role name cannot exceed 255 characters')
    .optional(),
  permissions: z
    .record(
      z.string().min(1, 'Entity name is required'),
      z.array(z.string().min(1, 'Permission name is required')),
    )
    .optional(),
  is_default: z.boolean().optional(),
  is_system_role: z.boolean().optional(),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
});

export const tenantUserRoleSchema = z.object({
  roleId: z.string().min(1, 'Role ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export const tenantPaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive('Page must be a positive integer').default(1),
  limit: z.coerce
    .number()
    .int()
    .positive('Limit must be a positive integer')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
  search: z.string().min(1, 'Search term cannot be empty').optional(),
});

export const tenantParamsSchema = z.object({
  id: z.string().min(1, 'Tenant ID is required'),
});

export const tenantRoleParamsSchema = z.object({
  id: z.string().min(1, 'Tenant ID is required'),
  roleId: z.string().min(1, 'Role ID is required'),
});

export const tenantUserParamsSchema = z.object({
  id: z.string().min(1, 'Tenant ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export type CreateTenantRequest = z.infer<typeof createTenantSchema>;
export type UpdateTenantRequest = z.infer<typeof updateTenantSchema>;
export type CreateTenantRoleRequest = z.infer<typeof createTenantRoleSchema>;
export type UpdateTenantRoleRequest = z.infer<typeof updateTenantRoleSchema>;
export type TenantUserRoleRequest = z.infer<typeof tenantUserRoleSchema>;
export type TenantPaginationQuery = z.infer<typeof tenantPaginationQuerySchema>;
export type TenantParams = z.infer<typeof tenantParamsSchema>;
export type TenantRoleParams = z.infer<typeof tenantRoleParamsSchema>;
export type TenantUserParams = z.infer<typeof tenantUserParamsSchema>;
