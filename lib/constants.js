// Mirrors backend/src/config/site.config.js's pageTypeSlugs — keep these two
// files in sync. This is what maps the backend's `propertyType` values to
// the URL segments used in this app's routes.
export const PROPERTY_TYPE_TO_SLUG = {
  Home: 'homes-for-sale',
  Condo: 'condos-for-sale',
  Land: 'land-for-sale',
};

export const SLUG_TO_PROPERTY_TYPE = Object.fromEntries(
  Object.entries(PROPERTY_TYPE_TO_SLUG).map(([type, slug]) => [slug, type])
);

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

export const OCEANFRONT_SLUG_TO_PROPERTY_TYPE = Object.fromEntries(
  Object.entries(OCEANFRONT_PROPERTY_TYPE_TO_SLUG).map(([type, slug]) => [slug, type])
);

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

export const PROPERTY_TYPE_LABEL = {
  Home: 'Single-Family Homes',
  Condo: 'Condos/Townhomes',
  Land: 'Land',
};

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

// City Condos/Townhomes pages ONLY (per Ryan, 2026-08-06) — every city's
// /condos-for-sale route (app/[citySlug]/[propertySlug]/page.js, only when
// propertyType === 'Condo'), replacing the site-wide PRICE_BANDS default.
// Explicitly NOT applied to Homes or Land city pages, and NOT applied to
// any neighborhood page (app/neighborhoods/[slug]/page.js keeps its own
// existing price-band logic untouched).
export const CONDO_PRICE_BANDS = [
  { label: 'Below $400,000', priceMax: 400000 },
  { label: '$400,000 to $599,999', priceMin: 400000, priceMax: 599999 },
  { label: '$600,000 to $799,999', priceMin: 600000, priceMax: 799999 },
  { label: '$800,000 to $1 Million', priceMin: 800000, priceMax: 1000000 },
  { label: 'Above $1 Million', priceMin: 1000000 },
];

// Adelaide (neighborhood page, /neighborhoods/adelaide) is a much
// higher-end community than the site-wide default price bands above fit —
// per Ryan (2026-08-05), swap in these four bands and hide the Property
// Type dropdown entirely for that one page. See
// app/neighborhoods/[slug]/page.js, which passes these to FilterBar only
// when slug === 'adelaide'.
export const ADELAIDE_PRICE_BANDS = [
  { label: 'Up to $2 Million', priceMax: 2000000 },
  { label: '$2 Million to $3 Million', priceMin: 2000000, priceMax: 3000000 },
  { label: '$3 Million to $4 Million', priceMin: 3000000, priceMax: 4000000 },
  { label: 'Above $4 Million', priceMin: 4000000 },
];

// Aripeka (neighborhood page, /neighborhoods/aripeka) — per Ryan
// (2026-08-05): drop Condos/Townhomes from the Property Type dropdown (it's
// a single-family/land community) and use these three price bands instead
// of the site-wide default. See app/neighborhoods/[slug]/page.js, which
// passes these to FilterBar only when slug === 'aripeka'.
export const ARIPEKA_PROPERTY_TYPE_OPTIONS = ['Home', 'Land'];
export const ARIPEKA_PRICE_BANDS = [
  { label: 'Under $1 Million', priceMax: 1000000 },
  { label: '$1 Million to $1.5 Million', priceMin: 1000000, priceMax: 1500000 },
  { label: 'Above $1.5 Million', priceMin: 1500000 },
];

// Harbor Island Beach Club (neighborhood page,
// /neighborhoods/harbor-island-beach-club) — per Ryan (2026-08-05): drop
// Land from the Property Type dropdown (keeps Home/Condo), use these three
// price bands, and hides the Waterfront dropdown entirely (unlike Lansing
// Island/Tortoise Island, which just exclude Oceanfront — this page drops
// Waterfront altogether). See app/neighborhoods/[slug]/page.js, which
// passes these to FilterBar only when slug === 'harbor-island-beach-club'.
export const HARBOR_ISLAND_BEACH_CLUB_PROPERTY_TYPE_OPTIONS = ['Home', 'Condo'];
export const HARBOR_ISLAND_BEACH_CLUB_PRICE_BANDS = [
  { label: 'Under $800,000', priceMax: 800000 },
  { label: '$800,000 to $1 Million', priceMin: 800000, priceMax: 1000000 },
  { label: 'Above $1 Million', priceMin: 1000000 },
];

