import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Trace snapshots execute in the renderer and distort throttled CPU timings.
test.use({ trace: 'off' });

const budgets: Record<string, number> = {
  '/': 400_000, '/audit.html': 400_000, '/pilot.html': 300_000,
  '/full-implementation.html': 300_000, '/cofounder.html': 420_000,
  '/customer-stories/agache.html': 300_000,
  '/privacy-policy.html': 100_000, '/terms.html': 100_000, '/cookie-policy.html': 100_000,
};

for (const mobile of [false, true]) {
  test.describe(mobile ? 'mobile performance budgets' : 'desktop performance budgets', () => {
    test.use({
      viewport: { width: mobile ? 390 : 1440, height: 900 },
      deviceScaleFactor: mobile ? 3 : 1, isMobile: mobile, hasTouch: mobile,
    });
    for (const [route, byteBudget] of Object.entries(budgets)) {
      test(route, async ({ page, context }) => {
        const external: string[] = [];
        // Fail on unexpected vendors instead of replacing them with successful mocks.
        await page.route('**/*', request => {
          if (new URL(request.request().url()).hostname === '127.0.0.1') return request.continue();
          external.push(request.request().url());
          return request.abort();
        });
        await page.addInitScript(() => {
          const metrics = { lcp: 0, cls: 0, layoutMs: 0, tasks: [] as { start: number; duration: number }[] };
          Object.assign(window, { auditMetrics: metrics });
          let sessionStart = 0, lastShift = 0, sessionValue = 0;
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) metrics.lcp = entry.startTime;
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver(list => {
            for (const entry of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
              if (entry.hadRecentInput) continue;
              if (entry.startTime - lastShift > 1000 || entry.startTime - sessionStart > 5000) {
                sessionStart = entry.startTime; sessionValue = 0;
              }
              sessionValue += entry.value; lastShift = entry.startTime;
              metrics.cls = Math.max(metrics.cls, sessionValue);
            }
          }).observe({ type: 'layout-shift', buffered: true });
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) metrics.tasks.push({ start: entry.startTime, duration: entry.duration });
          }).observe({ type: 'longtask', buffered: true });
          if (PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')) {
            new PerformanceObserver(list => {
              for (const entry of list.getEntries() as (PerformanceEntry & { scripts: { forcedStyleAndLayoutDuration: number }[] })[]) {
                metrics.layoutMs += entry.scripts.reduce((total, script) => total + script.forcedStyleAndLayoutDuration, 0);
              }
            }).observe({ type: 'long-animation-frame', buffered: true });
          }
        });
        const cdp = await context.newCDPSession(page);
        await cdp.send('Network.enable');
        await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
        if (mobile) {
          await cdp.send('Network.emulateNetworkConditions', {
            offline: false, latency: 150, downloadThroughput: 200_000,
            uploadThroughput: 93_750, connectionType: 'cellular4g',
          });
          await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        }
        const resources = new Map<string, { url: string; type: string; bytes: number; status: number }>();
        cdp.on('Network.responseReceived', ({ requestId, response, type }) => {
          resources.set(requestId, { url: response.url, type, bytes: 0, status: response.status });
        });
        cdp.on('Network.loadingFinished', ({ requestId, encodedDataLength }) => {
          const resource = resources.get(requestId);
          if (resource) resource.bytes = encodedDataLength;
        });
        expect((await page.goto(route))?.status()).toBe(200);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(300);
        const metrics = await page.evaluate(() => {
          const raw = (window as unknown as {
            auditMetrics: { lcp: number; cls: number; layoutMs: number; tasks: { start: number; duration: number }[] }
          }).auditMetrics;
          const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime;
          return {
            ...raw, fcp,
            startupBlockingMs: raw.tasks.reduce((total, task) => total + Math.max(0, task.duration - 50), 0),
            // Initial layout before FCP is measured by FCP/LCP, not post-paint blocking.
            postPaintBlockingMs: raw.tasks.reduce((total, task) => total + (fcp === undefined ? 0 :
              Math.max(0, task.start + task.duration - Math.max(task.start + 50, fcp))), 0),
          };
        });
        const initialResources = [...resources.values()].map(resource => ({ ...resource }));
        const initialBytes = initialResources.reduce((sum, resource) => sum + resource.bytes, 0);
        const result = { route, mobile, devicePixelRatio: mobile ? 3 : 1, metrics, initialBytes, initialResources };
        fs.mkdirSync('.tmp/performance/seo-fixed', { recursive: true });
        fs.writeFileSync(path.join('.tmp/performance/seo-fixed', (route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')) + (mobile ? '-mobile' : '-desktop') + '.json'), JSON.stringify(result, null, 2));
        expect(external).toEqual([]);
        expect(initialResources.filter(resource => resource.status >= 400)).toEqual([]);
        expect(initialResources.some(resource => /animation\.mp4|secureprivacy|googletagmanager/.test(resource.url))).toBe(false);
        expect(initialBytes, 'cold-load transfer budget').toBeLessThanOrEqual(byteBudget);
        expect(metrics.lcp, 'an LCP measurement was collected').toBeGreaterThan(0);
        expect(metrics.lcp, 'mobile LCP target under 1.6 Mbps / 4x CPU').toBeLessThanOrEqual(2500);
        expect(metrics.cls, 'layout stability budget').toBeLessThanOrEqual(0.1);
        expect(metrics.fcp, 'an FCP measurement was collected').toBeGreaterThan(0);
        expect(metrics.postPaintBlockingMs, 'post-paint blocking budget (not field INP)').toBeLessThanOrEqual(200);
        expect(metrics.layoutMs, 'forced layout budget').toBeLessThanOrEqual(100);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://ixaria.eu' + route);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.locator('img[src]').evaluateAll(images => Promise.all(images.map(image => {
          image.loading = 'eager'; return image.decode().catch(() => {});
        })));
        expect(await page.locator('img[src]').evaluateAll(images => images.filter(image =>
          !image.hasAttribute('alt') || !image.getAttribute('width') || !image.getAttribute('height') || !image.naturalWidth,
        ).map(image => image.src))).toEqual([]);
      });
    }
  });
}
