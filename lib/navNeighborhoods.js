import {
  MELBOURNE_BEACH_NEIGHBORHOOD_PAGES,
  VIERA_BUILDERS_SUB_COMMUNITIES,
  VIERA_WEST_NEIGHBORHOOD_PAGES,
} from './constants';

// The neighborhood list the nav and footer group into tabs/columns
// (lib/neighborhoodNav.js). Built on the server in app/layout.js
// (2026-10-08, per Ryan's mobile PageSpeed report) so the browser never
// downloads lib/constants.js: backend neighborhoods plus the site's own
// neighborhood pages that aren't backend rows (the Viera Builders
// communities and the Viera West / Melbourne Beach pages), trimmed to the
// fields the menu uses.
const EXTRA_NAV_NEIGHBORHOODS = [
  ...VIERA_BUILDERS_SUB_COMMUNITIES.filter((c) =>
    ['laurasia', 'pangea-park', 'reeling-park', 'atlin-cove'].includes(c.slug)
  ).map((c) => ({ slug: c.slug, name: c.name, comingSoon: Boolean(c.comingSoon) })),
  ...Object.entries(VIERA_WEST_NEIGHBORHOOD_PAGES).map(([slug, page]) => ({ slug, name: page.name })),
  ...Object.entries(MELBOURNE_BEACH_NEIGHBORHOOD_PAGES).map(([slug, page]) => ({ slug, name: page.name })),
  // Beach Woods has a site page (COMMUNITY_SEO) but no backend row.
  { slug: 'beach-woods', name: 'Beach Woods' },
];

export function navNeighborhoods(neighborhoods) {
  const all = neighborhoods.map((n) => ({ slug: n.slug, name: n.name, comingSoon: Boolean(n.comingSoon) }));
  EXTRA_NAV_NEIGHBORHOODS.forEach((extra) => {
    if (!all.some((n) => n.slug === extra.slug)) all.push(extra);
  });
  return all;
}
