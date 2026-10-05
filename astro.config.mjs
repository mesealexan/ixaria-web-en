import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ixaria.eu',
  output: 'static',
  build: { format: 'file', inlineStylesheets: 'never' },
  trailingSlash: 'never',
});
