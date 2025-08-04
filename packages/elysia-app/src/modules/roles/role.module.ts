import { BaseModule } from '../../shared/types/base/base.module';
import { RoleRepository } from './infrastructure/role.repository';
import { RoleService } from './role.service';
import { roleController } from './role.controller';

export const roleModule = {
  repositories: {
    RoleRepository: {
      import: RoleRepository,
    },
  },
  services: {
    RoleService: {
      import: RoleService,
      inject: [RoleRepository],
    },
  },
  controllers: [roleController],
} satisfies BaseModule;
