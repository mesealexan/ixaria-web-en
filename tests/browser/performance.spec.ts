import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const phase = process.env.AUDIT_PHASE ?? 'after';
for (const width of [1440, 390]) {
  for (const route of ['/', '/audit.html', '/pilot.html', '/full-implementation.html', '/cofounder.html', '/privacy-policy.html', '/terms.html', '/cookie-policy.html']) {
    test(`performance and SEO ${route} at ${width}px`, async ({ page, context }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.route('**/*', async route => {
        if (new URL(route.request().url()).hostname === '127.0.0.1') await route.continue();
        else await route.fulfill({ status: 200, body: '', contentType: 'application/javascript' });
      });
      await page.addInitScript(() => {
        const metrics = { lcp: 0, cls: 0, longTasks: 0 };
        Object.assign(window, { auditMetrics: metrics });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) metrics.lcp = entry.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) if (!entry.hadRecentInput) metrics.cls += entry.value;
        }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) metrics.longTasks += Math.max(0, entry.duration - 50);
        }).observe({ type: 'longtask', buffered: true });
      });
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      const transferred = new Map<string, { url: string; type: string; bytes: number }>();
      const failures: string[] = [];
      cdp.on('Network.responseReceived', ({ requestId, response, type }) => {
        if (response.url.startsWith('http://127.0.0.1')) {
          transferred.set(requestId, { url: new URL(response.url).pathname, type, bytes: 0 });
          if (response.status >= 400) failures.push(response.url);
        }
      });
      cdp.on('Network.loadingFinished', ({ requestId, encodedDataLength }) => {
        const resource = transferred.get(requestId);
        if (resource) resource.bytes = encodedDataLength;
      });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      const initial = await page.evaluate(() => ({
        metrics: (window as unknown as { auditMetrics: { lcp: number; cls: number; longTasks: number } }).auditMetrics,
        domNodes: document.querySelectorAll('*').length,
        images: [...document.images].filter(img => {
          const rect = img.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight;
        }).map(img => ({ src: img.getAttribute('src'), currentSrc: new URL(img.currentSrc).pathname, renderedWidth: img.getBoundingClientRect().width, naturalWidth: img.naturalWidth })),
      }));
      const initialResources = structuredClone([...transferred.values()]);
      // Decode all page images, including hidden demonstration states, to check assets.
      await page.evaluate(async () => {
        await Promise.all([...document.images].map(async image => {
          image.loading = 'eager';
          await image.decode().catch(() => {});
        }));
      });
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('title')).toHaveCount(1);
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://ixaria.eu' + route);
      const problems = await page.locator('img').evaluateAll(images => images.flatMap(image => {
        const problems: string[] = [];
        if (!image.hasAttribute('alt')) problems.push('Missing alt: ' + image.src);
        if (!image.width || !image.height) problems.push('Missing dimensions: ' + image.src);
        if (!image.naturalWidth) problems.push('Failed decode: ' + image.src);
        return problems;
      }));
      expect(problems).toEqual([]);
      expect(failures).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const result = { phase, route, width, devicePixelRatio: 1, ...initial, initialResources, initialBytes: initialResources.reduce((total, resource) => total + resource.bytes, 0), allImages: await page.locator('img').evaluateAll(images => images.map(img => ({ src: img.getAttribute('src'), currentSrc: img.currentSrc ? new URL(img.currentSrc).pathname : '', alt: img.alt, width: img.width, height: img.height, naturalWidth: img.naturalWidth, loading: img.loading }))) };
      const directory = path.resolve('.tmp/performance', phase);
      fs.mkdirSync(directory, { recursive: true });
      fs.writeFileSync(path.join(directory, `${route === '/' ? 'index' : route.slice(1, -5)}-${width}.json`), JSON.stringify(result, null, 2));
    });
  }
}
