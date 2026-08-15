import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import {
  ADELAIDE_PRICE_BANDS,
  ADELAIDE_BED_OPTIONS,
  ADELAIDE_BATH_OPTIONS,
  ARIPEKA_PROPERTY_TYPE_OPTIONS,
  ARIPEKA_PRICE_BANDS,
  ARIPEKA_BED_OPTIONS,
  ARIPEKA_BATH_OPTIONS,
  HARBOR_ISLAND_BEACH_CLUB_PROPERTY_TYPE_OPTIONS,
  HARBOR_ISLAND_BEACH_CLUB_PRICE_BANDS,
  HARBOR_ISLAND_BEACH_CLUB_BED_OPTIONS,
  HARBOR_ISLAND_BEACH_CLUB_BATH_OPTIONS,
  VIERA_BUILDERS_COMMUNITIES_VIERA_WEST_NEIGHBORHOOD_OPTIONS,
  VIERA_BUILDERS_SUB_COMMUNITIES,
  VIERA_BUILDERS_PRICE_BANDS,
  VIERA_BUILDERS_PROPERTY_TYPE_OPTIONS,
  SOUTH_MERRITT_ISLAND_PRICE_BANDS,
} from '@/lib/constants';
import FilterBar from '@/components/FilterBar';
import HarborIslandInquiryModals from '@/components/HarborIslandInquiryModals';
import ListingResultsLayout from '@/components/ListingResultsLayout';

// Matches the reference design's "1-30 of 34 Homes" pagination — the
// backend defaults to 24 if this isn't passed.
const PAGE_SIZE = 30;

/**
 * Neighborhood listing page — one route covers all 8 neighborhoods, e.g.
 * /neighborhoods/pineda-landing. Unlike the city pages, property type isn't
 * baked into the URL segment; it's driven entirely by the FilterBar/query
 * string, defaulting to showing all types.
 */
export async function generateMetadata({ params, searchParams }) {
  const primaryType = (searchParams.propertyType || 'Home').split(',')[0];
  try {
    const { seo } = await api.getNeighborhoodSeo(params.slug, primaryType);
    return {
      title: seo.title,
      description: seo.metaDescription,
      keywords: seo.keywords,
      alternates: { canonical: seo.canonicalUrl || seo.canonicalPath },
    };
  } catch {
    return {};
  }
}

