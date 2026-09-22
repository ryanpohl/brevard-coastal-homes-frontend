import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as api from '@/lib/api';
import {
  SLUG_TO_PROPERTY_TYPE,
  PROPERTY_TYPE_LABEL,
  CONDO_PRICE_BANDS,
  OCEANFRONT_SLUG_TO_PROPERTY_TYPE,
  OCEANFRONT_CITY_SLUGS,
  OCEANFRONT_LISTINGS_SLUG,
} from '@/lib/constants';
import FilterBar from '@/components/FilterBar';
import ListingResultsLayout from '@/components/ListingResultsLayout';
import HarborIslandInquiryModals from '@/components/HarborIslandInquiryModals';
import BuildingInquiryModal from '@/components/BuildingInquiryModal';
import ContactUsTrigger from '@/components/ContactUsTrigger';

// City page intro copy (2026-09-16, per Ryan, pasting one template and
// asking for it on every city page, with the city name and property type
// swapped in: "Discover homes for sale in Cocoa Beach, Florida, and let us
// make your home search easier. We'll help you compare properties, arrange
// private showings, negotiate with sellers, and guide you through every
// step from your initial search to closing. / Start your Cocoa Beach home
// search today. Contact Us Today to get started. ... Insert the correct
// cities & also insert homes, condos, or land depending on the page." —
// two small word-maps drive the per-propertyType substitution: the plural
// noun for "Discover ___ for sale" (homes/condos/land — matches Ryan's
// "homes, condos, or land" wording exactly) and the singular noun for the
// "___ search" phrase used twice further down (matches standard English
// compound-noun-modifier grammar — "home search"/"condo search", not
// "condos search" — same singular treatment Ryan's own template already
// used for "home search"). Declared as plain objects here (module scope,
// not exported) rather than added to PROPERTY_TYPE_LABEL above, since that
// map's "Single-Family Homes"/"Condos/Townhomes" wording is a page
// heading/label style, not the lowercase conversational copy this intro
// paragraph needs.
const CITY_PAGE_TYPE_NOUN = { Home: 'homes', Condo: 'condos', Land: 'land' };
const CITY_PAGE_SEARCH_NOUN = { Home: 'home', Condo: 'condo', Land: 'land' };

// "Land and lots" wording (2026-09-22, per Ryan, for SEO — asked after
// seeing the live Melbourne Beach Land page: "for SEO would you suggest
// adding lots in the description along with land that is already there?"
// then, once shown the proposed wording: "Can you add it to the melbourne
// beach land page along with the Merritt island land page & the aripeka
// land page where you can add the word land. Make all three of the
// webpages the same with land & lots" followed same-turn by "Also do it to
// the Cocoa Beach land page" — so 3 city Land pages plus the separate
// Aripeka neighborhood page (handled in app/neighborhoods/[slug]/page.js)
// get "lots" added alongside "land." Deliberately NOT a change to the
// shared CITY_PAGE_TYPE_NOUN/CITY_PAGE_SEARCH_NOUN maps above, which drive
// every city's Land page — Ryan named exactly these 4 pages, not every
// city, so this is a narrow override applied only when both the property
// type is Land and the city is one of these 4.
// Slugs match Nav.js's CITY_LOTS_NAV_SLUGS exactly (the 3 cities whose
// "Search by City" dropdown already gets a "Lots" link next to Homes/
// Condos, added 2026-08-30) — the same 3 cities that actually have a real
// dedicated Land page worth calling out lots on.
const LAND_AND_LOTS_CITY_SLUGS = ['merritt-island', 'cocoa-beach', 'melbourne-beach'];

// "Request Information on Property Management" CTA (per Ryan, 2026-08-26)
// — the blue button/modal originally built for the Harbor Island Beach
// Club neighborhood page (see HarborIslandInquiryModals.js), added here
// (without its Harbor-Island-specific Foreclosures button) to both the
// plain Condos pages AND the Oceanfront Condos pages for these 5 cities
// (the second, Oceanfront-Condos ask came as a same-day follow-up) — the
// same 5 barrier-island cities as OCEANFRONT_CITY_SLUGS above, chosen
// after confirming with Ryan that "Cape Canaveral" (not an actual city on
// this site) meant Indialantic.
const PROPERTY_MANAGEMENT_CTA_CITY_SLUGS = [
  'cocoa-beach',
  'melbourne-beach',
  'satellite-beach',
  'indian-harbour-beach',
  'indialantic',
];

