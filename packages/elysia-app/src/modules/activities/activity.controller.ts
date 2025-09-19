import Elysia, { t } from 'elysia';
import { createAccessGuard } from '../../shared/guards/permission.guard';
import { authGuard } from '../../shared/guards/auth.guard';
import { TContext } from '../../shared/types/context';
import { ActivityTypeEnum } from './infrastructure/activity.entity';

const prefix = '/activities';

export const createActivityValidationSchema = t.Object({
  user_id: t.String(),
  type: t.Enum(ActivityTypeEnum),
});

export const activityController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ['Activities'],
  },
}).guard({}, (app) =>
  app
    .use(authGuard)

    // Get user's own activities
    .get('/me', async (ctx) => {
      const user = ctx.auth.user;
      return await ctx.store.ActivityService.findByUserId(user.sub);
    })

    // Get user's total XP
    .get('/me/xp', async (ctx) => {
      const user = ctx.auth.user;
      const totalXp = await ctx.store.ActivityService.getUserTotalXp(user.sub);
      return { totalXp };
    })

    // Get user's XP for specific time periods
    .get(
      '/me/xp/daily',
      async (ctx) => {
        const user = ctx.auth.user;
        const date = ctx.query.date ? new Date(ctx.query.date) : new Date();
        const dailyXp = await ctx.store.ActivityService.getDailyXp(user.sub, date);
        return { dailyXp, date: date.toISOString().split('T')[0] };
      },
      {
        query: t.Object({
          date: t.Optional(t.String({ format: 'date' })),
        }),
      },
    )

    .get(
      '/me/xp/weekly',
      async (ctx) => {
        const user = ctx.auth.user;
        const date = ctx.query.date ? new Date(ctx.query.date) : new Date();
        const weeklyXp = await ctx.store.ActivityService.getWeeklyXp(user.sub, date);
        return { weeklyXp, date: date.toISOString().split('T')[0] };
      },
      {
        query: t.Object({
          date: t.Optional(t.String({ format: 'date' })),
        }),
      },
    )

    .get(
      '/me/xp/monthly',
      async (ctx) => {
        const user = ctx.auth.user;
        const date = ctx.query.date ? new Date(ctx.query.date) : new Date();
        const monthlyXp = await ctx.store.ActivityService.getMonthlyXp(user.sub, date);
        return { monthlyXp, date: date.toISOString().split('T')[0] };
      },
      {
        query: t.Object({
          date: t.Optional(t.String({ format: 'date' })),
        }),
      },
    )

    // Get user's activities by type
    .get(
      '/me/type/:type',
      async (ctx) => {
        const user = ctx.auth.user;
        return await ctx.store.ActivityService.findByUserIdAndType(user.sub, ctx.params.type);
      },
      {
        params: t.Object({
          type: t.Enum(ActivityTypeEnum),
        }),
      },
    )

    // Admin routes with permission guards
    .guard({}, (app) =>
      app
        .use(
          createAccessGuard({
            permissions: [{ entity: 'activities', permission: 'read' }],
            require: 'all',
          }),
        )

        // Get all activities with pagination
        .get(
          '/',
          async (ctx) => {
            return await ctx.store.ActivityService.findManyWithPagination({
              page: ctx.query.page,
              limit: ctx.query.limit,
              filter: ctx.query.user_id
                ? [
                    {
                      column: 'user_id',
                      operator: '=',
                      value: ctx.query.user_id,
                    },
                  ]
                : undefined,
            });
          },
          {
            query: t.Object({
              page: t.Number(),
              limit: t.Number(),
              user_id: t.Optional(t.String()),
            }),
          },
        )

        // Get specific activity by ID
        .get(
          '/:id',
          async (ctx) => {
            return await ctx.store.ActivityService.findOne(ctx.params.id);
          },
          {
            params: t.Object({
              id: t.String(),
            }),
          },
        )

        // Get activities for specific user
        .get(
          '/user/:userId',
          async (ctx) => {
            return await ctx.store.ActivityService.findByUserId(ctx.params.userId);
          },
          {
            params: t.Object({
              userId: t.String(),
            }),
          },
        )

        // Get user's total XP (admin endpoint)
        .get(
          '/user/:userId/xp',
          async (ctx) => {
            const totalXp = await ctx.store.ActivityService.getUserTotalXp(ctx.params.userId);
            return { userId: ctx.params.userId, totalXp };
          },
          {
            params: t.Object({
              userId: t.String(),
            }),
          },
        ),
    )
    // Admin write operations
    .guard({}, (app) =>
      app
        .use(
          createAccessGuard({
            permissions: [{ entity: 'activities', permission: 'create' }],
            require: 'all',
          }),
        )

        // Manually create activity (admin only)
        .post(
          '/',
          async (ctx) => {
            return await ctx.store.ActivityService.create(ctx.body);
          },
          {
            body: createActivityValidationSchema,
          },
        ),
    )
    .guard({}, (app) =>
      app
        .use(
          createAccessGuard({
            permissions: [{ entity: 'activities', permission: 'delete' }],
            require: 'all',
          }),
        )

        // Delete activity (admin only)
        .delete(
          '/:id',
          async (ctx) => {
            await ctx.store.ActivityService.delete(ctx.params.id);
            return { message: 'Activity deleted successfully' };
          },
          {
            params: t.Object({
              id: t.String(),
            }),
          },
        ),
    ),
);
