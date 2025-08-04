import { IDb } from './IDb';
import { Kysely } from 'kysely';
export interface ITransaction extends Kysely<IDb> {
  commit: () => void;
  rollback: () => void;
}
