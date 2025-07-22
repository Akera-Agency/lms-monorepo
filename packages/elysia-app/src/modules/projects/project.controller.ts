import { Elysia, t } from 'elysia';
import { TContext } from 'src/shared/types/context';

const prefix = '/projects';

export const projectController = new Elysia<typeof prefix, TContext>({
  prefix,
  detail: {
    tags: ['Projects'],
  },
})
  .get(
    '/',
    async ({ query, store }) => {
      const { page = 1, limit = 10 } = query;

      return store.ProjectService.findProjectsWithPagination({
        page,
        limit,
      });
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric()),
        limit: t.Optional(t.Numeric()),
      }),
    }
  )
  .get(
    '/:id',
    async ({ params: { id }, store }) => {
      const project = await store.ProjectService.findProjectById(id);

      if (!project) {
        return {
          status: 404,
          message: 'Project not found',
        };
      }

      return project;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .get(
    '/:id/full',
    async ({ params: { id }, store }) => {
      const project = await store.ProjectService.getProjectWithTasksAndComments(
        id
      );

      if (!project) {
        return {
          status: 404,
          message: 'Project not found',
        };
      }

      return project;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    '/',
    async ({ body, store }) => {
      return store.ProjectService.createProject(body);
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.String(),
        owner_id: t.String(),
        status: t.Union([
          t.Literal('active'),
          t.Literal('archived'),
          t.Literal('completed'),
        ]),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params: { id }, body, store }) => {
      const project = await store.ProjectService.findProjectById(id);

      if (!project) {
        return {
          status: 404,
          message: 'Project not found',
        };
      }

      return store.ProjectService.updateProject(id, body);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
        description: t.Optional(t.String()),
        status: t.Optional(
          t.Union([
            t.Literal('active'),
            t.Literal('archived'),
            t.Literal('completed'),
          ])
        ),
      }),
    }
  )
  .delete(
    '/:id',
    async ({ params: { id }, store }) => {
      const project = await store.ProjectService.findProjectById(id);

      if (!project) {
        return {
          status: 404,
          message: 'Project not found',
        };
      }

      await store.ProjectService.deleteProject(id);

      return {
        status: 200,
        message: 'Project deleted successfully',
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  // Task routes
  .get(
    '/:id/tasks',
    async ({ params: { id }, store }) => {
      const project = await store.ProjectService.findProjectById(id);

      if (!project) {
        return {
          status: 404,
          message: 'Project not found',
        };
      }

      return store.ProjectService.findTasksByProjectId(id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    '/:id/tasks',
    async ({ params: { id }, body, store }) => {
      return store.ProjectService.createTask({
        ...body,
        project_id: id,
        due_date: body.due_date ? new Date(body.due_date) : undefined,
      });
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        title: t.String(),
        description: t.String(),
        assignee_id: t.Optional(t.Union([t.String(), t.Null()])),
        priority: t.Union([
          t.Literal('low'),
          t.Literal('medium'),
          t.Literal('high'),
        ]),
        status: t.Union([
          t.Literal('todo'),
          t.Literal('in_progress'),
          t.Literal('done'),
        ]),
        due_date: t.Optional(t.Union([t.String(), t.Null()])),
      }),
    }
  )
  // Comment routes
  .post(
    '/tasks/:taskId/comments',
    async ({ params: { taskId }, body, store }) => {
      return store.ProjectService.createComment({
        ...body,
        task_id: taskId,
      });
    },
    {
      params: t.Object({
        taskId: t.String(),
      }),
      body: t.Object({
        user_id: t.String(),
        content: t.String(),
      }),
    }
  );
