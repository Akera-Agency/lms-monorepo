import { KyselyUserEntity } from "../../modules/users/infrastructure/user.entity";
import { KyselyTodoEntity } from "../../modules/todos/infrastructure/todo.entity";

export interface IDb {
  users: KyselyUserEntity;
  todos: KyselyTodoEntity;
}
