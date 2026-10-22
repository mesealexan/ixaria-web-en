const steps = document.querySelector<HTMLElement>('[data-solution-steps]');

if (steps) {
  const cards = [...steps.querySelectorAll<HTMLElement>('[data-solution-step]')];
  const setOpen = (card: HTMLElement, open: boolean) => {
    const button = card.querySelector<HTMLButtonElement>('[data-step-toggle]');
    const closeButton = card.querySelector<HTMLButtonElement>('[data-step-close]');
    const hasFocus = card.contains(document.activeElement);
    const front = card.querySelector<HTMLElement>('[data-step-front]');
    const back = card.querySelector<HTMLElement>('[data-step-back]');
    card.classList.toggle('is-open', open);
    button?.setAttribute('aria-expanded', String(open));
    front?.setAttribute('aria-hidden', String(open));
    back?.setAttribute('aria-hidden', String(!open));
    if (front) front.inert = open;
    if (back) back.inert = !open;
    if (hasFocus) (open ? closeButton : button)?.focus({ preventScroll: true });
  };
  const closeAll = () => cards.forEach(card => setOpen(card, false));

  cards.forEach(card => {
    setOpen(card, false);
    card.querySelectorAll<HTMLButtonElement>('[data-step-toggle], [data-step-close]').forEach(button => { button.hidden = false; });
    card.addEventListener('click', () => {
      const open = !card.classList.contains('is-open');
      closeAll();
      if (open) setOpen(card, true);
    });
  });
  steps.classList.add('is-interactive');

  // Use the largest common title size that fits every card on one line.
  const fitTitles = () => {
    steps.style.setProperty('--step-title-size', '100px');
    const sizes = cards.map(card => {
      const front = card.querySelector<HTMLElement>('[data-step-front]');
      const title = front?.querySelector('h3');
      if (!front || !title) return Infinity;
      const style = getComputedStyle(front);
      const available = front.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 2;
      return available / title.offsetWidth * 100;
    });
    const size = Math.min(...sizes);
    if (Number.isFinite(size) && size > 0) {
      steps.style.setProperty('--step-title-size', `${Math.floor(size * 10) / 10}px`);
    }
  };
  fitTitles();
  document.fonts.ready.then(fitTitles);
  new ResizeObserver(fitTitles).observe(steps);

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element) || !event.target.closest('[data-solution-step]')) closeAll();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAll(); });
}
