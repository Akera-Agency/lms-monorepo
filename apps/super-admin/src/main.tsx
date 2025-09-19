import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './styles/index.css';
import { AuthContextProvider } from '../../../packages/auth/src/providers/auth-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TenantProvider } from '../../../packages/features/src/providers/tenant-provider';

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <TenantProvider>
          <App />
        </TenantProvider>
        ys
      </QueryClientProvider>
    </AuthContextProvider>
  </StrictMode>,
);
