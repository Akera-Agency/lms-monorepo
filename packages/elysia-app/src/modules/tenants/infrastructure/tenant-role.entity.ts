import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { BaseQuery } from '../../../shared/types/base/base.query';

export interface KyselyTenantRoleEntity {
  id: GeneratedAlways<string>;
  tenant_id: string;
  name: string;
  description: string | null;
  permissions: Record<string, string[]>; // JSONB structure for permissions
  is_default: boolean;
  is_system_role: boolean;
  deleted_at: ColumnType<Date | null, never, Date | null>;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, never>;
}

export type TenantRoleEntity = Selectable<KyselyTenantRoleEntity>;
export type NewTenantRole = Insertable<KyselyTenantRoleEntity>;
export type UpdateTenantRole = Updateable<KyselyTenantRoleEntity>;

export type QueryTenantRole = BaseQuery<KyselyTenantRoleEntity>;
