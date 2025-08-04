import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';
import { BaseQuery } from '../../../shared/types/base/base.query';

export interface KyselyUserEntity {
  id: string;
  email: string;
  name: string;
  role_id: string | null;
  avatar_url: string | null;
  is_active: boolean;
  last_login_at: Date | null;
  deleted_at: Date | null;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, never>;
}

export type UserEntity = Selectable<KyselyUserEntity>;
export type NewUser = Insertable<KyselyUserEntity>;
export type UpdateUser = Updateable<KyselyUserEntity>;

export type QueryUser = BaseQuery<KyselyUserEntity>;
