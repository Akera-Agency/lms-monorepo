import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import { BaseQuery } from "../../../shared/types/base/base.query";

export interface KyselyCommentEntity {
  id: GeneratedAlways<string>;
  task_id: string;
  user_id: string;
  content: string;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, never>;
}

export type CommentEntity = Selectable<KyselyCommentEntity>;
export type NewComment = Insertable<KyselyCommentEntity>;
export type UpdateComment = Updateable<KyselyCommentEntity>; 

export type QueryComment = BaseQuery<KyselyCommentEntity>; 