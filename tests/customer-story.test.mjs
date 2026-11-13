import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import sharp from 'sharp';

const html = fs.readFileSync('dist/customer-stories/agache.html', 'utf8');
const $ = load(html);

test('Agache publishes approved monthly EUR totals alongside percentage growth', () => {
  const source = fs.readFileSync('src/data/customer-stories/agache.ts', 'utf8');
  for (const value of [html, source]) {
    assert.doesNotMatch(value, /0\.50%|0\.80%|96[xX]|60%|−30%/);
    assert.doesNotMatch(value, /This is an observed before-and-after comparison|Percentages are rounded; the period total/);
  }
  assert.match($('h1').text(), /256%/);
  assert.match($('#results').text(), /2026 compared with the same month in 2025/);
  assert.equal($('.story-methodology').length, 0);
  assert.doesNotMatch($('#results').text(), /How the results are measured|phone purchases/);
  assert.equal($('.story-chart__bars li').length, 7);
  const amounts = $('.story-chart__revenue tbody tr').map((_, row) => $(row).find('td').map((_, cell) => $(cell).text()).get().join(' / ')).get();
  assert.deepEqual(amounts, ['€8,451 / €24,991', '€5,321 / €19,126', '€2,032 / €14,286', '€9,460 / €19,094', '€2,664 / €12,865', '€4,896 / €17,651', '€5,758 / €29,423']);
  assert.match($('.story-chart__currency-note').text(), /Indicative conversion: €1 = RON 5.00/);
  assert.match($('meta[name="robots"]').attr('content'), /noindex/);
  assert.equal($('blockquote').length, 0, 'an unapproved testimonial is not presented as a quotation');
});

test('Agache screenshots, internal links and anchors resolve without JavaScript', async () => {
  const ids = $('[id]').map((_, el) => $(el).attr('id')).get();
  assert.equal(ids.length, new Set(ids).size);
  assert.equal($('h1').length, 1);
  assert.equal($('#the-change, a[href="#the-change"], .story-comparison').length, 0);
  for (const element of $('img[src]').toArray()) {
    const img = $(element); const file = path.join('dist', decodeURIComponent(img.attr('src')));
    assert.ok(fs.existsSync(file), file);
    assert.ok(img.attr('alt'));
    const metadata = await sharp(file).metadata();
    assert.ok(Number(img.attr('width')) > 0 && Number(img.attr('height')) > 0);
    if (img.attr('src').startsWith('/customer-stories/agache/')) {
      assert.ok(Math.abs(Number(img.attr('width')) / Number(img.attr('height')) - metadata.width / metadata.height) < .02, 'screenshot aspect ratio: ' + file);
    }
  }
  for (const element of $('article a[href]').toArray()) {
    const url = new URL($(element).attr('href'), 'https://ixaria.eu/customer-stories/agache.html');
    if (url.origin !== 'https://ixaria.eu') continue;
    assert.ok(fs.existsSync(path.join('dist', decodeURIComponent(url.pathname))), url.pathname);
    if (url.pathname === '/customer-stories/agache.html' && url.hash) assert.ok($(url.hash).length, url.hash);
  }
  assert.ok($('[data-story-enlarge]').length >= 4);
  assert.equal($('.story-lightbox form').attr('method'), 'dialog');
  assert.equal($('.story-lightbox button').attr('aria-label'), 'Close screenshot');
});
