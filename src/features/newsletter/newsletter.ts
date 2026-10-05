const form = document.querySelector<HTMLFormElement>('#sib-form');
const email = document.querySelector<HTMLInputElement>('#EMAIL');
const error = document.getElementById('email-msg-error');
const success = document.getElementById('email-msg-success');

if (form && email && error && success) {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const hideMessages = () => {
    error.style.display = 'none';
    success.style.display = 'none';
  };
  email.addEventListener('input', hideMessages);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideMessages();
    email.value = email.value.trim();
    if (!email.checkValidity()) {
      error.textContent = 'Please enter a valid email address.';
      error.style.display = 'block';
      return;
    }
    if (button?.disabled) return;
    if (button) button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    try {
      // Brevo's existing hosted form does not expose a CORS-readable response.
      // An opaque response confirms transport only, not a successful subscription.
      await fetch(form.action, { method: 'POST', body: new FormData(form), mode: 'no-cors' });
      success.textContent =
        'Your subscription request was sent. Please check your inbox for any confirmation.';
      success.style.display = 'block';
      form.reset();
    } catch {
      error.textContent = 'We could not send your request. Please try again.';
      error.style.display = 'block';
    } finally {
      if (button) button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}
