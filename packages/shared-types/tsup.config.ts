import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // tsup always injects `baseUrl` into its dts build, which TS 6 flags as deprecated.
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  clean: true,
  // Match the .js (ESM) / .cjs (CJS) layout used by the core and react packages
  outExtension: ({ format }) => ({ js: format === 'esm' ? '.js' : '.cjs' }),
});
