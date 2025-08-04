import Elysia, { t } from 'elysia';
import {
  createPermissionGuard,
  PermissionContext,
} from '../../shared/guards/permission.guard';
import { authGuard } from '../../shared/guards/auth.guard';

const prefix = '/users';

export const userController = new Elysia<typeof prefix, PermissionContext>({
  prefix,
  detail: {
    tags: ['Users'],
  },
})
  .use(authGuard)
  .get(
    '/me',
    async (ctx) => {
      const user = ctx.auth.user;
      return await ctx.store.UserService.findOne(user.sub);
    },
    {
      detail: {
        tags: ['Users', 'Me'],
      },
    }
  )
  .patch(
    '/me',
    async (ctx) => {
      const user = ctx.auth.user;
      await ctx.store.UserService.update(user.sub, {
        email: ctx.body.email,
        name: ctx.body.name,
      });
      ctx.store.trx.commit();
    },
    {
      body: t.Object({
        email: t.String(),
        name: t.String(),
      }),
    }
  )
  .guard((app) =>
    app
      .use(createPermissionGuard([{ entity: 'users', permission: 'read' }]))
      .get(
        '/',
        async (ctx) => {
          return ctx.store.UserService.findManyWithPagination({
            page: ctx.query.page,
            limit: ctx.query.limit,
          });
        },
        {
          query: t.Object({
            page: t.Number(),
            limit: t.Number(),
          }),
        }
      )
      .get(
        ':id',
        async (ctx) => {
          return ctx.store.UserService.findOne(ctx.params.id);
        },
        {
          params: t.Object({
            id: t.String(),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(createPermissionGuard([{ entity: 'users', permission: 'update' }]))
      .patch(
        ':id',
        async (ctx) => {
          await ctx.store.UserService.update(ctx.params.id, ctx.body);
          ctx.store.trx.commit();
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            email: t.String(),
            name: t.String(),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(createPermissionGuard([{ entity: 'users', permission: 'delete' }]))
      .delete(
        ':id',
        async (ctx) => {
          await ctx.store.UserService.delete(ctx.params.id);
          ctx.store.trx.commit();
        },
        {
          params: t.Object({
            id: t.String(),
          }),
        }
      )
  );