// Viera Builders Communities Viera West (neighborhood page,
// /neighborhoods/viera-builders-communities-viera-west) — per Ryan
// (2026-08-05): a new "Neighborhood" dropdown listing this community's 6
// sub-communities, shown alphabetically, placed before the Property Type
// dropdown. Filters via a `subdivision` URL param, matched server-side
// against the backend's listings.subdivision column (added 2026-08-05 —
// see backend/src/db/schema.sql) — real once the Spark MLS feed is
// connected and listings carry a SubdivisionName. See
// app/neighborhoods/[slug]/page.js, passed to FilterBar only when
// slug === 'viera-builders-communities-viera-west'.
export const VIERA_BUILDERS_COMMUNITIES_VIERA_WEST_NEIGHBORHOOD_OPTIONS = [
  'Atlin Cove',
  'Crossmolina',
  'Farallon Fields',
  'Laurasia',
  'Pangea Park',
  'Reeling Park',
];

// The same 6 Viera Builders Communities Viera West sub-communities above,
// but as their own richer records (slug + name + comingSoon flag) — per
// Ryan (2026-08-05): each gets its own full listing page at
// /neighborhoods/<slug>, built exactly like every other neighborhood page
// (same template, FilterBar, map, listings grid — see
// app/neighborhoods/[slug]/page.js), plus a new "Communities" dropdown in
// the top nav (components/Nav.js) linking to all 6, alphabetically, with
// Atlin Cove marked "(Coming Soon)" since it has no data yet. These aren't
// real rows in the backend's `neighborhoods` table (no MLS/community data
// exists for them), so page.js special-cases these slugs to build a
// stand-in neighborhood object client-side instead of fetching one — see
// the VIERA_BUILDERS_SUB_COMMUNITIES lookup there.
// Order is by listing availability, not alphabetical (2026-09-15, per Ryan,
// in two steps): first Atlin Cove moved from its original alphabetical spot
// (1st) to last ("Can you put the Atlin Cove link last on the pages since
// it doesn't have any listings yet" — it's the one comingSoon:true entry
// with no active inventory). Then Crossmolina and Farallon Fields moved
// down too ("move Crossmolina, Farallon Fields to the end too because they
// dont have any listings") — confirmed live at the time (0 results each),
// vs. Laurasia (4), Pangea Park (15), and Reeling Park (17), which do have
// active listings and so stay up front. Atlin Cove is kept last of the
// three zero-listing entries since it's the most permanently empty one
// (marked comingSoon, no MLS data will ever populate under this slug until
// Ryan says otherwise) vs. Crossmolina/Farallon Fields, which are real
// subdivisions that are simply between listings right now and could show
// results again at any time. If Crossmolina, Farallon Fields, or any other
// entry here starts showing listings again, move it back up out of the
// no-listings group — this order isn't alphabetical anymore, so it needs a
// person (or a future Claude) to actively revisit it rather than assuming
// it'll self-correct.
// This single array is the one source of truth both link lists render from
// in-order (no separate sorting logic in page.js): the hub page's
// 2-column/3-row grid (app/neighborhoods/[slug]/page.js's
// isVieraBuildersCommunitiesVieraWest block, which just .map()s this
// array) and each individual sub-community page's "See also" sibling-links
// line (same file's subCommunity block, which .filter()s this array but
// keeps its order) — so reordering it here alone reorders both places,
// everywhere this array is read.
export const VIERA_BUILDERS_SUB_COMMUNITIES = [
  { slug: 'laurasia', name: 'Laurasia' },
  { slug: 'pangea-park', name: 'Pangea Park' },
  { slug: 'reeling-park', name: 'Reeling Park' },
  { slug: 'crossmolina', name: 'Crossmolina' },
  { slug: 'farallon-fields', name: 'Farallon Fields' },
  { slug: 'atlin-cove', name: 'Atlin Cove', comingSoon: true },
];

// Viera Builders Communities Viera West (per Ryan, 2026-08-05) — used on
// BOTH the wrapper page (/neighborhoods/viera-builders-communities-viera-west)
// AND all 6 individual sub-community pages above: custom price bands
// (replacing the site-wide PRICE_BANDS default) and a Property Type list
// that drops Land (keeps Home/Condo only, same treatment as Harbor Island
// Beach Club — see HARBOR_ISLAND_BEACH_CLUB_PROPERTY_TYPE_OPTIONS above —
// since these are builder home/condo communities, not land parcels). See
// app/neighborhoods/[slug]/page.js, applied via
// isVieraBuildersCommunitiesVieraWest || subCommunity.
export const VIERA_BUILDERS_PRICE_BANDS = [
  { label: 'Up to $600,000', priceMax: 600000 },
  { label: '$600,000 to $799,999', priceMin: 600000, priceMax: 799999 },
  { label: '$800,000 to $1 Million', priceMin: 800000, priceMax: 1000000 },
  { label: 'Above $1 Million', priceMin: 1000000 },
];
export const VIERA_BUILDERS_PROPERTY_TYPE_OPTIONS = ['Home', 'Condo'];

