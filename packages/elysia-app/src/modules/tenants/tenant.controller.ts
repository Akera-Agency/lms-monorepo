import Elysia, { t } from 'elysia';
import { TContext } from '../../shared/types/context';
import { authGuard } from '../../shared/guards/auth.guard';
import { createAccessGuard } from 'src/shared/guards/permission.guard';
import { AppError } from 'src/shared/Errors/AppError';

const prefix = '/tenants';

const createTenantValidationSchema = t.Object({
  name: t.String(),
  description: t.Optional(t.String()),
  logo_url: t.Optional(t.String()),
  is_public: t.Boolean(),
});

const updateTenantValidationSchema = t.Object({
  name: t.Optional(t.String()),
  description: t.Optional(t.String()),
  logo_url: t.Optional(t.String()),
  is_public: t.Optional(t.Boolean()),
});

const createTenantRoleValidationSchema = t.Object({
  name: t.String(),
  permissions: t.Record(t.String(), t.Array(t.String())),
  is_default: t.Boolean(),
  is_system_role: t.Boolean(),
  description: t.Optional(t.String()),
});

const updateTenantRoleValidationSchema = t.Object({
  name: t.Optional(t.String()),
  permissions: t.Optional(t.Object({})),
  is_default: t.Optional(t.Boolean()),
  is_system_role: t.Optional(t.Boolean()),
  description: t.Optional(t.String()),
});

const tenantUserRoleValidationSchema = t.Object({
  roleId: t.String(),
  userId: t.String(),
});

