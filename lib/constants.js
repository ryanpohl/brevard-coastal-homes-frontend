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

// Tortoise Island (Satellite Beach) — added 2026-09-23, per Ryan flagging
// that this neighborhood page (along with Summer Lakes, Lansing Island,
// and South Merritt Island) had gone empty. Confirmed live: every
// currently-active Tortoise Island listing's MLS SubdivisionName is
// phase/unit-suffixed ("Tortoise Island Ph 1 PUD", "Ph 4 PUD", "Ph 3 Unit
// 2 PUD", "Ph 2 Unit 2 PUD", "Ph 3 Unit 1 PUD Replat of Tr D") rather than
// the neighborhoods table's plain "Tortoise Island" name, so the sync
// job's exact-match neighborhood_id assignment
// (backend/src/services/listingMapper.service.js) never ties any of them
// to it — same root cause as AQUARINA_SUBDIVISION_NAMES above. This page's
// listings query (app/neighborhoods/[slug]/page.js) filters directly by
// this explicit list instead of neighborhood_id, same stand-in-style
// `subdivision` filtering layered on top of a real neighborhood row.
// Deliberately excludes "Tortoise View Villas" and "Tortoise View
// Estates" — confirmed via their own MLS descriptions ("Set within
// desirable Tortoise View Villas...", "...rarely available Tortoise View
// Estates") to be their own separately-named nearby communities, not
// Tortoise Island itself — same false-positive caution as Aquarina's list.
// If a new phase/unit shows up later and its listing doesn't appear here,
// confirm its exact MLS SubdivisionName spelling (and genuine membership)
// before adding it, rather than guessing.
// 'Tortoise Island Ph 2 Unit 1 PUD' added same day, found by cross-checking
// this list against a competitor site (denovorealty.com) that draws from
// the same Space Coast MLS board — its listing at 855 Hawksbill Island Dr
// (MLS #1065059) uses this exact subdivision text. That specific listing
// isn't in this site's own database yet (checked all statuses — genuinely
// absent, not just unlinked), a separate sync gap from the subdivision-name
// matching this list fixes; flagged to Ryan rather than silently ignored.
// The name is still added here so the match is ready the moment that
// listing (or another one in this sub-phase) does get synced.
export const TORTOISE_ISLAND_SUBDIVISION_NAMES = [
  'Tortoise Island Ph 1 PUD',
  'Tortoise Island Ph 2 Unit 1 PUD',
  'Tortoise Island Ph 2 Unit 2 PUD',
  'Tortoise Island Ph 3 Unit 1 PUD Replat of Tr D',
  'Tortoise Island Ph 3 Unit 2 PUD',
  'Tortoise Island Ph 4 PUD',
];

// Summer Lakes (Rockledge/Viera) — added 2026-09-23, same day and same
// root cause as TORTOISE_ISLAND_SUBDIVISION_NAMES above (per Ryan flagging
// the same empty-neighborhood-page issue for this community too).
// Confirmed live: every currently-active Summer Lakes listing's MLS
// SubdivisionName is phase-suffixed ("Summer Lakes Phase 1 Viera Central
// PUD-A Portion O", "Summer Lakes Phase 2 Viera Central PUD A Portio",
// "Summer Lakes Phase 3") rather than the neighborhoods table's plain
// "Summer Lakes" name. This page's listings query (app/neighborhoods/
// [slug]/page.js) filters directly by this list instead of neighborhood_id
// — see TORTOISE_ISLAND_SUBDIVISION_NAMES's comment above for the fuller
// explanation of why (same mechanism, same day).
export const SUMMER_LAKES_SUBDIVISION_NAMES = [
  'Summer Lakes Phase 1 Viera Central PUD-A Portion O',
  'Summer Lakes Phase 2 Viera Central PUD A Portio',
  'Summer Lakes Phase 3',
];

// Lansing Island (Satellite Beach) — added 2026-09-23, same day and same
// root cause as TORTOISE_ISLAND_SUBDIVISION_NAMES above. Unlike Tortoise
// Island/Summer Lakes, this page had ZERO listings anywhere in the backend
// (any status) matching "Lansing" by any keyword search, so the phase-
// suffix theory couldn't be confirmed from the live listings feed alone —
// Ryan pinpointed the community's boundary on a map (Island View Drive
// running through it) and then pulled the one home currently listed there
// directly from Space Coast MLS/FlexMLS: 281 Lansing Island Drive,
// Satellite Beach, MLS #1078258, Active Under Contract (so it won't appear
// on this page even now — this page only shows Active), Subdivision:
// "Lansing Island Phase 4", Public Remarks confirming "the prestigious
// gated community of Lansing Island." That single confirmed record is
// listed below. Only Phase 4 is confirmed — Ryan said no other homes are
// currently for sale in Lansing Island, so Phases 1-3's exact MLS
// SubdivisionName spelling is unverified; add them here (same "Lansing
// Island Phase N" pattern) only once an actual listing confirms the exact
// text, rather than guessing ahead of the data the way
// TORTOISE_ISLAND_SUBDIVISION_NAMES's other phases could be, since those
// were all visible live at the time.
export const LANSING_ISLAND_SUBDIVISION_NAMES = ['Lansing Island Phase 4'];

