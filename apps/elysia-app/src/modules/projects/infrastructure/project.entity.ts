import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { BaseQuery } from '../../../shared/types/base/base.query';

export interface KyselyProjectEntity {
  id: GeneratedAlways<string>;
  name: string;
  description: string;
  owner_id: string;
  status: 'active' | 'archived' | 'completed';
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, never>;
}

export type ProjectEntity = Selectable<KyselyProjectEntity>;
export type NewProject = Insertable<KyselyProjectEntity>;
export type UpdateProject = Updateable<KyselyProjectEntity>;

export type QueryProject = BaseQuery<KyselyProjectEntity>;
