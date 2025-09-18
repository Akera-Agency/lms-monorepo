import { userModule } from './modules/users/user.module';
import { tenantModule } from './modules/tenants/tenant.module';
import { roleModule } from './modules/roles/role.module';
import { notificationModule } from './modules/notifications/notification.module';
import { activityModule } from './modules/activities/activity.module';
import { TenantService } from './modules/tenants/tenant.service';
import { UserService } from './modules/users/user.service';
import { RoleService } from './modules/roles/role.service';
import { NotificationService } from './modules/notifications/notification.service';
import { ActivityService } from './modules/activities/activity.service';

export const appModules = [
  userModule,
  tenantModule,
  roleModule,
  notificationModule,
  activityModule,
];

export type servicesMap = {
  UserService: UserService;
  RoleService: RoleService;
  TenantService: TenantService;
  NotificationService: NotificationService;
  ActivityService: ActivityService;
};
