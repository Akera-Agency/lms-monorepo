import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import ResetPassword from '@/pages/reset-password/reset-password';


export const resetPasswordRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/reset-password',
    component: () => <ResetPassword />,
});
