import { RouterProvider, createRouter } from '@tanstack/react-router';
import { rootRoute } from '@/routes/__root';
import { usersRoute } from '@/routes/users/users-route';
import { indexRoute } from '@/routes';
import { rolesRoute } from '@/routes/roles/roles-route';

const routeTree = rootRoute.addChildren([usersRoute, rolesRoute, indexRoute]);

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const TanstackRouterProvider = () => {
  return <RouterProvider router={router} />;
};
