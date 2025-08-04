import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';
import { BaseQuery } from '../../../shared/types/base/base.query';

export interface KyselyTenantUserEntity {
  tenant_id: string;
  user_id: string;
  tenant_role_id: string | null;
  joined_at: ColumnType<Date, Date | undefined, never>;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export type TenantUserEntity = Selectable<KyselyTenantUserEntity>;
export type NewTenantUser = Insertable<KyselyTenantUserEntity>;
export type UpdateTenantUser = Updateable<KyselyTenantUserEntity>;

export type QueryTenantUser = BaseQuery<KyselyTenantUserEntity>;
