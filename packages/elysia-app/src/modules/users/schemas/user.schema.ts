import { z } from 'zod';
import { LanguagesEnum } from '../../../shared/constants/i18n';

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required'),
  language: z.enum([LanguagesEnum.ar, LanguagesEnum.en], {
    errorMap: () => ({ message: 'Invalid language selection' }),
  }),
  avatar_url: z.string().url('Invalid URL format'),
});

export const userPaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive('Page must be a positive integer'),
  limit: z.coerce
    .number()
    .int()
    .positive('Limit must be a positive integer')
    .max(100, 'Limit cannot exceed 100'),
});

export const userParamsSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type UserPaginationQuery = z.infer<typeof userPaginationQuerySchema>;
export type UserParams = z.infer<typeof userParamsSchema>;
