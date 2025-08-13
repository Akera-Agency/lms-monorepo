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

const prefix = '/api';

export const app = new Elysia<typeof prefix, TContext>({ prefix })
  .onAfterHandle((ctx) => {
    try {
      ctx.store?.trx?.commit?.();
    } catch (e) {
      Logger.error(e);
      ctx.store?.trx?.rollback?.();
    }
  })
  .onError((ctx) => {
    Logger.error(ctx.error);
    try {
      ctx.store?.trx?.rollback?.();
    } catch (e) {
      Logger.error(e);
    }
  })
  .use(cors())
  .use(eventBusPlugin)
  .derive(async (ctx) => {
    const trx = await transactionDerive({
      request: ctx.request,
    });

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
    } as Partial<TContext>;
  });

const main = async () => {
  await seed();

  const controllers = appModules.map((module) => module.controllers);

  for (const controller of controllers) {
    app.use(controller);
  }

  app.use(swagger({ path: '/docs' }));

  app.listen(env.PORT, () => {
    Logger.info(`🚀 Elysia API running on http://localhost:${env.PORT}/api`);
    Logger.info(`🚀 Docs running on http://localhost:${env.PORT}/api/docs`);
  });
};

main();
