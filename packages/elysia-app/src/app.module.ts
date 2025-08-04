import { userModule } from './modules/users/user.module';
import { tenantModule } from './modules/tenants/tenant.module';
import { roleModule } from './modules/roles/role.module';
import { TenantService } from './modules/tenants/tenant.service';
import { UserService } from './modules/users/user.service';
import { RoleService } from './modules/roles/role.service';

export const appModules = [userModule, tenantModule, roleModule];

export type servicesMap = {
  UserService: UserService;
  RoleService: RoleService;
  TenantService: TenantService;
};
