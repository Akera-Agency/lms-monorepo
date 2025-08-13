import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { AppEvents } from 'src/core/event-bus';
import { ChannelMap } from '../types/types';

export interface KyselyNotification {
  id: GeneratedAlways<string>;
  user_id: string;
  event: keyof AppEvents;
  template: string;
  payload: Record<string, unknown>;
  read_at: ColumnType<Date | null, Date | null, Date>;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export type NotificationEntity = Selectable<KyselyNotification>;
export type NewNotification = Insertable<KyselyNotification>;
export type UpdateNotification = Updateable<KyselyNotification>;

export interface KyselyNotificationLog {
  id: GeneratedAlways<string>;
  user_id: string;
  event: keyof AppEvents;
  subject: string | null;
  payload: Record<string, unknown>;
  status: 'sent' | 'failed';
  provider_id: string | null;
  error: string | null;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export type NotificationLogEntity = Selectable<KyselyNotificationLog>;
export type NewNotificationLog = Insertable<KyselyNotificationLog>;
export type UpdateNotificationLog = Updateable<KyselyNotificationLog>;

export interface KyselyNotificationPreference {
  user_id: string;
  event: keyof AppEvents;
  channel: keyof ChannelMap;
  enabled: boolean;
}

export type NotificationPreferenceEntity =
  Selectable<KyselyNotificationPreference>;
export type NewNotificationPreference =
  Insertable<KyselyNotificationPreference>;
export type UpdateNotificationPreference =
  Updateable<KyselyNotificationPreference>;
