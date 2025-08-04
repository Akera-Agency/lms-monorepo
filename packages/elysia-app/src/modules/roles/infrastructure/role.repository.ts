import { Kysely } from 'kysely';
import { IDb } from '../../../database/types/IDb';
import {
  RoleEntity,
  NewRole,
  UpdateRole,
  QueryRole,
  KyselyRoleEntity,
} from './role.entity';
import { BaseRepo, FindManyArgs } from '../../../shared/types/base/base.repo';
import { PostgresError } from '../../../shared/Errors/PostgresError';
import { infinityPagination } from 'src/shared/utils/infinityPagination';

export class RoleRepository extends BaseRepo<KyselyRoleEntity> {
  constructor(trx: Kysely<IDb>) {
    super(trx, 'roles');
  }

  async findAll(args: FindManyArgs<RoleEntity>) {
    try {
      const res = await this.trx
        .selectFrom('roles')
        .selectAll()
        .where('deleted_at', 'is', null)
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

  override async findManyWithPagination(query: QueryRole) {
    try {
      const queryBuilder = this.trx
        .selectFrom('roles')
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
          .selectAll('roles')
          .execute(),
        queryBuilder
          .select(this.trx.fn.countAll('roles').as('count'))
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

  override async findOne(args: FindManyArgs<RoleEntity>) {
    try {
      const res = await this.trx
        .selectFrom('roles')
        .selectAll()
        .where('deleted_at', 'is', null)
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

  async create(data: NewRole) {
    try {
      const [inserted] = await this.trx
        .insertInto('roles')
        .values(data)
        .returningAll()
        .execute();
      return inserted;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async update(id: string, data: UpdateRole) {
    try {
      const [updated] = await this.trx
        .updateTable('roles')
        .set(data)
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .returningAll()
        .execute();
      return updated;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async delete(id: string) {
    try {
      await this.trx
        .updateTable('roles')
        .set({ deleted_at: new Date() })
        .where('id', '=', id)
        .execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }
}
