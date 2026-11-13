import { createRequire } from 'node:module';

// Vite's content runner can otherwise transform this CommonJS dependency or
// cache an unresolved external import on Windows. Keep its evaluation in Node.
const require = createRequire(import.meta.url);
export default require('picomatch');
