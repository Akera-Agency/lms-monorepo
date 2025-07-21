import { BaseModule } from "../../shared/types/base/base.module";
import { UserRepository } from "./infrastructure/user.repository";
import { UserService } from "./user.service";
import { userController } from "./user.controller";

export const userModule: BaseModule = {
  repositories: {
    [UserRepository.name]: {
      import: UserRepository,
    },
  },
  services: {
    [UserService.name]: {
      import: UserService,
      inject: [UserRepository],
    },
  },
  controllers: [userController],
};
