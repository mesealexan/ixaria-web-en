const navbar = document.querySelector<HTMLElement>('.navbar');
const toggle = document.querySelector<HTMLButtonElement>('.navbar__mobile-toggle');
const navigation = document.querySelector<HTMLElement>('#primary-navigation');

if (navbar && toggle && navigation) {
  const process = navigation.querySelector<HTMLDetailsElement>('.navbar__process');
  const processTrigger = process?.querySelector<HTMLElement>('summary');
  const setOpen = (open: boolean) => {
    navigation.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (!open && process) process.open = false;
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (process?.open) {
      process.open = false;
      processTrigger?.focus();
    } else if (toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (process?.open && event.target instanceof Node && !process.contains(event.target)) process.open = false;
  });
  process?.addEventListener('focusout', (event) => {
    if (event.relatedTarget instanceof Node && !process.contains(event.relatedTarget)) process.open = false;
  });
  matchMedia('(max-width: 768px)').addEventListener('change', () => setOpen(false));
  const updateShadow = () => navbar.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', updateShadow, { passive: true });
  updateShadow();
}

export {};
