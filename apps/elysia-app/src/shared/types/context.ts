import { UserService } from '../../modules/users/user.service';
import { TodoService } from '../../modules/todos/todo.service';
import { SingletonBase } from 'elysia';
import { initTools } from '../../app';
import { ITransaction } from '../../database/types/transaction';

type servicesMap = {
  UserService: UserService;
  TodoService: TodoService;
};

export interface TContext extends SingletonBase {
  tools: Awaited<ReturnType<typeof initTools>>;
  store: {
    trx: ITransaction;
  } & servicesMap;
}
