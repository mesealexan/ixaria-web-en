import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

const html = fs.readFileSync('dist/index.html', 'utf8');
const configured = !/const apiKey = undefined/.test(html) && html.includes('window.posthog.init');

test('PostHog sends page views and clicks immediately without browser storage', async ({ page, context }) => {
  test.skip(!configured, 'Build with PUBLIC_POSTHOG_PROJECT_TOKEN and PUBLIC_POSTHOG_HOST to verify analytics.');
  const events: { event: string; properties: Record<string, unknown> }[] = [];
  const unexpected: string[] = [];
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  // Exercise normal visitor capture; the SDK otherwise filters Playwright as a bot.
  await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (!['eu.i.posthog.com', 'eu-assets.i.posthog.com'].includes(url.hostname)) {
      unexpected.push(url.hostname + url.pathname);
      return route.abort();
    }
    // Exercise the actual installed SDK while keeping tests out of the live project.
    if (url.pathname.endsWith('.js')) {
      const file = path.join('node_modules/posthog-js/dist', path.basename(url.pathname));
      if (fs.existsSync(file)) return route.fulfill({ path: file, contentType: 'application/javascript' });
      if (url.pathname.endsWith('/config.js')) return route.fulfill({ body: '', contentType: 'application/javascript' });
      unexpected.push(url.pathname);
      return route.abort();
    }
    if (url.pathname.includes('/e/') && request.postDataBuffer()) {
      let body = request.postDataBuffer()!;
      if (body[0] === 0x1f && body[1] === 0x8b) body = gunzipSync(body);
      if (url.searchParams.get('compression') === 'base64') {
        body = Buffer.from(new URLSearchParams(body.toString()).get('data')!, 'base64');
      }
      const payload = JSON.parse(body.toString());
      events.push(...(Array.isArray(payload) ? payload : payload.batch ?? [payload]));
    }
    return route.fulfill({ json: url.pathname.includes('/flags')
      ? { featureFlags: {}, supportedCompression: [], autocapture: true }
      : { status: 1 } });
  });

  await page.goto('/');
  await expect.poll(() => events.map(event => event.event)).toContain('$pageview');
  // No consent event or opt-in API is called before the capture assertions.
  await page.locator('.footer__social a').first().evaluate(element => {
    element.addEventListener('click', event => event.preventDefault(), { once: true });
    (element as HTMLAnchorElement).click();
  });
  await expect.poll(() => events.map(event => event.event)).toContain('social_click');
  const state = await page.evaluate(() => {
    const sdk = (window as any).posthog;
    return {
      mode: sdk.config.cookieless_mode,
      profiles: sdk.config.person_profiles,
      recordingDisabled: sdk.config.disable_session_recording,
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
    };
  });
  expect(state).toEqual({ mode: 'always', profiles: 'never', recordingDisabled: true, local: [], session: [] });
  expect(await context.cookies()).toEqual([]);
  expect(events.every(event => event.properties.$process_person_profile === false)).toBe(true);
  expect(errors).toEqual([]);
  expect(unexpected).toEqual([]);
});
