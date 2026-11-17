import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

test('Live uses its new name and canonical URL in metadata, navigation and schema', () => {
  const $ = load(fs.readFileSync('dist/live.html', 'utf8'));
  const url = 'https://ixaria.eu/live.html';
  assert.equal($('title').text(), 'Live Furniture Ecommerce Product Pages | IXARIA');
  assert.equal($('link[rel="canonical"]').attr('href'), url);
  assert.equal($('meta[property="og:url"]').attr('content'), url);
  assert.equal($('meta[property="og:title"]').attr('content'), $('title').text());
  assert.equal($('meta[name="twitter:title"]').attr('content'), $('title').text());
  assert.equal($('header a[href="/live.html"]').text().trim(), 'Live');
  assert.equal($('footer a[href="/live.html"]').text().trim(), 'Live');
  const graph = JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
  assert.equal(graph.find(item => item['@type'] === 'Service').name, 'Live furniture ecommerce product pages');
  assert.equal(graph.find(item => item['@type'] === 'BreadcrumbList').itemListElement.at(-1).name, 'Live');
  const sitemap = load(fs.readFileSync('dist/sitemap.xml', 'utf8'), { xmlMode: true });
  assert.equal(sitemap('url > loc').filter((_, item) => sitemap(item).text() === url).length, 1);
  for (const file of fs.readdirSync('dist', { recursive: true }).filter(file => /\.(html|css|js|xml)$/.test(file))) {
    assert.doesNotMatch(fs.readFileSync(path.join('dist', file), 'utf8'), /full[ -]?implementation|full-(hero|three|measure)/i, file);
  }
});

test('the former stage URL redirects to Live without indexing duplicate content', () => {
  const $ = load(fs.readFileSync('dist/full-implementation.html', 'utf8'));
  assert.equal($('meta[http-equiv="refresh"]').attr('content'), '0;url=/live.html');
  assert.equal($('meta[name="robots"]').attr('content'), 'noindex, follow');
  assert.equal($('link[rel="canonical"]').attr('href'), 'https://ixaria.eu/live.html');
  assert.equal($('a').attr('href'), '/live.html');
});
