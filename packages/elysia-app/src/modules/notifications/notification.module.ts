import { BaseModule } from 'src/shared/types/base/base.module';
import { NotificationRepository } from './infrastructure/notification.repository';
import { NotificationService } from './notification.service';
import { notificationController } from './notification.controller';

export const notificationModule = {
  repositories: {
    NotificationRepository: {
      import: NotificationRepository,
    },
  },
  services: {
    NotificationService: {
      import: NotificationService,
      inject: [NotificationRepository],
    },
  },
  controllers: [notificationController],
} satisfies BaseModule;
