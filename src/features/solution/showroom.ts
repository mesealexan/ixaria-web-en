const booking = document.querySelector<HTMLElement>('[data-showroom-booking]');

if (booking) {
  const monthLabel = booking.querySelector<HTMLElement>('[data-showroom-month]');
  const days = booking.querySelector<HTMLElement>('[data-showroom-days]');
  const previous = booking.querySelector<HTMLButtonElement>('[data-showroom-previous]');
  const next = booking.querySelector<HTMLButtonElement>('[data-showroom-next]');
  const book = booking.querySelector<HTMLButtonElement>('[data-showroom-book]');
  const status = booking.querySelector<HTMLElement>('[data-showroom-status]');
  const picker = booking.querySelector<HTMLElement>('[data-showroom-picker]');
  const dateToggle = booking.querySelector<HTMLButtonElement>('[data-showroom-date-toggle]');
  const dateText = booking.querySelector<HTMLElement>('[data-showroom-date-label]');
  const calendar = booking.querySelector<HTMLElement>('[data-showroom-calendar]');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let month = new Date(today.getFullYear(), today.getMonth(), 1);
  let selected: Date | undefined;
  const dateLabel = (date: Date) => date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const setCalendarOpen = (open: boolean) => {
    if (calendar) calendar.hidden = !open;
    dateToggle?.setAttribute('aria-expanded', String(open));
  };

  const render = () => {
    if (!days) return;
    days.replaceChildren();
    if (monthLabel) monthLabel.textContent = month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (previous) previous.disabled = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
    const offset = (month.getDay() + 6) % 7;
    for (let index = 0; index < offset; index++) {
      const space = document.createElement('span');
      space.setAttribute('aria-hidden', 'true');
      days.append(space);
    }
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= count; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(day);
      button.disabled = date < today;
      button.setAttribute('aria-label', dateLabel(date));
      button.setAttribute('aria-pressed', String(selected?.getTime() === date.getTime()));
      if (date.getTime() === today.getTime()) button.setAttribute('aria-current', 'date');
      button.addEventListener('click', () => {
        selected = date;
        days.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        if (book) book.disabled = false;
        if (dateText) dateText.textContent = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (status) status.textContent = '';
        setCalendarOpen(false);
        dateToggle?.focus();
      });
      days.append(button);
    }
  };

  dateToggle?.addEventListener('click', () => setCalendarOpen(calendar?.hidden !== false));
  document.addEventListener('click', event => {
    if (!(event.target instanceof Node) || !picker?.contains(event.target)) setCalendarOpen(false);
  });
  picker?.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setCalendarOpen(false);
      dateToggle?.focus();
    }
  });
  previous?.addEventListener('click', () => { month = new Date(month.getFullYear(), month.getMonth() - 1, 1); render(); });
  next?.addEventListener('click', () => { month = new Date(month.getFullYear(), month.getMonth() + 1, 1); render(); });
  book?.addEventListener('click', () => {
    if (selected && status) status.textContent = `Visit preview: ${dateLabel(selected)} at your nearest center.`;
  });
  render();
}