// Suntree (neighborhood page, /neighborhoods/suntree, parent city Melbourne)
// — per Ryan (2026-09-23), flagging "hardly any listings" show on the page
// vs. a competitor site (denovorealty.com/suntree/) showing far more. Same
// root cause as Tortoise Island/Summer Lakes above: only 8 of the 70 active
// Melbourne listings whose MLS SubdivisionName contains "Suntree" had ever
// gotten linked to this neighborhood's neighborhood_id (and only 4 of
// those 8 were even visible, the rest condo units getting filtered as data-
// quality artifacts elsewhere) — every "Stage"/"Tract"/"Phase"/"Unit"-
// suffixed variant (e.g. "Sawgrass at Suntree Phase 3", "Courtyards
// Suntree PUD Stage 5 Tr 62 Unit 3") was falling through the same exact-
// name match gap. Unlike Tortoise Island/Lansing Island, "Suntree" itself
// is a distinctive enough proper name that every SubdivisionName
// containing it (case-insensitive) was treated as a safe match without
// needing per-listing description checks — verified via a live data pull
// the same day (38 distinct spellings, all clearly Suntree PUD stages/
// sub-communities, no unrelated "Suntree"-named look-alikes found).
//
// Follow-up same day, per Ryan — the competitor's "Suntree" page casts a
// much wider net than the "Suntree"-named list above: paging through all
// 120 of its listings turned up ~48 more distinct SubdivisionName-less-
// related communities, which fall into 4 groups. Presented to Ryan (via
// AskUserQuestion) rather than guessed in wholesale, same as every other
// community-boundary call this session:
//   1. Baytree (golf community, immediately adjacent) — APPROVED, added below.
//   2. Indian River Colony Club (a separately-branded 55+ community for
//      military veterans) — NOT approved, left out.
//   3. Viera East sub-communities (Lakes at Viera E, Bayhill at Viera E,
//      Greens at Viera E, Three Fountains of Viera, Wingate Estates/Viera N
//      PUD, Viera Tracts BB and V) — NOT approved, left out; these are
//      literally "Viera," which this site already treats as its own city
//      (citySlug 'viera').
//   4. The remaining long tail of otherwise-unrelated community names (San
//      Marino Estates, Casabella, Capron Ridge, Six Mile Creek, etc.,
//      spilling into Rockledge for a few) — APPROVED, added below.
// One name from the competitor's own list was dropped regardless of the
// above: "Reeling Park" is already one of this site's own Viera Builders
// Communities Viera West sub-communities (see VIERA_BUILDERS_SUB_
// COMMUNITIES above) — folding it in here would show the same listings
// miscategorized under two different communities. Another, "Crane Creek
// Hgts Unrec Subd," was dropped as a false positive found during
// verification: its one live listing (2343 Grant Street) is zip 32901,
// downtown Melbourne near the actual Crane Creek — nowhere near Suntree's
// 32940 corridor — unlike "Crane Creek Unit 2 Phase 3/4" (kept below),
// which are both genuinely in 32940. Every other name below was verified
// against this site's own live data (not just copied from the competitor's
// display text — capitalization differs, e.g. "PUD" vs "Pud," and the
// backend's subdivision match is an exact string match) and its address's
// zip code checked against the 32940/Rockledge-32955 Suntree-area corridor.
export const SUNTREE_SUBDIVISION_NAMES = [
  'Briarwood at Suntree Suntree PUD Stage 5 Tract 44',
  'Country Walk at Suntree Stage 8 Tract 64 Pud',
  'Courtyards Replat Suntree PUD Stage 5 Tract 62',
  'Courtyards Suntree PUD Stage 5 Tr 62 Unit 3',
  'Courtyards Suntree PUD Stage 5 Tract 62 Unit 2',
  'Cypress Cove at Suntree A Condo',
  'Cypress Trace Suntree PUD Stage 4',
  'Eagles Landing at Suntree',
  'Fieldstone Suntree PUD St 4 Tr 41 Unit 1',
  'Gleneagles Townhomes Phase 1 Suntree PUD Stage 8 T',
  'Holiday Springs at Suntree',
  'Lake Pointe Suntree PUD Stage 10 Tr 6 Unit 3 and T',
  'Oak Park at Suntree PUD',
  'Oak Park at Suntree Replat 1',
  'Pineda Plaza at Suntree Commercial Condo Ph I',
  'Players Club at Suntree',
  'Quail Ridge at Suntree Suntree PUD Stage 5 Tract 4',
  'Sawgrass at Suntree Phase 1',
  'Sawgrass at Suntree Phase 2',
  'Sawgrass at Suntree Phase 3',
  'Sawgrass at Suntree Phase 4',
  'Sawgrass at Suntree Phase 5',
  'Spanish Cove Suntree PUD Stage 4 Tract 35 and A Po',
  'Suntree Center Suntree PUD Stage 3 Tracts 25A and',
  'Suntree Forest Homes Unit 2',
  'Suntree Lakes Ph I',
  'Suntree Lakes Ph II',
  'Suntree PUD Stage 1 Tr C Unit 2',
  'Suntree PUD Stage 14 Tract 10',
  'Suntree PUD Stage 4 Tract 29 29 Unit 2',
  'Suntree PUD Stage 4 Tract 31',
  'Suntree PUD Stage 5 Tract 55',
  'Suntree PUD Stage 5 Tract 59',
  'Suntree Woods',
  'Tanglewood at Suntree Cntry Club Condo Ph I',
  'Villas at Suntree Unit 1 Suntree PUD Stage 10 T',
  'Villas at Suntree Unit 3 A Re- Plat of A Pt of Pa',
  'Waterside at Suntree Ph I',
  // Baytree (approved 2026-09-23, per Ryan)
  'Arundel - Baytree PUD Phase 2 Stage 2',
  'Plat of Baytree PUD Phase 2 Stage 1',
  'Isles of Baytree Phase 2 A Replat of Tract L Isl',
  'Baytree PUD Phase 1 Stage 1-5',
  'Baytree PUD Phase 2 Stage 1A The Hamlet',
  'Isles of Baytree Phase 1',
  'St Andrews Manor',
  'St Andrews Townhomes Phase 1',
  // Long tail of otherwise-unrelated community names (approved 2026-09-23,
  // per Ryan) — see the comment above for what was excluded and why.
  'Sabal Palm Estates Unit 2',
  'Magnolia Springs Phase 2',
  'Magnolia Springs Phase 1',
  'Mission Lake Villas Unit 2',
  'Hampton Park Phase 3',
  'Hampton Park Phase 1',
  'Hampton Park Phase 2',
  'San Marino Estates',
  'CASABELLA PHASE THREE',
  'Casabella Phase 1',
  'Coral Springs',
  'Vizcaya Estates',
  'Forest Lake Village Unit 2',
  'Summerwood',
  'Mandarin Lakes Unit 1',
  'Capron Ridge Phase 2',
  'Capron Ridge Phase 3',
  'Capron Ridge Phase 4',
  'Capron Ridge Phase 5',
  'Six Mile Creek Phase 1',
  'Six Mile Creek Phase II',
  'Misty Creek Unit 1',
  'Misty Creek Unit 2',
  'Foxhall',
  'Admiralty Lakes Lake Patio Homes 2nd Replat of Pha',
  'Admiralty Lakes Townhomes Phase 1',
  'Windsor Estates Phase 1',
  'Devons Glen Unit 2',
  'Crane Creek Unit 2 Phase 3',
  'Crane Creek Unit 2 Phase 4',
  'Carriage Park Condo Ph I',
  'Carriage Park Condo Ph III',
  'Tralee Bay Shores Phase 1',
  'Tralee Bay Shores Phase 3',
  'Deer Lakes Phase 1',
  'Deer Lakes Phase 2',
  'Ashwood Lakes Phase 4',
  'Ashwood Lakes Phase 5',
  'Ameri-Cana Resorts Co-Op',
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

// South Merritt Island's listings query (2026-09-23, per Ryan, after the
// neighborhood page showed 0 listings — same symptom as Tortoise Island/
// Summer Lakes/Lansing Island, but a different root cause and fix). Ryan
// defined the community geographically rather than by name: "for south
// merritt island page listings I would use all the listings south of of
// Randon lane, crooked mile road, & hilltop lane that all run east to
// west. Everything south of the red line I drew in merritt island" (a
// hand-drawn line across a Google Maps screenshot). A curated
// subdivision-name list (the TORTOISE_ISLAND_SUBDIVISION_NAMES-style
// pattern used for the other three) doesn't fit this: it isn't one
// community with a handful of MLS SubdivisionName spellings, it's
// "everything below a latitude" — and a live pull of all 393 active
// Merritt Island listings the same day found ~16% of them have no
// subdivision name recorded at all, which would silently drop real South
// Merritt Island listings from any name-based list. Every listing does
// carry a latitude, though, so this filters geographically instead — see
// listings.controller.js's `latMax`/`latMin` support in the backend repo
// (added the same day) and this page's listingsFilterParams below, which
// passes `{ city: 'merritt-island', latMax: SOUTH_MERRITT_ISLAND_LAT_MAX }`
// only for this one neighborhood.
//
// Calibrated from that same live pull: the only listings actually sitting
// on Randon Lane/Crooked Mile Road (Hilltop Lane had no active listings)
// were 4 "Georgiana Settlement" addresses at latitudes 28.279863-28.283822
// — i.e. the boundary itself isn't a single exact latitude (the roads
// aren't perfectly straight), it's a narrow band. This threshold is set
// just above the northernmost of those (28.283822), so listings fronting
// the boundary roads themselves are counted as South Merritt Island (the
// same side Ryan's line was drawn along), and anything north of the band
// is excluded. Sanity-checked against the full dataset: 23 of 393 active
// Merritt Island listings fall at/below this latitude, all with
// plausible South Merritt Island street names (S Tropical Trail, Hillview
// Circle, Honeyridge Lane, etc.) — no obviously-wrong inclusions.
export const SOUTH_MERRITT_ISLAND_LAT_MAX = 28.2839;

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

// --- Area Guide pages (2026-09-24, per Ryan) -------------------------------
//
// Ryan's ask, working through a suggestion he'd gotten for improving city
// page SEO without cluttering the listings pages (especially on mobile):
// "can I put all that information on a page that is linked to a page like
// Melbourne Beach Homes. That way it doesn't look too busy or take up too
// much room on mobile searches... I want the pages to be very easy to
// navigate without a lot of text." Approved rollout order: Melbourne Beach
// first as a working example, then the same treatment across the other
// cities and neighborhoods.
//
// Two pieces per city:
//   1. A dedicated /{citySlug}/area-guide page (see
//      app/[citySlug]/area-guide/page.js) holding the in-depth
//      schools/flood-zone/HOA/market/neighborhood/lifestyle content.
//   2. A short "<City> Area Guide" link + a collapsed, tap-to-open FAQ
//      (CITY_LISTINGS_FAQ below) added to that city's own Homes/Condos/
//      Land/Oceanfront pages (app/[citySlug]/[propertySlug]/page.js) —
//      per Ryan: "Add a collapsed FAQ at the bottom, below the listings.
//      Show 4-5 questions that open when tapped." Kept to a handful of
//      short Q&As so the listings page itself stays scannable; the guide
//      page carries the fuller version of the same material.
//
// CITY_AREA_GUIDE_SLUGS gates both pieces so a city with no guide content
// yet doesn't grow a dead link or an empty FAQ block. Add a city's slug
// here (and its own entries below) as the rollout continues.
export const CITY_AREA_GUIDE_SLUGS = [
  'melbourne-beach',
  // Second wave (2026-09-24, per Ryan: "Start the other cities") — same
  // content sourcing approach as Melbourne Beach: schools/HOA figures
  // pulled from live MLS records on the site's own listings, lifestyle/
  // geography facts from each city's Wikipedia page, flood-zone guidance
  // kept general/parcel-cautious throughout. See CITY_AREA_GUIDE_CONTENT
  // below for the sourcing notes specific to Viera East/Viera West, whose
  // direct city-level listing counts are too thin to draw school/HOA
  // figures from on their own.
  'cocoa-beach',
  'indialantic',
  'indian-harbour-beach',
  'melbourne',
  'rockledge',
  'satellite-beach',
  'viera',
  'merritt-island',
  'viera-west',
];

// FAQ content per CITY_AREA_GUIDE_SLUGS entry — shown via components/Faq.js
// both in the collapsed accordion on the listings pages and again (same
// content, reused rather than duplicated) near the bottom of that city's
// own Area Guide page.
//
// Sourcing notes, so these stay honest as they're extended to other cities:
//  - Schools: not guessed — pulled from the elementarySchool/middleSchool/
//    highSchool fields already present on live Melbourne Beach MLS
//    listings (188 Home+Condo listings checked 2026-09-24: Gemini
//    Elementary/Hoover Middle/Melbourne High on 181 of them, ~96%),
//    cross-checked against Niche.com's own Melbourne Beach school list,
//    which named the same three schools independently.
//  - HOA fee range: pulled from real assocFee values on live Melbourne
//    Beach listings the same day (samples from $50-60/mo voluntary fees on
//    plain single-family homes up to $1,306/mo on an Aquarina oceanfront
//    condo) — not a single town-wide number, since it isn't one.
//  - Flood zones: kept general/cautious on purpose. Melbourne Beach is a
//    barrier island, so AE/VE coastal zones are common there, but the
//    exact zone is parcel-specific and Claude has no access to a
//    per-address FEMA lookup — the answer below points buyers to FEMA's
//    own Flood Map Service Center rather than asserting a zone for any
//    specific property.
// Area Guide page body content, one entry per CITY_AREA_GUIDE_SLUGS city —
// see app/[citySlug]/area-guide/page.js. Kept short per section
// deliberately (Ryan: "very easy to navigate without a lot of text") —
// this is meant to be scanned, not read start to finish. Market stats
// aren't hardcoded here since they'd go stale; the guide page computes
// those live from the same /api/listings the rest of the site uses (see
// getMarketSnapshot in the page itself).
export const CITY_AREA_GUIDE_CONTENT = {
  'melbourne-beach': {
    intro:
      'Melbourne Beach is a quiet barrier-island town between the Indian River Lagoon and the Atlantic Ocean, with no high-rises, a classic small-beach-town feel, and easy access to Sebastian Inlet.',
    lifestyle:
      "Incorporated in 1923, Melbourne Beach covers just 1.4 square miles and stays low-density and low-rise by nature of its size, not a strict height law. It's a popular spot for retirees and second-home buyers (median age is 52) drawn to the quieter pace compared to Cocoa Beach or Satellite Beach further north. Coconut Point Park, a beachside sea turtle nesting site, sits right in town.",
    schools:
      'Based on current MLS records for Melbourne Beach listings, the large majority of homes are zoned for Gemini Elementary, Hoover Middle School, and Melbourne High School (Brevard Public Schools). School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    floodZones:
      "As a barrier island, much of Melbourne Beach sits in FEMA coastal flood zones (AE/VE common near the water, X further inland toward the Indian River), which affects whether a lender requires flood insurance. The exact zone is specific to each parcel — look up any address on FEMA's Flood Map Service Center, or ask us and we'll pull it for a listing you're considering.",
    hoa: "Most single-family homes in Melbourne Beach carry no HOA, or just a small voluntary neighborhood fee. Condo and townhome communities are different — buildings like Aquarina and Beach Woods have real monthly or quarterly association fees covering exterior maintenance, insurance, and shared amenities, ranging from roughly $50/month on smaller associations up to $1,300+/month on full-amenity oceanfront buildings. Always confirm the fee on the specific listing.",
    neighborhoods: [
      {
        name: 'Aquarina',
        href: '/neighborhoods/aquarina',
        blurb: 'Oceanfront golf community with homes and condos along the Atlantic side of town.',
      },
      {
        // Swapped for Tortoise Island (2026-09-24, per Ryan: "Tortoise
        // island is not in Melbourne beach. You can add harbor island
        // Beach club in its place.") — Tortoise Island removed from this
        // list entirely rather than re-homed elsewhere (Ryan didn't say
        // which city it actually belongs to, and the NEIGHBORHOODS seed
        // data disagreeing with him isn't this page's problem to fix).
        // Harbor Island Beach Club itself is technically seeded under
        // Indian Harbour Beach (see NEIGHBORHOODS in the backend's
        // seed.js), same situation as its existing "Melbourne Beach FL
        // Homes/Condos for sale" heading on its own neighborhood page
        // (app/neighborhoods/[slug]/page.js's isHarborIslandBeachClub
        // block) — Ryan treats it as a Melbourne Beach community by
        // reputation/marketing even though the backend's city field says
        // otherwise, so this follows that same established precedent.
        name: 'Harbor Island Beach Club',
        href: '/neighborhoods/harbor-island-beach-club',
        blurb: 'Gated waterfront condo community with private beach access.',
      },
      {
        name: 'Beach Woods',
        href: '/neighborhoods/beach-woods',
        blurb: 'Condo and townhome community across several phases, near the beach.',
      },
    ],
  },

  // --- Second wave (2026-09-24, per Ryan: "Start the other cities") -------
  // Sourcing notes for all 9 entries below, same standard as Melbourne
  // Beach: schools/HOA figures pulled from the elementarySchool/
  // middleSchool/highSchool/assocFee fields on live MLS listings for each
  // city (checked 2026-09-24); lifestyle/geography facts from each city's
  // own Wikipedia page (Cocoa Beach, Indialantic, Indian Harbour Beach,
  // Melbourne, Rockledge, Satellite Beach, Merritt Island, Viera, Viera
  // West, Viera East all have their own pages); flood-zone guidance kept
  // general/parcel-cautious throughout, same reasoning as Melbourne
  // Beach's own entry above. Viera and Viera West are the one exception
  // worth flagging: their direct city-level listing counts were far too
  // thin (0-2 records) to draw school/HOA figures from, so those two
  // entries instead pull from their own neighborhood pages (Aripeka for
  // Viera East; Adelaide/Summer Lakes/Viera Builders Communities Viera
  // West for Viera West) — still real live listing data, just scoped one
  // level down since the city-level query alone wasn't usable. Both are
  // low-volume, high-end master-planned areas, which is also why their
  // sample HOA fees skew much higher than the beach cities.
  'cocoa-beach': {
    intro:
      "Cocoa Beach is Brevard County's best-known beach town — a barrier island built around surfing, the Cocoa Beach Pier, and easy access to Kennedy Space Center launches, with as large a condo market as a single-family one.",
    lifestyle:
      "Incorporated in 1925, Cocoa Beach stretches along 5.6 miles of Atlantic oceanfront with the Banana River and its canal-laced Thousand Islands neighborhoods on the west side. It's Florida's surfing capital — home to the Easter Surfing Festival and Ron Jon Surf Shop — and popular with both full-time residents and second-home buyers, with Kennedy Space Center launches visible from the beach.",
    schools:
      "Current MLS records for Cocoa Beach listings split fairly evenly between Cape View Elementary and Roosevelt Elementary, while nearly every listing is zoned for Cocoa Beach Jr/Sr High School (Brevard Public Schools) for both middle and high school. Confirm current zoning with Brevard Public Schools before buying with a specific school in mind.",
    floodZones:
      "As a barrier island city built partly on dredged fill from the Banana River, most of Cocoa Beach sits in FEMA coastal flood zones (AE/VE), which usually means a lender requires flood insurance. The exact zone is parcel-specific — look up any address on FEMA's Flood Map Service Center, or ask us and we'll pull it for a listing you're considering.",
    hoa: "Cocoa Beach's market leans heavily toward condos, so HOA fees are the norm rather than the exception — current listings show fees from roughly $125/month on smaller buildings up to $900+/quarter on larger ones. Single-family homes, especially in the canal neighborhoods, are more likely to have a modest fee or none at all. Always confirm the fee on the specific listing.",
    neighborhoods: [],
  },

  indialantic: {
    intro:
      'Indialantic is a small, established barrier-island town connected to mainland Melbourne by causeway, with a quieter, more residential feel than Cocoa Beach to the north.',
    lifestyle:
      "Incorporated in 1952 as Indialantic-By-The-Sea, the town covers just over a square mile between the Indian River Lagoon and the Atlantic Ocean. It's a mature, established community — median age 52 — with its own police and fire departments, and its stretch of Route A1A has been recognized as one of Florida's best scenic drives.",
    schools:
      'Current MLS records show Indialantic listings are essentially unanimous on school zoning: Indialantic Elementary, Hoover Middle School, and Melbourne High School (Brevard Public Schools). Zoning can still change over time, so confirm current boundaries with Brevard Public Schools before buying with a specific school in mind.',
    floodZones:
      "As a barrier island town linked to the mainland by the Melbourne Causeway, most of Indialantic sits in FEMA coastal flood zones (AE/VE), which usually means a lender requires flood insurance. The exact zone is parcel-specific — look up any address on FEMA's Flood Map Service Center, or ask us and we'll pull it for a listing you're considering.",
    hoa: "Most single-family homes in Indialantic carry no HOA or a modest annual fee — current listings range from about $300/year up to roughly $500/quarter. Condo buildings along the beach carry higher monthly fees, commonly $125/month or more depending on amenities. Always confirm the fee on the specific listing.",
    neighborhoods: [],
  },

  'indian-harbour-beach': {
    intro:
      'Indian Harbour Beach is a mid-size barrier-island city between Indialantic and Satellite Beach, with a mix of single-family neighborhoods and waterfront condo communities.',
    lifestyle:
      'Incorporated in 1955, Indian Harbour Beach covers 2.67 square miles between the Atlantic Ocean and the Banana River. It was the first community on the East Coast certified NOAA Tsunami Ready, and its beaches and river shoreline support nesting sea turtles and manatee habitat.',
    schools:
      'Current MLS records show most Indian Harbour Beach listings are zoned for Ocean Breeze Elementary, Hoover Middle School, and Satellite High School (Brevard Public Schools), though a share of listings are zoned for DeLaura Middle instead. Confirm current boundaries with Brevard Public Schools before buying with a specific school in mind.',
    floodZones:
      "As a barrier island city between the Atlantic and the Banana River, most of Indian Harbour Beach sits in FEMA coastal flood zones (AE/VE), which usually means a lender requires flood insurance. The exact zone is parcel-specific — look up any address on FEMA's Flood Map Service Center, or ask us and we'll pull it for a listing you're considering.",
    hoa: 'HOA fees vary widely here — current listings range from around $135/quarter on smaller associations up to $700-$1,250/year on others, with waterfront condo communities like Harbor Island Beach Club and Lansing Island carrying their own separate association fees on top. Always confirm the fee on the specific listing.',
    neighborhoods: [
      {
        name: 'Lansing Island',
        href: '/neighborhoods/lansing-island',
        blurb: 'Waterfront condo community on the Banana River side of town.',
      },
      {
        name: 'Harbor Island Beach Club',
        href: '/neighborhoods/harbor-island-beach-club',
        blurb: 'Gated waterfront condo community with private beach access.',
      },
    ],
  },

  melbourne: {
    intro:
      "Melbourne is Brevard County's largest city — a mainland hub along the Indian River Lagoon with its own tech and defense industry base, two historic downtown districts, and everything from starter condos to riverfront estates.",
    lifestyle:
      "Incorporated in 1888 and merged with neighboring Eau Gallie in 1969, Melbourne is home to Melbourne Orlando International Airport, L3Harris Technologies' headquarters, the Brevard Zoo, and two separate downtown districts — Historic Downtown Melbourne and the Eau Gallie Arts District — each with its own restaurants and shops. With over 84,000 residents it's by far the largest, most diverse city on this site, with a younger median age than the beach towns to the east.",
    schools:
      'Melbourne is large enough that school zoning varies significantly by neighborhood — current listings are most commonly zoned for University Park, Quest, or Suntree Elementary; Johnson, DeLaura, or Stone Middle School; and Viera, Melbourne, or Eau Gallie High School (Brevard Public Schools). Always confirm the exact zoning for a specific address with Brevard Public Schools.',
    floodZones:
      "Melbourne sits mostly on the mainland along the Indian River Lagoon, so flood risk varies a lot by location — waterfront and low-lying areas near the river can fall into FEMA's AE flood zone, while most of the rest of the city sits in the lower-risk X zone. A small section of the city extends onto the barrier island, where AE/VE zones are more common. The exact zone is parcel-specific — look up any address on FEMA's Flood Map Service Center, or ask us and we'll pull it for a listing you're considering.",
    hoa: 'Most older, established Melbourne neighborhoods have no HOA, while newer subdivisions and condo buildings do — current listings show fees anywhere from about $165/year on small associations up to $400+/quarter on newer communities. Always confirm the fee on the specific listing.',
    neighborhoods: [
      {
        name: 'Suntree',
        href: '/neighborhoods/suntree',
        blurb: 'Large, established community on the north side of Melbourne, including Baytree.',
      },
    ],
  },

  rockledge: {
    intro:
      "Rockledge is Brevard County's oldest incorporated city — a mainland community along the Indian River Lagoon with a mix of historic riverfront homes and newer subdivisions west toward Viera.",
    lifestyle:
      "Founded in 1887, Rockledge is the oldest incorporated municipality in Brevard County, with a history rooted in citrus groves and early Indian River tourism. Today it's a mainland community of about 27,700 people bordered by Cocoa to the north and Viera/Melbourne to the south, with 17 public parks and a mature, established character — the median age is 46.6.",
    schools:
      'School zoning varies by neighborhood in Rockledge — current listings are most commonly zoned for Golfview, Manatee, or Andersen Elementary; Kennedy or McNair Middle School; and Rockledge or Viera High School (Brevard Public Schools). Confirm the exact zoning for a specific address with Brevard Public Schools.',
    floodZones:
      "Rockledge is a mainland city with no oceanfront, so flood risk here is generally lower than the barrier-island cities, but low-lying areas along the Indian River Lagoon can still fall into FEMA's AE flood zone while most of the rest of the city sits in the lower-risk X zone. The exact zone is parcel-specific — look up any address on FEMA's Flood Map Service Center, or ask us and we'll pull it for a listing you're considering.",
    hoa: "Most of Rockledge's older, established neighborhoods carry no HOA, while newer subdivisions do — current listings range from about $250 semi-annually up to $600/quarter. Always confirm the fee on the specific listing.",
    neighborhoods: [],
  },

  'satellite-beach': {
    intro:
      'Satellite Beach is the largest beachside community in South Brevard County — a barrier island city just south of Patrick Space Force Base with an affluent, established residential character.',
    lifestyle:
      "Incorporated in 1957, Satellite Beach sits between the Atlantic Ocean and the Banana River with about 7.7 miles of shoreline including beaches and canals. It's known for an early commitment to solar power and beach restoration, sea turtle nesting on its beaches, and a notably affluent, mature population — median household income was $92,750 as of the 2020 census.",
    schools:
      'Current MLS records show most Satellite Beach listings are zoned for DeLaura Middle School and Satellite High School (Brevard Public Schools), with elementary zoning split mainly between Sea Park, Surfside, and Holland Elementary depending on the neighborhood. Confirm current zoning with Brevard Public Schools before buying with a specific school in mind.',
    floodZones:
      "As a barrier island city with 7.7 miles of Atlantic and Banana River shoreline, most of Satellite Beach sits in FEMA coastal flood zones (AE/VE), which usually means a lender requires flood insurance. The exact zone is parcel-specific — look up any address on FEMA's Flood Map Service Center, or ask us and we'll pull it for a listing you're considering.",
    hoa: 'HOA fees in Satellite Beach are fairly consistent for its condo buildings — current listings commonly show fees around $380-385/month — while single-family homes are more likely to have no HOA or a smaller one. Always confirm the fee on the specific listing.',
    neighborhoods: [],
  },

  viera: {
    // Renamed back from "Viera East" to "Viera" (2026-09-24, per Ryan: "Lets
    // do Viera then instead of viera east") — see cityListingsQueryParams's
    // VIERA_LAT_MIN/etc. comment for the full reasoning (SEO: bare "Viera"
    // has far higher search volume, and matches how Zillow itself already
    // splits this geography) and the backend's renameVieraBackFromEast
    // migration for the corresponding DB-level city name change. Every
    // "Viera East" below was swapped to "Viera" to match; the one place that
    // needed more than a find-and-replace was the lifestyle paragraph's
    // "split into Viera East and Viera West" (now "split into Viera and
    // Viera West"), which still reads correctly as two named halves.
    intro:
      "Viera is the original half of the Viera master-planned community — inland, away from the coast, built around Avenue Viera's shops and restaurants, Space Coast Stadium, and more than 100 miles of trails.",
    lifestyle:
      'Developed by the Viera Company (A. Duda & Sons) starting in 1989, Viera spans about 14,500 acres split into Viera and Viera West, with roughly half the land set aside for conservation. Viera itself has around 11,700 residents across a mix of neighborhoods, including several active-adult communities, plus Avenue Viera\'s 100+ shops and restaurants, Space Coast Stadium, the Brevard Zoo, and Duran Golf Club nearby.',
    schools:
      'Homes in Viera are commonly zoned for Viera Elementary, Viera Middle School, and Viera High School (Brevard Public Schools), though exact zoning can vary by neighborhood. Confirm current boundaries with Brevard Public Schools before buying with a specific school in mind.',
    floodZones:
      "Viera sits inland, well away from the coast, so most of the community falls into FEMA's lower-risk X flood zone rather than the AE/VE zones common on the barrier islands. Some low-lying areas near ponds or preserved wetlands can still carry a flood zone designation — look up any specific address on FEMA's Flood Map Service Center, or ask us and we'll pull it for a listing you're considering.",
    hoa: 'Nearly every home in Viera belongs to an HOA, and many neighborhoods also fall within the Viera Community Development District (CDD), a separate fee that funds roads, parks, and other infrastructure built as part of the master plan. Combined HOA and CDD costs vary a lot by neighborhood and amenities — always confirm both fees on the specific listing.',
    neighborhoods: [
      {
        name: 'Aripeka',
        href: '/neighborhoods/aripeka',
        blurb: 'Golf course community within Viera.',
      },
    ],
  },

  'merritt-island': {
    intro:
      'Merritt Island is a large, unincorporated river-island community between the Indian River and Banana River — not oceanfront itself, but bordered on the north by Kennedy Space Center and the Merritt Island National Wildlife Refuge.',
    lifestyle:
      "Merritt Island stretches roughly 46 miles between the mainland and the true barrier islands (Cocoa Beach, Cape Canaveral), so it fronts the Indian and Banana Rivers rather than the Atlantic directly. It's unincorporated Brevard County — residents voted decisively against becoming its own city in 1988 — with a mature population (median age 52) and a mix of established central neighborhoods and quieter residential areas to the south. The north end borders the Merritt Island National Wildlife Refuge, home to roughly 356 bird species.",
    schools:
      'Current MLS records show the large majority of Merritt Island listings are zoned for Jefferson Middle School and Merritt Island High School (Brevard Public Schools), with elementary zoning split mainly between Carroll, Tropical, and Audubon Elementary depending on the neighborhood. Confirm current zoning with Brevard Public Schools before buying with a specific school in mind.',
    floodZones:
      "Merritt Island sits between the Indian River and Banana River rather than directly on the Atlantic, so flood risk varies with proximity to the water — riverfront and low-lying areas commonly fall into FEMA's AE flood zone, while inland parts of the island sit in the lower-risk X zone. The exact zone is parcel-specific — look up any address on FEMA's Flood Map Service Center, or ask us and we'll pull it for a listing you're considering.",
    hoa: 'Most Merritt Island single-family neighborhoods carry no HOA or a modest one — current listings range from about $410/year up to $1,150/year — while some riverfront and newer communities carry higher fees. Always confirm the fee on the specific listing.',
    neighborhoods: [
      {
        name: 'South Merritt Island',
        href: '/neighborhoods/south-merritt-island',
        blurb: 'Everything south of Randon Lane, Crooked Mile Road, and Hilltop Lane.',
      },
    ],
  },

  'viera-west': {
    intro:
      'Viera West is the newer, faster-growing half of the Viera master-planned community, sitting west of I-95 with a family-oriented mix of established and newly built neighborhoods.',
    lifestyle:
      "Viera West's population nearly tripled between 2010 and 2020 (6,641 to 16,688 residents) as new phases of the master plan continued building out west of I-95. It's a family-oriented community — about 64% married couples and nearly a third with kids under 18 — with a younger median age (45.2) than most other cities on this site, plus its own share of the shops, schools, and recreation the broader Viera plan offers.",
    schools:
      'Homes in Viera West are commonly zoned for Manatee Elementary, Kennedy Middle School, and Viera High School (Brevard Public Schools), though exact zoning can vary by neighborhood. Confirm current boundaries with Brevard Public Schools before buying with a specific school in mind.',
    floodZones:
      "Viera West sits inland, well away from the coast, so most of the community falls into FEMA's lower-risk X flood zone rather than the AE/VE zones common on the barrier islands. Some low-lying areas near ponds or preserved wetlands can still carry a flood zone designation — look up any specific address on FEMA's Flood Map Service Center, or ask us and we'll pull it for a listing you're considering.",
    hoa: 'As in Viera, nearly every home in Viera West belongs to an HOA, and many neighborhoods also fall within the Viera West Community Development District (CDD), a separate fee funding roads, parks, and other master-plan infrastructure. Combined HOA and CDD costs vary widely by neighborhood — current listings show HOA fees alone ranging from roughly $1,225/quarter up to $4,900/year on some communities. Always confirm both fees on the specific listing.',
    neighborhoods: [
      {
        name: 'Adelaide',
        href: '/neighborhoods/adelaide',
        blurb: 'Golf course community in Viera West.',
      },
      {
        name: 'Summer Lakes',
        href: '/neighborhoods/summer-lakes',
        blurb: 'Family-oriented neighborhood in Viera West.',
      },
      {
        name: 'Viera Builders Communities',
        href: '/neighborhoods/viera-builders-communities-viera-west',
        blurb: 'Newer builder communities across Viera West, including Reeling Park.',
      },
    ],
  },
};

export const CITY_LISTINGS_FAQ = {
  'melbourne-beach': [
    {
      q: 'Is Melbourne Beach, FL a good place to live?',
      a: "Melbourne Beach is a quiet, low-density barrier island town between the Indian River Lagoon and the Atlantic Ocean, with no high-rise buildings and easy access to Sebastian Inlet. It's popular with retirees and second-home buyers looking for a slower pace than the busier beach towns to the north.",
    },
    {
      q: 'What schools serve Melbourne Beach?',
      a: 'Most Melbourne Beach addresses are zoned for Gemini Elementary, Hoover Middle School, and Melbourne High School (Brevard Public Schools). Zoning can vary by exact address and does change over time, so confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'Are there HOA fees in Melbourne Beach?',
      a: "It depends on the property. Most single-family homes have no HOA or only a small voluntary neighborhood fee, while condo and townhome communities like Aquarina and Beach Woods carry a monthly or quarterly association fee that covers exterior maintenance, insurance, and shared amenities. Always confirm the fee on the specific listing you're considering.",
    },
    {
      q: 'What flood zones are in Melbourne Beach?',
      a: "As a barrier island community, much of Melbourne Beach falls into FEMA coastal flood zones (AE/VE), though the exact zone depends on the specific parcel and can affect whether flood insurance is required. Look up any address on FEMA's Flood Map Service Center, or ask us and we can pull it for a listing you're interested in.",
    },
    {
      q: 'Is Melbourne Beach on a barrier island?',
      a: "Yes. Melbourne Beach sits on the barrier island between the Indian River Lagoon and the Atlantic Ocean, running south from Indialantic to Sebastian Inlet. It's a small town — about 1.4 square miles — of mostly single-family homes and low-rise condo buildings.",
    },
  ],

  'cocoa-beach': [
    {
      q: 'Is Cocoa Beach, FL a good place to live?',
      a: "Cocoa Beach is Florida's surfing capital — a barrier island town with 5.6 miles of Atlantic oceanfront, the Cocoa Beach Pier, and Kennedy Space Center launches visible from the beach. It has a large condo market alongside its single-family neighborhoods and canal-laced Thousand Islands area.",
    },
    {
      q: 'What schools serve Cocoa Beach?',
      a: 'Cocoa Beach listings split fairly evenly between Cape View Elementary and Roosevelt Elementary, while nearly every home is zoned for Cocoa Beach Jr/Sr High School (Brevard Public Schools) for both middle and high school. Confirm current zoning with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'Are there HOA fees in Cocoa Beach?',
      a: "Cocoa Beach leans heavily toward condos, so HOA fees are common — current listings range from roughly $125/month on smaller buildings up to $900+/quarter on larger ones. Single-family homes, especially in the canal neighborhoods, are more likely to have a modest fee or none. Always confirm the fee on the specific listing.",
    },
    {
      q: 'What flood zones are in Cocoa Beach?',
      a: "As a barrier island built partly on dredged fill, most of Cocoa Beach falls into FEMA coastal flood zones (AE/VE), which usually means flood insurance is required with a mortgage. Look up any address on FEMA's Flood Map Service Center, or ask us and we can pull it for a listing you're interested in.",
    },
    {
      q: 'Is Cocoa Beach on a barrier island?',
      a: 'Yes. Cocoa Beach sits on a barrier island between the Atlantic Ocean and the Banana River, with Cape Canaveral to the north and Crescent Beach to the south. The west side includes the Thousand Islands, a canal-front residential area.',
    },
  ],

  indialantic: [
    {
      q: 'Is Indialantic, FL a good place to live?',
      a: "Indialantic is a small, established barrier-island town connected to mainland Melbourne by causeway, with a quieter feel than Cocoa Beach to the north. It's a mature community — median age 52 — known for its scenic stretch of Route A1A.",
    },
    {
      q: 'What schools serve Indialantic?',
      a: 'Indialantic listings are essentially unanimous on school zoning: Indialantic Elementary, Hoover Middle School, and Melbourne High School (Brevard Public Schools). Zoning can still change over time, so confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'Are there HOA fees in Indialantic?',
      a: 'Most single-family homes in Indialantic have no HOA or a modest annual fee, roughly $300/year up to about $500/quarter. Condo buildings along the beach carry higher monthly fees, commonly $125/month or more depending on amenities. Always confirm the fee on the specific listing.',
    },
    {
      q: 'What flood zones are in Indialantic?',
      a: "As a barrier island town, most of Indialantic falls into FEMA coastal flood zones (AE/VE), which usually means flood insurance is required with a mortgage. Look up any address on FEMA's Flood Map Service Center, or ask us and we can pull it for a listing you're interested in.",
    },
    {
      q: 'Is Indialantic on a barrier island?',
      a: "Yes. Indialantic sits on the barrier island between the Indian River Lagoon and the Atlantic Ocean, connected to mainland Melbourne by the Melbourne Causeway. It's just over a square mile, incorporated in 1952 as Indialantic-By-The-Sea.",
    },
  ],

  'indian-harbour-beach': [
    {
      q: 'Is Indian Harbour Beach, FL a good place to live?',
      a: 'Indian Harbour Beach is a mid-size barrier-island city between Indialantic and Satellite Beach, with a mix of single-family neighborhoods and waterfront condo communities. It was the first East Coast community certified NOAA Tsunami Ready.',
    },
    {
      q: 'What schools serve Indian Harbour Beach?',
      a: 'Most Indian Harbour Beach listings are zoned for Ocean Breeze Elementary, Hoover Middle School, and Satellite High School (Brevard Public Schools), though some listings are zoned for DeLaura Middle instead. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'Are there HOA fees in Indian Harbour Beach?',
      a: 'HOA fees vary widely here — current listings range from around $135/quarter up to $700-$1,250/year, with waterfront condo communities like Harbor Island Beach Club and Lansing Island carrying their own separate fees. Always confirm the fee on the specific listing.',
    },
    {
      q: 'What flood zones are in Indian Harbour Beach?',
      a: "As a barrier island city between the Atlantic and the Banana River, most of Indian Harbour Beach falls into FEMA coastal flood zones (AE/VE), which usually means flood insurance is required with a mortgage. Look up any address on FEMA's Flood Map Service Center, or ask us and we can pull it for a listing you're interested in.",
    },
    {
      q: 'Is Indian Harbour Beach on a barrier island?',
      a: 'Yes. Indian Harbour Beach sits on a barrier island between the Atlantic Ocean and the Banana River, about 3 miles north of Indialantic and just south of Satellite Beach. It was incorporated in 1955.',
    },
  ],

  melbourne: [
    {
      q: 'Is Melbourne, FL a good place to live?',
      a: "Melbourne is Brevard County's largest city — a mainland hub on the Indian River Lagoon with its own tech and defense industry base (including L3Harris Technologies' headquarters), Melbourne Orlando International Airport, and two historic downtown districts.",
    },
    {
      q: 'What schools serve Melbourne?',
      a: 'Melbourne is large enough that school zoning varies significantly by neighborhood — listings are most commonly zoned for University Park, Quest, or Suntree Elementary; Johnson, DeLaura, or Stone Middle School; and Viera, Melbourne, or Eau Gallie High School (Brevard Public Schools). Always confirm the exact zoning for a specific address with Brevard Public Schools.',
    },
    {
      q: 'Are there HOA fees in Melbourne?',
      a: 'Most older, established Melbourne neighborhoods have no HOA, while newer subdivisions and condo buildings do — current listings show fees anywhere from about $165/year up to $400+/quarter. Always confirm the fee on the specific listing.',
    },
    {
      q: 'What flood zones are in Melbourne?',
      a: "Melbourne sits mostly on the mainland along the Indian River Lagoon, so flood risk varies by location — waterfront areas can fall into FEMA's AE flood zone while most of the city sits in the lower-risk X zone. Look up any address on FEMA's Flood Map Service Center, or ask us and we can pull it for a listing you're interested in.",
    },
    {
      q: 'Is Melbourne on the ocean?',
      a: "No, not for the most part. Melbourne sits mainly on the mainland along the Indian River Lagoon, with only a small section extending onto the barrier island. For oceanfront listings, see our Melbourne Beach or Indialantic pages instead.",
    },
  ],

  rockledge: [
    {
      q: 'Is Rockledge, FL a good place to live?',
      a: "Rockledge is Brevard County's oldest incorporated city (founded 1887) — a mainland community along the Indian River Lagoon with a mix of historic riverfront homes and newer subdivisions toward Viera.",
    },
    {
      q: 'What schools serve Rockledge?',
      a: 'School zoning varies by neighborhood in Rockledge — listings are most commonly zoned for Golfview, Manatee, or Andersen Elementary; Kennedy or McNair Middle School; and Rockledge or Viera High School (Brevard Public Schools). Confirm the exact zoning for a specific address with Brevard Public Schools.',
    },
    {
      q: 'Are there HOA fees in Rockledge?',
      a: "Most of Rockledge's older, established neighborhoods carry no HOA, while newer subdivisions do — current listings range from about $250 semi-annually up to $600/quarter. Always confirm the fee on the specific listing.",
    },
    {
      q: 'What flood zones are in Rockledge?',
      a: "Rockledge is a mainland city with no oceanfront, so flood risk is generally lower than the barrier-island cities, though low-lying areas along the Indian River Lagoon can still fall into FEMA's AE flood zone. Look up any address on FEMA's Flood Map Service Center, or ask us and we can pull it for a listing you're interested in.",
    },
    {
      q: 'Is Rockledge on the water?',
      a: 'Rockledge fronts the Indian River Lagoon on its east side but has no oceanfront — it sits entirely on the mainland between Cocoa to the north and Viera/Melbourne to the south.',
    },
  ],

  'satellite-beach': [
    {
      q: 'Is Satellite Beach, FL a good place to live?',
      a: 'Satellite Beach is the largest beachside community in South Brevard County — a barrier island city just south of Patrick Space Force Base with an affluent, established character (median household income was $92,750 as of the 2020 census).',
    },
    {
      q: 'What schools serve Satellite Beach?',
      a: 'Most Satellite Beach listings are zoned for DeLaura Middle School and Satellite High School (Brevard Public Schools), with elementary zoning split mainly between Sea Park, Surfside, and Holland Elementary. Confirm current zoning with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'Are there HOA fees in Satellite Beach?',
      a: 'HOA fees are fairly consistent for the condo buildings here — current listings commonly show fees around $380-385/month — while single-family homes are more likely to have no HOA or a smaller one. Always confirm the fee on the specific listing.',
    },
    {
      q: 'What flood zones are in Satellite Beach?',
      a: "As a barrier island city with about 7.7 miles of Atlantic and Banana River shoreline, most of Satellite Beach falls into FEMA coastal flood zones (AE/VE), which usually means flood insurance is required with a mortgage. Look up any address on FEMA's Flood Map Service Center, or ask us and we can pull it for a listing you're interested in.",
    },
    {
      q: 'Is Satellite Beach on a barrier island?',
      a: 'Yes. Satellite Beach sits on a barrier island between the Atlantic Ocean and the Banana River, incorporated in 1957. Its beaches support nesting loggerhead and green sea turtles.',
    },
  ],

  viera: [
    {
      q: 'Is Viera, FL a good place to live?',
      a: "Viera is the original half of the Viera master-planned community — inland, away from the coast, built around Avenue Viera's shops and restaurants, Space Coast Stadium, the Brevard Zoo, and more than 100 miles of trails.",
    },
    {
      q: 'What schools serve Viera?',
      a: 'Homes in Viera are commonly zoned for Viera Elementary, Viera Middle School, and Viera High School (Brevard Public Schools), though exact zoning can vary by neighborhood. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'Are there HOA or CDD fees in Viera?',
      a: 'Nearly every home in Viera belongs to an HOA, and many neighborhoods also fall within the Viera Community Development District (CDD), a separate fee funding roads, parks, and other master-plan infrastructure. Always confirm both fees on the specific listing.',
    },
    {
      q: 'What flood zones are in Viera?',
      a: "Viera sits inland, well away from the coast, so most of the community falls into FEMA's lower-risk X flood zone rather than the AE/VE zones common on the barrier islands. Look up any address on FEMA's Flood Map Service Center, or ask us and we can pull it for a listing you're interested in.",
    },
    {
      q: 'Is Viera on the water?',
      a: "No. Viera is inland, roughly 8 miles along I-95, developed by the Viera Company (A. Duda & Sons) starting in 1989. About half the master plan's 14,500 acres is set aside for conservation rather than waterfront development.",
    },
  ],

  'merritt-island': [
    {
      q: 'Is Merritt Island, FL a good place to live?',
      a: 'Merritt Island is a large, unincorporated river-island community between the Indian River and Banana River, bordered on the north by Kennedy Space Center and the Merritt Island National Wildlife Refuge. Residents voted against becoming its own city in 1988.',
    },
    {
      q: 'What schools serve Merritt Island?',
      a: 'The large majority of Merritt Island listings are zoned for Jefferson Middle School and Merritt Island High School (Brevard Public Schools), with elementary zoning split mainly between Carroll, Tropical, and Audubon Elementary. Confirm current zoning with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'Are there HOA fees on Merritt Island?',
      a: 'Most Merritt Island single-family neighborhoods carry no HOA or a modest one — current listings range from about $410/year up to $1,150/year — while some riverfront and newer communities carry higher fees. Always confirm the fee on the specific listing.',
    },
    {
      q: 'What flood zones are on Merritt Island?',
      a: "Merritt Island sits between the Indian River and Banana River rather than directly on the Atlantic, so flood risk varies with proximity to the water — riverfront areas commonly fall into FEMA's AE flood zone while inland areas sit in the lower-risk X zone. Look up any address on FEMA's Flood Map Service Center, or ask us and we can pull it for a listing you're interested in.",
    },
    {
      q: 'Is Merritt Island oceanfront?',
      a: "No. Merritt Island sits between the Indian River and the Banana River/Mosquito Lagoon — the true barrier islands (Cocoa Beach, Cape Canaveral) front the Atlantic. Merritt Island stretches about 46 miles north to south.",
    },
  ],

  'viera-west': [
    {
      q: 'Is Viera West, FL a good place to live?',
      a: "Viera West is the newer, faster-growing half of the Viera master-planned community, sitting west of I-95 with a family-oriented mix of established and newly built neighborhoods — its population nearly tripled between 2010 and 2020.",
    },
    {
      q: 'What schools serve Viera West?',
      a: 'Homes in Viera West are commonly zoned for Manatee Elementary, Kennedy Middle School, and Viera High School (Brevard Public Schools), though exact zoning can vary by neighborhood. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'Are there HOA or CDD fees in Viera West?',
      a: 'As in Viera, nearly every home in Viera West belongs to an HOA, and many neighborhoods also fall within the Viera West Community Development District (CDD), a separate fee funding roads, parks, and other infrastructure. Current listings show HOA fees alone ranging from roughly $1,225/quarter up to $4,900/year. Always confirm both fees on the specific listing.',
    },
    {
      q: 'What flood zones are in Viera West?',
      a: "Viera West sits inland, well away from the coast, so most of the community falls into FEMA's lower-risk X flood zone rather than the AE/VE zones common on the barrier islands. Look up any address on FEMA's Flood Map Service Center, or ask us and we can pull it for a listing you're interested in.",
    },
    {
      q: 'Is Viera West a new community?',
      a: "Yes, relatively — Viera West's population nearly tripled from 6,641 residents in 2010 to 16,688 in 2020 as new phases of the master plan built out west of I-95. It's a family-oriented area, with about 64% married-couple households and nearly a third with kids under 18.",
    },
  ],
};

// --- Neighborhood-level "About" content (2026-09-24, per Ryan, following ---
// the SEO audit's recommendation to build real content for the
// higher-inventory neighborhoods rather than leaving every neighborhood
// page's body copy generic/templated — see the backend's
// buildNeighborhoodSeo, whose introCopy is the same boilerplate sentence
// for every neighborhood and isn't even rendered on the frontend today).
// Piloting with Adelaide only (11 active listings, the audit's top
// candidate alongside Harbor Island Beach Club); more neighborhoods added
// here one at a time as Ryan sends source material for each — see
// app/neighborhoods/[slug]/page.js, which renders this content below the
// listings grid via the same GuideSection pattern as CITY_AREA_GUIDE_
// CONTENT above, per Ryan's "Do it how you did it on the city pages."
//
// Adelaide sourcing (2026-09-24): community/builder facts (acreage, the
// four sections, amenities, builder names, price framing) from three
// pages Ryan sent — adelaideinviera.com (community's own site, including
// its /amenities/ page), arhomes.com's Rosewood Homes/Adelaide listing,
// and carpenterkessel.com's Adelaide development page. Schools and HOA
// figures instead come from live MLS data on Adelaide's own active
// listings (checked 2026-09-24, matching this file's existing "pull from
// real listings" standard for every other schools/HOA figure in this
// file) rather than the marketing sites, which didn't specify either:
// of 11 active listings with school data, 9 of 10 with an elementary
// school listed show Manatee Elementary, all 10 with a high school listed
// show Viera High, and middle school splits Kennedy (6) vs. Viera Middle
// School (2) — Manatee/Kennedy/Viera High is the dominant zoning, called
// out as such below rather than as a certainty. HOA fees cluster tightly
// at $1,225/quarter ($4,900/year) across 9 of 11 listings, with two
// billed annually at $4,900–$5,300 (the same $1,225/quarter rate,
// annualized) — so despite Adelaide having four differently-built
// sections, one HOA figure reasonably covers nearly all of them. Price
// range ($2.35M–$5.5M) and square footage (3,550–5,499 sq ft) pulled from
// the same live listings, discarding one obvious data-quality outlier
// ($12,500 — a per-sqft or rental figure miscategorized as price, not a
// real sale price for a custom home here); this range also matches what
// carpenterkessel.com's own page cites independently, which corroborates
// it. No flood-zone section — Adelaide is an inland, lake-centered
// community, not a barrier-island/coastal one, so the flood-zone framing
// every coastal city guide above uses doesn't apply here; GuideSection
// already renders nothing when a field is left out.
export const NEIGHBORHOOD_AREA_GUIDE_CONTENT = {
  // Tortoise Island sourcing (2026-09-24): community/amenity facts from
  // three of the four pages Ryan sent — carpenterkessel.com's development
  // page and both pages from the community's own neighborhood-association
  // site (tortoiseislandsouthpatrickshoresneighborhood.org, its homepage
  // and a "living in Tortoise Island" post). The fourth link,
  // maxliferealty.com/tortoise-island, turned out to describe a different,
  // unrelated community also named "Tortoise Island" — a private
  // peninsula development in Sebastian, Indian River County (~40 min
  // south of Melbourne, per that page itself), not the Brevard County
  // community in South Patrick Shores/Satellite Beach every other source
  // (and this site's own TORTOISE_ISLAND_SUBDIVISION_NAMES/backend
  // neighborhood row) describes — excluded entirely rather than risk
  // blending two different places' facts. Schools/HOA/price/sqft/lot size
  // instead come from live MLS data on Tortoise Island's own 11 active
  // listings (checked 2026-09-24, matched via
  // TORTOISE_ISLAND_SUBDIVISION_NAMES above rather than neighborhood_id —
  // see that constant's own comment for why), same standard as every
  // other entry in this file: all 11 are clean (no data-quality
  // artifacts), built 1979–2002 (a built-out, established community, not
  // active new construction — same reasoning as Summer Lakes below, hence
  // the homesitesTitle override), 9 of 11 Riverfront. Schools are
  // unanimous across all 11 listings (Sea Park Elementary, DeLaura Middle
  // School, Satellite High School) — notably different from the
  // association site's own claimed "Surfside Elementary," so the MLS data
  // is used here rather than the marketing claim, consistent with this
  // file's standing "MLS over marketing site" rule for schools. HOA fees
  // are billed monthly, $338–$570 across the 11 listings, most commonly
  // $380 (5 of 11). Price ($899K–$2.375M) and sqft (2,317–6,664) both
  // pulled from the same 11 listings.
  'tortoise-island': {
    intro:
      'Tortoise Island is a 24-hour guard-gated, waterfront community in South Patrick Shores, accessed through a single entry off Tortoise Drive near the Pineda Causeway and I-95. Built out mostly between the late 1970s and early 2000s across roughly 300 homes, it sits along deep-water canals and the Banana/Indian River, with most homesites offering direct water access.',
    amenities:
      'A single guarded entry point and round-the-clock security give Tortoise Island a private, resort-like feel. The Tortoise Island Recreation Center anchors the community with a pool, fitness center, tennis and pickleball courts, and a clubhouse available for events, plus walking paths and native habitat preserved for the community’s namesake gopher tortoises. Most homes have private docks with direct boating access to the Banana River, Indian River Lagoon, and Intracoastal Waterway.',
    homesitesTitle: 'Homes & Estates',
    homesites:
      'Tortoise Island is a built-out, established community rather than new construction — homes here date mostly from the late 1970s to early 2000s on homesites averaging roughly a third to nearly a full acre. Based on current MLS listings, 9 of 11 active homes are riverfront with private dock access, and prices range $899,000–$2.375 million across roughly 2,300–6,700 square feet.',
    schools:
      'Based on current MLS listings for Tortoise Island, every active listing is zoned for Sea Park Elementary, DeLaura Middle School, and Satellite High School (Brevard Public Schools) — unanimous across all 11 homes. School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'HOA fees in Tortoise Island are billed monthly and run $338–$570 based on current MLS listings, most commonly around $380/month. Always confirm the exact fee on the specific listing you’re considering.',
  },

  // Summer Lakes sourcing (2026-09-24): community/amenity facts from four
  // pages Ryan sent — carpenterkessel.com and teamandonia.com's Summer
  // Lakes development pages, deroythornton.com's development page, and
  // hoabulletinboard.com's HOA listing page for "SLVWFL" (Summer Lakes at
  // Viera West). The three real-estate sites broadly agree (guard-gated,
  // ~80-acre central lake, nearly acre-sized lots, custom-built estate
  // homes) but none names a specific builder — carpenterkessel/
  // deroythornton both use vague framing ("regional builders," "Brevard
  // County's leading luxury builders") rather than naming names, and the
  // HOA bulletin board page didn't have the fee amount posted either
  // (just governance/activities generalities), so schools/HOA/price/sqft/
  // lot size all come from live MLS data on Summer Lakes' own listings
  // instead (checked 2026-09-24, same standard as every other entry in
  // this file, matched via SUMMER_LAKES_SUBDIVISION_NAMES above rather
  // than neighborhood_id — see that constant's own comment): all 4 active
  // listings are clean (no rental-mislabeled or bad-sqft artifacts this
  // time) and, notably, all 4 show yearBuilt 2006–2007 — meaning Summer
  // Lakes, despite the marketing pages' "custom-built estate homes"
  // language, is actually a built-out, established community rather than
  // an active new-construction site today (no current homesites or
  // builder to list), which is why homesitesTitle below overrides to
  // 'Homes & Estates' rather than the default 'Homesites & Builders'
  // (same reasoning as Harbor Island Beach Club/Suntree/Aquarina).
  // Schools split Manatee Elementary (3 of 4) vs. Viera Elementary (1 of
  // 4) and Kennedy Middle School (2 of 4) vs. Viera Middle School (2 of
  // 4), with Viera High School unanimous (4 of 4). HOA fees are billed
  // semi-annually at $1,125 on 3 of 4 listings and $1,175 on the fourth
  // (roughly $2,250–$2,350/year). Price ($1.325M–$2.4999M), sqft
  // (3,223–8,987), and lot size (0.73–0.88 acres) all pulled from the
  // same 4 listings — the lot-size range corroborates teamandonia.com's
  // "nearly acre-sized homesites" description independently.
  'summer-lakes': {
    intro:
      'Summer Lakes is a guard-gated, lakefront community in central Viera, built around an approximately 80-acre central lake crossed by a pedestrian trestle bridge and laced with walking and jogging paths. Built out mainly in 2006–2007, its homesites run nearly a full acre — some of the most spacious, mature lots of any gated community in Viera.',
    amenities:
      'A guard-gated entrance and a full-time homeowners association maintain the community’s common areas, wide sidewalks, and jogging paths. The centerpiece lake supports kayaking, paddle boating, and sailing, and many homesites back directly onto the water with private docks. Summer Lakes sits minutes from The Avenue Viera’s shopping and dining, Duran Golf Club, and Viera Hospital.',
    homesitesTitle: 'Homes & Estates',
    homesites:
      'Summer Lakes is a built-out estate-home community rather than an active new-construction site — homes here date mainly from 2006–2007 on nearly acre-sized lots (roughly 0.7–0.9 acres among current listings), many with private docks, saltwater pools, and outdoor summer kitchens. Based on current MLS listings, homes range $1.325 million–$2.5 million and 3,200–9,000 square feet.',
    schools:
      'Based on current MLS listings for Summer Lakes, homes split between Manatee Elementary and Viera Elementary, and between Kennedy Middle School and Viera Middle School, with Viera High School unanimous across every listing. School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'HOA fees in Summer Lakes are billed semi-annually and run $1,125–$1,175 per installment (roughly $2,250–$2,350 per year) based on current MLS listings. Always confirm the exact fee on the specific listing you’re considering.',
  },

  // Aquarina sourcing (2026-09-24): community/golf-course/amenity facts
  // from four pages Ryan sent — aquarinacc.com, aquarinacountryclub.com,
  // and aquarinabeachandcountryclub.com (three separate sites covering
  // the community/club/real estate side) plus a TripAdvisor page for the
  // golf course itself. Unlike every other neighborhood built out so far,
  // Aquarina had only 1 active MLS listing as of this writing (the audit
  // flagged it as the thinnest of the candidates considered, and it's
  // still just 1 today) — Ryan asked for it built anyway, so this leans
  // more heavily on the substantial, specific community/club facts above
  // (course design, membership structure, governance) rather than MLS
  // patterns, and is honest in a few places below about that thin
  // inventory rather than papering over it with invented "current
  // listings" framing the way Adelaide/Aripeka/HIBC/Suntree's entries
  // legitimately can. The one listing itself (an $850,000, 2,216 sq ft
  // oceanfront-area condo, $1,596/month HOA, no school fields populated)
  // is cited as exactly that — one data point, not a pattern. Schools
  // instead lean on Melbourne Beach's own established zoning (Gemini
  // Elementary/Hoover Middle/Melbourne High, from CITY_AREA_GUIDE_CONTENT
  // above) since Aquarina sits within Melbourne Beach and that city's Area
  // Guide already lists Aquarina as one of its neighborhoods — framed as
  // "typical for the area" rather than MLS-confirmed for Aquarina
  // specifically, since the one listing here has no school data attached.
  // Sets homesitesTitle: 'Homes, Condos & Villas' (see
  // app/neighborhoods/[slug]/page.js), same reasoning as Harbor Island
  // Beach Club/Suntree — no single builder or homesite inventory here
  // either.
  aquarina: {
    intro:
      'Aquarina is a gated, oceanfront-to-riverfront community on the barrier island north of Sebastian Inlet, spanning both sides of A1A within the Archie Carr National Wildlife Refuge — one of the few Brevard communities with direct ocean and river access inside one gated footprint. It’s built out as 18 distinct neighborhoods, from oceanfront condos and riverfront single-family homes to villas and townhomes, centered on Aquarina Golf & Country Club.',
    amenities:
      'The centerpiece is an 18-hole, par-62 championship golf course (Audubon Certified) that winds from the Atlantic dunes through oak and sabal palm groves and mangrove marshes past 11 lakes, plus six clay tennis courts, a private Beach Club with direct ocean access, a marina with Intracoastal and river access, a fishing dock and boat launch, a fitness center, a community center and library, and the on-site Aqua Bar & Grill restaurant. Golf and tennis are open to both residents and the public.',
    homesitesTitle: 'Homes, Condos & Villas',
    homesites:
      'Aquarina’s 18 neighborhoods span a wide range of property types — oceanfront condos, riverfront single-family homes, villas, and townhomes — so pricing varies widely by neighborhood and waterfront exposure rather than following one typical range. Active inventory here is limited at any given time: the one current MLS listing is an oceanfront-area condo at $850,000 (2,216 sq ft).',
    schools:
      'Aquarina sits within Melbourne Beach, where most addresses are zoned for Gemini Elementary, Hoover Middle School, and Melbourne High School (Brevard Public Schools) — though Aquarina’s own current MLS listing doesn’t have school data attached to confirm this address by address. School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'HOA structure varies significantly across Aquarina’s 18 neighborhoods — oceanfront condos, riverfront homes, and villas each carry their own association dues on top of the Aquarina Community Services Association’s master fee. The one current MLS listing shows $1,596/month for an oceanfront-area condo, which isn’t necessarily representative of every neighborhood here. Always confirm the exact fee, and what it covers, on the specific listing you’re considering.',
  },

  // Suntree sourcing (2026-09-24): background facts (history, sub-
  // neighborhoods, golf, trail network) from five pages Ryan sent —
  // carpenterkessel.com and homes.com's Suntree guides, Suntree's own
  // neighborhood-association site (suntreemelbourneneighborhood.org, both
  // its homepage and a "neighbor's guide" post), and livingspacecoast.com.
  // Deliberately excludes Baytree, even though one source's "Major
  // Neighborhoods" section covered it alongside Suntree — the backend's
  // own `neighborhoods` table treats Baytree as a separate, distinct
  // community from Suntree, not a sub-part of it, so folding it in here
  // would misrepresent what this page is actually about. Schools/HOA/
  // price/sqft instead come from live MLS data on Suntree's own 8 active
  // listings (checked 2026-09-24, same standard as every other entry
  // here): after discarding 4 listings that are clearly rentals
  // mislabeled as Condo sales (three $1,900–$2,250 "Condo" listings at
  // Cypress Cove, plus one $3,050 "Home" — the same kind of data-quality
  // artifact lib/api.js's getListings already filters out of the site's
  // own listing grids), 4 real for-sale homes remain: $290,000–$670,000,
  // 1,534–2,382 sq ft, across four different named sub-subdivisions
  // (Suntree Woods, Suntree PUD Stage 4, Lake Pointe, Holiday Springs) —
  // itself good evidence for the "many distinct sub-neighborhoods" framing
  // every source describes. Schools split Suntree Elementary (6 of 8,
  // with Quest and Viera Elementary each appearing once — matches two
  // sources naming Quest as a nearby option), DeLaura Middle (6 of 8), and
  // Viera High (unanimous, 8 of 8). HOA fees ranged $257–$1,260/year
  // equivalent across the 4 listings with a fee, consistent with sources
  // describing one master association plus separate per-subdivision dues.
  // Sets homesitesTitle: 'Homes, Condos & Communities' (see
  // app/neighborhoods/[slug]/page.js) — like Harbor Island Beach Club,
  // "Homesites & Builders" doesn't fit a decades-old, multi-subdivision
  // community with no single builder or homesite inventory.
  suntree: {
    intro:
      'Suntree is a large, established master-planned community in unincorporated Melbourne, built out mostly between the 1970s and 2000s (median year built around 1994) along the North Wickham Road corridor between Melbourne and Viera. With roughly 6,470 homes spread across dozens of named sub-neighborhoods — from golf-course estates to maintenance-free villas and condos — it’s more mature and varied than Brevard’s newer master-planned communities, with larger lots and a mature tree canopy.',
    amenities:
      'Suntree Country Club anchors the community with 36 holes of championship golf designed by Robert Trent Jones Jr. and Arnold Palmer, plus tennis and pickleball courts. A network of more than 45 miles of interconnected lakes, parks, and walking trails runs throughout, including Rotary Park at Suntree (trails, a playground, a dog park, and a butterfly garden) and the Brevard Zoo Linear Park Trail. Wickham Road’s shopping corridor — Publix, Target, and dozens of restaurants — sits within the community.',
    homesitesTitle: 'Homes, Condos & Communities',
    homesites:
      'Suntree isn’t one builder or one subdivision — it’s a collection of many distinct sub-neighborhoods (Suntree Woods, Holiday Springs, Lake Pointe, the golf-course Enclaves, and Cypress Cove’s condos among them), each with its own architecture and price point. Based on current MLS listings, single-family homes have sold in the $290,000–$670,000 range (roughly 1,500–2,400 sq ft), with condos and villas typically priced lower and golf-course estates running well above $1 million.',
    schools:
      'Based on current MLS records for Suntree listings, most homes are zoned for Suntree Elementary (Quest Elementary and Viera Elementary also serve parts of the community) and DeLaura Middle School, with Viera High School unanimous across every listing checked. School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'Suntree has one master association plus a separate HOA for each of its many sub-neighborhoods, so fees vary significantly by address — based on current MLS listings, roughly $250 to $1,250 per year depending on the specific sub-neighborhood and what it covers. Always confirm the exact fee on the specific listing you’re considering.',
  },

  // Harbor Island Beach Club sourcing (2026-09-24): community/developer
  // facts (unit mix, amenities, marina, pricing history) from five pages
  // Ryan sent — harborislandbeachclub.com (the community's own site),
  // carpenterkessel.com and homesbyvillatel.com's development pages, and
  // two vacation-rental sites (happypalmstays.com, stayorlando.com) whose
  // listings independently corroborate the amenities and unit types.
  // Schools/HOA/price/sqft instead come from live MLS data on HIBC's own
  // 14 active listings (checked 2026-09-24, same standard as every other
  // entry here): all 14 are zoned for Gemini Elementary, Hoover Middle
  // School, and Melbourne High — unanimous, and notably the same schools
  // Melbourne Beach's own Area Guide cites, which corroborates treating
  // HIBC as a Melbourne Beach community here despite its backend `city`
  // field reading Indian Harbour Beach (see this file's other HIBC
  // comments for that established precedent). Of the 14 listings, 5 are
  // single-family homes ($879K–$2.75M, 2,519–4,683 sq ft) and 9 are
  // condos ($690K–$1.199M, 1,652–2,161 sq ft after discarding one
  // listing with an obviously bad sqft value) — both cited below rather
  // than merged, since they're genuinely different products. HOA fees
  // span a wide $296–$1,008/month range (one listing bills $1,926/
  // quarter, the same rate as the $642.50/month entries, just annualized
  // differently) — given as a range rather than one figure, since it
  // varies by building and unit type here more than at Adelaide or
  // Aripeka. Unit-mix totals (54 homes + 4 oceanfront villas + 40
  // riverfront condos + 48 ocean-view condos = 146) come straight from
  // harborislandbeachclub.com/homesbyvillatel.com and cross-add correctly,
  // so used as-is. Sets homesitesTitle: 'Homes & Condos' (see
  // app/neighborhoods/[slug]/page.js) since "Homesites & Builders" —
  // this file's default title, written for custom-build communities like
  // Adelaide/Aripeka — doesn't fit a developer-built mix of product
  // types the way it does there.
  'harbor-island-beach-club': {
    intro:
      'Harbor Island Beach Club is a gated, 146-unit community on the barrier island just south of Melbourne Beach, between the Indian River and the Atlantic Ocean. Developed by Phoenix Park Development, it mixes 54 single-family homes, 4 oceanfront villas, and 88 riverfront and ocean-view condominiums, giving buyers a choice between a home, a villa, or maintenance-free condo living inside the same gated community.',
    amenities:
      'Residents get private beach access on the Atlantic and riverfront privileges on the Indian River, plus a resort-style pool and spa, shaded cabanas, and a private marina with 42 boat slips and direct Intracoastal Waterway access. The community is golf-cart and pet friendly, with bike paths running along A1A.',
    homesitesTitle: 'Homes & Condos',
    homesites:
      'Harbor Island Beach Club offers three ways to live in the community: Lennar-built single-family homes (three floorplans, roughly 3,165–4,076 square feet), 4 oceanfront villas, and 88 riverfront or ocean-view condos. Based on current MLS listings, single-family homes have sold in the $879,000–$2.75 million range (about 2,500–4,700 sq ft), and condos have run $690,000–$1.2 million (about 1,650–2,150 sq ft).',
    schools:
      'Based on current MLS records for Harbor Island Beach Club listings, every home and condo here is zoned for Gemini Elementary, Hoover Middle School, and Melbourne High School (Brevard Public Schools) — the same schools that serve Melbourne Beach proper. School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'HOA fees vary by building and unit type in Harbor Island Beach Club, from roughly $300/month on smaller condos up to around $1,000/month on larger units and single-family homes, based on current MLS listings. Always confirm the exact fee on the specific listing you’re considering.',
  },

  // Aripeka sourcing (2026-09-24): community/builder facts from six pages
  // Ryan sent — viera.com's own Aripeka page, and a page from each of the
  // 4 builders who build there (buildingalifestyle.com/LifeStyle Homes,
  // cdshomebuilders.com/CDS Builders, stanleyhomesinc.com/Stanley Homes,
  // joyal-homes.com/Joyal Homes), plus carpenterkessel.com's Aripeka
  // development page. Schools/HOA/price/sqft instead come from live MLS
  // data on Aripeka's own listings (checked 2026-09-24, same standard as
  // every other neighborhood/city entry in this file): of 8 active
  // listings, all 6 with an elementary school listed show Viera
  // Elementary and all 8 with a high school listed show Viera High —
  // both unanimous; middle school leans Viera Middle School over DeLaura
  // Middle School. HOA fees are billed semi-annually at $750
  // (~$1,500/year) on 6 of 8 listings. Aripeka's 8 active listings split
  // cleanly into 2 completed homes ($1.38M–$1.55M, 4,093–4,511 sq ft) and
  // 6 vacant homesites ($150K–$255K, roughly a quarter- to half-acre) —
  // both cited below, since Aripeka (unlike Adelaide) is one of the few
  // neighborhood pages that includes Land/homesites as a real property
  // type (see ARIPEKA_PROPERTY_TYPE_OPTIONS above). Builder-quoted
  // pricing/sqft ($1.2M+ starting, ~2,400–5,400 sq ft across builders)
  // is broader than what's active in the MLS right now, which makes
  // sense — most floor plans simply don't have a current listing at any
  // given moment — so both figures are given, framed as builder plans
  // vs. current listings respectively, rather than merged into one range.
  aripeka: {
    intro:
      'Aripeka is a roughly 400-acre gated community on the south side of Viera, built on former hunting land and laid out around preserving its mature oak, palm, and pine trees rather than clearing them. About 250 lots of varying sizes follow the natural terrain, giving it a wooded, old-Florida feel that stands apart from Viera’s newer, more manicured subdivisions.',
    amenities:
      'Aripeka is gated, with nature trails running throughout the community, pocket parks, and several lakes and ponds. Its centerpiece is a private family clubhouse with a catering kitchen and indoor and outdoor gathering spaces, along with a park built around the community’s oldest live oaks.',
    homesites:
      'Aripeka is a custom-build community with four builders: CDS Builders (Live Oak model), Joyal Homes (Sandhill Key model), LifeStyle Homes (Key Largo model), and Stanley Homes (Emerald model). Builder-quoted pricing starts around $1.2 million, with floor plans ranging from roughly 2,400 to over 5,000 square feet depending on the builder and model. Based on current MLS listings, completed homes have sold in the $1.38 million–$1.55 million range (around 4,100–4,500 sq ft), and available vacant homesites have run $150,000–$255,000 for lots between roughly a quarter-acre and half an acre.',
    schools:
      'Based on current MLS records for Aripeka listings, homes are zoned for Viera Elementary and Viera High School (Brevard Public Schools), with middle school most commonly Viera Middle School (DeLaura Middle School also serves part of the community). School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'HOA fees in Aripeka are typically billed twice a year at around $750 per installment (roughly $1,500/year) based on current MLS listings. Always confirm the exact fee on the specific listing you’re considering.',
  },

  adelaide: {
    intro:
      'Adelaide is a 460-acre gated, custom-home community in northern Viera, built around Lake Adelaide and a 25-acre water-to-wetlands preserve. One of Brevard County’s higher-end new-construction communities, it’s made up of four distinct sections — The Reserve, The Preserve, The Lakes, and The Park — with homesites from about half an acre to over an acre, more than a third of the community set aside as water or preservation area.',
    amenities:
      'A staffed guard gate controls entry. Residents share a 5-acre park, a 120-acre central recreational lake with a dock and boardwalk for paddle sports, tennis courts, a basketball half-court, a jogging trail system, a community pavilion, and a playground. Because so much of Adelaide is water or preserved wetlands, most homesites get a water or preserve view along with their privacy.',
    homesites:
      'Adelaide is custom-build only — there’s no production-builder tract here. AR Homes (Rosewood Homes, Inc.), Christopher Burton Luxury Homes, and Elan Builders are the community’s recognized builders. More than 120 homesites are spread across the four sections: The Reserve’s 18 gated residences, The Preserve around the wetlands, The Lakes on or near the main lake, and The Park’s 24 more recently released sites. Based on current MLS listings, completed and under-construction homes run roughly 3,550–5,500 square feet and $2.35 million–$5.5 million.',
    schools:
      'Based on current MLS records for Adelaide listings, most homes are zoned for Manatee Elementary and Viera High School (Brevard Public Schools), with middle school split between Kennedy Middle School and Viera Middle School depending on the address. School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'HOA fees in Adelaide are typically billed quarterly and run around $1,225/quarter (roughly $4,900/year) based on current MLS listings, fairly consistent across the community’s four sections. Always confirm the exact fee on the specific listing you’re considering.',
  },
};

// Same pilot as NEIGHBORHOOD_AREA_GUIDE_CONTENT directly above (2026-09-24,
// per Ryan) — rendered via the same <Faq> component as CITY_LISTINGS_FAQ,
// below the listings grid on the neighborhood page. See that constant's
// own sourcing note for where each Adelaide fact came from.
export const NEIGHBORHOOD_LISTINGS_FAQ = {
  'tortoise-island': [
    {
      q: 'What kind of community is Tortoise Island in South Patrick Shores, FL?',
      a: 'Tortoise Island is a 24-hour guard-gated, waterfront community accessed through a single entry off Tortoise Drive near the Pineda Causeway. It’s built out across roughly 300 homes dating mostly from the late 1970s to early 2000s, along deep-water canals and the Banana/Indian River.',
    },
    {
      q: 'Is Tortoise Island waterfront?',
      a: 'Most homes have direct water access — based on current MLS listings, 9 of 11 active homes are riverfront with private docks, offering boating access to the Banana River, Indian River Lagoon, and Intracoastal Waterway.',
    },
    {
      q: 'What amenities does Tortoise Island have?',
      a: 'The Tortoise Island Recreation Center offers a pool, fitness center, tennis and pickleball courts, and a clubhouse for events, plus walking paths and preserved native habitat for the community’s namesake gopher tortoises. A single guarded entry provides round-the-clock security.',
    },
    {
      q: 'What schools serve Tortoise Island?',
      a: 'Based on current MLS listings, every active Tortoise Island listing is zoned for Sea Park Elementary, DeLaura Middle School, and Satellite High School — unanimous across all 11 homes. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'What is the HOA fee in Tortoise Island?',
      a: 'HOA fees are billed monthly and run $338–$570 based on current MLS listings, most commonly around $380/month. Always confirm the exact fee on the specific listing you’re considering.',
    },
  ],

  'summer-lakes': [
    {
      q: 'What kind of community is Summer Lakes in Viera, FL?',
      a: 'Summer Lakes is a guard-gated, lakefront community in central Viera built around an approximately 80-acre central lake. Homes were built mainly in 2006–2007 on nearly acre-sized lots, connected by walking paths and a pedestrian trestle bridge across the lake.',
    },
    {
      q: 'Is Summer Lakes a new-construction community?',
      a: 'No — Summer Lakes is built out, with homes dating mainly from 2006–2007. Rather than new construction, buyers here are purchasing an established estate home on a mature, nearly acre-sized lot.',
    },
    {
      q: 'What amenities does Summer Lakes have?',
      a: 'A guard-gated entrance, wide sidewalks and jogging paths, and a central lake used for kayaking, paddle boating, and sailing, crossed by a pedestrian trestle bridge. Many homesites include private docks. Summer Lakes is also close to The Avenue Viera and Duran Golf Club.',
    },
    {
      q: 'What schools serve Summer Lakes?',
      a: 'Based on current MLS listings, Summer Lakes homes split between Manatee Elementary and Viera Elementary, and between Kennedy Middle School and Viera Middle School, with Viera High School unanimous. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'What is the HOA fee in Summer Lakes?',
      a: 'HOA fees are billed semi-annually and run $1,125–$1,175 per installment (roughly $2,250–$2,350/year) based on current MLS listings. Always confirm the exact fee on the specific listing you’re considering.',
    },
  ],

  aquarina: [
    {
      q: 'What kind of community is Aquarina in Melbourne Beach, FL?',
      a: 'Aquarina is a gated, oceanfront-to-riverfront community on the barrier island north of Sebastian Inlet, within the Archie Carr National Wildlife Refuge. It’s built out as 18 distinct neighborhoods — oceanfront condos, riverfront homes, villas, and townhomes — centered on Aquarina Golf & Country Club.',
    },
    {
      q: 'Is Aquarina a golf community?',
      a: 'Yes — Aquarina Golf & Country Club is an 18-hole, par-62, Audubon Certified course that winds from the Atlantic dunes to the Indian River past 11 lakes. It’s open to both residents and the public, along with six clay tennis courts.',
    },
    {
      q: 'What amenities does Aquarina have?',
      a: 'A private Beach Club with direct ocean access, a marina with Intracoastal and river access, a fishing dock and boat launch, a fitness center, a community center and library, and the on-site Aqua Bar & Grill restaurant, in addition to the golf course and tennis courts.',
    },
    {
      q: 'What schools serve Aquarina?',
      a: 'Aquarina sits within Melbourne Beach, where most addresses are zoned for Gemini Elementary, Hoover Middle School, and Melbourne High School. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'How much inventory is typically available in Aquarina?',
      a: 'Aquarina is a smaller, largely built-out community, so active listings are limited at any given time — often just one or two across its 18 neighborhoods. Contact us to be notified as soon as something new comes on the market.',
    },
  ],

  suntree: [
    {
      q: 'What kind of community is Suntree in Melbourne, FL?',
      a: 'Suntree is a large, established master-planned community built out mostly between the 1970s and 2000s along the North Wickham Road corridor between Melbourne and Viera. It has roughly 6,470 homes across dozens of named sub-neighborhoods, from golf-course estates to villas and condos.',
    },
    {
      q: 'Is Suntree a golf community?',
      a: 'Suntree Country Club has 36 holes of championship golf designed by Robert Trent Jones Jr. and Arnold Palmer, plus tennis and pickleball. Golf-course-adjacent homes are just one part of Suntree, though — the community also includes villas, condos, and non-golf single-family neighborhoods.',
    },
    {
      q: 'What schools serve Suntree?',
      a: 'Based on current MLS listings, most Suntree homes are zoned for Suntree Elementary (Quest and Viera Elementary also serve parts of the community) and DeLaura Middle School, with Viera High School unanimous. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'What is the HOA fee in Suntree?',
      a: 'Suntree has one master association plus a separate HOA for each sub-neighborhood, so fees vary by address — roughly $250 to $1,250 per year based on current MLS listings. Always confirm the exact fee on the listing you’re considering.',
    },
    {
      q: 'How old are homes in Suntree?',
      a: 'Suntree was built out mostly between the 1970s and 2000s, with a median year built around 1994 — older and more established than newer master-planned communities like Viera, with larger lots and mature trees.',
    },
  ],

  'harbor-island-beach-club': [
    {
      q: 'What kind of community is Harbor Island Beach Club?',
      a: 'Harbor Island Beach Club is a gated, 146-unit community on the barrier island just south of Melbourne Beach, between the Indian River and the Atlantic. It mixes 54 single-family homes, 4 oceanfront villas, and 88 riverfront and ocean-view condominiums, developed by Phoenix Park Development.',
    },
    {
      q: 'What’s the difference between the homes, villas, and condos in Harbor Island Beach Club?',
      a: 'The single-family homes are Lennar-built (three floorplans, roughly 3,165–4,076 sq ft); the 4 oceanfront villas are custom units directly on the Atlantic; and the 88 condos are riverfront or ocean-view. Based on current MLS listings, homes have sold $879,000–$2.75 million and condos $690,000–$1.2 million.',
    },
    {
      q: 'What schools serve Harbor Island Beach Club?',
      a: 'Based on current MLS listings, every home and condo in Harbor Island Beach Club is zoned for Gemini Elementary, Hoover Middle School, and Melbourne High School — the same schools that serve Melbourne Beach proper. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'What is the HOA fee in Harbor Island Beach Club?',
      a: 'HOA fees vary by building and unit type, from roughly $300/month on smaller condos up to around $1,000/month on larger units and single-family homes, based on current MLS listings. Always confirm the exact fee on the listing you’re considering.',
    },
    {
      q: 'What amenities does Harbor Island Beach Club have?',
      a: 'Private beach access on the Atlantic, riverfront privileges on the Indian River, a resort-style pool and spa, shaded cabanas, and a private marina with 42 boat slips and direct Intracoastal Waterway access. The community is also golf-cart and pet friendly.',
    },
  ],

  aripeka: [
    {
      q: 'What kind of community is Aripeka in Viera, FL?',
      a: 'Aripeka is a roughly 400-acre gated community on the south side of Viera, built on former hunting land and laid out to preserve its mature oak, palm, and pine trees. About 250 lots of varying sizes follow the natural terrain, giving it a wooded, old-Florida feel.',
    },
    {
      q: 'Who builds in Aripeka?',
      a: 'Aripeka is a custom-build community with four builders: CDS Builders (Live Oak model), Joyal Homes (Sandhill Key model), LifeStyle Homes (Key Largo model), and Stanley Homes (Emerald model). Builder-quoted pricing starts around $1.2 million.',
    },
    {
      q: 'Can I buy a vacant lot in Aripeka?',
      a: 'Yes — Aripeka includes both completed custom homes and available vacant homesites. Current MLS listings show lots priced $150,000–$255,000, generally a quarter-acre to half an acre, ready to build with one of the community’s four builders.',
    },
    {
      q: 'What schools serve Aripeka?',
      a: 'Based on current MLS listings, Aripeka homes are zoned for Viera Elementary and Viera High School, with middle school most commonly Viera Middle School (DeLaura Middle School also serves part of the community). Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'What is the HOA fee in Aripeka?',
      a: 'HOA fees are typically billed twice a year at around $750 per installment (roughly $1,500/year) based on current MLS listings. Always confirm the exact fee on the listing you’re considering.',
    },
  ],

  adelaide: [
    {
      q: 'What kind of community is Adelaide in Viera, FL?',
      a: 'Adelaide is a 460-acre, staffed-gate community of fully custom single-family homes in northern Viera, built around Lake Adelaide and a 25-acre water-to-wetlands preserve. It’s split into four sections — The Reserve, The Preserve, The Lakes, and The Park — with homesites from about half an acre to over an acre.',
    },
    {
      q: 'Who builds in Adelaide?',
      a: 'Adelaide is custom-build only, with no production-builder tract. AR Homes (Rosewood Homes, Inc.), Christopher Burton Luxury Homes, and Elan Builders are the community’s recognized builders.',
    },
    {
      q: 'What schools serve Adelaide?',
      a: 'Based on current MLS listings, most Adelaide homes are zoned for Manatee Elementary and Viera High School, with middle school split between Kennedy Middle School and Viera Middle School by address. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'What is the HOA fee in Adelaide?',
      a: 'HOA fees run around $1,225 per quarter (roughly $4,900/year) based on current MLS listings, fairly consistent across Adelaide’s four sections. Always confirm the exact fee on the listing you’re considering.',
    },
    {
      q: 'What amenities does Adelaide have?',
      a: 'A staffed guard gate, a 5-acre park, a 120-acre central lake with a dock and boardwalk for paddle sports, tennis courts, a basketball half-court, jogging trails, a community pavilion, and a playground — plus water or preserve views on most homesites, since over a third of the community is set aside as water or wetlands.',
    },
  ],
};

// --- Viera West geographic override (2026-09-24, per Ryan) -----------------
//
// While building Viera West's Area Guide, its city listings pages
// (app/[citySlug]/[propertySlug]/page.js) turned out to be showing 0
// results — the same class of bug as Suntree and South Merritt Island
// earlier this session, just not yet noticed since Viera West's Area
// Guide didn't exist to surface it. A live data pull traced the cause:
// every Adelaide (a Viera West neighborhood) listing's MLS `city` field
// actually reads "Rockledge", never "Viera West" — so `city=viera-west`
// was never going to match anything, regardless of how much real
// inventory exists there.
//
// Ryan defined the fix geographically, the same way he defined South
// Merritt Island: "Everything west of interstate 95 is viera west...
// Interstate 95 is the cutoff" (sent with a marked-up map screenshot,
// later corroborated by homes.com's own Viera West neighborhood boundary
// map, whose polygon also runs along I-95 on the east side). Longitude
// bounding (see the backend's lngMax/lngMin in listings.controller.js)
// handles the east/west cutoff the same way SOUTH_MERRITT_ISLAND_LAT_MAX
// handles a north/south one.
//
// Threshold calibration (2026-09-24): Adelaide's own listings (confirmed
// west of I-95 by Ryan) range up to longitude -80.7427; Ashwood Lakes/
// Admiralty Lakes (Suntree-area listings confirmed EAST of I-95 per
// Ryan's prior "not west of I-95" instruction, at almost the same
// latitude — see SUNTREE_SUBDIVISION_NAMES's comment) start at
// -80.735966. -80.74 sits cleanly between the two, corroborated from both
// sides independently. latMin/latMax bound the north-south extent of the
// broader Viera area so this stays a "west of I-95, in Viera" filter
// rather than reaching into unrelated parts of the county that happen to
// sit at the same longitude.
export const VIERA_WEST_LAT_MIN = 28.15;
export const VIERA_WEST_LAT_MAX = 28.33;
export const VIERA_WEST_LNG_MAX = -80.74;

// Viera (2026-09-24, per Ryan: "Lets do Viera then instead of viera east.
// Also there will be plenty of listings that overlap Viera & Viera west
// which is fine.") — the backend city row this powers was just renamed
// back from "Viera East" to "Viera" (see the backend's migrations.js
// renameVieraBackFromEast), but the plain `city: 'viera'` filter has the
// exact same root-cause bug VIERA_WEST_LAT_MIN etc. fixed above: a live
// pull showed Viera's own listings carry MLS `city` values of "Melbourne"
// or "Rockledge", never "Viera" — so this needed the same geographic
// treatment, not just the rename.
//
// Unlike Viera West, Ryan didn't give an exact boundary for this side
// beyond the implicit complement of "west of I-95 is Viera West" — and he
// explicitly said overlap with Viera West's own listings is fine, so this
// doesn't need to be a razor-precise mirror of VIERA_WEST_LNG_MAX. It's
// calibrated instead from real listing data to keep the net roughly
// centered on the actual Viera master-planned community and out of
// clearly-unrelated areas that happen to share the same lat/lng band:
//   - lngMin -80.74 starts at the same I-95 threshold Viera West's own
//     lngMax uses (see above) — the deliberate overlap Ryan said was fine.
//   - lngMax -80.66 comes from the real longitude range of listings whose
//     address is actually zip 32940 (Viera's own postal zip) in a live
//     pull: -80.739 to -80.660. Without this cap, the query reaches clean
//     past Viera into the barrier islands (Satellite Beach, Cocoa Beach,
//     Indian Harbour Beach all showed up past roughly -80.62).
//   - latMin 28.19 / latMax 28.27 tightens VIERA_WEST_LAT_MIN/MAX's wider
//     28.15-28.33 band specifically to exclude two other real, unrelated
//     areas that overlap it in longitude: West Melbourne/Eau Gallie
//     subdivisions (Lake Crest, Greystone, Pebble Creek, Monaco Estates,
//     etc. — all zip 32934/32935, clustered at lat 28.151-28.186, just
//     south of Viera's own 32940 listings, which start at 28.186) and
//     South Merritt Island (Bridgewater, Hidden Creek, Marsh Harbor, etc.
//     — zip 32952, clustered at lat 28.273-28.324, just north of Viera's
//     32940 listings, which top out at 28.264). Both sit close enough in
//     latitude to Viera's own range that the wider Viera West band would
//     have pulled them in; tightening to 28.19-28.27 excludes them while
//     still keeping every 32940-zip listing found in the sample.
export const VIERA_LAT_MIN = 28.19;
export const VIERA_LAT_MAX = 28.27;
export const VIERA_LNG_MIN = -80.74;
export const VIERA_LNG_MAX = -80.66;

// Every city's listings pages default to a plain `{ city: slug }` filter
// — Viera and Viera West are the two exceptions, needed because neither
// city's real MLS `city` field ever actually says "Viera" or "Viera West"
// (see both constants' comments above). Used by both
// app/[citySlug]/page.js (the combined "Listings" page) and
// app/[citySlug]/[propertySlug]/page.js (Homes/Condos/Land/Oceanfront),
// including that file's buildListingCountPrefix, plus
// app/[citySlug]/area-guide/page.js's own live Market Snapshot — all four
// call sites previously queried `city: citySlug` unconditionally and got
// ~0 results back for both cities as a result.
export function cityListingsQueryParams(citySlug) {
  if (citySlug === 'viera-west') {
    return { latMin: VIERA_WEST_LAT_MIN, latMax: VIERA_WEST_LAT_MAX, lngMax: VIERA_WEST_LNG_MAX };
  }
  if (citySlug === 'viera') {
    return { latMin: VIERA_LAT_MIN, latMax: VIERA_LAT_MAX, lngMin: VIERA_LNG_MIN, lngMax: VIERA_LNG_MAX };
  }
  return { city: citySlug };
}
