import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { BaseQuery } from '../../../shared/types/base/base.query';

export interface KyselyTaskEntity {
  id: GeneratedAlways<string>;
  project_id: string;
  title: string;
  description: string;
  assignee_id: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  due_date: ColumnType<Date, Date | undefined, null>;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, never>;
}

export type TaskEntity = Selectable<KyselyTaskEntity>;
export type NewTask = Insertable<KyselyTaskEntity>;
export type UpdateTask = Updateable<KyselyTaskEntity>;

export type QueryTask = BaseQuery<KyselyTaskEntity>;
