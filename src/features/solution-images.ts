const dialog = document.querySelector<HTMLDialogElement>('.solution-lightbox');
const image = dialog?.querySelector<HTMLImageElement>('img');

if (dialog && image) {
  let trigger: HTMLAnchorElement | undefined;

  document.querySelectorAll<HTMLAnchorElement>('.solution-view__expand').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || !dialog.showModal) return;
      event.preventDefault();
      trigger = link;
      image.src = link.href;
      image.alt = link.querySelector('img')?.alt ?? '';
      image.loading = 'eager';
      dialog.showModal();
    });
  });

  dialog.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
}
