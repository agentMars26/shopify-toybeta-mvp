document.documentElement.classList.remove('no-js');

const storefront = window.ToybetaStorefront || { config: { mode: 'shopify_live' }, cart: null };
const cartApi = storefront.cart;

document.addEventListener('change', (event) => {
  const trigger = event.target.closest('[data-qty-input]');
  if (!trigger) return;
  const value = Math.max(1, Number(trigger.value || 1));
  trigger.value = value;
});

const cartDrawer = document.querySelector('[data-cart-drawer]');
const drawerItems = document.querySelector('[data-cart-drawer-items]');
const drawerTotal = document.querySelector('[data-cart-total]');
const drawerCount = document.querySelector('[data-cart-count]');
const drawerHeading = document.querySelector('[data-cart-heading]');
const drawerProgressCopy = document.querySelector('[data-cart-progress-copy]');
const drawerProgressLabel = document.querySelector('[data-cart-progress-label]');
const drawerProgressFill = document.querySelector('[data-cart-progress-fill]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const menuToggle = document.querySelector('[data-menu-toggle]');

const storefrontConfig = window.TOYBETA_STOREFRONT_CONFIG || {};
const cartThresholds = {
  freeShipping: Number(storefrontConfig.cart?.freeShippingThreshold || 7500),
  freeGift: Number(storefrontConfig.cart?.freeGiftThreshold || 9000)
};

const drawerThresholdCopy = document.querySelector('[data-cart-threshold-copy]');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getItemVariantLabel(item) {
  if (item.variant_title && item.variant_title !== 'Default Title') return item.variant_title;
  if (item.variantTitle && item.variantTitle !== 'Default Title') return item.variantTitle;
  return '';
}

function setCartDrawerState(isOpen) {
  if (!cartDrawer) return;
  cartDrawer.classList.toggle('is-open', isOpen);
  cartDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  document.body.classList.toggle('body-lock', isOpen || mobileMenu?.hidden === false);
}

function setMobileMenuState(isOpen) {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.hidden = !isOpen;
  menuToggle.classList.toggle('is-active', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('body-lock', isOpen || cartDrawer?.classList.contains('is-open'));
}

function formatMoney(cents, currency = 'USD') {
  return cartApi?.formatMoney ? cartApi.formatMoney(cents, currency) : (Number(cents || 0) / 100).toLocaleString(undefined, { style: 'currency', currency });
}

function renderDrawerThresholdCopy(currency = 'USD') {
  if (!drawerThresholdCopy) return;
  drawerThresholdCopy.textContent = `Free shipping at ${formatMoney(cartThresholds.freeShipping, currency)}, free gift at ${formatMoney(cartThresholds.freeGift, currency)}`;
}

function renderCartProgress(cart) {
  const freeShippingGap = Math.max(0, cartThresholds.freeShipping - cart.total_price);
  const freeGiftGap = Math.max(0, cartThresholds.freeGift - cart.total_price);
  const progressPercent = Math.min(100, (cart.total_price / cartThresholds.freeGift) * 100);

  if (drawerHeading) {
    drawerHeading.textContent = cart.item_count
      ? `You have ${cart.item_count} collector pick${cart.item_count === 1 ? '' : 's'} ready`
      : 'Your drop is almost locked in';
  }

  if (drawerCount) {
    drawerCount.textContent = `${cart.item_count} item${cart.item_count === 1 ? '' : 's'}`;
  }

  if (drawerProgressLabel) {
    drawerProgressLabel.textContent = freeGiftGap > 0
      ? `${Math.round(progressPercent)}% to your free gift`
      : 'Free gift unlocked';
  }

  if (drawerProgressFill) drawerProgressFill.style.width = `${progressPercent}%`;

  if (drawerProgressCopy) {
    if (freeShippingGap > 0) {
      drawerProgressCopy.textContent = `Add ${formatMoney(freeShippingGap, cart.currency || 'USD')} more for free shipping, then ${formatMoney(freeGiftGap, cart.currency || 'USD')} more unlocks the collector gift.`;
    } else if (freeGiftGap > 0) {
      drawerProgressCopy.textContent = `Free shipping unlocked. Add ${formatMoney(freeGiftGap, cart.currency || 'USD')} more to score the collector gift.`;
    } else {
      drawerProgressCopy.textContent = 'Free shipping and the collector gift are both unlocked. This is the perfect checkout moment.';
    }
  }
}

function renderCartDrawer(cart) {
  if (!drawerItems || !drawerTotal) return;

  drawerTotal.textContent = formatMoney(cart.total_price, cart.currency || 'USD');
  renderCartProgress(cart);

  if (!cart.items.length) {
    drawerItems.innerHTML = '<div class="drawer-note text-muted"><p>Your cart is empty. Add a product to preview the shared add-to-cart flow.</p></div>';
    return;
  }

  drawerItems.innerHTML = cart.items.slice(0, 4).map((item) => {
    const title = escapeHtml(item.product_title || item.title);
    const variantLabel = escapeHtml(getItemVariantLabel(item));
    const image = item.image ? `<img src="${escapeHtml(item.image)}" alt="${title}">` : '';

    return `
      <article class="drawer-item">
        <div class="drawer-thumb">${image}</div>
        <div>
          <div class="drawer-item-row"><strong>${title}</strong><span>${formatMoney(item.final_line_price, cart.currency || 'USD')}</span></div>
          <div class="text-muted">Qty ${item.quantity}${variantLabel ? ` • ${variantLabel}` : ''}</div>
        </div>
      </article>
    `;
  }).join('');
}

async function refreshCartDrawer(openDrawer = false) {
  if (!drawerItems || !cartApi) return;
  try {
    const cart = await cartApi.getCart();
    renderDrawerThresholdCopy(cart.currency || 'USD');
    renderCartDrawer(cart);
    if (openDrawer) setCartDrawerState(true);
  } catch (error) {
    console.warn('Cart drawer refresh failed', error);
  }
}

async function submitCartRequest({ form, openDrawer = true }) {
  const submitButton = form?.querySelector('[type="submit"]');
  const originalLabel = submitButton?.textContent;

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Adding…';
  }

  try {
    const formData = form ? new FormData(form) : null;
    await cartApi.addItem({ formData });
    await refreshCartDrawer(openDrawer);
  } catch (error) {
    console.warn('Shared add-to-cart failed', error);
    if (storefront.config.mode === 'shopify_live' && form) {
      form.submit();
      return;
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel || 'Add to cart';
    }
  }
}

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-menu-toggle]')) {
    setMobileMenuState(mobileMenu?.hidden !== false);
    return;
  }

  if (event.target.closest('[data-menu-close]') || event.target.closest('[data-menu-link]')) {
    setMobileMenuState(false);
  }

  if (event.target.closest('[data-cart-toggle]')) {
    setMobileMenuState(false);
    refreshCartDrawer(true);
    return;
  }

  if (event.target.closest('[data-cart-close]')) {
    setCartDrawerState(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  setMobileMenuState(false);
  setCartDrawerState(false);
});

document.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-product-form]');
  if (!form || !cartApi) return;
  event.preventDefault();
  submitCartRequest({ form, openDrawer: true });
});

renderDrawerThresholdCopy(storefrontConfig.currency || storefront.config.currency || 'USD');

if (storefront.config.mode === 'shopify_live') {
  refreshCartDrawer(false);
}
