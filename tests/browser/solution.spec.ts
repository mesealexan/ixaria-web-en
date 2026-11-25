import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1'
    ? route.continue() : route.fulfill({ status: 200, body: '' }));
});

const captions = ['Shopper needs', 'Recommended products', 'Sofa comparison', 'Personalised product view'];

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`four WebP solution views fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const section = page.locator('#solution');
    await expect(section.locator('h2')).toHaveText('Ixaria converts more of your qualified visitors into actual buyers.');
    await expect(section.locator('.solution__subtitle')).toHaveText('by understanding their needs, fears and cultural traits and showing them the right information at the right time.');
    await expect(section.locator('figcaption')).toHaveText(captions);
    await expect(section.locator('button, [data-solution-demo]')).toHaveCount(0);
    await expect(section.locator('img')).toHaveCount(4);
    await section.locator('img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode(); })));
    const images = await section.locator('img').evaluateAll(images => images.map(image => ({
      src: image.getAttribute('src'), current: image.currentSrc, alt: image.alt,
      ratio: image.getBoundingClientRect().width / image.getBoundingClientRect().height,
      natural: image.naturalWidth, objectFit: getComputedStyle(image).objectFit,
      naturalRatio: image.naturalWidth / image.naturalHeight,
      declaredRatio: Number(image.getAttribute('width')) / Number(image.getAttribute('height')),
    })));
    for (const [index, image] of images.entries()) {
      expect(image.src).toBe(`/design/B00${index + 1}.webp`);
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
    if (width >= 1024) expect(new Set(boxes.map(rect => rect.top)).size).toBe(1);
    else {
      expect(boxes[0].top).toBe(boxes[1].top);
      expect(boxes[2].top).toBe(boxes[3].top);
      expect(boxes[2].top).toBeGreaterThan(boxes[0].bottom);
      expect(boxes[1].left).toBeGreaterThan(boxes[0].right);
      expect(boxes[3].left).toBeGreaterThan(boxes[2].right);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await section.screenshot({ path: `.tmp/design-previews/solution-four-views-${width}.png`, style: '.navbar { visibility: hidden !important; }' });
  });
}

for (const width of [390, 1440]) {
  test(`solution images open full size and close on a second click at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const links = page.locator('.solution-view__expand');
    const dialog = page.getByRole('dialog', { name: 'Full-size solution image' });
    for (let index = 0; index < 4; index++) {
      const link = links.nth(index);
      await link.click();
      await expect(dialog).toBeVisible();
      const image = dialog.locator('img');
      await expect(image).toHaveAttribute('src', new RegExp(`/design/B00${index + 1}\\.webp$`));
      await image.evaluate(image => image.decode());
      const detail = await image.boundingBox();
      expect(detail!.width).toBeGreaterThan((await link.boundingBox())!.width);
      expect(detail!.height).toBeLessThanOrEqual(900);
      await expect(page.locator('html')).toHaveCSS('overflow', 'hidden');
      if (index === 0) await page.screenshot({ path: `.tmp/design-previews/solution-full-view-${width}.png` });
      await image.click();
      await expect(dialog).not.toBeVisible();
      await expect(link).toBeFocused();
      await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
    }
    await links.first().focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(links.first()).toBeFocused();
    await links.first().click();
    await dialog.click({ position: { x: 4, y: 4 } });
    await expect(dialog).not.toBeVisible();
  });
}

test.describe('touch image viewer', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test('tap an image to enlarge it and tap it again to close', async ({ page }) => {
    await page.goto('/');
    await page.locator('.solution-view__expand').last().tap();
    const dialog = page.getByRole('dialog', { name: 'Full-size solution image' });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('img')).toHaveAttribute('src', /\/design\/B004\.webp$/);
    await dialog.locator('img').tap();
    await expect(dialog).not.toBeVisible();
  });
});

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

test('four solution images and method descriptions render without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4330/');
    await expect(page.locator('#solution .solution-view')).toHaveCount(4);
    await expect(page.locator('#solution figcaption')).toHaveText(captions);
    await page.locator('#solution img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode(); })));
    await expect(page.locator('#method .solution-step p')).toHaveCount(3);
    await expect(page.locator('#method .solution-step p').first()).toBeVisible();
  } finally { await context.close(); }
});