// Matches the reference design's "1-30 of 34 Homes" pagination — the
// backend defaults to 24 if this isn't passed.
const PAGE_SIZE = 30;

// Oceanfront page exclusions (2026-09-14, per Ryan) — 320 Las Olas Drive
// (MLS #1081189) and 3220 River Villa Way #121 (MLS #1084560), both
// Melbourne Beach, were showing up under Search Oceanfront > Melbourne
// Beach even though both actually front the river/Intracoastal (a canal
// lagoon and a literal "River Villa" building, not the Atlantic) — the
// MLS feed's WaterfrontFeatures data for these two apparently says
// otherwise, and mapWaterfront() in the backend's listingMapper.service.js
// just trusts that. No admin UI or established deploy path from this
// session for correcting the backend's per-listing `waterfront` value
// directly (same "override in the frontend" situation as
// HOMEPAGE_NEIGHBORHOOD_ORDER in app/page.js), so this filters them out of
// Oceanfront results here instead — same "Recommended" scope Ryan chose:
// they're only hidden from the dedicated Oceanfront pages/dropdown, not
// from Melbourne Beach's regular Homes/Condos pages, and the "Oceanfront"
// badge on their own cards there is unchanged. Keyed by mlsNumber (the
// public MLS#, not Spark's internal mls_id) since that's what's visible
// and stable from this side. If the MLS feed's own data is ever corrected
// upstream (or the backend gains a real per-listing override), this list
// stops being necessary but stays harmless — it just won't match anything.
const OCEANFRONT_PAGE_EXCLUDED_MLS_NUMBERS = ['1081189', '1084560'];

/**
 * City listing page — one route covers all 10 cities x 3 property types
 * (homes-for-sale / condos-for-sale / land-for-sale), e.g. /cocoa-beach/homes-for-sale,
 * PLUS the 5-city x 2-type Oceanfront variant added 2026-08-22 (per Ryan)
 * — oceanfront-homes-for-sale/oceanfront-condos-for-sale, e.g.
 * /cocoa-beach/oceanfront-homes-for-sale — reusing this same dynamic
 * route rather than a separate one, since the URL shape
 * (/{citySlug}/{propertySlug}) already fits. See
 * OCEANFRONT_SLUG_TO_PROPERTY_TYPE/OCEANFRONT_CITY_SLUGS in
 * lib/constants.js for the gating.
 * SEO metadata (title/description/canonical) comes from the backend's
 * pre-generated /api/seo/city/:slug endpoint (or, for Oceanfront pages,
 * the computed-on-the-fly /api/seo/oceanfront/:citySlug endpoint) —
 * never hand-write per-page meta here.
 */
