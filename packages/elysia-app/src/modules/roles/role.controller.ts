import Elysia, { t } from 'elysia';
import { TContext } from '../../shared/types/context';

const prefix = '/roles';

export const roleController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ['Roles'],
  },
})
  .get(
    '/',
    async (ctx) => {
      return ctx.store.RoleService.findManyWithPagination({
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
    return ctx.store.RoleService.findSystemRoles();
  })
  .get('/custom', async (ctx) => {
    return ctx.store.RoleService.findCustomRoles();
  })
  .get(
    '/:id',
    async (ctx) => {
      const role = await ctx.store.RoleService.findOne(ctx.params.id);
      if (!role) {
        throw new Error('Role not found');
      }
      return role;
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
      const role = await ctx.store.RoleService.findByName(ctx.params.name);
      return role;
    },
    {
      params: t.Object({
        name: t.String(),
      }),
    }
  )
  .post(
    '/',
    async (ctx) => {
      return ctx.store.RoleService.create(ctx.body);
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
  .patch(
    '/:id',
    async (ctx) => {
      return ctx.store.RoleService.update(ctx.params.id, ctx.body);
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
  .delete(
    '/:id',
    async (ctx) => {
      await ctx.store.RoleService.delete(ctx.params.id);
      return { success: true };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
