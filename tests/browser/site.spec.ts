import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Keep external vendors out of deterministic browser checks; no live signup.
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== '127.0.0.1')
      await route.fulfill({
        status: 200,
        body: '',
        contentType: url.pathname.endsWith('.js') ? 'application/javascript' : 'text/plain',
      });
    else await route.continue();
  });
});

for (const width of [1440, 390]) {
  test(`shopper questions are ready and animate on entry at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 600 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.clock.install({ time: new Date('2026-10-22T10:00:00Z') });
    await page.goto('/');
    await page.clock.pauseAt(new Date('2026-10-22T10:00:10Z'));
    const visual = page.locator('.product-questions');
    const questions = visual.locator('.product-questions__bubble:not([hidden])');
    await expect(questions).toHaveCount(3);
    await expect(visual.locator('.is-changing')).toHaveCount(0);
    const initial = await questions.evaluateAll(els => els.map(el => el.getAttribute('data-question')));

    // Only the first few pixels are visible: animation must already have started.
    await visual.evaluate(el => window.scrollTo({ top: scrollY + el.getBoundingClientRect().top - innerHeight + 10, behavior: 'instant' }));
    await page.clock.runFor(100);
    await expect(questions).toHaveCount(3);
    await expect(visual.locator('.is-changing')).toHaveCount(1);
    await page.clock.runFor(450);
    expect(await questions.evaluateAll(els => els.map(el => el.getAttribute('data-question')))).not.toEqual(initial);
    await expect(questions).toHaveCount(3);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.clock.runFor(100);
    const paused = await questions.evaluateAll(els => els.map(el => el.getAttribute('data-question')));
    await page.clock.runFor(3000);
    expect(await questions.evaluateAll(els => els.map(el => el.getAttribute('data-question')))).toEqual(paused);
  });
}

test('shopper questions stay populated without animation for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/');
  const visual = page.locator('.product-questions');
  await visual.scrollIntoViewIfNeeded();
  const questions = visual.locator('.product-questions__bubble:not([hidden])');
  await expect(questions).toHaveCount(3);
  const initial = await questions.allTextContents();
  await page.clock.runFor(5000);
  expect(await questions.allTextContents()).toEqual(initial);
  await expect(visual.locator('.is-changing')).toHaveCount(0);
});

for (const width of [1920, 1440, 1160, 820, 768, 600, 390, 320]) {
  test(`homepage sections align with the hero at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const containers = await page.locator('.hero__inner, .client-logos > .container, .visitor-conversion__inner, .solution > .container, .how > .container, .cta-strip__inner, .features > .container, .email-capture__inner, .about__inner, .faq > .container').evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return { name: element.className, left: rect.left, right: rect.right, paddingLeft: parseFloat(style.paddingLeft), paddingRight: parseFloat(style.paddingRight) };
    }));
    expect(containers.length).toBeGreaterThanOrEqual(13);
    const hero = containers[0];
    for (const container of containers.slice(1)) {
      for (const edge of ['left', 'right', 'paddingLeft', 'paddingRight'] as const) {
        expect(Math.abs(container[edge] - hero[edge]), `${container.name}: ${edge}`).toBeLessThan(1);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const route of [
  '/',
  '/index.html',
  '/cofounder.html',
  '/privacy-policy.html',
  '/terms.html',
  '/cookie-policy.html',
  '/audit.html',
  '/pilot.html',
  '/full-implementation.html',
]) {
  test(`${route} renders with working assets and no application errors`, async ({ page }) => {
    const errors: string[] = [];
    const failed: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.url().startsWith('http://127.0.0.1') && response.status() >= 400)
        failed.push(response.url());
    });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('header .navbar')).toBeVisible();
    await expect(page.locator('footer')).toBeAttached();
    for (const booking of await page.locator('a.btn[href="https://calendly.com/alex-ixaria/ixaria-strategy-session"]').all()) {
      const isWhite = await booking.evaluate(el => el.classList.contains('btn-white'));
      await expect(booking).toHaveCSS('background-color', isWhite ? 'rgb(255, 255, 255)' : 'rgb(255, 95, 10)');
      if (isWhite) await expect(booking).toHaveCSS('color', 'rgb(9, 9, 89)');
    }
    await expect(page.locator('astro-error-overlay, vite-error-overlay')).toHaveCount(0);
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(
      `https://ixaria.eu${route === '/index.html' ? '/' : route}`,
    );
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images].map((image) => {
          image.loading = 'eager';
          return image.decode().catch(() => {});
        }),
      );
    });
    expect(
      await page
        .locator('img')
        .evaluateAll((images) =>
          images
            .filter((image) => !(image as HTMLImageElement).naturalWidth)
            .map((image) => image.getAttribute('src')),
        ),
    ).toEqual([]);
    expect(failed).toEqual([]);
    expect(errors).toEqual([]);
  });
}

