import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './styles/index.css';
import { AuthContextProvider } from './app/providers/auth-provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </StrictMode>
);
