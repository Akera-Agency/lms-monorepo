import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import Roles from '../../pages/roles/roles-page';

export const rolesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/roles',
  component: () => <Roles />,
});
