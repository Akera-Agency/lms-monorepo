import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import { BaseQuery } from "../../../shared/types/base/base.query";

export interface KyselyUserEntity {
  id: GeneratedAlways<string>;
  email: string;
  name: string;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export type UserEntity = Selectable<KyselyUserEntity>;
export type NewUser = Insertable<KyselyUserEntity>;
export type UpdateUser = Updateable<KyselyUserEntity>;

export type QueryUser = BaseQuery<KyselyUserEntity>;
