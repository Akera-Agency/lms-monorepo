import { SingletonBase } from 'elysia';
import { servicesMap } from '../../app.module';
import { ITransaction } from 'src/database/types/transaction';

export interface TContext extends SingletonBase {
  store: {
    trx: ITransaction;
  } & servicesMap;
}
