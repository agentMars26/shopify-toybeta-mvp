(function () {
  const globalConfig = window.TOYBETA_STOREFRONT_CONFIG || {};
  const pageMode = document.documentElement.dataset.storefrontMode;
  const mode = globalConfig.mode || pageMode || 'shopify_live';

  function formatMoneyFromCents(cents, currency) {
    return (Number(cents || 0) / 100).toLocaleString(undefined, {
      style: 'currency',
      currency: currency || 'USD'
    });
  }

  function createPreviewCartApi() {
    const state = {
      currency: globalConfig.currency || 'USD',
      items: Array.isArray(globalConfig.previewCartItems) ? [...globalConfig.previewCartItems] : []
    };
    const listeners = new Set();

    function snapshot() {
      const items = state.items.map((item) => {
        const quantity = Math.max(0, Number(item.quantity || 0));
        const unitPrice = Number(item.unitPrice || 0);
        return {
          ...item,
          quantity,
          unitPrice,
          final_line_price: unitPrice * quantity
        };
      }).filter((item) => item.quantity > 0);

      const item_count = items.reduce((sum, item) => sum + item.quantity, 0);
      const total_price = items.reduce((sum, item) => sum + item.final_line_price, 0);

      return {
        currency: state.currency,
        item_count,
        total_price,
        items
      };
    }

    function emit() {
      const cart = snapshot();
      listeners.forEach((listener) => listener(cart));
      return cart;
    }

    function upsertItem(payload) {
      const itemKey = payload.key || `${payload.id}:${payload.variantTitle || payload.title || ''}`;
      const existing = state.items.find((item) => item.key === itemKey);

      if (existing) {
        existing.quantity += payload.quantity;
        existing.unitPrice = payload.unitPrice;
        existing.variantTitle = payload.variantTitle || existing.variantTitle;
        existing.image = payload.image || existing.image;
        existing.bg = payload.bg || existing.bg;
      } else {
        state.items.push({ ...payload, key: itemKey });
      }

      return emit();
    }

    return {
      mode: 'local_preview',
      subscribe(listener) {
        listeners.add(listener);
        listener(snapshot());
        return () => listeners.delete(listener);
      },
      getCart() {
        return Promise.resolve(snapshot());
      },
      addItem(payload) {
        return Promise.resolve(upsertItem({ ...payload, quantity: Math.max(1, Number(payload.quantity || 1)) }));
      },
      updateItem(key, quantity) {
        state.items = state.items.map((item) => item.key === key ? { ...item, quantity: Math.max(0, Number(quantity || 0)) } : item);
        return Promise.resolve(emit());
      },
      removeItem(key) {
        state.items = state.items.filter((item) => item.key !== key);
        return Promise.resolve(emit());
      },
      formatMoney(cents, currency) {
        return formatMoneyFromCents(cents, currency || state.currency);
      }
    };
  }

  function createShopifyCartApi() {
    return {
      mode: 'shopify_live',
      async getCart() {
        const response = await fetch('/cart.js');
        if (!response.ok) throw new Error('Cart fetch failed');
        return response.json();
      },
      async addItem(payload) {
        const body = payload.formData || new FormData();
        if (!payload.formData) {
          body.set('id', payload.id);
          body.set('quantity', payload.quantity || 1);
        }
        body.set('sections', '');

        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body
        });

        if (!response.ok) throw new Error('Add to cart failed');
        await response.json();
        return this.getCart();
      },
      async updateItem(key, quantity) {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({ id: key, quantity })
        });
        if (!response.ok) throw new Error('Cart update failed');
        return response.json();
      },
      async removeItem(key) {
        return this.updateItem(key, 0);
      },
      formatMoney: formatMoneyFromCents
    };
  }

  const cartApi = mode === 'local_preview' ? createPreviewCartApi() : createShopifyCartApi();

  window.ToybetaStorefront = {
    config: {
      mode,
      currency: globalConfig.currency || 'USD'
    },
    cart: cartApi
  };
})();