for (const width of [1280, 390]) {
  test(`three implementation stages open their detail pages at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const [title, path] of [
      ['Audit', '/audit.html'],
      ['Pilot', '/pilot.html'],
      ['Full Implementation', '/full-implementation.html'],
    ]) {
      await page.goto('/#how-it-works');
      await expect(page.locator('#how-it-works h3')).toHaveText([
        'Audit',
        'Pilot',
        'Full Implementation',
      ]);
      await page.locator('#how-it-works').getByRole('link', { name: title === 'Full Implementation' ? 'Explore Full Implementation' : `Explore the ${title}`, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path.replace('.', '\\.')}$`));
      await expect(page.locator('h1')).toHaveText(
        title === 'Audit' ? "Find out what why your visitors don't buy?" : title === 'Pilot' ? 'Use a smarter shopping experience on your bestsellers.' : 'Bring the proven approach to every product.',
      );
      await expect(page.getByRole('navigation', { name: 'Implementation stages' })).toHaveCount(0);
      await expect(page.getByRole('navigation', { name: 'On this audit page' })).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      if (width <= 768) await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page.locator('header').getByRole('link', { name: 'How it works', exact: true }).click();
      await expect(page).toHaveURL(/\/#solution$/);
    }
  });
}

for (const width of [1440, 820, 390, 320]) {
  test(`full implementation layout and booking links at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/full-implementation.html');
    await expect(page.locator('h1')).toHaveText('Bring the proven approach to every product.');
    await expect(page.locator('h1 span')).toHaveCSS('color', 'rgb(0, 0, 255)');
    await expect(page.locator('.audit-receive')).toHaveCSS('background-color', 'rgb(9, 9, 89)');
    await expect(page.locator('.pilot-measurement')).toHaveCSS('background-color', 'rgb(238, 244, 255)');
    await expect(page.locator('.audit-placeholder')).toHaveCount(0);
    await expect(page.locator('.full-implementation-page .audit-receive__media')).toHaveAttribute('src', '/full-three.webp');
    await expect(page.locator('.full-implementation-page .pilot-measurement__media')).toHaveAttribute('src', '/full-measure.webp');
    await expect(page.locator('.full-implementation-page .audit-hero__media')).toHaveAttribute('src', '/full-hero.webp');
    await expect(page.locator('.pilot-price strong, .implementation-monthly-price')).toHaveText(['€1,500 / month', '€1,500 / month']);
    await expect(page.locator('.implementation-revenue-share')).toHaveText(['+ 2% of every sales attributed to Ixaria', '+ 2% of every sales attributed to Ixaria']);
    await expect(page.locator('.pilot-steps h3')).toHaveText(['Prioritize', 'Adapt', 'Launch']);
    const booking = page.locator('main').getByRole('link', { name: 'Book a Discovery call', exact: true });
    await expect(booking).toHaveCount(2);
    for (const link of await booking.all()) await expect(link).toHaveAttribute('href', 'https://calendly.com/alex-ixaria/ixaria-strategy-session');
    expect(await page.locator('.full-implementation-page h1, .full-implementation-page h2, .full-implementation-page h3, .full-implementation-page p, .full-implementation-page figure, .full-implementation-page li, .full-implementation-page a').evaluateAll(els => els.filter(el => {
      const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 1);
    }).map(el => el.textContent))).toEqual([]);
    if (width <= 768) {
      for (const container of await page.locator('.full-implementation-page .audit-grid, .full-implementation-page .pilot-steps').all()) {
        const boxes = await container.locator(':scope > *').evaluateAll(els => els.map(el => {
          const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom };
        }));
        for (let i = 1; i < boxes.length; i++) expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].bottom);
      }
      expect(await booking.first().evaluate(el => el.getBoundingClientRect().width)).toBe(width - 40);
    }
  });
}

for (const width of [1440, 820, 390, 320]) {
  test(`pilot layout and booking links at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/pilot.html');
    await expect(page.locator('h1')).toHaveText('Use a smarter shopping experience on your bestsellers.');
    await expect(page.locator('h1 span')).toHaveCSS('color', 'rgb(0, 0, 255)');
    await expect(page.locator('.pilot-page .audit-receive')).toHaveCSS('background-color', 'rgb(9, 9, 89)');
    await expect(page.locator('.pilot-measurement')).toHaveCSS('background-color', 'rgb(238, 244, 255)');
    await expect(page.locator('.pilot-page .audit-placeholder')).toHaveCount(0);
    await expect(page.locator('.pilot-page .audit-receive__media')).toHaveAttribute('src', '/pilot-months.webp');
    await expect(page.locator('.pilot-measurement__media')).toHaveAttribute('src', '/pilt-agree.webp');
    await expect(page.locator('.pilot-page .audit-hero__media')).toHaveAttribute('src', '/pilot-hero.webp');
    await expect(page.locator('.pilot-price')).toHaveText('€1,500/month');
    await expect(page.locator('.pilot-terms')).toHaveText('Three months · €4,500 total');
    const booking = page.locator('main').getByRole('link', { name: 'Book a Discovery Call', exact: true });
    await expect(booking).toHaveCount(2);
    for (const link of await booking.all()) await expect(link).toHaveAttribute('href', 'https://calendly.com/alex-ixaria/ixaria-strategy-session');
    expect(await page.locator('.pilot-page h1, .pilot-page h2, .pilot-page h3, .pilot-page p, .pilot-page figure, .pilot-page li, .pilot-page a').evaluateAll(els => els.filter(el => {
      const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 1);
    }).map(el => el.textContent))).toEqual([]);
    if (width <= 768) {
      for (const selector of ['.pilot-page .audit-grid', '.pilot-steps']) {
        for (const container of await page.locator(selector).all()) {
          const boxes = await container.locator(':scope > *').evaluateAll(els => els.map(el => {
            const rect = el.getBoundingClientRect(); return { top: rect.top, bottom: rect.bottom };
          }));
          for (let i = 1; i < boxes.length; i++) expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].bottom);
        }
      }
      const buttonWidth = await booking.first().evaluate(el => el.getBoundingClientRect().width);
      expect(buttonWidth).toBe(width - 40);
    }
    await page.getByRole('link', { name: 'Next: explore full implementation →', exact: true }).click();
    await expect(page).toHaveURL(/full-implementation.html$/);
  });
}

