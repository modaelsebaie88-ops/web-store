/* ==========================================================================
   mawjat — checkout
   Three steps, client-side validation, promo codes, confirmation.
   Nothing is transmitted: this is a storefront demo, and the copy says so.
   ========================================================================== */
(function (M) {
  'use strict';

  var U = M.util, D = M.data, UI = M.ui;
  var qs = U.qs, qsa = U.qsa, esc = U.esc;

  var step = 1;
  var promo = null;
  var shipRate = 0;

  /* ---------------------------------------------------------- validation */
  var RULES = {
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Enter a valid email address.'; },
    first: function (v) { return v.trim().length > 1 || 'Enter your first name.'; },
    last: function (v) { return v.trim().length > 1 || 'Enter your last name.'; },
    address: function (v) { return v.trim().length > 4 || 'Enter a street address.'; },
    city: function (v) { return v.trim().length > 1 || 'Enter a city.'; },
    postal: function (v) { return v.trim().length > 2 || 'Enter a postcode.'; },
    phone: function (v) { return !v.trim() || /^[+\d][\d\s()-]{6,}$/.test(v) || 'That phone number looks short.'; },
    card: function (v) {
      var d = v.replace(/\s+/g, '');
      return (/^\d{13,19}$/.test(d) && luhn(d)) || 'Enter a valid card number.';
    },
    exp: function (v) {
      var m = v.match(/^(\d{2})\s*\/\s*(\d{2})$/);
      if (!m) return 'Use MM/YY.';
      var mm = +m[1], yy = 2000 + +m[2];
      if (mm < 1 || mm > 12) return 'That month does not exist.';
      var now = new Date();
      if (yy < now.getFullYear() || (yy === now.getFullYear() && mm < now.getMonth() + 1)) return 'That card has expired.';
      return true;
    },
    cvc: function (v) { return /^\d{3,4}$/.test(v.trim()) || 'Three or four digits.'; },
    cardname: function (v) { return v.trim().length > 2 || 'Enter the name on the card.'; }
  };

  function luhn(num) {
    var sum = 0, alt = false;
    for (var i = num.length - 1; i >= 0; i--) {
      var n = parseInt(num[i], 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  function validateField(el) {
    var rule = RULES[el.id];
    if (!rule) return true;
    var res = rule(el.value);
    var err = qs('[data-error-for="' + el.id + '"]');
    var ok = res === true;
    el.setAttribute('aria-invalid', String(!ok));
    if (err) err.textContent = ok ? '' : res;
    return ok;
  }

  function validateStep(n) {
    var panel = qs('[data-panel="' + n + '"]');
    var fields = qsa('input,select', panel).filter(function (el) { return RULES[el.id]; });
    var firstBad = null;
    fields.forEach(function (el) { if (!validateField(el) && !firstBad) firstBad = el; });
    if (firstBad) {
      firstBad.focus();
      firstBad.scrollIntoView({ block: 'center', behavior: U.reducedMotion() ? 'auto' : 'smooth' });
      return false;
    }
    return true;
  }

  /* ------------------------------------------------------------ rendering */
  function goTo(n) {
    step = n;
    qsa('.cosection').forEach(function (s) { s.hidden = +s.dataset.panel !== n; });
    qsa('.step').forEach(function (s) {
      var i = +s.dataset.step;
      s.classList.toggle('is-on', i === n);
      s.classList.toggle('is-done', i < n);
    });
    var panel = qs('[data-panel="' + n + '"]');
    var h = qs('h2', panel);
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    window.scrollTo({ top: 0, behavior: U.reducedMotion() ? 'auto' : 'smooth' });
    renderTotals();
  }

  function renderLines() {
    var lines = M.cart.lines();
    qs('#co-lines').innerHTML = lines.map(function (l) {
      return '<article class="line">' +
        '<div class="line__img">' + UI.lineArt(l.product, l.colorway) + '</div>' +
        '<div class="line__body">' +
          '<span class="line__name">' + esc(l.product.name) + '</span>' +
          '<span class="line__meta">' + esc(l.colorway.name) + (l.size ? ' &middot; ' + esc(l.size) : '') + ' &middot; &times;' + l.qty + '</span>' +
        '</div>' +
        '<div class="line__side"><span class="line__price num">' + M.money(l.total) + '</span></div>' +
      '</article>';
    }).join('');
  }

  function renderTotals() {
    var t = M.totals(promo, step >= 2 ? shipRate : null);
    qs('#co-totals').innerHTML = [
      '<div class="totals__row"><span>Subtotal</span><span class="num">' + M.money(t.subtotal) + '</span></div>',
      t.discount > 0
        ? '<div class="totals__row totals__row--save"><span>Discount (' + esc(t.promoCode) + ')</span><span class="num">−' + M.money(t.discount) + '</span></div>'
        : '',
      '<div class="totals__row"><span>Shipping</span><span class="num">' + (t.shipping === 0 ? 'Free' : M.money(t.shipping)) + '</span></div>',
      '<div class="totals__row totals__row--big"><span>Total</span><span class="num">' + M.money(t.total) + '</span></div>'
    ].join('');
    var pt = qs('#place-total');
    if (pt) pt.textContent = M.money(t.total);
    qs('#cur-note').textContent = M.currency().code;

    // shipping option prices follow the active currency
    qsa('[data-ship-price]').forEach(function (el) {
      var rate = parseFloat(el.dataset.shipPrice);
      el.textContent = rate === 0 ? 'Free' : M.money(rate);
    });
  }

  function orderNumber() {
    return 'MW-' + String(Date.now()).slice(-6) + '-' + Math.floor(Math.random() * 900 + 100);
  }

  function complete() {
    var t = M.totals(promo, shipRate);
    var lines = M.cart.lines();
    var count = M.cart.count();
    var form = qs('#co-form');
    var email = qs('#email').value.trim();
    var name = qs('#first').value.trim();
    var shipName = (qs('input[name="ship"]:checked') || {}).value || 'standard';
    var eta = shipName === 'express' ? '2–4 working days'
      : shipName === 'local' ? 'this evening' : '5–10 working days';
    var num = orderNumber();

    qs('#co-flow').hidden = true;
    qs('#co-done').hidden = false;
    document.title = 'Order confirmed — mawjat';

    qs('#done-msg').textContent = 'Thanks ' + (name || 'friend') +
      '. Order ' + num + ' is in, and a receipt is on its way to ' + email + '.';

    qs('#done-box').innerHTML = [
      '<div class="done__row"><span class="mute">Order</span><strong>' + esc(num) + '</strong></div>',
      '<div class="done__row"><span class="mute">Items</span><strong>' + count + (count === 1 ? ' hat' : ' hats') + '</strong></div>',
      lines.map(function (l) {
        return '<div class="done__row"><span class="mute">' + esc(l.product.name) + ' · ' + esc(l.colorway.name) + '</span>' +
          '<span class="num">' + M.money(l.total) + '</span></div>';
      }).join(''),
      '<div class="done__row"><span class="mute">Delivery</span><strong>' + eta + '</strong></div>',
      '<div class="done__row" style="border-top:1px solid var(--line);padding-top:.6rem">' +
        '<strong>Total paid</strong><strong class="num">' + M.money(t.total) + '</strong></div>'
    ].join('');

    M.cart.clear();
    form.reset();
    UI.toast({ title: 'Order placed', text: num + ' — thank you.', duration: 6000 });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /* --------------------------------------------------------------- wiring */
  var booted = false;
  function init() {
    if (booted) return;
    booted = true;
    var year = qs('#year');
    if (year) year.textContent = new Date().getFullYear();

    if (!M.cart.count()) {
      qs('#co-empty').hidden = false;
      return;
    }
    qs('#co-flow').hidden = false;
    renderLines();
    renderTotals();

    qs('#co-form').addEventListener('click', function (e) {
      var next = e.target.closest('[data-next]');
      if (next) {
        if (validateStep(step)) goTo(+next.dataset.next);
        return;
      }
      var back = e.target.closest('[data-back]');
      if (back) goTo(+back.dataset.back);
    });

    qs('#co-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateStep(3)) return;
      complete();
    });

    // validate on blur, clear the error as soon as it is fixed
    qs('#co-form').addEventListener('blur', function (e) {
      if (RULES[e.target.id]) validateField(e.target);
    }, true);
    qs('#co-form').addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') validateField(e.target);
    });

    // light formatting helpers
    qs('#card').addEventListener('input', function () {
      var d = this.value.replace(/\D/g, '').slice(0, 19);
      this.value = d.replace(/(.{4})/g, '$1 ').trim();
    });
    qs('#exp').addEventListener('input', function () {
      var d = this.value.replace(/\D/g, '').slice(0, 4);
      this.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
    });
    qs('#cvc').addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 4);
    });

    qsa('input[name="ship"]').forEach(function (r) {
      r.addEventListener('change', function () {
        shipRate = parseFloat(r.dataset.rate);
        renderTotals();
      });
    });

    qs('#promo-apply').addEventListener('click', function () {
      var code = qs('#promo').value.trim().toUpperCase();
      var msg = qs('#promo-msg');
      if (!code) { msg.textContent = ''; return; }
      if (M.promos[code]) {
        promo = code;
        msg.style.color = 'var(--turq)';
        msg.textContent = code + ' applied — ' + M.promos[code].label + '.';
      } else {
        promo = null;
        msg.style.color = 'var(--coral)';
        msg.textContent = 'That code is not one of ours.';
      }
      renderTotals();
    });
    qs('#promo').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); qs('#promo-apply').click(); }
    });

    M.on('reprice', function () { renderLines(); renderTotals(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.MAWJAT);
