import { Navbar } from '@/components/navbar';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AuthGuard } from "../../../../packages/auth/src/guards/auth-guard"

export const rootRoute = createRootRoute({
  component: () => 
    (
      <AuthGuard>
        <Navbar />
        <main className='mt-35'>
          <Outlet />
        </main>
      </AuthGuard>
  ),
});
