import { BaseModule } from '../../shared/types/base/base.module';
import { TenantRepository } from './infrastructure/tenant.repository';
import { TenantRoleRepository } from './infrastructure/tenant-role.repository';
import { TenantService } from './tenant.service';
import { tenantController } from './tenant.controller';

export const tenantModule = {
  repositories: {
    TenantRepository: {
      import: TenantRepository,
    },
    TenantRoleRepository: {
      import: TenantRoleRepository,
    },
  },
  services: {
    TenantService: {
      import: TenantService,
      inject: [TenantRepository, TenantRoleRepository],
    },
  },
  controllers: [tenantController],
} satisfies BaseModule;
