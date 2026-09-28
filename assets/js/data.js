/* ==========================================================================
   mawjat - catalogue
   Products, colorways, collections, reviews, lookups.
   A colorway only carries four brand colours; every other tone used by the
   SVG renderer is derived from them, so new colourways stay consistent.
   ========================================================================== */
(function (M) {
  'use strict';

  var P = {
    ink:        '#0B2135',
    navy:       '#123350',
    navySoft:   '#1B4E74',
    sea:        '#1F6A94',
    seaLight:   '#3E90B8',
    teal:       '#2F8F89',
    turq:       '#43A9A1',
    turqLight:  '#7FC8C1',
    foam:       '#C6E3DF',
    sand:       '#DCC3A0',
    sandLight:  '#EDDFC6',
    ecru:       '#F1E7D7',
    cream:      '#FAF5EB',
    ivory:      '#FFFCF5',
    coral:      '#DE6349',
    coralSoft:  '#EE9880',
    blush:      '#E9C6B6',
    clay:       '#C4765A',
    amber:      '#E0A153',
    gold:       '#C79A34',
    olive:      '#6E8258',
    moss:       '#4E6A4C'
  };

  /** Prices are stored in USD; this converts an EGP price into that base. */
  function egp(amount) { return amount / M.currencies.EGP.rate; }

  // Every hat sells at the same price.
  var HAT_PRICE = egp(400);

  /** way(name, swatch, crown, brim, motif, binding) */
  function way(name, crown, brim, motif, binding) {
    return {
      name: name,
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      swatch: crown,
      crown: crown, brim: brim, motif: motif, binding: binding || motif
    };
  }

  var COLLECTIONS = [
    {
      key: 'ocean',
      name: 'Ocean',
      kicker: '01',
      tagline: 'Cold blue mornings, long swells',
      blurb: 'Deep indigo, washed navy and open-water blues. Built for the hour before the beach fills up.',
      art: 'ocean'
    },
    {
      key: 'coral',
      name: 'Coral',
      kicker: '02',
      tagline: 'Reef colour, worn loud',
      blurb: 'Warm clay, shell pink and coral thread. The brightest thing in the water, on purpose.',
      art: 'coral'
    },
    {
      key: 'sunset',
      name: 'Sunset',
      kicker: '03',
      tagline: 'The last hour of light',
      blurb: 'Amber, sand and burnt orange, pulled straight from the Corniche at golden hour.',
      art: 'sunset'
    },
    {
      key: 'tropical',
      name: 'Tropical',
      kicker: '04',
      tagline: 'Palms, salt and shade',
      blurb: 'Green fronds and humid blues for long afternoons that refuse to end.',
      art: 'tropical'
    },
    {
      key: 'minimal',
      name: 'Minimal Coast',
      kicker: '05',
      tagline: 'Quiet tones, clean lines',
      blurb: 'Undyed cotton, one small embroidered mark. Everything else left to the sea.',
      art: 'minimal'
    }
  ];

  var PRODUCTS = [
    {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      collection: 'ocean',
      price: HAT_PRICE,
      motif: 'waves',
      patch: 'tag',
      badge: 'Bestseller',
      rating: 4.8,
      reviewCount: 214,
      order: 1,
      released: '2026-03-02',
      tagline: 'Washed navy twill with a full swell embroidered across the crown.',
      story: 'The first hat we ever cut. A single swell runs the whole way around the crown, stitched in sand thread so it catches light the way water does just after sunrise. Garment-washed twice so it arrives already broken in.',
      fabric: '14 oz garment-washed cotton twill',
      colorways: [
        way('Midnight Swell', P.navy, P.navy, P.sandLight, P.sandLight),
        way('Harbour Grey', '#4A5A66', '#4A5A66', P.ecru, P.ecru),
        way('Salt White', P.ivory, P.ivory, P.navySoft, P.navySoft)
      ],
      sizes: ['S/M', 'L/XL'],
      details: [
        'Embroidered swell motif, 6 mm satin stitch',
        'Reversible crown with contrast under-brim',
        'Brass side eyelets for airflow',
        'Woven mawjat label on the lower crown'
      ]
    },
    {
      id: 'coral-reef',
      name: 'Coral Reef',
      collection: 'coral',
      price: HAT_PRICE,
      motif: 'coral',
      patch: 'circle',
      badge: 'Limited',
      rating: 4.9,
      reviewCount: 138,
      order: 2,
      released: '2026-05-18',
      tagline: 'Hand-drawn reef branches printed in clay and coral on heavy cream cotton.',
      story: 'Drawn from a morning of snorkelling off the eastern harbour, then screen-printed by hand in four passes. No two crowns land exactly the same, which is the point.',
      fabric: '12 oz cream canvas, hand screen-printed',
      colorways: [
        way('Reef Cream', P.cream, P.cream, P.coral, P.clay),
        way('Deep Clay', P.clay, P.clay, P.sandLight, P.blush),
        way('Shell Blush', P.blush, P.blush, P.clay, P.clay)
      ],
      sizes: ['S/M', 'L/XL'],
      details: [
        'Four-pass hand screen print, water-based ink',
        'Slight print variation on every hat',
        'Coral thread binding on the brim edge',
        'Enamel reef pin included in the box'
      ]
    },
    {
      id: 'sandy-coast',
      name: 'Sandy Coast',
      collection: 'minimal',
      price: HAT_PRICE,
      motif: 'minimal',
      patch: 'tag',
      badge: null,
      rating: 4.7,
      reviewCount: 302,
      order: 3,
      released: '2026-02-11',
      tagline: 'Undyed cotton, one small wave mark. Nothing else.',
      story: 'The quietest hat in the range. Undyed cotton that fades a half tone every summer, marked with the smallest version of our wave. It goes with everything, which is why it never leaves the shelf for long.',
      fabric: 'Undyed 10 oz organic cotton',
      colorways: [
        way('Raw Sand', P.sand, P.sand, P.navy, P.navy),
        way('Bone', P.ecru, P.ecru, P.teal, P.teal),
        way('Driftwood', '#A8937A', '#A8937A', P.ivory, P.ivory)
      ],
      sizes: ['S/M', 'L/XL', 'One Size'],
      details: [
        'Undyed organic cotton, GOTS certified mill',
        'Single 18 mm embroidered wave',
        'Softest brim in the range, packs flat',
        'Fades gently with sun and salt'
      ]
    },
    {
      id: 'deep-sea',
      name: 'Deep Sea',
      collection: 'ocean',
      price: HAT_PRICE,
      motif: 'fish',
      patch: 'circle',
      badge: null,
      rating: 4.8,
      reviewCount: 96,
      order: 4,
      released: '2026-04-06',
      tagline: 'A school of small fish, stitched in foam thread on deep indigo.',
      story: 'Indigo dipped three times until it reads almost black in shade and blue in sun. Forty-one fish circle the crown. We counted.',
      fabric: 'Triple-dipped indigo cotton drill',
      colorways: [
        way('Indigo Deep', P.ink, P.ink, P.foam, P.turq),
        way('Tide Teal', P.teal, P.teal, P.cream, P.cream),
        way('Storm Blue', P.sea, P.sea, P.sandLight, P.sandLight)
      ],
      sizes: ['S/M', 'L/XL'],
      details: [
        'Triple-dipped indigo, deepens in shade',
        '41 embroidered fish around the crown',
        'Foam-thread contrast topstitch',
        'Water-repellent finish'
      ]
    },
    {
      id: 'sunset-wave',
      name: 'Sunset Wave',
      collection: 'sunset',
      price: HAT_PRICE,
      motif: 'sunburst',
      patch: 'circle',
      badge: 'New',
      rating: 4.9,
      reviewCount: 74,
      order: 5,
      released: '2026-08-21',
      tagline: 'A low sun breaking over the brim in amber and burnt orange.',
      story: 'Seven arcs of thread, each a half tone warmer than the last, so the crown reads like the sky does between seven and eight in the evening. Our most requested design before it existed.',
      fabric: '12 oz sun-washed cotton twill',
      colorways: [
        way('Golden Hour', P.sandLight, P.sandLight, P.amber, P.coral),
        way('Burnt Orange', P.coral, P.coral, P.cream, P.sandLight),
        way('Dusk Navy', P.navy, P.navy, P.amber, P.amber)
      ],
      sizes: ['S/M', 'L/XL'],
      details: [
        'Seven-tone graduated embroidery',
        'Sun-washed for an aged finish',
        'Contrast amber under-brim',
        'Arrives in the sunset gift box'
      ]
    },
    {
      id: 'tropical-tide',
      name: 'Tropical Tide',
      collection: 'tropical',
      price: HAT_PRICE,
      motif: 'palm',
      patch: 'tag',
      badge: null,
      rating: 4.6,
      reviewCount: 121,
      order: 6,
      released: '2026-06-09',
      tagline: 'Palm shade and warm water, printed edge to edge.',
      story: 'Built for the walk between the water and somewhere with a fan. Fronds run over the seam and onto the brim, so the pattern never stops where the hat folds.',
      fabric: 'Lightweight cotton poplin',
      colorways: [
        way('Lagoon', P.turq, P.turq, P.cream, P.ivory),
        way('Palm Green', P.moss, P.moss, P.sandLight, P.sandLight),
        way('Warm Sand', P.ecru, P.ecru, P.olive, P.olive)
      ],
      sizes: ['S/M', 'L/XL'],
      details: [
        'Edge-to-edge print across crown and brim',
        'Lightest weight we make, built for heat',
        'Packs into its own inner pocket',
        'Quick-dry lining'
      ]
    },
    {
      id: 'pharos-light',
      name: 'Pharos Light',
      collection: 'minimal',
      price: HAT_PRICE,
      motif: 'lighthouse',
      patch: 'circle',
      badge: 'Limited',
      rating: 5.0,
      reviewCount: 58,
      order: 7,
      released: '2026-07-14',
      tagline: 'The lighthouse that is not there any more, embroidered where it stood.',
      story: 'Our heritage piece. The Pharos stood at the mouth of this harbour for sixteen centuries and we have been looking at the empty water ever since. Stitched in gold thread on ivory, numbered to 500.',
      fabric: 'Ivory heavyweight cotton, gold thread',
      colorways: [
        way('Ivory Gold', P.ivory, P.ivory, P.gold, P.navy),
        way('Harbour Navy', P.navy, P.navy, P.gold, P.gold)
      ],
      sizes: ['S/M', 'L/XL'],
      details: [
        'Numbered edition of 500',
        'Metallic gold thread embroidery',
        'Interior signature lining',
        'Presented in the heritage box with a print'
      ]
    },
    {
      id: 'corniche-stripe',
      name: 'Corniche Stripe',
      collection: 'ocean',
      price: HAT_PRICE,
      motif: 'stripe',
      patch: 'tag',
      badge: null,
      rating: 4.7,
      reviewCount: 167,
      order: 8,
      released: '2026-03-28',
      tagline: 'Wide nautical banding taken from the sea wall and the boats tied to it.',
      story: 'Two centimetres of navy, two of white, repeated the whole way up the crown. The oldest pattern on the water and still the best one.',
      fabric: 'Yarn-dyed striped cotton',
      colorways: [
        way('Navy Stripe', P.navy, P.ivory, P.ivory, P.navy),
        way('Sea Stripe', P.sea, P.cream, P.cream, P.sea),
        way('Coral Stripe', P.coral, P.cream, P.cream, P.coral)
      ],
      sizes: ['S/M', 'L/XL'],
      details: [
        'Yarn-dyed stripe, will not crack or peel',
        'Contrast white brim',
        'Rope-twist binding at the edge',
        'Machine washable at 30 degrees'
      ]
    },
    {
      id: 'shell-bay',
      name: 'Shell Bay',
      collection: 'coral',
      price: HAT_PRICE,
      motif: 'shells',
      patch: 'tag',
      badge: null,
      rating: 4.6,
      reviewCount: 88,
      order: 9,
      released: '2026-05-02',
      tagline: 'Scallop shells scattered across a soft blush crown.',
      story: 'Named for the bay where our first sample photos were shot at six in the morning because it was the only hour without people in the frame.',
      fabric: 'Brushed cotton, blush over-dye',
      colorways: [
        way('Blush Shell', P.blush, P.blush, P.cream, P.clay),
        way('Cream Shell', P.cream, P.cream, P.clay, P.clay),
        way('Rose Clay', '#CE8B76', '#CE8B76', P.ivory, P.ivory)
      ],
      sizes: ['S/M', 'L/XL'],
      details: [
        'Garment over-dye, tone varies slightly',
        'Scattered scallop embroidery',
        'Brushed interior sweatband',
        'Softens with every wash'
      ]
    },
    {
      id: 'mango-sunset',
      name: 'Mango Sunset',
      collection: 'sunset',
      price: HAT_PRICE,
      motif: 'sunburst',
      patch: 'tag',
      badge: 'New',
      rating: 4.8,
      reviewCount: 63,
      order: 10,
      released: '2026-08-30',
      tagline: 'The loudest hat we make, in mango, coral and cream.',
      story: 'Someone on the team said it was too much. It sold out in nine days. We made more.',
      fabric: 'Pigment-dyed cotton canvas',
      colorways: [
        way('Mango', '#E88B3C', '#E88B3C', P.cream, P.cream),
        way('Coral Pop', P.coral, P.coral, P.sandLight, P.sandLight),
        way('Cream Fade', P.cream, P.cream, '#E88B3C', P.coral)
      ],
      sizes: ['S/M', 'L/XL'],
      details: [
        'Pigment dye that fades at the seams',
        'Graduated sun arcs, three thread tones',
        'Cream under-brim',
        'Runs bright, photographs brighter'
      ]
    },
    {
      id: 'palm-hour',
      name: 'Palm Hour',
      collection: 'tropical',
      price: HAT_PRICE,
      motif: 'fronds',
      patch: 'circle',
      badge: null,
      rating: 4.7,
      reviewCount: 79,
      order: 11,
      released: '2026-06-25',
      tagline: 'Long fronds in deep green, cut through with a low white sun.',
      story: 'For the part of the afternoon when the light goes flat and everyone moves under the trees. Deep green crown, single white sun behind the leaves.',
      fabric: 'Washed cotton ripstop',
      colorways: [
        way('Deep Palm', P.moss, P.moss, P.ivory, P.sandLight),
        way('Olive Shade', P.olive, P.olive, P.cream, P.cream),
        way('Sea Palm', P.teal, P.teal, P.sandLight, P.sandLight)
      ],
      sizes: ['S/M', 'L/XL'],
      details: [
        'Cotton ripstop, holds its shape wet',
        'Layered frond embroidery',
        'Hidden inner pocket in the sweatband',
        'Chin cord sold separately'
      ]
    },
    {
      id: 'salt-and-rope',
      name: 'Salt & Rope',
      collection: 'minimal',
      price: HAT_PRICE,
      motif: 'rope',
      patch: 'circle',
      badge: null,
      rating: 4.9,
      reviewCount: 104,
      order: 12,
      released: '2026-04-19',
      tagline: 'A single rope twist running the circumference, in navy on ecru.',
      story: 'Copied, knot for knot, from the mooring line of a fishing boat called Amira that has been tied to the same bollard for thirty years.',
      fabric: 'Heavy ecru cotton, rope-twist embroidery',
      colorways: [
        way('Ecru Rope', P.ecru, P.ecru, P.navy, P.navy),
        way('Navy Rope', P.navy, P.navy, P.ecru, P.ecru),
        way('Sea Rope', P.sea, P.ecru, P.ecru, P.sea)
      ],
      sizes: ['S/M', 'L/XL'],
      details: [
        'Raised rope-twist embroidery, 8 mm',
        'Stiffened brim that holds a curve',
        'Reinforced crown seam',
        'Our most durable construction'
      ]
    }
  ];

  var REVIEWS = [
    {
      name: 'Nour H.',
      handle: '@nourbythesea',
      city: 'Alexandria, EG',
      rating: 5,
      product: 'ocean-blue',
      scene: 'beach',
      text: 'Wore it every day for three weeks in Agami and it still looks better than when it arrived. The brim actually holds its shape.'
    },
    {
      name: 'Léa M.',
      handle: '@leamarchand',
      city: 'Marseille, FR',
      rating: 5,
      product: 'sunset-wave',
      scene: 'sunset',
      text: 'I bought it for the colour and kept it for the fit. It is the only hat I own that does not look silly in photos.'
    },
    {
      name: 'Karim A.',
      handle: '@karimsails',
      city: 'Limassol, CY',
      rating: 5,
      product: 'salt-and-rope',
      scene: 'boat',
      text: 'Took it offshore for four days. Salt, sun, wind, dropped it in the water twice. Rinsed it, dried it, perfect.'
    },
    {
      name: 'Sofia R.',
      handle: '@sofiaronda',
      city: 'Lisbon, PT',
      rating: 4,
      product: 'coral-reef',
      scene: 'coast',
      text: 'The print is so much better in person. Sizing runs slightly large, I went S/M and it is just right.'
    },
    {
      name: 'Yara S.',
      handle: '@yara.slm',
      city: 'Cairo, EG',
      rating: 5,
      product: 'pharos-light',
      scene: 'cafe',
      text: 'The lighthouse detail is what got me. Three separate people asked where it was from on the first day.'
    },
    {
      name: 'Tom B.',
      handle: '@tombrennan',
      city: 'Cornwall, UK',
      rating: 5,
      product: 'deep-sea',
      scene: 'surf',
      text: 'Surf check hat, dog walk hat, everything hat. The indigo has faded exactly the right amount over a summer.'
    }
  ];

  var LIFESTYLE = [
    { key: 'beach',  label: 'Mandara beach, 7:40am',      product: 'ocean-blue' },
    { key: 'surf',   label: 'North swell, Agami',          product: 'deep-sea' },
    { key: 'coast',  label: 'The long walk east',          product: 'sandy-coast' },
    { key: 'cafe',   label: 'Iced coffee, no rush',        product: 'shell-bay' },
    { key: 'boat',   label: 'Out past the breakwater',     product: 'salt-and-rope' },
    { key: 'sunset', label: 'Corniche, last light',        product: 'sunset-wave' }
  ];

  /* ------------------------------------------------------------- lookups */
  function byId(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }

  function colorway(product, id) {
    if (!product) return null;
    if (!id) return product.colorways[0];
    for (var i = 0; i < product.colorways.length; i++) {
      if (product.colorways[i].id === id || product.colorways[i].name === id) return product.colorways[i];
    }
    return product.colorways[0];
  }

  function collection(key) {
    for (var i = 0; i < COLLECTIONS.length; i++) if (COLLECTIONS[i].key === key) return COLLECTIONS[i];
    return null;
  }

  function related(product, count) {
    if (!product) return [];
    var same = PRODUCTS.filter(function (p) { return p.collection === product.collection && p.id !== product.id; });
    var rest = PRODUCTS.filter(function (p) { return p.collection !== product.collection && p.id !== product.id; });
    return same.concat(rest).slice(0, count || 4);
  }

  function reviewsFor(id) {
    return REVIEWS.filter(function (r) { return r.product === id; });
  }

  /** Free-text search over name, collection, tagline and colourway names. */
  function search(term) {
    var q = String(term || '').trim().toLowerCase();
    if (!q) return [];
    var words = q.split(/\s+/);
    return PRODUCTS.map(function (p) {
      var hay = [
        p.name, p.collection, p.tagline, p.motif, p.fabric,
        p.colorways.map(function (c) { return c.name; }).join(' ')
      ].join(' ').toLowerCase();
      var score = 0;
      words.forEach(function (w) {
        if (p.name.toLowerCase().indexOf(w) === 0) score += 6;
        else if (p.name.toLowerCase().indexOf(w) > -1) score += 4;
        if (p.collection.indexOf(w) > -1) score += 2;
        if (hay.indexOf(w) > -1) score += 1;
      });
      return { product: p, score: score };
    }).filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .map(function (r) { return r.product; });
  }

  M.palette = P;
  M.data = {
    products: PRODUCTS,
    collections: COLLECTIONS,
    reviews: REVIEWS,
    lifestyle: LIFESTYLE,
    byId: byId,
    colorway: colorway,
    collection: collection,
    related: related,
    reviewsFor: reviewsFor,
    search: search,
    priceRange: function () {
      var prices = PRODUCTS.map(function (p) { return p.price; });
      return { min: Math.min.apply(null, prices), max: Math.max.apply(null, prices) };
    }
  };
})(window.MAWJAT);
