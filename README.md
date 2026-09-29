# mawjat — storefront

A bucket-hat e-commerce front end. Coastal editorial art direction, mobile-first,
no build step, no dependencies, no bitmap images.

Brand adapted from the *Mawjat* strategic plan: an Alexandria bucket-hat label
aimed at Gen Z, selling B2C online, with international expansion as the stated
goal (hence the USD/EGP switch).

## Run it

Open `index.html` in a browser. That is the whole setup — the site runs from the
filesystem.

To serve it over HTTP instead (recommended, and required if you later add
`fetch`-based features):

```
python -m http.server 8000
# or
npx serve .
```

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, product showcase, collections, story, lifestyle, reviews, newsletter |
| `shop.html` | Catalogue with faceted filtering, search, sort, URL state |
| `product.html` | Product detail — `product.html?id=ocean-blue&color=midnight-swell` |
| `checkout.html` | Three-step checkout with validation and confirmation |

## Structure

```
assets/
  css/main.css     Design tokens + every component, mobile-first
  js/core.js       State: cart, wishlist, currency, theme, totals, events
  js/data.js       The catalogue — products, colourways, collections, reviews
  js/art.js        SVG engine: hats, coastal scenes, tiles, avatars, hero
  js/ui.js         Shared chrome: drawers, quick view, search, toasts, cards
  js/home.js       Homepage composition
  js/shop.js       Faceted filtering and sort
  js/product.js    Detail page
  js/checkout.js   Checkout flow
  img/favicon.svg
```

Scripts are plain `<script>` tags in dependency order (`core → data → art → ui →
page`), not ES modules, so the site works over `file://` as well as HTTP.

### Why the images are SVG

Every product shot, lifestyle frame, collection tile and the hero are generated
at runtime from `art.js`. A hat render is a function of a **colourway**
(`crown`, `brim`, `motif`, `binding`) and a **motif** (`waves`, `coral`,
`shells`, `fish`, `palm`, `sunburst`, `rope`, `stripe`, `lighthouse`,
`minimal`); every other tone is derived. The whole site is ~310 KB, stays sharp
at any size, and a new colourway is four hex values.

## Adding a product

Append to `PRODUCTS` in `assets/js/data.js`:

```js
{
  id: 'north-swell',            // also the URL: product.html?id=north-swell
  name: 'North Swell',
  collection: 'ocean',          // ocean | coral | sunset | tropical | minimal
  price: HAT_PRICE,             // 399 EGP; stored as USD via egp()
  motif: 'waves',
  patch: 'tag',                 // 'tag' | 'circle' | 'none'
  badge: 'New',                 // or null
  rating: 4.8, reviewCount: 40,
  order: 13,                    // position under "Featured"
  released: '2026-09-01',       // drives the "Newest" sort
  tagline: 'One line for the card.',
  story: 'A paragraph for the detail page.',
  fabric: '12 oz cotton twill',
  colorways: [ way('Deep Navy', P.navy, P.navy, P.sandLight, P.sandLight) ],
  sizes: ['S/M', 'L/XL'],
  details: ['Bullet', 'Bullet']
}
```

Colour filter families are classified automatically from each swatch's hue and
lightness in `shop.js`, so nothing else needs updating.

## Behaviour worth knowing

- **Cart and wishlist** persist in `localStorage` (`mawjat.cart.v1`,
  `mawjat.wishlist.v1`) and fall back to memory if storage is blocked.
- **Currency** switches between USD and EGP; every price on the page re-renders.
- **Theme** follows the OS by default; the header toggle overrides and persists.
  Dark mode is a "night swim" palette, not an inverted greyscale.
- **Promo codes:** `WAVE10`, `SALT15`, `FREESHIP`. Free shipping over $80.
- **Card validation** is a real Luhn check plus an expiry check. Nothing is
  transmitted anywhere — the payment step says so on the page.
- **Keyboard:** `/` opens search, `Esc` closes any overlay, drawers and modals
  trap focus and restore it on close.

## Accessibility

Skip link, landmarks, labelled controls, `aria-pressed` on every toggle,
focus-visible rings, live regions for cart and search, focus trapping in
overlays, `prefers-reduced-motion` honoured (waves, marquees and reveals all
stop), 44 px+ touch targets, and no colour-only state.

## Tested

An end-to-end jsdom suite covered all four pages: rendering, cart and wishlist
mutation, quick view, search, currency and theme switching, faceted filtering
and sort, the product gallery and variant selection, and the full checkout
including validation failures and order confirmation. 83 checks, all passing.
The harness lives outside this directory; re-create it with jsdom if you want it
in CI.

## Known limits

- Checkout is a front-end demo: no payment provider, no order persistence.
- Product data is a static array, not a CMS or API.
- Reviews are fixture data.
