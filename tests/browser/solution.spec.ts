import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1'
    ? route.continue() : route.fulfill({ status: 200, body: '' }));
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`slide 7 WebP product views fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const section = page.locator('#solution');
    await expect(section.locator('h2')).toHaveText('Ixaria converts more of your qualified visitors into actual buyers.');
    await expect(section.locator('.solution__subtitle')).toHaveText('by understanding their needs, fears and cultural traits and showing them the right information at the right time.');
    await expect(section.locator('figcaption')).toHaveText(['Standard product view', 'Pet-focused view', 'Kids-focused view']);
    await expect(section.locator('button, [data-solution-demo]')).toHaveCount(0);
    await expect(section.locator('img')).toHaveCount(3);
    await section.locator('img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode(); })));
    const images = await section.locator('img').evaluateAll(images => images.map(image => ({
      src: image.getAttribute('src'), current: image.currentSrc, alt: image.alt,
      ratio: image.getBoundingClientRect().width / image.getBoundingClientRect().height,
      natural: image.naturalWidth, objectFit: getComputedStyle(image).objectFit,
      naturalRatio: image.naturalWidth / image.naturalHeight,
      declaredRatio: Number(image.getAttribute('width')) / Number(image.getAttribute('height')),
    })));
    for (const image of images) {
      expect(image.src).toMatch(/\/design\/solution-(standard|pets|kids)-800\.webp$/);
      expect(image.current).toMatch(/\.webp$/);
      expect(image.alt.length).toBeGreaterThan(30);
      expect(image.natural).toBeGreaterThan(0);
      expect(image.ratio).toBeCloseTo(image.naturalRatio, 2);
      expect(image.declaredRatio).toBeCloseTo(image.naturalRatio, 2);
      expect(image.objectFit).not.toBe('cover');
    }
    const boxes = await section.locator('figure').evaluateAll(elements => elements.map(el => {
      const rect = el.getBoundingClientRect(); return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
    }));
    if (width >= 768) expect(new Set(boxes.map(rect => rect.top)).size).toBe(1);
    else {
      expect(boxes[1].top).toBeGreaterThan(boxes[0].bottom);
      expect(boxes[2].top).toBeGreaterThan(boxes[1].bottom);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await section.screenshot({ path: `.tmp/design-previews/solution-slide7-${width}.png`, style: '.navbar { visibility: hidden !important; }' });
  });
}

for (const width of [1440, 390]) {
  test(`method descriptions remain visible without redundant read-more links at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const steps = page.locator('#method');
    const cards = steps.locator('[data-solution-step]');
    await expect(cards.locator('h3')).toHaveText(['Signals', 'Correlations', 'Responses']);
    await expect(cards.getByRole('link')).toHaveCount(0);
    for (const card of await cards.all()) {
      await expect(card.locator('[data-step-back] p')).toBeVisible();
      expect(await card.locator('.solution-step__inner').evaluate(el => getComputedStyle(el).transform)).toBe('none');
    }
    await steps.screenshot({ path: testInfo.outputPath('visible-method.png'), style: '.navbar { visibility: hidden !important; }' });
  });
}

test('slide 7 images and method descriptions render without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4330/');
    await expect(page.locator('#solution .solution-view')).toHaveCount(3);
    await expect(page.locator('#solution figcaption')).toHaveText(['Standard product view', 'Pet-focused view', 'Kids-focused view']);
    await page.locator('#solution img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode(); })));
    await expect(page.locator('#method .solution-step p')).toHaveCount(3);
    await expect(page.locator('#method .solution-step p').first()).toBeVisible();
  } finally { await context.close(); }
});
