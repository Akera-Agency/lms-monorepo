import { Kysely } from 'kysely';
import { IDb } from '../../../database/types/IDb';
import {
  TaskEntity,
  NewTask,
  UpdateTask,
  KyselyTaskEntity,
  QueryTask,
} from './task.entity';
import { BaseRepo, FindManyArgs } from '../../../shared/types/base/base.repo';
import { PostgresError } from '../../../shared/Errors/PostgresError';
import { infinityPagination } from '../../../shared/utils/infinityPagination';

export class TaskRepository extends BaseRepo<KyselyTaskEntity> {
  constructor(trx: Kysely<IDb>) {
    super(trx, 'tasks');
  }

  override async findManyWithPagination(query: QueryTask) {
    try {
      const queryBuilder = this.trx
        .selectFrom('tasks')
        .$if(!!query.filter, (q) =>
          q.where((eb) =>
            eb.and(
              query.filter?.map((arg) =>
                eb(arg.column, arg.operator, arg.value)
              ) || []
            )
          )
        )
        .$if(!!query.search, (q) =>
          q.where((e) =>
            e.or(
              query.search?.map((arg) =>
                e(arg.column, arg.operator, arg.value)
              ) || []
            )
          )
        );

      const [res, total] = await Promise.all([
        queryBuilder
          .$if(!!query.sort, (q) =>
            query.sort!.reduce(
              (qb, arg) => qb.orderBy(arg.orderBy, arg.sort),
              q
            )
          )
          .$if(!!query.limit, (q) => q.limit(query.limit as number))
          .$if(!!query.limit && !!query.page, (q) =>
            q.offset(((query.page as number) - 1) * (query.limit as number))
          )
          .selectAll('tasks')
          .execute(),
        queryBuilder
          .select(this.trx.fn.countAll('tasks').as('count'))
          .executeTakeFirst(),
      ]);
      return infinityPagination(res, {
        total_count: Number(total?.count ?? 0),
        page: query.page,
        limit: query.limit,
      });
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async findByProjectId(projectId: string) {
    try {
      const res = await this.trx
        .selectFrom('tasks')
        .selectAll()
        .where('project_id', '=', projectId)
        .execute();
      return res;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  override async findOne(args: FindManyArgs<TaskEntity>) {
    try {
      const res = await this.trx
        .selectFrom('tasks')
        .selectAll()
        .where((eb) =>
          eb.and(
            args.where.map((arg) => {
              return eb(arg.column, arg.operator, arg.value);
            })
          )
        )
        .executeTakeFirst();
      return res ?? null;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async create(data: NewTask) {
    try {
      const [inserted] = await this.trx
        .insertInto('tasks')
        .values(data)
        .returningAll()
        .execute();
      return inserted;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async update(id: string, data: UpdateTask) {
    try {
      const [updated] = await this.trx
        .updateTable('tasks')
        .set(data)
        .where('id', '=', id)
        .returningAll()
        .execute();
      return updated;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async delete(id: string) {
    try {
      await this.trx.deleteFrom('tasks').where('id', '=', id).execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }
}
