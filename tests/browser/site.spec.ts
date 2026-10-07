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
        title === 'Audit' ? 'Find out why interested visitors aren’t becoming customers.' : title,
      );
      await expect(page.getByRole('navigation', { name: 'Implementation stages' })).toHaveCount(0);
      await expect(page.getByRole('navigation', { name: 'On this audit page' })).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      if (title === 'Audit') {
        if (width <= 768) await page.getByRole('button', { name: 'Menu', exact: true }).click();
        await page
          .locator('header')
          .getByRole('link', { name: 'How it works', exact: true })
          .click();
      } else await page.getByRole('link', { name: 'Back to how it works', exact: false }).click();
      await expect(page).toHaveURL(/\/#how-it-works$/);
    }
  });
}

for (const width of [1440, 820, 390]) {
  test(`audit layout and interactions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/audit.html');
    await expect(page.locator('h1')).toHaveText('Find out why interested visitors aren’t becoming customers.');
    const booking = page.locator('.audit-page').getByRole('link', { name: 'Book a free discovery call', exact: true });
    await expect(booking).toHaveCount(2);
    for (const link of await booking.all()) await expect(link).toHaveAttribute('href', 'https://calendly.com/alex-ixaria/ixaria-strategy-session');
    await expect(page.getByRole('link', { name: 'View an example audit' })).toHaveCount(0);
    await expect(page.locator('[data-preview], .audit-modal')).toHaveCount(0);
    const first = page.locator('.audit-faq summary').first();
    await first.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.audit-faq details').first()).toHaveAttribute('open', '');
    await expect(page.locator('.audit-faq details p').first()).toBeVisible();
    await page.keyboard.press('Space');
    await expect(page.locator('.audit-faq details p').first()).not.toBeVisible();
    const confidentiality = page.locator('.audit-faq details').filter({
      has: page.locator('summary', { hasText: 'Will our business information stay confidential?' }),
    });
    await confidentiality.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(confidentiality).toHaveAttribute('open', '');
    await expect(confidentiality.locator('p')).toHaveCount(2);
    await expect(confidentiality.locator('p').last()).toHaveText('These commitments are covered by a confidentiality agreement signed before you share any information.');
    await page.keyboard.press('Space');
    await expect(confidentiality.locator('p').last()).not.toBeVisible();
    await expect(page.locator('.audit-guarantee')).toBeVisible();
    await expect(page.locator('.audit-final .audit-price strong')).toHaveText('€1,500');
    await expect(page.locator('.audit-final .audit-price span')).toHaveText('One-time payment');
    await expect(page.locator('.audit-final .audit-price-guarantee')).toHaveText('7-day money-back guarantee');
    expect(await page.locator('.audit-page h1, .audit-page h2, .audit-page h3, .audit-page p, .audit-page img, .audit-page li').evaluateAll(els => els.filter(el => {
      const r=el.getBoundingClientRect();return r.width>0 && (r.left < -1 || r.right > innerWidth+1);
    }).map(el => el.textContent))).toEqual([]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
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

test('newsletter validates, submits the existing fields, and recovers from failure', async ({
  page,
}) => {
  await page.goto('/');
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
  for (const selector of ['.feature-card', '.process-card', '.value-item', '.cta-strip__inner'])
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
        return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
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
  for (const selector of ['.feature-card', '.process-card', '.value-item', '.cta-strip__inner'])
    expect(
      await page
        .locator(selector)
        .first()
        .evaluate((element) => getComputedStyle(element).opacity),
    ).toBe('1');
  await page.getByRole('link', { name: 'Careers', exact: true }).click();
  await expect(page).toHaveURL(/cofounder.html$/);
  await expect(page.locator('h1')).toContainText('CTO');
  await page.goto('http://127.0.0.1:4330/#how-it-works');
  await page.getByRole('link', { name: 'Explore the Pilot', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Pilot');
  await page.goto('http://127.0.0.1:4330/audit.html');
  await expect(page.locator('h1')).toHaveText('Find out why interested visitors aren’t becoming customers.');
  for (const summary of await page.locator('.audit-faq summary').all()) { await summary.click(); }
  await expect(
    page.locator('main').getByRole('link', { name: 'Book a free discovery call', exact: true }),
  ).toHaveCount(2);
  await context.close();
});
