import { chatDemo } from '../../data/chat';

// This intentionally retains the original demo replies. A real assistant needs
// a server endpoint; provider credentials must never be sent to the browser.
export function initializeChat(overlay: HTMLElement) {
  const messages = overlay.querySelector<HTMLElement>('#chat-messages');
  const input = overlay.querySelector<HTMLTextAreaElement>('#chat-input');
  const send = overlay.querySelector<HTMLButtonElement>('#chat-send');
  const close = overlay.querySelector<HTMLButtonElement>('[data-chat-close]');
  if (!messages || !input || !send || !close) return;
  let replyIndex = 0;
  let previousFocus: HTMLElement | null = null;

  const append = (text: string, role: 'user' | 'ai') => {
    const message = document.createElement('div');
    message.className = `chat-msg chat-msg--${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg__bubble';
    bubble.textContent = text;
    const time = document.createElement('div');
    time.className = 'chat-msg__time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    message.append(bubble, time);
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
  };
  const closeChat = () => {
    overlay.hidden = true;
    overlay.classList.remove('chat-overlay--open');
    document.body.style.overflow = '';
    previousFocus?.focus();
  };
  const submit = async () => {
    const text = input.value.trim();
    if (!text || send.disabled) return;
    input.value = '';
    input.style.height = 'auto';
    send.disabled = true;
    append(text, 'user');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    append(chatDemo.replies[replyIndex++ % chatDemo.replies.length]!, 'ai');
    send.disabled = false;
    input.focus();
  };
  send.addEventListener('click', submit);
  close.addEventListener('click', closeChat);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeChat();
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  });
  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeChat();
    if (event.key === 'Tab') {
      const elements = [...overlay.querySelectorAll<HTMLElement>('button:not(:disabled),textarea')];
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
  append(chatDemo.welcome, 'ai');
  return () => {
    previousFocus = document.activeElement as HTMLElement;
    overlay.hidden = false;
    overlay.classList.add('chat-overlay--open');
    document.body.style.overflow = 'hidden';
    input.focus();
  };
}
