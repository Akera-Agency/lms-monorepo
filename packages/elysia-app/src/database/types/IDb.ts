import { KyselyUserEntity } from '../../modules/users/infrastructure/user.entity';
import { KyselyRoleEntity } from '../../modules/roles/infrastructure/role.entity';
import { KyselyTenantEntity } from '../../modules/tenants/infrastructure/tenant.entity';
import { KyselyTenantRoleEntity } from '../../modules/tenants/infrastructure/tenant-role.entity';
import { KyselyTenantUserEntity } from '../../modules/tenants/infrastructure/tenant-user.entity';

export interface IDb {
  users: KyselyUserEntity;
  roles: KyselyRoleEntity;
  tenants: KyselyTenantEntity;
  tenant_roles: KyselyTenantRoleEntity;
  tenant_users: KyselyTenantUserEntity;
}
