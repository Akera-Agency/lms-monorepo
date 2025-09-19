import Elysia from 'elysia';
import { createAccessGuard } from '../../shared/guards/permission.guard';
import { authGuard } from '../../shared/guards/auth.guard';
import { TContext } from 'src/shared/types/context';
import {
  updateUserSchema,
  userPaginationQuerySchema,
  userParamsSchema,
} from './schemas/user.schema';

const prefix = '/users';

export const userController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ['Users'],
  },
}).guard({}, (app) =>
  app
    .use(authGuard)
    .get('/me', async (ctx) => {
      const user = ctx.auth.user;
      return await ctx.store.UserService.findOne({
        id: user.sub,
      });
    })
    .patch(
      '/me',
      async (ctx) => {
        const user = ctx.auth.user;
        await ctx.store.UserService.update(user.sub, {
          ...ctx.body,
        });
      },
      {
        body: updateUserSchema,
      },
    )
    .guard({}, (app) =>
      app
        .use(
          createAccessGuard({
            permissions: [{ entity: 'users', permission: 'read' }],
            require: 'all',
          }),
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
            query: userPaginationQuerySchema,
          },
        )
        .get(
          '/:id',
          async (ctx) => {
            return await ctx.store.UserService.findOne({
              id: ctx.params.id,
            });
          },
          {
            params: userParamsSchema,
          },
        ),
    )
    .guard({}, (app) =>
      app
        .use(
          createAccessGuard({
            permissions: [{ entity: 'users', permission: 'update' }],
            require: 'all',
          }),
        )
        .patch(
          '/:id',
          async (ctx) => {
            const updatedUser = await ctx.store.UserService.update(
              ctx.params.id,
              ctx.body,
            );
            return updatedUser;
          },
          {
            params: userParamsSchema,
            body: updateUserSchema,
          },
        ),
    )
    .guard({}, (app) =>
      app
        .use(
          createAccessGuard({
            permissions: [{ entity: 'users', permission: 'delete' }],
            require: 'all',
          }),
        )
        .delete(
          '/:id',
          async (ctx) => {
            return await ctx.store.UserService.delete(ctx.params.id);
          },
          {
            params: userParamsSchema,
          },
        ),
    ),
);