export async function generateMetadata({ params }) {
  // Next.js 15 upgrade (2026-09-03) — `params`/`searchParams` became async
  // (Promises) in the App Router; await once at the top of each function
  // and leave every downstream reference untouched, same pattern applied
  // across every dynamic route this session.
  const { citySlug, propertySlug } = await params;
  // Combined Oceanfront "Listings" page (2026-09-01, per Ryan) — see
  // OCEANFRONT_LISTINGS_SLUG in lib/constants.js. Checked before the normal
  // isOceanfront/propertyType lookups below since this slug isn't a key in
  // either OCEANFRONT_SLUG_TO_PROPERTY_TYPE or SLUG_TO_PROPERTY_TYPE — it
  // has no single property type of its own, it's always Home+Condo together.
  const isOceanfrontCombined = propertySlug === OCEANFRONT_LISTINGS_SLUG;
  const isOceanfront = Boolean(OCEANFRONT_SLUG_TO_PROPERTY_TYPE[propertySlug]);
  const propertyType = isOceanfront ? OCEANFRONT_SLUG_TO_PROPERTY_TYPE[propertySlug] : SLUG_TO_PROPERTY_TYPE[propertySlug];
  if (!propertyType && !isOceanfrontCombined) return {};
  if ((isOceanfront || isOceanfrontCombined) && !OCEANFRONT_CITY_SLUGS.includes(citySlug)) return {};

  // No backend SEO row exists for a combined-type view (page_seo is keyed
  // by a single propertyType, same limitation as app/[citySlug]/page.js's
  // own combined "Listings" page) — hand-write it from the city's own name
  // instead of calling api.getOceanfrontSeo.
  if (isOceanfrontCombined) {
    try {
      const { city } = await api.getCity(citySlug);
      return {
        title: `Oceanfront Homes & Condos For Sale in ${city.name}, FL | Brevard Coastal Homes`,
        description: `Browse every oceanfront home and condo listing in ${city.name}, FL in one place — updated from the MLS.`,
      };
    } catch {
      return {};
    }
  }

  try {
    const { seo } = isOceanfront
      ? await api.getOceanfrontSeo(citySlug, propertyType)
      : await api.getCitySeo(citySlug, propertyType);
    return {
      title: seo.title,
      description: seo.metaDescription,
      keywords: seo.keywords,
      alternates: { canonical: seo.canonicalUrl || seo.canonicalPath },
    };
  } catch {
    // Backend SEO endpoint unreachable (2026-09-11 SEO audit finding — the
    // live backend deploy predates this route entirely, see sitemap.js's
    // comment for the full story). Hand-write a reasonable per-page
    // fallback instead of returning {}, which would silently inherit the
    // generic sitewide "Brevard Coastal Homes" title/description from the
    // root layout on every city/oceanfront page site-wide — confirmed live
    // on /cocoa-beach/homes-for-sale before this fix, which rendered that
    // bare sitewide title instead of anything Cocoa-Beach- or Homes-specific.
    try {
      const { city } = await api.getCity(citySlug);
      const typeLabel = PROPERTY_TYPE_LABEL[propertyType] || propertyType;
      const oceanPrefix = isOceanfront ? 'Oceanfront ' : '';
      return {
        title: `${oceanPrefix}${typeLabel} For Sale in ${city.name}, FL | Brevard Coastal Homes`,
        description: `Browse ${oceanPrefix.toLowerCase()}${typeLabel.toLowerCase()} for sale in ${city.name}, FL — updated from the MLS.`,
      };
    } catch {
      return {};
    }
  }
}

