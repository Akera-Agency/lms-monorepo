import { Kysely } from 'kysely';
import { IDb } from '../../../database/types/IDb';
import {
  ProjectEntity,
  NewProject,
  UpdateProject,
  KyselyProjectEntity,
  QueryProject,
} from './project.entity';
import { BaseRepo, FindManyArgs } from '../../../shared/types/base/base.repo';
import { PostgresError } from '../../../shared/Errors/PostgresError';
import { infinityPagination } from '../../../shared/utils/infinityPagination';

export class ProjectRepository extends BaseRepo<KyselyProjectEntity> {
  constructor(trx: Kysely<IDb>) {
    super(trx, 'projects');
  }

  override async findManyWithPagination(query: QueryProject) {
    try {
      const queryBuilder = this.trx
        .selectFrom('projects')
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
          .selectAll('projects')
          .execute(),
        queryBuilder
          .select(this.trx.fn.countAll('projects').as('count'))
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

  async findAll(args: FindManyArgs<ProjectEntity>) {
    try {
      const res = await this.trx
        .selectFrom('projects')
        .selectAll()
        .where((eb) =>
          eb.and(
            args.where.map((arg) => {
              return eb(arg.column, arg.operator, arg.value);
            })
          )
        )
        .execute();
      return res;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  override async findOne(args: FindManyArgs<ProjectEntity>) {
    try {
      const res = await this.trx
        .selectFrom('projects')
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

  async create(data: NewProject) {
    try {
      const [inserted] = await this.trx
        .insertInto('projects')
        .values(data)
        .returningAll()
        .execute();
      return inserted;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async update(id: string, data: UpdateProject) {
    try {
      const [updated] = await this.trx
        .updateTable('projects')
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
      await this.trx.deleteFrom('projects').where('id', '=', id).execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }
}
