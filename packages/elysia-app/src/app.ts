import './shared/metrics/instrument';
import { swagger } from '@elysiajs/swagger';
import Elysia, { StatusMap } from 'elysia';
import { cors } from '@elysiajs/cors';
import { appModules, servicesMap } from './app.module';
import { transactionDerive } from './database/transaction';
import { env } from './conf/env';
import { Logger } from './shared/logger/logger';
import { seed } from './database/runners/seed';
import { eventBusPlugin } from './shared/plugins/event-bus.plugin';
import { initializeI18n } from './shared/i18n/i18n.config';
import { AppError, isAppError } from './shared/Errors/AppError';
import { PostgresError, isDatabaseError } from './shared/Errors/PostgresError';
import { EventError } from './shared/Errors/EventError';
import { CronError } from './shared/Errors/CronError';

import { roleController } from './modules/roles/role.controller';
import { userController } from './modules/users/user.controller';
import { tenantController } from './modules/tenants/tenant.controller';
import { notificationController } from './modules/notifications/notification.controller';

import { TContext } from './shared/types/context';
import { eventBus } from './core/event-bus';
import { posthog } from './shared/metrics/posthug';
import { LanguagesEnum } from './shared/constants/i18n';
import { LANGUAGE_HEADER } from './shared/constants/headers';
import { createTypeSafeI18nService } from './shared/i18n/type-safe-i18n.service';
import { requestID } from 'elysia-requestid';

const prefix = '/api';

export type ErrorResponse = {
  message: string;
  errors?: any;
};

export const app = new Elysia<typeof prefix, TContext>({ prefix })
.use(cors({
  origin: ['http://localhost:5176', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5173'],         
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', "Accept", "accept-language"], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}))
  .error({ AppError, PostgresError, EventError, CronError })
  .use(requestID())
  .use(swagger({ path: '/docs' }))
  .use(eventBusPlugin)
  .onAfterHandle((ctx) => {
    ctx.store.trx.commit();
  })
  .error({ AppError, PostgresError, EventError, CronError })
  .onError((ctx): ErrorResponse => {
    Logger.error(ctx.error);
    try {
      ctx.store.trx.rollback();
      if (isAppError(ctx.error)) {
        ctx.set.status = ctx.error.statusCode;
        return {
          message: ctx.store.i18n.error(ctx.error.error),
        };
      }
      if (isDatabaseError(ctx.error)) {
        ctx.set.status = 500;
        const message = ctx.store.i18n.error('database_error');
        return {
          message,
        };
      }
    } catch (e) {
      Logger.error(e);
    }
    if (ctx.set.status === StatusMap['Unprocessable Content']) {
      const message = ctx.store.i18n.error('validation_failed');
      return {
        errors: JSON.parse((ctx.error as Error).message),
        message,
      };
    } else {
      const message = ctx.store.i18n.error('internal_server_error');
      return {
        message,
      };
    }
  })
  .derive(({ headers, store }) => {
    let locale = LanguagesEnum.en;
    if (headers[LANGUAGE_HEADER]) {
      const acceptLanguage = headers[LANGUAGE_HEADER];
      if (
        Object.values(LanguagesEnum).includes(acceptLanguage as LanguagesEnum)
      ) {
        locale = acceptLanguage as LanguagesEnum;
      }
    }
    const i18n = createTypeSafeI18nService();
    i18n.changeLanguage(locale);
    return {
      store: {
        ...store,
        i18n,
        locale,
      },
    };
  })
  
  .use(eventBusPlugin)
  .derive(async ({ store }) => {
    const trx = await transactionDerive();

    const localStore: Record<string, unknown> = {};
    const repos = appModules.map((module) => module.repositories);
    const services = appModules.map((module) => module.services);

    for (const repo of repos) {
      for (const [key, value] of Object.entries(repo)) {
        localStore[key] = new value.import(trx);
      }
    }

    for (const service of services) {
      for (const [key, value] of Object.entries(service)) {
        const deps = value.inject.map(
          (key: { name: string }) => localStore[key.name]
        );
        if (value.inject.length !== deps.filter(Boolean).length) {
          // Note: This error occurs during app initialization, before i18n is available
          throw new Error(`Missing dependencies for ${key}`);
        }
        const instance = new value.import(...deps);
        localStore[key] = instance;
      }
    }

    return {
      store: {
        ...store,
        trx,
        ...(localStore as servicesMap),
      },
    };
  })

  .use(tenantController)
  .use(roleController)
  .use(userController)
  .use(notificationController);

export type App = typeof app;

export type Role = typeof roleController;

export type User = typeof userController;

const main = async () => {
  await initializeI18n();

  await seed();

  app.listen(env.PORT, () => {
    Logger.info(`🚀 Elysia API running on http://localhost:${env.PORT}/api`);
    Logger.info(`🚀 Docs running on http://localhost:${env.PORT}/api/docs`);
  });

  app.onStop(() => {
    posthog.shutdown();
  });
};

main();

declare module 'elysia' {
  interface Elysia {
    eventBus: typeof eventBus;
  }
}
