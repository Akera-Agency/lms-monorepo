import { COMPARISON_OPERATORS, Selectable } from 'kysely';
import { IDb } from '../../../database/types/IDb';

type FindArgs<TEntity> = {
  column: keyof TEntity;
  value: TEntity[keyof TEntity];
  operator: (typeof COMPARISON_OPERATORS)[number];
};
export interface BaseQuery<TEntity extends IDb[keyof IDb]> {
  search?: FindArgs<Selectable<TEntity>>[];
  filter?: FindArgs<Selectable<TEntity>>[];
  orderBy?: FindArgs<Selectable<TEntity>>[];
  sort?: {
    orderBy: keyof TEntity;
    sort: 'asc' | 'desc';
  }[];
  page?: number;
  limit?: number;
}
