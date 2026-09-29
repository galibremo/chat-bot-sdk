import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Test against core's source rather than its bundled dist, which inlines
      // socket.io-client where the shared socket mock cannot reach it. Tests only;
      // the build still treats core as an external dependency.
      '@onedeskpro/chatbot-core': fileURLToPath(new URL('../core/src/index.ts', import.meta.url)),
      // socket.io-client is core's dependency, not ours: resolve it from core so
      // `vi.mock('socket.io-client')` in test/setup.ts targets the module core imports.
      'socket.io-client': fileURLToPath(new URL('../core/node_modules/socket.io-client', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    setupFiles: ['./test/setup.ts'],
  },
});
