import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

// Serve the generated files independently of Astro's single preview process.
// Browser tests must never reuse the development server or stop a user's preview.
const root = path.resolve('dist');
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.jfif': 'image/jpeg', '.png': 'image/png',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.xml': 'application/xml',
};
http.createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404); response.end('Not found'); return;
    }
    const extension = path.extname(file);
    const headers = { 'Content-Type': mime[extension] ?? 'application/octet-stream', 'Cache-Control': 'max-age=600' };
    const compress = /\.(html|css|js|svg|xml)$/.test(file) && /\bgzip\b/.test(request.headers['accept-encoding'] ?? '');
    if (compress) {
      const body = gzipSync(fs.readFileSync(file));
      response.writeHead(200, { ...headers, 'Content-Encoding': 'gzip', 'Vary': 'Accept-Encoding', 'Content-Length': body.length });
      response.end(request.method === 'HEAD' ? undefined : body);
      return;
    }
    response.writeHead(200, headers);
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(file).pipe(response);
  } catch {
    response.writeHead(400); response.end('Bad request');
  }
}).listen(4330, '127.0.0.1');