// Beach Woods (Melbourne Beach, FL — neighborhood page,
// /neighborhoods/beach-woods) — per Ryan (2026-09-19, pasting an aerial map
// of the community plus a link to https://www.beachwoodsmb.com/home/, the
// community's own Property Owners Association site): "create a new page
// for the Beach woods condos in Melbourne Beach Florida & then put a link
// for this page on the Melbourne Beach Condos page. Include all the condos
// & townhomes from all the phases & located in the subdivision." Like
// VIERA_BUILDERS_SUB_COMMUNITIES above, Beach Woods isn't a real
// `neighborhoods` table row, so it's built as a stand-in neighborhood
// client-side instead (see app/neighborhoods/[slug]/page.js's
// isBeachWoods) and filtered by `subdivision` rather than a real
// neighborhood_id.
// This list is every MLS SubdivisionName variant actually seen for this
// community, confirmed live 2026-09-19 by pulling every current Melbourne
// Beach listing straight from the backend API and matching subdivision
// names containing "Beach Wood". The POA's own site describes one
// community — spanning "town homes, villas, quads, single family
// residences, beachfront units and a six-story riverside condominium" —
// built out in numbered phases ("Stage 1" through at least "Stage 8"),
// which is why the MLS carries it as 8 differently-named subdivisions
// rather than one. All 8 are typed "Condo" in the MLS feed (no separate
// Townhome property_type exists in this feed — Beach Woods' townhome-style
// buildings are still tagged Condo, same as e.g. "Windjammer Townhouses
// Condo" elsewhere in Melbourne Beach), so the page just hides the
// Property Type dropdown entirely (see hidePropertyType in page.js) rather
// than needing its own Property Type options constant.
// This is an exact-match list against listings.subdivision (see
// listings.controller.js's `l.subdivision IN (...)`), not a prefix/
// substring match — if a listing ever appears under a Stage number not
// listed here (e.g. a Stage 3 or Stage 9 the current inventory happens not
// to include), confirm its exact MLS SubdivisionName spelling before
// adding it, rather than guessing.
export const BEACH_WOODS_SUBDIVISION_NAMES = [
  'Beach Woods Stage 1 Phase 1',
  'Beach Woods Stage 2 Phase 1',
  'Beach Woods Stage 4',
  'Beach Woods Stage 5 Phase 1',
  'Beach Woods Stage 6',
  'Beach Woods Stage 7 Phase 2',
  'Beach Woods Stage 8',
  'Riverside Condos at Beach Woods Ph I',
];

// Aquarina (neighborhood page, /neighborhoods/aquarina) — per Ryan
// (2026-09-20): unlike Beach Woods above, Aquarina IS a real
// `neighborhoods` table row (id 4), and most of its listings do get
// correctly tied to it during sync — but a number of its sub-associations'
// MLS SubdivisionName values don't get linked, for reasons that aren't
// fully clear (it's NOT simply "doesn't contain the word Aquarina" — e.g.
// "Aquarina PUD Stage 2" contains it and still wasn't tied — so don't
// assume a rule here without checking live). Aquarina Beach & CC is a
// large master-planned community made up of many separately-named
// sub-associations. Rather than trust whatever matching the sync job does
// (or chase it down further), this page's listings query
// (app/neighborhoods/[slug]/page.js's isAquarina) filters directly by this
// explicit subdivision list instead of the real neighborhood_id — same
// stand-in-style `subdivision` filtering as Beach Woods/Viera Builders,
// just layered on top of a real neighborhood row rather than replacing it
// entirely (the neighborhood object/SEO content still comes from the
// backend as normal; only the listings query is overridden).
// Built in two passes, both confirmed live by pulling every current
// Melbourne Beach listing from the backend API and checking each
// unlinked one's subdivision name and description for genuine Aquarina
// membership (a "near Aquarina Golf & Country Club" or "right next to
// Aquarina Country Club" mention in the description means a NEARBY,
// separate community — e.g. Sunnyland Beach, St Andrews Village — and
// was deliberately left off this list, not missed):
//  - 2026-09-20 (first pass): the 9 names already tied to Aquarina's
//    neighborhood_id, plus Egret Trace Condo and Tidewater Condo No 1
//    (found when a listing at 264 Aquarina Boulevard showed up on the
//    Melbourne Beach Condos page but not here).
//  - 2026-09-20 (second pass, per Ryan flagging a Space Coast MLS
//    screenshot for 7607 Kiawah Way / MLS #1065538, subdivision "Maritime
//    Hammock" — its own public remarks read "Maritime Hammock at
//    Aquarina..."): added Maritime Hammock, plus two more found by the
//    same description-based sweep — The Hammock Condo I ("IN THE
//    SOUGHT-AFTER AQUARINA BEACH & COUNTRY CLUB...") and Aquarina PUD
//    Stage 2 (an oceanfront vacant lot).
// Exact-match against listings.subdivision, same caveat as
// BEACH_WOODS_SUBDIVISION_NAMES above — if a new Aquarina sub-association's
// listing doesn't show up here later, confirm its exact MLS SubdivisionName
// spelling AND genuine membership (vs. a merely-nearby community) before
// adding it, rather than guessing.
export const AQUARINA_SUBDIVISION_NAMES = [
  'Ocean Dunes Condominium at Aquarina Beach Ph I',
  'Ocean Dunes Condominium at Aquarina Beach Ph II',
  'Ocean Dunes Condominium at Aquarina Beach Ph III',
  'Spoonbill Villas at Aquarina Stage 3 Tract III',
  'Aquarina PUD Stage 1',
  'Aquarina PUD Stage 2',
  'Cranes Point at Aquarina',
  'The Marlin at Aquarina Condo Ph I',
  'Ocean Breeze at Aquarina',
  'Sea Hawk Place at Aquarina Phase 2',
  'Egret Trace Condo',
  'Tidewater Condo No 1',
  'Maritime Hammock',
  'The Hammock Condo I',
];

