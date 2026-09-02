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
  // True only when a visitor (or a Nav.js sub-link like "Homes"/"Condos")
  // explicitly set ?propertyType=; false for the bare /neighborhoods/{slug}
  // URL a page's own "<Name> Listings" header link goes to (see Nav.js) —
  // used below by both HARBOR_ISLAND_BEACH_CLUB_H1 and AQUARINA_COMBINED_H1
  // to tell "the main combined-view link" apart from a single-type sub-link,
  // since primaryType alone can't (it defaults to 'Home' in both cases).
  const hasExplicitPropertyTypeFilter = Boolean(searchParams.propertyType);

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
  //
  // Split into a Home-specific and Condo-specific version (2026-08-20, per
  // Ryan) instead of the one combined "Homes & Condos"/foreclosures H1 used
  // for both — the Home version drops the foreclosures mention entirely
  // (Ryan's own wording only paired "foreclosures" with the Condos text).
  // Picked via primaryType for Nav.js's single-type "Homes"/"Condos"
  // sub-links (which explicitly set ?propertyType=Home/Condo).
  const HARBOR_ISLAND_BEACH_CLUB_HOME_H1 =
    'Harbor Island Beach Club, Melbourne Beach FL Homes for sale. Contact us about current off-market properties currently available in Harbor Island.';
  const HARBOR_ISLAND_BEACH_CLUB_CONDO_H1 =
    'Harbor Island Beach Club, Melbourne Beach FL Condos for sale. Contact us about current foreclosures & off-market properties currently available in Harbor Island.';
  // Combined H1 (2026-09-01, per Ryan; revised same-day twice more — first
  // to add a foreclosures/off-market sentence, then trimmed back down to
  // drop its "off-market Single-Family homes" clause, per Ryan's final
  // wording: "Reach out for information on the Foreclosed Bank-Owned
  // condos that are currently available in Harbor Island Beach Club.") —
  // shown only for the "<Name> Listings" header link's own bare
  // /neighborhoods/harbor-island-beach-club URL (no ?propertyType= param),
  // the same hasExplicitPropertyTypeFilter distinction AQUARINA_COMBINED_H1
  // below uses. Before this, that bare URL fell through to the
  // Home-specific H1 above (primaryType defaults to 'Home' whenever no
  // param is present), which read as Homes-only even though the page
  // itself shows every type combined. The "Homes"/"Condos" sub-links keep
  // their own existing single-type H1s untouched.
  const HARBOR_ISLAND_BEACH_CLUB_COMBINED_H1 =
    'Harbor Island Beach Club Homes & Condos For Sale, Melbourne Beach, Florida. Reach out for information on the Foreclosed Bank-Owned condos that are currently available in Harbor Island Beach Club.';
  const HARBOR_ISLAND_BEACH_CLUB_H1 = !hasExplicitPropertyTypeFilter
    ? HARBOR_ISLAND_BEACH_CLUB_COMBINED_H1
    : primaryType === 'Condo'
      ? HARBOR_ISLAND_BEACH_CLUB_CONDO_H1
      : HARBOR_ISLAND_BEACH_CLUB_HOME_H1;
  // Aquarina (per Ryan, 2026-09-01: "make it Aquarina Homes & Condos For
  // Sale for the main Aquarina link") — one of only two neighborhoods with
  // its own "Condos" sub-link (see Nav.js's NEIGHBORHOOD_CONDO_PAGE_SLUGS,
  // Harbor Island Beach Club being the other). Its "<Name> Listings"
  // header link (Nav.js) goes to the bare /neighborhoods/aquarina URL with
  // no ?propertyType= param — the combined Home+Condo view — but that
  // inherited the backend's Home-only SEO h1 ("Aquarina Homes For Sale —
  // Melbourne Beach, FL") since primaryType defaults to 'Home' whenever no
  // param is present (same limitation ARIPEKA_H1/ADELAIDE_SUMMER_LAKES_H1
  // below already work around with a blind string replace on the
  // backend's own generated h1, rather than a backend reseed — see those
  // comments for why). Gated on hasExplicitPropertyTypeFilter so Aquarina's
  // own "Homes" and "Condos" sub-links (which explicitly set
  // ?propertyType=Home/Condo) still show their own correct single-type h1
  // instead of this combined one. (hasExplicitPropertyTypeFilter is
  // declared once, near primaryType above, and shared with
  // HARBOR_ISLAND_BEACH_CLUB_H1's identical combined-vs-single-type check.)
  const isAquarina = slug === 'aquarina';
  const AQUARINA_COMBINED_H1 = seo?.h1 ? seo.h1.replace('Homes For Sale', 'Homes & Condos For Sale') : seo?.h1;
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
  // Aripeka's H1 (per Ryan, 2026-08-21: "Its supposed to just be Viera,
  // not Viera East. Can you delete the east on both aripeka pages.") —
  // the backend's SEO h1 for every neighborhood interpolates its parent
  // city's display name (see backend/src/services/seoContent.service.js's
  // buildNeighborhoodSeo), and Aripeka's parent city ('viera') was
  // renamed to "Viera East" as its display name on 2026-08-12/13 (see
  // CLAUDE.md's "Viera renamed to Viera East" section) — so every
  // Aripeka H1 picked up a "— Viera East, FL" suffix along with it.
  // Scoped to Aripeka only via isAripeka (Adelaide/Summer Lakes are
  // already re-parented to viera-west, so they're unaffected either
  // way); a plain string swap on the backend's own generated H1 — for
  // both the Home and Land pages, since it doesn't depend on
  // primaryType — rather than a backend reseed, which would mean
  // touching the same production DB this project's own incident history
  // (see CLAUDE.md's "Apply changes" incident) has already flagged as
  // risky to change casually.
  //
  // Same-day follow-up (per Ryan: "Can you change 'land' to 'Lots'") —
  // Aripeka's Land page H1 read "Aripeka Land For Sale — Viera, FL";
  // swapping the backend's "Land" property-type label to "Lots" here
  // too (Aripeka's nav dropdown link already says "Lots" — see Nav.js's
  // NEIGHBORHOOD_LOTS_PAGE_SLUGS — so this keeps the H1 consistent with
  // it). Safe as a blind .replace('Land', 'Lots') because "Land" only
  // ever appears in this H1 as the property-type label — neither
  // "Aripeka" nor "Viera" contain that substring — and it's a no-op on
  // the Home page's H1, which never contains "Land" to begin with.
  const ARIPEKA_H1 = seo?.h1 ? seo.h1.replace('Viera East', 'Viera').replace('Land', 'Lots') : seo?.h1;
  // Aripeka's "Aripeka Listings" main link H1 (per Ryan, 2026-09-02: "Can
  // you change the text to 'Aripeka Homes & Lots for sale - Viera,
  // Florida' on the main Aripeka link in the search by neighborhoods
  // dropdown menu") — the "main link" is the bare /neighborhoods/aripeka
  // URL (Nav.js's "Aripeka Listings" header link, no ?propertyType= param),
  // same hasExplicitPropertyTypeFilter gate used by
  // AQUARINA_COMBINED_H1/HARBOR_ISLAND_BEACH_CLUB_H1 above, so Aripeka's
  // own "Homes" (?propertyType=Home,Land) and "Lots" (?propertyType=Land)
  // sub-links keep showing ARIPEKA_H1's existing backend-derived text,
  // unaffected. Hand-written exact string per Ryan's wording, rather than
  // a .replace() on the backend h1 like ARIPEKA_H1 above, since there's no
  // single-type backend h1 that already contains "Homes & Lots" to derive
  // it from.
  const ARIPEKA_COMBINED_H1 = 'Aripeka Homes & Lots for sale - Viera, Florida';
  // Adelaide/Summer Lakes' H1 (per Ryan, 2026-08-21: "Can you change Viera
  // West to just Viera") — both neighborhoods are re-parented to
  // citySlug 'viera-west' in seed.js (per Ryan's 2026-08-11 boundary
  // extension), so the backend's SEO h1 interpolates their parent city's
  // display name, "Viera West" — giving every Adelaide/Summer Lakes H1 a
  // "— Viera West, FL" suffix. Ryan confirmed (via AskUserQuestion) this
  // should be scoped to just these two neighborhood pages' displayed
  // text, not a full "Viera West" city rename (nav, homepage grid, Viera
  // West's own city pages, SEO titles all stay "Viera West") — so this
  // follows the same frontend-only string-replace-on-seo.h1 pattern as
  // ARIPEKA_H1 above, rather than touching the backend cities table.
  const ADELAIDE_SUMMER_LAKES_H1 = seo?.h1 ? seo.h1.replace('Viera West', 'Viera') : seo?.h1;
  // Adelaide's own H1 (per Ryan, 2026-09-02: "can you change the text to
  // 'Adelaide Homes For Sale - Viera, Florida'") — hardcoded exact string
  // per Ryan's wording (em dash -> hyphen, "FL" -> "Florida"), since a
  // further .replace() on ADELAIDE_SUMMER_LAKES_H1 above would still leave
  // the old em dash and "FL" abbreviation Ryan wants gone. Scoped to
  // Adelaide only — Summer Lakes keeps using ADELAIDE_SUMMER_LAKES_H1
  // unchanged below, since this request's screenshot was Adelaide-only.
  const ADELAIDE_H1 = 'Adelaide Homes For Sale - Viera, Florida';
  const h1Text = isHarborIslandBeachClub
    ? HARBOR_ISLAND_BEACH_CLUB_H1
    : isVieraBuildersCommunitiesVieraWest
      ? VIERA_BUILDERS_COMMUNITIES_VIERA_WEST_H1
      : subCommunity?.comingSoon
        ? `Homes for Sale in ${neighborhood.name}, FL (Coming Soon)`
        : isAripeka
          ? (hasExplicitPropertyTypeFilter ? ARIPEKA_H1 : ARIPEKA_COMBINED_H1) ||
            `Homes for Sale in ${neighborhood.name}, FL`
          : isAdelaide
            ? ADELAIDE_H1
            : isSummerLakes
              ? ADELAIDE_SUMMER_LAKES_H1 || `Homes for Sale in ${neighborhood.name}, FL`
              : isAquarina && !hasExplicitPropertyTypeFilter
                ? AQUARINA_COMBINED_H1 || `Homes & Condos for Sale in ${neighborhood.name}, FL`
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
            // fontFamily: Inter Tight (2026-08-21, per Ryan: "Change the
            // font to inter tight on all the pages city & neighborhood
            // descriptions") — this H1 is the only "description"-style
            // text on this page. Applies to every neighborhood page,
            // including Harbor Island Beach Club/Viera Builders
            // Communities Viera West below — their bold treatment
            // (per Ryan, 2026-08-05, matching his "The Hamptons Luxury
            // Homes" reference image) previously swapped in the site's
            // Jost body font; it now just adds the heavier weight on top
            // of this same Inter Tight family instead.
            fontFamily: 'var(--font-inter-tight)',
            ...(useBoldSansSerifH1 ? { fontWeight: 800 } : {}),
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
