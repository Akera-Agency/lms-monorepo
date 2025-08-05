import Elysia, { t } from 'elysia';
import { TContext } from '../../shared/types/context';
import { authGuard } from '../../shared/guards/auth.guard';
import { createPermissionGuard } from 'src/shared/guards/permission.guard';

const prefix = '/tenants';

export const tenantController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ['Tenants'],
  },
})
  .use(authGuard)
  .guard((app) =>
    app
      .use(createPermissionGuard([{ entity: 'tenants', permission: 'read' }]))
      .get(
        '/',
        async (ctx) => {
          return await ctx.store.TenantService.findManyWithPagination({
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
                    column: 'slug',
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
      .get(
        '/:id',
        async (ctx) => {
          return await ctx.store.TenantService.findOne(ctx.params.id);
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
      .use(createPermissionGuard([{ entity: 'tenants', permission: 'create' }]))
      .post(
        '/',
        async (ctx) => {
          return await ctx.store.TenantService.create(ctx.body);
        },
        {
          body: t.Object({
            name: t.String(),
            slug: t.String(),
            description: t.Optional(t.String()),
            logo_url: t.Optional(t.String()),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(createPermissionGuard([{ entity: 'tenants', permission: 'update' }]))
      .patch(
        '/:id',
        async (ctx) => {
          return await ctx.store.TenantService.update(ctx.params.id, ctx.body);
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            name: t.Optional(t.String()),
            slug: t.Optional(t.String()),
            description: t.Optional(t.String()),
            logo_url: t.Optional(t.String()),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(createPermissionGuard([{ entity: 'tenants', permission: 'delete' }]))
      .delete(
        '/:id',
        async (ctx) => {
          return await ctx.store.TenantService.delete(ctx.params.id);
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
        createPermissionGuard([{ entity: 'tenant_roles', permission: 'read' }])
      )
      .get(
        '/:id/roles',
        async (ctx) => {
          return await ctx.store.TenantService.getTenantRoles(ctx.params.id);
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
        createPermissionGuard([
          { entity: 'tenant_roles', permission: 'create' },
        ])
      )
      .post(
        '/:id/roles',
        async (ctx) => {
          const tenant = await ctx.store.TenantService.findOne(ctx.params.id);
          return await ctx.store.TenantService.createRoleForTenant({
            ...ctx.body,
            tenant_id: tenant.id,
          });
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            name: t.String(),
            permissions: t.Object({}),
            is_default: t.Boolean(),
            is_system_role: t.Boolean(),
            description: t.Optional(t.String()),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(
        createPermissionGuard([
          { entity: 'tenant_roles', permission: 'update' },
        ])
      )
      .patch(
        '/:id/roles/:roleId',
        async (ctx) => {
          return await ctx.store.TenantService.updateRoleForTenant(
            ctx.params.roleId,
            ctx.body
          );
        },
        {
          params: t.Object({
            id: t.String(),
            roleId: t.String(),
          }),
          body: t.Object({
            name: t.Optional(t.String()),
            permissions: t.Optional(t.Object({})),
            is_default: t.Optional(t.Boolean()),
            is_system_role: t.Optional(t.Boolean()),
            description: t.Optional(t.String()),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(
        createPermissionGuard([
          { entity: 'tenant_roles', permission: 'delete' },
        ])
      )
      .delete(
        '/:id/roles/:roleId',
        async (ctx) => {
          await ctx.store.TenantService.removeRoleFromTenant(ctx.params.roleId);
        },
        {
          params: t.Object({
            id: t.String(),
            roleId: t.String(),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(
        createPermissionGuard([
          { entity: 'tenant_users', permission: 'create' },
        ])
      )
      .post(
        '/:id/users',
        async (ctx) => {
          return await ctx.store.TenantService.assignUserToTenant(
            ctx.params.id,
            ctx.body.userId,
            ctx.body.roleId
          );
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            roleId: t.String(),
            userId: t.String(),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(
        createPermissionGuard([
          { entity: 'tenant_users', permission: 'delete' },
        ])
      )
      .delete(
        '/:id/users/:userId',
        async (ctx) => {
          return await ctx.store.TenantService.removeUserFromTenant(
            ctx.params.id,
            ctx.params.userId
          );
        },
        {
          params: t.Object({
            id: t.String(),
            userId: t.String(),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(
        createPermissionGuard([{ entity: 'tenant_users', permission: 'read' }])
      )
      .get(
        '/:id/users',
        async (ctx) => {
          return await ctx.store.TenantService.getTenantUsers(ctx.params.id, {
            page: ctx.query.page,
            limit: ctx.query.limit,
          });
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          query: t.Object({
            page: t.Number(),
            limit: t.Number(),
          }),
        }
      )
  )
  .guard((app) =>
    app
      .use(
        createPermissionGuard([
          { entity: 'tenant_users', permission: 'update' },
        ])
      )
      .patch(
        '/:id/users/:userId/role',
        async (ctx) => {
          return await ctx.store.TenantService.updateUserRoleInTenant(
            ctx.params.id,
            ctx.params.userId,
            ctx.body.roleId
          );
        },
        {
          params: t.Object({
            id: t.String(),
            userId: t.String(),
          }),
          body: t.Object({
            roleId: t.String(),
          }),
        }
      )
  );
