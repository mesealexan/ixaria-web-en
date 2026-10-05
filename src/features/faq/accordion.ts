const questions = document.querySelectorAll<HTMLButtonElement>('.faq__question');

function setExpanded(question: HTMLButtonElement, open: boolean) {
  question.classList.toggle('open', open);
  question.setAttribute('aria-expanded', String(open));
  const answer = document.getElementById(question.getAttribute('aria-controls') ?? '');
  answer?.classList.toggle('open', open);
}

questions.forEach((question) =>
  question.addEventListener('click', () => {
    const wasOpen = question.getAttribute('aria-expanded') === 'true';
    questions.forEach((other) => setExpanded(other, false));
    if (!wasOpen) setExpanded(question, true);
  }),
);
