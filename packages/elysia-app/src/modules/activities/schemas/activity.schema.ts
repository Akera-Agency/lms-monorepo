import { z } from 'zod';
import { ActivityTypeEnum } from '../infrastructure/activity.entity';

export const createActivitySchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  type: z.enum(
    [
      ActivityTypeEnum.COURSE_COMPLETED,
      ActivityTypeEnum.LESSON_COMPLETED,
      ActivityTypeEnum.WATCHED_VIDEO_FOR_5_MINUTES,
      ActivityTypeEnum.PATH_COMPLETED,
      ActivityTypeEnum.PROFILE_COMPLETED,
      ActivityTypeEnum.QUIZ_COMPLETED,
      ActivityTypeEnum.SECOND_TIME_QUIZ_COMPLETED,
      ActivityTypeEnum.DAILY_LOGIN,
    ],
    {
      errorMap: () => ({ message: 'Invalid activity type' }),
    },
  ),
});

export const activityPaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive('Page must be a positive integer'),
  limit: z.coerce
    .number()
    .int()
    .positive('Limit must be a positive integer')
    .max(100, 'Limit cannot exceed 100'),
  user_id: z.string().min(1, 'User ID is required').optional(),
});

export const activityParamsSchema = z.object({
  id: z.string().min(1, 'Activity ID is required'),
});

export const activityUserParamsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export const activityTypeParamsSchema = z.object({
  type: z.enum(
    [
      ActivityTypeEnum.COURSE_COMPLETED,
      ActivityTypeEnum.LESSON_COMPLETED,
      ActivityTypeEnum.WATCHED_VIDEO_FOR_5_MINUTES,
      ActivityTypeEnum.PATH_COMPLETED,
      ActivityTypeEnum.PROFILE_COMPLETED,
      ActivityTypeEnum.QUIZ_COMPLETED,
      ActivityTypeEnum.SECOND_TIME_QUIZ_COMPLETED,
      ActivityTypeEnum.DAILY_LOGIN,
    ],
    {
      errorMap: () => ({ message: 'Invalid activity type' }),
    },
  ),
});

export const activityDateQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
});

export type CreateActivityRequest = z.infer<typeof createActivitySchema>;
export type ActivityPaginationQuery = z.infer<typeof activityPaginationQuerySchema>;
export type ActivityParams = z.infer<typeof activityParamsSchema>;
export type ActivityUserParams = z.infer<typeof activityUserParamsSchema>;
export type ActivityTypeParams = z.infer<typeof activityTypeParamsSchema>;
export type ActivityDateQuery = z.infer<typeof activityDateQuerySchema>;
