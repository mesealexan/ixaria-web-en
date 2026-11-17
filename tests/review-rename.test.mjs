import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

test('Review is the only current offer name, canonical URL and sitemap entry', () => {
  const html = fs.readFileSync('dist/review.html', 'utf8');
  const $ = load(html);
  const url = 'https://ixaria.eu/review.html';
  assert.equal($('title').text(), 'Furniture Conversion Review | IXARIA');
  assert.equal($('link[rel="canonical"]').attr('href'), url);
  assert.equal($('meta[property="og:url"]').attr('content'), url);
  assert.equal($('meta[property="og:title"]').attr('content'), $('title').text());
  assert.equal($('meta[name="twitter:title"]').attr('content'), $('title').text());
  const graph = JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
  assert.equal(graph.find(item => item['@type'] === 'Service').name, 'FURNITURE CONVERSION REVIEW');
  assert.equal(graph.find(item => item['@type'] === 'BreadcrumbList').itemListElement.at(-1).name, 'Review');
  const sitemap = load(fs.readFileSync('dist/sitemap.xml', 'utf8'), { xmlMode: true });
  assert.equal(sitemap('url > loc').filter((_, item) => sitemap(item).text() === url).length, 1);
  assert.doesNotMatch(sitemap.xml(), /audit/i);
  for (const file of fs.readdirSync('dist', { recursive: true }).filter(file => /\.(html|css|js|xml)$/.test(file))) {
    assert.doesNotMatch(fs.readFileSync(path.join('dist', file), 'utf8'), /audit/i, file);
  }
});

test('the former URL forwards visitors to Review without indexing a duplicate page', () => {
  const $ = load(fs.readFileSync('dist/audit.html', 'utf8'));
  assert.equal($('meta[http-equiv="refresh"]').attr('content'), '0;url=/review.html');
  assert.equal($('meta[name="robots"]').attr('content'), 'noindex, follow');
  assert.equal($('link[rel="canonical"]').attr('href'), 'https://ixaria.eu/review.html');
  assert.equal($('a').attr('href'), '/review.html');
});
