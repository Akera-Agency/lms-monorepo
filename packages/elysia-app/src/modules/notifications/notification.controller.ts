import Elysia, { t } from 'elysia';
import { authGuard } from 'src/shared/guards/auth.guard';
import { TContext } from 'src/shared/types/context';

const prefix = '/notifications';

export const notificationController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: { tags: ['Notifications'] },
}).guard({}, (app) =>
  app
    .use(authGuard)
    .get('/me', async (ctx) => {
      const limit = Math.min(Number(ctx.query['limit'] ?? 20), 100);
      const rows = await ctx.store.NotificationService.listMine(
        ctx.auth.user.sub,
        limit,
      );
      return { items: rows };
    })
    .post(
      '/me/read',
      async (ctx) => {
        await ctx.store.NotificationService.markRead(
          ctx.auth.user.sub,
          ctx.body.ids,
        );
      },
      { body: t.Object({ ids: t.Array(t.String()) }) },
    )
    .get('/me/preferences', async (ctx) => {
      const preferences = await ctx.store.NotificationService.listPreferences(
        ctx.auth.user.sub,
      );
      return preferences;
    })
    .patch(
      '/me/preferences',
      async (ctx) => {
        const userId = ctx.auth.user.sub;
        const normalized = ctx.body.preferences.map((p) => ({
          user_id: userId,
          event: p.event,
          channel: p.channel,
          enabled: p.enabled,
        }));
        await ctx.store.NotificationService.updatePreferences(
          userId,
          normalized,
        );
      },
      {
        body: t.Object({
          preferences: t.Array(
            t.Object({
              event: t.Union([
                t.Literal('user:updated'),
                t.Literal('notification:enqueue'),
              ]),
              channel: t.Union([
                t.Literal('in_app'),
                t.Literal('email'),
                t.Literal('all'),
              ]),
              enabled: t.Boolean(),
            }),
          ),
        }),
      },
    ),
);
