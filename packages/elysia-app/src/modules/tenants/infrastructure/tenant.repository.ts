import { Kysely } from 'kysely';
import { IDb } from '../../../database/types/IDb';
import {
  TenantEntity,
  NewTenant,
  UpdateTenant,
  KyselyTenantEntity,
  QueryTenant,
} from './tenant.entity';
import { BaseRepo, FindManyArgs } from '../../../shared/types/base/base.repo';
import { infinityPagination } from '../../../shared/utils/infinityPagination';
import { PostgresError } from '../../../shared/Errors/PostgresError';
import { NewTenantUser, QueryTenantUser, UpdateTenantUser } from './tenant-user.entity';

export class TenantRepository extends BaseRepo<KyselyTenantEntity> {
  constructor(trx: Kysely<IDb>) {
    super(trx, 'tenants');
  }

  override async findManyWithPagination(query: QueryTenant) {
    try {
      const queryBuilder = this.trx
        .selectFrom('tenants')
        .where('deleted_at', 'is', null)
        .$if(!!query.filter, (q) =>
          q.where((eb) =>
            eb.and(query.filter?.map((arg) => eb(arg.column, arg.operator, arg.value)) || []),
          ),
        )
        .$if(!!query.search, (q) =>
          q.where((e) =>
            e.or(query.search?.map((arg) => e(arg.column, arg.operator, arg.value)) || []),
          ),
        );

      const [res, total] = await Promise.all([
        queryBuilder
          .$if(!!query.sort, (q) =>
            query.sort!.reduce((qb, arg) => qb.orderBy(arg.orderBy, arg.sort), q),
          )
          .$if(!!query.limit, (q) => q.limit(query.limit as number))
          .$if(!!query.limit && !!query.page, (q) =>
            q.offset(((query.page as number) - 1) * (query.limit as number)),
          )
          .selectAll('tenants')
          .execute(),
        queryBuilder.select(this.trx.fn.countAll('tenants').as('count')).executeTakeFirst(),
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

  async findAll(args: FindManyArgs<TenantEntity>) {
    try {
      const res = await this.trx
        .selectFrom('tenants')
        .selectAll()
        .where('deleted_at', 'is', null)
        .where((eb) =>
          eb.and(
            args.where.map((arg) => {
              return eb(arg.column, arg.operator, arg.value);
            }),
          ),
        )
        .execute();
      return res;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  override async findOne(args: FindManyArgs<TenantEntity>) {
    try {
      const res = await this.trx
        .selectFrom('tenants')
        .selectAll()
        .where('deleted_at', 'is', null)
        .where((eb) => eb.and(args.where.map((arg) => eb(arg.column, arg.operator, arg.value))))
        .executeTakeFirst();
      return res ?? null;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async create(data: NewTenant) {
    try {
      const [inserted] = await this.trx.insertInto('tenants').values(data).returningAll().execute();
      return inserted;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async update(id: string, data: UpdateTenant) {
    try {
      const [updated] = await this.trx
        .updateTable('tenants')
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
        .updateTable('tenants')
        .set({ deleted_at: new Date(), name: null })
        .where('id', '=', id)
        .execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async addUsersToTenant(args: NewTenantUser[]) {
    try {
      const [inserted] = await this.trx
        .insertInto('tenant_users')
        .values(args)
        .returningAll()
        .execute();
      return inserted;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async updateUserInTenant(args: UpdateTenantUser) {
    try {
      const [updated] = await this.trx
        .updateTable('tenant_users')
        .set(args)
        .returningAll()
        .execute();
      return updated;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async removeUsersFromTenant(args: { tenant_id: string; user_ids: string[] }) {
    try {
      await this.trx
        .deleteFrom('tenant_users')
        .where('tenant_id', '=', args.tenant_id)
        .where('user_id', 'in', args.user_ids)
        .execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async getTenantUsersWithInfinityPagination(tenantId: string, query: QueryTenantUser) {
    try {
      const queryBuilder = this.trx
        .selectFrom('tenant_users')
        .selectAll()
        .where('tenant_id', '=', tenantId)
        .$if(!!query.filter, (q) =>
          q.where((eb) =>
            eb.and(query.filter?.map((arg) => eb(arg.column, arg.operator, arg.value)) || []),
          ),
        )
        .$if(!!query.search, (q) =>
          q.where((e) =>
            e.or(query.search?.map((arg) => e(arg.column, arg.operator, arg.value)) || []),
          ),
        );

      const [res, total] = await Promise.all([
        queryBuilder
          .$if(!!query.sort, (q) =>
            query.sort!.reduce((qb, arg) => qb.orderBy(arg.orderBy, arg.sort), q),
          )
          .$if(!!query.limit, (q) => q.limit(query.limit as number))
          .$if(!!query.limit && !!query.page, (q) =>
            q.offset(((query.page as number) - 1) * (query.limit as number)),
          )
          .execute(),
        queryBuilder.select(this.trx.fn.countAll().as('count')).executeTakeFirst(),
      ]);

      return infinityPagination(res, {
        total_count: Number(total?.count ?? 0),
        page: query.page,
        limit: query.limit,
      });
    } catch (error) {
      throw new PostgresError(error);
    }
  }
}
