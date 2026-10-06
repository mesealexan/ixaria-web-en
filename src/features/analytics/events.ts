declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const track = (name: string, parameters: Record<string, string> = {}) =>
  window.gtag?.('event', name, { page_path: window.location.pathname, ...parameters });

document.addEventListener('click', (event) => {
  const element = (event.target as Element).closest<HTMLAnchorElement>('a');
  if (!element) return;
  const href = element.getAttribute('href') ?? '';
  const label = (element.textContent ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
  if (/calendly\.com|calendar\.app\.google/i.test(element.href)) {
    track(label.includes('discovery') ? 'book_discovery_call' : 'book_call', {
      link_text: label || 'book a call',
      link_url: element.href,
    });
  } else if (
    (href === '#how-it-works' || href === '/#how-it-works') &&
    element.classList.contains('btn-secondary')
  ) {
    track('see_how_it_works');
  } else {
    const network = ['linkedin', 'youtube', 'instagram', 'facebook'].find(
      (name) =>
        element.href.includes(`${name}.com`) ||
        (name === 'youtube' && element.href.includes('youtu.be')),
    );
    if (network)
      track('social_click', {
        social_network: network,
        link_url: element.href,
        link_text: label || element.getAttribute('aria-label') || network,
      });
  }
});
document.addEventListener('submit', (event) => {
  if ((event.target as HTMLFormElement).id === 'sib-form') track('newsletter_submit');
});

export {};
