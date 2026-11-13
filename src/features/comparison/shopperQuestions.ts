const list = document.querySelector<HTMLElement>('#shopper-questions');
if (list) {
  const questions = [...list.querySelectorAll<HTMLElement>('.product-questions__bubble')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cadence = 2000;
  const visible = questions.slice(0, 2);
  let nextQuestion = visible.length;
  let nextSlot = 0;
  let inView = false;
  let generation = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let animations: Animation[] = [];
  const canRotate = () => inView && !document.hidden && !reducedMotion.matches && questions.length > 2;
  const show = () => {
    questions.forEach(question => {
      const slot = visible.indexOf(question);
      question.hidden = slot === -1;
      question.style.gridRow = slot === -1 ? '' : String(slot + 1);
    });
    // Keep reading order aligned with the two visual rows as they change.
    list.append(...visible);
  };
  const stop = () => {
    generation++;
    clearTimeout(timer);
    timer = undefined;
    animations.forEach(animation => animation.cancel());
    animations = [];
  };
  const schedule = (delay = cadence) => {
    if (canRotate()) timer = setTimeout(rotate, delay);
  };
  const animateQuestion = async (question: HTMLElement, frames: Keyframe[], duration: number, current: number) => {
    animations = [question.animate(frames, { duration, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' })];
    await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
    if (generation !== current) return false;
    animations.forEach(animation => animation.cancel());
    animations = [];
    return true;
  };
  async function rotate() {
    timer = undefined;
    if (!canRotate()) return;
    const current = generation;
    const started = performance.now();
    const slot = nextSlot;
    if (!await animateQuestion(visible[slot], [
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(-32px)', opacity: 0 },
    ], 240, current)) return;
    visible[slot] = questions[nextQuestion];
    nextQuestion = (nextQuestion + 1) % questions.length;
    nextSlot = (slot + 1) % visible.length;
    show();
    if (!await animateQuestion(visible[slot], [
      { transform: 'translateX(32px)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ], 360, current)) return;
    schedule(Math.max(0, cadence / 2 - (performance.now() - started)));
  }
  // Give newly visible questions an immediate first change, then keep the
  // existing one-second stagger between the two rows.
  const sync = () => { stop(); schedule(150); };
  show();
  const observer = new IntersectionObserver(entries => {
    const entry = entries[entries.length - 1];
    const visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
    if (visible !== inView) { inView = visible; sync(); }
  }, { threshold: [0, 0.1] });
  observer.observe(list);
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  window.addEventListener('pagehide', stop);
}
export {};
