import { Kysely } from 'kysely';
import { IDb } from '../../../database/types/IDb';
import {
  UserEntity,
  UpdateUser,
  KyselyUserEntity,
  QueryUser,
} from './user.entity';
import { BaseRepo, FindManyArgs } from '../../../shared/types/base/base.repo';
import { infinityPagination } from '../../../shared/utils/infinityPagination';
import { PostgresError } from '../../../shared/Errors/PostgresError';

export class UserRepository extends BaseRepo<KyselyUserEntity> {
  constructor(trx: Kysely<IDb>) {
    super(trx, 'users');
  }

  override async findManyWithPagination(query: QueryUser) {
    try {
      const queryBuilder = this.trx
        .selectFrom('users')
        .where('deleted_at', 'is', null)
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
        )
        .$if(!!query.tenantId, (q) =>
          q
            .innerJoin('tenant_users', 'tenant_users.user_id', 'users.id')
            .where('tenant_users.tenant_id', '=', query.tenantId!)
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
          .selectAll('users')
          .execute(),
        queryBuilder
          .select(this.trx.fn.countAll('users').as('count'))
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

  async findAll(args: FindManyArgs<UserEntity>) {
    try {
      const res = await this.trx
        .selectFrom('users')
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

  override async findOne(
    args: FindManyArgs<UserEntity> & { tenantId?: string }
  ) {
    try {
      const res = await this.trx
        .selectFrom('users')
        .selectAll()
        .where('deleted_at', 'is', null)
        .where((eb) =>
          eb.and(
            args.where.map((arg) => eb(arg.column, arg.operator, arg.value))
          )
        )
        .$if(!!args.tenantId, (q) =>
          q
            .innerJoin('tenant_users', 'tenant_users.user_id', 'users.id')
            .where('tenant_users.tenant_id', '=', args.tenantId!)
        )
        .executeTakeFirst();
      return res ?? null;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async update(id: string, data: UpdateUser) {
    try {
      const [updated] = await this.trx
        .updateTable('users')
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
        .updateTable('users')
        .set({ deleted_at: new Date() })
        .where('id', '=', id)
        .execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }
}
