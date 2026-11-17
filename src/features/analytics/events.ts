declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: { capture: (event: string, properties?: Record<string, unknown>) => void };
  }
}

const track = (name: string, parameters: Record<string, string> = {}) => {
  const properties = { page_path: window.location.pathname, ...parameters };
  window.gtag?.('event', name, properties);
  window.posthog?.capture(name, properties);
};

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
    ['#how-it-works', '/#how-it-works', '#solution', '/#solution', '#method', '/#method'].includes(href) &&
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

export {};
