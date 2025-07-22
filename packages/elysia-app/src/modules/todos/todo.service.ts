import { TodoRepository } from "./infrastructure/todo.repository";
import { NewTodo, QueryTodo, UpdateTodo } from "./infrastructure/todo.entity";
import { BaseService } from "../../shared/types/base/base.service";

export class TodoService implements BaseService {
  constructor(private todoRepository: TodoRepository) {}

  findManyWithPagination(query: QueryTodo) {
    return this.todoRepository.findManyWithPagination(query);
  }

  findAll(user_id: string) {
    return this.todoRepository.findAll({
      where: [{ column: "user_id", operator: "=", value: user_id }],
    });
  }

  findOne(id: string) {
    return this.todoRepository.findOne({
      where: [{ column: "id", operator: "=", value: id }],
    });
  }

  create(data: NewTodo) {
    return this.todoRepository.create(data);
  }

  update(id: string, data: UpdateTodo) {
    return this.todoRepository.update(id, data);
  }

  delete(id: string) {
    return this.todoRepository.delete(id);
  }
}
