# Project Status

## Current stage
Toybeta is in a **stabilized MVP theme scaffold** stage.

The repo now has:
- A maintainable Shopify theme baseline for home, collection, and product pages
- A local static preview path (`preview.html`) for fast review without Shopify access
- A live Shopify mode in `layout/theme.liquid` using the same cart entry point
- Product-page add-on merchandising that works in manual mode now and can later switch to product metafields
- Homepage/content sections that make the demo feel more like a launch-ready merchandising theme instead of a bare scaffold

## What was organized in this cleanup pass
### Theme/product merchandising work already present in the diff
- Shared storefront mode bootstrap via `assets/storefront-config.js`
- Local preview experience via `preview.html` and `assets/preview.js`
- Cart drawer shell and shared cart hooks in `layout/theme.liquid` and `assets/theme.js`
- Product page upsell/add-on structure in `sections/main-product.liquid`
- Theme settings for cart thresholds and default add-on metafield keys
- New homepage storytelling / campaign / merchandising sections
- Template updates for homepage and product page defaults

### Documentation/stabilization work added in this pass
- README rewritten as the main operator guide
- Admin handoff checklist expanded with preview/live validation notes
- This status file added so a future handoff can quickly understand project maturity and next work

## Operating modes
### 1) Local preview mode
Use when reviewing layout, copy direction, section flow, and cart interactions without Shopify.

Files involved:
- `preview.html`
- `assets/preview.js`
- `assets/storefront-config.js`

Behavior:
- Uses mock catalog data
- Uses local in-memory cart state
- Good for design review and stakeholder walkthroughs
- Not a substitute for real Shopify product, cart, or metafield testing

### 2) Shopify live mode
Use when the code is uploaded to a Shopify theme.

Files involved:
- `layout/theme.liquid`
- `assets/storefront-config.js`
- `assets/theme.js`

Behavior:
- Uses Shopify product/cart context
- Uses Ajax cart endpoints
- Supports real section settings and future metafield wiring

## What still needs real Shopify admin access
- Create and assign actual add-on/accessory products
- Create the product reference metafield definition
- Populate metafields on target products
- Validate product page add-on behavior against live catalog data
- Confirm collection filters/sorting strategy in the target store setup
- Replace placeholder merchandising copy with final brand content

## Recommended next work
1. Verify the theme in an actual Shopify dev store
2. Replace placeholder/manual add-on cards with real product references where needed
3. Decide whether the cart drawer should stay lightweight or become a fuller Ajax cart experience
4. Tighten collection filtering/sorting and product gallery behavior
5. Finalize brand copy, imagery, and launch campaign content

## Maintenance note
If more feature work starts from here, keep future commits split into:
- theme behavior
- content/templates
- docs/handoff

That will make later handoff and rollback much easier.
