// Viera Builders prices and inventory. First version 2026-11-07 (per Ryan:
// Google's AI was quoting old prices, e.g. Laurasia "$775,400"), from the
// builder's own base prices behind vierabuilders.com. Updated 2026-11-08
// from Ryan's Viera Builders contact: starting prices confirmed, build time,
// model homes and hours, incentive, Crossmolina and Pangea Park status, and
// the builder's quick move-in inventory sheets (dated Oct 23 – Nov 4, 2026).
// Shown on each Viera Builders neighborhood page and the Viera Builders
// Communities page (components/VieraBuilderPrices.js) and in their FAQs.
// Prices change: update `asOf` and the inventory with each new round.
export const VIERA_BUILDERS_AS_OF = 'November 2026';
export const VIERA_BUILDERS_BUILD_TIME = '7 to 10 months';
export const VIERA_BUILDERS_MODEL_HOURS = 'Monday–Saturday 10 AM–5 PM and Sunday noon–5 PM';
export const VIERA_BUILDERS_INCENTIVE =
  '$50,000 toward structural and design upgrades when you pay cash or use one of Viera Builders’ 6 preferred lenders';

// Quick move-in homes: `price` is the builder's promo price on its
// inventory sheet; `status` is finished or under construction.
const QMI = (address, plan, specs, status, price) => ({ address, plan, specs, status, price });
const DONE = 'Move-in ready';
const BUILDING = 'Under construction';

