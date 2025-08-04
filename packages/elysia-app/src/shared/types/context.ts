import { SingletonBase } from 'elysia';
import { initTools } from '../../app';
import { ITransaction } from '../../database/types/transaction';
import { servicesMap } from '../../app.module';

export interface TContext extends SingletonBase {
  tools: Awaited<ReturnType<typeof initTools>>;
  store: {
    trx: ITransaction;
  } & servicesMap;
}
