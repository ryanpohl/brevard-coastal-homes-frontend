import { notFound } from 'next/navigation';
import Link from 'next/link';
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
  BEACH_WOODS_SUBDIVISION_NAMES,
  AQUARINA_SUBDIVISION_NAMES,
} from '@/lib/constants';
import FilterBar from '@/components/FilterBar';
import HarborIslandInquiryModals from '@/components/HarborIslandInquiryModals';
import HarborIslandForeclosuresTrigger from '@/components/HarborIslandForeclosuresTrigger';
import ContactUsTrigger from '@/components/ContactUsTrigger';
import ListingResultsLayout from '@/components/ListingResultsLayout';

// Matches the reference design's "1-30 of 34 Homes" pagination — the
// backend defaults to 24 if this isn't passed.
const PAGE_SIZE = 30;

// Live listing-count meta description prefix (2026-09-22, per Ryan —
// extending the same treatment already added to the city pages, see
// LISTING_COUNT_NOUN's twin comment in
// app/[citySlug]/[propertySlug]/page.js for the full "why": a concrete,
// current-looking number in the search snippet — "125 homes for sale in
// X" — tends to stand out and earn a higher click-through rate versus the
// generic copy every competing result otherwise shows). PREPENDED to
// whatever description text each branch below already builds; additive,
// not a rewrite.
// Unlike the city pages (a distinct canonical URL per property type), a
// neighborhood page's type is driven entirely by the query string, so the
// count here always matches whatever searchParams.propertyType this exact
// request has (or every type combined, for the bare URL) rather than
// defaulting to a single fixed type.
const LISTING_COUNT_NOUN = { Home: 'homes', Condo: 'condos', Land: 'lots' };

async function buildNeighborhoodListingCountPrefix({ listingsFilterParams, propertyType, neighborhoodName }) {
  if (!neighborhoodName) return '';
  try {
    const data = await api.getListings({ ...listingsFilterParams, propertyType, pageSize: 1 });
    const total = typeof data.total === 'number' ? data.total : null;
    if (total == null) return '';
    const noun = Array.isArray(propertyType) && propertyType.length === 1 ? LISTING_COUNT_NOUN[propertyType[0]] || 'listings' : 'listings';
    return `${total} ${noun} for sale in ${neighborhoodName}, FL. `;
  } catch {
    // Count fetch failed — render the description without the prefix
    // rather than losing the page's metadata entirely over this.
    return '';
  }
}

/**
 * Neighborhood listing page — one route covers all 8 neighborhoods, e.g.
 * /neighborhoods/pineda-landing. Unlike the city pages, property type isn't
 * baked into the URL segment; it's driven entirely by the FilterBar/query
 * string, defaulting to showing all types.
 */
export async function generateMetadata({ params: paramsPromise, searchParams: searchParamsPromise }) {
  // Next.js 15 upgrade (2026-09-03) — `params`/`searchParams` became async
  // (Promises) in the App Router; await once at the top of each function
  // into the same `params`/`searchParams` names and leave every downstream
  // reference untouched, same pattern applied across every dynamic route
  // this session.
  const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);
  const { slug } = params;
  const primaryType = (searchParams.propertyType || 'Home').split(',')[0];

  // Same flags/listingsFilterParams logic as the page component further
  // below (kept in sync manually — generateMetadata and the page component
  // run as two separate functions with no shared state). See
  // listingsFilterParams's own fuller comment down there for the
  // per-community reasoning.
  const subCommunity = VIERA_BUILDERS_SUB_COMMUNITIES.find((c) => c.slug === slug);
  const isVieraBuildersCommunitiesVieraWest = slug === 'viera-builders-communities-viera-west';
  const isBeachWoods = slug === 'beach-woods';
  const isAquarina = slug === 'aquarina';
  const listingsFilterParams = subCommunity
    ? { subdivision: subCommunity.name }
    : isVieraBuildersCommunitiesVieraWest
      ? { subdivision: searchParams.subdivision || VIERA_BUILDERS_SUB_COMMUNITIES.map((c) => c.name).join(',') }
      : isBeachWoods
        ? { subdivision: BEACH_WOODS_SUBDIVISION_NAMES.join(',') }
        : isAquarina
          ? { subdivision: AQUARINA_SUBDIVISION_NAMES.join(',') }
          : { neighborhood: slug };
  const countPropertyType = searchParams.propertyType ? searchParams.propertyType.split(',') : undefined;

  // Display name for the count sentence — subCommunity/Beach Woods already
  // know their own name without a lookup; every other neighborhood
  // (Aquarina included — it's a real backend row) needs one. Fetched
  // unconditionally here, rather than only inside the old
  // failure-fallback branch, since the count prefix now needs it on the
  // successful-SEO path too.
  let neighborhoodName = subCommunity ? subCommunity.name : isBeachWoods ? 'Beach Woods' : null;
  if (!neighborhoodName) {
    try {
      const { neighborhood } = await api.getNeighborhood(slug);
      neighborhoodName = neighborhood.name;
    } catch {
      // No neighborhood row at all (real 404) — every branch below already
      // tolerates a null neighborhoodName by skipping the count prefix.
    }
  }

  if (!subCommunity && !isBeachWoods) {
    // Skipped for the 6 synthetic sub-community pages and Beach Woods —
    // there's no backend SEO row for any of them (they don't exist as real
    // neighborhoods), so this would just be a guaranteed-to-fail request
    // every time (same optimization the page component below already
    // makes).
    try {
      const { seo } = await api.getNeighborhoodSeo(slug, primaryType);
      const countPrefix = await buildNeighborhoodListingCountPrefix({
        listingsFilterParams,
        propertyType: countPropertyType,
        neighborhoodName,
      });
      return {
        title: seo.title,
        description: `${countPrefix}${seo.metaDescription}`,
        keywords: seo.keywords,
        alternates: { canonical: seo.canonicalUrl || seo.canonicalPath },
      };
    } catch {
      // The SEO call fails two different ways here: the backend endpoint
      // itself is unreachable (2026-09-11 audit finding — see sitemap.js's
      // comment for the full story), or there's simply no SEO row yet for
      // this neighborhood/property type. Either way, fall through to the
      // hand-written fallback below instead of returning {}, which would
      // otherwise inherit the generic sitewide title/description from the
      // root layout.
    }
  }

  // Beach Woods (per Ryan, 2026-09-19) and the 6 Viera Builders Communities
  // Viera West sub-community pages (e.g. Pangea Park) aren't real
  // `neighborhoods` table rows, so they never had a backend SEO row to
  // begin with — see lib/constants.js's BEACH_WOODS_SUBDIVISION_NAMES/
  // VIERA_BUILDERS_SUB_COMMUNITIES comments.
  const countPrefix = await buildNeighborhoodListingCountPrefix({
    listingsFilterParams,
    propertyType: countPropertyType,
    neighborhoodName,
  });
  if (subCommunity) {
    return {
      title: `${subCommunity.name} | Viera West, FL | Brevard Coastal Homes`,
      description: `${countPrefix}Browse listings in ${subCommunity.name}, a Viera Builders community in Viera West, FL.`,
    };
  }
  if (isBeachWoods) {
    return {
      title: 'Beach Woods Condos & Townhomes | Melbourne Beach, FL | Brevard Coastal Homes',
      description: `${countPrefix}Browse condos and townhomes for sale in Beach Woods, a gated riverfront-to-oceanfront community in Melbourne Beach, FL.`,
    };
  }
  if (neighborhoodName) {
    return {
      title: `${neighborhoodName} Real Estate | Brevard Coastal Homes`,
      description: `${countPrefix}Browse homes, condos, and land for sale in ${neighborhoodName}, FL — updated from the MLS.`,
    };
  }
  return {};
}

