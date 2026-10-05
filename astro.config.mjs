import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ixaria.eu',
  output: 'static',
  build: { format: 'file', inlineStylesheets: 'never' },
  trailingSlash: 'never',
  // Keep the content loader's CommonJS matcher in Node, including on a cold build.
  vite: {
    environments: {
      astro: { resolve: { external: ['picomatch'] } },
    },
  },
});
