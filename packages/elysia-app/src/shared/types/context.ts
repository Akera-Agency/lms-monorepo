import { UserService } from '../../modules/users/user.service';
import { TodoService } from '../../modules/todos/todo.service';
import { SingletonBase } from 'elysia';
import { initTools } from '../../app';
import { ITransaction } from '../../database/types/transaction';
import { ProjectService } from 'src/modules/projects/project.service';

type servicesMap = {
  UserService: UserService;
  TodoService: TodoService;
  ProjectService: ProjectService;
};

export interface TContext extends SingletonBase {
  tools: Awaited<ReturnType<typeof initTools>>;
  store: {
    trx: ITransaction;
  } & servicesMap;
}
