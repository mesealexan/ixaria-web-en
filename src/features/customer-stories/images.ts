const dialog = document.querySelector<HTMLDialogElement>('.story-lightbox');
const detail = dialog?.querySelector<HTMLImageElement>('.story-lightbox__body img');
let trigger: HTMLAnchorElement | null = null;
if (dialog && detail) {
  document.querySelectorAll<HTMLAnchorElement>('[data-story-enlarge]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !dialog.showModal) return;
      event.preventDefault();
      trigger = link;
      detail.src = link.href;
      detail.alt = link.querySelector('img')?.alt ?? 'Agache screenshot';
      dialog.showModal();
    });
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { trigger?.focus(); });
}