for (const width of [1440, 820, 390, 320]) {
  test(`audit layout and interactions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/audit.html');
    await expect(page.locator('h1')).toHaveText("Find out what why your visitors don't buy?");
    const booking = page.locator('.audit-page').getByRole('link', { name: 'Book a discovery call', exact: true });
    await expect(booking).toHaveCount(2);
    await expect(page.locator('.audit-page .cta-strip')).toHaveCount(0);
    for (const link of await booking.all()) await expect(link).toHaveAttribute('href', 'https://calendly.com/alex-ixaria/ixaria-strategy-session');
    await expect(page.locator('.audit-placeholder')).toHaveCount(0);
    await expect(page.locator('.audit-approach__media')).toHaveAttribute('src', '/audit-right-info2.webp');
    await expect(page.locator('.audit-receive__media')).toHaveAttribute('src', '/audit-results.webp');
    await expect(page.locator('.audit-hero img')).toHaveAttribute('src', '/hero-audit.webp');
    await expect(page.locator('.audit-team img')).toHaveCount(3);
    await expect(page.locator('.audit-team h3')).toHaveText(['Alex Mesesan', 'Ovidiu Stegari', 'Eduard Badea']);
    await expect(page.locator('.audit-process > li')).toHaveCount(4);
    await expect(page.locator('.audit-faq, .audit-guarantee, .audit-companies, .audit-modal')).toHaveCount(0);
    await expect(page.locator('.audit-price strong')).toHaveText('€1,500');
    await expect(page.locator('.audit-final__details, .audit-final__steps')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Join the newsletter' })).toBeVisible();
    expect(await page.locator('h1 span').evaluate(el => getComputedStyle(el).color)).toBe('rgb(0, 0, 255)');
    expect(await page.locator('h1').evaluate(el => getComputedStyle(el).fontFamily)).toContain('Gilroy');
    expect(await page.locator('.audit-lead').first().evaluate(el => getComputedStyle(el).fontFamily)).toContain('Inter');
    expect(await page.locator('.audit-receive').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(9, 9, 89)');
    expect(await page.locator('.audit-page h1, .audit-page h2, .audit-page h3, .audit-page p, .audit-page figure, .audit-page li, .audit-page input, .audit-page button').evaluateAll(els => els.filter(el => {
      const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
    }).map(el => el.textContent))).toEqual([]);
    if (width <= 768) {
      for (const selector of ['.audit-grid', '.audit-process', '.audit-flow', '.audit-team']) {
        const boxes = await page.locator(selector).first().locator(':scope > *').evaluateAll(els => els.map(el => {
          const rect = el.getBoundingClientRect(); return { top: rect.top, bottom: rect.bottom };
        }));
        for (let i = 1; i < boxes.length; i++) expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].bottom);
      }
    }
    await page.getByRole('link', { name: 'Next: explore the pilot →', exact: true }).click();
    await expect(page).toHaveURL(/pilot.html$/);
  });
}

test('FAQ opens, closes, and only expands one answer', async ({ page }) => {
  await page.goto('/');
  await page.locator('#faq-1').click();
  await expect(page.locator('#faq-1')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq-answer-1')).toBeVisible();
  await page.locator('#faq-2').click();
  await expect(page.locator('#faq-answer-1')).toBeHidden();
  await expect(page.locator('#faq-1')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#faq-answer-2')).toBeVisible();
  await page.locator('#faq-2').click();
  await expect(page.locator('#faq-answer-2')).toBeHidden();
});

for (const width of [1280, 769, 390, 320]) {
  test(`Process dropdown supports clicking, keyboard, and page links at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/terms.html');
    const mobile = width <= 768;
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    if (mobile) await menu.click();
    const process = page.locator('.navbar__process');
    const trigger = process.locator('summary');
    await trigger.click();
    await expect(process).toHaveAttribute('open', '');
    await expect(process.locator('a')).toHaveText(['Audit', 'Pilot', 'Full Implementation']);
    await trigger.click();
    await expect(process).not.toHaveAttribute('open', '');
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(process).toHaveAttribute('open', '');
    await page.keyboard.press('Tab');
    await expect(process.getByRole('link', { name: 'Audit', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(process).not.toHaveAttribute('open', '');
    await expect(trigger).toBeFocused();
    if (mobile) await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await trigger.click();
    await page.locator('main').click({ position: { x: 10, y: 600 } });
    await expect(process).not.toHaveAttribute('open', '');
    for (const [label, path] of [['Audit', '/audit.html'], ['Pilot', '/pilot.html'], ['Full Implementation', '/full-implementation.html']]) {
      await page.goto('/terms.html');
      if (mobile) await menu.click();
      await trigger.click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await process.getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(path.replace('.', '\\.')));
      await expect(process).not.toHaveAttribute('open', '');
      if (mobile) await expect(menu).toHaveAttribute('aria-expanded', 'false');
    }
  });
}

test('Process links work without JavaScript on mobile', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const page = await context.newPage();
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.fulfill({ status: 200, body: '' }));
  await page.goto('http://127.0.0.1:4330/terms.html');
  const process = page.locator('.navbar__process');
  await process.locator('summary').click();
  await expect(process.getByRole('link', { name: 'Audit', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await process.getByRole('link', { name: 'Audit', exact: true }).click();
  await expect(page).toHaveURL(/audit.html$/);
  await context.close();
});

test('mobile navigation works on home and nested pages without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/cofounder.html', '/cookie-policy.html']) {
    await page.goto(route);
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#primary-navigation')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#primary-navigation')).toBeHidden();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  await page.goto('/terms.html');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page
    .locator('#primary-navigation')
    .getByRole('link', { name: 'Features', exact: true })
    .click();
  await expect(page).toHaveURL(/\/#features$/);
  await expect(page.locator('#primary-navigation')).toBeHidden();
});

for (const route of ['/', '/audit.html']) {
test(`newsletter validates, submits the existing fields, and recovers from failure on ${route}`, async ({
  page,
}) => {
  await page.goto(route);
  await page.locator('#EMAIL').fill('invalid');
  await page.locator('#sib-form button').click();
  expect(
    await page.locator('#EMAIL').evaluate((input: HTMLInputElement) => input.checkValidity()),
  ).toBe(false);
  await page.evaluate(() => {
    const original = window.fetch;
    window.fetch = async (url, options) => {
      if (String(url).includes('sibforms.com')) {
        (window as unknown as { submitted: Record<string, unknown> }).submitted = {
          url: String(url),
          method: options?.method,
          fields: Object.fromEntries((options?.body as FormData).entries()),
        };
        return new Response('');
      }
      return original(url, options);
    };
  });
  await page.locator('#EMAIL').fill('migration@example.com');
  await page.locator('#sib-form button').click();
  await expect(page.locator('#email-msg-success')).toContainText('request was sent');
  expect(
    await page.evaluate(
      () => (window as unknown as { submitted: { fields: unknown } }).submitted.fields,
    ),
  ).toEqual({ EMAIL: 'migration@example.com', email_address_check: '', locale: 'en' });
  await expect(page.locator('#EMAIL')).toHaveValue('');
  await page.evaluate(() => {
    window.fetch = async () => {
      throw new Error('Offline');
    };
  });
  await page.locator('#EMAIL').fill('migration@example.com');
  await page.locator('#sib-form button').click();
  await expect(page.locator('#email-msg-error')).toContainText('Please try again');
  await expect(page.locator('#sib-form button')).toBeEnabled();
});

}

test('slideshow advances and reduced motion keeps content visible', async ({ page }) => {
  await page.goto('/');
  const active = await page.locator('#ixaria-way-slideshow img.is-active').getAttribute('src');
  await expect
    .poll(() => page.locator('#ixaria-way-slideshow img.is-active').getAttribute('src'), {
      timeout: 5000,
    })
    .not.toBe(active);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const reducedActive = await page
    .locator('#ixaria-way-slideshow img.is-active')
    .getAttribute('src');
  await page.waitForTimeout(2200);
  expect(await page.locator('#ixaria-way-slideshow img.is-active').getAttribute('src')).toBe(
    reducedActive,
  );
  for (const selector of ['.feature-card', '.process-card', '.cta-strip__inner'])
    expect(
      await page
        .locator(selector)
        .first()
        .evaluate((element) => getComputedStyle(element).opacity),
    ).toBe('1');
});

test('existing analytics ID and event names are retained', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    Object.assign(window, { sp: { checkConsent: () => true } });
    window.dispatchEvent(new Event('sp_init'));
  });
  await page.locator('.hero__ctas .btn-secondary').click();
  const events = await page.evaluate(() =>
    Array.from((window as unknown as { dataLayer: IArguments[] }).dataLayer).map((entry) =>
      Array.from(entry),
    ),
  );
  expect(events.some((event) => event[0] === 'config' && event[1] === 'G-70N9EB47DK')).toBe(true);
  expect(events.some((event) => event[0] === 'event' && event[1] === 'see_how_it_works')).toBe(
    true,
  );
});

