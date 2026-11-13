const demo = document.querySelector<HTMLElement>('[data-solution-demo]');

if (demo) {
  const slides = [...demo.querySelectorAll<HTMLElement>('[data-solution-slide]')];
  const selectors = [...demo.querySelectorAll<HTMLButtonElement>('[data-solution-select]')];
  const controls = demo.querySelector<HTMLElement>('.solution-demo__controls');
  const pauseButton = demo.querySelector<HTMLButtonElement>('[data-solution-pause]');
  const thumbnails = [...demo.querySelectorAll<HTMLButtonElement>('[data-solution-thumbnail]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = true;
  let visible = !('IntersectionObserver' in window);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const schedule = () => {
    clearTimeout(timer);
    timer = undefined;
    if (visible && !paused && !motion.matches && !document.hidden) {
      timer = setTimeout(() => { show((current + 1) % slides.length); schedule(); }, 8000);
    }
  };

  const show = (index: number) => {
    current = index;
    thumbnails.forEach(button => button.setAttribute('aria-expanded', 'false'));
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', String(i !== current));
      slide.inert = i !== current;
      slide.classList.toggle('is-active', i === current);
    });
    selectors.forEach((button, i) => {
      button.classList.toggle('is-active', i === current);
      button.setAttribute('aria-pressed', String(i === current));
    });
  };

  const updatePauseButton = () => {
    if (!pauseButton) return;
    pauseButton.hidden = motion.matches;
    const label = paused ? 'Play' : 'Pause';
    pauseButton.setAttribute('aria-label', `${label} scenario animation`);
    const text = pauseButton.querySelector('span');
    if (text) text.textContent = label;
    const path = pauseButton.querySelector('path');
    path?.setAttribute('d', paused ? 'M4 2l10 6-10 6z' : 'M4 3h3v10H4zm5 0h3v10H9z');
  };

  if (controls) controls.hidden = false;
  const colorImages = [...demo.querySelectorAll<HTMLImageElement>('.solution-demo__photo img, [data-solution-thumbnail] img')];
  const colorNames = [...demo.querySelectorAll<HTMLElement>('[data-solution-color-name]')];
  const swatches = [...demo.querySelectorAll<HTMLButtonElement>('[data-solution-color]')];
  swatches.forEach(button => button.addEventListener('click', () => {
    const { colorImage, solutionColor } = button.dataset;
    if (!colorImage || !solutionColor) return;
    colorImages.forEach(image => {
      image.src = colorImage;
      if (image.closest('.solution-demo__photo')) image.alt = `Valencia Sofa in ${solutionColor.toLowerCase()} upholstery`;
    });
    colorNames.forEach(name => { name.textContent = solutionColor; });
    swatches.forEach(swatch => swatch.setAttribute('aria-pressed', String(swatch.dataset.solutionColor === solutionColor)));
    paused = true;
    updatePauseButton();
    schedule();
  }));
  const closePreviews = () => thumbnails.forEach(button => button.setAttribute('aria-expanded', 'false'));
  const preview = (button: HTMLButtonElement) => {
    closePreviews();
    button.setAttribute('aria-expanded', 'true');
    paused = true;
    updatePauseButton();
    schedule();
  };
  thumbnails.forEach(button => {
    button.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') preview(button); });
    button.addEventListener('pointerleave', () => button.setAttribute('aria-expanded', 'false'));
    button.addEventListener('focus', () => preview(button));
    button.addEventListener('blur', () => button.setAttribute('aria-expanded', 'false'));
    button.addEventListener('click', () => preview(button));
  });
  document.addEventListener('pointerdown', event => {
    if (!(event.target instanceof Element) || !event.target.closest('[data-solution-thumbnail]')) closePreviews();
  });
  demo.addEventListener('keydown', event => { if (event.key === 'Escape') closePreviews(); });
  selectors.forEach((button, index) => button.addEventListener('click', () => {
    show(index);
    paused = true;
    updatePauseButton();
    schedule();
  }));
  pauseButton?.addEventListener('click', () => {
    paused = !paused;
    updatePauseButton();
    schedule();
  });
  // Stop automatic changes when a keyboard user enters the demonstration.
  demo.addEventListener('focusin', (event) => {
    if (pauseButton?.contains(event.target as Node)) return;
    paused = true;
    updatePauseButton();
    schedule();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      schedule();
    }, { threshold: 0.2 }).observe(demo);
  }
  motion.addEventListener('change', () => { updatePauseButton(); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  updatePauseButton();
  schedule();
}
