/* ==========================================================================
   mawjat - art
   Every image on this site is generated SVG: product renders, coastal scenes,
   collection tiles, lifestyle frames, avatars. No bitmaps, no stock photos.
   Keeps the whole site under ~200 KB and razor sharp at any size.
   ========================================================================== */
(function (M) {
  'use strict';

  var U = M.util;
  var shade = U.shade, mix = U.mix, uid = U.uid;

  /* ------------------------------------------------------------ primitives */

  /**
   * Seamless wave path. `width` must be a whole number of wavelengths so the
   * shape can be translated by one wavelength forever without a visible seam.
   */
  function wavePath(width, wavelength, amp, base, floor) {
    var d = 'M0,' + base;
    for (var x = 0; x < width; x += wavelength) {
      d += ' C' + (x + wavelength * 0.28) + ',' + (base - amp) +
           ' ' + (x + wavelength * 0.72) + ',' + (base + amp) +
           ' ' + (x + wavelength) + ',' + base;
    }
    return d + ' L' + width + ',' + floor + ' L0,' + floor + ' Z';
  }

  function waveLine(width, wavelength, amp, base) {
    var d = 'M0,' + base;
    for (var x = 0; x < width; x += wavelength) {
      d += ' C' + (x + wavelength * 0.28) + ',' + (base - amp) +
           ' ' + (x + wavelength * 0.72) + ',' + (base + amp) +
           ' ' + (x + wavelength) + ',' + base;
    }
    return d;
  }

  function gull(x, y, s) {
    s = s || 1;
    return '<path d="M' + x + ',' + y + ' q' + (5 * s) + ',' + (-4 * s) + ' ' + (10 * s) + ',0 q' +
      (5 * s) + ',' + (-4 * s) + ' ' + (10 * s) + ',0" fill="none" stroke="currentColor" ' +
      'stroke-width="' + (1.6 * s) + '" stroke-linecap="round" opacity=".55"/>';
  }

  /* -------------------------------------------------------- shared defs */
  var DEFS_ID = 'mawjat-defs';

  function injectDefs() {
    if (document.getElementById(DEFS_ID)) return;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', DEFS_ID);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    svg.innerHTML = [
      '<defs>',
      // woven cotton texture, reused by every hat
      '<pattern id="mw-weave" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">',
        '<rect width="6" height="6" fill="none"/>',
        '<line x1="0" y1="0" x2="0" y2="6" stroke="#000" stroke-width="1.1" opacity=".055"/>',
        '<line x1="3" y1="0" x2="3" y2="6" stroke="#fff" stroke-width="1.1" opacity=".07"/>',
      '</pattern>',
      // fine paper grain for scenes
      '<filter id="mw-grain" x="0" y="0" width="100%" height="100%">',
        '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" result="n"/>',
        '<feColorMatrix in="n" type="saturate" values="0"/>',
        '<feComponentTransfer><feFuncA type="linear" slope=".5"/></feComponentTransfer>',
      '</filter>',
      // soft product shadow
      '<filter id="mw-soft" x="-40%" y="-40%" width="180%" height="180%">',
        '<feGaussianBlur stdDeviation="13"/>',
      '</filter>',
      '<filter id="mw-soft-sm" x="-40%" y="-40%" width="180%" height="180%">',
        '<feGaussianBlur stdDeviation="5"/>',
      '</filter>',
      '<filter id="mw-glow" x="-70%" y="-70%" width="240%" height="240%">',
        '<feGaussianBlur stdDeviation="26"/>',
      '</filter>',
      '</defs>'
    ].join('');
    (document.body || document.documentElement).appendChild(svg);
  }

  /* ------------------------------------------------------------- the hat */

  /* A bucket hat is a short truncated cone sitting on a brim that falls away
     on every side. Keep the crown sides nearly straight — curve them and it
     reads as a cloche — and keep the brim tips below the crown base, or the
     whole thing reads as a bonnet. */
  var CROWN = 'M170,344 C176,280 186,214 196,182 C204,154 232,148 254,148 ' +
              'L346,148 C368,148 396,154 404,182 C414,214 424,280 430,344 Z';
  var BRIM  = 'M90,352 C90,398 172,428 300,428 C428,428 510,398 510,352 ' +
              'C510,338 490,341 468,348 C416,361 358,366 300,366 ' +
              'C242,366 184,361 132,348 C110,341 90,338 90,352 Z';
  var BRIM_EDGE = 'M90,352 C90,398 172,428 300,428 C428,428 510,398 510,352';

  function motif(kind, c, id) {
    var out = [];
    var i, x, y;

    switch (kind) {

      case 'waves':
        for (i = 0; i < 6; i++) {
          out.push('<path d="' + waveLine(340, 85, 7, 176 + i * 30) + '" transform="translate(130,0)" ' +
            'fill="none" stroke="' + c.motif + '" stroke-width="5" stroke-linecap="round" opacity="' +
            (0.9 - i * 0.04) + '"/>');
        }
        break;

      case 'stripe':
        for (i = 0; i < 6; i++) {
          out.push('<rect x="120" y="' + (140 + i * 38) + '" width="360" height="19" fill="' + c.motif + '"/>');
        }
        break;

      case 'fish': {
        var fish = [[196, 196], [268, 172], [344, 194], [404, 232], [188, 258], [262, 240],
                    [338, 262], [408, 296], [216, 316], [296, 306], [372, 326]];
        fish.forEach(function (p, n) {
          var s = n % 3 === 0 ? 1.15 : 0.85;
          var flip = n % 2 ? -1 : 1;
          out.push('<g transform="translate(' + p[0] + ',' + p[1] + ') scale(' + (s * flip) + ',' + s + ')" fill="' + c.motif + '">' +
            '<path d="M-16,0 C-8,-8 8,-8 16,0 C8,8 -8,8 -16,0 Z"/>' +
            '<path d="M16,0 L26,-7 L26,7 Z"/>' +
            '<circle cx="-7" cy="-1.5" r="1.8" fill="' + c.crown + '"/>' +
            '</g>');
        });
        break;
      }

      case 'shells': {
        var shells = [[214, 200], [300, 176], [386, 202], [188, 274], [300, 254], [412, 276], [248, 330], [356, 330]];
        shells.forEach(function (p, n) {
          var s = n % 2 ? 0.86 : 1.06;
          var g = ['<g transform="translate(' + p[0] + ',' + p[1] + ') scale(' + s + ')">',
            '<path d="M-19,6 A19,19 0 0 1 19,6 Z" fill="' + c.motif + '"/>'];
          // ribs radiating from the hinge, so it reads as a scallop not a cloud
          for (i = 1; i <= 5; i++) {
            var th = Math.PI * i / 6;
            g.push('<line x1="0" y1="6" x2="' + (17 * Math.cos(th)).toFixed(1) +
              '" y2="' + (6 - 17 * Math.sin(th)).toFixed(1) +
              '" stroke="' + c.crown + '" stroke-width="1.6" opacity=".45"/>');
          }
          g.push('<circle cy="6" r="3" fill="' + c.crown + '" opacity=".35"/>');
          g.push('</g>');
          out.push(g.join(''));
        });
        break;
      }

      case 'coral': {
        var stems = [[196, 348], [258, 348], [318, 348], [378, 348], [430, 348], [226, 348], [352, 348]];
        stems.forEach(function (p, n) {
          var h = 96 + (n % 3) * 46;
          var sway = n % 2 ? 18 : -18;
          out.push('<g stroke="' + c.motif + '" stroke-width="7" stroke-linecap="round" fill="none" opacity="' + (0.95 - (n % 3) * 0.12) + '">' +
            '<path d="M' + p[0] + ',' + p[1] + ' C' + (p[0] + sway) + ',' + (p[1] - h * 0.5) + ' ' +
              (p[0] - sway) + ',' + (p[1] - h * 0.75) + ' ' + (p[0] + sway * 0.4) + ',' + (p[1] - h) + '"/>' +
            '<path d="M' + (p[0] + sway * 0.1) + ',' + (p[1] - h * 0.55) + ' C' + (p[0] + sway * 1.6) + ',' + (p[1] - h * 0.72) +
              ' ' + (p[0] + sway * 1.9) + ',' + (p[1] - h * 0.86) + ' ' + (p[0] + sway * 1.5) + ',' + (p[1] - h * 0.98) + '" stroke-width="5"/>' +
            '<path d="M' + (p[0] - sway * 0.1) + ',' + (p[1] - h * 0.4) + ' C' + (p[0] - sway * 1.5) + ',' + (p[1] - h * 0.56) +
              ' ' + (p[0] - sway * 1.8) + ',' + (p[1] - h * 0.68) + ' ' + (p[0] - sway * 1.3) + ',' + (p[1] - h * 0.8) + '" stroke-width="5"/>' +
            '</g>');
        });
        break;
      }

      case 'palm':
      case 'fronds': {
        if (kind === 'fronds') {
          out.push('<circle cx="300" cy="206" r="52" fill="' + c.motif + '" opacity=".35"/>');
        }
        var fronds = [[176, 300, -34], [246, 268, -16], [318, 262, 14], [392, 292, 34],
                      [206, 346, -26], [300, 340, 2], [398, 350, 26]];
        fronds.forEach(function (f, n) {
          var g = ['<g transform="translate(' + f[0] + ',' + f[1] + ') rotate(' + f[2] + ') scale(' + (n % 2 ? 0.92 : 1.12) + ')" ' +
            'stroke="' + c.motif + '" fill="none" stroke-linecap="round" opacity="' + (n % 2 ? 0.82 : 1) + '">'];
          g.push('<path d="M0,0 C4,-34 4,-64 0,-96" stroke-width="4.5"/>');
          for (i = 1; i <= 6; i++) {
            var ly = -12 - i * 13;
            var lw = 30 - i * 2.6;
            g.push('<path d="M0,' + ly + ' C' + (-lw * 0.6) + ',' + (ly - 5) + ' ' + (-lw) + ',' + (ly - 12) + ' ' + (-lw - 4) + ',' + (ly - 20) + '" stroke-width="3.4"/>');
            g.push('<path d="M0,' + ly + ' C' + (lw * 0.6) + ',' + (ly - 5) + ' ' + lw + ',' + (ly - 12) + ' ' + (lw + 4) + ',' + (ly - 20) + '" stroke-width="3.4"/>');
          }
          g.push('</g>');
          out.push(g.join(''));
        });
        break;
      }

      case 'sunburst': {
        var warm = [c.motif, mix(c.motif, '#ffffff', 0.28), mix(c.motif, c.binding, 0.5), c.binding,
                    mix(c.binding, '#ffffff', 0.3), mix(c.motif, '#ffffff', 0.5), c.motif];
        out.push('<circle cx="300" cy="330" r="46" fill="' + warm[0] + '"/>');
        for (i = 0; i < 7; i++) {
          var r = 66 + i * 26;
          out.push('<path d="M' + (300 - r) + ',330 A' + r + ',' + r + ' 0 0 1 ' + (300 + r) + ',330" ' +
            'fill="none" stroke="' + warm[i] + '" stroke-width="13" stroke-linecap="round" opacity="' + (0.95 - i * 0.07) + '"/>');
        }
        break;
      }

      case 'rope': {
        out.push('<path d="' + waveLine(360, 60, 4, 244) + '" transform="translate(120,0)" fill="none" ' +
          'stroke="' + c.motif + '" stroke-width="16" stroke-linecap="round" opacity=".22"/>');
        for (i = 0; i < 12; i++) {
          x = 126 + i * 32;
          out.push('<path d="M' + x + ',236 C' + (x + 10) + ',226 ' + (x + 22) + ',226 ' + (x + 30) + ',236 ' +
            'C' + (x + 22) + ',250 ' + (x + 10) + ',250 ' + x + ',236 Z" fill="none" stroke="' + c.motif +
            '" stroke-width="6.5" stroke-linecap="round"/>');
        }
        out.push('<path d="' + waveLine(360, 90, 5, 318) + '" transform="translate(120,0)" fill="none" ' +
          'stroke="' + c.motif + '" stroke-width="4" stroke-linecap="round" opacity=".65"/>');
        out.push('<path d="' + waveLine(360, 90, 5, 180) + '" transform="translate(120,0)" fill="none" ' +
          'stroke="' + c.motif + '" stroke-width="4" stroke-linecap="round" opacity=".65"/>');
        break;
      }

      case 'lighthouse': {
        out.push('<g transform="translate(300,252)">' +
          '<circle r="74" fill="none" stroke="' + c.motif + '" stroke-width="3" opacity=".5"/>' +
          '<path d="M-56,-6 L-30,-6 L-24,-12 L24,-12 L30,-6 L56,-6" fill="none" stroke="' + c.motif + '" stroke-width="3" opacity=".45"/>' +
          '<path d="M-13,44 L-9,-16 L9,-16 L13,44 Z" fill="' + c.motif + '"/>' +
          '<rect x="-12" y="-26" width="24" height="11" rx="2.5" fill="' + c.motif + '"/>' +
          '<path d="M-8,-26 L0,-40 L8,-26 Z" fill="' + c.motif + '"/>' +
          '<path d="M-44,-34 L-16,-24 M44,-34 L16,-24 M-38,-52 L-14,-32 M38,-52 L14,-32" ' +
            'stroke="' + c.motif + '" stroke-width="3" stroke-linecap="round" opacity=".7"/>' +
          '<path d="M-58,50 q14,-8 28,0 t28,0 t28,0" fill="none" stroke="' + c.motif + '" stroke-width="4" stroke-linecap="round"/>' +
          '<path d="M-48,64 q14,-8 28,0 t28,0" fill="none" stroke="' + c.motif + '" stroke-width="4" stroke-linecap="round" opacity=".7"/>' +
          '</g>');
        break;
      }

      default: // 'minimal'
        out.push('<g transform="translate(300,252) scale(1.6)" fill="none" stroke="' + c.motif +
          '" stroke-width="4" stroke-linecap="round">' +
          '<path d="M-30,0 q10,-9 20,0 t20,0"/>' +
          '<path d="M-24,13 q9,-8 18,0 t18,0" opacity=".6"/>' +
          '</g>');
    }
    return out.join('');
  }

  function patchMark(c, kind) {
    if (kind === 'circle') {
      var ink = c.motif;
      return '<g transform="translate(300,238)">' +
        '<circle r="54" fill="' + mix(c.crown, '#ffffff', 0.12) + '" stroke="' + ink + '" stroke-width="2.5"/>' +
        '<circle r="46" fill="none" stroke="' + ink + '" stroke-width="1" opacity=".6"/>' +
        '<path d="M-11,20 L-8,-8 L8,-8 L11,20 Z" fill="' + ink + '"/>' +
        '<rect x="-10" y="-16" width="20" height="9" rx="2" fill="' + ink + '"/>' +
        '<path d="M-7,-16 L0,-27 L7,-16 Z" fill="' + ink + '"/>' +
        '<path d="M-32,28 q11,-7 22,0 t22,0 t22,0" fill="none" stroke="' + ink + '" stroke-width="3.4" stroke-linecap="round"/>' +
        '<text y="-30" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="15" ' +
          'letter-spacing="1.4" fill="' + ink + '">mawjat</text>' +
        '</g>';
    }
    if (kind === 'tag') {
      return '<g transform="translate(300,306)">' +
        '<rect x="-38" y="-13" width="76" height="26" rx="5" fill="' + mix(c.crown, c.motif, 0.88) + '"/>' +
        '<path d="M-24,4 q8,-6 16,0 t16,0" fill="none" stroke="' + c.crown + '" stroke-width="2.6" stroke-linecap="round"/>' +
        '<text y="-1" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="12.5" ' +
          'letter-spacing=".6" fill="' + c.crown + '">mawjat</text>' +
        '</g>';
    }
    return '';
  }

  /**
   * Front product render.
   * opts: { tilt, backdrop, shadow, scale }
   */
  function hat(colorway, kind, patch, opts) {
    injectDefs();
    opts = opts || {};
    var c = colorway;
    var id = uid('h');
    var tilt = opts.tilt || 0;

    var crownTop = mix(c.crown, '#ffffff', 0.16);
    var crownBot = shade(c.crown, -0.22);
    var brimTop = shade(c.brim, -0.3);
    var brimBot = mix(c.brim, '#ffffff', 0.08);

    return [
      '<svg class="hat" viewBox="0 0 600 500" role="img" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">',
      '<defs>',
        '<linearGradient id="cr' + id + '" x1="0" y1="0" x2=".85" y2="1">',
          '<stop offset="0" stop-color="' + crownTop + '"/>',
          '<stop offset=".48" stop-color="' + c.crown + '"/>',
          '<stop offset="1" stop-color="' + crownBot + '"/>',
        '</linearGradient>',
        '<linearGradient id="br' + id + '" x1=".1" y1="0" x2=".9" y2="1">',
          '<stop offset="0" stop-color="' + brimTop + '"/>',
          '<stop offset=".42" stop-color="' + c.brim + '"/>',
          '<stop offset="1" stop-color="' + brimBot + '"/>',
        '</linearGradient>',
        '<radialGradient id="hl' + id + '" cx=".34" cy=".26" r=".55">',
          '<stop offset="0" stop-color="#ffffff" stop-opacity=".42"/>',
          '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>',
        '</radialGradient>',
        '<clipPath id="cc' + id + '"><path d="' + CROWN + '"/></clipPath>',
        '<clipPath id="bc' + id + '"><path d="' + BRIM + '"/></clipPath>',
      '</defs>',

      '<g class="hat__g" transform="rotate(' + tilt + ' 300 300)">',

        // cast shadow
        (opts.shadow === false ? '' :
          '<ellipse cx="302" cy="436" rx="186" ry="18" fill="' + shade(c.crown, -0.72) +
          '" opacity=".2" filter="url(#mw-soft)"/>'),

        // ---- crown
        '<g clip-path="url(#cc' + id + ')">',
          '<path d="' + CROWN + '" fill="url(#cr' + id + ')"/>',
          motif(kind, c, id),
          '<rect x="160" y="140" width="290" height="220" fill="url(#mw-weave)"/>',
          '<path d="' + CROWN + '" fill="url(#hl' + id + ')"/>',
          // shading where the brim throws back onto the crown
          '<ellipse cx="300" cy="356" rx="172" ry="34" fill="' + shade(c.crown, -0.6) + '" opacity=".3" filter="url(#mw-soft-sm)"/>',
        '</g>',
        '<path d="' + CROWN + '" fill="none" stroke="' + shade(c.crown, -0.4) + '" stroke-width="1.6" opacity=".5"/>',

        // crown top stitch
        '<path d="M242,166 C268,156 332,156 358,166" fill="none" stroke="' + shade(c.crown, -0.45) +
          '" stroke-width="1.6" stroke-dasharray="5 5" opacity=".55"/>',

        patchMark(c, patch),

        // eyelets
        '<g>',
          '<circle cx="204" cy="268" r="8" fill="' + shade(c.crown, -0.5) + '" opacity=".55"/>',
          '<circle cx="204" cy="268" r="5" fill="' + shade(c.crown, -0.78) + '"/>',
          '<circle cx="396" cy="268" r="8" fill="' + shade(c.crown, -0.5) + '" opacity=".55"/>',
          '<circle cx="396" cy="268" r="5" fill="' + shade(c.crown, -0.78) + '"/>',
        '</g>',

        // ---- brim
        '<g clip-path="url(#bc' + id + ')">',
          '<path d="' + BRIM + '" fill="url(#br' + id + ')"/>',
          '<rect x="76" y="336" width="450" height="110" fill="url(#mw-weave)"/>',
          '<ellipse cx="300" cy="342" rx="204" ry="28" fill="' + shade(c.brim, -0.65) + '" opacity=".45" filter="url(#mw-soft-sm)"/>',
          (kind === 'palm' || kind === 'fronds'
            ? '<g opacity=".5" transform="translate(0,86)">' + motif('palm', c, id) + '</g>' : ''),
        '</g>',

        // brim topstitching
        '<g fill="none" stroke="' + shade(c.brim, -0.46) + '" stroke-linecap="round" opacity=".5">',
          '<path d="M106,358 C108,392 182,414 300,414 C418,414 492,392 494,358" stroke-width="1.5" stroke-dasharray="5 5"/>',
          '<path d="M124,362 C130,384 196,402 300,402 C404,402 470,384 476,362" stroke-width="1.5" stroke-dasharray="5 5"/>',
        '</g>',

        // binding tape along the outer edge
        '<path d="' + BRIM_EDGE + '" fill="none" ' +
          'stroke="' + c.binding + '" stroke-width="7" stroke-linecap="round"/>',
        '<path d="' + BRIM + '" fill="none" stroke="' + shade(c.brim, -0.45) + '" stroke-width="1.4" opacity=".45"/>',

      '</g>',
      '</svg>'
    ].join('');
  }

  /** Top-down flat lay, used as a second gallery angle. */
  function flatLay(colorway, kind) {
    injectDefs();
    var c = colorway, id = uid('f');
    return [
      '<svg class="hat hat--flat" viewBox="0 0 600 500" role="img" aria-hidden="true" focusable="false">',
      '<defs>',
        '<radialGradient id="fl' + id + '" cx=".38" cy=".3" r=".75">',
          '<stop offset="0" stop-color="' + mix(c.crown, '#ffffff', 0.22) + '"/>',
          '<stop offset="1" stop-color="' + shade(c.crown, -0.18) + '"/>',
        '</radialGradient>',
        '<radialGradient id="fb' + id + '" cx=".4" cy=".32" r=".8">',
          '<stop offset="0" stop-color="' + mix(c.brim, '#ffffff', 0.12) + '"/>',
          '<stop offset="1" stop-color="' + shade(c.brim, -0.26) + '"/>',
        '</radialGradient>',
        '<clipPath id="fc' + id + '"><circle cx="300" cy="250" r="112"/></clipPath>',
      '</defs>',
      '<ellipse cx="304" cy="268" rx="186" ry="182" fill="' + shade(c.crown, -0.7) + '" opacity=".16" filter="url(#mw-soft)"/>',
      '<circle cx="300" cy="250" r="182" fill="url(#fb' + id + ')"/>',
      '<circle cx="300" cy="250" r="182" fill="url(#mw-weave)"/>',
      '<circle cx="300" cy="250" r="178" fill="none" stroke="' + c.binding + '" stroke-width="7"/>',
      '<g fill="none" stroke="' + shade(c.brim, -0.45) + '" stroke-width="1.4" stroke-dasharray="5 5" opacity=".5">',
        '<circle cx="300" cy="250" r="166"/><circle cx="300" cy="250" r="152"/><circle cx="300" cy="250" r="138"/>',
      '</g>',
      '<circle cx="300" cy="250" r="114" fill="' + shade(c.crown, -0.45) + '" opacity=".35" filter="url(#mw-soft-sm)"/>',
      '<g clip-path="url(#fc' + id + ')">',
        '<circle cx="300" cy="250" r="112" fill="url(#fl' + id + ')"/>',
        '<g transform="translate(300,250) scale(.62) translate(-300,-240)">' + motif(kind, c, id) + '</g>',
        '<circle cx="300" cy="250" r="112" fill="url(#mw-weave)"/>',
      '</g>',
      '<circle cx="300" cy="250" r="112" fill="none" stroke="' + shade(c.crown, -0.4) + '" stroke-width="1.6" opacity=".6"/>',
      '<circle cx="197" cy="276" r="5" fill="' + shade(c.crown, -0.7) + '"/>',
      '<circle cx="403" cy="276" r="5" fill="' + shade(c.crown, -0.7) + '"/>',
      '</svg>'
    ].join('');
  }

  /** Close crop on the embroidery, used as a detail shot. */
  function detailCrop(colorway, kind) {
    injectDefs();
    var c = colorway, id = uid('d');
    return [
      '<svg class="hat hat--detail" viewBox="0 0 600 500" role="img" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">',
      '<defs><linearGradient id="dg' + id + '" x1="0" y1="0" x2="1" y2="1">',
        '<stop offset="0" stop-color="' + mix(c.crown, '#ffffff', 0.14) + '"/>',
        '<stop offset="1" stop-color="' + shade(c.crown, -0.2) + '"/>',
      '</linearGradient></defs>',
      '<rect width="600" height="500" fill="url(#dg' + id + ')"/>',
      '<g transform="translate(300,250) scale(1.6) translate(-300,-250)">' + motif(kind, c, id) + '</g>',
      '<rect width="600" height="500" fill="url(#mw-weave)"/>',
      '<path d="M0,372 C120,362 200,384 300,378 C400,372 500,392 600,384" fill="none" ' +
        'stroke="' + shade(c.crown, -0.45) + '" stroke-width="2" stroke-dasharray="7 7" opacity=".6"/>',
      '<ellipse cx="300" cy="500" rx="420" ry="150" fill="' + shade(c.crown, -0.6) + '" opacity=".22" filter="url(#mw-soft)"/>',
      '</svg>'
    ].join('');
  }

  /* --------------------------------------------------------- coastal scenes */

  var SCENES = {
    beach:  { sky: ['#BFE1EA', '#EBDCC4'], sea: '#2E7D9E', sand: '#E7D4B2', sun: '#F6D9A8' },
    surf:   { sky: ['#8FC2D6', '#D7E6E4'], sea: '#1F6A94', sand: '#D9C6A6', sun: '#EFE3C6' },
    coast:  { sky: ['#CBE3E6', '#F1E3CB'], sea: '#3C8FA4', sand: '#DCC7A2', sun: '#F3DCB4' },
    cafe:   { sky: ['#EFDFC6', '#E6C9A4'], sea: '#70A7B0', sand: '#D8BE97', sun: '#F2CF96' },
    boat:   { sky: ['#A9D2E0', '#E4E0CE'], sea: '#175E85', sand: '#D5C3A3', sun: '#EEDFB8' },
    sunset: { sky: ['#8FA9C6', '#F0B37E'], sea: '#2A5A7A', sand: '#C9A882', sun: '#F3A25E' }
  };

  /**
   * Small coastal frame with a figure wearing the hat. Used for lifestyle
   * tiles, hover images on product cards and review photos.
   */
  function scene(key, colorway, opts) {
    injectDefs();
    opts = opts || {};
    var s = SCENES[key] || SCENES.beach;
    var c = colorway || { crown: '#123350', brim: '#123350', motif: '#EDDFC6', binding: '#EDDFC6' };
    var id = uid('s');
    var W = 600, H = 500;
    var horizon = 246;

    // Back-lit silhouette built as neck / shoulders / head / hat, in that
    // order, so the head separates from the body instead of merging into
    // one dark blob. Two flat tones only — it should read as art direction,
    // not as clipart.
    var body = mix('#0C2637', s.sea, 0.2);
    var flesh = mix(body, '#FFFFFF', 0.09);

    function figure(x, y, sc, flip) {
      return '<g transform="translate(' + x + ',' + y + ') scale(' + (sc * (flip ? -1 : 1)) + ',' + sc + ')">' +
        '<rect x="-6" y="18" width="12" height="18" rx="5" fill="' + flesh + '"/>' +
        '<path d="M-34,94 C-34,58 -19,34 0,34 C19,34 34,58 34,94 Z" fill="' + body + '"/>' +
        '<circle cx="0" cy="10" r="15" fill="' + flesh + '"/>' +
        '<path d="M-23,-2 C-23,7 -13,12 0,12 C13,12 23,7 23,-2 Z" fill="' + shade(c.brim, -0.1) + '"/>' +
        '<path d="M-23,-2 C-23,7 -13,12 0,12 C13,12 23,7 23,-2" fill="none" stroke="' + c.binding + '" stroke-width="1.8"/>' +
        '<path d="M-15,-2 C-14.5,-14 -13,-21 -10,-24 C-7,-27 7,-27 10,-24 C13,-21 14.5,-14 15,-2 Z" fill="' + c.crown + '"/>' +
        '<path d="M-8,-13 q4,-3.5 8,0 t8,0" fill="none" stroke="' + c.motif + '" stroke-width="2" stroke-linecap="round"/>' +
        '</g>';
    }

    var extras = '';
    if (key === 'surf') {
      extras = '<g transform="translate(438,330)"><ellipse rx="66" ry="10" fill="' + shade(s.sea, -0.3) + '" opacity=".45"/>' +
        '<path d="M-62,-3 C-40,-16 40,-16 62,-3 C40,7 -40,7 -62,-3 Z" fill="' + c.crown + '"/>' +
        '<path d="M-62,-3 C-40,-16 40,-16 62,-3" fill="none" stroke="' + c.motif + '" stroke-width="2.4"/></g>';
    } else if (key === 'boat') {
      extras = '<g transform="translate(408,286)">' +
        '<path d="M-86,10 L86,10 L62,40 L-62,40 Z" fill="' + shade(c.crown, -0.25) + '"/>' +
        '<path d="M-86,10 L86,10 L82,17 L-82,17 Z" fill="' + c.binding + '"/>' +
        '<path d="M-4,10 L-4,-78 L58,4 Z" fill="' + mix('#ffffff', s.sand, 0.35) + '"/>' +
        '<path d="M-10,10 L-10,-78 L-62,4 Z" fill="' + mix('#ffffff', s.sand, 0.6) + '"/>' +
        '<rect x="-8" y="-82" width="5" height="96" rx="2" fill="' + shade(c.crown, -0.4) + '"/></g>';
    } else if (key === 'cafe') {
      extras = '<g transform="translate(432,342)">' +
        '<rect x="-96" y="0" width="192" height="9" rx="4.5" fill="' + shade(s.sand, -0.35) + '"/>' +
        '<rect x="-74" y="9" width="10" height="58" fill="' + shade(s.sand, -0.42) + '"/>' +
        '<rect x="64" y="9" width="10" height="58" fill="' + shade(s.sand, -0.42) + '"/>' +
        '<g transform="translate(34,-34)">' +
          '<path d="M-17,0 L17,0 L13,34 L-13,34 Z" fill="' + mix('#ffffff', s.sky[1], 0.35) + '" opacity=".92"/>' +
          '<rect x="-17" y="6" width="34" height="18" fill="' + shade(s.sand, -0.45) + '" opacity=".85"/>' +
          '<rect x="-2" y="-22" width="4" height="26" rx="2" fill="' + c.binding + '"/>' +
        '</g></g>';
    } else if (key === 'coast') {
      extras = '<g fill="' + shade(s.sand, -0.42) + '" opacity=".9">' +
        '<path d="M0,352 C60,318 110,336 156,356 C110,372 40,372 0,364 Z"/>' +
        '<path d="M470,340 C520,312 566,326 600,344 L600,372 C540,376 500,362 470,340 Z"/></g>';
    } else if (key === 'sunset') {
      extras = '<g opacity=".5" fill="none" stroke="' + shade(s.sun, -0.35) + '" stroke-width="2">' +
        '<path d="M120,470 q90,-14 180,0 t180,0"/></g>';
    }

    return [
      '<svg class="scene scene--' + key + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" ',
        'aria-label="' + U.esc(opts.label || 'Coastal scene') + '" preserveAspectRatio="xMidYMid slice">',
      '<defs>',
        '<linearGradient id="sk' + id + '" x1="0" y1="0" x2="0" y2="1">',
          '<stop offset="0" stop-color="' + s.sky[0] + '"/><stop offset="1" stop-color="' + s.sky[1] + '"/>',
        '</linearGradient>',
        '<linearGradient id="se' + id + '" x1="0" y1="0" x2="0" y2="1">',
          '<stop offset="0" stop-color="' + mix(s.sea, s.sky[1], 0.45) + '"/>',
          '<stop offset="1" stop-color="' + shade(s.sea, -0.2) + '"/>',
        '</linearGradient>',
        '<linearGradient id="sa' + id + '" x1="0" y1="0" x2="0" y2="1">',
          '<stop offset="0" stop-color="' + mix(s.sand, '#ffffff', 0.18) + '"/>',
          '<stop offset="1" stop-color="' + shade(s.sand, -0.16) + '"/>',
        '</linearGradient>',
      '</defs>',
      '<rect width="' + W + '" height="' + H + '" fill="url(#sk' + id + ')"/>',
      '<circle cx="' + (key === 'sunset' ? 420 : 138) + '" cy="' + (key === 'sunset' ? 232 : 118) + '" r="' +
        (key === 'sunset' ? 52 : 38) + '" fill="' + s.sun + '" opacity=".9"/>',
      '<circle cx="' + (key === 'sunset' ? 420 : 138) + '" cy="' + (key === 'sunset' ? 232 : 118) + '" r="' +
        (key === 'sunset' ? 86 : 64) + '" fill="' + s.sun + '" opacity=".4" filter="url(#mw-glow)"/>',
      '<g fill="#FFFFFF" opacity=".2"><ellipse cx="180" cy="96" rx="130" ry="13"/><ellipse cx="430" cy="146" rx="96" ry="9"/></g>',
      '<g style="color:' + shade(s.sky[0], -0.45) + '">' + gull(452, 92, 1.1) + gull(506, 128, 0.8) + gull(388, 66, 0.7) + '</g>',
      '<rect y="' + horizon + '" width="' + W + '" height="' + (H - horizon) + '" fill="url(#se' + id + ')"/>',
      key === 'sunset'
        ? '<g opacity=".55" fill="' + s.sun + '">' +
          '<ellipse cx="420" cy="300" rx="30" ry="4"/><ellipse cx="420" cy="322" rx="46" ry="5"/>' +
          '<ellipse cx="420" cy="348" rx="34" ry="4"/><ellipse cx="420" cy="374" rx="56" ry="6"/></g>'
        : '',
      '<g opacity=".5" fill="none" stroke="' + mix(s.sea, '#ffffff', 0.55) + '" stroke-width="3" stroke-linecap="round">',
        '<path d="' + waveLine(600, 120, 4, 286) + '"/>',
        '<path d="' + waveLine(600, 96, 3.5, 318) + '" opacity=".75"/>',
      '</g>',
      extras,
      '<path d="' + wavePath(600, 150, 9, 372, H) + '" fill="url(#sa' + id + ')"/>',
      '<path d="' + waveLine(600, 150, 9, 372) + '" fill="none" stroke="#ffffff" stroke-width="3.5" opacity=".55"/>',
      (opts.figure === false ? '' : figure(opts.fx || 292, opts.fy || 300, opts.fs || 2.25, false)),
      (opts.pair && opts.figure !== false ? figure(408, 330, 1.7, true) : ''),
      '<rect width="' + W + '" height="' + H + '" filter="url(#mw-grain)" opacity=".05" style="mix-blend-mode:multiply"/>',
      '</svg>'
    ].join('');
  }

  /* --------------------------------------------------------------- the hero */

  function hero() {
    injectDefs();
    var id = uid('hero');
    var W = 1200, H = 800;
    return [
      '<svg class="hero__svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" ',
        'role="img" aria-label="The Mediterranean at first light, seen from the Alexandria shore">',
      '<defs>',
        '<linearGradient id="sky' + id + '" x1="0" y1="0" x2=".2" y2="1">',
          '<stop offset="0" stop-color="#16456B"/>',
          '<stop offset=".34" stop-color="#3D82A6"/>',
          '<stop offset=".62" stop-color="#93C2CC"/>',
          '<stop offset=".84" stop-color="#EBD3AE"/>',
          '<stop offset="1" stop-color="#F3C293"/>',
        '</linearGradient>',
        '<linearGradient id="sea' + id + '" x1="0" y1="0" x2="0" y2="1">',
          '<stop offset="0" stop-color="#D9B68C"/>',
          '<stop offset=".18" stop-color="#4C88A4"/>',
          '<stop offset="1" stop-color="#103B58"/>',
        '</linearGradient>',
        '<radialGradient id="sun' + id + '" cx=".5" cy=".5" r=".5">',
          '<stop offset="0" stop-color="#FFF0D0"/>',
          '<stop offset=".55" stop-color="#F8C98A"/>',
          '<stop offset="1" stop-color="#F0A96A" stop-opacity="0"/>',
        '</radialGradient>',
      '</defs>',

      '<rect width="' + W + '" height="' + H + '" fill="url(#sky' + id + ')"/>',

      // sun + halo just above the horizon
      '<circle cx="836" cy="436" r="210" fill="url(#sun' + id + ')" opacity=".85"/>',
      '<circle cx="836" cy="436" r="58" fill="#FFF3DB" opacity=".95"/>',

      // cloud bands
      '<g fill="#FFFFFF" opacity=".16">',
        '<ellipse cx="290" cy="168" rx="220" ry="21"/>',
        '<ellipse cx="420" cy="214" rx="150" ry="14"/>',
        '<ellipse cx="930" cy="150" rx="190" ry="17"/>',
      '</g>',

      // Alexandria on the far right: Qaitbay citadel + the lighthouse we lost
      '<g opacity=".34" fill="#0E3550">',
        '<rect x="1044" y="392" width="120" height="66"/>',
        '<rect x="1060" y="360" width="30" height="34"/>',
        '<rect x="1112" y="368" width="22" height="26"/>',
        '<rect x="1068" y="344" width="14" height="18"/>',
        '<path d="M1030,458 L1178,458 L1186,470 L1022,470 Z"/>',
        '<g transform="translate(962,0)">',
          '<path d="M-9,458 L-5,372 L5,372 L9,458 Z"/>',
          '<rect x="-8" y="356" width="16" height="16" rx="2"/>',
          '<path d="M-5,356 L0,344 L5,356 Z"/>',
        '</g>',
      '</g>',
      '<g style="color:#0E3550">' + gull(196, 140, 1.7) + gull(288, 196, 1.2) + gull(1006, 186, 1.35) + gull(1082, 240, 0.9) + '</g>',

      // sea
      '<rect y="458" width="' + W + '" height="' + (H - 458) + '" fill="url(#sea' + id + ')"/>',
      // sun path on the water
      '<g fill="#F6D8A8" opacity=".45">',
        '<ellipse cx="836" cy="486" rx="42" ry="4"/><ellipse cx="836" cy="512" rx="72" ry="5"/>',
        '<ellipse cx="836" cy="544" rx="52" ry="5"/><ellipse cx="836" cy="580" rx="96" ry="7"/>',
        '<ellipse cx="836" cy="622" rx="68" ry="6"/><ellipse cx="836" cy="668" rx="120" ry="8"/>',
      '</g>',

      // four parallax wave layers, each seamless over 2400 units
      '<g class="hero__waves">',
        '<g class="hero__wave hero__wave--1">',
          '<path d="' + wavePath(2400, 300, 13, 548, 820) + '" fill="#2D6C90" opacity=".55"/>',
        '</g>',
        '<g class="hero__wave hero__wave--2">',
          '<path d="' + wavePath(2400, 240, 17, 604, 820) + '" fill="#1E5478" opacity=".7"/>',
        '</g>',
        '<g class="hero__wave hero__wave--3">',
          '<path d="' + wavePath(2400, 200, 15, 664, 820) + '" fill="#153F5E"/>',
          '<path d="' + waveLine(2400, 200, 15, 664) + '" fill="none" stroke="#9FD3D0" stroke-width="3" opacity=".5"/>',
        '</g>',
        '<g class="hero__wave hero__wave--4">',
          '<path d="' + wavePath(2400, 160, 11, 726, 820) + '" fill="#0C2B44"/>',
          '<path d="' + waveLine(2400, 160, 11, 726) + '" fill="none" stroke="#BFE3DF" stroke-width="3.5" opacity=".45"/>',
        '</g>',
      '</g>',

      '<rect width="' + W + '" height="' + H + '" filter="url(#mw-grain)" opacity=".055" style="mix-blend-mode:multiply"/>',
      '</svg>'
    ].join('');
  }

  /** Wide editorial frame for the story section. */
  function storyScene() {
    injectDefs();
    var id = uid('st');
    var W = 900, H = 1100;
    return [
      '<svg class="story__svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" ',
        'role="img" aria-label="Rocks and shallow water on the eastern harbour at golden hour">',
      '<defs>',
        '<linearGradient id="ssky' + id + '" x1="0" y1="0" x2="0" y2="1">',
          '<stop offset="0" stop-color="#7FB2C4"/><stop offset=".55" stop-color="#D8DCC8"/>',
          '<stop offset="1" stop-color="#F0C99B"/>',
        '</linearGradient>',
        '<linearGradient id="ssea' + id + '" x1="0" y1="0" x2="0" y2="1">',
          '<stop offset="0" stop-color="#3E8296"/><stop offset=".5" stop-color="#256A8C"/>',
          '<stop offset="1" stop-color="#17485F"/>',
        '</linearGradient>',
      '</defs>',
      '<rect width="' + W + '" height="' + H + '" fill="url(#ssky' + id + ')"/>',
      '<circle cx="612" cy="404" r="132" fill="#F7DCB0" opacity=".55" filter="url(#mw-glow)"/>',
      '<circle cx="612" cy="404" r="44" fill="#FFF1D6" opacity=".9"/>',
      '<g style="color:#2A5468">' + gull(190, 214, 1.5) + gull(268, 268, 1) + gull(700, 180, 1.2) + '</g>',
      '<rect y="470" width="' + W + '" height="' + (H - 470) + '" fill="url(#ssea' + id + ')"/>',
      '<g fill="#F7DCB0" opacity=".38">',
        '<ellipse cx="612" cy="500" rx="40" ry="4"/><ellipse cx="612" cy="536" rx="70" ry="5"/>',
        '<ellipse cx="612" cy="578" rx="52" ry="5"/><ellipse cx="612" cy="624" rx="88" ry="7"/>',
      '</g>',
      '<g class="story__waves">',
        '<path d="' + wavePath(1800, 300, 12, 606, 1100) + '" fill="#1F5F7E" opacity=".6"/>',
        '<path d="' + wavePath(1800, 225, 15, 686, 1100) + '" fill="#17485F" opacity=".85"/>',
      '</g>',
      '<path d="' + wavePath(1800, 180, 10, 790, 1100) + '" fill="#0F3A4E" opacity=".92"/>',
      '<path d="' + waveLine(1800, 180, 10, 790) + '" fill="none" stroke="#C7E6E0" stroke-width="4" opacity=".4"/>',
      // foreground rocks, in front of the last wave so they hold the frame
      '<g fill="#2C383D">',
        '<path d="M-40,1100 C-20,972 96,916 196,962 C278,1000 306,1060 296,1100 Z"/>',
        '<path d="M548,1100 C560,1008 656,946 762,974 C864,1000 922,1054 944,1100 Z"/>',
      '</g>',
      '<g fill="#45575E">',
        '<path d="M286,1100 C308,1040 392,1014 466,1048 C522,1074 544,1092 552,1100 Z"/>',
        '<path d="M120,986 C150,944 206,948 234,986 C256,1016 228,1046 184,1048 C136,1050 98,1016 120,986 Z" opacity=".75"/>',
      '</g>',
      // foam breaking over the rocks
      '<path d="' + waveLine(1800, 150, 7, 1006) + '" fill="none" stroke="#C7E6E0" stroke-width="5" opacity=".38"/>',
      '<rect width="' + W + '" height="' + H + '" filter="url(#mw-grain)" opacity=".06" style="mix-blend-mode:multiply"/>',
      '</svg>'
    ].join('');
  }

  /* -------------------------------------------------- collection tile art */

  function collectionArt(key) {
    injectDefs();
    var id = uid('ca');
    var W = 600, H = 760;
    var sets = {
      ocean:    { bg: ['#1B5E85', '#0C2E47'], ink: '#CBE6E2', warm: '#8FC6D4' },
      coral:    { bg: ['#E9AE96', '#C4664C'], ink: '#FBF3E6', warm: '#F6D3BE' },
      sunset:   { bg: ['#F0B071', '#C9603F'], ink: '#FFF3DC', warm: '#FAD9A8' },
      tropical: { bg: ['#3E9A8E', '#1F5E52'], ink: '#EFE6CE', warm: '#9ED2B8' },
      minimal:  { bg: ['#EFE5D3', '#D3BF9E'], ink: '#123350', warm: '#FBF5EA' }
    };
    var s = sets[key] || sets.ocean;
    var body = '';

    if (key === 'ocean') {
      body = '<g fill="none" stroke="' + s.ink + '" stroke-linecap="round">' +
        [0, 1, 2, 3, 4, 5, 6].map(function (i) {
          return '<path d="' + waveLine(600, 150, 16, 300 + i * 64) + '" stroke-width="' + (7 - i * 0.5) +
            '" opacity="' + (0.85 - i * 0.08) + '"/>';
        }).join('') + '</g>' +
        '<circle cx="300" cy="196" r="62" fill="none" stroke="' + s.warm + '" stroke-width="6" opacity=".8"/>';
    } else if (key === 'coral') {
      body = [[120, 700], [210, 720], [300, 710], [396, 722], [486, 700]].map(function (p, n) {
        var h = 250 + (n % 3) * 90, sw = n % 2 ? 24 : -24;
        return '<g stroke="' + s.ink + '" stroke-width="14" fill="none" stroke-linecap="round" opacity="' + (0.95 - (n % 3) * 0.14) + '">' +
          '<path d="M' + p[0] + ',' + p[1] + ' C' + (p[0] + sw) + ',' + (p[1] - h * 0.5) + ' ' + (p[0] - sw) + ',' + (p[1] - h * 0.76) + ' ' + (p[0] + sw * 0.4) + ',' + (p[1] - h) + '"/>' +
          '<path d="M' + p[0] + ',' + (p[1] - h * 0.5) + ' C' + (p[0] + sw * 2.2) + ',' + (p[1] - h * 0.66) + ' ' + (p[0] + sw * 2.6) + ',' + (p[1] - h * 0.8) + ' ' + (p[0] + sw * 2) + ',' + (p[1] - h * 0.94) + '" stroke-width="10"/>' +
          '</g>';
      }).join('') + '<circle cx="300" cy="182" r="54" fill="' + s.warm + '" opacity=".55"/>';
    } else if (key === 'sunset') {
      body = [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) {
        var r = 90 + i * 52;
        return '<path d="M' + (300 - r) + ',560 A' + r + ',' + r + ' 0 0 1 ' + (300 + r) + ',560" fill="none" stroke="' +
          (i % 2 ? s.ink : s.warm) + '" stroke-width="20" opacity="' + (0.92 - i * 0.08) + '" stroke-linecap="round"/>';
      }).join('') + '<circle cx="300" cy="560" r="58" fill="' + s.ink + '"/>' +
        '<path d="' + wavePath(600, 200, 14, 612, 760) + '" fill="#8C4632" opacity=".55"/>';
    } else if (key === 'tropical') {
      body = [[110, 700, -26], [300, 720, 0], [490, 700, 26], [200, 740, -14], [400, 740, 14]].map(function (f, n) {
        var g = ['<g transform="translate(' + f[0] + ',' + f[1] + ') rotate(' + f[2] + ') scale(' + (n % 2 ? 1.5 : 2) + ')" stroke="' + s.ink + '" fill="none" stroke-linecap="round" opacity="' + (n % 2 ? 0.7 : 1) + '">'];
        g.push('<path d="M0,0 C5,-60 5,-120 0,-180" stroke-width="5"/>');
        for (var i = 1; i <= 8; i++) {
          var ly = -20 - i * 19, lw = 46 - i * 3.6;
          g.push('<path d="M0,' + ly + ' C' + (-lw * 0.6) + ',' + (ly - 8) + ' ' + (-lw) + ',' + (ly - 18) + ' ' + (-lw - 6) + ',' + (ly - 30) + '" stroke-width="4"/>');
          g.push('<path d="M0,' + ly + ' C' + (lw * 0.6) + ',' + (ly - 8) + ' ' + lw + ',' + (ly - 18) + ' ' + (lw + 6) + ',' + (ly - 30) + '" stroke-width="4"/>');
        }
        return g.join('') + '</g>';
      }).join('') + '<circle cx="300" cy="212" r="76" fill="' + s.warm + '" opacity=".4"/>';
    } else {
      body = '<g fill="none" stroke="' + s.ink + '" stroke-linecap="round" opacity=".9">' +
        '<path d="M150,400 q40,-34 80,0 t80,0 t80,0" stroke-width="9"/>' +
        '<path d="M180,452 q34,-28 68,0 t68,0" stroke-width="7" opacity=".6"/>' +
        '</g>' +
        '<circle cx="300" cy="400" r="176" fill="none" stroke="' + s.ink + '" stroke-width="2" opacity=".35"/>' +
        '<path d="' + wavePath(600, 300, 10, 640, 760) + '" fill="' + s.warm + '" opacity=".8"/>';
    }

    return [
      '<svg class="tile__svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">',
      '<defs><linearGradient id="tg' + id + '" x1=".1" y1="0" x2=".9" y2="1">',
        '<stop offset="0" stop-color="' + s.bg[0] + '"/><stop offset="1" stop-color="' + s.bg[1] + '"/>',
      '</linearGradient></defs>',
      '<rect width="' + W + '" height="' + H + '" fill="url(#tg' + id + ')"/>',
      body,
      '<rect width="' + W + '" height="' + H + '" filter="url(#mw-grain)" opacity=".07" style="mix-blend-mode:multiply"/>',
      '</svg>'
    ].join('');
  }

  /* ------------------------------------------------------------- identity */

  function logo(opts) {
    opts = opts || {};
    var color = opts.color || 'currentColor';
    return '<svg class="logo" viewBox="0 0 220 74" role="img" aria-label="mawjat">' +
      '<text x="110" y="44" text-anchor="middle" font-family="Fraunces, Georgia, serif" ' +
        'font-size="42" font-weight="600" letter-spacing="-.5" fill="' + color + '">mawjat</text>' +
      '<path d="M46,58 q16,-11 32,0 t32,0 t32,0 t32,0" fill="none" stroke="' + color + '" ' +
        'stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M62,68 q14,-9 28,0 t28,0 t28,0" fill="none" stroke="' + color + '" ' +
        'stroke-width="3.6" stroke-linecap="round" opacity=".55"/>' +
      '</svg>';
  }

  function mark(opts) {
    opts = opts || {};
    var color = opts.color || 'currentColor';
    return '<svg class="mark" viewBox="0 0 40 26" aria-hidden="true" focusable="false">' +
      '<path d="M3,10 q6,-7 12,0 t12,0 t10,0" fill="none" stroke="' + color + '" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M3,19 q6,-7 12,0 t12,0 t10,0" fill="none" stroke="' + color + '" stroke-width="3.4" stroke-linecap="round" opacity=".5"/>' +
      '</svg>';
  }

  /** Section divider. variant: 'down' sits at a section foot, 'up' at its head. */
  function divider(fill, variant) {
    var d = variant === 'up'
      ? waveLine(1200, 300, 16, 32) + ' L1200,0 L0,0 Z'
      : waveLine(1200, 300, 16, 32) + ' L1200,80 L0,80 Z';
    return '<svg class="divider" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<path d="' + d + '" fill="' + fill + '"/></svg>';
  }

  function avatar(review) {
    var id = uid('av');
    var tones = ['#1F6A94', '#DE6349', '#2F8F89', '#C79A34', '#123350', '#C4765A'];
    var tone = tones[(review.name.charCodeAt(0) + review.name.length) % tones.length];
    return '<svg class="avatar__svg" viewBox="0 0 80 80" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="av' + id + '"><circle cx="40" cy="40" r="40"/></clipPath></defs>' +
      '<g clip-path="url(#av' + id + ')">' +
      '<rect width="80" height="80" fill="' + mix(tone, '#ffffff', 0.74) + '"/>' +
      '<path d="M0,58 q20,-12 40,0 t40,0 L80,80 L0,80 Z" fill="' + mix(tone, '#ffffff', 0.5) + '"/>' +
      '<g transform="translate(40,46) scale(.82) translate(-40,-46)">' +
      '<rect x="34" y="52" width="12" height="14" rx="5" fill="' + mix(tone, '#0B2135', 0.22) + '"/>' +
      '<path d="M10,80 C10,64 23,58 40,58 C57,58 70,64 70,80 Z" fill="' + mix(tone, '#0B2135', 0.48) + '"/>' +
      '<circle cx="40" cy="44" r="15" fill="' + mix(tone, '#0B2135', 0.16) + '"/>' +
      '<path d="M20,30 C20,39 29,44 40,44 C51,44 60,39 60,30 Z" fill="' + shade(tone, -0.16) + '"/>' +
      '<path d="M27,30 C27.5,19 29,13 32,10 C35,7 45,7 48,10 C51,13 52.5,19 53,30 Z" fill="' + tone + '"/>' +
      '<path d="M34,22 q3,-3 6,0 t6,0" fill="none" stroke="' + mix(tone, '#FFFFFF', 0.72) + '" stroke-width="2" stroke-linecap="round"/>' +
      '</g></g></svg>';
  }

  /* ---------------------------------------------------------------- export */
  M.art = {
    hat: hat,
    flatLay: flatLay,
    detailCrop: detailCrop,
    scene: scene,
    hero: hero,
    storyScene: storyScene,
    collectionArt: collectionArt,
    logo: logo,
    mark: mark,
    divider: divider,
    avatar: avatar,
    wavePath: wavePath,
    waveLine: waveLine,
    injectDefs: injectDefs,
    /** Full gallery for a product detail page. */
    gallery: function (product, way) {
      return [
        { label: 'Front', html: hat(way, product.motif, product.patch) },
        { label: 'Worn', html: scene('beach', way, { label: product.name + ' worn on the shore' }) },
        { label: 'Top', html: flatLay(way, product.motif) },
        { label: 'Detail', html: detailCrop(way, product.motif) }
      ];
    }
  };
})(window.MAWJAT);
