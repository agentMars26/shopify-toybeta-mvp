document.documentElement.classList.remove('no-js');

document.addEventListener('change', (event) => {
  const trigger = event.target.closest('[data-qty-input]');
  if (!trigger) return;
  const value = Math.max(1, Number(trigger.value || 1));
  trigger.value = value;
});
