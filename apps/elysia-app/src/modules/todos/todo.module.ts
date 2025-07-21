import { TodoService } from "./todo.service";
import { TodoRepository } from "./infrastructure/todo.repository";
import { BaseModule } from "../../shared/types/base/base.module";
import { todoController } from "./todo.controller";

export const todoModule: BaseModule = {
  repositories: {
    [TodoRepository.name]: {
      import: TodoRepository,
    },
  },
  services: {
    [TodoService.name]: {
      import: TodoService,
      inject: [TodoRepository],
    },
  },
  controllers: [todoController],
};
