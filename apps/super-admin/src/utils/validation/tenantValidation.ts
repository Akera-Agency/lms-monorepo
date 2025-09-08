// --- Types ---
interface RoleData {
    role_name: string;
    role_description?: string;
    permissions: string[];
    is_default: boolean;
    is_system_role: boolean;
  }
  
  interface FormData {
    tenant_name: string;
    tenant_description?: string;
    logo_url?: string;
    roles: RoleData[];
  }
  
  interface FormErrors {
    tenant_name?: string;
    tenant_description?: string;
    roles?: {
      [index: number]: {
        role_name?: string;
        role_description?: string;
      };
    };
  }
  
  // --- Validation ---
  export const validateTenantForm = (data: FormData): FormErrors => {
    const errors: FormErrors = {};
  
    // Tenant validations
    if (!data.tenant_name.trim()) {
      errors.tenant_name = "Tenant name is required";
    } else if (data.tenant_name.trim().length < 2) {
      errors.tenant_name = "Tenant name must be at least 2 characters";
    }
  
    // Roles validations
    const roleErrors: { [index: number]: { role_name?: string; role_description?: string } } = {};
  
    data.roles.forEach((role, index) => {
      const currentRoleErrors: { role_name?: string; role_description?: string } = {};
  
      if (!role.role_name.trim()) {
        currentRoleErrors.role_name = "Role name is required";
      } else if (role.role_name.trim().length < 2) {
        currentRoleErrors.role_name = "Role name must be at least 2 characters";
      }
  
      if (Object.keys(currentRoleErrors).length > 0) {
        roleErrors[index] = currentRoleErrors;
      }
    });
  
    if (Object.keys(roleErrors).length > 0) {
      errors.roles = roleErrors;
    }
  
    return errors;
  };
  