import Elysia from 'elysia';
import { TContext } from '../../shared/types/context';
import { authGuard } from '../../shared/guards/auth.guard';
import { createAccessGuard } from 'src/shared/guards/permission.guard';
import { AppError } from 'src/shared/Errors/AppError';
import {
  createTenantSchema,
  updateTenantSchema,
  createTenantRoleSchema,
  updateTenantRoleSchema,
  tenantUserRoleSchema,
  tenantPaginationQuerySchema,
  tenantParamsSchema,
  tenantRoleParamsSchema,
  tenantUserParamsSchema,
} from './schemas/tenant.schema';

const prefix = '/tenants';

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
      query: tenantPaginationQuerySchema,
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
              query: tenantPaginationQuerySchema,
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
              params: tenantParamsSchema,
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
              body: createTenantSchema,
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
              return await ctx.store.TenantService.update(
                ctx.params.id,
                ctx.body,
              );
            },
            {
              params: tenantParamsSchema,
              body: updateTenantSchema,
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
              params: tenantParamsSchema,
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
              return await ctx.store.TenantService.getTenantRoles(
                ctx.params.id,
              );
            },
            {
              params: tenantParamsSchema,
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
              const tenant = await ctx.store.TenantService.findOne(
                ctx.params.id,
              );
              return await ctx.store.TenantService.createRoleForTenant({
                ...ctx.body,
                tenant_id: tenant.id,
              });
            },
            {
              params: tenantRoleParamsSchema,
              body: createTenantRoleSchema,
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
              return await ctx.store.TenantService.updateRoleForTenant(
                ctx.params.roleId,
                ctx.body,
              );
            },
            {
              params: tenantRoleParamsSchema,
              body: updateTenantRoleSchema,
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
              await ctx.store.TenantService.removeRoleFromTenant(
                ctx.params.roleId,
              );
            },
            {
              params: tenantRoleParamsSchema,
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
              params: tenantParamsSchema,
              body: tenantUserRoleSchema,
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
              params: tenantUserParamsSchema,
              body: tenantUserRoleSchema,
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
              return await ctx.store.TenantService.getTenantUsers(
                ctx.params.id,
                {
                  page: ctx.query.page,
                  limit: ctx.query.limit,
                },
              );
            },
            {
              params: tenantParamsSchema,
              query: tenantPaginationQuerySchema,
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
              params: tenantUserParamsSchema,
              body: tenantUserRoleSchema,
            },
          ),
      ),
  );
