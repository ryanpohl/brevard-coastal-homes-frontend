// Neighborhood groups shared by the nav's Search by Neighborhood tabs and the
// footer's neighborhood columns (2026-10-05, per Ryan). Tab order per Ryan
// (2026-10-07): Viera & Viera West (opens first), Melbourne Beach,
// Beachside, 55+ Communities; hovering or tapping a tab header swaps the
// list below to that group. Suntree sits
// with Viera, per Ryan. The neighborhood list comes from
// lib/navNeighborhoods.js (built on the server, so this file stays small
// enough for the browser). A neighborhood not listed here
// falls into the Viera tab, where every new neighborhood so far belongs.
export const NEIGHBORHOOD_NAV_GROUPS = [
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

export function groupNeighborhoodsForNav(neighborhoods) {
  const all = neighborhoods.filter((n) => !NEIGHBORHOOD_NAV_HIDDEN.has(n.slug));
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
