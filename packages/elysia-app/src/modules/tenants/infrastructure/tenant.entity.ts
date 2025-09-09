import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { BaseQuery } from '../../../shared/types/base/base.query';

export interface KyselyTenantEntity {
  id: GeneratedAlways<string>;
  name: ColumnType<string, string, string | null>;
  description: string | null;
  logo_url: string | null;
  is_public: boolean;
  deleted_at: ColumnType<Date | null, never, Date | null>;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, never>;
}

export type TenantEntity = Selectable<KyselyTenantEntity>;
export type NewTenant = Insertable<KyselyTenantEntity>;
export type UpdateTenant = Updateable<KyselyTenantEntity>;

export type QueryTenant = BaseQuery<KyselyTenantEntity>;
