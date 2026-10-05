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
  for (const selector of ['.feature-card', '.step', '.value-item', '.cta-strip__inner'])
    expect(
      await page
        .locator(selector)
        .first()
        .evaluate((element) => getComputedStyle(element).opacity),
    ).toBe('1');
});

test('existing analytics ID and event names are retained', async ({ page }) => {
  await page.goto('/');
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
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#faq-answer-1')).toBeVisible();
  for (const selector of ['.feature-card', '.step', '.value-item', '.cta-strip__inner'])
    expect(
      await page
        .locator(selector)
        .first()
        .evaluate((element) => getComputedStyle(element).opacity),
    ).toBe('1');
  await page.getByRole('link', { name: 'Careers', exact: true }).click();
  await expect(page).toHaveURL(/cofounder.html$/);
  await expect(page.locator('h1')).toContainText('CTO');
  await context.close();
});
