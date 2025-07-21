import Elysia, { t } from "elysia";
import { TContext } from "../../shared/types/context";

const prefix = "/todos";

export const todoController = new Elysia<typeof prefix, TContext>({
  prefix: "/todos",
  detail: {
    tags: ["Todos"],
  },
})
  .get(
    "/",
    async (ctx) => {
      return ctx.store.TodoService.findManyWithPagination({
        page: ctx.query.page,
        limit: ctx.query.limit,
        filter: [
          { column: "user_id", operator: "=", value: ctx.query.user_id },
        ],
      });
    },
    {
      query: t.Object({
        user_id: t.String(),
        page: t.Number(),
        limit: t.Number(),
      }),
    }
  )
  .get(
    ":id",
    async (ctx) => {
      ctx.store.TodoService.findOne(ctx.params.id);
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
      ctx.store.TodoService.create({
        user_id: ctx.query.user_id,
        title: ctx.body.title,
        completed: false,
      }),
    {
      body: t.Object({
        title: t.String(),
      }),
    }
  )
  .put(
    ":id",
    async (ctx) => ctx.store.TodoService.update(ctx.params.id, ctx.body),
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        title: t.String(),
      }),
    }
  )
  .delete(
    ":id",
    async (ctx) => {
      await ctx.store.TodoService.delete(ctx.params.id);
      return { success: true };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
