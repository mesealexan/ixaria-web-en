const motion = matchMedia('(prefers-reduced-motion: reduce)');
const groups = [
  { selector: '.value-item', className: 'value-item--visible', delay: 200 },
  { selector: '.feature-card', className: 'feature-card--visible', delay: 100 },
  { selector: '.step', className: 'step--visible', delay: 250 },
  { selector: '.cta-strip', className: 'cta-strip--visible', delay: 0 },
];

groups.forEach((group) => {
  const elements = [...document.querySelectorAll<HTMLElement>(group.selector)];
  if (motion.matches || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add(group.className));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = elements.indexOf(entry.target as HTMLElement);
        window.setTimeout(
          () => entry.target.classList.add(group.className),
          (index % 3) * group.delay,
        );
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );
  elements.forEach((element) => observer.observe(element));
  motion.addEventListener('change', (event) => {
    if (event.matches) {
      observer.disconnect();
      elements.forEach((element) => element.classList.add(group.className));
    }
  });
});
