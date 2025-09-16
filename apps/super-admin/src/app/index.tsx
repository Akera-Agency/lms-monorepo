import { TanstackRouterProvider } from './providers/router-provider';
import {
  ToastProvider,
  ToastViewport,
} from '../../../../packages/ui/src/components/toast/toast';
import { Toaster } from '../../../../packages/ui/src/components/toast/toaster';

function App() {
  return (
    <ToastProvider>
      <ToastViewport />
      <TanstackRouterProvider />
      <Toaster />
    </ToastProvider>
  );
}
export default App;