export default async function NeighborhoodListingsPage({ params, searchParams }) {
  const { slug } = params;

  // Viera Builders Communities Viera West's 6 sub-communities (per Ryan,
  // 2026-08-05) aren't real rows in the backend's `neighborhoods` table
  // yet — see lib/constants.js's VIERA_BUILDERS_SUB_COMMUNITIES — so
  // api.getNeighborhood(slug) would 404 for them. Build a stand-in
  // neighborhood object instead when the slug matches one of these, so
  // this same page template renders for them exactly like every real
  // neighborhood. `city: { slug: 'viera-west' }` reuses that real city's
  // waterfront filter flags (none) and coordinates (as the map fallback
  // center, since these don't have their own lat/lng yet).
  const subCommunity = VIERA_BUILDERS_SUB_COMMUNITIES.find((c) => c.slug === slug);
  // Needed ahead of the listings fetch below too — see its subdivision/
  // neighborhood param logic. Declared once here; reused later for the H1/
  // FilterBar wiring instead of being recomputed.
  const isVieraBuildersCommunitiesVieraWest = slug === 'viera-builders-communities-viera-west';

  let neighborhood;
  if (subCommunity) {
    neighborhood = {
      slug,
      name: subCommunity.name,
      city: { slug: 'viera-west' },
      latitude: null,
      longitude: null,
      mapZoom: null,
    };
  } else {
    try {
      ({ neighborhood } = await api.getNeighborhood(slug));
    } catch {
      notFound();
    }
  }

  // The neighborhood object itself doesn't carry waterfront filter flags —
  // those live on its parent city (and encode the Merritt Island /
  // Viera West special cases) — so fetch the city to get them. The parent
  // city's coordinate also doubles as the map's fallback center when the
  // neighborhood doesn't have its own (most don't — see backend/README.md).
  let waterfrontFlags = {};
  let parentCity = null;
  if (neighborhood.city) {
    try {
      ({ city: parentCity } = await api.getCity(neighborhood.city.slug));
      waterfrontFlags = parentCity.filters || {};
    } catch {
      // No parent city data available — FilterBar simply won't show a Waterfront option.
    }
  }

  const primaryType = (searchParams.propertyType || 'Home').split(',')[0];

  let seo = null;
  let jsonLd = null;
  if (!subCommunity) {
    // Skipped for the 6 synthetic sub-community pages above — there's no
    // backend SEO row for them (they don't exist as real neighborhoods),
    // so this would just be a guaranteed-to-fail request every time.
    try {
      ({ seo, jsonLd } = await api.getNeighborhoodSeo(slug, primaryType));
    } catch {
      // No SEO row yet for this neighborhood/property type — render with fallbacks below.
    }
  }

  const page = Number(searchParams.page) || 1;

  // Which of `neighborhood`/`subdivision` filters listings depends on the
  // page (per Ryan, 2026-08-05, once the backend gained a real
  // listings.subdivision column — see backend/src/db/schema.sql):
  //  - Every normal neighborhood page: `neighborhood: slug`, matched against
  //    the backend's neighborhoods table via neighborhood_id — unchanged.
  //  - The 6 synthetic sub-community pages (subCommunity, e.g. Pangea Park):
  //    these aren't real neighborhoods rows, so filter by `subdivision`
  //    instead, matching the MLS feed's SubdivisionName text for that one
  //    community exactly.
  //  - Viera Builders Communities Viera West itself: its own slug isn't
  //    expected to appear as a real listing's neighborhood_id or
  //    SubdivisionName (real MLS listings here are individually tagged
  //    with one of the 6 sub-community names, not this wrapper's) — so it
  //    filters by `subdivision` too, defaulting to the union of all 6
  //    community names (i.e. "show listings from any of them") unless the
  //    visitor has narrowed it via the page's own "Neighborhood" FilterBar
  //    dropdown, which sets the same `subdivision` URL param to a specific
  //    subset. This is a best-guess pending the real feed being connected
  //    next week — verify against it then per schema.sql's comment.
  const listingsFilterParams = subCommunity
    ? { subdivision: subCommunity.name }
    : isVieraBuildersCommunitiesVieraWest
      ? { subdivision: searchParams.subdivision || VIERA_BUILDERS_SUB_COMMUNITIES.map((c) => c.name).join(',') }
      : { neighborhood: slug };

  let results = [];
  let total = 0;
  let totalPages = 1;
  try {
    const data = await api.getListings({
      ...listingsFilterParams,
      propertyType: searchParams.propertyType ? searchParams.propertyType.split(',') : undefined,
      priceMin: searchParams.priceMin,
      priceMax: searchParams.priceMax,
      beds: searchParams.beds,
      baths: searchParams.baths,
      waterfront: searchParams.waterfront,
      sort: searchParams.sort,
      page,
      pageSize: PAGE_SIZE,
    });
    results = data.results || [];
    total = data.total ?? results.length;
    totalPages = data.totalPages || 1;
  } catch {
    // Backend unreachable or no matches — render an empty grid rather than crashing.
  }

  // Adelaide (per Ryan, 2026-08-05) gets its own Price/Beds/Baths dropdown
  // options — a higher-end community than the site-wide defaults fit — and
  // hides Property Type entirely. See lib/constants.js's ADELAIDE_* exports.
  const isAdelaide = slug === 'adelaide';
  // Aripeka (per Ryan, 2026-08-05) gets its own Property Type (no
  // Condos/Townhomes), Price, and Beds/Baths dropdown options. See
  // lib/constants.js's ARIPEKA_* exports.
  const isAripeka = slug === 'aripeka';
  // Summer Lakes (per Ryan, 2026-08-05) hides Property Type entirely (like
  // Adelaide) and reuses Aripeka's Price/Beds/Baths options, since Ryan
  // specified the identical Under $1M / $1M-$1.5M / Above $1.5M price bands
  // and 3+ Beds / 2+ Baths starting points for this community too.
  const isSummerLakes = slug === 'summer-lakes';
  // Lansing Island (per Ryan, 2026-08-05): drops Condos/Townhomes from
  // Property Type (reuses Aripeka's Home/Land-only list), hides the Price
  // dropdown entirely, reuses Aripeka's 3+ Beds / 2+ Baths starting points,
  // and drops Oceanfront from Waterfront — its parent city (Indian Harbour
  // Beach) has both oceanfront and riverfront flags set, so without this
  // override Waterfront would show both; Lansing Island itself only faces
  // the Indian River, not the ocean.
  const isLansingIsland = slug === 'lansing-island';
  // Tortoise Island (per Ryan, 2026-08-05): identical treatment to Lansing
  // Island — drops Condos/Townhomes from Property Type (reuses Aripeka's
  // Home/Land-only list), hides the Price dropdown entirely, reuses
  // Aripeka's 3+ Beds / 2+ Baths starting points, and drops Oceanfront from
  // Waterfront — its parent city (Melbourne Beach) has both oceanfront and
  // riverfront flags set, so without this override Waterfront would show
  // both.
  const isTortoiseIsland = slug === 'tortoise-island';
  // Suntree (per Ryan, 2026-08-05): hides the Waterfront dropdown entirely,
  // via the same hideWaterfront prop as Harbor Island Beach Club below.
  // Suntree's parent city (Melbourne) has oceanfront/riverfront flags set
  // (they cover Melbourne's other neighborhoods), but Suntree itself is an
  // inland community along Wickham Rd — see CLAUDE.md's "Suntree" note.
  const isSuntree = slug === 'suntree';
  // South Merritt Island (per Ryan, 2026-08-05): drops Condos/Townhomes
  // from Property Type — reuses Aripeka's Home/Land-only list (same
  // ARIPEKA_PROPERTY_TYPE_OPTIONS constant; South Merritt Island doesn't
  // get its own dedicated constant since the values are identical). Every
  // other filter on this page (Price/Beds/Baths/Waterfront) is unaffected.
  const isSouthMerrittIsland = slug === 'south-merritt-island';
  // Harbor Island Beach Club (per Ryan, 2026-08-05): drops Land from
  // Property Type (keeps Home/Condo — its own HARBOR_ISLAND_BEACH_CLUB_*
  // options, not reused from Aripeka since Aripeka drops Condo instead),
  // uses its own price bands, drops 1+/2+ from BOTH Beds and Baths (Baths
  // starts at 3+ here, not 2+ like Aripeka/Adelaide), and hides the
  // Waterfront dropdown entirely via the new hideWaterfront prop — unlike
  // Lansing Island/Tortoise Island, which only exclude Oceanfront.
  const isHarborIslandBeachClub = slug === 'harbor-island-beach-club';
  // Harbor Island Beach Club also gets a custom H1 (per Ryan, 2026-08-05,
  // matching his reference screenshot exactly) instead of the backend SEO
  // h1/generic fallback used by every other neighborhood page, plus two
  // extra CTA buttons — see HarborIslandInquiryModals.js, rendered via
  // FilterBar's extraActions prop.
  const HARBOR_ISLAND_BEACH_CLUB_H1 =
    'Harbor Island Beach Club, Melbourne Beach FL Homes & Condos for sale. Contact us about current foreclosures & off-market properties currently available in Harbor Island.';
  // Viera Builders Communities Viera West (per Ryan, 2026-08-05): drops a
  // new "Neighborhood" dropdown (before Property Type) listing its 6
  // sub-communities — see lib/constants.js's
  // VIERA_BUILDERS_COMMUNITIES_VIERA_WEST_NEIGHBORHOOD_OPTIONS — plus a
  // custom H1 (exact text from Ryan's reference screenshot) styled with the
  // same bold sans-serif look as Harbor Island Beach Club's H1 below.
  // (isVieraBuildersCommunitiesVieraWest itself is declared earlier, above
  // the listings fetch, since that fetch's subdivision/neighborhood param
  // choice needs it too.)
  const VIERA_BUILDERS_COMMUNITIES_VIERA_WEST_H1 =
    'Viera Builders Communities located in Viera West, FL Real Estate & Homes for Sale include the following neighborhoods (Pangea Park, Laurasia, Reeling Park, Farallon Fields, Atlin Cove, & Crossmolina)';
  // True on the wrapper page AND all 6 individual sub-community pages (per
  // Ryan, 2026-08-05) — drives the shared VIERA_BUILDERS_PRICE_BANDS /
  // VIERA_BUILDERS_PROPERTY_TYPE_OPTIONS (drops Land) below, so every one
  // of these 7 pages gets the same Price/Property Type dropdown options.
  const isVieraBuilders = isVieraBuildersCommunitiesVieraWest || Boolean(subCommunity);
  const h1Text = isHarborIslandBeachClub
    ? HARBOR_ISLAND_BEACH_CLUB_H1
    : isVieraBuildersCommunitiesVieraWest
      ? VIERA_BUILDERS_COMMUNITIES_VIERA_WEST_H1
      : subCommunity?.comingSoon
        ? `Homes for Sale in ${neighborhood.name}, FL (Coming Soon)`
        : seo?.h1 || `Homes for Sale in ${neighborhood.name}, FL`;
  // Bold sans-serif H1 styling (per Ryan, 2026-08-05) — originally added for
  // Harbor Island Beach Club, now shared by Viera Builders Communities
  // Viera West per Ryan's follow-up request to match that same style. Every
  // other neighborhood/city page keeps the default serif Playfair Display
  // heading, unaffected by this flag.
  const useBoldSansSerifH1 = isHarborIslandBeachClub || isVieraBuildersCommunitiesVieraWest;

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  const mapCenter =
    neighborhood.latitude != null && neighborhood.longitude != null
      ? { lat: neighborhood.latitude, lng: neighborhood.longitude }
      : parentCity && parentCity.latitude != null && parentCity.longitude != null
        ? { lat: parentCity.latitude, lng: parentCity.longitude }
        : null;

  return (
    <div>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 0' }}>
        <h1
          style={{
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            marginBottom: 8,
            // Bold sans-serif H1 (per Ryan, 2026-08-05), matching his "The
            // Hamptons Luxury Homes" reference image, instead of the
            // site-wide serif Playfair Display heading style — scoped via
            // useBoldSansSerifH1 (Harbor Island Beach Club and Viera
            // Builders Communities Viera West); every other neighborhood/
            // city page's H1 is unaffected. Uses the site's existing Jost
            // body font (now loaded with 700/800 weights too, see
            // globals.css) rather than introducing a third typeface.
            ...(useBoldSansSerifH1
              ? { fontFamily: 'var(--font-body)', fontWeight: 800 }
              : {}),
          }}
        >
          {h1Text}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12 }}>
          {total} result{total === 1 ? '' : 's'}
        </p>
      </div>

      <FilterBar
        waterfrontFlags={waterfrontFlags}
        hidePropertyType={isAdelaide || isSummerLakes}
        propertyTypeOptions={
          isAripeka || isLansingIsland || isTortoiseIsland || isSouthMerrittIsland
            ? ARIPEKA_PROPERTY_TYPE_OPTIONS
            : isHarborIslandBeachClub
              ? HARBOR_ISLAND_BEACH_CLUB_PROPERTY_TYPE_OPTIONS
              : isVieraBuilders
                ? VIERA_BUILDERS_PROPERTY_TYPE_OPTIONS
                : undefined
        }
        hidePrice={isLansingIsland || isTortoiseIsland}
        priceBands={
          isAdelaide
            ? ADELAIDE_PRICE_BANDS
            : isAripeka || isSummerLakes
              ? ARIPEKA_PRICE_BANDS
              : isHarborIslandBeachClub
                ? HARBOR_ISLAND_BEACH_CLUB_PRICE_BANDS
                : isVieraBuilders
                  ? VIERA_BUILDERS_PRICE_BANDS
                  : isSouthMerrittIsland
                    ? SOUTH_MERRITT_ISLAND_PRICE_BANDS
                    : undefined
        }
        bedOptions={
          isAdelaide
            ? ADELAIDE_BED_OPTIONS
            : isAripeka || isSummerLakes || isLansingIsland || isTortoiseIsland
              ? ARIPEKA_BED_OPTIONS
              : isHarborIslandBeachClub
                ? HARBOR_ISLAND_BEACH_CLUB_BED_OPTIONS
                : undefined
        }
        bathOptions={
          isAdelaide
            ? ADELAIDE_BATH_OPTIONS
            : isAripeka || isSummerLakes || isLansingIsland || isTortoiseIsland
              ? ARIPEKA_BATH_OPTIONS
              : isHarborIslandBeachClub
                ? HARBOR_ISLAND_BEACH_CLUB_BATH_OPTIONS
                : undefined
        }
        excludeWaterfrontOptions={isLansingIsland || isTortoiseIsland ? ['Oceanfront'] : undefined}
        hideWaterfront={isHarborIslandBeachClub || isSuntree}
        extraActions={isHarborIslandBeachClub ? <HarborIslandInquiryModals /> : undefined}
        neighborhoodOptions={
          isVieraBuildersCommunitiesVieraWest ? VIERA_BUILDERS_COMMUNITIES_VIERA_WEST_NEIGHBORHOOD_OPTIONS : undefined
        }
        // "Acreage" sort option (per Ryan, 2026-08-15: "delete the acreage
        // option on all the pages other than the land pages") — hidden
        // unconditionally here. Unlike a city page (app/[citySlug]/
        // [propertySlug]/page.js), no neighborhood route is a dedicated Land
        // page: property type here is just one FilterBar filter among
        // several (defaulting to showing all types), never baked into the
        // URL segment the way a city's own /land-for-sale route is — so
        // there's no neighborhood-page equivalent of "the land page" to
        // exempt. Applies even to neighborhoods whose Property Type options
        // include Land (Aripeka, Lansing Island, Tortoise Island, South
        // Merritt Island) — see FilterBar.js's hideAcreageSort comment.
        hideAcreageSort
      />

      <div className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 64px' }}>
        <ListingResultsLayout
          mapCenter={mapCenter}
          results={results}
          mapZoom={neighborhood.mapZoom || 15}
          resultsLabel={total === 0 ? '0 results' : `${rangeStart}-${rangeEnd} of ${total} Homes`}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
