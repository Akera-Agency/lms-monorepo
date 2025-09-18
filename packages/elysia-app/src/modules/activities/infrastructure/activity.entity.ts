import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { BaseQuery } from '../../../shared/types/base/base.query';

export enum ActivityTypeEnum {
  LESSON_COMPLETED = 'LESSON_COMPLETED',
  WATCHED_VIDEO_FOR_5_MINUTES = 'WATCHED_VIDEO_FOR_5_MINUTES',
  COURSE_COMPLETED = 'COURSE_COMPLETED',
  PATH_COMPLETED = 'PATH_COMPLETED',
  PROFILE_COMPLETED = 'PROFILE_COMPLETED',
  QUIZ_COMPLETED = 'QUIZ_COMPLETED',
  DAILY_LOGIN = 'DAILY_LOGIN',
  SECOND_TIME_QUIZ_COMPLETED = 'SECOND_TIME_QUIZ_COMPLETED',
}

export const ACTIVITY_TYPE: Record<ActivityTypeEnum, number> = {
  LESSON_COMPLETED: 50,
  WATCHED_VIDEO_FOR_5_MINUTES: 0,
  COURSE_COMPLETED: 0,
  PATH_COMPLETED: 0,
  PROFILE_COMPLETED: 100,
  QUIZ_COMPLETED: 150,
  SECOND_TIME_QUIZ_COMPLETED: 25,
  DAILY_LOGIN: 50,
} as const;

export interface KyselyActivityEntity {
  id: Generated<string>;
  user_id: ColumnType<string, string, never>;
  type: ColumnType<ActivityTypeEnum, ActivityTypeEnum, ActivityTypeEnum>;
  earned_xp: ColumnType<number, number, number>;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, never>;
  deleted_at: ColumnType<Date | null, Date | null, Date | null>;
}

export type Activity = Selectable<KyselyActivityEntity>;
export type NewActivity = Insertable<KyselyActivityEntity>;
export type UpdateActivity = Updateable<KyselyActivityEntity>;
export type QueryActivity = BaseQuery<KyselyActivityEntity>;
