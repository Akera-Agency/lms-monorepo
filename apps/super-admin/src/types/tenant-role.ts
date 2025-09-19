import type {
  PermissionOption,
  Resource,
} from '../../../../packages/features/src/validation/tenantValidation';

export interface TenantRoleEntity {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
  permissions: Record<Resource, PermissionOption[]> | Record<string, string[]>;
  is_default: boolean;
  is_system_role: boolean;
}
