// Constants and formatters the browser needs (2026-10-08, per Ryan's mobile
// PageSpeed report). Split out of lib/constants.js so client components
// (Nav, Footer, SearchBar, FilterBar, ListingCard, ...) import only these
// instead of pulling lib/constants.js's ~60 KB of neighborhood page text
// into every page's JavaScript. lib/constants.js re-exports everything
// here, so server code can keep importing from there; client components
// ('use client') should import from this file.

// Mirrors backend/src/config/site.config.js's pageTypeSlugs — keep these two
// files in sync. This is what maps the backend's `propertyType` values to
// the URL segments used in this app's routes.
export const PROPERTY_TYPE_TO_SLUG = {
  Home: 'homes-for-sale',
  Condo: 'condos-for-sale',
  Land: 'land-for-sale',
};

// Oceanfront landing pages (2026-08-22, per Ryan: "showing Oceanfront
// Condos & Homes in cities of Cocoa Beach, Melbourne Beach, Satellite
// Beach, Indialantic, & Indian Harbour Beach — a lot of users are
// looking for only oceanfront properties"). Dedicated
// /{citySlug}/oceanfront-{homes,condos}-for-sale pages for these 5
// barrier-island cities only (Land wasn't requested). Mirrors backend's
// site.config.js's oceanfrontCitySlugs/oceanfrontPageTypeSlugs — keep in
// sync, same convention as PROPERTY_TYPE_TO_SLUG above. Used by
// app/[citySlug]/[propertySlug]/page.js (to recognize these two extra
// propertySlug values and gate them to these 5 cities) and Nav.js (to
// build the new "Search Oceanfront" dropdown).
export const OCEANFRONT_CITY_SLUGS = [
  'cocoa-beach',
  'melbourne-beach',
  'satellite-beach',
  'indialantic',
  'indian-harbour-beach',
];

export const OCEANFRONT_PROPERTY_TYPE_TO_SLUG = {
  Home: 'oceanfront-homes-for-sale',
  Condo: 'oceanfront-condos-for-sale',
};

// Combined "Listings" view for the Search Oceanfront dropdown's "<City>
// Listings" header link (2026-09-01, per Ryan: "make the Neighborhood, City
// Listings, & Search Oceanfront live links ... show all the listings").
// Oceanfront only ever has Home/Condo pages (no Land — see
// OCEANFRONT_PROPERTY_TYPE_TO_SLUG above), so "all types" here means
// Oceanfront Homes + Oceanfront Condos combined for that city, still
// filtered to Oceanfront waterfront only. A dedicated propertySlug value
// (rather than reusing oceanfront-homes-for-sale with a ?propertyType=
// override) keeps this its own canonical URL instead of the same URL as
// the Homes-only page just showing different content depending on a query
// param. See app/[citySlug]/[propertySlug]/page.js's isOceanfrontCombined.
export const OCEANFRONT_LISTINGS_SLUG = 'oceanfront-listings';

// Riverfront landing pages (2026-09-29, per Ryan — asked for a "Search
// Riverfront" nav entry to sit alongside Search Oceanfront, for the 8
// cities with real river/Indian River/Intracoastal-front inventory:
// Melbourne Beach, Melbourne, Indialantic, Cocoa Beach, Merritt Island,
// Indian Harbour Beach, Satellite Beach, and Rockledge — Melbourne and
// Rockledge in particular are mainland cities with NO oceanfront pages at
// all (see CITIES_EXCLUDING_OCEANFRONT in
// app/[citySlug]/[propertySlug]/page.js) but do front the Indian River, so
// this is their only waterfront-specific landing page. Unlike Oceanfront,
// Ryan explicitly asked for ONE combined link per city (Home + Condo + Land
// together) rather than a type-by-type split — a smaller pool of inventory
// than Oceanfront, so splitting it further risked some city/type
// combinations landing on a page with very few or zero results. That's why
// there's no RIVERFRONT_PROPERTY_TYPE_TO_SLUG/RIVERFRONT_SLUG_TO_PROPERTY_TYPE
// pair mirroring the Oceanfront ones above — Riverfront only ever has this
// one combined slug, reusing the same isOceanfrontCombined-style pattern
// (see app/[citySlug]/[propertySlug]/page.js's isRiverfrontCombined) but as
// the ONLY Riverfront page shape rather than a combined view sitting
// alongside separate per-type ones.
export const RIVERFRONT_CITY_SLUGS = [
  'melbourne-beach',
  'melbourne',
  'indialantic',
  'cocoa-beach',
  'merritt-island',
  'indian-harbour-beach',
  'satellite-beach',
  'rockledge',
];

