import { RouterProvider, createRouter } from '@tanstack/react-router';
import { rootRoute } from '@/routes/__root';
import { indexRoute } from '@/routes';
import { tenantsRoute } from '@/routes/tenants/tenants-route';

const routeTree = rootRoute.addChildren([tenantsRoute, indexRoute]);

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
