const visual = document.querySelector<HTMLElement>('.product-questions');

if (visual) {
  const questions = [...visual.querySelectorAll<HTMLElement>('.product-questions__bubble')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const slots: (HTMLElement | undefined)[] = [undefined, undefined, undefined];
  let nextQuestion = 0;
  let nextSlot = 0;
  let visible = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let fade: ReturnType<typeof setTimeout> | undefined;

  const position = (question: HTMLElement, slot: number) => {
    const inset = visual.clientWidth <= 360 ? 8 : 14;
    const tail = matchMedia('(max-width: 480px)').matches ? 10 : 13;
    const maxX = visual.clientWidth - question.offsetWidth - inset;
    const x = slot === 0 ? inset : slot === 1 ? maxX : (visual.clientWidth - question.offsetWidth) / 2;
    const y = slot === 2 ? visual.clientHeight - question.offsetHeight - tail - inset : inset + (slot === 1 ? 6 : 0);
    question.style.left = `${Math.max(inset, x)}px`;
    question.style.top = `${Math.max(inset, y)}px`;
  };

  const reveal = (slot: number, animate = true) => {
    const question = questions[nextQuestion];
    if (!question) return;
    nextQuestion = (nextQuestion + 1) % questions.length;
    question.dataset.slot = String(slot);
    question.hidden = false;
    question.classList.remove('is-active', 'is-changing');
    slots[slot] = question;
    position(question, slot);
    // Commit the transparent starting state before fading the next question in.
    if (animate) void question.offsetWidth;
    question.classList.add('is-active');
  };

  const tick = () => {
    const slot = nextSlot;
    nextSlot = (nextSlot + 1) % slots.length;
    const outgoing = slots[slot];
    if (outgoing) {
      outgoing.classList.add('is-changing');
      fade = setTimeout(() => {
        outgoing.hidden = true;
        outgoing.classList.remove('is-active', 'is-changing');
        reveal(slot);
        fade = undefined;
      }, 400);
    } else {
      reveal(slot);
    }
    timer = setTimeout(tick, 1500);
  };

  const update = () => {
    clearTimeout(timer);
    timer = undefined;
    clearTimeout(fade);
    fade = undefined;
    slots.forEach((question) => question?.classList.remove('is-changing'));
    // Have all three questions ready before the shopper scrolls to the visual.
    slots.forEach((question, slot) => {
      if (!question) reveal(slot, false);
    });
    if (!motion.matches && visible && !document.hidden) {
      tick();
    }
  };

  new ResizeObserver(() => slots.forEach((question, slot) => {
    if (question) position(question, slot);
  })).observe(visual);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      update();
    }, { threshold: 0 }).observe(visual);
  } else {
    visible = true;
  }
  motion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  update();
}
