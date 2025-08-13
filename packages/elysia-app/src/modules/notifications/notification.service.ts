import { BaseService } from 'src/shared/types/base/base.service';
import { NotificationRepository } from './infrastructure/notification.repository';
import { createNotifier } from './engine';
import { NotifyInput } from './types/types';
import { NewNotificationPreference } from './infrastructure/notification.entity';

export class NotificationService extends BaseService {
  constructor(private notificationRepository: NotificationRepository) {
    super();
  }

  async listMine(userId: string, limit = 20) {
    return this.notificationRepository.listForUser(userId, limit);
  }

  async markRead(userId: string, ids: string[]) {
    return this.notificationRepository.markRead(userId, ids);
  }

  async listPreferences(userId: string) {
    return this.notificationRepository.listPreferences(userId);
  }

  async updatePreferences(
    userId: string,
    preferences: NewNotificationPreference[]
  ) {
    return this.notificationRepository.updatePreferences(userId, preferences);
  }

  async send(input: NotifyInput) {
    const { notify } = createNotifier();
    await notify(input);
  }
}
