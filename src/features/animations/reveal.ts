const groups = [
  ['.value-item', 'value-item--visible'],
  ['.feature-card', 'feature-card--visible'],
  ['.process-card', 'process-card--visible'],
  ['.cta-strip', 'cta-strip--visible'],
];
for (const [selector, className] of groups) {
  document.querySelectorAll(selector).forEach(element => element.classList.add(className));
}
export {};