// South Merritt Island (neighborhood page,
// /neighborhoods/south-merritt-island) — per Ryan (2026-08-05): its own
// Price dropdown bands, replacing the site-wide PRICE_BANDS default. See
// app/neighborhoods/[slug]/page.js, passed to FilterBar only when
// slug === 'south-merritt-island'.
export const SOUTH_MERRITT_ISLAND_PRICE_BANDS = [
  { label: 'Up to $800,000', priceMax: 800000 },
  { label: '$800,000 to $1.5 Million', priceMin: 800000, priceMax: 1500000 },
  { label: 'Above $1.5 Million', priceMin: 1500000 },
];

export const BED_OPTIONS = [1, 2, 3, 4, 5];
export const BATH_OPTIONS = [1, 2, 3, 4];

// Adelaide's Beds/Baths dropdowns start higher than the site-wide default
// (per Ryan, 2026-08-05) to match the community's larger homes — Beds
// starts at 3+ (drops 1+/2+), Baths starts at 2+ (drops 1+). See
// app/neighborhoods/[slug]/page.js, passed to FilterBar only for Adelaide.
export const ADELAIDE_BED_OPTIONS = [3, 4, 5];
export const ADELAIDE_BATH_OPTIONS = [2, 3, 4];

// Aripeka's Beds/Baths dropdowns (per Ryan, 2026-08-05): Beds starts at 3+
// (drops 1+/2+, same range as Adelaide's), Baths drops only 1+ (starts at 2+).
export const ARIPEKA_BED_OPTIONS = [3, 4, 5];
export const ARIPEKA_BATH_OPTIONS = [2, 3, 4];

// Harbor Island Beach Club's Beds/Baths dropdowns (per Ryan, 2026-08-05):
// drop 1+ and 2+ from BOTH — Beds starts at 3+ (same as Aripeka/Adelaide),
// but Baths also starts at 3+ here (unlike Aripeka's 2+), since Ryan asked
// for 1+/2+ removed from Baths too, not just 1+. Beds also got a 6+ option
// added on top (per Ryan, 2026-08-05).
export const HARBOR_ISLAND_BEACH_CLUB_BED_OPTIONS = [3, 4, 5, 6];
export const HARBOR_ISLAND_BEACH_CLUB_BATH_OPTIONS = [3, 4];

/**
 * City/neighborhood `thumbnail` values from the backend are bare filenames
 * (e.g. "cocoa-beach-pier.jpg") referencing the design handoff's asset
 * images, copied into public/place-photos/ during the frontend build. This
 * builds the actual path Next's <Image> should use.
 */
export function placePhotoUrl(thumbnail) {
  return thumbnail ? `/place-photos/${thumbnail}` : null;
}

/**
 * Agent/business contact info shown on Property Detail, Contact Us, etc.
 * Mirrors backend/.env's BUSINESS_NAME/BUSINESS_PHONE/BUSINESS_EMAIL — set
 * the NEXT_PUBLIC_ equivalents in frontend/.env so they stay in sync.
 */
export const AGENT_INFO = {
  name: process.env.NEXT_PUBLIC_AGENT_NAME || 'Ryan',
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Brevard Coastal Homes',
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '',
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || '',
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
