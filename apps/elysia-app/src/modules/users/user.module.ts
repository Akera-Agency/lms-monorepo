import { BaseModule } from '../../shared/types/base/base.module';
import { UserRepository } from './infrastructure/user.repository';
import { UserService } from './user.service';
import { userController } from './user.controller';

export const userModule = {
  repositories: {
    UserRepository: {
      import: UserRepository,
    },
  },
  services: {
    UserService: {
      import: UserService,
      inject: [UserRepository],
    },
  },
  controllers: [userController],
} satisfies BaseModule;
