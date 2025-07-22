import { KyselyUserEntity } from '../../modules/users/infrastructure/user.entity';
import { KyselyTodoEntity } from '../../modules/todos/infrastructure/todo.entity';
import { KyselyProjectEntity } from '../../modules/projects/infrastructure/project.entity';
import { KyselyTaskEntity } from '../../modules/projects/infrastructure/task.entity';
import { KyselyCommentEntity } from '../../modules/projects/infrastructure/comment.entity';

export interface IDb {
  users: KyselyUserEntity;
  todos: KyselyTodoEntity;
  projects: KyselyProjectEntity;
  tasks: KyselyTaskEntity;
  comments: KyselyCommentEntity;
}
