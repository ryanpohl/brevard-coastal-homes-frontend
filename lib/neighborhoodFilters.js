import {
  AQUARINA_LISTINGS_FILTER,
  ARIPEKA_LISTINGS_FILTER,
  BEACH_WOODS_SUBDIVISION_NAMES,
  LANSING_ISLAND_SUBDIVISION_NAMES,
  NEIGHBORHOOD_LANDING_PAGES,
  SOUTH_MERRITT_ISLAND_LAT_MAX,
  SUMMER_LAKES_SUBDIVISION_NAMES,
  SUNTREE_SUBDIVISION_NAMES,
  TORTOISE_ISLAND_SUBDIVISION_NAMES,
  VIERA_BUILDERS_SUB_COMMUNITIES,
  neighborhoodLandingFilter,
} from './constants';

// Listing filter for a neighborhood page's listings (2026-10-07: moved out
// of app/neighborhoods/[slug]/page.js so city pages can show per-
// neighborhood market stats too). Mirrors that page component's own
// listingsFilterParams; keep the two in sync.
export function neighborhoodListingsFilter(slug, searchParams = {}) {
  const subCommunity = VIERA_BUILDERS_SUB_COMMUNITIES.find((c) => c.slug === slug);
  const isVieraBuildersCommunitiesVieraWest = slug === 'viera-builders-communities-viera-west';
  const isBeachWoods = slug === 'beach-woods';
  const isAquarina = slug === 'aquarina';
  return NEIGHBORHOOD_LANDING_PAGES[slug]
    ? neighborhoodLandingFilter(slug)
    : subCommunity
    ? { subdivision: subCommunity.name }
    : isVieraBuildersCommunitiesVieraWest
      ? { subdivision: searchParams.subdivision || VIERA_BUILDERS_SUB_COMMUNITIES.map((c) => c.name).join(',') }
      : isBeachWoods
        ? { subdivision: BEACH_WOODS_SUBDIVISION_NAMES.join(',') }
        : isAquarina
          ? AQUARINA_LISTINGS_FILTER
          : slug === 'tortoise-island'
            ? { subdivision: TORTOISE_ISLAND_SUBDIVISION_NAMES.join(',') }
            : slug === 'summer-lakes'
              ? { subdivision: SUMMER_LAKES_SUBDIVISION_NAMES.join(',') }
              : slug === 'lansing-island'
                ? { subdivision: LANSING_ISLAND_SUBDIVISION_NAMES.join(',') }
                : slug === 'south-merritt-island'
                  ? { city: 'merritt-island', latMax: SOUTH_MERRITT_ISLAND_LAT_MAX }
                  : slug === 'suntree'
                    ? { subdivision: SUNTREE_SUBDIVISION_NAMES.join(',') }
                    : slug === 'aripeka'
                      ? ARIPEKA_LISTINGS_FILTER
                      : { neighborhood: slug };
}
