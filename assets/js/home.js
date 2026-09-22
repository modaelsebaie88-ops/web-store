/* ==========================================================================
   mawjat — homepage
   ========================================================================== */
(function (M) {
  'use strict';

  var U = M.util, A = M.art, D = M.data, UI = M.ui;
  var qs = U.qs, esc = U.esc;

  var booted = false;
  function init() {
    if (booted) return;
    booted = true;
    /* ------------------------------------------------------------- hero */
    var heroBg = qs('#hero-bg');
    if (heroBg) heroBg.innerHTML = A.hero();

    /* ----------------------------------------------------------- ticker */
    var ticker = qs('#ticker');
    if (ticker) {
      var words = ['Wear the wave', 'Salt in the seams', 'Made for sunny days',
                   'Take the ocean with you', 'Cut in Alexandria'];
      var run = '<span>' + words.map(function (w) {
        return esc(w) + A.mark({ color: 'currentColor' });
      }).join('') + '</span>';
      ticker.innerHTML = run + run;
    }

    /* -------------------------------------------------- product showcase */
    var rail = qs('#home-products');
    if (rail) {
      var scenes = ['beach', 'coast', 'sunset', 'surf', 'sunset', 'cafe'];
      rail.innerHTML = D.products.slice(0, 6).map(function (p, i) {
        return '<div role="listitem">' + UI.productCard(p, { scene: scenes[i] }) + '</div>';
      }).join('');
    }

    /* -------------------------------------------------------- collections */
    var tiles = qs('#home-collections');
    if (tiles) {
      tiles.innerHTML = D.collections.map(function (c) {
        return '<div class="reveal">' +
          '<a class="tile" href="shop.html?collection=' + c.key + '">' +
            A.collectionArt(c.art) +
            '<span class="tile__body">' +
              '<span class="tile__kicker">' + esc(c.kicker) + '</span>' +
              '<span class="tile__name">' + esc(c.name) + '</span>' +
              '<span class="tile__sub">' + esc(c.tagline) + '</span>' +
              '<span class="tile__go">Explore' +
                '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg>' +
              '</span>' +
            '</span>' +
          '</a></div>';
      }).join('');
    }

    /* -------------------------------------------------------------- story */
    var storyArt = qs('#story-art');
    if (storyArt) storyArt.insertAdjacentHTML('afterbegin', A.storyScene());

    /* ---------------------------------------------------------- lifestyle */
    var life = qs('#home-life');
    if (life) {
      life.innerHTML = D.lifestyle.map(function (l) {
        var p = D.byId(l.product);
        var way = p.colorways[0];
        return '<a class="life reveal" href="product.html?id=' + p.id + '">' +
          A.scene(l.key, way, { label: l.label + ' — wearing ' + p.name, pair: l.key === 'cafe' }) +
          '<span class="life__cap">' + esc(l.label) + '</span>' +
        '</a>';
      }).join('');
    }

    /* ------------------------------------------------------------ reviews */
    var revs = qs('#home-reviews');
    if (revs) {
      revs.innerHTML = D.reviews.map(function (r) {
        var p = D.byId(r.product);
        var way = p.colorways[0];
        return '<article class="rev reveal">' +
          '<div class="rev__photo">' +
            A.scene(r.scene, way, { label: r.name + ' wearing ' + p.name }) +
          '</div>' +
          '<div class="rev__top">' + UI.stars(r.rating) +
            '<a class="rev__item" href="product.html?id=' + p.id + '">' + esc(p.name) + '</a>' +
          '</div>' +
          '<p class="rev__text">&ldquo;' + esc(r.text) + '&rdquo;</p>' +
          '<div class="rev__who">' +
            '<span class="avatar">' + A.avatar(r) + '</span>' +
            '<span><span class="rev__name">' + esc(r.name) + '</span>' +
            '<span class="rev__meta">' + esc(r.handle) + ' &middot; ' + esc(r.city) + '</span></span>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    /* --------------------------------------------------------- newsletter */
    var waves = qs('#news-waves');
    if (waves) {
      waves.innerHTML = '<svg viewBox="0 0 2400 300" preserveAspectRatio="none" aria-hidden="true">' +
        '<path d="' + A.wavePath(2400, 600, 26, 130, 300) + '" fill="#1E5478" opacity=".6"/>' +
        '<path d="' + A.wavePath(2400, 480, 22, 196, 300) + '" fill="#153F5E"/>' +
        '<path d="' + A.waveLine(2400, 480, 22, 196) + '" fill="none" stroke="#9FD3D0" stroke-width="3" opacity=".4"/>' +
        '</svg>';
    }

    var form = qs('#news-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = qs('#news-email'), msg = qs('#news-msg');
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
        input.setAttribute('aria-invalid', String(!ok));
        if (!ok) { msg.textContent = 'That email does not look right — try again.'; input.focus(); return; }
        msg.textContent = 'You are on the list. Watch for the first swell.';
        input.value = '';
        input.removeAttribute('aria-invalid');
        UI.toast({ title: 'Subscribed', text: 'Welcome aboard. Check your inbox.' });
      });
    }

    var year = qs('#year');
    if (year) year.textContent = new Date().getFullYear();

    UI.observeReveals();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.MAWJAT);
