import { database } from './datasource';
import { ITransaction } from './types/transaction';
import { beginTransaction } from './utils/beginTransaction';

export const transactionDerive = async (): Promise<ITransaction> => {
  const trx = await beginTransaction(database);
  return trx;
};
