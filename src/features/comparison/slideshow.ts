const slideshow = document.getElementById('ixaria-way-slideshow');
if (slideshow) {
  const slides = slideshow.querySelectorAll<HTMLImageElement>('img');
  const captions = slideshow.querySelectorAll<HTMLElement>('.ba-card__caption');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  const advance = () => {
    slides[index]?.classList.remove('is-active');
    slides[index]?.setAttribute('aria-hidden', 'true');
    captions[index]?.classList.remove('is-active');
    captions[index]?.setAttribute('aria-hidden', 'true');
    index = (index + 1) % slides.length;
    slides[index]?.classList.add('is-active');
    slides[index]?.removeAttribute('aria-hidden');
    captions[index]?.classList.add('is-active');
    captions[index]?.removeAttribute('aria-hidden');
  };
  const updateTimer = () => {
    clearInterval(timer);
    if (slides.length > 1 && !motion.matches && !document.hidden)
      timer = setInterval(advance, 2000);
  };
  motion.addEventListener('change', updateTimer);
  document.addEventListener('visibilitychange', updateTimer);
  updateTimer();
}
