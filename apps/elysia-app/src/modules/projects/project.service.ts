import { ProjectRepository } from './infrastructure/project.repository';
import { TaskRepository } from './infrastructure/task.repository';
import { CommentRepository } from './infrastructure/comment.repository';
import { UserService } from '../users/user.service';
import {
  NewProject,
  QueryProject,
  UpdateProject,
} from './infrastructure/project.entity';
import { NewTask, UpdateTask } from './infrastructure/task.entity';
import { NewComment, UpdateComment } from './infrastructure/comment.entity';
import { BaseService } from '../../shared/types/base/base.service';

export class ProjectService extends BaseService {
  constructor(
    private projectRepository: ProjectRepository,
    private taskRepository: TaskRepository,
    private commentRepository: CommentRepository,
    private userService: UserService
  ) {
    super();
  }

  // Project operations
  findProjectsWithPagination(query: QueryProject) {
    return this.projectRepository.findManyWithPagination(query);
  }

  findProjectById(id: string) {
    return this.projectRepository.findOne({
      where: [{ column: 'id', operator: '=', value: id }],
    });
  }

  findProjectsByOwnerId(ownerId: string) {
    return this.projectRepository.findAll({
      where: [{ column: 'owner_id', operator: '=', value: ownerId }],
    });
  }

  async createProject(data: NewProject) {
    // Verify owner exists
    const owner = await this.userService.findOne(data.owner_id);
    if (!owner) {
      throw new Error('Owner does not exist');
    }

    return this.projectRepository.create(data);
  }

  updateProject(id: string, data: UpdateProject) {
    return this.projectRepository.update(id, data);
  }

  deleteProject(id: string) {
    return this.projectRepository.delete(id);
  }

  // Task operations
  findTasksByProjectId(projectId: string) {
    return this.taskRepository.findByProjectId(projectId);
  }

  findTaskById(id: string) {
    return this.taskRepository.findOne({
      where: [{ column: 'id', operator: '=', value: id }],
    });
  }

  async createTask(data: NewTask) {
    // Verify project exists
    const project = await this.findProjectById(data.project_id);
    if (!project) {
      throw new Error('Project does not exist');
    }

    // Verify assignee exists if provided
    if (data.assignee_id) {
      const assignee = await this.userService.findOne(data.assignee_id);
      if (!assignee) {
        throw new Error('Assignee does not exist');
      }
    }

    return this.taskRepository.create(data);
  }

  updateTask(id: string, data: UpdateTask) {
    return this.taskRepository.update(id, data);
  }

  deleteTask(id: string) {
    return this.taskRepository.delete(id);
  }

  // Comment operations
  findCommentsByTaskId(taskId: string) {
    return this.commentRepository.findByTaskId(taskId);
  }

  findCommentById(id: string) {
    return this.commentRepository.findOne({
      where: [{ column: 'id', operator: '=', value: id }],
    });
  }

  async createComment(data: NewComment) {
    // Verify task exists
    const task = await this.findTaskById(data.task_id);
    if (!task) {
      throw new Error('Task does not exist');
    }

    // Verify user exists
    const user = await this.userService.findOne(data.user_id);
    if (!user) {
      throw new Error('User does not exist');
    }

    return this.commentRepository.create(data);
  }

  updateComment(id: string, data: UpdateComment) {
    return this.commentRepository.update(id, data);
  }

  deleteComment(id: string) {
    return this.commentRepository.delete(id);
  }

  // Complex operations that use multiple repositories
  async getProjectWithTasksAndComments(projectId: string) {
    const project = await this.findProjectById(projectId);
    if (!project) {
      return null;
    }

    const tasks = await this.findTasksByProjectId(projectId);

    const tasksWithComments = await Promise.all(
      tasks.map(async (task) => {
        const comments = await this.findCommentsByTaskId(task.id);
        return {
          ...task,
          comments,
        };
      })
    );

    return {
      ...project,
      tasks: tasksWithComments,
    };
  }
}
