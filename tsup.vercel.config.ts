import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['api/index.ts'],
  format: ['esm'],
  target: 'esnext',
  outDir: 'dist/api',
  clean: false,
  bundle: true,
  splitting: false,
  sourcemap: true,
  banner: {
    js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
`,
  },
});
