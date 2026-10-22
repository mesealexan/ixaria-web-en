import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import postcss from 'postcss';

const dist = path.resolve('dist');
const baseline = JSON.parse(fs.readFileSync('tests/fixtures/migration-baseline.json', 'utf8'));
const approvedContent = JSON.parse(fs.readFileSync('tests/fixtures/page-content-baseline.json', 'utf8'));
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
    const revisedTitle = { index: 'Furniture Ecommerce Product Page Optimisation | IXARIA', cofounder: 'CTO Co-founder Role | IXARIA' }[name];
    assert.equal($('title').text(), revisedTitle ?? expected.title);
    assert.equal($('html').attr('lang'), 'en');
    assert.equal($('link[rel="canonical"]').length, 1);
    assert.equal(
      $('link[rel="canonical"]').attr('href'),
      expected.canonical ?? `https://ixaria.eu/${name}.html`,
    );
    for (const meta of expected.meta) {
      if (['index', 'cofounder'].includes(name) && ['description', 'og:title', 'og:description', 'twitter:title', 'twitter:description'].includes(meta.key)) continue;
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
    const expectedContent =
      name === 'index' ? approvedContent['/'].mainText : expected.content;
    const expectedHeadings =
      name === 'index'
        ? approvedContent['/'].headings.map(heading => heading.text)
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
        original['@type'] === 'WebPage' ? { ...original, name: $('title').text(), description: $('meta[name="description"]').attr('content'), dateModified: '2026-10-22' } : original;
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
  // Questions and answers follow the revised copy; removed topics stay excluded.
  assert.equal(items.length, 13);
  const removedQuestions = new Set(['Can we try a pilot?', 'Can the solution generate images in a live environment?']);
  for (const question of removedQuestions) {
    assert.equal(
      faqSchema.mainEntity.some((actual) => actual.name === question),
      false,
      question,
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
  assert.equal(images.length, 26);
  for (const image of images)
    assert.ok(fs.existsSync(path.join(dist, new URL(image).pathname)), image);
  const homeURL = $('url').filter((_, node) => $(node).find('loc').text() === 'https://ixaria.eu/');
  assert.equal(homeURL.find('lastmod').text(), '2026-10-22');
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
    assert.equal(card.find('a').text().trim(), title === 'Full Implementation' ? 'Explore Full Implementation' : 'Explore the ' + title);
    assert.equal(schema.step[index].position, index + 1);
    assert.equal(schema.step[index].name, title);
    assert.equal(schema.step[index].text, card.find('p').text());
    assert.equal(schema.step[index].url, `https://ixaria.eu${route}`);
    const detail = load(fs.readFileSync(path.join(dist, route), 'utf8'));
    assert.equal(detail('h1').length, 1);
    assert.equal(detail('nav[aria-label="Implementation stages"]').length, 0);
    assert.equal(detail('nav[aria-label="On this audit page"]').length, 0);
    if (title === 'Audit') {
      assert.equal(detail('h1').text(), "Find out what why your visitors don't buy?");
      assert.equal(detail('title').text(), 'Furniture Conversion Audit | IXARIA');
    } else {
      assert.equal(detail('h1').text(), title === 'Pilot' ? 'Use a smarter shopping experience on your bestsellers.' : 'Bring the proven approach to every product.');
      assert.equal(detail('title').text(), title === 'Pilot' ? 'Furniture Product Page Optimisation Pilot | IXARIA' : 'Furniture Ecommerce Product Page Implementation | IXARIA');
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

test('full implementation presents the rollout and pricing with shared chrome', () => {
  const $ = load(fs.readFileSync(path.join(dist, 'full-implementation.html'), 'utf8'));
  assert.deepEqual($('[data-implementation-section]').map((_, el) => $(el).attr('data-implementation-section')).get(),
    ['hero', 'implement', 'rollout', 'measurement', 'final']);
  assert.equal($('main section').length, 5);
  assert.equal($('h1').text(), 'Bring the proven approach to every product.');
  assert.equal($('h1 span').text(), 'every product.');
  assert.equal($('header').html(), documents.index('header').html());
  assert.equal($('footer').html(), documents.index('footer').html());
  assert.equal($('.audit-placeholder').length, 0);
  assert.equal($('.audit-receive__media').attr('src'), '/full-three.webp');
  assert.equal($('.pilot-measurement__media').attr('src'), '/full-measure.webp');
  assert.equal($('.audit-hero__media').attr('src'), '/full-hero.webp');
  assert.equal($('.pilot-price strong').text(), '€1,500 / month');
  assert.equal($('.implementation-monthly-price').text(), '€1,500 / month');
  assert.deepEqual($('.implementation-revenue-share').map((_, el) => $(el).text()).get(),
    ['+ 2% of every sales attributed to Ixaria', '+ 2% of every sales attributed to Ixaria']);
  assert.deepEqual($('.pilot-steps h3').map((_, el) => $(el).text()).get(), ['Prioritize', 'Adapt', 'Launch']);
  const booking = $('main a');
  assert.equal(booking.length, 2);
  booking.each((_, el) => {
    assert.equal($(el).text(), 'Book a Discovery call');
    assert.equal($(el).attr('href'), 'https://calendly.com/alex-ixaria/ixaria-strategy-session');
  });
  assert.equal($('main img').length, 3);
  assert.equal($('main video, .implementation-hero, .implementation-outcomes').length, 0);
  assert.doesNotMatch($('main').text(), /Keep learning|What you take forward|Build on what works/);
  const graph = JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
  assert.equal(graph.find(entity => entity['@type'] === 'Service').description, $('.audit-hero .audit-lead').text());
});

test('pilot presents the five-section scope, pricing, and next step with shared chrome', () => {
  const $ = load(fs.readFileSync(path.join(dist, 'pilot.html'), 'utf8'));
  assert.deepEqual($('[data-pilot-section]').map((_, el) => $(el).attr('data-pilot-section')).get(),
    ['hero', 'implement', 'why', 'measurement', 'final']);
  assert.equal($('main section').length, 5);
  assert.equal($('h1').text(), 'Use a smarter shopping experience on your bestsellers.');
  assert.equal($('h1 span').text(), 'on your bestsellers.');
  assert.equal($('header').html(), documents.index('header').html());
  assert.equal($('footer').html(), documents.index('footer').html());
  assert.equal($('.audit-placeholder').length, 0);
  assert.equal($('.audit-receive__media').attr('src'), '/pilot-months.webp');
  assert.equal($('.pilot-measurement__media').attr('src'), '/pilt-agree.webp');
  assert.equal($('.audit-hero__media').attr('src'), '/pilot-hero.webp');
  assert.equal($('.pilot-price').text(), '€1,500/month');
  assert.equal($('.pilot-terms').text(), 'Three months · €4,500 total');
  assert.equal($('.pilot-final-price').text(), '€1,500/month · €4,500 total');
  assert.equal($('.pilot-steps > li').length, 3);
  assert.deepEqual($('.pilot-metrics li').map((_, el) => $(el).text()).get(),
    ['Agreed success metric', 'Sales before Ixaria', 'Sales after Ixaria']);
  const booking = $('main a').filter((_, el) => $(el).text().trim() === 'Book a Discovery Call');
  assert.equal(booking.length, 2);
  booking.each((_, el) => assert.equal($(el).attr('href'), 'https://calendly.com/alex-ixaria/ixaria-strategy-session'));
  assert.equal($('.audit-pilot-link').attr('href'), '/full-implementation.html');
  assert.equal($('main img').length, 3);
  assert.equal($('main video, .implementation-hero, .implementation-outcomes').length, 0);
  const graph = JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
  assert.equal(graph.find(entity => entity['@type'] === 'Service').description, $('.audit-hero .audit-lead').text());
});

test('audit presents the conversion plan with shared integrations and current schema', () => {
  const $ = load(fs.readFileSync(path.join(dist, 'audit.html'), 'utf8'));
  assert.deepEqual($('[data-audit-section]').map((_, el) => $(el).attr('data-audit-section')).get(),
    ['hero', 'receive', 'process', 'approach', 'team', 'newsletter', 'final']);
  assert.equal($('h1').length, 1);
  assert.equal($('h1').text(), "Find out what why your visitors don't buy?");
  assert.equal($('h1 span').text(), "don't buy?");
  assert.equal($('header').html(), documents.index('header').html());
  assert.equal($('footer').html(), documents.index('footer').html());
  assert.equal($('.audit-process > li').length, 4);
  assert.equal($('.audit-flow > li').length, 3);
  assert.equal($('.audit-placeholder').length, 0);
  assert.equal($('.audit-approach__media').attr('src'), '/audit-right-info2.webp');
  assert.equal($('.audit-hero img').attr('src'), '/hero-audit.webp');
  assert.equal($('.audit-receive__media').attr('src'), '/audit-results.webp');
  assert.equal($('.audit-team img').length, 3);
  assert.deepEqual($('.audit-team img').map((_, el) => $(el).attr('src')).get(),
    ['/people/Alex.jpg', '/people/Ovi.jpg', '/people/Eduard.jpg']);
  assert.equal($('.audit-team__linkedin').length, 3);
  assert.match($('.audit-team').text(), /10\+ years building product configurators/);
  assert.match($('.audit-team').text(), /Marketing audits, data analysis, conversion rate optimization/);
  assert.match($('.audit-team').text(), /UX designer for Mercedes and Bayer/);
  assert.deepEqual($('.audit-team h3').map((_, el) => $(el).text()).get(),
    ['Alex Mesesan', 'Ovidiu Stegari', 'Eduard Badea']);
  assert.equal($('.audit-faq, .audit-guarantee, .audit-companies, dialog').length, 0);
  assert.doesNotMatch($('main').text(), /30,000|money-back|4,500|14-day|guaranteed uplift/);
  assert.equal($('.audit-price strong').text(), '€1,500');
  assert.equal($('.audit-price span').text(), 'One-time fee');
  assert.equal($('.audit-final__details, .audit-final__steps').length, 0);
  const booking = $('main a').filter((_, el) => $(el).text().replace(/\s+/g, ' ').trim() === 'Book a discovery call');
  assert.equal(booking.length, 2);
  assert.equal($('.cta-strip').length, 0);
  booking.each((_, el) => assert.equal($(el).attr('href'), 'https://calendly.com/alex-ixaria/ixaria-strategy-session'));
  assert.equal($('.audit-pilot-link').attr('href'), '/pilot.html');
  assert.equal($('#sib-form').attr('action'), documents.index('#sib-form').attr('action'));
  assert.equal($('#sib-form').attr('method'), 'POST');
  assert.deepEqual($('#sib-form input').map((_, el) => $(el).attr('name')).get(), ['EMAIL', 'email_address_check', 'locale']);
  assert.equal($('#sib-form button').text(), 'Join the newsletter');
  const graph = JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
  assert.equal(graph.some(el => el['@type'] === 'FAQPage'), false);
  assert.equal(graph.find(el => el['@type'] === 'Service').description, $('.audit-hero .audit-lead').text());
  for (const el of $('[src],[href]').toArray()) {
    const href = $(el).attr('src') ?? $(el).attr('href');
    if (!href || href.startsWith('mailto:')) continue;
    const url = new URL(href, 'https://ixaria.eu/audit.html');
    if (url.origin !== 'https://ixaria.eu') continue;
    assert.ok(fs.existsSync(path.join(dist, url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname))), href);
    if (url.hash && url.pathname === '/audit.html') assert.equal($(url.hash).length, 1, href);
  }
});

test('shared chrome and integration configuration are consistent across all pages', () => {
  const header = documents.index('header').html();
  const footer = documents.index('footer').html();
  for (const [name, $] of Object.entries(documents)) {
    assert.equal($('header').html(), header, name);
    assert.equal($('.navbar__process summary').text().trim(), 'Process', name);
    assert.deepEqual($('.navbar__process-links a').map((_, el) => [[$(el).text(), $(el).attr('href')]]).get(),
      [['Audit', '/audit.html'], ['Pilot', '/pilot.html'], ['Full Implementation', '/full-implementation.html']], name);
    assert.equal($('footer').html(), footer, name);
    assert.equal($('script[src*="secureprivacy.ai"]').length, 1, name);
    assert.equal($('script[src*="googletagmanager.com"]').length, 0, 'analytics loads only after consent');
    const hasAnalytics = $('script').text().includes("analytics_storage: 'denied'");
    assert.equal(hasAnalytics, !['privacy-policy', 'terms', 'cookie-policy'].includes(name), name);
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

test('indexable pages have consistent metadata, social cards and structured descriptions', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const filename of ['index.html', 'audit.html', 'pilot.html', 'full-implementation.html', 'cofounder.html']) {
    const $ = load(fs.readFileSync(path.join(dist, filename), 'utf8'));
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content');
    assert.ok(title && description);
    assert.ok(!titles.has(title) && !descriptions.has(description), filename);
    titles.add(title); descriptions.add(description);
    assert.equal($('meta[property="og:title"]').attr('content'), title);
    assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary_large_image');
    assert.equal($('meta[name="twitter:title"]').attr('content'), title);
    const graph = JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
    const page = graph.find(entity => entity['@type'] === 'WebPage');
    assert.equal(page.name, title);
    assert.equal(page.description, description);
    assert.equal(page.dateModified, filename === 'cofounder.html' ? '2026-10-06' : '2026-10-22');
    assert.equal($('link[href*="fonts.googleapis.com"]').length, 0);
    assert.ok($('link[rel="preload"][href="/fonts/inter-1.woff2"]').length);
  }
});
