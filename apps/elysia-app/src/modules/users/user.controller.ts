import Elysia, { t } from "elysia";
import { TContext } from "../../shared/types/context";

const prefix = "/users";

export const userController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ["Users"],
  },
})
  .get(
    "/",
    async (ctx) => {
      return ctx.store.UserService.findManyWithPagination({
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
    ":id",
    async (ctx) => {
      return ctx.store.UserService.findOne(ctx.params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    "/",
    async (ctx) =>
      ctx.store.UserService.create({
        email: ctx.body.email,
        name: ctx.body.name,
      }),
    {
      body: t.Object({
        email: t.String(),
        name: t.String(),
      }),
    }
  )
  .put(
    ":id",
    async (ctx) => ctx.store.UserService.update(ctx.params.id, ctx.body),
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
  .delete(
    ":id",
    async (ctx) => {
      await ctx.store.UserService.delete(ctx.params.id);
      return { success: true };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
