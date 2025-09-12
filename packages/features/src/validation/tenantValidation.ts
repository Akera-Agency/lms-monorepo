export const resources = [
  "tenant_roles",
  "tenant_users",
  "notifications",
  "notification_preferences",
] as const;

export type Resource = (typeof resources)[number];

export const permissionOptions = ["create", "read", "update", "delete"] as const;

export type PermissionOption = typeof permissionOptions[number];

export const resourceList: Resource[] = [
  "tenant_roles",
  "tenant_users",
  "notifications",
  "notification_preferences",
];

export const createEmptyPermissions = (): Record<Resource, PermissionOption[]> | Record<string, string[]> => {
  return resourceList.reduce(
    (acc, res) => {
      acc[res] = [];
      return acc;
    },
    {} as Record<Resource, PermissionOption[]> | Record<string, string[]>
  );
};

// Optional: for backward compatibility if needed
export const emptyPermissions = createEmptyPermissions();

  export interface RoleData {
    tenant_id?: string;
    id?: string;
    name: string;
    description: string | null;
    deleted_at?: Date | null;
    created_at?: Date;
    updated_at?: Date;
    permissions:  Record<Resource, PermissionOption[]> | Record<string, string[]>;
    is_default: boolean;
    is_system_role: boolean;
  }
  
  export interface FormData {
    tenant_name: string;
    tenant_description?: string;
    logo_url?: string;
    roles: RoleData[];
  }
  
  export interface FormErrors {
    tenant_name?: string;
    tenant_description?: string;
    roles?: {
      [index: number]: {
        role_name?: string;
        role_description?: string;
        permissions?: string
      },
    };
  }
  
  export const validateTenantForm = (data: FormData): FormErrors => {
    const errors: FormErrors = {};
  
    // Tenant validations
    if (!data.tenant_name.trim()) {
      errors.tenant_name = "Tenant name is required";
    } else if (data.tenant_name.trim().length < 2) {
      errors.tenant_name = "Tenant name must be at least 2 characters";
    }
  
    // Roles validations
    const roleErrors: { [index: number]: { role_name?: string; role_description?: string, permissions?: string} } = {};
  
    if (!data.roles || data.roles.length === 0) {
      errors.roles = { 0: { role_name: "At least one role is required" } };
    } else {
      data.roles.forEach((role, index) => {
        const currentRoleErrors: { role_name?: string; role_description?: string, permissions?: string} = {};
  
        if (!role.name.trim()) {
          currentRoleErrors.role_name = "Role name is required";
        } else if (role.name.trim().length < 2) {
          currentRoleErrors.role_name = "Role name must be at least 2 characters";
        }

        // Permissions validation 
      const missingPermissions: Resource[] = [];
      resourceList.forEach(resource => {
        if (!role.permissions[resource] || role.permissions[resource].length === 0) {
          missingPermissions.push(resource);
        }
      });

      if (missingPermissions.length > 0) {
        const resourceNames = missingPermissions.map(res => 
          res.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())
        );
        currentRoleErrors.permissions = `Missing permissions for: ${resourceNames.join(', ')}`;
      }

        if (Object.keys(currentRoleErrors).length > 0) {
          roleErrors[index] = currentRoleErrors;
        }
      });
  
      if (Object.keys(roleErrors).length > 0) {
        errors.roles = roleErrors;
      }
    }  

    return errors;
  };
  