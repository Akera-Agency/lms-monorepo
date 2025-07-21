import { swagger } from '@elysiajs/swagger';
import Elysia from 'elysia';
import { cors } from '@elysiajs/cors';
import { appModules } from './app.module';
import { transactionDerive } from './database/transaction';
import { database } from './database/datasource';
import { TContext } from './shared/types/context';

const app = new Elysia({
  prefix: '/api',
});

// Use CORS
app.use(cors());

// Commit transaction after successful request
app.onAfterHandle(async (ctx) => {
  (ctx.store as TContext['store']).trx.commit();
});
// Rollback transaction on error
app.onError(async (ctx) => {
  (ctx.store as TContext['store']).trx.rollback();
});

app.onRequest(async (ctx) => {
  const trx = await transactionDerive({
    request: ctx.request,
  });
  (app.store as Record<string, any>)['trx'] = trx;

  const store: Record<string, any> = {};
  const repos = appModules.map((module) => module.repositories);
  const services = appModules.map((module) => module.services);

  for (const repo of repos) {
    for (const [key, value] of Object.entries(repo)) {
      store[key] = new value.import(trx.db);
    }
  }

  for (const service of services) {
    for (const [key, value] of Object.entries(service)) {
      const deps = value.inject.map((key: { name: string }) => store[key.name]);
      if (value.inject.length !== deps.filter(Boolean).length) {
        throw new Error(`Missing dependencies for ${key}`);
      }
      const instance = new value.import(...deps);
      (app.store as Record<string, any>)[key] = instance;
    }
  }
});

// Example: initTools function similar to server
export const initTools = async () => {
  return {
    database,
  };
};

const main = async () => {
  const tools = await initTools();

  app.decorate('tools', tools);

  const controllers = appModules.map((module) => module.controllers);

  for (const controller of controllers) {
    app.use(controller);
  }

  app.use(swagger({ path: '/docs' }));

  app.listen(4000, () => {
    console.log('🚀 Elysia API running on http://localhost:4000/api');
    console.log('🚀 Docs running on http://localhost:4000/api/docs');
  });
};

main();