export default async function CityListingsPage({ params, searchParams: searchParamsPromise }) {
  // Next.js 15 upgrade (2026-09-03) — see generateMetadata's identical
  // comment above. Awaiting into the same `searchParams` name here keeps
  // every `searchParams.x` reference below unchanged.
  const { citySlug, propertySlug } = await params;
  const searchParams = await searchParamsPromise;
  // Combined Oceanfront "Listings" page (2026-09-01, per Ryan) — see
  // OCEANFRONT_LISTINGS_SLUG in lib/constants.js and the matching
  // generateMetadata branch above.
  const isOceanfrontCombined = propertySlug === OCEANFRONT_LISTINGS_SLUG;
  const isOceanfront = Boolean(OCEANFRONT_SLUG_TO_PROPERTY_TYPE[propertySlug]);
  const propertyType = isOceanfront ? OCEANFRONT_SLUG_TO_PROPERTY_TYPE[propertySlug] : SLUG_TO_PROPERTY_TYPE[propertySlug];
  if (!propertyType && !isOceanfrontCombined) notFound();
  // Beach Woods cross-link (per Ryan, 2026-09-19: "put a link for this page
  // on the Melbourne Beach Condos page" — see the new
  // /neighborhoods/beach-woods page and lib/constants.js's
  // BEACH_WOODS_SUBDIVISION_NAMES). Scoped to this city's own plain Condos
  // route specifically (not the Oceanfront Condos variant or the combined
  // Oceanfront Listings page) — Ryan named "the Melbourne Beach Condos
  // page" singular, and Beach Woods isn't marketed as an oceanfront
  // community, so the plain Condos page is the more accurate place to
  // surface it.
  const isMelbourneBeachCondos = citySlug === 'melbourne-beach' && propertyType === 'Condo' && !isOceanfront && !isOceanfrontCombined;
  // Oceanfront pages (combined "Listings" included) only exist for the 5
  // barrier-island cities named by Ryan (2026-08-22) — e.g.
  // /melbourne/oceanfront-homes-for-sale (or /melbourne/oceanfront-listings)
  // 404s rather than silently rendering an unfiltered/mislabeled page.
  if ((isOceanfront || isOceanfrontCombined) && !OCEANFRONT_CITY_SLUGS.includes(citySlug)) notFound();

  let city;
  try {
    ({ city } = await api.getCity(citySlug));
  } catch {
    notFound();
  }

  let seo = null;
  let jsonLd = null;
  if (!isOceanfrontCombined) {
    // Skipped for the combined page — there's no backend SEO row for a
    // combined-type view (see generateMetadata above), so this would just
    // be a guaranteed-to-fail request every time.
    try {
      ({ seo, jsonLd } = isOceanfront
        ? await api.getOceanfrontSeo(citySlug, propertyType)
        : await api.getCitySeo(citySlug, propertyType));
    } catch {
      // No SEO row yet (e.g. seed:seo hasn't run) — render with sensible fallbacks below.
    }
  }

  // The URL segment picks the primary property type; SearchBar/FilterBar can widen
  // the filter to multiple types via the `propertyType` query param (comma-joined).
  // The combined Oceanfront "Listings" page has no single URL-segment-derived
  // type at all — it always covers both Home and Condo, the only two
  // Oceanfront types that exist (see OCEANFRONT_PROPERTY_TYPE_TO_SLUG).
  const effectivePropertyTypes = searchParams.propertyType
    ? searchParams.propertyType.split(',')
    : isOceanfrontCombined
      ? ['Home', 'Condo']
      : [propertyType];

  const page = Number(searchParams.page) || 1;

  let results = [];
  let total = 0;
  let totalPages = 1;
  try {
    const data = await api.getListings({
      city: citySlug,
      propertyType: effectivePropertyTypes,
      priceMin: searchParams.priceMin,
      priceMax: searchParams.priceMax,
      beds: searchParams.beds,
      baths: searchParams.baths,
      // Oceanfront pages (per Ryan, 2026-08-22), combined "Listings" view
      // included, force the Waterfront filter to Oceanfront server-side,
      // ignoring any ?waterfront= a visitor's URL might otherwise carry —
      // there's no Waterfront dropdown on these pages to set it from
      // anyway (see hideWaterfront on FilterBar below).
      waterfront: isOceanfront || isOceanfrontCombined ? 'Oceanfront' : searchParams.waterfront,
      // "55+ Communities" (2026-08-14) — the control only ever renders on
      // Viera West's Homes/Condos pages (see show55Filter below), so this
      // param will only be set there in practice. Forwarded unconditionally
      // like every other param here rather than gated on isVieraWest — no
      // harm if it were ever set on another city's URL, since the backend's
      // buildWhereClause only applies a clause when it's 'exclude'/'only'.
      seniorCommunity: searchParams.seniorCommunity,
      sort: searchParams.sort,
      page,
      pageSize: PAGE_SIZE,
    });
    results = data.results || [];
    total = data.total ?? results.length;
    totalPages = data.totalPages || 1;

    // See OCEANFRONT_PAGE_EXCLUDED_MLS_NUMBERS above. Only applied on the
    // Oceanfront-filtered pages themselves — a plain city Homes/Condos page
    // still shows these two normally. `total`/`totalPages` are adjusted by
    // however many were excluded from *this* page's results; with only two
    // known exclusions and PAGE_SIZE=30, both will realistically land on
    // page 1 of any city's Oceanfront results, so this stays accurate in
    // practice even though it isn't a true sitewide recount.
    if (isOceanfront || isOceanfrontCombined) {
      const beforeCount = results.length;
      results = results.filter((listing) => !OCEANFRONT_PAGE_EXCLUDED_MLS_NUMBERS.includes(String(listing.mlsNumber)));
      const excludedCount = beforeCount - results.length;
      if (excludedCount > 0) {
        total = Math.max(0, total - excludedCount);
        totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      }
    }
  } catch {
    // Backend unreachable or no matches — render an empty grid rather than crashing.
  }

  // Melbourne and Rockledge (per Ryan, 2026-08-06): drop Oceanfront from
  // the Waterfront dropdown on their Homes and Condos pages specifically —
  // both are mainland cities that only front the Indian River, not the
  // ocean (unlike barrier-island cities such as Indialantic/Melbourne
  // Beach/Satellite Beach). Land wasn't mentioned for either, so it's left
  // with the full Oceanfront+Riverfront set from city.filters. Same
  // excludeWaterfrontOptions prop FilterBar already supports for Lansing
  // Island/Tortoise Island on the neighborhood pages.
  const CITIES_EXCLUDING_OCEANFRONT = ['melbourne', 'rockledge'];
  const excludeWaterfrontOptions =
    CITIES_EXCLUDING_OCEANFRONT.includes(citySlug) && propertyType !== 'Land' ? ['Oceanfront'] : undefined;

  // "55+ Communities" filter (2026-08-14, per Ryan) — Viera West's
  // Homes/Condos pages only, not Land. See FilterBar.js's show55Filter
  // prop and listings.controller.js's buildWhereClause for the rest of
  // the plumbing.
  const show55Filter = citySlug === 'viera-west' && propertyType !== 'Land';

  // See PROPERTY_MANAGEMENT_CTA_CITY_SLUGS above — every Condos page (both
  // the plain city page and, per Ryan's 2026-08-26 follow-up, the
  // Oceanfront Condos variant) for these 5 cities. Not gated on
  // `!isOceanfront` — PROPERTY_MANAGEMENT_CTA_CITY_SLUGS is exactly the
  // same 5-city set as OCEANFRONT_CITY_SLUGS, so this naturally covers
  // both /condos-for-sale and /oceanfront-condos-for-sale for each.
  // Combined "Listings" view always includes Condos (Home+Condo together),
  // so it gets this CTA on the same 5 cities too.
  const showPropertyManagementCTA =
    (propertyType === 'Condo' || isOceanfrontCombined) && PROPERTY_MANAGEMENT_CTA_CITY_SLUGS.includes(citySlug);

  // "Interested in Building?" CTA (2026-08-29, per Ryan) — every city's
  // dedicated Land ("Lot/Land") page, i.e. every /[citySlug]/land-for-sale
  // route (this same dynamic route file handles all 10 cities x 3
  // property types, so `propertyType === 'Land'` alone covers all of
  // them — there's no separate Oceanfront Land variant to also check,
  // per OCEANFRONT_SLUG_TO_PROPERTY_TYPE above only mapping Home/Condo).
  // See BuildingInquiryModal.js.
  const showBuildingCTA = propertyType === 'Land';

  const typeLabel = isOceanfrontCombined
    ? 'Oceanfront Listings'
    : isOceanfront
      ? `Oceanfront ${PROPERTY_TYPE_LABEL[propertyType] || 'Homes'}`
      : PROPERTY_TYPE_LABEL[propertyType] || 'Homes';

  // Intro copy word choice for the 5-city Oceanfront pages (2026-09-16, per
  // Ryan, pasting a screenshot of the Search Oceanfront nav dropdown —
  // "<City> Listings" plus each city's "Oceanfront Homes"/"Oceanfront
  // Condos" sub-links: "Can you do these changes for all of the search
  // oceanfront pages also.") — same CITY_PAGE_TYPE_NOUN/CITY_PAGE_SEARCH_NOUN
  // maps as the plain city pages, just prefixed with "oceanfront " so the
  // copy correctly says "oceanfront homes"/"oceanfront condos" rather than
  // plain "homes"/"condos" on a page that's specifically about waterfront
  // listings. The combined "Listings" view (isOceanfrontCombined) has no
  // single propertyType of its own (always Home+Condo together — see
  // effectivePropertyTypes above), so it reuses the same "properties"/
  // "property" wording the sibling combined city-Listings page
  // (app/[citySlug]/page.js) already uses for the identical reason.
  // See LAND_AND_LOTS_CITY_SLUGS above — Land is never an Oceanfront
  // property type (no OCEANFRONT_SLUG_TO_PROPERTY_TYPE.Land, no combined
  // Oceanfront Land view either), so `propertyType === 'Land'` alone is
  // enough to identify these cities' plain Land pages, same reasoning
  // showBuildingCTA above already relies on.
  const useLandAndLotsWording = propertyType === 'Land' && LAND_AND_LOTS_CITY_SLUGS.includes(citySlug);
  const introTypeNoun = useLandAndLotsWording
    ? 'land and lots'
    : isOceanfrontCombined
      ? 'oceanfront properties'
      : isOceanfront
        ? `oceanfront ${CITY_PAGE_TYPE_NOUN[propertyType]}`
        : CITY_PAGE_TYPE_NOUN[propertyType];
  const introSearchNoun = useLandAndLotsWording
    ? 'land or lot'
    : isOceanfrontCombined
      ? 'oceanfront property'
      : isOceanfront
        ? `oceanfront ${CITY_PAGE_SEARCH_NOUN[propertyType]}`
        : CITY_PAGE_SEARCH_NOUN[propertyType];
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  // Real per-listing coordinates come from the Spark MLS sync (null until
  // then); the map center falls back to the city's own coordinate so it's
  // always centered on the right place even with zero pins to show yet.
  const mapCenter = city.latitude != null && city.longitude != null ? { lat: city.latitude, lng: city.longitude } : null;

  return (
    <div>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 0' }}>
        {/* fontFamily: Inter Tight (2026-08-21, per Ryan: "Change the font
            to inter tight on all the pages city & neighborhood
            descriptions") — this H1 is the only "description"-style text
            on this page (no separate description paragraph exists, just
            this heading + the "N results" line below it). */}
        <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 8, fontFamily: 'var(--font-inter-tight)' }}>
          {isOceanfrontCombined
            ? `Oceanfront Homes & Condos For Sale in ${city.name}, FL`
            : seo?.h1 ||
              (isOceanfront
                ? `Oceanfront ${PROPERTY_TYPE_LABEL[propertyType]} For Sale in ${city.name}, FL`
                : `${PROPERTY_TYPE_LABEL[propertyType]} in ${city.name}, FL`)}
        </h1>
        {/* Intro copy — see CITY_PAGE_TYPE_NOUN/CITY_PAGE_SEARCH_NOUN's
            comment above for the original city-page request, and
            introTypeNoun/introSearchNoun's comment above for the 2026-09-16
            follow-up extending this to the 5-city Oceanfront pages too (per
            Ryan: "Can you do these changes for all of the search oceanfront
            pages also.") — now renders unconditionally across all 3 page
            shapes this route handles (plain city Homes/Condos/Land,
            Oceanfront Homes/Condos, and the combined Oceanfront "Listings"
            view), with introTypeNoun/introSearchNoun already carrying the
            right "oceanfront "-prefixed or "properties"/"property" wording
            for each. "Contact Us Today" bold + underlined + a live link via
            ContactUsTrigger.js (the same "Contact Us" popup Nav.js opens),
            per Ryan: "is a live link & underlined like you did in the
            neighborhood pages" — identical <strong><ContactUsTrigger>
            pattern already used on the Adelaide/Aripeka/Harbor Island Beach
            Club/Tortoise Island/Lansing Island/Summer Lakes/Aquarina/
            Suntree neighborhood-page blocks and the plain city pages. Same
            18px/muted-dark 2-paragraph styling throughout, for visual
            consistency across every listing page on the site. */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
            Discover {introTypeNoun} for sale in {city.name}, Florida, and let us make your {introSearchNoun} search
            easier. We&rsquo;ll help you compare properties, arrange private showings, negotiate with sellers, and
            guide you through every step from your initial search to closing.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
            Start your {city.name} {introSearchNoun} search today.{' '}
            <strong>
              <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
            </strong>{' '}
            to get started.
          </p>
        </div>
        {/* Condo-community cross-links (per Ryan, 2026-09-19 — see
            isMelbourneBeachCondos's comment above). Started with just Beach
            Woods (the new /neighborhoods/beach-woods page), then extended
            same day to also link Harbor Island Beach Club's and Aquarina's
            own Condo-filtered views (?propertyType=Condo, per Ryan's exact
            URLs) from this same page. Aquarina is a real Melbourne Beach
            neighborhood, so that one's a natural fit; Harbor Island Beach
            Club is actually seeded under Indian Harbour Beach (see
            NEIGHBORHOODS in the backend's seed.js) — linked here anyway
            since Ryan asked for it by name/URL specifically, not because it
            shares Melbourne Beach as its city.
            One combined sentence with all 3 links, not three separate
            paragraphs or the bold grid style used for the Viera Builders
            sibling links — this is a short "see also" list pointing off
            this page to related communities, not a cluster of sibling pages
            linking to each other, so the lighter treatment (matching the
            Adelaide/Aripeka/etc. "Contact Us Today" paragraph styling
            already on this same page) fits better than a big call-to-action
            block would. Order is Harbor Island Beach Club, then Aquarina,
            then Beach Woods last, per Ryan's explicit reorder request
            (2026-09-19, same day) — originally Beach Woods was listed
            first. */}
        {isMelbourneBeachCondos && (
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
            Looking for a specific community? See{' '}
            <Link
              href="/neighborhoods/harbor-island-beach-club?propertyType=Condo"
              style={{ color: '#000', textDecoration: 'underline' }}
            >
              Harbor Island Beach Club Condos For Sale
            </Link>
            ,{' '}
            <Link href="/neighborhoods/aquarina?propertyType=Condo" style={{ color: '#000', textDecoration: 'underline' }}>
              Aquarina Condos For Sale
            </Link>
            , or{' '}
            <Link href="/neighborhoods/beach-woods" style={{ color: '#000', textDecoration: 'underline' }}>
              Beach Woods Condos &amp; Townhomes For Sale
            </Link>
            .
          </p>
        )}
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12 }}>
          {total} result{total === 1 ? '' : 's'}
        </p>
      </div>

      <FilterBar
        waterfrontFlags={city.filters}
        showZoning={propertyType === 'Land'}
        excludeWaterfrontOptions={excludeWaterfrontOptions}
        // Oceanfront pages (per Ryan, 2026-08-22) lock the Waterfront
        // filter to Oceanfront server-side (see the getListings call
        // above) — showing a Waterfront dropdown that could uncheck the
        // very filter defining the page wouldn't make sense, so it's
        // hidden entirely rather than just pre-checked.
        hideWaterfront={isOceanfront || isOceanfrontCombined}
        // Property Type stays visible (so a visitor can still narrow to
        // just Homes or just Condos, or view both together) but Land is
        // excluded from its options — Ryan's request was specifically
        // "Oceanfront Condos & Homes," and Land isn't part of these pages.
        propertyTypeOptions={isOceanfront || isOceanfrontCombined ? ['Home', 'Condo'] : undefined}
        priceBands={propertyType === 'Condo' ? CONDO_PRICE_BANDS : undefined}
        show55Filter={show55Filter}
        // "Acreage" sort option (per Ryan, 2026-08-15) — kept only on this
        // city's own Land route; hidden on its Homes/Condos routes, where
        // every listing's acreage is null anyway. See FilterBar.js's
        // hideAcreageSort comment.
        hideAcreageSort={propertyType !== 'Land'}
        extraActions={
          showPropertyManagementCTA ? (
            <HarborIslandInquiryModals showForeclosures={false} areaLabel={city.name} />
          ) : showBuildingCTA ? (
            <BuildingInquiryModal />
          ) : undefined
        }
      />

      <div className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 64px' }}>
        <ListingResultsLayout
          mapCenter={mapCenter}
          results={results}
          resultsLabel={total === 0 ? '0 results' : `${rangeStart}-${rangeEnd} of ${total} ${typeLabel}`}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