export const VIERA_BUILDERS_PRICES = [
  {
    slug: 'laurasia',
    name: 'Laurasia',
    from: '$790,400',
    plan: 'Carrington',
    specs: '2,672 sq ft, 1 story, 4 bedrooms, 3.5 baths, 2-car garage',
    top: '$971,400', topPlan: 'Altamura II',
    note: 'Laurasia is gated, with Silverado and Inglenook collections',
    model: '2755 Pelagornis Drive, Viera, FL 32940',
    quickMoveIns: [
      QMI('8675 Seymouria Way', 'Tamber II', '3,702 sq ft, 4 bed + bonus, 4.5 bath, 2-car garage + workshop', DONE, '$1,010,000'),
    ],
  },
  {
    // Per Ryan 2026-11-08: the builder's single-family homes are sold out.
    // It has about 15 move-in-ready villas (listed as condos on the MLS) and
    // will open more villa homesites later.
    slug: 'pangea-park',
    name: 'Pangea Park',
    href: '/neighborhoods/pangea-park/condos-for-sale',
    from: '$407,900',
    plan: 'Iris villa, move-in ready',
    specs: '1,481 sq ft, 3 bedrooms, 2 baths, 2-car garage',
    top: '$506,300', topPlan: 'Sapphire villa',
    note: 'Single-family homes are sold out; about 15 move-in-ready villas, with more villa homesites opening later',
    villasOnly: true,
    model: '3410 Galeras Drive, Viera, FL 32940',
    quickMoveIns: [
      QMI('3088 Pangea Circle', 'Sapphire villa', '1,921 sq ft, 2 bed + study, 2 bath', DONE, '$495,410'),
      QMI('3038 Pangea Circle', 'Sapphire villa', '1,921 sq ft, 2 bed + study, 2 bath', DONE, '$506,300'),
      QMI('3048 Pangea Circle', 'Emerald villa', '1,795 sq ft, 3 bed, 2 bath', DONE, '$436,400'),
      QMI('3320 Galeras Drive', 'Emerald villa', '1,795 sq ft, 3 bed, 2 bath', DONE, '$441,400'),
      QMI('3300 Galeras Drive', 'Emerald villa', '1,795 sq ft, 3 bed, 2 bath', DONE, '$461,400'),
      QMI('3260 Galeras Drive', 'Emerald villa', '1,795 sq ft, 3 bed, 2 bath', DONE, '$438,900'),
      QMI('3230 Galeras Drive', 'Emerald villa', '1,795 sq ft, 3 bed, 2 bath', DONE, '$442,400'),
      QMI('3371 Galeras Drive', 'Iris villa, water view', '1,481 sq ft, 3 bed, 2 bath', DONE, '$414,400'),
      QMI('3361 Galeras Drive', 'Lilac villa, water view', '1,731 sq ft, 3 bed, 2 bath', DONE, '$447,900'),
      QMI('9442 Fuego Way', 'Lilac villa, water view', '1,731 sq ft, 3 bed, 2 bath', DONE, '$445,900'),
      QMI('9462 Fuego Way', 'Iris villa, water view', '1,481 sq ft, 3 bed, 2 bath', DONE, '$407,900'),
      QMI('9472 Fuego Way', 'Lilac villa, water view', '1,731 sq ft, 3 bed, 2 bath', DONE, '$446,900'),
      QMI('3151 Galeras Drive', 'Lilac villa', '1,731 sq ft, 3 bed, 2 bath', DONE, '$424,900'),
    ],
  },
  {
    slug: 'reeling-park',
    name: 'Reeling Park',
    from: '$497,900',
    plan: 'Alora II',
    specs: '1,850 sq ft, 2 stories, 3 bedrooms, 2.5 baths, 2-car garage',
    top: '$678,900', topPlan: 'Mecina II',
    note: 'San Marco courtyard homes start at $497,900 and the larger Castillo homes at $617,900',
    model: '2463 Spur Drive, Viera, FL 32940',
    quickMoveIns: [
      QMI('7689 Allure Drive', 'Soria II', '1,962 sq ft, 3 bed, 2.5 bath', 'Final walk-through', '$591,600'),
      QMI('7639 Allure Drive', 'Merida II with bonus', '2,607 sq ft, 4 bed, 3.5 bath', DONE, '$695,574'),
      QMI('2307 Spur Drive', 'Mecina II', '2,852 sq ft, 4 bed, 3.5 bath', DONE, '$790,600'),
    ],
  },
  {
    slug: 'farallon-fields',
    name: 'Farallon Fields',
    from: '$517,400',
    plan: 'Charlotte',
    specs: '1,721 sq ft, 1 story, 3 bedrooms, 2 baths, 2-car garage',
    top: '$905,400', topPlan: 'Renwick',
    note: 'The gated section starts at $761,400 (Raiford)',
    model: '3025 Karelian Drive, Melbourne, FL 32940',
    modelNote: 'one of three Farallon Fields models',
    quickMoveIns: [
      QMI('2944 Karelian Drive', 'Charlotte II', '2,122 sq ft, 3 bed + bonus, 3 bath', DONE, '$652,420'),
      QMI('3342 Toliman Place', 'Hailey', '3,021 sq ft, 4 bed + study + game room, 3.5 bath', DONE, '$822,148'),
    ],
  },
  {
    // Per Ryan 2026-11-08: no more single-family homesites and no gated
    // section; two finished homes left, and no model.
    slug: 'crossmolina',
    name: 'Crossmolina',
    from: '$624,540',
    plan: 'Morgan, move-in ready',
    specs: '1,960 sq ft, 3 bedrooms, 2.5 baths, 2-car garage, water view',
    top: '$699,300', topPlan: 'Morgan',
    note: 'Homesites are sold out; two finished homes left',
    lastHomes: true,
    quickMoveIns: [
      QMI('3104 Dampier Drive', 'Morgan, water view', '1,960 sq ft, 3 bed, 2.5 bath', DONE, '$624,540'),
      QMI('2995 Dampier Drive', 'Morgan, water view', '1,960 sq ft, 3 bed, 2.5 bath', DONE, '$699,300'),
    ],
  },
  {
    slug: 'atlin-cove',
    name: 'Atlin Cove',
    from: '$457,000',
    plan: 'Brisa',
    specs: '1,692 sq ft, 3 bedrooms, 2 baths, 2-car garage',
    top: '$597,000', topPlan: 'Crystal',
    note: 'Now selling Phase I, Viera Builders’ newest community',
    model: '9812 Palena Drive, Melbourne, FL 32940',
    modelNote: 'the Crystal and Brisa II models',
    quickMoveIns: [
      QMI('1955 Selkirk Drive', 'Biloxi', '2,260 sq ft, 3 bed + loft, 2.5 bath', BUILDING, '$554,570'),
      QMI('1945 Selkirk Drive', 'Beacon', '2,559 sq ft, 4 bed, 2.5 bath', BUILDING, '$608,620'),
      QMI('2203 Edestus Drive', 'Coral', '2,404 sq ft, 4 bed, 3 bath', BUILDING, '$623,450'),
      QMI('Homesite 1L', 'Caspian', '2,670 sq ft, 4 bed + flex room + loft, 2.5 bath', BUILDING, '$645,070'),
    ],
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

const SOURCE = `per Viera Builders, ${VIERA_BUILDERS_AS_OF}`;
const BUILT = (c) => !c.villasOnly && !c.lastHomes;
const RYAN = ' Contact Ryan before your first model visit so he can represent you at no cost to you.';
function modelLine(c) {
  if (!c.model) return '';
  const many = /models/.test(c.modelNote || '');
  const where = many
    ? `The ${c.name} models (${c.modelNote.replace(/^the /, '').replace(/ models$/, '')}) are at ${c.model}`
    : `The ${c.name} model is at ${c.model}${c.modelNote ? ` (${c.modelNote})` : ''}`;
  return ` ${where}, open ${VIERA_BUILDERS_MODEL_HOURS}.`;
}

/** One-line price guide for the live "How much do homes cost?" answer. */
export function vieraBuilderPriceGuide(slug) {
  if (slug === VIERA_BUILDERS_PAGE_SLUG) {
    return `New Viera Builders homes start at ${VIERA_BUILDERS_PRICES.filter(BUILT).map((c) => `${c.from} in ${c.name}`).join(', ')}, ${SOURCE}; move-in-ready villas in Pangea Park start at $407,900.`;
  }
  const c = vieraBuilderPrice(slug);
  if (!c) return null;
  if (c.villasOnly) return `Viera Builders’ single-family homes in Pangea Park are sold out; its move-in-ready villas run ${c.from} to ${c.top}, ${SOURCE}.`;
  if (c.lastHomes) return `Viera Builders’ homesites in Crossmolina are sold out; its last two finished homes are listed at ${c.from} and ${c.top}, ${SOURCE}.`;
  return `New Viera Builders homes in ${c.name} start at ${c.from} with the ${c.plan} plan, ${SOURCE}.`;
}

function quickMoveInFaq(c) {
  if (!c.quickMoveIns?.length) return null;
  return {
    q: `Are there quick move-in Viera Builders homes in ${c.name}?`,
    a:
      `${c.lastHomes ? 'Yes, the last two: ' : 'Yes. '}` +
      c.quickMoveIns
        .map((h) => `${h.address}, ${h.plan} (${h.specs}), ${h.status.toLowerCase()}, ${h.price}`)
        .join('; ') +
      `. Prices are Viera Builders’ promo prices from its ${VIERA_BUILDERS_AS_OF} inventory list and change often, so ask Ryan for the latest.` +
      RYAN,
  };
}

/** Builder-price FAQ for the Viera Builders pages. */
export function vieraBuilderFaq(slug) {
  if (slug === VIERA_BUILDERS_PAGE_SLUG) {
    const built = VIERA_BUILDERS_PRICES.filter(BUILT);
    return [
      {
        q: 'How much do new Viera Builders homes cost?',
        a:
          `New Viera Builders homes in Viera West start at: ` +
          built.map((c) => `${c.name} ${c.from} (${c.plan} plan, up to ${c.top})`).join('; ') +
          `, ${SOURCE}. These are base prices for each plan’s standard elevation; other elevations, options and lot premiums add to the price. ` +
          `In Pangea Park, single-family homes are sold out and about 15 move-in-ready villas run $407,900 to $506,300, with more villa homesites opening later. ` +
          `Crossmolina’s homesites are sold out, with two finished homes left. Avalonia is sold out.` +
          RYAN,
      },
      {
        q: 'How long does it take Viera Builders to build a home?',
        a:
          `Viera Builders says a to-be-built home takes ${VIERA_BUILDERS_BUILD_TIME} on average from contract to move-in. ` +
          `If you need to move sooner, it has finished and nearly finished homes in Pangea Park, Reeling Park, Farallon Fields, Crossmolina, Laurasia and Atlin Cove (${VIERA_BUILDERS_AS_OF}).` +
          RYAN,
      },
      {
        q: 'Does Viera Builders have any incentives right now?',
        a: `As of ${VIERA_BUILDERS_AS_OF}, Viera Builders offers ${VIERA_BUILDERS_INCENTIVE}. Incentives change, so ask Ryan for the current offer.${RYAN}`,
      },
      {
        q: 'Where are the Viera Builders model homes, and when are they open?',
        a:
          `Viera Builders’ models are open ${VIERA_BUILDERS_MODEL_HOURS}: ` +
          VIERA_BUILDERS_PRICES.filter((c) => c.model)
            .map((c) => `${c.name} at ${c.model}${c.modelNote ? ` (${c.modelNote})` : ''}`)
            .join('; ') +
          '. Crossmolina no longer has a model.' +
          RYAN,
      },
    ];
  }
  const c = vieraBuilderPrice(slug);
  if (!c) return [];
  const out = [];
  if (BUILT(c)) {
    out.push({
      q: `How much is a new Viera Builders home in ${c.name}?`,
      a:
        `New Viera Builders homes in ${c.name} start at ${c.from} with the ${c.plan} plan (${c.specs}) and run up to ${c.top} for the ${c.topPlan}, ${SOURCE}. ` +
        `${c.note}. These are base prices for each plan’s standard elevation; other elevations, options and lot premiums add to the price. ` +
        `A to-be-built home takes ${VIERA_BUILDERS_BUILD_TIME} on average from contract to move-in, and right now Viera Builders offers ${VIERA_BUILDERS_INCENTIVE}.` +
        modelLine(c) +
        RYAN,
    });
  } else if (c.villasOnly) {
    out.push({
      q: `Is Viera Builders still building in ${c.name}?`,
      a:
        `Viera Builders’ single-family homes in Pangea Park are sold out. It has about 15 move-in-ready villas (listed as condos on the MLS), from ${c.from} to ${c.top} as of ${VIERA_BUILDERS_AS_OF}, and will open more villa homesites in the future. ` +
        `Buyers paying cash or using one of its 6 preferred lenders get $50,000 toward upgrades.` +
        modelLine(c) +
        RYAN,
    });
  } else if (c.lastHomes) {
    out.push({
      q: `Can I still build a new Viera Builders home in ${c.name}?`,
      a:
        `No. Viera Builders has no more single-family homesites in Crossmolina, and there is no gated section or model anymore. ` +
        `Its last two finished homes are both water-view Morgan plans (1,960 sq ft, 3 bed, 2.5 bath), listed at ${c.from} and ${c.top} (${VIERA_BUILDERS_AS_OF}). ` +
        'For a new home nearby, Farallon Fields and Atlin Cove are still selling.' +
        RYAN,
    });
  }
  const qmi = quickMoveInFaq(c);
  if (qmi) out.push(qmi);
  return out;
}
