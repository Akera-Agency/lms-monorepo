import { Kysely } from 'kysely';
import { IDb } from '../../../database/types/IDb';
import {
  Activity,
  NewActivity,
  UpdateActivity,
  KyselyActivityEntity,
  QueryActivity,
  ActivityTypeEnum,
} from './activity.entity';
import { BaseRepo, FindManyArgs } from '../../../shared/types/base/base.repo';
import { infinityPagination } from '../../../shared/utils/infinityPagination';
import { PostgresError } from '../../../shared/Errors/PostgresError';

export class ActivityRepository extends BaseRepo<KyselyActivityEntity> {
  constructor(trx: Kysely<IDb>) {
    super(trx, 'activities');
  }

  override async findManyWithPagination(query: QueryActivity) {
    try {
      const queryBuilder = this.trx
        .selectFrom('activities')
        .where('deleted_at', 'is', null)
        .$if(!!query.filter, (q) =>
          q.where((eb) =>
            eb.and(
              query.filter?.map((arg) =>
                eb(arg.column, arg.operator, arg.value),
              ) || [],
            ),
          ),
        )
        .$if(!!query.search, (q) =>
          q.where((e) =>
            e.or(
              query.search?.map((arg) =>
                e(arg.column, arg.operator, arg.value),
              ) || [],
            ),
          ),
        );

      const [res, total] = await Promise.all([
        queryBuilder
          .$if(!!query.sort, (q) =>
            query.sort!.reduce(
              (qb, arg) => qb.orderBy(arg.orderBy, arg.sort),
              q,
            ),
          )
          .$if(!query.sort, (q) => q.orderBy('created_at', 'desc'))
          .$if(!!query.limit, (q) => q.limit(query.limit as number))
          .$if(!!query.limit && !!query.page, (q) =>
            q.offset(((query.page as number) - 1) * (query.limit as number)),
          )
          .selectAll('activities')
          .execute(),
        queryBuilder
          .select(this.trx.fn.countAll('activities').as('count'))
          .executeTakeFirst(),
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

  async create(payload: NewActivity): Promise<Activity> {
    try {
      const result = await this.trx
        .insertInto('activities')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow();

      return result;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async update(id: string, payload: UpdateActivity): Promise<Activity | null> {
    try {
      const result = await this.trx
        .updateTable('activities')
        .set(payload)
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .returningAll()
        .executeTakeFirst();

      return result || null;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  override async deleteOne(args: FindManyArgs<Activity>): Promise<void> {
    try {
      const queryBuilder = this.trx.updateTable('activities').set({
        deleted_at: new Date(),
      });

      for (const arg of args.where) {
        queryBuilder.where(arg.column, arg.operator, arg.value);
      }

      await queryBuilder.where('deleted_at', 'is', null).execute();
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  override async findOne(
    args: FindManyArgs<Activity>,
  ): Promise<Activity | null> {
    try {
      const queryBuilder = this.trx
        .selectFrom('activities')
        .where('deleted_at', 'is', null);

      for (const arg of args.where) {
        queryBuilder.where(arg.column, arg.operator, arg.value);
      }

      const result = await queryBuilder.selectAll().executeTakeFirst();
      return result || null;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async findAll(args: FindManyArgs<Activity>): Promise<Activity[]> {
    try {
      const queryBuilder = this.trx
        .selectFrom('activities')
        .where('deleted_at', 'is', null);

      for (const arg of args.where) {
        queryBuilder.where(arg.column, arg.operator, arg.value);
      }

      const result = await queryBuilder
        .selectAll()
        .orderBy('created_at', 'desc')
        .execute();

      return result;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async findByUserId(userId: string): Promise<Activity[]> {
    try {
      const result = await this.trx
        .selectFrom('activities')
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .selectAll()
        .orderBy('created_at', 'desc')
        .execute();

      return result;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async findByUserIdAndType(
    userId: string,
    type: ActivityTypeEnum,
  ): Promise<Activity[]> {
    try {
      const result = await this.trx
        .selectFrom('activities')
        .where('user_id', '=', userId)
        .where('type', '=', type)
        .where('deleted_at', 'is', null)
        .selectAll()
        .orderBy('created_at', 'desc')
        .execute();

      return result;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async getTotalXpByUserId(userId: string): Promise<number> {
    try {
      const result = await this.trx
        .selectFrom('activities')
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .select((eb) => eb.fn.sum<number>('earned_xp').as('total_xp'))
        .executeTakeFirst();

      return result?.total_xp || 0;
    } catch (error) {
      throw new PostgresError(error);
    }
  }

  async getXpByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    try {
      const result = await this.trx
        .selectFrom('activities')
        .where('user_id', '=', userId)
        .where('created_at', '>=', startDate)
        .where('created_at', '<=', endDate)
        .where('deleted_at', 'is', null)
        .select((eb) => eb.fn.sum<number>('earned_xp').as('total_xp'))
        .executeTakeFirst();

      return result?.total_xp || 0;
    } catch (error) {
      throw new PostgresError(error);
    }
  }
}
