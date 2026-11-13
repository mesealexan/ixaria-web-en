import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';

// Captured before the redesign, then updated only for approved content changes.
// Sorting permits section reordering while preserving approved text and repetition.
const baseline = JSON.parse(fs.readFileSync('tests/fixtures/design-content-baseline.json', 'utf8'));
for (const [route, expected] of Object.entries(baseline)) {
  test(`${route}: design retains every approved text block`, () => {
    const $ = load(fs.readFileSync(path.join('dist', route === '/' ? 'index.html' : route.slice(1)), 'utf8'));
    $('script,style,noscript').remove();
    const blocks = [];
    function walk(node) {
      if (node.type === 'text') {
        const text = node.data.replace(/\s+/g, ' ').trim();
        if (text) blocks.push(text);
      }
      for (const child of node.children ?? []) walk(child);
    }
    walk($('body')[0]);
    assert.equal(blocks.length, expected.textBlocks);
    assert.equal(createHash('sha256').update(blocks.sort().join('\0')).digest('hex'), expected.textBlockHash);
  });
}