test('analytics waits for consent across marketing pages and honours revocation', async ({ page }) => {
  for (const route of ['/', '/audit.html', '/pilot.html', '/full-implementation.html', '/cofounder.html']) {
    await page.goto(route);
    await expect(page.locator('[data-ixaria-analytics]')).toHaveCount(0);
    expect(await page.evaluate(() => (window as unknown as Record<string, unknown>)['ga-disable-G-70N9EB47DK'])).toBe(true);
    await page.evaluate(() => {
      Object.assign(window, { sp: { checkConsent: () => true } });
      window.dispatchEvent(new Event('sp_init'));
    });
    await expect(page.locator('[data-ixaria-analytics]')).toHaveCount(1);
    await page.evaluate(() => {
      const link = [...document.querySelectorAll('a')].find(el => el.href.includes('calendly.com'))!;
      link.addEventListener('click', event => event.preventDefault());
      link.click();
    });
    const events = await page.evaluate(() => Array.from((window as unknown as { dataLayer: IArguments[] }).dataLayer).map(entry => Array.from(entry)));
    expect(events.some(event => event[0] === 'event' && ['book_call', 'book_discovery_call'].includes(String(event[1])) && (event[2] as Record<string,string>).page_path === route)).toBe(true);
    await page.evaluate(() => {
      Object.assign(window, { sp: { checkConsent: () => false } });
      window.dispatchEvent(new Event('sp_cookie_banner_save'));
    });
    expect(await page.evaluate(() => (window as unknown as Record<string, unknown>)['ga-disable-G-70N9EB47DK'])).toBe(true);
  }
});

