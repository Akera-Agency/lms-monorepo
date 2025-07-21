import { Kysely } from "kysely";
import { IDb } from "../../database/types/IDb";
import { UserEntity, NewUser, UpdateUser } from "./entity/user.entity";
import { BaseRepo, FindManyArgs } from "../../shared/types/base.repo";

export class UserRepository extends BaseRepo {
  constructor(db: Kysely<IDb>) {
    super(db, "users");
  }

  async findOne(
    args: FindManyArgs<UserEntity>
  ): Promise<UserEntity | undefined> {
    return this.db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  }

  async create(data: NewUser): Promise<UserEntity> {
    const [inserted] = await this.db
      .insertInto("users")
      .values(data)
      .returningAll()
      .execute();
    return inserted;
  }

  async update(id: string, data: UpdateUser): Promise<UserEntity | undefined> {
    const [updated] = await this.db
      .updateTable("users")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .execute();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.deleteFrom("users").where("id", "=", id).execute();
  }
}
