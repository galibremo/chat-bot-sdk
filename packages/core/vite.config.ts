import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TypeTechITChatbot',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        if (format === 'iife') return 'index.iife.js';
        if (format === 'es') return 'index.js';
        return 'index.cjs';
      },
    },
    rollupOptions: {
      // Zero external deps — self-contained for CDN IIFE build
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
