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
  OCEANFRONT_PROPERTY_TYPE_TO_SLUG,
  CITY_AREA_GUIDE_SLUGS,
  CITY_LISTINGS_FAQ,
  cityListingsQueryParams,
  buildItemListSchema,
} from '@/lib/constants';
import FilterBar from '@/components/FilterBar';
import ListingResultsLayout from '@/components/ListingResultsLayout';
import HarborIslandInquiryModals from '@/components/HarborIslandInquiryModals';
import BuildingInquiryModal from '@/components/BuildingInquiryModal';
import ContactUsTrigger from '@/components/ContactUsTrigger';
import Faq from '@/components/Faq';

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

// Live listing-count meta description prefix (2026-09-22, per Ryan — he
// asked "Is there a reason or a benefit" after seeing Zillow/Realtor.com/
// Compass/Redfin/Homes.com search snippets that all lead their description
// with a current listing count: "Zillow has 159 homes for sale in
// Melbourne Beach FL...", "Search 153 homes for sale in Melbourne Beach...
// ", "Search 162 Melbourne Beach homes on Compass...", etc. The answer —
// a concrete, current-looking number stands out against otherwise
// near-identical search snippets and tends to earn a higher click-through
// rate, which Google's ranking does take into account — is why this same
// treatment is added here, per Ryan's "yes" to implementing it. This is
// PREPENDED to whatever description text each generateMetadata branch
// below already builds (backend page_seo copy or the hand-written
// fallback text) — additive, not a rewrite of the existing copywriting.
// The count itself is a fresh, unfiltered `/api/listings` total for the
// page's own city+propertyType (mirroring the canonical URL's scope, not
// whatever price/beds/etc. filters a visitor's own querystring might add)
// — a separate request from the page component's own listings fetch
// below, since generateMetadata runs independently and pageSize:1 here
// keeps it cheap (only `total` is used, not the actual results).
// Noun mostly follows CITY_PAGE_TYPE_NOUN's Home/Condo wording, except
// Land uses "lots" for this specific count sentence — "125 land for sale"
// reads grammatically wrong since "land" doesn't pluralize with a count
// the way "lot" does, and real estate listings for raw land are commonly
// called "lots" anyway. Independent of LAND_AND_LOTS_CITY_SLUGS above
// (that constant only drives the on-page "land and lots" body copy for 3
// specific cities — this count noun is "lots" on every city's Land page).
// Singular/plural pairs (2026-09-24, SEO audit fix — see combineDescription's
// own comment below for the character-limit half of this fix): the count
// sentence previously always used the plural noun ("1 homes for sale in..."),
// grammatically wrong whenever a city/oceanfront/neighborhood combination's
// live total happens to be exactly 1 — caught live while fixing the length
// issue (Cocoa Beach's Oceanfront Homes page read "1 oceanfront homes for
// sale" at the time). pickNoun below picks the right form for the actual
// live count each time this runs.
const LISTING_COUNT_NOUN = {
  Home: { singular: 'home', plural: 'homes' },
  Condo: { singular: 'condo', plural: 'condos' },
  Land: { singular: 'lot', plural: 'lots' },
};
const DEFAULT_COUNT_NOUN = { singular: 'listing', plural: 'listings' };
function pickNoun(nounPair, total) {
  return total === 1 ? nounPair.singular : nounPair.plural;
}

// Google typically truncates a search result's description past roughly
// 155-160 characters, cutting off mid-word/mid-sentence rather than at a
// clean boundary. SEO audit finding (2026-09-24, per Ryan, pointing at the
// audit doc's "Trim meta descriptions running past ~160 characters" item):
// the count-prefix built above (added 2026-09-11 as a deliberate SEO
// enhancement — see buildListingCountPrefix's own comment) is *prepended*
// to each page's already-tuned base description without ever re-checking
// the combined length, so a live count with enough digits pushes several
// page types over the limit — confirmed live at 177 chars on Cocoa Beach's
// Homes page and 191 on its Oceanfront Homes page, both cut off mid-word in
// a real Google result per Ryan's own screenshot. Rather than shortening
// each hand-written/backend base description individually (which would
// still overflow again the moment a city's listing count grows another
// digit), this trims whichever of the two needs it at request time: the
// prefix (city name, live count) is always kept intact since it's the part
// carrying real-time information a static base description can't; the base
// description is truncated to whatever budget remains, cut at the last
// whole word rather than mid-word, and closed with a clean period.
const META_DESCRIPTION_MAX_LEN = 160;
function combineDescription(prefix, base, maxLen = META_DESCRIPTION_MAX_LEN) {
  if (!prefix) return base;
  const budget = maxLen - prefix.length;
  // Budget this thin only happens with an implausibly long city name/count
  // — the prefix itself already carries the essential info, so fall back to
  // it alone rather than gluing on an unreadable one-word fragment.
  if (budget <= 20) return prefix.trim();
  if (base.length <= budget) return `${prefix}${base}`;
  let truncated = base.slice(0, budget);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 0) truncated = truncated.slice(0, lastSpace);
  truncated = truncated.replace(/[.,;:\s]+$/, '');
  return `${prefix}${truncated}.`;
}

