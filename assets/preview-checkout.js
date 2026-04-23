(() => {
  const storefront = window.ToybetaStorefront || { config: { mode: 'local_preview' }, cart: null };
  const cartApi = storefront.cart;
  const summaryItems = document.getElementById('demo-summary-items');
  const totalStack = document.getElementById('demo-total-stack');
  const summaryCount = document.getElementById('demo-summary-count');
  const checkoutForm = document.getElementById('demo-checkout-form');
  const confirmation = document.getElementById('demo-order-confirmation');
  const confirmationMessage = document.getElementById('demo-order-message');
  const placeOrderButton = document.getElementById('demo-place-order-button');
  const shippingPrices = { tracked: 800, priority: 1400 };

  function formatMoney(cents) {
    return cartApi?.formatMoney ? cartApi.formatMoney(cents, 'USD') : `$${(Number(cents || 0) / 100).toFixed(2)}`;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getShippingCents() {
    const method = checkoutForm?.querySelector('input[name="shipping_method"]:checked')?.value || 'tracked';
    return shippingPrices[method] || shippingPrices.tracked;
  }

  function renderTotals(cart) {
    if (!totalStack) return;
    const subtotal = Number(cart?.total_price || 0);
    const shipping = cart?.item_count ? getShippingCents() : 0;
    const taxes = Math.round(subtotal * 0.0825);
    const total = subtotal + shipping + taxes;

    totalStack.innerHTML = `
      <div class="checkout-total-row"><span>Subtotal</span><strong>${formatMoney(subtotal)}</strong></div>
      <div class="checkout-total-row"><span>Shipping</span><strong>${formatMoney(shipping)}</strong></div>
      <div class="checkout-total-row"><span>Estimated taxes</span><strong>${formatMoney(taxes)}</strong></div>
      <div class="checkout-total-row checkout-total-row--grand"><span>Total</span><strong>${formatMoney(total)}</strong></div>
      <p class="text-muted checkout-total-note">Taxes and rates are mocked for local review only.</p>
    `;
  }

  function renderCart(cart) {
    if (!summaryItems || !summaryCount) return;

    summaryCount.textContent = `${cart.item_count} item${cart.item_count === 1 ? '' : 's'}`;

    if (!cart.items.length) {
      summaryItems.innerHTML = `
        <div class="drawer-note text-muted">
          <p>Your preview cart is empty. Add an item from <a href="preview.html">preview.html</a> to demo the handoff.</p>
        </div>
      `;
      if (placeOrderButton) placeOrderButton.disabled = true;
      renderTotals(cart);
      return;
    }

    if (placeOrderButton) placeOrderButton.disabled = false;

    summaryItems.innerHTML = cart.items.map((item) => `
      <article class="drawer-item checkout-summary-item">
        <div class="drawer-thumb">${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.product_title || item.title)}">` : ''}</div>
        <div>
          <div class="drawer-item-row"><strong>${escapeHtml(item.product_title || item.title)}</strong><span>${formatMoney(item.final_line_price)}</span></div>
          <div class="text-muted">Qty ${item.quantity}${item.variantTitle ? ` • ${escapeHtml(item.variantTitle)}` : ''}</div>
        </div>
      </article>
    `).join('');

    renderTotals(cart);
  }

  async function refresh() {
    const cart = await cartApi.getCart();
    renderCart(cart);
  }

  checkoutForm?.addEventListener('change', (event) => {
    if (event.target.name === 'shipping_method') refresh();
  });

  checkoutForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const cart = await cartApi.getCart();
    if (!cart.item_count) return;

    if (placeOrderButton) {
      placeOrderButton.disabled = true;
      placeOrderButton.textContent = 'Placing demo order…';
    }

    const orderNumber = `TB-DEMO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 900 + 100)}`;
    const email = checkoutForm.querySelector('input[name="email"]')?.value || 'collector@toybeta.test';
    const total = Number(cart.total_price || 0) + getShippingCents() + Math.round(Number(cart.total_price || 0) * 0.0825);

    await cartApi.clear?.();
    renderCart({ ...cart, item_count: 0, total_price: 0, items: [] });
    checkoutForm.hidden = true;
    confirmation.hidden = false;
    confirmationMessage.textContent = `${orderNumber} was created for ${email}. Demo total: ${formatMoney(total)}. The shared preview cart has been cleared so you can run the walkthrough again.`;
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if (cartApi?.subscribe) {
    cartApi.subscribe(renderCart);
  }

  refresh();
})();
