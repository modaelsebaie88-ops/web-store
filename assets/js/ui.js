/* ==========================================================================
   mawjat — ui
   Shared chrome: overlay manager, cart + wishlist drawers, quick view,
   search, mobile menu, toasts, product cards, scroll reveals.
   The page chrome lives in the HTML; only the interactive overlays are
   injected here, because they are meaningless without JavaScript anyway.
   ========================================================================== */
(function (M) {
  'use strict';

  var U = M.util, A = M.art, D = M.data;
  var qs = U.qs, qsa = U.qsa, esc = U.esc;

  /* ----------------------------------------------------------------- icons */
  var I = {
    search: '<path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="m21 21-4.3-4.3"/>',
    bag: '<path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 3C19.5 15.4 12 20 12 20Z"/>',
    menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    arrow: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    eye: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',
    truck: '<path d="M2 7h12v10H2z"/><path d="M14 10h4l3 3v4h-7z"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 4v5h-5"/>',
    shield: '<path d="M12 3l7 3v5c0 4.3-2.9 8.2-7 10-4.1-1.8-7-5.7-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/>',
    filter: '<path d="M3 6h18M7 12h10M10 18h4"/>',
    star: '<path d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.6l1.1-6L3.4 9.4l6-.8L12 3Z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>',
    tiktok: '<path d="M15 4v10.2a3.8 3.8 0 1 1-3.2-3.76"/><path d="M15 4c.4 2.3 2 3.9 4.4 4.1"/>',
    pinterest: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5c-2 0-3.3 1.3-3.3 3 0 .8.3 1.6.9 2 .1.1.2 0 .2-.1l.2-.7c0-.1 0-.2-.1-.3a2 2 0 0 1-.4-1.2c0-1.4 1.1-2.6 2.8-2.6 1.5 0 2.4.9 2.4 2.2 0 1.7-.7 3.1-1.8 3.1-.6 0-1-.5-.9-1.1.2-.8.6-1.6.6-2.1 0-.5-.3-.9-.8-.9-.6 0-1.2.7-1.2 1.6 0 .6.2 1 .2 1l-.8 3.4c-.2 1 0 2.2 0 2.3l.1.1.1-.1c.1-.2.9-1.4 1.2-2.4l.4-1.5c.2.4.9.8 1.6.8 2.1 0 3.5-1.9 3.5-4.4 0-1.9-1.6-3.7-4-3.7Z" fill="currentColor" stroke="none"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>'
  };

  function icon(name, cls) {
    return '<svg class="' + (cls || 'icon') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      (I[name] || '') + '</svg>';
  }

  function stars(rating, cls) {
    var out = '<span class="stars ' + (cls || '') + '" role="img" aria-label="' + rating + ' out of 5 stars">';
    for (var i = 1; i <= 5; i++) {
      out += '<svg viewBox="0 0 24 24" class="' + (i <= Math.round(rating) ? '' : 'is-off') + '" aria-hidden="true">' + I.star + '</svg>';
    }
    return out + '</span>';
  }

  /* ------------------------------------------------- card backdrop tints */
  function tints(way) {
    return {
      c1: U.mix(way.crown, '#FFFFFF', 0.76),
      c2: U.mix(way.brim, '#FFFFFF', 0.52)
    };
  }

  function cardWaves(way) {
    var a = U.mix(way.crown, '#FFFFFF', 0.42);
    var b = U.mix(way.brim, '#FFFFFF', 0.24);
    return '<svg viewBox="0 0 2400 420" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<path d="' + A.wavePath(2400, 600, 34, 190, 420) + '" fill="' + a + '" opacity=".75"/>' +
      '<path d="' + A.wavePath(2400, 480, 28, 272, 420) + '" fill="' + b + '" opacity=".6"/>' +
      '</svg>';
  }

  /* ------------------------------------------------------- overlay manager */
  var openStack = [];
  var lastFocus = null;

  function scrim() { return qs('#scrim'); }

  function lockBody(lock) {
    document.body.classList.toggle('is-locked', lock);
  }

  function focusables(root) {
    return qsa('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', root)
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }

  function openOverlay(el, opts) {
    opts = opts || {};
    if (!el || el.classList.contains('is-open')) return;
    if (!openStack.length) lastFocus = document.activeElement;
    openStack.push(el);
    el.classList.add('is-open');
    el.removeAttribute('inert');
    if (opts.scrim !== false && scrim()) scrim().classList.add('is-open');
    lockBody(true);
    var trigger = opts.focus || focusables(el)[0];
    setTimeout(function () { if (trigger) trigger.focus({ preventScroll: true }); }, 60);
  }

  function closeOverlay(el) {
    el = el || openStack[openStack.length - 1];
    if (!el) return;
    openStack = openStack.filter(function (x) { return x !== el; });
    el.classList.remove('is-open');
    if (!openStack.length) {
      if (scrim()) scrim().classList.remove('is-open');
      lockBody(false);
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      lastFocus = null;
    }
  }

  function closeAll() { openStack.slice().reverse().forEach(closeOverlay); }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openStack.length) { e.preventDefault(); closeOverlay(); return; }
    if (e.key !== 'Tab' || !openStack.length) return;
    var top = openStack[openStack.length - 1];
    var f = focusables(top);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !top.contains(document.activeElement))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  /* ---------------------------------------------------------------- toasts */
  function toast(opts) {
    var host = qs('#toasts');
    if (!host) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML =
      (opts.art ? '<span class="toast__img">' + opts.art + '</span>' : '') +
      '<span class="toast__body"><strong>' + esc(opts.title) + '</strong>' +
      (opts.text ? '<span class="small">' + esc(opts.text) + '</span>' : '') + '</span>' +
      (opts.action ? '<a href="#" data-toast-act>' + esc(opts.action) + '</a>' : '');
    host.appendChild(el);
    var act = qs('[data-toast-act]', el);
    if (act) act.addEventListener('click', function (e) { e.preventDefault(); dismiss(); if (opts.onAction) opts.onAction(); });
    var t = setTimeout(dismiss, opts.duration || 4200);
    function dismiss() {
      clearTimeout(t);
      el.classList.add('is-out');
      setTimeout(function () { el.remove(); }, 420);
    }
  }

  /* ------------------------------------------------------------ chrome DOM */
  function chrome() {
    var wrap = document.createElement('div');
    wrap.innerHTML = [
      '<div class="scrim" id="scrim"></div>',

      /* ---- mobile menu */
      '<nav class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu">',
        '<div class="menu__top">',
          '<a href="index.html" class="header__logo" aria-label="mawjat home">' + A.logo() + '</a>',
          '<button class="iconbtn" data-close aria-label="Close menu">' + icon('close') + '</button>',
        '</div>',
        '<div class="menu__body">',
          '<ul class="menu__list">',
            '<li><a class="menu__link" href="shop.html" style="animation-delay:.06s">Shop all <span>12</span></a></li>',
            '<li><a class="menu__link" href="shop.html?collection=ocean" style="animation-delay:.12s">Ocean <span>01</span></a></li>',
            '<li><a class="menu__link" href="shop.html?collection=coral" style="animation-delay:.18s">Coral <span>02</span></a></li>',
            '<li><a class="menu__link" href="shop.html?collection=sunset" style="animation-delay:.24s">Sunset <span>03</span></a></li>',
            '<li><a class="menu__link" href="shop.html?collection=tropical" style="animation-delay:.3s">Tropical <span>04</span></a></li>',
            '<li><a class="menu__link" href="shop.html?collection=minimal" style="animation-delay:.36s">Minimal Coast <span>05</span></a></li>',
            '<li><a class="menu__link" href="index.html#story" style="animation-delay:.42s">Our story <span>&mdash;</span></a></li>',
          '</ul>',
        '</div>',
        '<div class="menu__foot">',
          '<div class="menu__row">',
            '<span class="eyebrow eyebrow--plain">Currency</span>',
            '<div class="cluster" role="group" aria-label="Currency">',
              '<button class="chip" data-currency="USD">USD</button>',
              '<button class="chip" data-currency="EGP">EGP</button>',
            '</div>',
          '</div>',
          '<div class="menu__row">',
            '<span class="eyebrow eyebrow--plain">Appearance</span>',
            '<button class="chip" data-theme-toggle>Night swim</button>',
          '</div>',
          '<div class="menu__row">',
            '<span class="eyebrow eyebrow--plain">Follow</span>',
            '<div class="social">',
              '<a href="#" aria-label="Instagram">' + icon('instagram') + '</a>',
              '<a href="#" aria-label="TikTok">' + icon('tiktok') + '</a>',
              '<a href="#" aria-label="Pinterest">' + icon('pinterest') + '</a>',
            '</div>',
          '</div>',
        '</div>',
      '</nav>',

      /* ---- search */
      '<div class="search" id="search" role="dialog" aria-modal="true" aria-label="Search products">',
        '<div class="search__inner">',
          '<div style="display:flex;justify-content:flex-end;padding-top:.4rem">',
            '<button class="iconbtn" data-close aria-label="Close search">' + icon('close') + '</button>',
          '</div>',
          '<div class="search__bar">',
            icon('search'),
            '<input type="search" class="search__input" id="search-input" placeholder="Search hats, colours, collections" ',
              'autocomplete="off" aria-label="Search" aria-describedby="search-meta">',
          '</div>',
          '<p class="search__meta" id="search-meta" role="status">Try “coral”, “navy” or “sunset”</p>',
          '<div class="search__suggest" id="search-suggest"></div>',
          '<div class="search__results" id="search-results"></div>',
        '</div>',
      '</div>',

      /* ---- cart */
      '<aside class="drawer" id="cart" role="dialog" aria-modal="true" aria-label="Shopping bag">',
        '<div class="drawer__head">',
          '<h2 class="drawer__title">Your bag <span id="cart-n">0</span></h2>',
          '<button class="iconbtn" data-close aria-label="Close bag">' + icon('close') + '</button>',
        '</div>',
        '<div class="drawer__body" id="cart-body"></div>',
        '<div class="drawer__foot" id="cart-foot" hidden>',
          '<div class="ship">',
            '<div class="ship__bar"><div class="ship__fill" id="ship-fill"></div></div>',
            '<p class="ship__txt" id="ship-txt"></p>',
          '</div>',
          '<div class="totals">',
            '<div class="totals__row totals__row--big"><span>Subtotal</span><span id="cart-sub" class="num">—</span></div>',
          '</div>',
          '<a class="btn btn--block" href="checkout.html">Checkout ' + icon('arrow', 'icon btn__arrow') + '</a>',
          '<p class="small mute" style="text-align:center">Shipping and taxes calculated at checkout.</p>',
        '</div>',
      '</aside>',

      /* ---- wishlist */
      '<aside class="drawer" id="wish" role="dialog" aria-modal="true" aria-label="Wishlist">',
        '<div class="drawer__head">',
          '<h2 class="drawer__title">Saved <span id="wish-n">0</span></h2>',
          '<button class="iconbtn" data-close aria-label="Close wishlist">' + icon('close') + '</button>',
        '</div>',
        '<div class="drawer__body" id="wish-body"></div>',
      '</aside>',

      /* ---- quick view */
      '<div class="modal" id="qv" role="dialog" aria-modal="true" aria-labelledby="qv-name">',
        '<div class="modal__panel">',
          '<button class="iconbtn modal__close" data-close aria-label="Close quick view">' + icon('close') + '</button>',
          '<div class="qv" id="qv-body"></div>',
        '</div>',
      '</div>',

      /* ---- toasts + sticky cart */
      '<div class="toasts" id="toasts" aria-live="polite" aria-atomic="false"></div>',
      '<button class="fab countbtn" id="fab" aria-label="Open bag">' + icon('bag') +
        '<span class="countbtn__n" id="fab-n">0</span></button>'
    ].join('');

    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    qs('#scrim').addEventListener('click', closeAll);
    qsa('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () { closeOverlay(b.closest('.drawer,.modal,.menu,.search,.sheet')); });
    });
    qs('#fab').addEventListener('click', function () { openOverlay(qs('#cart')); });
  }

  /* ------------------------------------------------------------ cart view */
  function lineArt(product, way) {
    return A.hat(way, product.motif, 'none', { shadow: false });
  }

  function renderCart() {
    var body = qs('#cart-body'), foot = qs('#cart-foot');
    if (!body) return;
    var lines = M.cart.lines();
    var n = M.cart.count();
    qs('#cart-n').textContent = n ? n + (n === 1 ? ' item' : ' items') : '';

    if (!lines.length) {
      foot.hidden = true;
      body.innerHTML =
        '<div class="empty">' +
          '<div class="empty__art">' + A.mark({ color: 'var(--turq)' }) + '</div>' +
          '<p class="d4">Nothing in the bag yet.</p>' +
          '<p class="mute small">The water is warm. Go and find something.</p>' +
          '<a class="btn" href="shop.html">Shop hats</a>' +
        '</div>';
      return;
    }

    foot.hidden = false;
    body.innerHTML = lines.map(function (l) {
      return '<article class="line" data-key="' + esc(l.key) + '">' +
        '<div class="line__img">' + lineArt(l.product, l.colorway) + '</div>' +
        '<div class="line__body">' +
          '<a class="line__name" href="product.html?id=' + l.id + '">' + esc(l.product.name) + '</a>' +
          '<p class="line__meta">' + esc(l.colorway.name) + (l.size ? ' &middot; ' + esc(l.size) : '') + '</p>' +
          '<div class="line__tools">' +
            '<div class="qty qty--sm">' +
              '<button data-step="-1" aria-label="Decrease quantity of ' + esc(l.product.name) + '">' + icon('minus') + '</button>' +
              '<input type="number" min="1" max="99" value="' + l.qty + '" aria-label="Quantity of ' + esc(l.product.name) + '">' +
              '<button data-step="1" aria-label="Increase quantity of ' + esc(l.product.name) + '">' + icon('plus') + '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="line__side">' +
          '<span class="line__price num">' + M.money(l.total) + '</span>' +
          '<button class="line__x" data-remove>Remove</button>' +
        '</div>' +
      '</article>';
    }).join('');

    var t = M.totals();
    qs('#cart-sub').textContent = M.money(t.subtotal);
    var pct = Math.min(100, (t.subtotal / t.freeShippingAt) * 100);
    qs('#ship-fill').style.width = pct + '%';
    qs('#ship-txt').innerHTML = t.toFreeShipping > 0
      ? 'You are <strong>' + M.money(t.toFreeShipping) + '</strong> from free shipping.'
      : 'Free shipping unlocked.';
  }

  function wireCart() {
    var body = qs('#cart-body');
    if (!body) return;
    body.addEventListener('click', function (e) {
      var row = e.target.closest('[data-key]');
      if (!row) return;
      var key = row.dataset.key;
      if (e.target.closest('[data-remove]')) {
        var line = M.cart.lines().filter(function (l) { return l.key === key; })[0];
        M.cart.remove(key);
        if (line) toast({ title: 'Removed', text: line.product.name + ' left your bag.' });
        return;
      }
      var step = e.target.closest('[data-step]');
      if (step) {
        var input = qs('input', row);
        M.cart.setQty(key, parseInt(input.value, 10) + parseInt(step.dataset.step, 10));
      }
    });
    body.addEventListener('change', function (e) {
      var row = e.target.closest('[data-key]');
      if (row && e.target.matches('input')) M.cart.setQty(row.dataset.key, e.target.value);
    });
  }

  /* -------------------------------------------------------- wishlist view */
  function renderWish() {
    var body = qs('#wish-body');
    if (!body) return;
    var items = M.wishlist.products();
    qs('#wish-n').textContent = items.length ? items.length + (items.length === 1 ? ' item' : ' items') : '';

    if (!items.length) {
      body.innerHTML =
        '<div class="empty">' +
          '<div class="empty__art">' + A.mark({ color: 'var(--coral)' }) + '</div>' +
          '<p class="d4">No saves yet.</p>' +
          '<p class="mute small">Tap the heart on anything you want to come back to.</p>' +
          '<a class="btn btn--ghost" href="shop.html">Browse the range</a>' +
        '</div>';
      return;
    }

    body.innerHTML = items.map(function (p) {
      var way = p.colorways[0];
      return '<article class="line" data-id="' + p.id + '">' +
        '<div class="line__img">' + lineArt(p, way) + '</div>' +
        '<div class="line__body">' +
          '<a class="line__name" href="product.html?id=' + p.id + '">' + esc(p.name) + '</a>' +
          '<p class="line__meta">' + esc(way.name) + '</p>' +
          '<div class="line__tools">' +
            '<button class="btn btn--sm btn--ghost" data-wish-add>Add to bag</button>' +
          '</div>' +
        '</div>' +
        '<div class="line__side">' +
          '<span class="line__price num">' + M.money(p.price) + '</span>' +
          '<button class="line__x" data-wish-remove>Remove</button>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function wireWish() {
    var body = qs('#wish-body');
    if (!body) return;
    body.addEventListener('click', function (e) {
      var row = e.target.closest('[data-id]');
      if (!row) return;
      var p = D.byId(row.dataset.id);
      if (e.target.closest('[data-wish-remove]')) { M.wishlist.remove(p.id); return; }
      if (e.target.closest('[data-wish-add]')) {
        M.cart.add(p.id, { size: p.sizes[0], colorway: p.colorways[0].id, qty: 1 });
        toast({ title: 'Added to bag', text: p.name + ' · ' + p.colorways[0].name, art: lineArt(p, p.colorways[0]), action: 'View bag', onAction: function () { openOverlay(qs('#cart')); } });
      }
    });
  }

  /* ------------------------------------------------------------ quick view */
  var qvState = { product: null, way: null, size: null, qty: 1 };

  function openQuickView(id) {
    var p = D.byId(id);
    if (!p) return;
    qvState = { product: p, way: p.colorways[0], size: p.sizes[0], qty: 1 };
    renderQuickView();
    openOverlay(qs('#qv'));
  }

  function renderQuickView() {
    var p = qvState.product, way = qvState.way, t = tints(way);
    var body = qs('#qv-body');
    body.innerHTML = [
      '<div class="qv__media" style="--c1:' + t.c1 + ';--c2:' + t.c2 + '">',
        A.hat(way, p.motif, p.patch),
      '</div>',
      '<div class="qv__body">',
        '<div class="qv__head">',
          '<p class="eyebrow eyebrow--plain">' + esc(D.collection(p.collection).name) + '</p>',
          '<h2 class="d3" id="qv-name">' + esc(p.name) + '</h2>',
          '<div class="pinfo__rating">' + stars(p.rating) + '<span>' + p.rating.toFixed(1) + ' · ' + p.reviewCount + ' reviews</span></div>',
        '</div>',
        '<p class="mute">' + esc(p.tagline) + '</p>',
        '<p class="qv__price num">' + M.money(p.price) + '</p>',
        '<div class="pinfo__block">',
          '<div class="pinfo__blocktop"><span class="field__label">Colour</span><span class="small mute">' + esc(way.name) + '</span></div>',
          '<div class="swatches" role="group" aria-label="Colour">',
            p.colorways.map(function (w) {
              return '<button class="swatch" style="--sw:' + w.swatch + '" data-way="' + w.id + '" ' +
                'aria-pressed="' + (w.id === way.id) + '" aria-label="' + esc(w.name) + '"><span></span></button>';
            }).join(''),
          '</div>',
        '</div>',
        '<div class="pinfo__block">',
          '<span class="field__label">Size</span>',
          '<div class="opts" role="group" aria-label="Size">',
            p.sizes.map(function (s) {
              return '<button class="opt" data-size="' + esc(s) + '" aria-pressed="' + (s === qvState.size) + '">' + esc(s) + '</button>';
            }).join(''),
          '</div>',
        '</div>',
        '<div class="qv__actions">',
          '<button class="btn btn--block" data-qv-add>Add to bag — ' + M.money(p.price) + '</button>',
          '<button class="iconbtn iconbtn--wish" data-qv-wish aria-pressed="' + M.wishlist.has(p.id) + '" ',
            'aria-label="Save ' + esc(p.name) + '">' + icon('heart') + '</button>',
        '</div>',
        '<a class="tlink" href="product.html?id=' + p.id + '">Full details ' + icon('arrow') + '</a>',
      '</div>'
    ].join('');
  }

  function wireQuickView() {
    var modal = qs('#qv');
    if (!modal) return;
    modal.addEventListener('click', function (e) {
      if (e.target === modal) { closeOverlay(modal); return; }
      var p = qvState.product;
      if (!p) return;
      var sw = e.target.closest('[data-way]');
      if (sw) { qvState.way = D.colorway(p, sw.dataset.way); renderQuickView(); return; }
      var sz = e.target.closest('[data-size]');
      if (sz) {
        qvState.size = sz.dataset.size;
        qsa('[data-size]', modal).forEach(function (b) { b.setAttribute('aria-pressed', String(b === sz)); });
        return;
      }
      if (e.target.closest('[data-qv-wish]')) {
        var on = M.wishlist.toggle(p.id);
        e.target.closest('[data-qv-wish]').setAttribute('aria-pressed', String(on));
        return;
      }
      if (e.target.closest('[data-qv-add]')) {
        M.cart.add(p.id, { size: qvState.size, colorway: qvState.way.id, qty: 1 });
        closeOverlay(modal);
        toast({
          title: 'Added to bag', text: p.name + ' · ' + qvState.way.name + ' · ' + qvState.size,
          art: lineArt(p, qvState.way), action: 'View bag',
          onAction: function () { openOverlay(qs('#cart')); }
        });
      }
    });
  }

  /* ---------------------------------------------------------------- search */
  function wireSearch() {
    var panel = qs('#search'), input = qs('#search-input');
    if (!panel) return;
    var results = qs('#search-results'), meta = qs('#search-meta'), suggest = qs('#search-suggest');

    suggest.innerHTML = ['coral', 'navy', 'sunset', 'minimal', 'lighthouse', 'striped']
      .map(function (w) { return '<button class="chip" data-term="' + w + '">' + w + '</button>'; }).join('');

    function render(term) {
      var list = D.search(term);
      if (!term.trim()) {
        results.innerHTML = '';
        meta.textContent = 'Try “coral”, “navy” or “sunset”';
        suggest.hidden = false;
        return;
      }
      suggest.hidden = true;
      meta.textContent = list.length
        ? list.length + (list.length === 1 ? ' hat' : ' hats') + ' found'
        : 'Nothing matched “' + term + '”';
      results.innerHTML = list.slice(0, 8).map(function (p) {
        var way = p.colorways[0];
        return '<a class="sresult" href="product.html?id=' + p.id + '">' +
          '<span class="sresult__img">' + A.hat(way, p.motif, 'none', { shadow: false }) + '</span>' +
          '<span><span class="sresult__name">' + esc(p.name) + '</span>' +
          '<span class="sresult__sub">' + esc(D.collection(p.collection).name) + ' · ' + esc(way.name) + '</span></span>' +
          '<span class="num">' + M.money(p.price) + '</span></a>';
      }).join('');
    }

    input.addEventListener('input', U.debounce(function () { render(input.value); }, 130));
    suggest.addEventListener('click', function (e) {
      var b = e.target.closest('[data-term]');
      if (!b) return;
      input.value = b.dataset.term;
      render(input.value);
      input.focus();
    });
    panel.addEventListener('click', function (e) { if (e.target === panel) closeOverlay(panel); });
    M.ui.openSearch = function () { openOverlay(panel, { focus: input }); render(input.value); };
  }

  /* ---------------------------------------------------------------- header */
  function wireHeader() {
    var header = qs('.header');
    if (!header) return;
    var hero = qs('.hero');

    qsa('[data-open="menu"]').forEach(function (b) { b.addEventListener('click', function () { openOverlay(qs('#menu')); }); });
    qsa('[data-open="search"]').forEach(function (b) { b.addEventListener('click', function () { M.ui.openSearch(); }); });
    qsa('[data-open="cart"]').forEach(function (b) { b.addEventListener('click', function () { openOverlay(qs('#cart')); }); });
    qsa('[data-open="wish"]').forEach(function (b) { b.addEventListener('click', function () { openOverlay(qs('#wish')); }); });

    // currency + theme, wherever they appear
    document.addEventListener('click', function (e) {
      var cur = e.target.closest('[data-currency]');
      if (cur) { M.setCurrency(cur.dataset.currency); return; }
      if (e.target.closest('[data-theme-toggle]')) M.theme.toggle();
    });

    function syncUtil() {
      qsa('[data-currency]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.currency === M.currency().code));
      });
      var dark = M.theme.current() === 'dark';
      qsa('[data-theme-toggle]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(dark));
        b.setAttribute('aria-label', dark ? 'Switch to day' : 'Switch to night swim');
        if (b.classList.contains('iconbtn')) b.innerHTML = icon(dark ? 'sun' : 'moon');
      });
    }
    syncUtil();
    M.on('currency:change', function () { syncUtil(); repriceAll(); });
    M.on('theme:change', syncUtil);

    var fab = qs('#fab');
    var lastY = 0;
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle('is-stuck', y > 8);
      if (hero) header.classList.toggle('is-over', y < hero.offsetHeight - 120);
      if (fab) fab.classList.toggle('is-on', y > 520 && M.cart.count() > 0);
      lastY = y;
    }
    if (hero) header.classList.add('is-over');
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    M.on('cart:change', onScroll);
  }

  /** Re-render every money string on the page after a currency switch. */
  function repriceAll() {
    qsa('[data-usd]').forEach(function (el) {
      el.textContent = M.money(parseFloat(el.dataset.usd));
    });
    renderCart();
    renderWish();
    if (qvState.product && qs('#qv').classList.contains('is-open')) renderQuickView();
    M.emit('reprice');
  }

  /* ----------------------------------------------------------- badge counts */
  function syncBadges(bump) {
    var c = M.cart.count(), w = M.wishlist.count();
    qsa('[data-count="cart"]').forEach(function (el) {
      el.textContent = c;
      el.classList.toggle('is-on', c > 0);
      if (bump === 'cart' && c > 0) {
        el.classList.remove('is-bump');
        void el.offsetWidth;
        el.classList.add('is-bump');
      }
    });
    qsa('[data-count="wish"]').forEach(function (el) {
      el.textContent = w;
      el.classList.toggle('is-on', w > 0);
    });
  }

  /* ----------------------------------------------------------- product card */
  function productCard(p, opts) {
    opts = opts || {};
    var way = opts.way || p.colorways[0];
    var t = tints(way);
    var coll = D.collection(p.collection);
    return [
      '<article class="pcard reveal" data-id="' + p.id + '" data-way="' + way.id + '">',
        '<div class="pcard__media" style="--c1:' + t.c1 + ';--c2:' + t.c2 + '">',
          '<div class="pcard__bg">' + cardWaves(way) + '</div>',
          '<div class="pcard__scene" data-scene="' + esc(opts.scene || 'beach') + '"></div>',
          '<div class="pcard__hat">' + A.hat(way, p.motif, p.patch) + '</div>',
          (p.badge ? '<span class="pcard__badge">' + esc(p.badge) + '</span>' : ''),
          '<button class="pcard__wish" data-act="wish" aria-pressed="' + M.wishlist.has(p.id) + '" ',
            'aria-label="Save ' + esc(p.name) + ' to wishlist">' + icon('heart', '') + '</button>',
          '<a class="pcard__link" href="product.html?id=' + p.id + '"><span>View ' + esc(p.name) + '</span></a>',
          '<div class="pcard__dive">',
            '<button class="btn btn--light" data-act="add">Dive in</button>',
            '<button class="iconbtn" data-act="quick" aria-label="Quick view ' + esc(p.name) + '">' + icon('eye') + '</button>',
          '</div>',
        '</div>',
        '<div class="pcard__body">',
          '<div class="pcard__row">',
            '<h3 class="pcard__name">' + esc(p.name) + '</h3>',
            '<span class="pcard__price num" data-usd="' + p.price + '">' + M.money(p.price) + '</span>',
          '</div>',
          '<p class="pcard__desc">' + esc(p.tagline) + '</p>',
          '<div class="pcard__foot">',
            '<span class="pcard__ways" aria-label="' + p.colorways.length + ' colours">' +
              p.colorways.map(function (w) { return '<span class="pcard__way" style="--sw:' + w.swatch + '"></span>'; }).join('') +
            '</span>',
            '<span class="pcard__colorname">' + esc(coll.name) + '</span>',
          '</div>',
        '</div>',
      '</article>'
    ].join('');
  }

  /** Delegated card behaviour + lazy hover scenes. Call once per container. */
  function wireCards(root) {
    root = root || document;
    root.addEventListener('click', function (e) {
      var card = e.target.closest('.pcard');
      if (!card) return;
      var act = e.target.closest('[data-act]');
      if (!act) return;
      e.preventDefault();
      var p = D.byId(card.dataset.id);
      var way = D.colorway(p, card.dataset.way);

      if (act.dataset.act === 'wish') {
        var on = M.wishlist.toggle(p.id);
        act.setAttribute('aria-pressed', String(on));
        toast({ title: on ? 'Saved' : 'Removed from saved', text: p.name, duration: 2600 });
      } else if (act.dataset.act === 'quick') {
        openQuickView(p.id);
      } else if (act.dataset.act === 'add') {
        M.cart.add(p.id, { size: p.sizes[0], colorway: way.id, qty: 1 });
        toast({
          title: 'Added to bag', text: p.name + ' · ' + way.name,
          art: lineArt(p, way), action: 'View bag',
          onAction: function () { openOverlay(qs('#cart')); }
        });
      }
    });

    // Hover scenes cost real DOM, so they are built the first time they matter.
    function hydrate(e) {
      var card = e.target.closest ? e.target.closest('.pcard') : null;
      if (!card) return;
      var host = qs('.pcard__scene', card);
      if (!host || host.dataset.done) return;
      host.dataset.done = '1';
      var p = D.byId(card.dataset.id);
      host.innerHTML = A.scene(host.dataset.scene, D.colorway(p, card.dataset.way), { figure: false });
    }
    root.addEventListener('pointerenter', hydrate, true);
    root.addEventListener('focusin', hydrate);
  }

  /* --------------------------------------------------------------- reveals */
  function observeReveals(root) {
    var els = qsa('.reveal:not(.is-in)', root || document);
    if (!els.length) return;
    if (U.reducedMotion() || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var sibs = Array.prototype.slice.call(el.parentElement.children).indexOf(el);
        el.style.setProperty('--d', Math.min(sibs, 7) * 70 + 'ms');
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ boot */
  var booted = false;
  function boot() {
    if (booted) return;          // safe if the bundle is included twice
    booted = true;

    // Derive the page-level flags from what is actually on the page rather
    // than trusting a class on <body>, which some hosts rewrite.
    if (qs('.buybar')) document.body.classList.add('has-buybar');
    if (qs('#co-form') || qs('#co-empty')) document.body.classList.add('no-fab');
    if (qs('.hero')) document.body.classList.add('has-hero');

    A.injectDefs();
    chrome();
    wireHeader();
    wireCart();
    wireWish();
    wireQuickView();
    wireSearch();
    wireCards(document);
    renderCart();
    renderWish();
    syncBadges();
    observeReveals();

    M.on('cart:change', function () { renderCart(); syncBadges('cart'); });
    M.on('wish:change', function (d) {
      renderWish();
      syncBadges('wish');
      qsa('.pcard[data-id="' + d.id + '"] [data-act="wish"]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(d.added));
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        e.preventDefault();
        M.ui.openSearch();
      }
    });
  }

  M.ui = {
    icon: icon, stars: stars, tints: tints, cardWaves: cardWaves,
    productCard: productCard, wireCards: wireCards, observeReveals: observeReveals,
    toast: toast, open: openOverlay, close: closeOverlay, closeAll: closeAll,
    openQuickView: openQuickView, syncBadges: syncBadges, repriceAll: repriceAll,
    lineArt: lineArt, boot: boot
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.MAWJAT);
