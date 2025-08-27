import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import SignupPage from '@/pages/signup/signup';

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => <SignupPage />,
});