export const RIVERFRONT_LISTINGS_SLUG = 'riverfront-listings';

// "Newest to Oldest"/"Oldest to Newest" (2026-08-15, per Ryan) — relabeled
// from the original plain "Newest" (Ryan's own wording when asking to "Add
// in Oldest to Newest under Newest to Oldest on the dropdowns") and given a
// new sibling option right below it. Both sort by the listing's real MLS
// on-market date now, not just "Newest" — see listings.controller.js's
// SORT_OPTIONS comment for why (matches this array's `value`s, which are
// just the query-param key — the backend owns the actual ORDER BY SQL).
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest to Oldest' },
  { value: 'oldest', label: 'Oldest to Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'beds_desc', label: 'Beds: Most to Fewest' },
  { value: 'sqft_desc', label: 'Sqft: Largest to Smallest' },
  { value: 'acreage_desc', label: 'Acreage: Largest to Smallest' },
];

export const PRICE_BANDS = [
  { label: 'Up to $300,000', priceMax: 300000 },
  { label: '$300,000 - $600,000', priceMin: 300000, priceMax: 600000 },
  { label: '$600,000 - $1,000,000', priceMin: 600000, priceMax: 1000000 },
  { label: '$1,000,000+', priceMin: 1000000 },
];

export const BED_OPTIONS = [1, 2, 3, 4, 5];

export const BATH_OPTIONS = [1, 2, 3, 4];

export const AGENT_INFO = {
  name: process.env.NEXT_PUBLIC_AGENT_NAME || 'Ryan',
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Brevard Coastal Homes',
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '',
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || '',
  licenseNumber: '3612865',
};

// Brokerage disclosure (2026-09-25, per Ryan, SEO audit finding: nothing on
// the site named the brokerage or a license number — Florida generally
// requires the brokerage name on real estate ads, and search engines/AI
// tools use this kind of detail as a trust signal). Kept separate from
// AGENT_INFO above rather than added to it: AGENT_INFO's businessName is
// the site's own brand ("Brevard Coastal Homes"), a different thing from
// the brokerage Ryan is actually licensed under.
//
// CORRECTION (2026-09-26, per Ryan): "3612865" was originally placed here
// as licenseNumber and displayed everywhere as though it belonged to the
// brokerage. Ryan confirmed it's actually HIS OWN individual license
// number, not the brokerage's — Florida issues separate license numbers
// to a brokerage entity (typically prefixed "CQ") and to an individual
// sales associate/broker (typically prefixed "SL"/"BK"), and this site was
// misattributing one for the other. Moved to AGENT_INFO.licenseNumber
// above; every place that used to render "{BROKERAGE_INFO.name} / FL
// License #{BROKERAGE_INFO.licenseNumber}" (Footer.js, app/contact/
// page.js, app/about/page.js) was updated to instead pair AGENT_INFO's
// license number with Ryan's own name.
//
// Ryan separately supplied the brokerage's corporate license ("Tropical
// Realty & Investments Inc. holds Florida real estate corporate license
// number CQ236513", 2026-09-26), which also surfaced a pre-existing
// inconsistency: the site had THREE different spellings of the brokerage
// name across files (this constant's original 'Tropical Realty & Inv. of
// Brevard', the footer logo's alt text 'Tropical Realty & Investments of
// Brevard', and the About page meta description's own 'Tropical Realty &
// Inv. of Brevard'). Asked Ryan directly rather than guess which was
// correct; he first said to use "Tropical Realty & Investments Inc."
// everywhere, then sent an official Space Coast MLS office record
// screenshot as "the correct info" showing the name as "Tropical Realty &
// Inv. of Brev[ard]" (matching this constant's ORIGINAL value) and a
// License # of 1001937 — different from the CQ236513 he'd stated earlier.
// Confirmed to use the MLS name (so the name ends up unchanged from
// before this whole correction chain started — what changed is it's now
// confirmed correct rather than merely inherited), and then separately
// confirmed "License # of 1001937 post this one" — i.e. use the MLS
// record's number, not CQ236513, and go ahead and publish it. CQ236513 is
// NOT used anywhere on the site.
export const BROKERAGE_INFO = {
  name: 'Tropical Realty & Inv. of Brevard',
  licenseNumber: '1001937',
};

