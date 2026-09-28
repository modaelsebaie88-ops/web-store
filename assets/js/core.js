/* ==========================================================================
   mawjat - core
   Namespace, utilities, persistent state (cart / wishlist / prefs), events.
   Plain script (no modules) so the site also runs straight off the filesystem.
   ========================================================================== */
window.MAWJAT = window.MAWJAT || {};

(function (M) {
  'use strict';

  /* ---------------------------------------------------------------- store */
  var memory = {};
  var storage = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        if (raw === null) return key in memory ? memory[key] : fallback;
        return JSON.parse(raw);
      } catch (e) {
        return key in memory ? memory[key] : fallback;
      }
    },
    set: function (key, value) {
      memory[key] = value;
      try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    }
  };

  /* --------------------------------------------------------------- events */
  var bus = {};
  function on(name, fn) { (bus[name] = bus[name] || []).push(fn); return fn; }
  function emit(name, detail) {
    (bus[name] || []).forEach(function (fn) { try { fn(detail); } catch (e) { console.error(e); } });
  }

  /* ------------------------------------------------------------ utilities */
  var seq = 0;
  function uid(prefix) { seq += 1; return (prefix || 'u') + seq.toString(36) + Math.floor(Math.random() * 1e4).toString(36); }

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait || 160);
    };
  }

  function hexToRgb(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(function (v) {
      return clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
    }).join('');
  }
  /** amount: -1 = toward black, +1 = toward white */
  function shade(hex, amount) {
    var c = hexToRgb(hex), target = amount < 0 ? 0 : 255, p = Math.abs(amount);
    return rgbToHex(c[0] + (target - c[0]) * p, c[1] + (target - c[1]) * p, c[2] + (target - c[2]) * p);
  }
  function mix(a, b, t) {
    var x = hexToRgb(a), y = hexToRgb(b);
    return rgbToHex(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t);
  }
  /** Perceived luminance 0-1, used to pick readable ink on a swatch. */
  function luma(hex) {
    var c = hexToRgb(hex).map(function (v) {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function param(name, fallback) {
    try {
      var v = new URLSearchParams(window.location.search).get(name);
      return v === null ? fallback : v;
    } catch (e) { return fallback; }
  }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* -------------------------------------------------------------- currency */
  var CURRENCIES = {
    USD: { code: 'USD', symbol: '$', rate: 1, decimals: 2 },
    EGP: { code: 'EGP', symbol: 'EGP', rate: 48.6, decimals: 0 }
  };
  var currencyCode = storage.get('mawjat.currency', 'EGP');
  if (!CURRENCIES[currencyCode]) currencyCode = 'EGP';

  function currency() { return CURRENCIES[currencyCode]; }

  function setCurrency(code) {
    if (!CURRENCIES[code] || code === currencyCode) return;
    currencyCode = code;
    storage.set('mawjat.currency', code);
    emit('currency:change', currency());
  }

  /** Format a base (USD) amount in the active currency. */
  function money(usd) {
    var c = currency(), value = usd * c.rate;
    var whole = Math.abs(value % 1) < 0.005;
    var str = value.toLocaleString('en-US', {
      minimumFractionDigits: whole ? 0 : c.decimals,
      maximumFractionDigits: c.decimals
    });
    return c.code === 'EGP' ? c.symbol + ' ' + str : c.symbol + str;
  }

  /* ----------------------------------------------------------------- theme */
  var theme = storage.get('mawjat.theme', null);
  function applyTheme(next, persist) {
    theme = next;
    if (next) document.documentElement.setAttribute('data-theme', next);
    else document.documentElement.removeAttribute('data-theme');
    if (persist) storage.set('mawjat.theme', next);
    emit('theme:change', next);
  }
  function currentTheme() {
    if (theme) return theme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() { applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true); }
  if (theme) applyTheme(theme, false);

  /* ------------------------------------------------------------------ cart */
  var CART_KEY = 'mawjat.cart.v1';
  var cartItems = storage.get(CART_KEY, []);
  if (!Array.isArray(cartItems)) cartItems = [];

  function lineKey(id, size, colorway) { return [id, size || '-', colorway || '-'].join('~'); }
  function persistCart() { storage.set(CART_KEY, cartItems); emit('cart:change', cart.summary()); }

  var cart = {
    items: function () { return cartItems.slice(); },
    /** Hydrated lines: stored cart rows joined with the catalogue. */
    lines: function () {
      return cartItems.map(function (it) {
        var product = M.data ? M.data.byId(it.id) : null;
        if (!product) return null;
        var way = M.data.colorway(product, it.colorway);
        return {
          key: it.key, id: it.id, qty: it.qty, size: it.size,
          colorway: way, product: product, price: product.price,
          total: product.price * it.qty
        };
      }).filter(Boolean);
    },
    add: function (id, opts) {
      opts = opts || {};
      var qty = Math.max(1, parseInt(opts.qty, 10) || 1);
      var key = lineKey(id, opts.size, opts.colorway);
      var found = cartItems.filter(function (i) { return i.key === key; })[0];
      if (found) found.qty = clamp(found.qty + qty, 1, 99);
      else cartItems.push({ key: key, id: id, size: opts.size || null, colorway: opts.colorway || null, qty: qty });
      persistCart();
      return key;
    },
    setQty: function (key, qty) {
      qty = parseInt(qty, 10) || 0;
      if (qty <= 0) { cart.remove(key); return; }
      cartItems.forEach(function (i) { if (i.key === key) i.qty = clamp(qty, 1, 99); });
      persistCart();
    },
    remove: function (key) {
      cartItems = cartItems.filter(function (i) { return i.key !== key; });
      persistCart();
    },
    clear: function () { cartItems = []; persistCart(); },
    count: function () { return cartItems.reduce(function (n, i) { return n + i.qty; }, 0); },
    subtotal: function () { return cart.lines().reduce(function (n, l) { return n + l.total; }, 0); },
    summary: function () { return { count: cart.count(), subtotal: cart.subtotal() }; }
  };

  /* -------------------------------------------------------------- wishlist */
  var WISH_KEY = 'mawjat.wishlist.v1';
  var wishIds = storage.get(WISH_KEY, []);
  if (!Array.isArray(wishIds)) wishIds = [];

  var wishlist = {
    ids: function () { return wishIds.slice(); },
    has: function (id) { return wishIds.indexOf(id) > -1; },
    toggle: function (id) {
      var added = !wishlist.has(id);
      wishIds = added ? wishIds.concat([id]) : wishIds.filter(function (x) { return x !== id; });
      storage.set(WISH_KEY, wishIds);
      emit('wish:change', { count: wishIds.length, id: id, added: added });
      return added;
    },
    remove: function (id) { if (wishlist.has(id)) wishlist.toggle(id); },
    count: function () { return wishIds.length; },
    products: function () {
      return wishIds.map(function (id) { return M.data ? M.data.byId(id) : null; }).filter(Boolean);
    }
  };

  /* ------------------------------------------------------- promos + totals */
  var PROMOS = {
    WAVE10: { type: 'percent', value: 0.10, label: '10% off your order' },
    SALT15: { type: 'percent', value: 0.15, label: '15% off your order' },
    FREESHIP: { type: 'shipping', value: 0, label: 'Free shipping' }
  };
  /* Prices are all-in: tax is included and standard shipping is free, so a
     single hat checks out at exactly its sticker price. Only the optional
     faster delivery methods add a shipping charge. */
  function totals(promoCode, shippingRate) {
    var subtotal = cart.subtotal();
    var promo = promoCode ? PROMOS[String(promoCode).toUpperCase()] : null;
    var discount = promo && promo.type === 'percent' ? subtotal * promo.value : 0;
    var base = shippingRate == null ? 0 : shippingRate;
    var shipping = promo && promo.type === 'shipping' ? 0 : base;
    return {
      subtotal: subtotal, discount: discount, shipping: shipping,
      total: Math.max(0, subtotal - discount + shipping),
      promo: promo, promoCode: promo ? String(promoCode).toUpperCase() : null
    };
  }

  /* ---------------------------------------------------------------- export */
  M.util = {
    uid: uid, clamp: clamp, debounce: debounce, shade: shade, mix: mix, luma: luma,
    esc: esc, qs: qs, qsa: qsa, param: param, reducedMotion: reducedMotion, storage: storage
  };
  M.on = on;
  M.emit = emit;
  M.cart = cart;
  M.wishlist = wishlist;
  M.totals = totals;
  M.promos = PROMOS;
  M.money = money;
  M.currency = currency;
  M.setCurrency = setCurrency;
  M.currencies = CURRENCIES;
  M.theme = { current: currentTheme, toggle: toggleTheme, set: applyTheme };
})(window.MAWJAT);
