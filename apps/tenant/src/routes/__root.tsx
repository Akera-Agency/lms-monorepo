import { Navbar } from '@/components/navbar';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AuthGuard } from '../../../../packages/auth/src/guards/auth-guard';
import NiceModal from '@ebay/nice-modal-react';
import Aurora from '@/utils/aurora-bg';

export const rootRoute = createRootRoute({
  component: () => (
    <AuthGuard>
      <Aurora
        colorStops={['#c80206', '#ffffff', '#da3300', '#000000']}
        blend={0.5}
        amplitude={1.7}
        speed={0.7}
      />
      <Navbar />
      <main>
        <NiceModal.Provider>
          <Outlet />
        </NiceModal.Provider>
      </main>
    </AuthGuard>
  ),
});