test('narrow mobile pages keep visible content inside the viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/audit.html', '/pilot.html', '/full-implementation.html']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator('main h1, main h2, main h3, main p, main a, main img').evaluateAll(elements => elements.filter(el => {
        const r = el.getBoundingClientRect();
        // Carousels and cropped detail images intentionally extend inside clip areas.
        let left = r.left;
        let right = r.right;
        for (let parent = el.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
          if (['hidden', 'clip', 'auto', 'scroll'].includes(getComputedStyle(parent).overflowX)) {
            const clip = parent.getBoundingClientRect();
            left = Math.max(left, clip.left);
            right = Math.min(right, clip.right);
          }
        }
        return r.width > 0 && right > left && (left < -1 || right > innerWidth + 1);
      }).map(el => el.textContent?.trim() || el.getAttribute('src')))).toEqual([]);
    }
  }
});

test('demo chat loads on request and safely renders user text', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#chat-overlay')).toBeHidden();
  await page.evaluate(() => document.dispatchEvent(new Event('ixaria:open-chat')));
  await expect(page.locator('#chat-overlay')).toBeVisible();
  await page.locator('#chat-input').fill('<img src=x onerror=alert(1)>');
  await page.locator('#chat-send').click();
  await expect(page.locator('.chat-msg--user .chat-msg__bubble')).toHaveText(
    '<img src=x onerror=alert(1)>',
  );
  await expect(page.locator('.chat-msg--user img')).toHaveCount(0);
  await expect(page.locator('.chat-msg--ai')).toHaveCount(2);
  await page.keyboard.press('Escape');
  await expect(page.locator('#chat-overlay')).toBeHidden();
});

test('static content, navigation, and FAQs are available with JavaScript disabled', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  await page.route('**/*', (route) =>
    new URL(route.request().url()).hostname === '127.0.0.1'
      ? route.continue()
      : route.fulfill({ status: 200, body: '' }),
  );
  await page.goto('http://127.0.0.1:4330/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#faq-answer-1')).toBeVisible();
  for (const selector of ['.feature-card', '.process-card', '.cta-strip__inner'])
    expect(
      await page
        .locator(selector)
        .first()
        .evaluate((element) => getComputedStyle(element).opacity),
    ).toBe('1');
  await page.goto('http://127.0.0.1:4330/cofounder.html');
  await expect(page).toHaveURL(/cofounder.html$/);
  await expect(page.locator('h1')).toContainText('CTO');
  await page.goto('http://127.0.0.1:4330/#how-it-works');
  await page.getByRole('link', { name: 'Explore the Pilot', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Use a smarter shopping experience on your bestsellers.');
  await page.goto('http://127.0.0.1:4330/audit.html');
  await expect(page.locator('h1')).toHaveText("Find out what why your visitors don't buy?");
  await expect(
    page.locator('main').getByRole('link', { name: 'Book a discovery call', exact: true }),
  ).toHaveCount(2);
  await context.close();
});
