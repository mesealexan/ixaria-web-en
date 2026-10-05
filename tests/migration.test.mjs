import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import postcss from 'postcss';

const dist = path.resolve('dist');
const baseline = JSON.parse(fs.readFileSync('tests/fixtures/migration-baseline.json', 'utf8'));
const schemaBaseline = JSON.parse(
  fs.readFileSync('tests/fixtures/home-schema-baseline.json', 'utf8'),
);
const documents = Object.fromEntries(
  Object.keys(baseline).map((name) => [
    name,
    load(fs.readFileSync(path.join(dist, `${name}.html`), 'utf8')),
  ]),
);
const compact = (text) => text.replace(/\s+/g, '');
const contentHash = (text) => createHash('sha256').update(compact(text)).digest('hex');

for (const [name, expected] of Object.entries(baseline)) {
  const $ = documents[name];
  test(`${name}: preserves all existing SEO values and canonical URL`, () => {
    assert.equal($('title').text(), expected.title);
    assert.equal($('html').attr('lang'), 'en');
    assert.equal($('link[rel="canonical"]').length, 1);
    assert.equal(
      $('link[rel="canonical"]').attr('href'),
      expected.canonical ?? `https://ixaria.eu/${name}.html`,
    );
    for (const meta of expected.meta) {
      const nodes = $('meta').filter(
        (_, node) => $(node).attr('name') === meta.key || $(node).attr('property') === meta.key,
      );
      assert.equal(nodes.length, 1, `one ${meta.key} tag`);
      assert.equal(nodes.attr('content'), meta.content, meta.key);
    }
    for (const alternate of expected.alternates)
      assert.equal($(`link[hreflang="${alternate.language}"]`).attr('href'), alternate.href);
  });

  test(`${name}: preserves visible content and heading hierarchy in static HTML`, () => {
    const main = $('main').clone();
    main.find('script,style,noscript,#email-msg-success,#email-msg-error').remove();
    assert.equal(
      contentHash(main.text()),
      contentHash(expected.content),
      'visible page text must match the original source',
    );
    assert.deepEqual(
      main
        .find('h1,h2,h3')
        .toArray()
        .map((node) => $(node).text().replace(/\s+/g, ' ').trim()),
      expected.headings,
    );
    assert.equal($('h1').length, 1);
    assert.equal($('main').length, 1);
    assert.equal($('header nav[aria-label="Main navigation"]').length, 1);
    assert.equal($('footer').length, 1);
    assert.equal(
      $('[id]').length,
      new Set(
        $('[id]')
          .toArray()
          .map((node) => $(node).attr('id')),
      ).size,
      'unique element IDs',
    );
  });

  test(`${name}: every local link, asset and anchor resolves`, () => {
    const references = $('[href],[src],[poster]')
      .toArray()
      .flatMap((node) =>
        ['href', 'src', 'poster'].map((attribute) => $(node).attr(attribute)).filter(Boolean),
      );
    references.push(
      ...$('[srcset]')
        .toArray()
        .flatMap((node) =>
          $(node)
            .attr('srcset')
            .split(',')
            .map((value) => value.trim().split(/\s/)[0]),
        ),
    );
    for (const reference of references) {
      const url = new URL(reference, `https://ixaria.eu/${name === 'index' ? '' : `${name}.html`}`);
      if (url.origin !== 'https://ixaria.eu') continue;
      const asset = path.join(
        dist,
        decodeURIComponent(url.pathname === '/' ? 'index.html' : url.pathname),
      );
      assert.ok(fs.existsSync(asset), `${reference} exists`);
      if (url.hash && asset.endsWith('.html')) {
        const target = load(fs.readFileSync(asset, 'utf8'));
        assert.ok(
          target('[id]')
            .toArray()
            .some((node) => target(node).attr('id') === decodeURIComponent(url.hash.slice(1))),
          `${reference} anchor exists`,
        );
      }
    }
  });
}