export const tenantController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ['Tenants'],
  },
})
  .get(
    '/public',
    async (ctx) => {
      const { page = 1, limit = 10 } = ctx.query;
      return await ctx.store.TenantService.findManyWithPagination({
        page,
        limit,
        search: [
          ...(ctx.query.search
            ? [
                {
                  column: 'name' as const,
                  operator: 'ilike' as const,
                  value: `%${ctx.query.search}%`,
                },
              ]
            : []),
          {
            column: 'is_public' as const,
            operator: '=',
            value: true,
          },
        ],
      });
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        search: t.Optional(t.String()),
      }),
    },
  )
  .guard({}, (app) =>
    app
      .use(authGuard)
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenants', permission: 'read' }],
              require: 'all',
            }),
          )
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
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenants', permission: 'read' }],
              require: 'all',
              requireTenant: true,
            }),
          )
          .get(
            '/:id',
            async (ctx) => {
              if (ctx.auth.tenantId !== ctx.params.id) {
                throw new AppError({
                  error: 'unauthorized_tenant',
                  statusCode: 403,
                });
              }
              return await ctx.store.TenantService.findOne(ctx.params.id);
            },
            {
              params: t.Object({
                id: t.String(),
              }),
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenants', permission: 'create' }],
              require: 'all',
            }),
          )
          .post(
            '/',
            async (ctx) => {
              return await ctx.store.TenantService.create(ctx.body);
            },
            {
              body: createTenantValidationSchema,
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenants', permission: 'update' }],
              require: 'all',
              requireTenant: true,
            }),
          )
          .patch(
            '/:id',
            async (ctx) => {
              if (ctx.auth.tenantId !== ctx.params.id) {
                throw new AppError({
                  error: 'unauthorized_tenant',
                  statusCode: 403,
                });
              }
              return await ctx.store.TenantService.update(ctx.params.id, ctx.body);
            },
            {
              params: t.Object({
                id: t.String(),
              }),
              body: updateTenantValidationSchema,
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenants', permission: 'delete' }],
              require: 'all',
              requireTenant: true,
            }),
          )
          .delete(
            '/:id',
            async (ctx) => {
              if (ctx.auth.tenantId !== ctx.params.id) {
                throw new AppError({
                  error: 'unauthorized_tenant',
                  statusCode: 403,
                });
              }
              return await ctx.store.TenantService.delete(ctx.params.id);
            },
            {
              params: t.Object({
                id: t.String(),
              }),
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenant_roles', permission: 'read' }],
              require: 'all',
              requireTenant: true,
            }),
          )
          .get(
            '/:id/roles',
            async (ctx) => {
              if (ctx.auth.tenantId !== ctx.params.id) {
                throw new AppError({
                  error: 'unauthorized_tenant',
                  statusCode: 403,
                });
              }
              return await ctx.store.TenantService.getTenantRoles(ctx.params.id);
            },
            {
              params: t.Object({
                id: t.String(),
              }),
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenant_roles', permission: 'create' }],
              require: 'all',
              requireTenant: true,
            }),
          )
          .post(
            '/:id/roles',
            async (ctx) => {
              if (ctx.auth.tenantId !== ctx.params.id) {
                throw new AppError({
                  error: 'unauthorized_tenant',
                  statusCode: 403,
                });
              }
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
              body: createTenantRoleValidationSchema,
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenant_roles', permission: 'update' }],
              require: 'all',
              requireTenant: true,
            }),
          )
          .patch(
            '/:id/roles/:roleId',
            async (ctx) => {
              if (ctx.auth.tenantId !== ctx.params.id) {
                throw new AppError({
                  error: 'unauthorized_tenant',
                  statusCode: 403,
                });
              }
              return await ctx.store.TenantService.updateRoleForTenant(ctx.params.roleId, ctx.body);
            },
            {
              params: t.Object({
                id: t.String(),
                roleId: t.String(),
              }),
              body: updateTenantRoleValidationSchema,
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenant_roles', permission: 'delete' }],
              require: 'all',
              requireTenant: true,
            }),
          )
          .delete(
            '/:id/roles/:roleId',
            async (ctx) => {
              if (ctx.auth.tenantId !== ctx.params.id) {
                throw new AppError({
                  error: 'unauthorized_tenant',
                  statusCode: 403,
                });
              }
              await ctx.store.TenantService.removeRoleFromTenant(ctx.params.roleId);
            },
            {
              params: t.Object({
                id: t.String(),
                roleId: t.String(),
              }),
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenant_users', permission: 'create' }],
              require: 'all',
              requireTenant: true,
            }),
          )
          .post(
            '/:id/users',
            async (ctx) => {
              if (ctx.auth.tenantId !== ctx.params.id) {
                throw new AppError({
                  error: 'unauthorized_tenant',
                  statusCode: 403,
                });
              }
              return await ctx.store.TenantService.assignUserToTenant(
                ctx.params.id,
                ctx.body.userId,
                ctx.body.roleId,
              );
            },
            {
              params: t.Object({
                id: t.String(),
              }),
              body: tenantUserRoleValidationSchema,
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenant_users', permission: 'delete' }],
              require: 'all',
              requireTenant: true,
            }),
          )
          .delete(
            '/:id/users/:userId',
            async (ctx) => {
              if (ctx.auth.tenantId !== ctx.params.id) {
                throw new AppError({
                  error: 'unauthorized_tenant',
                  statusCode: 403,
                });
              }
              return await ctx.store.TenantService.removeUserFromTenant(
                ctx.params.id,
                ctx.params.userId,
              );
            },
            {
              params: t.Object({
                id: t.String(),
                userId: t.String(),
              }),
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenant_users', permission: 'read' }],
              require: 'all',
              requireTenant: true,
            }),
          )
          .get(
            '/:id/users',
            async (ctx) => {
              if (ctx.auth.tenantId !== ctx.params.id) {
                throw new AppError({
                  error: 'unauthorized_tenant',
                  statusCode: 403,
                });
              }
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
            },
          ),
      )
      .guard({}, (app) =>
        app
          .use(
            createAccessGuard({
              permissions: [{ entity: 'tenant_users', permission: 'update' }],
              require: 'all',
              requireTenant: true,
            }),
          )
          .patch(
            '/:id/users/:userId/role',
            async (ctx) => {
              if (ctx.auth.tenantId !== ctx.params.id) {
                throw new AppError({
                  error: 'unauthorized_tenant',
                  statusCode: 403,
                });
              }
              return await ctx.store.TenantService.updateUserRoleInTenant(
                ctx.params.id,
                ctx.params.userId,
                ctx.body.roleId,
              );
            },
            {
              params: t.Object({
                id: t.String(),
                userId: t.String(),
              }),
              body: tenantUserRoleValidationSchema,
            },
          ),
      ),
  );
