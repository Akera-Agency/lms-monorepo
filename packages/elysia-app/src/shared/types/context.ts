import { SingletonBase } from 'elysia';
import { servicesMap } from '../../app.module';
import { ITransaction } from 'src/database/types/transaction';
import { TypeSafeI18nService } from '../i18n/type-safe-i18n.service';
import { LanguagesEnum } from '../constants/i18n';

export interface TContext extends SingletonBase {
  store: {
    i18n: TypeSafeI18nService;
    locale: LanguagesEnum;
    trx: ITransaction;
  } & servicesMap;
}
