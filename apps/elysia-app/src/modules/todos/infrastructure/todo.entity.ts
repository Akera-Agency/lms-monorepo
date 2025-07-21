import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import { BaseQuery } from "../../../shared/types/base/base.query";

export interface KyselyTodoEntity {
  id: GeneratedAlways<string>;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export type TodoEntity = Selectable<KyselyTodoEntity>;
export type NewTodo = Insertable<KyselyTodoEntity>;
export type UpdateTodo = Updateable<KyselyTodoEntity>; 

export type QueryTodo = BaseQuery<KyselyTodoEntity>;