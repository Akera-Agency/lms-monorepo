import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import Users from '../../pages/users/users-page';

export const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: () => <Users />,
});
