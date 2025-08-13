import { Kysely } from 'kysely';
import { IDb } from 'src/database/types/IDb';
import { BaseRepo } from 'src/shared/types/base/base.repo';
import {
  KyselyNotification,
  NewNotification,
  NewNotificationLog,
  NewNotificationPreference,
} from './notification.entity';
import { PostgresError } from 'src/shared/Errors/PostgresError';
import { UserEntity } from 'src/modules/users/infrastructure/user.entity';
import { Audience } from '../types/types';
import { database } from 'src/database/datasource';
import { AppEvents } from 'src/core/event-bus';

export class NotificationRepository extends BaseRepo<KyselyNotification> {
  constructor(trx: Kysely<IDb>) {
    super(trx, 'notifications');
  }

  async listForUser(userId: string, limit = 20) {
    try {
      return await this.trx
        .selectFrom('notifications')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('created_at', 'desc')
        .limit(limit)
        .execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async markRead(userId: string, ids: string[]) {
    if (ids.length === 0) return;
    try {
      await this.trx
        .updateTable('notifications')
        .set({ read_at: new Date() })
        .where('user_id', '=', userId)
        .where('id', 'in', ids)
        .executeTakeFirst();
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  override async createMany(notifications: NewNotification[]) {
    try {
      await this.trx
        .insertInto('notifications')
        .values(notifications)
        .execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async isChannelEnabled(
    userId: string,
    event: keyof AppEvents,
    channel: 'in_app' | 'email'
  ): Promise<boolean> {
    try {
      const pref = await this.trx
        .selectFrom('notification_preferences')
        .select(['enabled'])
        .where('user_id', '=', userId)
        .where('event', '=', event)
        .where('channel', '=', channel)
        .executeTakeFirst();
      if (!pref) return true;
      return !!pref.enabled;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async resolveAudience(audience: Audience): Promise<UserEntity[]> {
    try {
      if (audience.kind === 'users') {
        const users = await this.trx
          .selectFrom('users')
          .selectAll()
          .where('id', 'in', audience.userIds)
          .where('deleted_at', 'is', null)
          .$if(!!audience.tenantId, (qb) =>
            qb
              .innerJoin('tenant_users', 'tenant_users.user_id', 'users.id')
              .where('tenant_users.tenant_id', '=', audience.tenantId!)
          )
          .execute();
        return users;
      }
      return [];
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async createLogs(logs: NewNotificationLog[]) {
    try {
      await this.trx.insertInto('notification_logs').values(logs).execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async listPreferences(userId: string) {
    try {
      return await this.trx
        .selectFrom('notification_preferences')
        .selectAll()
        .where('user_id', '=', userId)
        .execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async updatePreferences(
    userId: string,
    preferences: NewNotificationPreference[]
  ) {
    try {
      await this.trx
        .insertInto('notification_preferences')
        .values(preferences)
        .onConflict((oc) =>
          oc.columns(['user_id', 'event', 'channel']).doUpdateSet((eb) => ({
            enabled: eb.ref('excluded.enabled'),
          }))
        )
        .execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }
}

export const notificationRepository = new NotificationRepository(database);
