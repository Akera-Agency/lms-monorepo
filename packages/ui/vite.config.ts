import { defineConfig } from 'vite';
import type { LibraryFormats } from 'vite';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/ui',
  plugins: [],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'ui',
      fileName: 'index',
      formats: ['es', 'cjs'] as LibraryFormats[],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
