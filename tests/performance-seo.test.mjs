import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import sharp from 'sharp';

const baseline = JSON.parse(fs.readFileSync('tests/fixtures/page-content-baseline.json', 'utf8'));
for (const [route, expected] of Object.entries(baseline)) {
  test(`${route}: performance changes preserve approved page content and SEO foundations`, () => {
    const $ = load(fs.readFileSync(path.join('dist', route === '/' ? 'index.html' : route), 'utf8'));
    const body = $('body').clone();
    body.find('script,style,noscript').remove();
    const hash = createHash('sha256').update(body.text().replace(/\s+/g, ' ').trim()).digest('hex');
    assert.equal(hash, expected.textHash, 'all body text is unchanged');
    assert.deepEqual($('h1,h2,h3').toArray().map(el => ({ level: el.tagName, text: $(el).text().replace(/\s+/g, ' ').trim() })), expected.headings);
    assert.equal($('h1').length, 1);
    assert.equal($('link[rel="canonical"]').attr('href'), 'https://ixaria.eu' + route);
    assert.equal($('html').attr('lang'), 'en');
    const ids = $('[id]').toArray().map(el => $(el).attr('id'));
    assert.equal(new Set(ids).size, ids.length, 'IDs are unique');
    for (const el of $('img').toArray()) {
      const image = $(el);
      assert.ok(image.attr('alt') !== undefined, 'alt attribute exists');
      assert.ok(Number(image.attr('width')) > 0 && Number(image.attr('height')) > 0, 'explicit dimensions');
      if (image.attr('srcset')) {
        assert.ok(image.attr('sizes'), 'responsive image specifies layout size');
        for (const candidate of image.attr('srcset').split(',')) {
          const [src] = candidate.trim().split(/\s+/);
          assert.ok(fs.existsSync(path.join('dist', decodeURIComponent(src))), src);
        }
      }
    }
    for (const property of ['og:image', 'twitter:image']) {
      const url = new URL($(`meta[property="${property}"],meta[name="${property}"]`).attr('content'));
      assert.equal(url.origin, 'https://ixaria.eu');
      assert.equal(url.pathname, '/webpreview.webp');
      assert.ok(fs.existsSync(path.join('dist', url.pathname)));
    }
    const hero = $('.audit-hero__media');
    if (hero.length) {
      assert.equal(hero.attr('fetchpriority'), 'high');
      assert.notEqual(hero.attr('loading'), 'lazy');
      assert.ok(hero.attr('srcset'));
    }
  });
}

test('responsive image descriptors match actual file dimensions', async () => {
  const manifest = JSON.parse(fs.readFileSync('src/data/responsive-images.json', 'utf8'));
  for (const [src, image] of Object.entries(manifest)) {
    const original = await sharp(path.join('public', src)).metadata();
    for (const candidate of image.srcset.split(',')) {
      const [url, descriptor] = candidate.trim().split(/\s+/);
      const actual = await sharp(path.join('public', url)).metadata();
      assert.equal(actual.width, Number.parseInt(descriptor), url);
      assert.ok(Math.abs(actual.width / actual.height - original.width / original.height) < 0.01, 'original crop preserved: ' + url);
      assert.equal(actual.format, 'webp');
    }
  }
});
