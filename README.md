# Shopify Toybeta MVP Theme

A lightweight Shopify theme scaffold inspired by toybeta.com, aimed at collectible toys, blind boxes, and factory-facing ecommerce demos.

## Included
- `layout/theme.liquid` base layout with header/footer groups
- Reusable homepage sections: hero, featured collection, feature columns, testimonials, newsletter
- Collection template with banner, filter/sidebar placeholder, and product grid
- Product template with gallery, variant selectors, add-to-cart form, and recommendations
- Basic theme settings, styles, and small JS helper for quantity input

## Structure
- `assets/` global CSS and JS
- `config/` starter theme settings
- `sections/` reusable Shopify sections plus section groups
- `snippets/` product card partials
- `templates/` JSON templates for home, collection, and product pages

## Setup
1. Create a Shopify theme locally, for example with Shopify CLI: `shopify theme init` or upload this folder as a custom theme.
2. Copy these files into the theme, or connect the repo directly if you already have a theme dev workflow.
3. In Shopify admin, assign menus, upload brand imagery, and choose collections in the featured sections.
4. Replace placeholder testimonials, copy, and colors with real brand content.
5. Connect Search & Discovery filters, metafields, and real product media once store data is available.

## Good next steps
- Add cart drawer / AJAX cart behavior
- Wire storefront filtering and sorting on collections
- Add variant media switching and richer gallery behavior
- Add schema-driven promo blocks for limited drops and preorder messaging
- Tune typography and spacing against the real brand kit
