import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1'
    ? route.continue()
    : route.fulfill({ status: 200, body: '' }));
});

for (const width of [1440, 390, 320]) {
  test(`solution section fits the page at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator('#solution');
    await expect(section.locator('h2')).toHaveText('Ixaria converts more of your qualified visitors into actual buyers.');
    expect(await section.evaluate(el => {
      let previous = el.previousElementSibling;
      while (previous && !previous.matches('section')) previous = previous.previousElementSibling;
      return previous?.id;
    })).toBe('visitor-conversion');
    expect(await section.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(255, 255, 255)');
    await expect(section.locator('.solution-step h3')).toHaveText(['Signals', 'Correlations', 'Responses']);
    const positions = await section.locator('.solution-step').evaluateAll(cards => cards.map(el => {
      const rect = el.getBoundingClientRect();
      return { top: rect.top, left: rect.left, right: rect.right };
    }));
    if (width > 768) expect(new Set(positions.map(rect => rect.top)).size).toBe(1);
    else expect(positions[1].top).toBeGreaterThan(positions[0].top);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await section.locator('.solution-demo').scrollIntoViewIfNeeded();
    await expect(section.locator('[data-solution-slide]:visible .solution-demo__photo img')).toBeVisible();
    expect(await section.locator('[data-solution-slide]:visible .solution-demo__photo img').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const layout = await section.locator('[data-solution-slide]:visible').evaluate(el => {
      const image = el.querySelector('.solution-demo__visual')!.getBoundingClientRect();
      const details = el.querySelector('.solution-demo__content')!.getBoundingClientRect();
      const cart = el.querySelector('.solution-demo__action')!.getBoundingClientRect();
      return { imageRight: image.right, imageBottom: image.bottom, detailsLeft: details.left, detailsTop: details.top, detailsWidth: details.width, cartWidth: cart.width };
    });
    if (width > 768) expect(layout.detailsLeft).toBeGreaterThan(layout.imageRight);
    else {
      expect(layout.detailsTop).toBeGreaterThan(layout.imageBottom);
      expect(layout.cartWidth).toBeCloseTo(layout.detailsWidth, 0);
    }
    const imageSources = await section.locator('[data-solution-slide] .solution-demo__photo img').evaluateAll(images => images.map(img => img.getAttribute('src')));
    expect(new Set(imageSources).size).toBe(1);
    await section.screenshot({ path: testInfo.outputPath('solution.png'), style: '.navbar { visibility: hidden !important; }' });
    const questions = ['What happens if I want to return it?', 'Will the color match my room?', 'Will it withstand my children and pets?', 'Is it worth the price?', 'Can I see it before I buy it?'];
    const heights = [];
    const productHeights = [];
    for (let index = 0; index < 5; index++) {
      await section.locator(`[data-solution-select="${index}"]`).click();
      const active = section.locator('[data-solution-slide]:visible');
      await expect(active.locator('h3')).toHaveText('Valencia Sofa');
      await expect(active.locator('.solution-demo__price')).toHaveText('€2,350');
      await expect(active.locator('.solution-demo__reviews')).toHaveText('4.9 out of 128 reviews');
      await expect(active.locator('.solution-demo__description')).toHaveText('2-seater couch with storage and sleeping option');
      await expect(active.locator('.solution-demo__returns')).toHaveCount(index === 0 ? 1 : 0);
      await expect(active.locator('.solution-demo__materials')).toHaveCount(index === 2 ? 1 : 0);
      await expect(active.locator('.solution-demo__price-benefits')).toHaveCount(index === 3 ? 1 : 0);
      await expect(active.locator('[data-showroom-booking]')).toHaveCount(index === 4 ? 1 : 0);
      if (index === 4) {
        await expect(active.getByRole('img', { name: 'Map preview with the nearest showroom marked' })).toBeVisible();
        const calendar = active.getByRole('group', { name: 'Choose a showroom visit date' });
        const picker = active.getByRole('button', { name: 'Choose a showroom visit date', exact: true });
        await expect(calendar).toBeHidden();
        await expect(picker).toBeVisible();
        await expect(active.locator('[data-showroom-days] button')).not.toHaveCount(0);
        await expect(active.getByRole('button', { name: 'Book a showroom visit to your nearest center', exact: true })).toBeVisible();
        const compactHeight = await active.locator('[data-showroom-booking]').evaluate(el => el.getBoundingClientRect().height);
        expect(compactHeight).toBeLessThan(180);
        await section.screenshot({ path: testInfo.outputPath('solution-showroom.png'), style: '.navbar { visibility: hidden !important; } .solution-demo__page { animation: none !important; }' });
        await picker.click();
        await expect(calendar).toBeVisible();
        expect(await active.locator('[data-showroom-booking]').evaluate(el => el.getBoundingClientRect().height)).toBeCloseTo(compactHeight, 0);
        await section.screenshot({ path: testInfo.outputPath('solution-showroom-calendar.png'), style: '.navbar { visibility: hidden !important; } .solution-demo__page { animation: none !important; }' });
        await page.keyboard.press('Escape');
      }
      if (index === 3) {
        await expect(active.locator('.solution-demo__price-benefits p')).toHaveText(['5 year guarantee', 'High Quality HR Foam', 'Heavy Duty Box Springs']);
        await expect(active.locator('.solution-demo__price-benefits svg')).toHaveCount(3);
        await section.screenshot({ path: testInfo.outputPath('solution-price.png'), style: '.navbar { visibility: hidden !important; }' });
      }
      if (index === 2) {
        await expect(active.locator('.solution-demo__materials p')).toHaveText(['Easy clean material', 'Water resistant', /Can be washed at 30 degrees/]);
        await expect(active.locator('.solution-demo__materials svg')).toHaveCount(3);
        await section.screenshot({ path: testInfo.outputPath('solution-material.png'), style: '.navbar { visibility: hidden !important; }' });
      }
      await expect(active.locator('.solution-demo__colors')).toHaveCount(1);
      await expect(active.locator('[data-solution-color]')).toHaveCount(8);
      await expect(active.locator('[data-solution-thumbnail]')).toHaveCount(4);
      await expect(active.locator('.solution-demo__samples')).toHaveCount(index === 1 ? 1 : 0);
      if (index === 1) {
        await expect(active.locator('[data-solution-color]')).toHaveCount(8);
        await expect(active.getByRole('button', { name: 'Unsure about the color? Order free samples.', exact: true })).toBeVisible();
        await active.getByRole('button', { name: 'Show Navy sofa', exact: true }).click();
        await expect(active.locator('.solution-demo__photo img')).toHaveAttribute('alt', 'Valencia Sofa in navy upholstery');
        await section.screenshot({ path: testInfo.outputPath('solution-color.png'), style: '.navbar { visibility: hidden !important; }' });
      }
      await expect(active.getByText('Made in Europe', { exact: true })).toHaveCount(0);
      await expect(active.getByText('Medium-soft firmness', { exact: true })).toHaveCount(0);
      await expect(active.getByRole('button', { name: 'Add to cart', exact: true })).toBeVisible();
      await expect(active.locator('.solution-demo__question')).toHaveText(questions[index]);
      const order = await active.evaluate(el => {
        const controls = el.closest('[data-solution-demo]')!.querySelector('.solution-demo__controls')!.getBoundingClientRect();
        const question = el.querySelector('.solution-demo__question')!.getBoundingClientRect();
        const divider = el.querySelector('hr')!.getBoundingClientRect();
        const product = el.querySelector('.solution-demo__page')!.getBoundingClientRect();
        return controls.bottom <= question.top && question.bottom <= divider.top && divider.bottom <= product.top + 1;
      });
      expect(order).toBe(true);
      heights.push(await section.locator('.solution-demo__stage').evaluate(el => el.getBoundingClientRect().height));
      productHeights.push(await active.locator('.solution-demo__page').evaluate(el => el.getBoundingClientRect().height));
      if (width <= 768) {
        const activeHeight = await active.evaluate(el => el.getBoundingClientRect().height);
        expect(heights.at(-1)).toBeCloseTo(activeHeight, 0);
        const bottomSpace = await active.locator('.solution-demo__page').evaluate(el => el.getBoundingClientRect().bottom - el.querySelector('.solution-demo__action')!.getBoundingClientRect().bottom);
        expect(bottomSpace).toBeCloseTo(16, 0);
      }
    }
    const heightDifference = Math.max(...heights) - Math.min(...heights);
    if (width > 768) {
      expect(heightDifference, `scenario heights: ${heights}`).toBeLessThan(2);
      expect(Math.max(...productHeights) - Math.min(...productHeights), `product heights: ${productHeights}`).toBeLessThan(2);
    }
    else expect(heightDifference, `scenario heights: ${heights}`).toBeGreaterThan(50);
  });
}

for (const width of [1440, 390]) {
  test.describe(`flip cards at ${width}px`, () => {
    test.use({ viewport: { width, height: 1000 }, hasTouch: width < 768 });
    test('flip one card at a time and close on an outside click or Escape', async ({ page }, testInfo) => {
      await page.goto('/');
      const steps = page.locator('[data-solution-steps]');
      const cards = steps.locator('[data-solution-step]');
      const toggle = (index: number) => cards.nth(index).locator('[data-step-toggle]');
      await expect(steps).toHaveClass(/is-interactive/);
      await expect(cards.locator('[data-step-front] h3')).toHaveText(['Signals', 'Correlations', 'Responses']);
      await expect(cards.locator('[data-step-toggle]')).toHaveText(['read more...', 'read more...', 'read more...']);
      await expect(cards.locator('[aria-expanded="true"]')).toHaveCount(0);
      if (width < 768) await toggle(0).tap();
      else await toggle(0).click();
      await expect(toggle(0)).toHaveAttribute('aria-expanded', 'true');
      await expect(cards.nth(0).locator('[data-step-back]')).toHaveAttribute('aria-hidden', 'false');
      await cards.nth(0).locator('.solution-step__inner').evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
      await steps.screenshot({ path: testInfo.outputPath('flip-cards.png'), style: '.navbar { visibility: hidden !important; }' });
      if (width < 768) await cards.nth(1).tap({ position: { x: 50, y: 50 } });
      else await cards.nth(1).click({ position: { x: 50, y: 50 } });
      await expect(toggle(0)).toHaveAttribute('aria-expanded', 'false');
      await expect(cards.nth(0).locator('[data-step-back]')).toHaveAttribute('aria-hidden', 'true');
      await expect(toggle(1)).toHaveAttribute('aria-expanded', 'true');
      await expect(steps.locator('.is-open')).toHaveCount(1);
      await page.locator('.solution__statement').click();
      await expect(steps.locator('.is-open')).toHaveCount(0);
      await toggle(2).focus();
      await page.keyboard.press('Enter');
      await expect(toggle(2)).toHaveAttribute('aria-expanded', 'true');
      await expect(cards.nth(2).getByRole('button', { name: 'Close Responses details', exact: true })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(steps.locator('.is-open')).toHaveCount(0);
      await expect(toggle(2)).toBeFocused();
      await toggle(0).click();
      await steps.getByRole('button', { name: 'Close Signals details', exact: true }).click();
      await expect(steps.locator('.is-open')).toHaveCount(0);
      if (width < 768) {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await toggle(1).tap();
        expect(await cards.nth(1).locator('.solution-step__inner').evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  });
}

test('color swatches change the sofa photo and preserve the choice between scenarios', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/');
  const demo = page.locator('[data-solution-demo]');
  await demo.locator('[data-solution-select="1"]').click();
  const colorSlide = demo.locator('[data-scenario="color"]');
  const sofa = colorSlide.locator('.solution-demo__photo img');
  const photos = new Set<string>();
  for (const name of ['Sand', 'Ivory', 'Warm Grey', 'Charcoal', 'Sage', 'Navy', 'Terracotta', 'Ochre']) {
    const swatch = colorSlide.getByRole('button', { name: `Show ${name} sofa`, exact: true });
    await swatch.click();
    await expect(swatch).toHaveAttribute('aria-pressed', 'true');
    await expect(colorSlide.locator('[aria-pressed="true"]')).toHaveCount(1);
    await expect(colorSlide.locator('[data-solution-color-name]')).toHaveText(name);
    await expect(sofa).toHaveAttribute('alt', `Valencia Sofa in ${name.toLowerCase()} upholstery`);
    await expect.poll(() => sofa.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    photos.add((await colorSlide.locator('.solution-demo__visual').screenshot()).toString('base64'));
  }
  expect(photos.size).toBe(8);
  await colorSlide.getByRole('button', { name: 'Show Sage sofa', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(sofa).toHaveAttribute('src', '/sofa-colors/sage.webp');
  await demo.locator('[data-solution-select="0"]').click();
  await expect(demo.locator('[data-scenario="returns"] .solution-demo__photo img')).toHaveAttribute('src', '/sofa-colors/sage.webp');
  for (const [index, name] of ['Navy', 'Ivory', 'Terracotta', 'Charcoal', 'Ochre'].entries()) {
    await demo.locator(`[data-solution-select="${index}"]`).click();
    const active = demo.locator('[data-solution-slide]:visible');
    await active.getByRole('button', { name: `Show ${name} sofa`, exact: true }).click();
    await expect(active.locator('.solution-demo__photo img')).toHaveAttribute('alt', `Valencia Sofa in ${name.toLowerCase()} upholstery`);
    await expect(active.locator('[data-solution-color-name]')).toHaveText(name);
  }
  await demo.locator('[data-solution-select="1"]').click();
  await expect(colorSlide.getByRole('button', { name: 'Show Ochre sofa', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('thumbnail previews support hover, keyboard and touch without replacing the sofa image', async ({ page, browser }, testInfo) => {
  await page.goto('/');
  const slide = page.locator('[data-scenario="returns"]');
  const main = slide.locator('.solution-demo__photo img');
  const original = await main.getAttribute('src');
  const thumbnails = slide.locator('[data-solution-thumbnail]');
  await thumbnails.nth(1).hover();
  await expect(thumbnails.nth(1).locator('.solution-demo__thumbnail-preview')).toBeVisible();
  await expect(main).toHaveAttribute('src', original!);
  await slide.locator('.solution-demo__visual').screenshot({ path: testInfo.outputPath('thumbnail-preview.png') });
  await page.keyboard.press('Escape');
  await expect(slide.locator('[aria-expanded="true"]')).toHaveCount(0);
  await thumbnails.nth(2).focus();
  await expect(thumbnails.nth(2).locator('.solution-demo__thumbnail-preview')).toBeVisible();
  await slide.getByRole('button', { name: 'Show Sage sofa', exact: true }).click();
  await thumbnails.nth(3).click();
  await expect(thumbnails.nth(3).locator('img').first()).toHaveAttribute('src', '/sofa-colors/sage.webp');
  await expect(main).toHaveAttribute('src', '/sofa-colors/sage.webp');

  const context = await browser.newContext({ viewport: { width: 320, height: 1000 }, hasTouch: true, isMobile: true });
  try {
    const mobile = await context.newPage();
    await mobile.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.fulfill({ status: 200, body: '' }));
    await mobile.goto('http://127.0.0.1:4330/');
    const visual = mobile.locator('[data-scenario="returns"] .solution-demo__visual');
    const thumbnail = visual.locator('[data-solution-thumbnail]').first();
    await thumbnail.tap();
    await expect(thumbnail.locator('.solution-demo__thumbnail-preview')).toBeVisible();
    await expect(visual.locator('.solution-demo__photo img')).toHaveAttribute('src', '/before-836.webp');
    const position = await visual.evaluate(el => {
      const image = el.getBoundingClientRect();
      const row = el.querySelector('.solution-demo__thumbnails')!.getBoundingClientRect();
      const preview = el.querySelector('[aria-expanded="true"] .solution-demo__thumbnail-preview')!.getBoundingClientRect();
      return { centered: Math.abs((row.left + row.right - image.left - image.right) / 2) < 1, inside: preview.left >= image.left && preview.right <= image.right && preview.top >= image.top && row.bottom <= image.bottom };
    });
    expect(position).toEqual({ centered: true, inside: true });
    await visual.screenshot({ path: testInfo.outputPath('thumbnail-preview-mobile.png') });
  } finally {
    await context.close();
  }
});

test('showroom calendar selects future dates and previews the visit', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-21T12:00:00+03:00') });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/');
  const demo = page.locator('[data-solution-demo]');
  await demo.locator('[data-solution-select="4"]').click();
  const booking = demo.locator('[data-showroom-booking]');
  const button = booking.locator('[data-showroom-book]');
  const dateToggle = booking.getByRole('button', { name: 'Choose a showroom visit date', exact: true });
  await dateToggle.click();
  await expect(booking.locator('[data-showroom-month]')).toHaveText('October 2026');
  await expect(booking.getByRole('button', { name: 'Previous month', exact: true })).toBeDisabled();
  await expect(booking.getByRole('button', { name: 'Tuesday, 20 October 2026', exact: true })).toBeDisabled();
  await expect(button).toBeDisabled();
  await booking.getByRole('button', { name: 'Wednesday, 28 October 2026', exact: true }).click();
  await expect(button).toBeEnabled();
  await button.click();
  await expect(booking.getByRole('status')).toHaveText('Visit preview: Wednesday, 28 October 2026 at your nearest center.');
  await dateToggle.click();
  await booking.getByRole('button', { name: 'Next month', exact: true }).click();
  await expect(booking.locator('[data-showroom-month]')).toHaveText('November 2026');
  const date = booking.getByRole('button', { name: 'Tuesday, 3 November 2026', exact: true, includeHidden: true });
  await date.focus();
  await page.keyboard.press('Enter');
  await expect(date).toHaveAttribute('aria-pressed', 'true');
  await button.click();
  await expect(booking.getByRole('status')).toContainText('Tuesday, 3 November 2026');
  await demo.locator('[data-solution-select="0"]').click();
  await demo.locator('[data-solution-select="4"]').click();
  await expect(date).toHaveAttribute('aria-pressed', 'true');
});

test('solution animation cycles through all five pages, pauses and supports selection', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const demo = page.locator('[data-solution-demo]');
  await demo.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const active = demo.locator('[data-solution-slide]:visible');
  await expect(active).toHaveAttribute('aria-label', '1 of 5: Returns');
  for (const label of ['2 of 5: Color', '3 of 5: Material', '4 of 5: Price', '5 of 5: Showroom Visit', '1 of 5: Returns']) {
    await page.clock.runFor(2900);
    await expect(active).toHaveAttribute('aria-label', label);
    await expect(active.locator('.solution-demo__question')).toBeVisible();
  }
  await demo.getByRole('button', { name: 'Pause scenario animation' }).click();
  await page.clock.runFor(6000);
  await expect(active).toHaveAttribute('aria-label', '1 of 5: Returns');
  await demo.locator('[data-solution-select="3"]').click();
  await expect(active).toHaveAttribute('aria-label', '4 of 5: Price');
  await expect(demo.locator('[data-solution-select="3"]')).toHaveAttribute('aria-pressed', 'true');
  await page.clock.runFor(6000);
  await expect(active).toHaveAttribute('aria-label', '4 of 5: Price');
  await demo.getByRole('button', { name: 'Play scenario animation' }).click();
  await page.clock.runFor(2900);
  await expect(active).toHaveAttribute('aria-label', '5 of 5: Showroom Visit');
});

test('solution reduced motion keeps manual scenario selection available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/');
  const demo = page.locator('[data-solution-demo]');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator('[data-solution-pause]')).toBeHidden();
  await page.clock.runFor(10000);
  await expect(demo.locator('[data-solution-slide]:visible')).toHaveAttribute('aria-label', '1 of 5: Returns');
  await demo.locator('[data-solution-select="4"]').focus();
  await page.keyboard.press('Enter');
  await expect(demo.locator('[data-solution-slide]:visible')).toHaveAttribute('aria-label', '5 of 5: Showroom Visit');
  expect(await demo.locator('.solution-demo__slide.is-active .solution-demo__page').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});

test('solution first example and explanatory cards render without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4330/');
  await expect(page.locator('#solution [data-solution-slide]:visible')).toHaveAttribute('aria-label', '1 of 5: Returns');
  await expect(page.locator('#solution .solution-step')).toHaveCount(3);
  await expect(page.locator('#solution .solution-step p')).toHaveCount(3);
  await expect(page.locator('#solution .solution-step p').first()).toBeVisible();
  await expect(page.locator('#solution [data-step-toggle]:visible')).toHaveCount(0);
  await expect(page.locator('#solution .solution-demo__controls')).toBeHidden();
  await context.close();
});
