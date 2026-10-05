import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import postcss from 'postcss';

const dist = path.resolve('dist');
const baseline = JSON.parse(fs.readFileSync('tests/fixtures/migration-baseline.json', 'utf8'));
const originalHow = JSON.parse(
  fs.readFileSync('tests/fixtures/how-it-works-baseline.json', 'utf8'),
);
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
    // The three-stage redesign is intentional; keep every other section on its original contract.
    if (name === 'index') main.find('#how-it-works').remove();
    const expectedContent =
      name === 'index' ? expected.content.replace(originalHow.content, '') : expected.content;
    const expectedHeadings =
      name === 'index'
        ? expected.headings.filter((heading) => !originalHow.headings.includes(heading))
        : expected.headings;
    assert.equal(
      contentHash(main.text()),
      contentHash(expectedContent),
      'visible page text must match the original source',
    );
    assert.deepEqual(
      main
        .find('h1,h2,h3')
        .toArray()
        .map((node) => $(node).text().replace(/\s+/g, ' ').trim()),
      expectedHeadings,
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
    if (!['FAQPage', 'HowTo'].includes(original['@type'])) {
      const expected =
        original['@type'] === 'WebPage' ? { ...original, dateModified: '2026-10-05' } : original;
      assert.deepEqual(migrated, expected);
    }
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
  assert.equal($('url > loc').length, 5);
  const images = $('image\\:loc')
    .toArray()
    .map((node) => $(node).text());
  assert.equal(images.length, 4);
  for (const image of images)
    assert.ok(fs.existsSync(path.join(dist, new URL(image).pathname)), image);
  const homeURL = $('url').filter((_, node) => $(node).find('loc').text() === 'https://ixaria.eu/');
  assert.equal(homeURL.find('lastmod').text(), '2026-10-05');
  assert.match(
    fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8'),
    /Sitemap: https:\/\/ixaria.eu\/sitemap.xml/,
  );
});

test('How it works shows the three requested stages with matching schema and detail pages', () => {
  const $ = documents.index;
  const cards = $('#how-it-works .process-card').toArray();
  const expected = [
    ['Audit', '/audit.html'],
    ['Pilot', '/pilot.html'],
    ['Full Implementation', '/full-implementation.html'],
  ];
  assert.equal(cards.length, 3);
  const schema = JSON.parse($('script[type="application/ld+json"]').text())['@graph'].find(
    (entity) => entity['@type'] === 'HowTo',
  );
  assert.equal(schema.totalTime, undefined, 'the former fixed one-month claim is removed');
  assert.equal(schema.step.length, 3);
  for (let index = 0; index < expected.length; index++) {
    const [title, route] = expected[index];
    const card = $(cards[index]);
    assert.equal(card.find('h3').text(), title);
    assert.equal(card.find('a').attr('href'), route);
    assert.equal(card.find('a').text().trim(), 'Read more');
    assert.equal(schema.step[index].position, index + 1);
    assert.equal(schema.step[index].name, title);
    assert.equal(schema.step[index].text, card.find('p').text());
    assert.equal(schema.step[index].url, `https://ixaria.eu${route}`);
    const detail = load(fs.readFileSync(path.join(dist, route), 'utf8'));
    assert.equal(detail('h1').length, 1);
    assert.equal(detail('nav[aria-label="Implementation stages"]').length, 0);
    assert.equal(detail('nav[aria-label="On this audit page"]').length, 0);
    if (title === 'Audit') {
      assert.equal(detail('h1').text(), 'What keeps your visitors from becoming customers?');
      assert.equal(detail('title').text(), 'Furniture Ecommerce Audit | Ixaria');
    } else {
      assert.equal(detail('h1').text(), title);
      assert.equal(detail('title').text(), `${title} — How Ixaria Works`);
    }
    assert.equal(detail('link[rel="canonical"]').attr('href'), schema.step[index].url);
    assert.equal(detail('meta[name="robots"]').attr('content'), 'index, follow');
    assert.equal(detail('header').html(), $('header').html());
    assert.equal(detail('footer').html(), $('footer').html());
    const graph = JSON.parse(detail('script[type="application/ld+json"]').text())['@graph'];
    assert.equal(graph.find((entity) => entity['@type'] === 'WebPage').url, schema.step[index].url);
    for (const anchor of detail('a[href]').toArray()) {
      const url = new URL(detail(anchor).attr('href'), schema.step[index].url);
      if (url.origin === 'https://ixaria.eu')
        assert.ok(
          fs.existsSync(path.join(dist, url.pathname === '/' ? 'index.html' : url.pathname)),
          url.href,
        );
    }
  }
});

