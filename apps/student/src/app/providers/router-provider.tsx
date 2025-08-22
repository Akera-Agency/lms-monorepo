import { RouterProvider, createRouter } from '@tanstack/react-router';
import { rootRoute } from '@/routes/__root';
import { profileRoute } from '@/routes/profile/profile-route';


const routeTree = rootRoute.addChildren([profileRoute]);

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
