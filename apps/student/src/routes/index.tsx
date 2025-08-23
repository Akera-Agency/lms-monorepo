import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import Page from '@/pages/index';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Page/>,
});

