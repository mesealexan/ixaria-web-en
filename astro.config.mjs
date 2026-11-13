import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://ixaria.eu',
  output: 'static',
  build: { format: 'file', inlineStylesheets: 'never' },
  trailingSlash: 'never',
  // Give the content loader a stable ESM boundary around its CommonJS matcher.
  vite: {
    resolve: { alias: { picomatch: fileURLToPath(new URL('./scripts/picomatch-node.mjs', import.meta.url)) } },
  },
});
