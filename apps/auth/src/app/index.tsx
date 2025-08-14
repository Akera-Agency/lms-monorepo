import { TanstackRouterProvider } from './providers/router-provider';
import { ThemeProvider } from './providers/theme-provider';

function App() {
  return (
    <ThemeProvider>
      <TanstackRouterProvider />
    </ThemeProvider>
  );
}

export default App;
