import { ColumnType, GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely';
import { BaseQuery } from '../../../shared/types/base/base.query';

export interface KyselyRoleEntity {
  id: GeneratedAlways<string>;
  name: string;
  description: string | null;
  permissions: Record<string, string[]>;
  is_system_role: boolean;
  deleted_at: ColumnType<Date | null, never, Date | null>;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, never>;
}

export type RoleEntity = Selectable<KyselyRoleEntity>;
export type NewRole = Insertable<KyselyRoleEntity>;
export type UpdateRole = Updateable<KyselyRoleEntity>;

export type QueryRole = BaseQuery<KyselyRoleEntity>;