test('audit preserves the offer, ordered sections, shared navigation and genuine assets', () => {
  const $ = load(fs.readFileSync(path.join(dist, 'audit.html'), 'utf8'));
  const main = $('main');
  assert.deepEqual(
    $('[data-audit-section]')
      .map((_, node) => $(node).attr('data-audit-section'))
      .get(),
    [
      'promise',
      'experience',
      'qualification',
      'shoppers',
      'investigation',
      'report',
      'process',
      'offer',
      'questions',
    ],
  );
  assert.equal($('header').html(), documents.index('header').html());
  assert.equal($('footer').html(), documents.index('footer').html());
  assert.equal($('h1').length, 1);
  assert.equal(main.find('form, dialog, [href*="stripe.com"]').length, 0);
  assert.equal($('script[src*="secureprivacy.ai"]').length, 1);
  assert.equal($('script[src*="googletagmanager.com"]').length, 0);
  assert.deepEqual(
    $('.audit-criteria li')
      .map((_, node) => $(node).text().trim())
      .get(),
    ['Active webshop', 'Existing online sales', 'Paid advertising', '30,000+ monthly visitors'],
  );
  assert.match($('[data-audit-section="shoppers"]').text(), /up to three priority markets/);
  assert.deepEqual(
    $('.audit-specialist__name')
      .map((_, node) => $(node).text())
      .get(),
    ['Alex', 'Eduard', 'Victor', 'Ovidiu'],
  );
  assert.equal($('.audit-specialist img').length, 3);
  assert.equal($('.audit-initials').text(), 'O');
  assert.deepEqual(
    $('[data-audit-section="experience"] img')
      .map((_, node) => $(node).attr('alt'))
      .get(),
    ['Sofa Mix', 'Expo Mob'],
  );
  assert.equal($('.audit-report__outline article').length, 3);
  assert.equal($('.audit-process > li').length, 4);
  assert.match($('.audit-process').text(), /30–45 minutes/);
  assert.match(
    $('.audit-process').text(),
    /seven calendar days after all specialist calls are complete and all requested data has been received/,
  );
  assert.match(
    $('.audit-offer__guarantee').text(),
    /within 14 days of the presentation.*refund the full fee/,
  );
  assert.equal($('.audit-hero__price strong').text(), '€1,500');
  assert.equal($('.audit-offer__price h3').text(), '€1,500');
  const booking = main
    .find('a')
    .filter((_, node) => $(node).text().trim() === 'Book a discovery call');
  assert.equal(booking.length, 3);
  for (const node of booking.toArray()) {
    assert.equal($(node).attr('href'), 'https://calendly.com/alex-ixaria/ixaria-strategy-session');
    assert.equal($(node).attr('target'), '_blank');
    assert.match($(node).attr('rel'), /noopener/);
  }
  const outsidePilotCopy = main.clone();
  outsidePilotCopy
    .find('[data-audit-section="report"], .faq__list, script, style, noscript')
    .remove();
  assert.doesNotMatch(outsidePilotCopy.text(), /pilot|full implementation/i);
  const download = main.find('a[download]');
  if (download.length) {
    assert.equal(download.text().trim(), 'Download example audit (PDF)');
    const pdf = path.join(dist, new URL(download.attr('href'), 'https://ixaria.eu').pathname);
    assert.equal(fs.readFileSync(pdf).subarray(0, 5).toString(), '%PDF-');
    assert.ok(download.attr('download').endsWith('.pdf'));
  } else {
    assert.equal($('.audit-example__pending').text().trim(), 'Example audit coming soon');
    assert.equal($('.audit-example a, .audit-report__preview').length, 0);
  }
  const graph = JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
  assert.ok(graph.some((entity) => entity['@type'] === 'Service'));
  const faq = graph.find((entity) => entity['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity.length, 6);
  $('.faq__item').each((index, node) => {
    assert.equal(faq.mainEntity[index].name, $(node).find('.faq__question').text().trim());
    assert.equal(
      faq.mainEntity[index].acceptedAnswer.text,
      $(node).find('.faq__answer').text().trim(),
    );
    const button = $(node).find('button');
    assert.equal(button.attr('aria-expanded'), 'false');
    assert.equal($(`#${button.attr('aria-controls')}`).attr('aria-labelledby'), button.attr('id'));
  });
  assert.doesNotMatch(main.text(), /VAT|subscription|guaranteed uplift|30.day money.back/i);
  for (const name of ['pilot', 'full-implementation']) {
    const page = load(fs.readFileSync(path.join(dist, `${name}.html`), 'utf8'));
    assert.doesNotMatch(page('main').text(), /[€£$]|1[,.]?500|30.day money.back/i);
    assert.equal(page('a[href*="stripe.com"]').length, 0);
  }
  for (const node of $('[src],[href]').toArray()) {
    const href = $(node).attr('src') ?? $(node).attr('href');
    if (!href || href.startsWith('mailto:')) continue;
    const url = new URL(href, 'https://ixaria.eu/audit.html');
    if (url.origin !== 'https://ixaria.eu') continue;
    assert.ok(
      fs.existsSync(path.join(dist, url.pathname === '/' ? 'index.html' : url.pathname)),
      href,
    );
    if (url.hash && url.pathname === '/audit.html') assert.equal($(url.hash).length, 1, href);
  }
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