export default async function NeighborhoodListingsPage({ params: paramsPromise, searchParams: searchParamsPromise }) {
  // Next.js 15 upgrade (2026-09-03) — see generateMetadata's identical
  // comment above. Awaiting into the same `params`/`searchParams` names
  // keeps every reference in this large function body unchanged.
  const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);
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
  // Beach Woods (Melbourne Beach) — per Ryan (2026-09-19): same "stand-in
  // neighborhood, no backend row" treatment as the Viera Builders
  // sub-communities above, just a single page rather than a hub + 6 leaves.
  // See lib/constants.js's BEACH_WOODS_SUBDIVISION_NAMES for the full
  // reasoning and how its listings get matched.
  const isBeachWoods = slug === 'beach-woods';
  // Aquarina (Melbourne Beach) — per Ryan (2026-09-20). Unlike Beach Woods,
  // Aquarina IS a real `neighborhoods` table row, so the neighborhood
  // object/SEO content below still comes from the backend as normal for
  // it — only the listings query further down is overridden to filter by
  // an explicit subdivision list instead of neighborhood_id, since some of
  // Aquarina's sub-associations' MLS SubdivisionName values weren't getting
  // tied to it. See lib/constants.js's AQUARINA_SUBDIVISION_NAMES for the
  // full reasoning and how this was found. (isAquarina itself is declared
  // once, further below near AQUARINA_COMBINED_H1, and reused here — see
  // that declaration's own comment for the H1-driven reasoning it was
  // originally added for.)
  const isAquarina = slug === 'aquarina';

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
  } else if (isBeachWoods) {
    neighborhood = {
      slug,
      name: 'Beach Woods',
      city: { slug: 'melbourne-beach' },
      // No dedicated lat/lng of its own (same as the Viera Builders
      // sub-communities) — the map center falls back to the parent city's
      // coordinate below, which is Melbourne Beach itself, close enough
      // for a single-community page like this one.
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
  if (!subCommunity && !isBeachWoods) {
    // Skipped for the 6 synthetic sub-community pages and Beach Woods
    // above — there's no backend SEO row for any of them (they don't
    // exist as real neighborhoods), so this would just be a
    // guaranteed-to-fail request every time.
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
  //  - Aquarina: a real neighborhood row, but filters by `subdivision`
  //    too (per Ryan, 2026-09-20) rather than `neighborhood: slug` — see
  //    isAquarina's comment above and AQUARINA_SUBDIVISION_NAMES in
  //    lib/constants.js for why the neighborhood_id link can't be trusted
  //    to include every one of its sub-associations.
  const listingsFilterParams = subCommunity
    ? { subdivision: subCommunity.name }
    : isVieraBuildersCommunitiesVieraWest
      ? { subdivision: searchParams.subdivision || VIERA_BUILDERS_SUB_COMMUNITIES.map((c) => c.name).join(',') }
      : isBeachWoods
        ? { subdivision: BEACH_WOODS_SUBDIVISION_NAMES.join(',') }
        : isAquarina
          ? { subdivision: AQUARINA_SUBDIVISION_NAMES.join(',') }
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
  //
  // Each variant keeps its own HEADING (rendered in the big bold H1,
  // unchanged below). The separate per-variant SUBTEXT constants that used
  // to sit here (Home/Condo/Combined, each with its own foreclosures-or-not
  // wording, plus the HARBOR_ISLAND_BEACH_CLUB_SUBTEXT ternary that picked
  // between them) were removed entirely 2026-09-16, per Ryan, who pasted
  // one universal replacement paragraph covering all three variants at
  // once: "Can you change the text on the harbor Island Beach Club to the
  // following & add a link to 'Contact Us Today' and make the words start
  // with caps like I did." — see the render section below (the same
  // isHarborIslandBeachClub block that used to read
  // HARBOR_ISLAND_BEACH_CLUB_SUBTEXT) for the new copy, styled to match the
  // Adelaide/Aripeka paragraph blocks rather than keeping the old bulleted
  // list (which no longer applies once every variant shares one paragraph).
  const HARBOR_ISLAND_BEACH_CLUB_HOME_HEADING = 'Harbor Island Beach Club, Melbourne Beach FL Homes for sale.';
  const HARBOR_ISLAND_BEACH_CLUB_CONDO_HEADING = 'Harbor Island Beach Club, Melbourne Beach FL Condos for sale.';
  // Combined heading (2026-09-01, per Ryan) — shown only for the "<Name>
  // Listings" header link's own bare /neighborhoods/harbor-island-beach-club
  // URL (no ?propertyType= param), the same hasExplicitPropertyTypeFilter
  // distinction AQUARINA_COMBINED_H1 below uses. Before this, that bare URL
  // fell through to the Home-specific heading above (primaryType defaults
  // to 'Home' whenever no param is present), which read as Homes-only even
  // though the page itself shows every type combined. The "Homes"/"Condos"
  // sub-links keep their own existing single-type heading untouched.
  // Ryan's 2026-09-16 pasted replacement text opened with this same
  // heading (en dash vs. comma) — read as restating page context rather
  // than a request to change it, same reasoning as the Adelaide
  // neighborhood-page H1 further below, so left as-is here.
  const HARBOR_ISLAND_BEACH_CLUB_COMBINED_HEADING =
    'Harbor Island Beach Club Homes & Condos For Sale, Melbourne Beach, Florida';
  const HARBOR_ISLAND_BEACH_CLUB_HEADING = !hasExplicitPropertyTypeFilter
    ? HARBOR_ISLAND_BEACH_CLUB_COMBINED_HEADING
    : primaryType === 'Condo'
      ? HARBOR_ISLAND_BEACH_CLUB_CONDO_HEADING
      : HARBOR_ISLAND_BEACH_CLUB_HOME_HEADING;
  // HARBOR_ISLAND_BEACH_CLUB_H1 kept as the heading-only value so every
  // other reference to "the H1" below (h1Text's ternary chain) needs no
  // further changes.
  const HARBOR_ISLAND_BEACH_CLUB_H1 = HARBOR_ISLAND_BEACH_CLUB_HEADING;
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
  // HARBOR_ISLAND_BEACH_CLUB_H1's identical combined-vs-single-type check.
  // isAquarina itself is now declared once, up near isBeachWoods — see that
  // declaration's comment for the 2026-09-20 subdivision-filtering reason
  // it moved up there — and reused here unchanged.)
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
  // Parenthetical "(Pangea Park, Laurasia, ...)" list dropped from the end
  // of this H1 (2026-09-15, per Ryan: "separate the neighborhoods into a
  // separate bullet point & keep the links below") — those 6 names now
  // duplicated the live bulleted link list rendered right below the H1
  // (added earlier the same day), so trimming this here removes that
  // redundancy rather than naming them twice. Original full sentence
  // (with the parenthetical) preserved in git history if ever needed.
  const VIERA_BUILDERS_COMMUNITIES_VIERA_WEST_H1 =
    'Viera Builders Communities located in Viera West, FL Real Estate & Homes for Sale include the following neighborhoods';
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
  // Beach Woods (per Ryan, 2026-09-19) — hand-written, same reasoning as
  // ARIPEKA_COMBINED_H1 above (no single-type backend h1 to derive this
  // from, since there's no backend row at all). "Condos & Townhomes"
  // rather than just "Condos" even though every unit here is Condo-typed
  // in the MLS (see BEACH_WOODS_SUBDIVISION_NAMES's comment) — Ryan's own
  // request called them "condos & townhomes," matching how the community's
  // own POA site describes its mix of town homes, villas, quads, and a
  // riverside condo building.
  const BEACH_WOODS_H1 = 'Beach Woods Condos & Townhomes For Sale - Melbourne Beach, Florida';
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
                : isBeachWoods
                  ? BEACH_WOODS_H1
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
        {/* Viera Builders Communities Viera West sub-community links
            (2026-09-15, per Ryan: "I would also like to create live links
            for each neighborhood by Viera Builders... list the
            neighborhoods by bullet point & make the links live") — the H1
            used to name all 6 sub-communities in parentheses as plain
            text; this renders a real bulleted list directly below it
            instead, each name a live <Link> to that sub-community's own
            page (e.g. /neighborhoods/pangea-park) — same 6 pages driven by
            VIERA_BUILDERS_SUB_COMMUNITIES in lib/constants.js, which
            already existed and already work (built 2026-08-05, same
            NeighborhoodListingsPage template as every other neighborhood,
            filtering listings by the subdivision matching that
            sub-community's name — see the subCommunity handling above).
            Ryan's message also asked to "create an individual page for
            each of the subdivisions" — those pages were already built
            then, just never linked to from anywhere on the site (Nav.js
            has no entry for them, per its own lack of any
            VIERA_BUILDERS_SUB_COMMUNITIES reference), so this list is
            what actually makes them reachable/"live" for a visitor. Listed
            alphabetically, matching the array's existing order (and the
            H1's own former listing order). Atlin Cove keeps its "(Coming
            Soon)" suffix, matching the comingSoon flag's existing "Homes
            for Sale in Atlin Cove, FL (Coming Soon)" H1 treatment on its
            own page — still linked (not disabled), just labeled, since
            Ryan didn't ask for it to be excluded.
            Restyled same day, per Ryan's follow-up ("separate the
            neighborhoods into a separate bullet point & keep the links
            below. Can you do the links in black & put them in 2 columns of
            3 & make the links a lot larger") — that follow-up also
            dropped the now-redundant parenthetical names from the H1
            itself (see VIERA_BUILDERS_COMMUNITIES_VIERA_WEST_H1 above), so
            this <ul> is now the only place the 6 names appear. 2-column
            grid (auto-flows into 3 rows for 6 items, i.e. 2 columns of 3,
            without hardcoding row breaks that would need updating if a
            7th community is ever added), black link text (literal #000 —
            "in black", not the brand's near-black --color-ink tokens used
            elsewhere on this page), well above every other body/bullet
            text on this page for emphasis as the page's main set of calls
            to action.
            Refined again same day per Ryan's next follow-up ("make all the
            text & links look very professional & clean" + "easy to
            navigate on mobile too"): grid columns switched from a fixed
            "repeat(2, ...)" to "repeat(auto-fit, minmax(200px, 1fr))" with
            a maxWidth cap — this holds the 2-column/3-row desktop layout
            (two ~290px-wide columns fit under the 620px cap) but lets the
            grid collapse to a single column on narrow phone screens with
            no media query needed, the same no-media-query responsive
            trick already used by this page's H1 font-size and the
            container padding right above (both via clamp()). Font size
            likewise switched from a fixed 28px to
            clamp(19px, 3vw, 26px) so it scales down on small screens
            instead of forcing a 2-column layout to squeeze into one; font
            weight eased from 700 to 600 and the underline given a touch
            of textUnderlineOffset for a cleaner, less clunky look while
            staying clearly identifiable as links now that they're plain
            black instead of gold. Scoped to the wrapper page only via
            isVieraBuildersCommunitiesVieraWest — the 6 sub-community pages
            render their own filtered version of this same grid instead (see
            the subCommunity block below, restyled to match this one
            2026-09-18). */}
        {isVieraBuildersCommunitiesVieraWest && (
          <ul
            style={{
              display: 'grid',
              // Column min-width bumped 200px -> 340px (and maxWidth 620 ->
              // 720 to match) on 2026-09-15's 2nd follow-up, per Ryan: "move
              // the 2nd column more to the right so the 3 rows each only
              // take up one line" — at the original 200px minimum, the
              // longest entry ("Atlin Cove (Coming Soon)") wrapped onto 2
              // lines at this font size (measured ~306px of text alone,
              // wider than the ~279px column that resulted), which both
              // wrapped that one row and left the 2nd column sitting closer
              // to the 1st than Ryan wanted. 340px comfortably fits that
              // longest entry on one line with room to spare, and pushes
              // column 2 further right as a result. Still auto-fit (not a
              // hardcoded repeat(2, ...)), so it keeps collapsing to a
              // single column on narrow/mobile screens with no media query
              // needed — see the 2-column-grid comment above for that
              // mechanism; it just now needs a bit more width available
              // before it switches to 2 columns.
              // maxWidth is 760, not the "720" you'd expect from
              // 2*340px-columns + 40px gap — this <ul>'s own paddingLeft:22
              // (below) is subtracted from that box under this site's
              // global border-box sizing, so a 720 cap left only 698px of
              // actual content width for the grid tracks, just short of the
              // 720px two 340px-columns need, and silently collapsed to 1
              // column. 760 leaves enough room for the padding plus a
              // little slack.
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              maxWidth: 760,
              columnGap: 40,
              rowGap: 14,
              fontSize: 'clamp(19px, 3vw, 26px)',
              fontWeight: 600,
              lineHeight: 1.4,
              marginBottom: 20,
              paddingLeft: 22,
            }}
          >
            {VIERA_BUILDERS_SUB_COMMUNITIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/neighborhoods/${c.slug}`}
                  style={{ color: '#000', textDecoration: 'underline', textUnderlineOffset: 3 }}
                >
                  {c.name}
                </Link>
                {c.comingSoon ? ' (Coming Soon)' : ''}
              </li>
            ))}
          </ul>
        )}
        {/* Sibling-community links on each individual Viera Builders page —
            restyled 2026-09-18 (per Ryan, pasting a screenshot of the hub
            grid above: "Can you keep these links consistent on each
            individual viera builders neighborhood to look like this on
            each individual neighborhood page? ... Obviously if its an
            individual page like Pangea park then you dont have to show the
            Pangea Park link"). Originally added 2026-09-15 as a single
            small muted sentence ("X is one of the Viera Builders
            communities... See also: A, B, C") — see git history for that
            version and the SEO reasoning behind adding sibling links at
            all (small-inventory dead-end pages + crawl/authority sharing
            between the cluster). This swaps that sentence for the exact
            same heading text and bold/black/underlined 2-column grid as
            the hub page above, reusing VIERA_BUILDERS_COMMUNITIES_VIERA_
            WEST_H1 verbatim (it already reads fine standalone — it
            describes the group, not "this page" specifically) so a
            visitor sees an identical-looking link block no matter which of
            the 7 pages they land on, same as Ryan's reference screenshot.
            Rendered as an <h2>, not a second <h1> — each page's own H1
            above ("Homes for Sale in {subCommunity.name}, FL") stays the
            page's one true H1 for on-page SEO structure, so this heading
            is sized a step smaller (clamp(22px,3vw,30px) vs the H1's
            clamp(26px,3.5vw,38px)) while keeping the same bold Inter Tight
            treatment — a visitor reads it as visually consistent with the
            hub page without the page technically having two H1s.
            Still excludes the current page's own community via the same
            .filter() as the sentence version had (no reason to link Pangea
            Park back to itself from its own page), and still reads
            VIERA_BUILDERS_SUB_COMMUNITIES in its existing order so it stays
            in sync with any future reordering there. Scoped via
            subCommunity (truthy only for the 6 leaf pages — the hub page
            itself uses isVieraBuildersCommunitiesVieraWest above instead,
            so the two blocks never both render). */}
        {subCommunity && (
          <>
            <h2
              style={{
                fontSize: 'clamp(22px, 3vw, 30px)',
                marginBottom: 8,
                fontFamily: 'var(--font-inter-tight)',
                fontWeight: 800,
              }}
            >
              {VIERA_BUILDERS_COMMUNITIES_VIERA_WEST_H1}
            </h2>
            <ul
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                maxWidth: 760,
                columnGap: 40,
                rowGap: 14,
                fontSize: 'clamp(19px, 3vw, 26px)',
                fontWeight: 600,
                lineHeight: 1.4,
                marginBottom: 20,
                paddingLeft: 22,
              }}
            >
              {VIERA_BUILDERS_SUB_COMMUNITIES.filter((c) => c.slug !== subCommunity.slug).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/neighborhoods/${c.slug}`}
                    style={{ color: '#000', textDecoration: 'underline', textUnderlineOffset: 3 }}
                  >
                    {c.name}
                  </Link>
                  {c.comingSoon ? ' (Coming Soon)' : ''}
                </li>
              ))}
            </ul>
          </>
        )}
        {/* Harbor Island Beach Club subtext — replaced entirely 2026-09-16,
            per Ryan: "Can you change the text on the harbor Island Beach
            Club to the following & add a link to 'Contact Us Today' and
            make the words start with caps like I did. 'Harbor Island Beach
            Club Homes & Condos For Sale – Melbourne Beach, Florida /
            Looking for a home or condo in Harbor Island Beach Club? We can
            help you find available properties, including bank-owned
            condos, arrange private showings, negotiate on your behalf, and
            guide you through the entire purchase process from start to
            closing. / Contact us today to begin your search.'" — replaces
            the prior 3-variant (Home/Condo/Combined) bulleted subtext
            entirely (see HARBOR_ISLAND_BEACH_CLUB_HEADING's comment above
            for what happened to those per-variant constants) with one
            universal 2-paragraph block shown for all three variants alike,
            same pattern as the Adelaide/Aripeka blocks below (which this
            now matches in styling too — 18px/muted-dark paragraphs, not
            the old 21px/600-weight bullets). The pasted text's first line
            duplicates HARBOR_ISLAND_BEACH_CLUB_COMBINED_HEADING (en dash
            vs. comma) — left as page-context, not an H1 edit, same
            reasoning noted on that constant above.
            "Contact Us Today" linked via ContactUsTrigger.js (same
            ContactModal popup as Adelaide/Aripeka) and capitalized per
            Ryan's explicit instruction ("make the words start with caps
            like I did" — Ryan's own instruction text used title case even
            though the pasted paragraph below it used sentence case, so the
            title-cased version is what's rendered, matching the
            Adelaide/Aripeka link text's 2026-09-16 capitalization change).
            The original underlined "Foreclosed Bank-Owned Condos" inline
            link (HarborIslandForeclosuresTrigger, opening the foreclosures
            "Send Us a Message" modal via a CustomEvent — see that file and
            HarborIslandInquiryModals.js for the full mechanism) was dropped
            from this text when it was first replaced, since it wasn't part
            of Ryan's pasted copy — the always-visible maroon "Contact Us
            Here about Foreclosures in Harbor Island" button
            (HarborIslandInquiryModals.js, via FilterBar's extraActions
            prop below) kept the flow reachable in the meantime.
            "bank-owned condos" -> "Foreclosed bank-owned condos", bolded
            (2026-09-16 follow-up, per Ryan: "Can you put 'Foreclosed
            bank-owned condos' in bold & add Foreclosed") — at first plain
            <strong> emphasis, no link.
            Turned back into a live link 2026-09-16, same day, per Ryan
            (pasting a screenshot of the foreclosures "Send Us a Message"
            modal): "Can you make the Foreclosed bank-owned condos a live
            link & have this pop up box pop up when the link is clicked
            on?" — re-wraps the phrase in HarborIslandForeclosuresTrigger
            (import restored above), nested inside the <strong> so the text
            stays bold AND underlined/clickable, opening the exact same
            foreclosures modal the maroon button does (confirmed via the
            screenshot: "Send Us a Message" / "...current foreclosures in
            Harbor Island Beach Club. We will reach out shortly!" — this is
            HarborIslandInquiryModals's 'foreclosures' modal, not a new one).
            "Contact Us Today" bolded 2026-09-16, same day, per Ryan: "Also
            put Contact Us Today text in bold on the pages of Aripeka,
            Adelaide, & Harbor Island Beach club." — wraps the existing
            ContactUsTrigger in a <strong>, same pattern already used just
            above for "Foreclosed bank-owned condos" (link nested inside
            <strong> so the text stays both bold and underlined/clickable).
            Applied identically to the Aripeka and Adelaide blocks below. */}
        {isHarborIslandBeachClub && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
              Looking for a home or condo in Harbor Island Beach Club? We can help you find available properties,
              including{' '}
              <strong>
                <HarborIslandForeclosuresTrigger>Foreclosed bank-owned condos</HarborIslandForeclosuresTrigger>
              </strong>
              , arrange private showings, negotiate on your behalf, and guide you through the entire purchase process
              from start to closing.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
              <strong>
                <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
              </strong>{' '}
              to begin your search.
            </p>
            {/* Reciprocal Homes<->Condos cross-link (per Ryan, 2026-09-20):
                the Condo-filtered variant of this page links to the
                Home-filtered variant, and vice versa, so a visitor on one
                type can jump straight to the other rather than having to
                clear the Property Type filter back to the combined view
                first. Only shown on the two single-type variants
                (hasExplicitPropertyTypeFilter) — the bare combined URL
                already shows both types together, so there's nothing to
                cross-link to there. Same lighter "see also" paragraph
                treatment as the Melbourne Beach Condos page's Beach
                Woods/Aquarina/Harbor Island cross-links (isMelbourneBeachCondos
                in app/[citySlug]/[propertySlug]/page.js), not the bold
                Viera Builders sibling-grid style — this is one related
                link, not a cluster of sibling pages. */}
            {hasExplicitPropertyTypeFilter && (
              <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginTop: 12 }}>
                {primaryType === 'Condo' ? (
                  <>
                    Looking for a home instead? See{' '}
                    <Link
                      href="/neighborhoods/harbor-island-beach-club?propertyType=Home"
                      style={{ color: '#000', textDecoration: 'underline' }}
                    >
                      Harbor Island Beach Club Homes For Sale
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    Looking for a condo instead? See{' '}
                    <Link
                      href="/neighborhoods/harbor-island-beach-club?propertyType=Condo"
                      style={{ color: '#000', textDecoration: 'underline' }}
                    >
                      Harbor Island Beach Club Condos For Sale
                    </Link>
                    .
                  </>
                )}
              </p>
            )}
          </div>
        )}
        {/* Aripeka builder note — replaced entirely 2026-09-16, per Ryan:
            "Now use the exact text for the Aripeka pages but there are 4
            builders to choose from instead of 3" — reuses the same
            2-paragraph template just written for the Adelaide block below
            (see that block's comment for the full pasted text and the
            "Contact us today" link-choice reasoning), with "Adelaide"
            swapped for "Aripeka" and "three" swapped for "four" (matching
            this page's actual builder count — the prior bulleted version
            of this block, replaced here, already said "four... builders,"
            just with an "award-winning" qualifier Ryan's exact template
            doesn't include, so that qualifier is dropped here too, same as
            the Adelaide block took Ryan's wording as given rather than
            keeping the old copy's extra adjectives).
            "Contact us today" underlined and wired to the same ContactModal
            popup via ContactUsTrigger.js (imported above, already used by
            the Adelaide block). Kept the same 18px/muted-dark paragraph
            styling as the Adelaide block. Scoped to Aripeka only via
            isAripeka — every other neighborhood page unaffected.
            Link text capitalized to "Contact Us Today" 2026-09-16, per
            Ryan: "Can you make 'Contact Us Today' exactly like this on the
            Adelaide & Aripeka pages instead of lower case" — was "Contact
            us today"; rest of each paragraph's sentence case is unchanged,
            only the linked phrase itself.
            "tour model homes" changed to "set up private tours of the model
            homes" 2026-09-16, per Ryan: "On the Aripeka & Adelaide pages can
            you change the text from tour model homes to 'set up private
            tours of the model homes'." Same swap applied to the identical
            Adelaide block below.
            Gated to `primaryType !== 'Land'` 2026-09-22 (added alongside the
            new Land-specific block just below) — this builder/homes copy
            only makes sense for Aripeka's Home view; Aripeka's Land view
            (?propertyType=Land, reached via Nav.js's NEIGHBORHOOD_LOTS_PAGE_SLUGS
            "Lots" link) now gets its own "land and lots" copy instead. */}
        {isAripeka && primaryType !== 'Land' && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
              Explore new construction and existing homes for sale in Aripeka. With four custom home builders to
              choose from, we can help you compare options, set up private tours of the model homes, negotiate with
              builders, and navigate the entire buying process through closing.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
              Looking for an Aripeka home?{' '}
              <strong>
                <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
              </strong>{' '}
              to get started.
            </p>
          </div>
        )}
        {/* Aripeka Land ("Lots") copy — added 2026-09-22, per Ryan: "for SEO
            would you suggest adding lots in the description along with land
            that is already there?" (about the Melbourne Beach Land page's
            intro copy — see LAND_AND_LOTS_CITY_SLUGS's comment in
            app/[citySlug]/[propertySlug]/page.js for the full request
            thread) then "Can you add it to the melbourne beach land page
            along with the Merritt island land page & the aripeka land page
            where you can add the word land. Make all three of the webpages
            the same with land & lots" plus the same-turn follow-up "Also do
            it to the Cocoa Beach land page." Aripeka has no dedicated Land
            *page* the way the 3 cities do (it's ?propertyType=Land on this
            same neighborhood route — see NEIGHBORHOOD_LOTS_PAGE_SLUGS in
            Nav.js), so this reuses the exact same "Discover land and lots
            for sale in ___, Florida..." template as the city Land pages
            (word-for-word, just swapping in "Aripeka") to satisfy Ryan's
            "make all three/four the same" ask, rather than adapting
            Aripeka's builder-specific copy above (which doesn't apply to
            raw land lots). Shown only on the Land-filtered view
            (primaryType === 'Land'); the builder/homes block above is now
            gated to the opposite case so the two never render together. */}
        {isAripeka && primaryType === 'Land' && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
              Discover land and lots for sale in Aripeka, Florida, and let us make your land or lot search easier.
              We&rsquo;ll help you compare properties, arrange private showings, negotiate with sellers, and guide
              you through every step from your initial search to closing.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
              Start your Aripeka land or lot search today.{' '}
              <strong>
                <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
              </strong>{' '}
              to get started.
            </p>
            {/* Cross-link to Aripeka's Homes view (per Ryan, 2026-09-22: "add
                a link in there for the page aripeka homes for sale") — same
                lighter "see also" treatment as the Homes<->Condos cross-link
                above (Harbor Island Beach Club) and the Land<->Homes
                cross-link on the city Land pages (app/[citySlug]/[propertySlug]/page.js's
                LAND_AND_LOTS_CITY_SLUGS block). Links to
                ?propertyType=Home,Land (not just Home) to match Nav.js's own
                Aripeka "Homes" link, which per Ryan's 2026-08-21 request
                ("display both homes & Lots" in the Aripeka homes section)
                shows Home+Land combined — that resolves to primaryType
                'Home' (see primaryType's `.split(',')[0]` above), so it
                lands on this page's builder/homes copy block, not back on
                this Land copy. */}
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
              Looking for a home instead? See{' '}
              <Link href="/neighborhoods/aripeka?propertyType=Home,Land" style={{ color: '#000', textDecoration: 'underline' }}>
                Aripeka Homes For Sale
              </Link>
              .
            </p>
          </div>
        )}
        {/* Adelaide builder note — replaced entirely 2026-09-16, per Ryan:
            "Can you replace the text on the Adelaide pages with the
            following. 'Adelaide Homes For Sale – Viera, Florida / Explore
            new construction and existing homes for sale in Adelaide. With
            three custom home builders to choose from, we can help you
            compare options, tour model homes, negotiate with builders, and
            navigate the entire buying process through closing. / Looking
            for an Adelaide home? Contact us today to get started.'" — swaps
            out the prior 3-bullet list (the 2026-09-15 "In Adelaide there
            are three custom home builders..." wording, added right above
            the identical Aripeka block, see git history) for this shorter
            2-paragraph version. The 3-line pasted text's first line,
            "Adelaide Homes For Sale – Viera, Florida," duplicates the
            existing ADELAIDE_H1 below (same wording, en dash vs. hyphen) —
            read as restating the page context Ryan was replacing text
            *on*, not a request to change the H1 itself, so ADELAIDE_H1 is
            left untouched here.
            "Contact us today" underlined and wired to the same "Contact
            Us" popup Nav.js opens (ContactModal.js), via the new
            ContactUsTrigger.js — asked Ryan which phrase to link ("Contact
            us today" vs. "Contact us today to get started.") and used the
            shorter phrase: keeps the anchor text a clean, conventional CTA
            length (matching HarborIslandForeclosuresTrigger's linked
            phrase further up this file, which also links a short phrase
            rather than the whole sentence) rather than swallowing "to get
            started." into the underline too.
            Kept the same 18px/muted-dark paragraph styling as the block it
            replaces. Scoped to Adelaide only via isAdelaide — unchanged
            for every other neighborhood page.
            Link text capitalized to "Contact Us Today" 2026-09-16, per
            Ryan: "Can you make 'Contact Us Today' exactly like this on the
            Adelaide & Aripeka pages instead of lower case" — was "Contact
            us today"; rest of each paragraph's sentence case is unchanged,
            only the linked phrase itself.
            "tour model homes" changed to "set up private tours of the model
            homes" 2026-09-16, per Ryan: "On the Aripeka & Adelaide pages can
            you change the text from tour model homes to 'set up private
            tours of the model homes'." Same swap applied to the identical
            Aripeka block above. */}
        {isAdelaide && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
              Explore new construction and existing homes for sale in Adelaide. With three custom home builders to
              choose from, we can help you compare options, set up private tours of the model homes, negotiate with
              builders, and navigate the entire buying process through closing.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
              Looking for an Adelaide home?{' '}
              <strong>
                <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
              </strong>{' '}
              to get started.
            </p>
          </div>
        )}
        {/* Tortoise Island / Lansing Island / Summer Lakes / Aquarina / Suntree
            builder-free "generic" note — added 2026-09-16, per Ryan, pasting
            one template and asking for it on all five pages at once: "Explore
            homes for sale in Tortoise Island. We can help you compare
            options, tour homes, negotiate with sellers, and navigate the
            entire buying process through closing. / Looking for an Tortoise
            Island home? Contact Us Today to get started. ... Add this text to
            the Tortoise Island Pages, Lansing Island pages, Summer Lakes
            pages, Aquarina Pages, & Suntree pages. Just switch out the Name
            of the pages to match the neighborhood name." Unlike the
            Adelaide/Aripeka template (which names a specific builder count),
            this one is builder-agnostic ("tour homes"/"negotiate with
            sellers" instead of "tour model homes"/"negotiate with
            builders") — these 5 neighborhoods are resales, not new
            construction communities, matching Ryan's own wording exactly.
            Same 2-paragraph 18px/muted-dark styling, same ContactUsTrigger
            link (bold + underlined, per Ryan's same request: "Make the
            Contact Us Today Bold & underlined as a live link like the other
            pages you just did" — the Adelaide/Aripeka/Harbor Island Beach
            Club <strong><ContactUsTrigger> pattern added earlier this same
            day). One block per neighborhood, each gated on that
            neighborhood's own existing isX flag (all five already declared
            above, driving these pages' FilterBar options) so this can't
            leak onto any other neighborhood page.
            "a"/"an" corrected per neighborhood for grammar rather than
            copied verbatim from Ryan's literal "an Tortoise Island" — his
            instruction was to swap in each neighborhood's name, and
            Tortoise Island/Lansing Island/Summer Lakes/Suntree all start
            with a consonant sound ("a Tortoise Island home", etc.); only
            Aquarina keeps "an" (vowel sound), matching how "an Adelaide
            home"/"an Aripeka home" were already handled above. */}
        {isTortoiseIsland && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
              Explore homes for sale in Tortoise Island. We can help you compare options, tour homes, negotiate with
              sellers, and navigate the entire buying process through closing.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
              Looking for a Tortoise Island home?{' '}
              <strong>
                <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
              </strong>{' '}
              to get started.
            </p>
          </div>
        )}
        {isLansingIsland && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
              Explore homes for sale in Lansing Island. We can help you compare options, tour homes, negotiate with
              sellers, and navigate the entire buying process through closing.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
              Looking for a Lansing Island home?{' '}
              <strong>
                <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
              </strong>{' '}
              to get started.
            </p>
          </div>
        )}
        {isSummerLakes && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
              Explore homes for sale in Summer Lakes. We can help you compare options, tour homes, negotiate with
              sellers, and navigate the entire buying process through closing.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
              Looking for a Summer Lakes home?{' '}
              <strong>
                <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
              </strong>{' '}
              to get started.
            </p>
          </div>
        )}
        {isAquarina && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
              Explore homes for sale in Aquarina. We can help you compare options, tour homes, negotiate with
              sellers, and navigate the entire buying process through closing.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
              Looking for an Aquarina home?{' '}
              <strong>
                <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
              </strong>{' '}
              to get started.
            </p>
            {/* Reciprocal Homes<->Condos cross-link (per Ryan, 2026-09-21),
                same pattern as Harbor Island Beach Club's identical block
                above: the Condo-filtered variant links to the Home-filtered
                variant and vice versa, shown only on the two single-type
                variants (hasExplicitPropertyTypeFilter) since the bare
                combined URL already shows both types together. */}
            {hasExplicitPropertyTypeFilter && (
              <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginTop: 12 }}>
                {primaryType === 'Condo' ? (
                  <>
                    Looking for a home instead? See{' '}
                    <Link href="/neighborhoods/aquarina?propertyType=Home" style={{ color: '#000', textDecoration: 'underline' }}>
                      Aquarina Homes For Sale
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    Looking for a condo instead? See{' '}
                    <Link href="/neighborhoods/aquarina?propertyType=Condo" style={{ color: '#000', textDecoration: 'underline' }}>
                      Aquarina Condos For Sale
                    </Link>
                    .
                  </>
                )}
              </p>
            )}
          </div>
        )}
        {isSuntree && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
              Explore homes for sale in Suntree. We can help you compare options, tour homes, negotiate with
              sellers, and navigate the entire buying process through closing.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
              Looking for a Suntree home?{' '}
              <strong>
                <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
              </strong>{' '}
              to get started.
            </p>
          </div>
        )}
        {/* Beach Woods CTA (per Ryan, 2026-09-19). Originally added with a
            first descriptive paragraph too (drawn from the community's own
            Property Owners Association site, beachwoodsmb.com/home/) — Ryan
            asked same day to delete that paragraph entirely and just keep
            this one CTA line, plus reword "a home" to "a property" ("Looking
            for a property in Beach Woods?"), matching Beach Woods' actual
            mix of condos/townhomes/villas better than "home" implied. Same
            18px/muted-dark + bold/underlined ContactUsTrigger styling as
            every other neighborhood block on this page, just the one
            paragraph instead of two now. */}
        {isBeachWoods && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
              Looking for a property in Beach Woods?{' '}
              <strong>
                <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
              </strong>{' '}
              to get started.
            </p>
          </div>
        )}
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12 }}>
          {total} result{total === 1 ? '' : 's'}
        </p>
      </div>

      <FilterBar
        waterfrontFlags={waterfrontFlags}
        hidePropertyType={isAdelaide || isSummerLakes || isBeachWoods}
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
