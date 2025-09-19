import Elysia from 'elysia';
import { TContext } from '../../shared/types/context';
import { authGuard } from 'src/shared/guards/auth.guard';
import { createAccessGuard } from 'src/shared/guards/permission.guard';
import {
  createRoleSchema,
  updateRoleSchema,
  rolePaginationQuerySchema,
  roleParamsSchema,
  roleNameParamsSchema,
} from './schemas/role.schema';

const prefix = '/roles';

export const roleController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ['Roles'],
  },
}).guard({}, (app) =>
  app
    .use(authGuard)
    .get('/me', async (ctx) => {
      const user = ctx.auth.user;
      return await ctx.store.RoleService.findByUserId(user.sub);
    })
    .guard({}, (app) =>
      app
        .use(
          createAccessGuard({
            permissions: [{ entity: 'roles', permission: 'read' }],
            require: 'all',
          }),
        )
        .get(
          '/',
          async (ctx) => {
            return await ctx.store.RoleService.findManyWithPagination({
              page: ctx.query.page,
              limit: ctx.query.limit,
              search: ctx.query.search
                ? [
                    {
                      column: 'name',
                      operator: 'ilike',
                      value: `%${ctx.query.search}%`,
                    },
                    {
                      column: 'description',
                      operator: 'ilike',
                      value: `%${ctx.query.search}%`,
                    },
                  ]
                : undefined,
            });
          },
          {
            query: rolePaginationQuerySchema,
          },
        )
        .get('/system', async (ctx) => {
          return await ctx.store.RoleService.findSystemRoles();
        })
        .get('/custom', async (ctx) => {
          return await ctx.store.RoleService.findCustomRoles();
        })
        .get(
          '/:id',
          async (ctx) => {
            return await ctx.store.RoleService.findOne(ctx.params.id);
          },
          {
            params: roleParamsSchema,
          },
        )
        .get(
          '/name/:name',
          async (ctx) => {
            return await ctx.store.RoleService.findByName(ctx.params.name);
          },
          {
            params: roleNameParamsSchema,
          },
        ),
    )
    .guard({}, (app) =>
      app
        .use(
          createAccessGuard({
            permissions: [{ entity: 'roles', permission: 'create' }],
            require: 'all',
          }),
        )
        .post(
          '/',
          async (ctx) => {
            return await ctx.store.RoleService.create(ctx.body);
          },
          {
            body: createRoleSchema,
          },
        ),
    )
    .guard({}, (app) =>
      app
        .use(
          createAccessGuard({
            permissions: [{ entity: 'roles', permission: 'update' }],
            require: 'all',
          }),
        )
        .patch(
          '/:id',
          async (ctx) => {
            return await ctx.store.RoleService.update(ctx.params.id, ctx.body);
          },
          {
            params: roleParamsSchema,
            body: updateRoleSchema,
          },
        ),
    )
    .guard({}, (app) =>
      app
        .use(
          createAccessGuard({
            permissions: [{ entity: 'roles', permission: 'delete' }],
            require: 'all',
          }),
        )
        .delete(
          '/:id',
          async (ctx) => {
            return await ctx.store.RoleService.delete(ctx.params.id);
          },
          {
            params: roleParamsSchema,
          },
        ),
    ),
);
