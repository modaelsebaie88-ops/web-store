/* ==========================================================================
   mawjat — shop
   Faceted filtering, search, sort and URL sync. Facet counts are calculated
   against the other active facets, so an option that would empty the grid
   shows 0 before it is clicked.
   ========================================================================== */
(function (M) {
  'use strict';

  var U = M.util, D = M.data, UI = M.ui;
  var qs = U.qs, qsa = U.qsa, esc = U.esc;

  /* ------------------------------------------------- colour families */
  var FAMILIES = [
    { key: 'navy',  label: 'Navy & indigo' },
    { key: 'blue',  label: 'Ocean blue' },
    { key: 'teal',  label: 'Teal & green' },
    { key: 'cream', label: 'Cream & ivory' },
    { key: 'sand',  label: 'Sand & clay' },
    { key: 'coral', label: 'Coral & red' },
    { key: 'amber', label: 'Amber & gold' }
  ];

  function hsl(hex) {
    var h = String(hex).replace('#', '');
    var r = parseInt(h.slice(0, 2), 16) / 255,
        g = parseInt(h.slice(2, 4), 16) / 255,
        b = parseInt(h.slice(4, 6), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var l = (max + min) / 2, s = 0, hue = 0;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0));
      else if (max === g) hue = (b - r) / d + 2;
      else hue = (r - g) / d + 4;
      hue *= 60;
    }
    return { h: hue, s: s, l: l };
  }

  function family(hex) {
    var c = hsl(hex);
    if (c.l > 0.88) return 'cream';
    if (c.s < 0.14) return c.l > 0.55 ? 'cream' : 'navy';
    if (c.h >= 185 && c.h < 265) return c.l < 0.34 ? 'navy' : 'blue';
    if (c.h >= 140 && c.h < 185) return 'teal';
    if (c.h >= 70 && c.h < 140) return 'teal';
    if (c.h >= 34 && c.h < 70) return c.s < 0.4 ? 'sand' : 'amber';
    if (c.h >= 18 && c.h < 34) return c.l > 0.62 ? 'sand' : 'amber';
    return c.l > 0.74 ? 'sand' : 'coral';
  }

  D.products.forEach(function (p) {
    var set = {};
    p.colorways.forEach(function (w) { set[family(w.swatch)] = true; });
    p.families = Object.keys(set);
  });

  var SIZES = ['S/M', 'L/XL', 'One Size'];
  var RANGE = D.priceRange();
  var MAXP = Math.ceil(RANGE.max);

  /* ------------------------------------------------------------- state */
  var state = { collection: [], color: [], size: [], max: MAXP, sort: 'featured', q: '' };

  function readURL() {
    function list(name) {
      var v = U.param(name, '');
      return v ? v.split(',').filter(Boolean) : [];
    }
    state.collection = list('collection');
    state.color = list('color');
    state.size = list('size');
    state.q = U.param('q', '') || '';
    var mx = parseFloat(U.param('max', ''));
    state.max = isNaN(mx) ? MAXP : U.clamp(mx, RANGE.min, MAXP);
    var s = U.param('sort', 'featured');
    state.sort = ['featured', 'new', 'price-asc', 'price-desc', 'rating'].indexOf(s) > -1 ? s : 'featured';
  }

  function writeURL() {
    var q = [];
    if (state.collection.length) q.push('collection=' + state.collection.join(','));
    if (state.color.length) q.push('color=' + state.color.join(','));
    if (state.size.length) q.push('size=' + state.size.join(','));
    if (state.max < MAXP) q.push('max=' + state.max);
    if (state.sort !== 'featured') q.push('sort=' + state.sort);
    if (state.q) q.push('q=' + encodeURIComponent(state.q));
    var url = window.location.pathname + (q.length ? '?' + q.join('&') : '');
    try { history.replaceState(null, '', url); } catch (e) {}
  }

  /* ---------------------------------------------------------- filtering */
  function matches(p, skip) {
    if (skip !== 'collection' && state.collection.length && state.collection.indexOf(p.collection) === -1) return false;
    if (skip !== 'color' && state.color.length && !state.color.some(function (f) { return p.families.indexOf(f) > -1; })) return false;
    if (skip !== 'size' && state.size.length && !state.size.some(function (s) { return p.sizes.indexOf(s) > -1; })) return false;
    if (skip !== 'max' && p.price > state.max) return false;
    if (state.q) {
      var hit = D.search(state.q).some(function (x) { return x.id === p.id; });
      if (!hit) return false;
    }
    return true;
  }

  function results() {
    var list = D.products.filter(function (p) { return matches(p); });
    var by = {
      featured: function (a, b) { return a.order - b.order; },
      'new': function (a, b) { return b.released.localeCompare(a.released); },
      'price-asc': function (a, b) { return a.price - b.price; },
      'price-desc': function (a, b) { return b.price - a.price; },
      rating: function (a, b) { return b.rating - a.rating || b.reviewCount - a.reviewCount; }
    };
    return list.sort(by[state.sort] || by.featured);
  }

  function countFor(facet, value) {
    return D.products.filter(function (p) {
      if (!matches(p, facet)) return false;
      if (facet === 'collection') return p.collection === value;
      if (facet === 'color') return p.families.indexOf(value) > -1;
      if (facet === 'size') return p.sizes.indexOf(value) > -1;
      return true;
    }).length;
  }

  /* ----------------------------------------------------------- rendering */
  function checkbox(scope, facet, value, label, n) {
    var on = state[facet].indexOf(value) > -1;
    return '<label class="fopt">' +
      '<input type="checkbox" data-facet="' + facet + '" value="' + esc(value) + '"' + (on ? ' checked' : '') + '>' +
      '<span class="fopt__box"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 12 5 5L20 6"/></svg></span>' +
      '<span>' + esc(label) + '</span>' +
      '<span class="fopt__n">' + n + '</span>' +
    '</label>';
  }

  function filterMarkup(scope) {
    return [
      '<div class="fgroup">',
        '<h2 class="fgroup__t">Collection</h2>',
        D.collections.map(function (c) {
          return checkbox(scope, 'collection', c.key, c.name, countFor('collection', c.key));
        }).join(''),
      '</div>',
      '<div class="fgroup">',
        '<h2 class="fgroup__t">Colour</h2>',
        FAMILIES.map(function (f) {
          return checkbox(scope, 'color', f.key, f.label, countFor('color', f.key));
        }).join(''),
      '</div>',
      '<div class="fgroup">',
        '<h2 class="fgroup__t">Size</h2>',
        SIZES.map(function (s) {
          return checkbox(scope, 'size', s, s, countFor('size', s));
        }).join(''),
      '</div>',
      '<div class="fgroup">',
        '<h2 class="fgroup__t">Max price</h2>',
        '<div class="range">',
          '<label class="sr" for="' + scope + '-max">Maximum price</label>',
          '<input type="range" id="' + scope + '-max" data-facet="max" min="' + RANGE.min + '" max="' + MAXP + '" step="1" value="' + state.max + '">',
          '<div class="range__val"><span>' + M.money(RANGE.min) + '</span><span data-maxout>' + M.money(state.max) + '</span></div>',
        '</div>',
      '</div>'
    ].join('');
  }

  function activeChips() {
    var out = [];
    state.collection.forEach(function (k) {
      out.push({ facet: 'collection', value: k, label: D.collection(k).name });
    });
    state.color.forEach(function (k) {
      var f = FAMILIES.filter(function (x) { return x.key === k; })[0];
      out.push({ facet: 'color', value: k, label: f ? f.label : k });
    });
    state.size.forEach(function (k) { out.push({ facet: 'size', value: k, label: 'Size ' + k }); });
    if (state.max < MAXP) out.push({ facet: 'max', value: '', label: 'Under ' + M.money(state.max) });
    if (state.q) out.push({ facet: 'q', value: '', label: '“' + state.q + '”' });
    return out;
  }

  function render() {
    var list = results();

    // grid
    var grid = qs('#grid');
    var scenes = ['beach', 'coast', 'sunset', 'surf', 'boat', 'cafe'];
    grid.innerHTML = list.map(function (p, i) {
      return UI.productCard(p, { scene: scenes[i % scenes.length] });
    }).join('');
    qs('#noresults').hidden = list.length > 0;
    grid.hidden = list.length === 0;

    // count
    qs('#result-count').textContent = list.length === D.products.length
      ? D.products.length + ' hats'
      : list.length + ' of ' + D.products.length + ' hats';

    // collection chips
    var chips = qs('#coll-chips');
    chips.innerHTML =
      '<button class="chip" data-coll="" aria-pressed="' + (state.collection.length === 0) + '">All hats</button>' +
      D.collections.map(function (c) {
        return '<button class="chip" data-coll="' + c.key + '" aria-pressed="' +
          (state.collection.length === 1 && state.collection[0] === c.key) + '">' + esc(c.name) + '</button>';
      }).join('');

    // active filter pills
    var chipsOut = activeChips();
    qs('#active-filters').innerHTML = chipsOut.length
      ? chipsOut.map(function (c) {
          return '<span class="activefilter">' + esc(c.label) +
            '<button data-drop-facet="' + c.facet + '" data-drop-value="' + esc(c.value) + '" aria-label="Remove filter ' + esc(c.label) + '">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span>';
        }).join('') + '<button class="activefilter" data-clear-all>Clear all</button>'
      : '';

    var nActive = chipsOut.length;
    qs('#filter-n').textContent = nActive ? '(' + nActive + ')' : '';

    // filter panels
    qs('#filters-desktop').innerHTML = filterMarkup('d');
    qs('#filters-mobile').innerHTML = filterMarkup('m');

    // heading + crumb reflect a single-collection view
    var title = qs('#shop-title'), blurb = qs('#shop-blurb'), crumb = qs('#crumb-now');
    if (state.collection.length === 1) {
      var c = D.collection(state.collection[0]);
      title.textContent = c.name;
      blurb.textContent = c.blurb;
      crumb.textContent = c.name;
      document.title = c.name + ' collection — mawjat';
    } else {
      title.textContent = 'All hats';
      blurb.textContent = 'Twelve bucket hats across five coastal collections. Cotton, salt and sun — pick your water.';
      crumb.textContent = 'Shop';
      document.title = 'Shop all bucket hats — mawjat';
    }

    qs('#sort').value = state.sort;
    writeURL();
    UI.observeReveals(grid);
  }

  /* ------------------------------------------------------------- wiring */
  function toggle(facet, value) {
    var arr = state[facet];
    var i = arr.indexOf(value);
    if (i > -1) arr.splice(i, 1); else arr.push(value);
  }

  var booted = false;
  function init() {
    if (booted) return;
    booted = true;
    readURL();
    render();

    // collection chips (single-select shortcut over the multi-select facet)
    qs('#coll-chips').addEventListener('click', function (e) {
      var b = e.target.closest('[data-coll]');
      if (!b) return;
      state.collection = b.dataset.coll ? [b.dataset.coll] : [];
      render();
    });

    // checkbox facets + price range, from either panel
    document.addEventListener('change', function (e) {
      var el = e.target.closest('[data-facet]');
      if (!el) return;
      if (el.dataset.facet === 'max') {
        state.max = parseFloat(el.value);
        qsa('[data-maxout]').forEach(function (o) { o.textContent = M.money(state.max); });
        clearTimeout(init._t);
        init._t = setTimeout(render, 180);
        return;
      }
      toggle(el.dataset.facet, el.value);
      render();
    });

    // live price readout while dragging, before the debounced re-render
    document.addEventListener('input', function (e) {
      var el = e.target.closest('[data-facet="max"]');
      if (!el) return;
      qsa('[data-maxout]').forEach(function (o) { o.textContent = M.money(parseFloat(el.value)); });
    });

    qs('#sort').addEventListener('change', function () { state.sort = this.value; render(); });

    document.addEventListener('click', function (e) {
      var drop = e.target.closest('[data-drop-facet]');
      if (drop) {
        var f = drop.dataset.dropFacet;
        if (f === 'max') state.max = MAXP;
        else if (f === 'q') state.q = '';
        else toggle(f, drop.dataset.dropValue);
        render();
        return;
      }
      if (e.target.closest('[data-clear-all]')) {
        state = { collection: [], color: [], size: [], max: MAXP, sort: state.sort, q: '' };
        render();
      }
    });

    // mobile sheet
    qs('#filter-open').addEventListener('click', function () { UI.open(qs('#filter-sheet')); });
    qs('#sheet-apply').addEventListener('click', function () { UI.close(qs('#filter-sheet')); });

    M.on('reprice', function () {
      qsa('[data-maxout]').forEach(function (o) { o.textContent = M.money(state.max); });
      render();
    });

    var year = qs('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.MAWJAT);
