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
    ctx.store.trx.commit();
  })
  .onError((ctx) => {
    Logger.error(ctx.error);
    ctx.store.trx.rollback();
  });

// Use CORS
app.use(cors());

// Expose event bus
app.use(eventBusPlugin);

app.onRequest(async (ctx) => {
  const trx = await transactionDerive({
    request: ctx.request,
  });
  app.store['trx'] = trx;

  const store: Record<string, unknown> = {};
  const repos = appModules.map((module) => module.repositories);
  const services = appModules.map((module) => module.services);

  for (const repo of repos) {
    for (const [key, value] of Object.entries(repo)) {
      store[key] = new value.import(trx);
    }
  }

  for (const service of services) {
    for (const [key, value] of Object.entries(service)) {
      const deps = value.inject.map((key: { name: string }) => store[key.name]);
      if (value.inject.length !== deps.filter(Boolean).length) {
        throw new Error(`Missing dependencies for ${key}`);
      }
      const instance = new value.import(...deps);
      store[key] = instance;
      app.store[key as keyof servicesMap] = instance;
    }
  }
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
