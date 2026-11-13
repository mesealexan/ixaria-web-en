import { test, expect } from '@playwright/test';

const routes = ['/', '/audit.html', '/pilot.html', '/full-implementation.html', '/customer-stories/agache.html', '/cofounder.html', '/privacy-policy.html', '/terms.html', '/cookie-policy.html'];

for (const width of [320, 390, 768, 899, 1024, 1440]) {
  test(`Agache slide 10 phones stay aligned and uncropped at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator('.customer-story-teaser');
    const images = section.locator('.customer-story-teaser__phones img');
    await expect(images).toHaveCount(2);
    await images.evaluateAll(items => Promise.all(items.map(image => {
      image.loading = 'eager'; return image.decode();
    })));
    await section.scrollIntoViewIfNeeded();
    const phones = await images.evaluateAll(items => Promise.all(items.map(async image => {
      // srcset density correction rounds naturalWidth/naturalHeight; decode the
      // chosen file directly to compare against its real, unrounded aspect ratio.
      const decoded = new Image();
      decoded.src = image.currentSrc;
      await decoded.decode();
      const box = image.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom,
        width: box.width, height: box.height, naturalRatio: decoded.naturalWidth / decoded.naturalHeight,
        src: image.currentSrc, alt: image.alt, fit: getComputedStyle(image).objectFit };
    })));
    expect(Math.abs(phones[0].top - phones[1].top)).toBeLessThan(1);
    expect(Math.abs(phones[0].bottom - phones[1].bottom)).toBeLessThan(1);
    expect(phones[1].left).toBeGreaterThan(phones[0].right);
    for (const phone of phones) {
      expect(phone.left).toBeGreaterThanOrEqual(0);
      expect(phone.right).toBeLessThanOrEqual(width);
      expect(phone.width / phone.height).toBeCloseTo(phone.naturalRatio, 3);
      expect(phone.src).toMatch(/agache-mobile-sofa-(listing|comparison)-\d+\.webp$/);
      expect(phone.alt.length).toBeGreaterThan(30);
      expect(phone.fit).toBe('contain');
    }
    if ([390, 1440].includes(width)) {
      await section.screenshot({ path: `.tmp/design-previews/agache-slide10-${width}.png` });
    }
  });
}

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1'
    ? route.continue() : route.fulfill({ status: 200, body: '' }));
});

for (const width of [320, 390, 768, 1024, 1280, 1366, 1440, 1920]) {
  test(`shared design stays readable across all routes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1280 ? 720 : width === 1366 ? 768 : 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of routes) {
      const errors: string[] = [];
      const captureError = (error: Error) => errors.push(error.message);
      page.on('pageerror', captureError);
      expect((await page.goto(route))?.status(), route).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCSS('font-family', 'Inter, sans-serif');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
      const overflow = await page.locator('main h1, main h2, main h3, main p, main a, main img').evaluateAll(elements => elements.filter(el => {
        const rect = el.getBoundingClientRect();
        let left = rect.left, right = rect.right;
        for (let parent = el.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
          if (['hidden', 'clip', 'auto', 'scroll'].includes(getComputedStyle(parent).overflowX)) {
            const bounds = parent.getBoundingClientRect(); left = Math.max(left, bounds.left); right = Math.min(right, bounds.right);
          }
        }
        return rect.width > 0 && right > left && (left < -1 || right > innerWidth + 1);
      }).map(el => el.textContent?.trim().slice(0,100) || el.getAttribute('src')));
      expect(overflow, route).toEqual([]);
      expect(errors, route).toEqual([]);
      if (await page.locator('.audit-final').count()) {
        const overlap = await page.locator('.audit-final').evaluate(section => {
          const button = section.querySelector('.btn')!.getBoundingClientRect();
          const image = section.querySelector('.service-closing__sofa')!.getBoundingClientRect();
          return button.left < image.right && button.right > image.left && button.top < image.bottom && button.bottom > image.top;
        });
        expect(overlap, `${route}: closing action must not overlap artwork`).toBe(false);
      }
      if (route.includes('policy') || route === '/terms.html') {
        await expect(page.locator('.talk-btn')).toHaveCSS('position', 'static');
      }
      if ([390, 1440].includes(width)) {
        const name = route === '/' ? 'home' : route.replaceAll('/', '-').replace('.html','');
        await page.screenshot({ path: `.tmp/design-previews/${name}-${width}.png` });
        if (await page.locator('.audit-final').count()) {
          await page.locator('.audit-final').scrollIntoViewIfNeeded();
          await page.locator('.audit-final img').evaluateAll(images => Promise.all(images.map(img => { img.loading='eager'; return img.decode(); })));
          await page.locator('.audit-final').screenshot({ path: `.tmp/design-previews/${name}-closing-${width}.png` });
        }
        if (route === '/') {
          for (const selector of ['#visitor-conversion', '#solution', '.customer-story-teaser', '#method', '#how-it-works', '#features', '#about']) {
            const section = page.locator(selector);
            await section.scrollIntoViewIfNeeded();
            await section.locator('img').evaluateAll(images => Promise.all(images.map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); })));
            await section.screenshot({ path: `.tmp/design-previews/home-${selector.replaceAll(/[.#]/g,'')}-${width}.png` });
          }
        }
      }
      page.off('pageerror', captureError);
    }
  });
}

for (const width of [390, 1440]) {
  test(`audit newsletter text contrasts with its light background at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/audit.html');
    const newsletter = page.locator('#newsletter');
    await expect(newsletter).toHaveCSS('background-color', 'rgb(245, 246, 250)');
    await expect(newsletter.locator('h2')).toHaveCSS('color', 'rgb(9, 9, 89)');
    await expect(newsletter.locator('.section-sub')).toHaveCSS('color', 'rgb(85, 85, 112)');
    await expect(newsletter.locator('.email-msg')).toHaveCount(2);
    for (const message of await newsletter.locator('.email-msg').all()) {
      await expect(message).toHaveCSS('color', 'rgb(9, 9, 89)');
    }
    await newsletter.locator('input[type="email"]').focus();
    await expect(newsletter.locator('input[type="email"]')).toHaveCSS('outline-color', 'rgb(0, 0, 255)');
    await newsletter.screenshot({ path: `.tmp/design-previews/audit-newsletter-${width}.png` });
  });
}

test('static product views, visible method, and two hero actions', async ({ page }) => {
  await page.goto('/');
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const actions = page.locator('.hero__ctas');
    await expect(actions.getByRole('link')).toHaveCount(2);
    await expect(actions.getByRole('button')).toHaveCount(0);
    await expect(actions.getByRole('link', { name: 'Book a discovery call' })).toBeVisible();
    await expect(actions.getByRole('link', { name: 'See how it works' })).toBeVisible();
    await page.locator('#hero').screenshot({ path: `.tmp/design-previews/hero-two-actions-${width}.png` });
  }
  await expect(page.locator('#solution .solution-view')).toHaveCount(3);
  await expect(page.locator('#solution button')).toHaveCount(0);
  await expect(page.locator('#method .solution-step p')).toHaveCount(3);
  for (const paragraph of await page.locator('#method .solution-step p').all()) await expect(paragraph).toBeVisible();
});
