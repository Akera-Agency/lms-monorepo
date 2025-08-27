import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import ForgotPassword from '@/pages/forgot-password/forgot-password';


export const forgotPasswordRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/forgot-password',
    component: () => <ForgotPassword />,
});
