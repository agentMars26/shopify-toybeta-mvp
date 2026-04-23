# Shopify Toybeta MVP Theme

A lightweight Shopify theme scaffold inspired by toybeta.com, aimed at collectible toys, blind boxes, and factory-facing ecommerce demos.

## Current stage
This repo is now in a **stabilized MVP scaffold** stage.

It includes:
- a stronger homepage/storytelling structure
- a product page with cart drawer and add-on merchandising patterns
- a local preview workflow that does not require Shopify access
- a live Shopify mode that reuses the same storefront/cart entry point
- handoff notes for future admin wiring

For a quick snapshot before more feature work, see `PROJECT_STATUS.md`.

## Included
- `assets/storefront-config.js` shared storefront mode bootstrap and cart entry point
- `preview.html` static preview shell for local review
- `assets/preview.js` mock catalog data plus local cart behavior for preview mode
- `layout/theme.liquid` Shopify live shell with cart drawer markup and shared config bootstrap
- Reusable homepage sections including hero, featured collection, launch story, campaign blocks, merchandising highlights, features, testimonials, and newsletter
- Collection template with banner, merchandising copy, filter/sidebar placeholder, and product grid
- Product template with gallery, variant selectors, add-to-cart form, threshold messaging, manual/metafield add-on support, and recommendations
- Theme settings for cart thresholds and default add-on metafield keys

## Repo structure
- `assets/` global CSS, cart helpers, preview logic, and shared storefront mode bootstrap
- `config/` starter theme settings and theme-editor defaults
- `layout/` Shopify theme shell
- `sections/` reusable Shopify sections plus merchandising/storytelling sections
- `snippets/` reusable product cards and placeholders
- `templates/` JSON templates for home, collection, and product pages
- `HANDOFF_ADMIN_CHECKLIST.md` merchant/admin setup tasks that still need Shopify access
- `PROJECT_STATUS.md` project maturity, constraints, and recommended next steps

## Local static preview workflow
Use this when you want to review direction quickly without a Shopify store.

1. Open Terminal and go to the project:
   ```bash
   cd /Users/mars/Documents/projects/shopify-toybeta-mvp
   ```
2. Start a simple local web server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open this URL in your browser:
   ```
   http://localhost:8000/preview.html
   ```
4. Stop the server with `Ctrl+C` when you're done.

Preview mode files:
- `preview.html`
- `preview-checkout.html`
- `assets/storefront-config.js`
- `assets/preview.js`
- `assets/preview-checkout.js`

Preview mode is good for:
- layout reviews
- copy and messaging review
- stakeholder walkthroughs
- quick interaction checks for cart, merchandising patterns, and a clearly fake checkout handoff

Preview mode is **not** a substitute for real Shopify validation of:
- products and variants
- Ajax cart edge cases
- metafields
- money formatting and store policies

## Storefront mode switching
The project uses a simple dual-mode setup:

- `local_preview`: used by `preview.html`, keeps add-to-cart local with mock cart state
- `shopify_live`: used by `layout/theme.liquid`, sends requests to Shopify Ajax cart endpoints

Where it is set:
- `preview.html` sets `window.TOYBETA_STOREFRONT_CONFIG.mode = 'local_preview'`
- `layout/theme.liquid` sets `window.TOYBETA_STOREFRONT_CONFIG.mode = 'shopify_live'`

Rule of thumb:
- use preview mode for presentation review and localhost demo checkout walkthroughs
- use Shopify live mode for commerce validation

The local preview cart now persists in browser storage so `preview.html` can hand off into `preview-checkout.html` without Shopify access.

## Shopify setup workflow
1. Create or connect a Shopify theme for this repo.
2. Upload or sync the files into the theme.
3. In Shopify admin, assign menus, collections, imagery, and final brand copy.
4. Validate cart drawer behavior and product-form behavior on a real product.
5. If using dynamic product add-ons, finish the metafield setup in `HANDOFF_ADMIN_CHECKLIST.md`.

## Handoff/admin notes
- `HANDOFF_ADMIN_CHECKLIST.md` covers the remaining Shopify admin steps for add-on products and metafields.
- The product template supports two add-on modes:
  - manual section blocks, usable immediately
  - product metafield with manual block fallback, for later admin wiring
- Theme-level defaults for cart thresholds and add-on metafield namespace/key now live in `config/settings_schema.json` and `config/settings_data.json`.

## Recommended commit hygiene from here
To keep maintenance easy, group future work into separate commits where possible:
- theme behavior and JS/Liquid changes
- template/content/default section updates
- docs and handoff notes

## Good next steps
- Validate the current scaffold in a Shopify dev store
- Replace manual add-on placeholders with real accessory products where needed
- Decide whether to keep the current lightweight cart drawer or expand it further
- Wire collection filtering/sorting against the actual store setup
- Tune product gallery behavior, typography, spacing, and final brand copy
- Replace preview-only mock assumptions once live store data is ready

## Safety note for maintainers
When changing storefront mode behavior, keep `assets/storefront-config.js` as the single shared entry point so preview and live logic do not drift apart.

When changing add-on behavior, update both:
- `templates/product.json`
- `HANDOFF_ADMIN_CHECKLIST.md`

That keeps the repo and merchant workflow aligned.

## Project origin
See `PROJECT_BRIEF.md` for the original MVP goal and scope.