export function formatPrice(price) {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

// List Price/SqFt sanity check (2026-09-20, per Ryan, found live on the
// Harbor Island Beach Club Condos page: 225 Strand Drive 408, MLS
// #1073180, synced from the MLS with sqft = 4 instead of its real square
// footage, producing a $299,750/SqFt figure next to its price). The
// backend computes listPricePerSqft server-side as a plain price/sqft
// division (see app/listings/[id]/page.js's 2026-09-14 comment) with no
// sanity check of its own, so a bad sqft sync (whether from the MLS feed
// itself or a mapping issue) turns straight into a nonsense number on the
// site. Rather than trust it blindly, both the listing cards
// (components/ListingCard.js) and the Property Detail page
// (app/listings/[id]/page.js) run every listing through this same check
// before showing List Price/SqFt — the listing itself, its price, and its
// own separately-displayed Sq.Ft. stat are never hidden, only this one
// derived figure, and only when it's implausible:
//  - MIN_SQFT_FOR_PRICE_PER_SQFT: nothing genuinely for sale in this
//    market is under this many square feet — a lower synced sqft is
//    almost always a bad value, not a real micro-unit.
//  - MAX_PLAUSIBLE_PRICE_PER_SQFT: a generous ceiling well above the
//    highest genuine figure seen in this feed so far (an oceanfront home
//    at ~$1,092/SqFt), so this also catches the same kind of blowup from
//    any other bad-sqft cause without needing to chase each one down by
//    hand as it turns up.
// Both components import and call this one function rather than each
// keeping their own copy of these bounds, so they can't drift apart.
export const MIN_SQFT_FOR_PRICE_PER_SQFT = 200;

export const MAX_PLAUSIBLE_PRICE_PER_SQFT = 3000;

export function isPricePerSqftPlausible(listing) {
  return (
    listing.listPricePerSqft != null &&
    listing.sqft != null &&
    listing.sqft >= MIN_SQFT_FOR_PRICE_PER_SQFT &&
    listing.listPricePerSqft <= MAX_PLAUSIBLE_PRICE_PER_SQFT
  );
}

// Sold price per sq ft (2026-10-04, per Ryan): on a Sold listing the
// $/SqFt figure should come from the close price, not the original list
// price. Returns null when it isn't a sold home with a close price, or the
// result fails the same plausibility bounds as isPricePerSqftPlausible().
export function soldPricePerSqft(listing) {
  if (listing.status !== 'Sold' || listing.closePrice == null) return null;
  if (listing.sqft == null || listing.sqft < MIN_SQFT_FOR_PRICE_PER_SQFT) return null;
  const value = Math.round(listing.closePrice / listing.sqft);
  return value <= MAX_PLAUSIBLE_PRICE_PER_SQFT ? value : null;
}

// Short suffix for a listing's HOA/condo association fee frequency, e.g.
// "$830" + "/mo" — added 2026-08-14 (per Ryan). Spark's
// AssociationFeeFrequency comes through as a full word ("Monthly",
// "Quarterly", "Annually", "Semi-Annually", "Weekly") — keyed here rather
// than just lowercasing it so the site can show the compact form real
// listing sites use. Falls back to the raw value (lowercased) for any
// frequency string not in this map, so an unrecognized value still shows
// something reasonable instead of disappearing.
const ASSOC_FEE_FREQUENCY_SUFFIX = {
  Monthly: '/mo',
  Quarterly: '/qtr',
  Annually: '/yr',
  Yearly: '/yr',
  'Semi-Annually': '/6mo',
  Weekly: '/wk',
};

export function formatAssocFee(assocFee, assocFeeFrequency) {
  if (assocFee === null || assocFee === undefined) return '';
  const suffix = assocFeeFrequency
    ? ASSOC_FEE_FREQUENCY_SUFFIX[assocFeeFrequency] || `/${assocFeeFrequency.toLowerCase()}`
    : '';
  return `${formatPrice(assocFee)}${suffix}`;
}

// "9/27/2026" from an MLS CloseDate ("2026-09-27") for SOLD badges
// (2026-10-04). Parsed as a plain calendar date so it never shifts a day
// across time zones.
export function formatSoldDate(closeDate) {
  const m = typeof closeDate === 'string' && closeDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${Number(m[2])}/${Number(m[3])}/${m[1]}` : null;
}
