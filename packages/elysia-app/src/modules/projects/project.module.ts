import { ProjectService } from './project.service';
import { ProjectRepository } from './infrastructure/project.repository';
import { TaskRepository } from './infrastructure/task.repository';
import { CommentRepository } from './infrastructure/comment.repository';
import { UserService } from '../users/user.service';
import { BaseModule } from '../../shared/types/base/base.module';
import { projectController } from './project.controller';

export const projectModule = {
  repositories: {
    ProjectRepository: {
      import: ProjectRepository,
    },
    TaskRepository: {
      import: TaskRepository,
    },
    CommentRepository: {
      import: CommentRepository,
    },
  },
  services: {
    ProjectService: {
      import: ProjectService,
      inject: [
        ProjectRepository,
        TaskRepository,
        CommentRepository,
        UserService,
      ],
    },
  },
  controllers: [projectController],
} satisfies BaseModule;
