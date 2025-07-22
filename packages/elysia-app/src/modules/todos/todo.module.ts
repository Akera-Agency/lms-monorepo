import { TodoService } from './todo.service';
import { TodoRepository } from './infrastructure/todo.repository';
import { BaseModule } from '../../shared/types/base/base.module';
import { todoController } from './todo.controller';

export const todoModule = {
  repositories: {
    TodoRepository: {
      import: TodoRepository,
    },
  },
  services: {
    TodoService: {
      import: TodoService,
      inject: [TodoRepository],
    },
  },
  controllers: [todoController],
} satisfies BaseModule;
