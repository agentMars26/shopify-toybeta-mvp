# Shopify Admin Handoff Checklist

This repo is now set up so the product-page add-on area works in two modes:
- Manual section blocks, fully previewable without admin access
- Product metafield mode, ready once Shopify admin access is available

## What to do in Shopify admin later

### 1) Create or confirm the real add-on products
- Create accessory / gift-wrap / packaging SKUs that should be sold as product-page add-ons.
- Make sure each add-on product has at least one sellable variant and featured image.

### 2) Create the product metafield definition
- Go to **Settings → Custom data → Products**.
- Add a metafield definition:
  - Namespace: `custom`
  - Key: `product_add_on`
  - Type: **Product reference**
- If a different namespace/key is preferred, update the section settings in the theme editor to match.

### 3) Populate the metafield on target products
- Open each hero product that should show a dynamic add-on.
- Assign the matching add-on product to `custom.product_add_on`.

### 4) Turn on metafield mode in the theme editor
- Open the product template using the **Main product** section.
- Change **Add-on source** from `Section blocks only` to `Product metafield with block fallback`.
- Verify the real add-on product card appears.

### 5) Validate cart behavior
- Test main product add-to-cart.
- Test add-on quick add from the product page.
- Confirm the Ajax drawer updates correctly.
- Confirm sold-out add-on variants disable the CTA as expected.

### 6) Optional merchandising cleanup
- Replace placeholder trust chips, benefit copy, and checklist items.
- Adjust free shipping / free gift thresholds in the section settings.
- Sync theme-level threshold defaults with live brand policy if needed.

## Preview mode vs live store validation
Use `preview.html` for layout review, messaging review, and quick stakeholder walkthroughs.

Do **not** treat preview mode as final validation for:
- real product data
- variant availability edge cases
- Shopify Ajax cart behavior
- money formatting rules
- metafield wiring

Those checks must happen in a Shopify dev store after upload.

## Suggested handoff flow for the next operator
1. Review `PROJECT_STATUS.md` for the current repo stage and known gaps.
2. Review `README.md` for preview/live workflow and file ownership notes.
3. Complete the Shopify admin steps above.
4. Upload/sync the theme to a Shopify dev store.
5. Validate product page add-ons, cart drawer behavior, and thresholds with real products.
6. Replace remaining placeholder copy and imagery before merchant-facing review.

## What remains blocked on admin access
- Creating the actual add-on products
- Defining and populating the product reference metafield
- Testing against live store products, prices, inventory, and currency formatting
- Verifying the final merchant workflow in Shopify theme editor against real catalog data
