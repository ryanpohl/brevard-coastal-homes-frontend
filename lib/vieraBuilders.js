// Viera Builders starting prices (2026-11-07, per Ryan): Google's AI was
// quoting old prices (e.g. Laurasia "$775,400"). These are the builder's
// own current base prices, read from the price feed behind
// vierabuilders.com's neighborhood and floor-plan pages, for the
// lowest-priced plan with its standard elevation (other elevations cost
// more). The builder doesn't publish build times. Shown on each Viera
// Builders neighborhood page and the Viera Builders Communities page
// (components/VieraBuilderPrices.js) and in their FAQ answers.
// Prices change: update `asOf` with each new round of numbers.
export const VIERA_BUILDERS_AS_OF = 'November 2026';

export const VIERA_BUILDERS_PRICES = [
  {
    slug: 'laurasia',
    name: 'Laurasia',
    from: '$790,400',
    plan: 'Carrington',
    specs: '2,672 sq ft, 1 story, 4 bedrooms, 3.5 baths, 2-car garage',
    top: '$971,400', topPlan: 'Altamura II',
    note: 'Laurasia is gated, with Silverado and Inglenook collections',
  },
  {
    // Per Ryan 2026-11-08: the builder's single-family homes are sold out
    // and only its last finished villas are left (listed as condos on the
    // MLS, e.g. $407,900 and $447,900 that day), so no base price here: the
    // table and answers point to the live villa listings instead.
    slug: 'pangea-park',
    name: 'Pangea Park',
    href: '/neighborhoods/pangea-park/condos-for-sale',
    remainingOnly: true,
    from: 'See villa listings',
    plan: 'Last finished villas',
    specs: '3 bedrooms, 2 baths, about 1,480–1,920 sq ft, maintenance-free',
    note: 'Viera Builders’ single-family homes are sold out; only its last finished villas are left',
  },
  {
    slug: 'reeling-park',
    name: 'Reeling Park',
    from: '$497,900',
    plan: 'Alora II',
    specs: '1,850 sq ft, 2 stories, 3 bedrooms, 2.5 baths, 2-car garage',
    top: '$678,900', topPlan: 'Mecina II',
    note: 'San Marco courtyard homes start at $497,900 and the larger Castillo homes at $617,900',
  },
  {
    slug: 'farallon-fields',
    name: 'Farallon Fields',
    from: '$517,400',
    plan: 'Charlotte',
    specs: '1,721 sq ft, 1 story, 3 bedrooms, 2 baths, 2-car garage',
    top: '$905,400', topPlan: 'Renwick',
    note: 'The gated section starts at $761,400 (Raiford)',
  },
  {
    slug: 'crossmolina',
    name: 'Crossmolina',
    from: '$550,900',
    plan: 'Morgan',
    specs: '1,960 sq ft, 1 story, 2 bedrooms, 2.5 baths, 2-car garage',
    top: '$735,900', topPlan: 'Easton II',
    note: 'The gated section starts at $612,900',
  },
  {
    slug: 'atlin-cove',
    name: 'Atlin Cove',
    from: '$457,000',
    plan: 'Brisa',
    specs: '1,692 sq ft, 3 bedrooms, 2 baths, 2-car garage',
    top: '$597,000', topPlan: 'Crystal',
    note: 'Atlin Cove is Viera Builders’ newest community',
  },
];

export const VIERA_BUILDERS_PAGE_SLUG = 'viera-builders-communities-viera-west';

export function vieraBuilderPrice(slug) {
  return VIERA_BUILDERS_PRICES.find((c) => c.slug === slug) || null;
}

/** Shows the table on the Viera Builders Communities page and each of its neighborhoods. */
export function showsVieraBuilderPrices(slug) {
  return slug === VIERA_BUILDERS_PAGE_SLUG || Boolean(vieraBuilderPrice(slug));
}

const SOURCE = `based on Viera Builders’ ${VIERA_BUILDERS_AS_OF} base prices`;
const PRICED = VIERA_BUILDERS_PRICES.filter((c) => !c.remainingOnly);
const PANGEA_LINE =
  'In Pangea Park, Viera Builders’ single-family homes are sold out and the builder is selling its last finished villas, which the MLS lists as condos.';
const RYAN = ' Contact Ryan before your first model visit so he can represent you at no cost to you.';

/** One-line price guide for the live "How much do homes cost?" answer. */
export function vieraBuilderPriceGuide(slug) {
  if (slug === VIERA_BUILDERS_PAGE_SLUG) {
    return `New Viera Builders homes start at ${PRICED.map((c) => `${c.from} in ${c.name}`).join(', ')}, ${SOURCE}. ${PANGEA_LINE}`;
  }
  const c = vieraBuilderPrice(slug);
  if (c?.remainingOnly) return PANGEA_LINE;
  return c ? `New Viera Builders homes in ${c.name} start at ${c.from} with the ${c.plan} plan, ${SOURCE}.` : null;
}

/** Builder-price FAQ for the Viera Builders pages. */
export function vieraBuilderFaq(slug) {
  if (slug === VIERA_BUILDERS_PAGE_SLUG) {
    return [
      {
        q: 'How much do new Viera Builders homes cost?',
        a:
          `New Viera Builders homes in Viera West start at: ` +
          PRICED.map((c) => `${c.name} ${c.from} (${c.plan} plan, up to ${c.top})`).join('; ') +
          `, ${SOURCE}. These are base prices for each plan’s standard elevation; other elevations, options and lot premiums add to the price. ${PANGEA_LINE}` +
          RYAN,
      },
    ];
  }
  const c = vieraBuilderPrice(slug);
  if (!c) return [];
  if (c.remainingOnly) {
    return [
      {
        q: `Is Viera Builders still building in ${c.name}?`,
        a: `${PANGEA_LINE} See the current villas and prices at brevardcoastalhomes.com${c.href}.` + RYAN,
      },
    ];
  }
  return [
    {
      q: `How much is a new Viera Builders home in ${c.name}?`,
      a:
        `New Viera Builders homes in ${c.name} start at ${c.from} with the ${c.plan} plan (${c.specs}) and run up to ${c.top} for the ${c.topPlan}, ${SOURCE}. ` +
        `${c.note}. These are base prices for each plan’s standard elevation; other elevations, options and lot premiums add to the price.` +
        RYAN,
    },
  ];
}
