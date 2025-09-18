import { BaseModule } from '../../shared/types/base/base.module';
import { ActivityRepository } from './infrastructure/activity.repository';
import { ActivityService } from './activity.service';
import { activityController } from './activity.controller';

export const activityModule = {
  repositories: {
    ActivityRepository: {
      import: ActivityRepository,
    },
  },
  services: {
    ActivityService: {
      import: ActivityService,
      inject: [ActivityRepository],
    },
  },
  controllers: [activityController],
} satisfies BaseModule;
