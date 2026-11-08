// Del Webb at Viera new-home prices by collection (2026-11-08, per Ryan):
// Google's AI answer quotes Del Webb's own "$363,990+" and our page had
// collection sizes but no builder prices. These are the "Starting From"
// prices on delwebb.com's Del Webb at Viera page (base price for each plan;
// options and lot premiums add to it). Del Webb also sells move-in-ready
// homes, which show up in the MLS listings on the page.
// Prices change: update `asOf` with each new round of numbers.
export const DEL_WEBB_VIERA_SLUG = 'del-webb-viera';
export const DEL_WEBB_VIERA_AS_OF = 'November 2026';

export const DEL_WEBB_VIERA_COLLECTIONS = [
  {
    name: 'Villa',
    from: '$363,990',
    plan: 'Ellenwood villa',
    specs: '1,579 sq ft, 1 story, 2–3 bedrooms, 2 baths, 2-car garage',
    top: null,
    note: 'One villa plan',
  },
  {
    name: 'Scenic',
    from: '$387,990',
    plan: 'Contour',
    specs: '1,405+ sq ft, 1 story, 2 bedrooms, 2 baths, 2-car garage',
    top: '$417,990',
    topPlan: 'Hallmark',
    note: 'Three single-family plans averaging about 1,471 sq ft',
  },
  {
    name: 'Distinctive',
    from: '$530,990',
    plan: 'Prosperity',
    specs: '1,670+ sq ft, 1 story, 2–3 bedrooms, 2 baths, 2-car garage',
    top: '$574,990',
    topPlan: 'Prestige',
    note: 'Five mid-size single-family plans',
  },
  {
    name: 'Echelon',
    from: '$683,990',
    plan: 'Stardom',
    specs: '2,269+ sq ft, 1 story, 2–3 bedrooms, 2.5–3.5 baths, 2–3-car garage',
    top: '$761,490',
    topPlan: 'Stellar Grand (3,453+ sq ft, 2 stories)',
    note: 'The largest single-family plans',
  },
];

const SOURCE = `based on Del Webb’s ${DEL_WEBB_VIERA_AS_OF} starting prices`;

/** Line added to the live "How much do homes cost?" answer. */
export function delWebbVieraPriceGuide(slug) {
  if (slug !== DEL_WEBB_VIERA_SLUG) return null;
  return (
    `New Del Webb homes start at $363,990 for the Ellenwood villa, $387,990 in the Scenic collection, ` +
    `$530,990 in the Distinctive collection and $683,990 in the Echelon collection, ${SOURCE}.`
  );
}

export function delWebbVieraFaq(slug) {
  if (slug !== DEL_WEBB_VIERA_SLUG) return [];
  return [
    {
      q: 'How much is a new Del Webb home in Viera?',
      a:
        `New homes at Del Webb at Viera start at $363,990 for the Ellenwood villa (1,579 sq ft). ` +
        DEL_WEBB_VIERA_COLLECTIONS.filter((c) => c.top)
          .map((c) => `${c.name} collection homes run ${c.from} (${c.plan}) to ${c.top} (${c.topPlan.replace(/ \(.*\)$/, '')})`)
          .join('; ') +
        `, ${SOURCE}. These are base prices; options, upgrades and lot premiums add to the price, and Del Webb also sells ` +
        'move-in-ready homes, which appear in the MLS listings on this page. Del Webb’s sales center and models are at ' +
        '8926 Coventina Way, Melbourne, FL 32940. Contact Ryan before your first visit so he can represent you at no cost to you.',
    },
  ];
}
