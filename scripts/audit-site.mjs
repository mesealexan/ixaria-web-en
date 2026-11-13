import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { load } from 'cheerio';

const output = process.argv[2] ?? '.tmp/audit-after.json';
const files = fs.readdirSync('public', { recursive: true }).filter(file => /\.(png|jpe?g|jfif|webp|avif|svg|gif)$/i.test(file));
const assets = [];
for (const file of files) {
  const source = path.join('public', file);
  const metadata = await sharp(source).metadata().catch(() => ({}));
  assets.push({ url: '/' + file.replaceAll('\\', '/'), bytes: fs.statSync(source).size, width: metadata.width, height: metadata.height, format: metadata.format, pages: [] });
}
const assetMap = new Map(assets.map(asset => [asset.url, asset]));
const pages = [];
for (const file of fs.readdirSync('dist', { recursive: true }).filter(file => file.endsWith('.html'))) {
  const html = fs.readFileSync(path.join('dist', file), 'utf8');
  const $ = load(html);
  const route = file === 'index.html' ? '/' : '/' + file.replaceAll('\\', '/');
  const content = $('body').clone();
  content.find('script,style,noscript').remove();
  const textHash = createHash('sha256').update(content.text().replace(/\s+/g, ' ').trim()).digest('hex');
  const issues = [];
  const images = $('img[src],img[srcset]').toArray().map(el => {
    const image = $(el);
    const src = decodeURIComponent(image.attr('src') ?? '');
    const asset = assetMap.get(src);
    if (asset && !asset.pages.includes(route)) asset.pages.push(route);
    const decorative = !!image.closest('[aria-hidden="true"]').length || image.attr('role') === 'presentation';
    if (image.attr('alt') === undefined) issues.push('Image missing alt: ' + src);
    if (!image.attr('alt') && !decorative) issues.push('Empty alt outside decorative context: ' + src);
    if (!image.attr('width') || !image.attr('height')) issues.push('Image missing dimensions: ' + src);
    if (!asset && src.startsWith('/')) issues.push('Missing image file: ' + src);
    for (const entry of (image.attr('srcset') ?? '').split(',').filter(Boolean)) {
      const candidate = decodeURIComponent(entry.trim().split(/\s+/)[0]);
      const related = assetMap.get(candidate);
      if (related && !related.pages.includes(route)) related.pages.push(route);
      if (!related) issues.push('Missing srcset file: ' + candidate);
    }
    return { src, alt: image.attr('alt'), decorative, width: image.attr('width'), height: image.attr('height'), loading: image.attr('loading'), priority: image.attr('fetchpriority'), srcset: image.attr('srcset'), sizes: image.attr('sizes'), bytes: asset?.bytes, naturalWidth: asset?.width, naturalHeight: asset?.height };
  });
  const references = $('[src],[href],[poster],[data-color-image]').toArray().flatMap(el => ['src','href','poster','data-color-image'].map(attr => $(el).attr(attr)).filter(Boolean));
  for (const ref of references) {
    const url = new URL(ref, 'https://ixaria.eu' + route);
    if (url.origin !== 'https://ixaria.eu') continue;
    const asset = assetMap.get(decodeURIComponent(url.pathname));
    if (asset && !asset.pages.includes(route)) asset.pages.push(route);
    const filePath = path.join('dist', decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!fs.existsSync(filePath)) issues.push('Broken local reference: ' + ref);
    else if (url.hash && filePath.endsWith('.html')) {
      const target = filePath === path.join('dist', file) ? $ : load(fs.readFileSync(filePath, 'utf8'));
      if (!target('[id]').toArray().some(el => target(el).attr('id') === decodeURIComponent(url.hash.slice(1)))) issues.push('Broken anchor: ' + ref);
    }
  }
  const canonical = $('link[rel="canonical"]').attr('href');
  for (const key of ['og:image', 'twitter:image']) {
    const ref = $(`meta[property="${key}"],meta[name="${key}"]`).attr('content');
    if (!ref) issues.push('Missing social image: ' + key);
    else {
      const url = new URL(ref);
      const asset = assetMap.get(decodeURIComponent(url.pathname));
      if (!asset) issues.push('Missing social image file: ' + ref);
      else if (!asset.pages.includes(route)) asset.pages.push(route);
    }
  }
  if ($('h1').length !== 1) issues.push('Expected one H1');
  if ($('title').length !== 1 || !$('title').text()) issues.push('Missing/duplicate title');
  if ($('meta[name="description"]').length !== 1 || !$('meta[name="description"]').attr('content')) issues.push('Missing/duplicate meta description');
  if ($('link[rel="canonical"]').length !== 1 || canonical !== 'https://ixaria.eu' + route) issues.push('Invalid canonical');
  if ($('html').attr('lang') !== 'en') issues.push('Missing English language declaration');
  const ids = $('[id]').toArray().map(el => $(el).attr('id'));
  if (new Set(ids).size !== ids.length) issues.push('Duplicate IDs');
  let graph;
  try { graph = JSON.parse($('script[type="application/ld+json"]').text()); } catch { if (!($('meta[name="robots"]').attr('content') ?? '').includes('noindex')) issues.push('Invalid/missing JSON-LD'); }
  const uniqueSources = [...new Set(images.map(image => image.src))];
  pages.push({ route, htmlBytes: Buffer.byteLength(html), textHash, title: $('title').text(), description: $('meta[name="description"]').attr('content'), canonical, robots: $('meta[name="robots"]').attr('content'), headings: $('h1,h2,h3').toArray().map(el => ({level: el.tagName, text: $(el).text().replace(/\s+/g, ' ').trim()})), images, uniqueImageBytes: uniqueSources.reduce((sum, src) => sum + (assetMap.get(src)?.bytes ?? 0), 0), videos: $('video').toArray().map(el => ({ src: $(el).attr('src'), poster: $(el).attr('poster'), bytes: fs.statSync(path.join('public', $(el).attr('src'))).size })), graph, issues: [...new Set(issues)] });
}
for (const key of ['title', 'description']) {
  const values = new Set();
  for (const page of pages) {
    if (values.has(page[key])) page.issues.push('Duplicate page ' + key);
    values.add(page[key]);
  }
}
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ pages, assets }, null, 2));
console.log(JSON.stringify({ pages: pages.map(({route,images,uniqueImageBytes,issues,videos})=>({route,images:images.length,uniqueImageBytes,issues,videos})), assets: assets.length, largestUsed: assets.filter(a=>a.pages.length).sort((a,b)=>b.bytes-a.bytes).slice(0,15) }, null, 2));
if (pages.some(page => page.issues.length)) process.exitCode = 1;
