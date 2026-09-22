/* ==========================================================================
   mawjat — product detail
   ========================================================================== */
(function (M) {
  'use strict';

  var U = M.util, A = M.art, D = M.data, UI = M.ui;
  var qs = U.qs, qsa = U.qsa, esc = U.esc;

  var product, way, size, qty = 1, slide = 0;

  /* --------------------------------------------------------------- render */
  function renderGallery() {
    var main = qs('#gallery-main'), thumbs = qs('#gallery-thumbs');
    var t = UI.tints(way);
    var shots = A.gallery(product, way);

    main.style.setProperty('--c1', t.c1);
    main.style.setProperty('--c2', t.c2);
    main.innerHTML =
      (product.badge ? '<span class="pcard__badge gallery__badge">' + esc(product.badge) + '</span>' : '') +
      shots.map(function (s, i) {
        return '<div class="gallery__slide' + (i === slide ? ' is-on' : '') + '" role="group" ' +
          'aria-roledescription="slide" aria-label="' + esc(s.label) + ' view of ' + esc(product.name) + '">' +
          s.html + '</div>';
      }).join('');

    thumbs.innerHTML = shots.map(function (s, i) {
      return '<button class="gthumb" data-slide="' + i + '" aria-pressed="' + (i === slide) + '" ' +
        'aria-label="Show ' + esc(s.label) + ' view">' + s.html + '</button>';
    }).join('');
  }

  function renderInfo() {
    var coll = D.collection(product.collection);
    var host = qs('#pinfo');
    host.innerHTML = [
      '<div class="pinfo__head">',
        '<p class="eyebrow eyebrow--plain"><a href="shop.html?collection=' + coll.key + '" style="text-decoration:none">' + esc(coll.name) + '</a></p>',
        '<h1 class="d2">' + esc(product.name) + '</h1>',
        '<div class="pinfo__rating">' + UI.stars(product.rating) +
          '<span>' + product.rating.toFixed(1) + ' &middot; ' + product.reviewCount + ' reviews</span></div>',
        '<div class="pinfo__price"><strong data-usd="' + product.price + '">' + M.money(product.price) + '</strong>' +
          '<span class="small mute">or 3 &times; ' + M.money(product.price / 3) + ' interest free</span></div>',
      '</div>',

      '<p class="lede" style="font-size:var(--step-0)">' + esc(product.tagline) + '</p>',

      '<div class="pinfo__block">',
        '<div class="pinfo__blocktop"><span class="field__label">Colour</span>',
          '<span class="small mute" id="way-name">' + esc(way.name) + '</span></div>',
        '<div class="swatches" role="group" aria-label="Colourway">',
          product.colorways.map(function (w) {
            return '<button class="swatch swatch--lg" style="--sw:' + w.swatch + '" data-way="' + w.id + '" ' +
              'aria-pressed="' + (w.id === way.id) + '" aria-label="' + esc(w.name) + '"><span></span></button>';
          }).join(''),
        '</div>',
      '</div>',

      '<div class="pinfo__block">',
        '<div class="pinfo__blocktop"><span class="field__label">Size</span>',
          '<button class="tlink" style="font-size:var(--step--2)" data-size-guide>Size guide</button></div>',
        '<div class="opts" role="group" aria-label="Size">',
          product.sizes.map(function (s) {
            return '<button class="opt" data-size="' + esc(s) + '" aria-pressed="' + (s === size) + '">' + esc(s) + '</button>';
          }).join(''),
        '</div>',
        '<p class="small mute" id="size-note">' + sizeNote(size) + '</p>',
      '</div>',

      '<div class="pinfo__buy">',
        '<div class="qty">',
          '<button data-qty="-1" aria-label="Decrease quantity">' + UI.icon('minus') + '</button>',
          '<input type="number" id="qty" min="1" max="99" value="' + qty + '" aria-label="Quantity">',
          '<button data-qty="1" aria-label="Increase quantity">' + UI.icon('plus') + '</button>',
        '</div>',
        '<button class="btn btn--block" id="add">Add to bag</button>',
        '<button class="iconbtn iconbtn--wish" id="wish" aria-pressed="' + M.wishlist.has(product.id) + '" ' +
          'aria-label="Save ' + esc(product.name) + ' to wishlist">' + UI.icon('heart', '') + '</button>',
      '</div>',

      '<div class="trust">',
        '<p class="trust__row">' + UI.icon('truck') + '<span>Free worldwide shipping over ' + M.money(80) + ' &middot; 3–7 working days</span></p>',
        '<p class="trust__row">' + UI.icon('refresh') + '<span>30-day returns, no questions, return label included</span></p>',
        '<p class="trust__row">' + UI.icon('shield') + '<span>Two-year stitching guarantee on every hat</span></p>',
      '</div>',

      '<div class="acc">',
        accItem('The story', '<p>' + esc(product.story) + '</p>', true),
        accItem('Details &amp; construction',
          '<ul>' + product.details.map(function (d) { return '<li><span>' + esc(d) + '</span></li>'; }).join('') + '</ul>'),
        accItem('Fabric &amp; care',
          '<p><strong>' + esc(product.fabric) + '</strong></p>' +
          '<ul><li><span>Hand wash cold, or machine wash at 30&deg; on a gentle cycle</span></li>' +
          '<li><span>Reshape while damp and dry away from direct sun</span></li>' +
          '<li><span>Do not tumble dry, do not bleach</span></li></ul>'),
        accItem('Shipping &amp; returns',
          '<ul><li><span>Egypt: 1–3 working days</span></li>' +
          '<li><span>Europe &amp; Middle East: 3–6 working days</span></li>' +
          '<li><span>Rest of world: 5–10 working days</span></li>' +
          '<li><span>Free over ' + M.money(80) + '. Flat ' + M.money(6) + ' below that.</span></li></ul>'),
      '</div>'
    ].join('');
  }

  function accItem(title, inner, open) {
    var id = U.uid('acc');
    return '<div class="acc__item">' +
      '<h2><button class="acc__btn" aria-expanded="' + !!open + '" aria-controls="' + id + '">' +
        title + UI.icon('plus') + '</button></h2>' +
      '<div class="acc__panel" id="' + id + '" data-open="' + !!open + '">' +
        '<div class="acc__inner"><div>' + inner + '</div></div>' +
      '</div></div>';
  }

  function sizeNote(s) {
    if (s === 'S/M') return 'Fits head circumference 54–56 cm. True to size.';
    if (s === 'L/XL') return 'Fits head circumference 58–60 cm. True to size.';
    return 'Adjustable inner band, fits 54–60 cm.';
  }

  function renderReviews() {
    var mine = D.reviewsFor(product.id);
    var pool = mine.length ? mine : D.reviews.slice(0, 3);

    qs('#rev-summary').innerHTML = [
      '<div>',
        '<span class="revsum__score">' + product.rating.toFixed(1) + '</span>',
        UI.stars(product.rating),
        '<p class="small mute" style="margin-top:.4rem">Based on ' + product.reviewCount + ' reviews</p>',
      '</div>',
      '<div class="stack" style="gap:.5rem">',
        [5, 4, 3, 2, 1].map(function (n) {
          var pct = n === 5 ? 78 : n === 4 ? 16 : n === 3 ? 4 : n === 2 ? 1 : 1;
          return '<div class="revbar"><span>' + n + '&#9733;</span>' +
            '<span class="revbar__track"><span class="revbar__fill" style="width:' + pct + '%"></span></span>' +
            '<span>' + pct + '%</span></div>';
        }).join(''),
      '</div>',
      '<p class="small mute">96% of reviewers would buy again.</p>'
    ].join('');

    qs('#rev-list').innerHTML = pool.map(function (r) {
      return '<article class="revrow">' +
        '<div class="revrow__top">' +
          '<span class="avatar">' + A.avatar(r) + '</span>' +
          '<span><span class="rev__name">' + esc(r.name) + '</span>' +
          '<span class="rev__meta">' + esc(r.city) + '</span></span>' +
          '<span style="margin-left:auto">' + UI.stars(r.rating) + '</span>' +
        '</div>' +
        '<p class="rev__text">&ldquo;' + esc(r.text) + '&rdquo;</p>' +
        '<p class="rev__meta">Verified purchase &middot; ' + esc(r.handle) + '</p>' +
      '</article>';
    }).join('');
  }

  function syncBuybar() {
    qs('#bb-name').textContent = product.name;
    qs('#bb-price').textContent = M.money(product.price * qty) + ' · ' + way.name + ' · ' + size;
  }

  function fullRender() {
    renderGallery();
    renderInfo();
    syncBuybar();
  }

  /* --------------------------------------------------------------- wiring */
  function addToBag(source) {
    M.cart.add(product.id, { size: size, colorway: way.id, qty: qty });
    UI.toast({
      title: 'Added to bag',
      text: product.name + ' · ' + way.name + ' · ' + size + (qty > 1 ? ' · ×' + qty : ''),
      art: UI.lineArt(product, way),
      action: 'View bag',
      onAction: function () { UI.open(qs('#cart')); }
    });
    if (source !== 'bar') qs('#add').blur();
  }

  var booted = false;
  function init() {
    if (booted) return;
    booted = true;
    var id = U.param('id', '');
    product = D.byId(id) || D.products[0];
    way = D.colorway(product, U.param('color', ''));
    size = product.sizes[0];

    var coll = D.collection(product.collection);
    document.title = product.name + ' — ' + coll.name + ' bucket hat | mawjat';
    var meta = qs('meta[name="description"]');
    if (meta) meta.setAttribute('content', product.tagline);

    qs('#crumbs').innerHTML =
      '<a href="index.html">Home</a> <span aria-hidden="true">/</span> ' +
      '<a href="shop.html">Shop</a> <span aria-hidden="true">/</span> ' +
      '<a href="shop.html?collection=' + coll.key + '">' + esc(coll.name) + '</a> ' +
      '<span aria-hidden="true">/</span> <span>' + esc(product.name) + '</span>';

    fullRender();
    renderReviews();

    qs('#related').innerHTML = D.related(product, 4).map(function (p, i) {
      return '<div>' + UI.productCard(p, { scene: ['coast', 'sunset', 'surf', 'boat'][i % 4] }) + '</div>';
    }).join('');

    /* gallery */
    qs('#gallery-thumbs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-slide]');
      if (!b) return;
      slide = parseInt(b.dataset.slide, 10);
      qsa('.gallery__slide').forEach(function (s, i) { s.classList.toggle('is-on', i === slide); });
      qsa('[data-slide]').forEach(function (t, i) { t.setAttribute('aria-pressed', String(i === slide)); });
    });

    /* product info panel — all interactions delegated */
    qs('#pinfo').addEventListener('click', function (e) {
      var sw = e.target.closest('[data-way]');
      if (sw) {
        way = D.colorway(product, sw.dataset.way);
        slide = 0;
        fullRender();
        try { history.replaceState(null, '', '?id=' + product.id + '&color=' + way.id); } catch (err) {}
        return;
      }
      var sz = e.target.closest('[data-size]');
      if (sz) {
        size = sz.dataset.size;
        qsa('[data-size]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === sz)); });
        qs('#size-note').textContent = sizeNote(size);
        syncBuybar();
        return;
      }
      var step = e.target.closest('[data-qty]');
      if (step) {
        qty = U.clamp(qty + parseInt(step.dataset.qty, 10), 1, 99);
        qs('#qty').value = qty;
        syncBuybar();
        return;
      }
      if (e.target.closest('#wish')) {
        var on = M.wishlist.toggle(product.id);
        qs('#wish').setAttribute('aria-pressed', String(on));
        UI.toast({ title: on ? 'Saved' : 'Removed from saved', text: product.name, duration: 2400 });
        return;
      }
      if (e.target.closest('#add')) { addToBag(); return; }
      if (e.target.closest('[data-size-guide]')) {
        UI.toast({
          title: 'Size guide',
          text: 'S/M fits 54–56 cm. L/XL fits 58–60 cm. Measure around your head just above the ears.',
          duration: 7000
        });
        return;
      }
      var acc = e.target.closest('.acc__btn');
      if (acc) {
        var open = acc.getAttribute('aria-expanded') === 'true';
        acc.setAttribute('aria-expanded', String(!open));
        qs('#' + acc.getAttribute('aria-controls')).dataset.open = String(!open);
      }
    });

    qs('#pinfo').addEventListener('change', function (e) {
      if (!e.target.matches('#qty')) return;
      qty = U.clamp(parseInt(e.target.value, 10) || 1, 1, 99);
      e.target.value = qty;
      syncBuybar();
    });

    /* sticky buy bar */
    qs('#bb-add').addEventListener('click', function () { addToBag('bar'); });
    var buybar = qs('#buybar'), pinfo = qs('#pinfo');
    function onScroll() {
      var r = pinfo.getBoundingClientRect();
      buybar.classList.toggle('is-on', r.bottom < window.innerHeight * 0.6 || r.top > window.innerHeight);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    M.on('wish:change', function (d) {
      if (d.id !== product.id) return;
      var b = qs('#wish');
      if (b) b.setAttribute('aria-pressed', String(d.added));
    });
    M.on('reprice', function () { renderInfo(); syncBuybar(); renderReviews(); });

    var year = qs('#year');
    if (year) year.textContent = new Date().getFullYear();

    UI.observeReveals();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.MAWJAT);
