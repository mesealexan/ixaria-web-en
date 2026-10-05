const navbar = document.querySelector<HTMLElement>('.navbar');
const toggle = document.querySelector<HTMLButtonElement>('.navbar__mobile-toggle');
const navigation = document.querySelector<HTMLElement>('#primary-navigation');

if (navbar && toggle && navigation) {
  const setOpen = (open: boolean) => {
    navigation.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  matchMedia('(max-width: 768px)').addEventListener('change', () => setOpen(false));
  const updateShadow = () => navbar.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', updateShadow, { passive: true });
  updateShadow();
}

export {};
