import { Kysely } from "kysely";
import { IDb } from "../../database/types/IDb";
import { TodoEntity, NewTodo, UpdateTodo } from "./entity/todo.entity";
import { BaseRepo, FindManyArgs } from "../../shared/types/base.repo";

export class TodoRepository extends BaseRepo {
  constructor(db: Kysely<IDb>) {
    super(db, "todos");
  }

  async findAll(user_id?: string): Promise<TodoEntity[]> {
    let query = this.db.selectFrom("todos").selectAll();
    if (user_id) {
      query = query.where("user_id", "=", user_id);
    }
    return query.execute();
  }

  async findOne(
    args: FindManyArgs<TodoEntity>
  ): Promise<TodoEntity | null> {
    let query = this.db.selectFrom("todos").selectAll();
    for (const arg of args.where) {
      query = query.where(arg.column, arg.operator, arg.value);
    }
    return query.executeTakeFirst();
  }

  async create(data: NewTodo): Promise<TodoEntity> {
    const [inserted] = await this.db
      .insertInto("todos")
      .values(data)
      .returningAll()
      .execute();
    return inserted;
  }

  async update(id: string, data: UpdateTodo): Promise<TodoEntity | undefined> {
    const [updated] = await this.db
      .updateTable("todos")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .execute();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.deleteFrom("todos").where("id", "=", id).execute();
  }
}