async function buildListingCountPrefix({ citySlug, cityName, propertyType, oceanfront = false, noun }) {
  if (!cityName || !propertyType) return '';
  const types = Array.isArray(propertyType) ? propertyType : [propertyType];
  try {
    const data = await api.getListings({
      // See cityListingsQueryParams's comment (lib/constants.js).
      ...cityListingsQueryParams(citySlug),
      propertyType: types,
      waterfront: oceanfront ? 'Oceanfront' : undefined,
      pageSize: 1,
    });
    const total = typeof data.total === 'number' ? data.total : null;
    if (total == null) return '';
    const nounPair = noun || LISTING_COUNT_NOUN[types[0]] || DEFAULT_COUNT_NOUN;
    const resolvedNoun = pickNoun(nounPair, total);
    const fullNoun = oceanfront ? `oceanfront ${resolvedNoun}` : resolvedNoun;
    return `${total} ${fullNoun} for sale in ${cityName}, FL. `;
  } catch {
    // Count fetch failed — render the description without the prefix
    // rather than losing the page's metadata entirely over this.
    return '';
  }
}

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

  // Fetched once up front (2026-09-22, added alongside the listing-count
  // prefix above) — every branch below now wants the city's display name,
  // where before only the hand-written fallback branches fetched it. A
  // failure here still lets the main backend-SEO branch below render fine
  // (just without the new count prefix, since the backend's own
  // title/description already embed the city name) — only the
  // isOceanfrontCombined and backend-SEO-failure branches actually require
  // it, same as before this change.
  let city = null;
  try {
    ({ city } = await api.getCity(citySlug));
  } catch {
    // Handled per-branch below.
  }

  // No backend SEO row exists for a combined-type view (page_seo is keyed
  // by a single propertyType, same limitation as app/[citySlug]/page.js's
  // own combined "Listings" page) — hand-write it from the city's own name
  // instead of calling api.getOceanfrontSeo.
  if (isOceanfrontCombined) {
    if (!city) return {};
    const countPrefix = await buildListingCountPrefix({
      citySlug,
      cityName: city.name,
      propertyType: ['Home', 'Condo'],
      oceanfront: true,
      noun: { singular: 'property', plural: 'properties' },
    });
    return {
      title: `Oceanfront Homes & Condos For Sale in ${city.name}, FL | Brevard Coastal Homes`,
      description: combineDescription(
        countPrefix,
        `Browse every oceanfront home and condo listing in ${city.name}, FL in one place — updated from the MLS.`
      ),
      // Canonical added 2026-09-25 (SEO audit finding: this hand-written
      // branch — the combined "Listings" view for each of the 5 oceanfront
      // cities — was the one generateMetadata branch in this file that
      // never set alternates.canonical at all, unlike the backend-SEO
      // branch and its own fallback branch just below, both of which do.
      // Bare city+slug path, matching how every other canonical in this
      // file points at the un-filtered URL regardless of query-string
      // state.
      alternates: { canonical: `/${citySlug}/${OCEANFRONT_LISTINGS_SLUG}` },
    };
  }

  try {
    let { seo } = isOceanfront
      ? await api.getOceanfrontSeo(citySlug, propertyType)
      : await api.getCitySeo(citySlug, propertyType);
    // "Viera East" -> "Viera" fix (2026-09-24, found during a full redo of
    // the SEO audit per Ryan: "can you redo the SEO & AI Visibility Audit
    // to make sure we have everything completed" — live check turned up
    // /viera/homes-for-sale|condos-for-sale|land-for-sale all still
    // reading "Viera East, FL Homes For Sale | Viera East Realtors" in
    // both title and H1, even though the city itself was renamed back to
    // "Viera" the same day (2026-09-24, per Ryan: "Lets do Viera then
    // instead of viera east" — see lib/constants.js's VIERA_LAT_MIN
    // comment). That rename fixed every neighborhood parented to this city
    // (Aripeka/Adelaide/Summer Lakes, via each one's own frontend-side
    // seo.h1.replace('Viera East', 'Viera') a few lines below in the
    // sibling app/neighborhoods/[slug]/page.js) and the hand-written
    // bare-city/Area Guide pages (app/[citySlug]/page.js,
    // app/[citySlug]/area-guide/page.js), but missed this city's own
    // property-type pages — their title/h1/description/keywords all come
    // straight from the backend's page_seo table via getCitySeo, which was
    // seeded before the rename and still literally stores "Viera East"
    // today. The original audit doc (written the same day) misdiagnosed
    // this as the known 1-hour SEO fetch cache still catching up — it
    // wasn't; the stale text is in the database row itself, so no amount
    // of waiting fixes it. Same frontend-side string-replace pattern as
    // the neighborhood pages here too, rather than a backend page_seo
    // reseed — this project's own incident history flags backend seed
    // changes as risky for the live DB (see CLAUDE.md's "Apply changes"
    // incident) — scoped to citySlug === 'viera' only so no other city's
    // (correctly-seeded) SEO text is touched. isOceanfront is never true
    // for Viera (it's not in OCEANFRONT_CITY_SLUGS — Viera has no
    // waterfront pages), so this only ever needs to cover the
    // getCitySeo branch in practice, but it's applied unconditionally
    // here for safety in case that ever changes.
    if (citySlug === 'viera') {
      seo = {
        ...seo,
        title: seo.title?.replace(/Viera East/g, 'Viera'),
        h1: seo.h1?.replace(/Viera East/g, 'Viera'),
        metaDescription: seo.metaDescription?.replace(/Viera East/g, 'Viera'),
        keywords: Array.isArray(seo.keywords) ? seo.keywords.map((k) => k.replace(/Viera East/g, 'Viera')) : seo.keywords,
      };
    }
    const countPrefix = city
      ? await buildListingCountPrefix({ citySlug, cityName: city.name, propertyType, oceanfront: isOceanfront })
      : '';
    return {
      title: seo.title,
      description: combineDescription(countPrefix, seo.metaDescription),
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
    if (!city) return {};
    try {
      const typeLabel = PROPERTY_TYPE_LABEL[propertyType] || propertyType;
      const oceanPrefix = isOceanfront ? 'Oceanfront ' : '';
      const countPrefix = await buildListingCountPrefix({ citySlug, cityName: city.name, propertyType, oceanfront: isOceanfront });
      return {
        title: `${oceanPrefix}${typeLabel} For Sale in ${city.name}, FL | Brevard Coastal Homes`,
        description: combineDescription(
          countPrefix,
          `Browse ${oceanPrefix.toLowerCase()}${typeLabel.toLowerCase()} for sale in ${city.name}, FL — updated from the MLS.`
        ),
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
  // Oceanfront cross-link (2026-09-26, per Ryan — he asked whether it'd be
  // worth adding oceanfront links across all 5 barrier-island city pages;
  // this is the "Looking for oceanfront homes/condos in {city}?" line he
  // asked for on the plain Homes/Condos pages themselves, in addition to
  // the Footer links added the same day). Only shown on the plain Home/
  // Condo pages (never Land, and never the oceanfront pages themselves —
  // no point telling someone already looking at oceanfront listings to go
  // look at oceanfront listings) for the 5 OCEANFRONT_CITY_SLUGS cities,
  // where OCEANFRONT_PROPERTY_TYPE_TO_SLUG actually has a matching page to
  // send them to.
  const showOceanfrontCrossLink =
    OCEANFRONT_CITY_SLUGS.includes(citySlug) &&
    !isOceanfront &&
    !isOceanfrontCombined &&
    Boolean(OCEANFRONT_PROPERTY_TYPE_TO_SLUG[propertyType]);
  // Area Guide link + collapsed FAQ (2026-09-24, per Ryan — see
  // CITY_AREA_GUIDE_SLUGS/CITY_LISTINGS_FAQ in lib/constants.js for the
  // full story and rollout plan). Gated on citySlug alone, not
  // propertyType — the guide covers the whole city, so it's relevant from
  // the Homes, Condos, Land, and Oceanfront pages alike, same as this
  // page's own city-level intro copy above.
  const showAreaGuideLink = CITY_AREA_GUIDE_SLUGS.includes(citySlug);
  const listingsFaqItems = CITY_LISTINGS_FAQ[citySlug];
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
      // "Viera East" -> "Viera" fix — same normalization as generateMetadata
      // above (see the long comment there for the full history). Needed here
      // too since this seo object independently feeds pageTitle (used for
      // buildItemListSchema below) and the actual <h1> JSX render further
      // down this component.
      if (citySlug === 'viera' && seo) {
        seo = {
          ...seo,
          title: seo.title?.replace(/Viera East/g, 'Viera'),
          h1: seo.h1?.replace(/Viera East/g, 'Viera'),
          metaDescription: seo.metaDescription?.replace(/Viera East/g, 'Viera'),
          keywords: Array.isArray(seo.keywords) ? seo.keywords.map((k) => k.replace(/Viera East/g, 'Viera')) : seo.keywords,
        };
      }
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
      // See cityListingsQueryParams's comment (lib/constants.js).
      ...cityListingsQueryParams(citySlug),
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

  // ItemList structured data (2026-09-24, per Ryan: "Lets do this next" —
  // see buildItemListSchema's own comment in lib/constants.js for the full
  // "why build this here instead of calling the backend's GET
  // /api/seo/listing-collection endpoint" reasoning). pageTitle duplicates
  // the <h1> ternary just below — kept in sync manually, same "two
  // separate functions, no shared state" convention already used between
  // this file's generateMetadata and page component.
  const pageTitle = isOceanfrontCombined
    ? `Oceanfront Homes & Condos For Sale in ${city.name}, FL`
    : seo?.h1 ||
      (isOceanfront
        ? `Oceanfront ${PROPERTY_TYPE_LABEL[propertyType]} For Sale in ${city.name}, FL`
        : `${PROPERTY_TYPE_LABEL[propertyType]} in ${city.name}, FL`);
  const itemListSchema = buildItemListSchema({
    pageTitle,
    path: `/${citySlug}/${propertySlug}`,
    listings: results,
    total,
    pageStart: rangeStart,
  });
  const combinedJsonLd = [...(jsonLd || []), ...(itemListSchema ? [itemListSchema] : [])];

  // Real per-listing coordinates come from the Spark MLS sync (null until
  // then); the map center falls back to the city's own coordinate so it's
  // always centered on the right place even with zero pins to show yet.
  const mapCenter = city.latitude != null && city.longitude != null ? { lat: city.latitude, lng: city.longitude } : null;

  return (
    <div>
      {combinedJsonLd.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }} />
      )}

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
        {/* Area Guide link (2026-09-24, per Ryan: "Add a link to the top of
            the page... right under the intro text" — a single small text
            link, not a third button, per his "very easy to navigate
            without a lot of text" instruction, so it adds no visual weight
            to the listings page itself. */}
        {showAreaGuideLink && (
          <p style={{ fontSize: 15, marginBottom: 12 }}>
            <Link href={`/${citySlug}/area-guide`} style={{ color: '#000', textDecoration: 'underline' }}>
              {city.name} Area Guide →
            </Link>
          </p>
        )}
        {/* Oceanfront cross-link (2026-09-26, per Ryan) — see
            showOceanfrontCrossLink's own comment above. Descriptive link
            text ("See Oceanfront Condos For Sale") rather than the "Click
            Here" Ryan first suggested, matching every other link's style on
            this page/site (better for SEO and for anyone using a screen
            reader, where link text needs to make sense out of context) —
            Ryan said to use whatever wording works best. */}
        {showOceanfrontCrossLink && (
          <p style={{ fontSize: 15, marginBottom: 12 }}>
            Looking for oceanfront {propertyType === 'Condo' ? 'condos' : 'homes'} in {city.name}?{' '}
            <Link
              href={`/${citySlug}/${OCEANFRONT_PROPERTY_TYPE_TO_SLUG[propertyType]}`}
              style={{ color: '#000', textDecoration: 'underline' }}
            >
              See Oceanfront {propertyType === 'Condo' ? 'Condos' : 'Homes'} For Sale →
            </Link>
          </p>
        )}
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

      {/* Collapsed FAQ (2026-09-24, per Ryan — see listingsFaqItems above).
          Placed after the listing grid/pagination, same "below the
          listings" spot Ryan asked for, so it never pushes the listings
          themselves down the page. */}
      {listingsFaqItems && (
        <div className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
          <Faq items={listingsFaqItems} />
        </div>
      )}
    </div>
  );
}
