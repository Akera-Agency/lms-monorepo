import NiceModal from '@ebay/nice-modal-react';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const rootRoute = createRootRoute({
  component: () => (
    <NiceModal.Provider>
      <Outlet />
    </NiceModal.Provider>
  ),
});
