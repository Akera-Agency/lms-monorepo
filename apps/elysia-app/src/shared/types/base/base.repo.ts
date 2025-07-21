import {
  COMPARISON_OPERATORS,
  Insertable,
  Kysely,
  Selectable,
  Updateable,
} from "kysely";
import { InfinityPaginationResultType } from "../InfinityPaginationResultType";
import { IDb } from "../../../database/types/IDb";
import { BaseQuery } from "./base.query";

type UpdateArgs<TEntity, UpdateDto> = {
  where: FindArgs<TEntity>[];
  payload: UpdateDto;
};

export type FindManyArgs<TEntity> = {
  where: FindArgs<TEntity>[];
};

type FindArgs<TEntity> = {
  column: keyof TEntity;
  value: TEntity[keyof TEntity];
  operator: (typeof COMPARISON_OPERATORS)[number];
};

export class BaseRepo<TEntity extends IDb[keyof IDb]> {
  trx: Kysely<IDb>;
  entityName: keyof IDb;
  constructor(trx: Kysely<IDb>, entityName: keyof IDb) {
    this.trx = trx;
    this.entityName = entityName;
  }
  findMany?(
    args: FindManyArgs<Selectable<TEntity>>,
    ...other_args: unknown[]
  ): Promise<Selectable<TEntity>[]>;
  findOne?(
    args: FindManyArgs<Selectable<TEntity>>,
    ...other_args: unknown[]
  ): Promise<Selectable<TEntity> | null>;
  findManyWithPagination?(
    query: BaseQuery<TEntity>,
    ...args: unknown[]
  ): Promise<InfinityPaginationResultType<Selectable<TEntity>>>;
  createOne?(
    payload: Insertable<TEntity>,
    ...other_args: unknown[]
  ): Promise<Selectable<TEntity> | null>;
  updateOne?(
    args: UpdateArgs<Selectable<TEntity>, Updateable<TEntity>>,
    ...other_args: unknown[]
  ): Promise<Selectable<TEntity> | null>;
  deleteOne?(
    args: FindManyArgs<Selectable<TEntity>>,
    ...other_args: unknown[]
  ): Promise<void>;
  createMany?(
    payload: Insertable<TEntity>[],
    ...other_args: unknown[]
  ): Promise<Selectable<TEntity>[]>;
  deleteMany?(
    args: FindManyArgs<Selectable<TEntity>>,
    ...other_args: unknown[]
  ): Promise<void>;
}
