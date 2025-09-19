import { z } from 'zod';

// Define notification event types
const notificationEventSchema = z.union([
  z.literal('user:updated'),
  z.literal('notification:enqueue'),
]);

// Define notification channel types
const notificationChannelSchema = z.union([
  z.literal('in_app'),
  z.literal('email'),
  z.literal('all'),
]);

export const notificationReadSchema = z.object({
  ids: z
    .array(z.string().min(1, 'Notification ID is required'))
    .min(1, 'At least one notification ID is required'),
});

export const notificationPreferenceSchema = z.object({
  event: notificationEventSchema,
  channel: notificationChannelSchema,
  enabled: z.boolean(),
});

export const updateNotificationPreferencesSchema = z.object({
  preferences: z.array(notificationPreferenceSchema).min(1, 'At least one preference is required'),
});

export const notificationQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive('Limit must be a positive integer')
    .max(100, 'Limit cannot exceed 100')
    .default(20),
});

export type NotificationReadRequest = z.infer<typeof notificationReadSchema>;
export type NotificationPreference = z.infer<typeof notificationPreferenceSchema>;
export type UpdateNotificationPreferencesRequest = z.infer<
  typeof updateNotificationPreferencesSchema
>;
export type NotificationQuery = z.infer<typeof notificationQuerySchema>;
