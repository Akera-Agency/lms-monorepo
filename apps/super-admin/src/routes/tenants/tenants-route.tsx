import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import Tenants from '../../pages/tenants/tenants-page';

export const tenantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenants',
  component: () => <Tenants />,
});
