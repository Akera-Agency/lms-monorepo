import Elysia, { t } from 'elysia';
import { TContext } from '../../shared/types/context';
import { authGuard } from 'src/shared/guards/auth.guard';
import { createPermissionGuard } from 'src/shared/guards/permission.guard';

const prefix = '/roles';

export const roleController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ['Roles'],
  },
})
  .use(authGuard)
  .get('/me', async (ctx) => {
    const user = ctx.auth.user;
    return await ctx.store.RoleService.findByUserId(user.sub);
  })
  .guard((app) =>
    app
      .use(createPermissionGuard([{ entity: 'roles', permission: 'read' }]))
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
          query: t.Object({
            page: t.Number(),
            limit: t.Number(),
            search: t.Optional(t.String()),
          }),
        }
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
          params: t.Object({
            id: t.String(),
          }),
        }
      )
      .get(
        '/name/:name',
        async (ctx) => {
          return await ctx.store.RoleService.findByName(ctx.params.name);
        },
        {
          params: t.Object({
            name: t.String(),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(createPermissionGuard([{ entity: 'roles', permission: 'create' }]))
      .post(
        '/',
        async (ctx) => {
          return await ctx.store.RoleService.create(ctx.body);
        },
        {
          body: t.Object({
            name: t.String(),
            description: t.Optional(t.String()),
            permissions: t.Record(t.String(), t.Array(t.String())),
            is_system_role: t.Boolean(),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(createPermissionGuard([{ entity: 'roles', permission: 'update' }]))
      .patch(
        '/:id',
        async (ctx) => {
          return await ctx.store.RoleService.update(ctx.params.id, ctx.body);
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            name: t.Optional(t.String()),
            description: t.Optional(t.String()),
            permissions: t.Optional(t.Record(t.String(), t.Array(t.String()))),
            is_system_role: t.Optional(t.Boolean()),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(createPermissionGuard([{ entity: 'roles', permission: 'delete' }]))
      .delete(
        '/:id',
        async (ctx) => {
          return await ctx.store.RoleService.delete(ctx.params.id);
        },
        {
          params: t.Object({
            id: t.String(),
          }),
        }
      )
  );
