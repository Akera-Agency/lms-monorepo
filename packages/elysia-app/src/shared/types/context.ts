import { SingletonBase } from 'elysia';
import { initTools } from '../../app';
import { servicesMap } from '../../app.module';
import { ITransaction } from 'src/database/types/transaction';

export interface TContext extends SingletonBase {
  tools: Awaited<ReturnType<typeof initTools>>;
  store: {
    trx: ITransaction;
  } & servicesMap;
}
