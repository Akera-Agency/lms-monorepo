import { swagger } from '@elysiajs/swagger';
import Elysia from 'elysia';
import { cors } from '@elysiajs/cors';
import { appModules, servicesMap } from './app.module';
import { transactionDerive } from './database/transaction';
import { env } from './conf/env';
import { Logger } from './shared/logger/logger';
import { TContext } from './shared/types/context';
import { seed } from './database/runners/seed';
import { eventBusPlugin } from './plugins/event-bus.plugin';
import { AppError, isAppError } from './shared/Errors/AppError';
import { PostgresError, isDatabaseError } from './shared/Errors/PostgresError';
import { EventError } from './shared/Errors/EventError';
import { CronError } from './shared/Errors/CronError';

import { roleController } from './modules/roles/role.controller';
import { userController } from './modules/users/user.controller';
import { tenantController } from './modules/tenants/tenant.controller';
import { notificationController } from './modules/notifications/notification.controller';


const prefix = '/api';

export const app = new Elysia<typeof prefix, TContext>({ prefix })
.use(cors({
  origin: ['http://localhost:5176', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5173'],         
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))
  .error({ AppError, PostgresError, EventError, CronError })
  .onAfterHandle((ctx) => {
    ctx.store.trx.commit();
  })
  .onError((ctx) => {
    Logger.error(ctx.error);
    try {
      ctx.store.trx.rollback();
      if (isAppError(ctx.error)) {
        ctx.set.status = ctx.error.statusCode;
        return {
          message: ctx.error.error,
        };
      }
      if (isDatabaseError(ctx.error)) {
        ctx.set.status = 500;
        return {
          message: ctx.error.message,
        };
      }
    } catch (e) {
      Logger.error(e);
    }
    return {
      message: 'Internal server error',
    };
  })
  
  .use(eventBusPlugin)
  .use(swagger({ path: '/docs' }))
  .derive(async () => {
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
          throw new Error(`Missing dependencies for ${key}`);
        }
        const instance = new value.import(...deps);
        localStore[key] = instance;
      }
    }

    return {
      store: {
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
  await seed();

  app.listen(env.PORT, () => {
    Logger.info(`🚀 Elysia API running on http://localhost:${env.PORT}/api`);
    Logger.info(`🚀 Docs running on http://localhost:${env.PORT}/api/docs`);
  });
};

main();