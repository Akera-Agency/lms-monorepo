import { z } from 'zod';

// Permission validation schema
const permissionsSchema = z
  .record(
    z.string().min(1, 'Entity name is required'),
    z.array(z.string().min(1, 'Permission name is required')),
  )
  .refine(
    (permissions) => {
      // Validate that all entities and permissions are strings
      for (const [entity, perms] of Object.entries(permissions)) {
        if (typeof entity !== 'string') {
          return false;
        }
        if (!Array.isArray(perms)) {
          return false;
        }
        for (const perm of perms) {
          if (typeof perm !== 'string') {
            return false;
          }
        }
      }
      return true;
    },
    { message: 'Invalid permissions structure' },
  );

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(255, 'Role name cannot exceed 255 characters'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  permissions: permissionsSchema,
  is_system_role: z.boolean(),
});

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(255, 'Role name cannot exceed 255 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  permissions: permissionsSchema.optional(),
  is_system_role: z.boolean().optional(),
});

export const rolePaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive('Page must be a positive integer'),
  limit: z.coerce
    .number()
    .int()
    .positive('Limit must be a positive integer')
    .max(100, 'Limit cannot exceed 100'),
  search: z.string().min(1, 'Search term cannot be empty').optional(),
});

export const roleParamsSchema = z.object({
  id: z.string().min(1, 'Role ID is required'),
});

export const roleNameParamsSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(255, 'Role name cannot exceed 255 characters'),
});

// Helper function to validate permissions (to replace the service method)
export const validatePermissions = (
  permissions: Record<string, string[]>,
): boolean => {
  try {
    permissionsSchema.parse(permissions);
    return true;
  } catch {
    return false;
  }
};

export type CreateRoleRequest = z.infer<typeof createRoleSchema>;
export type UpdateRoleRequest = z.infer<typeof updateRoleSchema>;
export type RolePaginationQuery = z.infer<typeof rolePaginationQuerySchema>;
export type RoleParams = z.infer<typeof roleParamsSchema>;
export type RoleNameParams = z.infer<typeof roleNameParamsSchema>;
