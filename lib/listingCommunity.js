import {
  AQUARINA_LISTINGS_FILTER,
  AQUARINA_SUBDIVISION_PATTERNS,
  ARIPEKA_LISTINGS_FILTER,
  BEACH_WOODS_SUBDIVISION_NAMES,
  LANSING_ISLAND_LISTINGS_FILTER,
  NEIGHBORHOOD_LANDING_PAGES,
  SOUTH_MERRITT_ISLAND_LAT_MAX,
  SUMMER_LAKES_SUBDIVISION_NAMES,
  SUNTREE_SUBDIVISION_NAMES,
  TORTOISE_ISLAND_SUBDIVISION_NAMES,
  VIERA_BUILDERS_GRID_EXTRAS,
  VIERA_BUILDERS_HUB_SUBDIVISIONS,
  VIERA_BUILDERS_SUB_COMMUNITIES,
  cityListingsQueryParams,
  neighborhoodLandingFilter,
} from '@/lib/constants';

// Which community page a listing belongs to (2026-10-29, per Ryan — the
// listing page's breadcrumb and "More homes in …" section, like
// corcoran.com's "Community Portrait"). Each rule mirrors how that page
// finds its own listings in app/neighborhoods/[slug]/page.js, so the link
// goes where the home is actually shown, and `filter` is that page's own
// listing query. `citySlug` is the page's parent city on this site (Adelaide
// sits under Viera West even though its MLS city is Rockledge).
//
// Subdivision-defined pages are checked first (they're more specific than
// the backend's neighborhood link), then the listing's neighborhood row,
// and null when it's in neither — the caller falls back to the city.

const lower = (s) => (s || '').toLowerCase();
// Backend `subdivisionLike` is SQL LIKE '%x%' (case-insensitive);
// `subdivision` is an exact match.
const like = (patterns, exclude = []) => (sub) =>
  patterns.some((p) => lower(sub).includes(lower(p))) && !exclude.some((p) => lower(sub).includes(lower(p)));
const exact = (names) => (sub) => names.includes(sub);

const SUBDIVISION_RULES = [
  ...VIERA_BUILDERS_SUB_COMMUNITIES.filter((c) => !c.comingSoon).map((c) => ({
    slug: c.slug,
    name: c.name,
    citySlug: 'viera-west',
    test: exact([c.name]),
    filter: { subdivision: c.name },
  })),
  ...VIERA_BUILDERS_GRID_EXTRAS.map((c) => ({
    slug: c.slug,
    name: c.name,
    citySlug: 'viera-west',
    test: exact([c.name]),
    filter: { subdivision: c.name },
  })),
  ...Object.entries(NEIGHBORHOOD_LANDING_PAGES).map(([slug, page]) => ({
    slug,
    name: page.name,
    citySlug: page.citySlug,
    // Melbourne Beach pages also require the city; Viera West pages are
    // limited to Viera West by MLS area, which listings don't carry here,
    // so a listing's own city must be one of the Viera West cities.
    cities: page.citySlug === 'melbourne-beach' ? ['melbourne-beach'] : ['viera-west', 'viera', 'melbourne', 'rockledge'],
    test: like(page.subdivisionLike, page.excludeSubdivisionLike),
    filter: neighborhoodLandingFilter(slug),
  })),
  {
    slug: 'aquarina',
    name: 'Aquarina',
    citySlug: 'melbourne-beach',
    cities: ['melbourne-beach'],
    test: like(AQUARINA_SUBDIVISION_PATTERNS),
    filter: AQUARINA_LISTINGS_FILTER,
  },
  { slug: 'aripeka', name: 'Aripeka', citySlug: 'viera', test: like(['Aripeka']), filter: ARIPEKA_LISTINGS_FILTER },
  {
    slug: 'lansing-island',
    name: 'Lansing Island',
    citySlug: 'indian-harbour-beach',
    test: like(['Lansing Island']),
    filter: LANSING_ISLAND_LISTINGS_FILTER,
  },
  {
    slug: 'tortoise-island',
    name: 'Tortoise Island',
    citySlug: 'satellite-beach',
    test: exact(TORTOISE_ISLAND_SUBDIVISION_NAMES),
    filter: { subdivision: TORTOISE_ISLAND_SUBDIVISION_NAMES.join(',') },
  },
  {
    slug: 'summer-lakes',
    name: 'Summer Lakes',
    citySlug: 'viera-west',
    test: exact(SUMMER_LAKES_SUBDIVISION_NAMES),
    filter: { subdivision: SUMMER_LAKES_SUBDIVISION_NAMES.join(',') },
  },
  {
    slug: 'suntree',
    name: 'Suntree',
    citySlug: 'melbourne',
    test: exact(SUNTREE_SUBDIVISION_NAMES),
    filter: { subdivision: SUNTREE_SUBDIVISION_NAMES.join(',') },
  },
  {
    slug: 'beach-woods',
    name: 'Beach Woods',
    citySlug: 'melbourne-beach',
    test: exact(BEACH_WOODS_SUBDIVISION_NAMES),
    filter: { subdivision: BEACH_WOODS_SUBDIVISION_NAMES.join(',') },
  },
];

// Neighborhood rows whose page uses its own filter rather than
// { neighborhood: slug }; and parent-city fixes for backend rows with the
// wrong town (see COMMUNITY_SEO's notes in lib/constants.js): Tortoise
// Island is Satellite Beach, Harbor Island Beach Club is Melbourne Beach.
const ROW_FILTERS = {
  'south-merritt-island': { city: 'merritt-island', latMax: SOUTH_MERRITT_ISLAND_LAT_MAX },
  'viera-builders-communities-viera-west': { subdivision: VIERA_BUILDERS_HUB_SUBDIVISIONS.join(',') },
};
const ROW_CITY_FIX = { 'tortoise-island': 'satellite-beach', 'harbor-island-beach-club': 'melbourne-beach' };

/**
 * @param listing  the listing from api.getListing
 * @param neighborhoods  api.getNeighborhoods() rows ({ slug, name, city })
 * @returns {{ slug, name, path, citySlug, filter } | null}
 */
export function listingCommunity(listing, neighborhoods = []) {
  const sub = listing.subdivision;
  const city = listing.city?.slug;
  if (sub) {
    const rule = SUBDIVISION_RULES.find((r) => (!r.cities || r.cities.includes(city)) && r.test(sub));
    if (rule) {
      return { slug: rule.slug, name: rule.name, path: `/neighborhoods/${rule.slug}`, citySlug: rule.citySlug, filter: rule.filter };
    }
  }
  const row = listing.neighborhood?.slug && neighborhoods.find((n) => n.slug === listing.neighborhood.slug);
  if (row) {
    const rule = SUBDIVISION_RULES.find((r) => r.slug === row.slug);
    return {
      slug: row.slug,
      name: row.name,
      path: `/neighborhoods/${row.slug}`,
      citySlug: ROW_CITY_FIX[row.slug] || row.city?.slug || city,
      filter: rule?.filter || ROW_FILTERS[row.slug] || { neighborhood: row.slug },
    };
  }
  return null;
}

/** The city fallback for "More homes in …" when there's no community page. */
export function listingCityArea(listing) {
  const city = listing.city;
  if (!city?.slug) return null;
  return { slug: city.slug, name: city.name, path: `/${city.slug}`, citySlug: city.slug, filter: cityListingsQueryParams(city.slug) };
}