test('structured data preserves the original entities, relationships and IDs', () => {
  const $ = documents.index;
  assert.equal($('script[type="application/ld+json"]').length, 1);
  const actual = JSON.parse($('script[type="application/ld+json"]').text());
  assert.equal(actual['@context'], schemaBaseline['@context']);
  for (const original of schemaBaseline['@graph']) {
    const migrated = actual['@graph'].find((entity) =>
      original['@id'] ? entity['@id'] === original['@id'] : entity['@type'] === original['@type'],
    );
    assert.ok(migrated, original['@type']);
    if (original['@type'] !== 'FAQPage') assert.deepEqual(migrated, original);
  }
  const faqSchema = actual['@graph'].find((entity) => entity['@type'] === 'FAQPage');
  const items = $('.faq__item').toArray();
  assert.equal(faqSchema.mainEntity.length, items.length);
  for (let index = 0; index < items.length; index++) {
    assert.equal(
      compact(faqSchema.mainEntity[index].name),
      compact($(items[index]).find('.faq__question').text()),
    );
    assert.equal(
      compact(faqSchema.mainEntity[index].acceptedAnswer.text),
      compact($(items[index]).find('.faq__answer').text()),
    );
  }
  // Answers can now follow visible copy, but none of the original questions may disappear.
  for (const question of schemaBaseline['@graph'].find((entity) => entity['@type'] === 'FAQPage')
    .mainEntity) {
    assert.ok(
      faqSchema.mainEntity.some((actual) => actual.name === question.name),
      question.name,
    );
  }
});

test('sitemap contains precisely the indexable canonical pages and valid image URLs', () => {
  const xml = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
  const $ = load(xml, { xml: true });
  const allPages = fs
    .readdirSync(dist)
    .filter((file) => file.endsWith('.html'))
    .map((file) => load(fs.readFileSync(path.join(dist, file), 'utf8')));
  const expected = allPages
    .filter((doc) => !doc('meta[name="robots"]').attr('content').includes('noindex'))
    .map((doc) => doc('link[rel="canonical"]').attr('href'));
  assert.deepEqual(
    $('url > loc')
      .toArray()
      .map((node) => $(node).text())
      .sort(),
    expected.sort(),
  );
  assert.equal($('url > loc').length, 2);
  const images = $('image\\:loc')
    .toArray()
    .map((node) => $(node).text());
  assert.equal(images.length, 4);
  for (const image of images)
    assert.ok(fs.existsSync(path.join(dist, new URL(image).pathname)), image);
  assert.equal($('url').first().find('lastmod').text(), '2026-08-07');
  assert.match(
    fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8'),
    /Sitemap: https:\/\/ixaria.eu\/sitemap.xml/,
  );
});

test('shared chrome and integration configuration are consistent across all pages', () => {
  const header = documents.index('header').html();
  const footer = documents.index('footer').html();
  for (const [name, $] of Object.entries(documents)) {
    assert.equal($('header').html(), header, name);
    assert.equal($('footer').html(), footer, name);
    assert.equal($('script[src*="secureprivacy.ai"]').length, 1, name);
    assert.equal($('script[src*="googletagmanager.com"]').length, name === 'index' ? 1 : 0, name);
    assert.equal($('[onclick],[onkeydown]').length, 0, 'no fragile inline event handlers');
    assert.equal(
      $('[src*="sibforms.com/forms/end-form"]').length,
      0,
      'one newsletter submit handler',
    );
  }
  assert.equal(fs.readFileSync(path.join(dist, 'CNAME'), 'utf8').trim(), 'ixaria.eu');
  assert.ok(fs.existsSync(path.join(dist, '.nojekyll')));
});

test('all generated CSS font and image references resolve', () => {
  for (const name of fs
    .readdirSync(path.join(dist, '_astro'))
    .filter((name) => name.endsWith('.css'))) {
    const stylesheet = postcss.parse(fs.readFileSync(path.join(dist, '_astro', name), 'utf8'));
    stylesheet.walkDecls((declaration) => {
      for (const match of declaration.value.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
        const url = new URL(match[1], `https://ixaria.eu/_astro/${name}`);
        if (url.origin === 'https://ixaria.eu')
          assert.ok(fs.existsSync(path.join(dist, url.pathname)), match[1]);
      }
    });
  }
});
