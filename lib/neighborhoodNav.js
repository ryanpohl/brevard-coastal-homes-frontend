import {
  MELBOURNE_BEACH_NEIGHBORHOOD_PAGES,
  VIERA_BUILDERS_SUB_COMMUNITIES,
  VIERA_WEST_NEIGHBORHOOD_PAGES,
} from './constants';

// Neighborhood groups shared by the nav's Search by Neighborhood tabs and the
// footer's neighborhood columns (2026-10-05, per Ryan). The dropdown opens on
// Melbourne Beach (Ryan's home market); hovering or tapping another tab
// header swaps the list below to that group. Suntree sits
// with Viera, per Ryan. Backend
// neighborhoods are merged with the site's own neighborhood pages that
// aren't backend rows (the Viera Builders communities and the Viera West
// pages in VIERA_WEST_NEIGHBORHOOD_PAGES). A neighborhood not listed here
// falls into the Viera tab, where every new neighborhood so far belongs.
export const NEIGHBORHOOD_NAV_GROUPS = [
  {
    label: 'Melbourne Beach',
    slugs: [
      'aquarina',
      'beach-woods',
      'crystal-lakes',
      'floridana-beach',
      'harbor-island-beach-club',
      'indian-landing',
      'melbourne-shores',
      'sunnyland-beach',
      'turtle-bay',
    ],
  },
  { label: 'Beachside', slugs: ['lansing-island', 'tortoise-island'] },
  {
    label: 'Viera & Viera West',
    slugs: [
      'adelaide',
      'aripeka',
      'summer-lakes',
      'suntree',
      'viera-builders-communities-viera-west',
      'laurasia',
      'pangea-park',
      'reeling-park',
      'arrivas-village',
      'sonoma-at-viera',
      'strom-park',
      'atlin-cove',
    ],
  },
  { label: '55+ Communities', slugs: ['del-webb-viera', 'heritage-isle', 'bridgewater-at-viera'] },
];
const NEIGHBORHOOD_CATCH_ALL_GROUP = 'Viera & Viera West';

// Pages that stay live (and in the sitemap) but are left out of the menu
// and footer. South Merritt Island removed 2026-10-05, per Ryan: it's an
// area rather than a neighborhood, and it isn't beachside.
const NEIGHBORHOOD_NAV_HIDDEN = new Set(['south-merritt-island']);

export const NEIGHBORHOOD_NAV_LABELS = {
  'viera-builders-communities-viera-west': 'Viera Builders Communities',
};

const EXTRA_NAV_NEIGHBORHOODS = [
  ...VIERA_BUILDERS_SUB_COMMUNITIES.filter((c) =>
    ['laurasia', 'pangea-park', 'reeling-park', 'atlin-cove'].includes(c.slug)
  ).map((c) => ({ slug: c.slug, name: c.name, comingSoon: Boolean(c.comingSoon) })),
  ...Object.entries(VIERA_WEST_NEIGHBORHOOD_PAGES).map(([slug, page]) => ({ slug, name: page.name })),
  ...Object.entries(MELBOURNE_BEACH_NEIGHBORHOOD_PAGES).map(([slug, page]) => ({ slug, name: page.name })),
  // Beach Woods has a site page (COMMUNITY_SEO) but no backend row.
  { slug: 'beach-woods', name: 'Beach Woods' },
];

export function groupNeighborhoodsForNav(neighborhoods) {
  const all = neighborhoods.filter((n) => !NEIGHBORHOOD_NAV_HIDDEN.has(n.slug));
  EXTRA_NAV_NEIGHBORHOODS.forEach((extra) => {
    if (!all.some((n) => n.slug === extra.slug)) all.push(extra);
  });
  const listed = new Set(NEIGHBORHOOD_NAV_GROUPS.flatMap((g) => g.slugs));
  const groups = NEIGHBORHOOD_NAV_GROUPS.map((g) => ({
    label: g.label,
    neighborhoods: g.slugs.map((slug) => all.find((n) => n.slug === slug)).filter(Boolean),
  }));
  groups
    .find((g) => g.label === NEIGHBORHOOD_CATCH_ALL_GROUP)
    .neighborhoods.push(...all.filter((n) => !listed.has(n.slug)));
  return groups.filter((g) => g.neighborhoods.length);
}
