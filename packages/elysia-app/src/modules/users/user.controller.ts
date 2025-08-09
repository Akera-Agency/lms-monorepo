import Elysia, { t } from 'elysia';
import {
  createAccessGuard,
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
      return await ctx.store.UserService.findOne({
        id: user.sub,
      });
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
      .use(
        createAccessGuard({
          permissions: [{ entity: 'users', permission: 'read' }],
          require: 'all',
        })
      )
      .get(
        '/',
        async (ctx) => {
          return await ctx.store.UserService.findManyWithPagination({
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
          return await ctx.store.UserService.findOne({
            id: ctx.params.id,
          });
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
      .use(
        createAccessGuard({
          permissions: [{ entity: 'users', permission: 'update' }],
          require: 'all',
        })
      )
      .patch(
        ':id',
        async (ctx) => {
          return await ctx.store.UserService.update(ctx.params.id, ctx.body);
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
      .use(
        createAccessGuard({
          permissions: [{ entity: 'users', permission: 'delete' }],
          require: 'all',
        })
      )
      .delete(
        ':id',
        async (ctx) => {
          return await ctx.store.UserService.delete(ctx.params.id);
        },
        {
          params: t.Object({
            id: t.String(),
          }),
        }
      )
  );
