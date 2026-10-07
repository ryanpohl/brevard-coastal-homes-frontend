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
// Community SEO for neighborhood pages Ryan is targeting by keyword
// (2026-10-03, per Ryan). Adelaide: "Adelaide homes for sale", "Adelaide
// Viera homes for sale", "Adelaide real estate", "Adelaide Viera real
// estate". Aripeka and Summer Lakes: the same four phrases with their own
// names. Each entry
// replaces the backend's templated page_seo title/description (which
// repeats the community name and runs past ~60 characters), adds
// "Viera" next to the name everywhere — both names are shared with other
// places (Adelaide, Australia; Aripeka, FL on the Gulf coast in Pasco/
// Hernando County; "Summer Lakes" is a common subdivision name), so tying
// them to Viera matters for search engines and AI tools — and drives the "About {name} Viera Real Estate" section and
// community structured data on app/neighborhoods/[slug]/page.js.
// Facts come from NEIGHBORHOOD_AREA_GUIDE_CONTENT / NEIGHBORHOOD_LISTINGS_FAQ.
//
// Adelaide's and Summer Lakes' backend parent city is "Viera West", but
// their own Area Guide content places them in northern/central Viera, so
// the title, description and breadcrumb all say "Viera" consistently.
//
// `homeOnly` (Aripeka, Aquarina): the page also has a lots-only
// (?propertyType=Land) or condos-only (?propertyType=Condo) view whose
// backend title targets "Aripeka Lots For Sale" / "Aquarina Condos For
// Sale" — the override applies only to the combined and Homes views.
//
// `area` / `areaPath` (default Viera, /viera): the town the community is
// tied to in its About heading and structured data. `secondaryLink` is the
// About section's second link (default: the Viera new-construction guide).
//
// `seoByType` (Harbor Island Beach Club): its own title/description per
// property-type view (?propertyType=Home / Condo), used instead of the
// backend's, which names the wrong town (see below).
//
// Harbor Island Beach Club: the backend parents it to Indian Harbour
// Beach, but it sits just south of Melbourne Beach and is zoned for
// Melbourne Beach's schools (its Area Guide entry and H1s already say
// Melbourne Beach), so its titles, schema and breadcrumb use Melbourne
// Beach — same class of seed mistake as Tortoise Island's.
//
// Aquarina (Melbourne Beach) was added the same day: "Aquarina homes for
// sale", "Aquarina Melbourne Beach homes for sale", "Aquarina real
// estate", "Aquarina Melbourne Beach real estate".
export const COMMUNITY_SEO = {
  adelaide: {
    name: 'Adelaide',
    modelTour: true,
    seo: {
      title: 'Adelaide Homes for Sale & Real Estate | Viera, FL',
      description:
        'Browse Adelaide Viera homes for sale — a 460-acre gated, custom-home community on Lake Adelaide. Adelaide real estate from AR Homes, Christopher Burton & Elan Builders.',
      keywords: [
        'Adelaide homes for sale',
        'Adelaide Viera homes for sale',
        'Adelaide real estate',
        'Adelaide Viera real estate',
        'Adelaide Viera FL',
      ],
    },
    placeDescription:
      'Adelaide is a 460-acre gated, custom-home community in northern Viera, Florida, built around Lake Adelaide and a 25-acre water-to-wetlands preserve.',
    postalCode: '32940',
    about: [
      'Adelaide is a 460-acre gated, custom-home community in northern Viera, Florida, built around Lake Adelaide and a 25-acre water-to-wetlands preserve. Adelaide homes for sale sit in four sections — The Reserve, The Preserve, The Lakes, and The Park — on homesites from about half an acre to over an acre, and more than a third of the community is set aside as water or preserve.',
      'Adelaide is custom-build only, with three recognized builders: AR Homes (Rosewood Homes, Inc.), Christopher Burton Luxury Homes, and Elan Builders. Completed and under-construction homes run roughly 3,550–5,500 square feet. Residents share a staffed guard gate, a 120-acre recreational lake with a dock and boardwalk, tennis courts, trails, a pavilion, and a playground. Most homes are zoned for Manatee Elementary and Viera High School, and HOA fees run around $1,225 per quarter.',
      'Builders show model homes in Adelaide, including AR Homes’ (Rosewood Homes) Lumina model at 3639 Lake Adelaide Place and Christopher Burton Luxury Homes’ fully furnished waterfront model, The Reserve, in Adelaide’s gated Reserve enclave.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Adelaide real estate across all three builders, tour model homes, and negotiate new construction and resale contracts in Viera.',
  },
  aripeka: {
    name: 'Aripeka',
    modelTour: true,
    homeOnly: true,
    seo: {
      title: 'Aripeka Homes for Sale & Real Estate | Viera, FL',
      description:
        'Browse Aripeka Viera homes and lots for sale — a 400-acre gated, wooded community in Viera, FL. Aripeka real estate from CDS, Joyal, LifeStyle & Stanley Homes.',
      keywords: [
        'Aripeka homes for sale',
        'Aripeka Viera homes for sale',
        'Aripeka real estate',
        'Aripeka Viera real estate',
        'Aripeka Viera FL',
      ],
    },
    placeDescription:
      'Aripeka is a roughly 400-acre gated, custom-home community on the south side of Viera, Florida, with about 250 wooded homesites laid out around its mature oak, palm, and pine trees.',
    about: [
      'Aripeka is a roughly 400-acre gated community on the south side of Viera, Florida — not to be confused with the Gulf Coast town of Aripeka, FL. Built on former hunting land, its roughly 250 Aripeka homes and homesites follow the natural terrain around mature oaks, palms, and pines, giving it a wooded, old-Florida feel unlike Viera’s more manicured subdivisions.',
      'Aripeka is a custom-build community with four builders: CDS Builders, Joyal Homes, LifeStyle Homes, and Stanley Homes. Floor plans run from roughly 2,400 to over 5,000 square feet, and vacant homesites come up for sale as well. Residents share nature trails, pocket parks, lakes and ponds, and a private, family-focused central park whose clubhouse has a catering kitchen and large indoor and outdoor gathering spaces; homes use city water and sewer, and the builders emphasize energy-efficient design. Viera released Aripeka’s Phase 5 homesites in April 2026. Homes are zoned for Viera Elementary, Viera Middle, and Viera High School, with Viera Charter School (K–8) nearby, and HOA fees run about $1,500 per year.',
      'All four builders have model homes open in Aripeka: CDS Builders at 1726 Gracewood Drive, LifeStyle Homes at 1746 Gracewood Drive (a featured home in the 2026 Space Coast Parade of Homes), Joyal Homes at 1756 Gracewood Drive, and Stanley Homes at 8350 Waxwing Circle. Thinking of touring? Contact Ryan first — when a buyer registers at a builder’s model without an agent, the builder may not allow one to represent them later.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Aripeka real estate across all four builders, find the right homesite, and negotiate new construction, resale, and lot purchases in Viera.',
  },
  'summer-lakes': {
    name: 'Summer Lakes',
    seo: {
      title: 'Summer Lakes Homes for Sale & Real Estate | Viera, FL',
      description:
        'Browse Summer Lakes Viera homes for sale — a guard-gated community on an 80-acre lake with nearly acre-sized lots and private docks. Summer Lakes real estate in Viera, FL.',
      keywords: [
        'Summer Lakes homes for sale',
        'Summer Lakes Viera homes for sale',
        'Summer Lakes real estate',
        'Summer Lakes Viera real estate',
        'Summer Lakes Viera FL',
      ],
    },
    placeDescription:
      'Summer Lakes is a guard-gated lakefront community in central Viera, Florida, built around an approximately 80-acre central lake, with estate homes on nearly acre-sized lots.',
    about: [
      'Summer Lakes is a guard-gated, lakefront community in central Viera, Florida, built around an approximately 80-acre central lake crossed by a pedestrian trestle bridge. Summer Lakes homes for sale sit on some of the largest, most mature lots of any gated community in Viera — roughly 0.7 to 0.9 acres among recent listings — and many back directly onto the water with private docks.',
      'Summer Lakes is built out rather than new construction, with estate homes dating mainly from 2006–2007. Homes run roughly 3,200–9,000 square feet, often with saltwater pools and outdoor summer kitchens. The lake supports kayaking, paddle boating, and sailing, and the community is minutes from The Avenue Viera, Duran Golf Club, and Viera Hospital. Homes are zoned for Viera High School, and HOA fees run about $2,250–$2,350 per year.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Summer Lakes real estate, from lakefront homes with private docks to estate homes on its larger lots, and negotiate resale purchases in Viera.',
    // Built out (no new construction), so link the Viera guide instead.
    secondaryLink: { href: '/viera/area-guide', label: 'explore the Viera Area Guide' },
  },
  aquarina: {
    name: 'Aquarina',
    area: 'Melbourne Beach',
    areaPath: '/melbourne-beach',
    homeOnly: true,
    seo: {
      title: 'Aquarina Homes for Sale & Real Estate | Melbourne Beach, FL',
      description:
        'Browse Aquarina Melbourne Beach homes and condos for sale — a gated ocean-to-river golf community north of Sebastian Inlet. Aquarina real estate on A1A.',
      keywords: [
        'Aquarina homes for sale',
        'Aquarina Melbourne Beach homes for sale',
        'Aquarina real estate',
        'Aquarina Melbourne Beach real estate',
        'Aquarina Melbourne Beach FL',
      ],
    },
    placeDescription:
      'Aquarina is a gated, oceanfront-to-riverfront golf community in Melbourne Beach, Florida, on the barrier island north of Sebastian Inlet within the Archie Carr National Wildlife Refuge.',
    about: [
      'Aquarina is a gated, oceanfront-to-riverfront community in Melbourne Beach, Florida, on the barrier island north of Sebastian Inlet. Spanning both sides of A1A within the Archie Carr National Wildlife Refuge, it’s one of the few Brevard communities with direct ocean and river access inside one gated footprint. Aquarina homes for sale are spread across 18 distinct neighborhoods — oceanfront condos, riverfront single-family homes, villas, and townhomes.',
      'The community centers on Aquarina Golf & Country Club’s 18-hole, par-62 Audubon Certified course (open to the public, with eleven lakes), plus six clay tennis courts, a private Beach Club with direct ocean access, a private fishing dock and boat launch on the river, a fitness center, a library, and the on-site Aqua Bar & Grill. Pricing and HOA dues vary widely by neighborhood and waterfront exposure, and active inventory is limited at any given time. Most Melbourne Beach addresses are zoned for Gemini Elementary, Hoover Middle, and Melbourne High School — confirm by address.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Aquarina real estate across its 18 neighborhoods, from oceanfront condos to riverfront homes, and negotiate purchases in Melbourne Beach.',
    secondaryLink: { href: '/melbourne-beach/area-guide', label: 'explore the Melbourne Beach Area Guide' },
  },
  'harbor-island-beach-club': {
    name: 'Harbor Island Beach Club',
    area: 'Melbourne Beach',
    areaPath: '/melbourne-beach',
    seo: {
      title: 'Harbor Island Beach Club Real Estate | Melbourne Beach, FL',
      description:
        'Browse Harbor Island Beach Club homes and condos for sale — a gated, 146-unit ocean-to-river community in Melbourne Beach, FL with a private beach and marina.',
      keywords: [
        'Harbor Island Beach Club homes for sale',
        'Harbor Island Beach Club condos for sale',
        'Harbor Island Beach Club real estate',
        'Harbor Island Beach Club Melbourne Beach',
        'Harbor Island Beach Club Melbourne Beach FL',
      ],
    },
    seoByType: {
      Home: {
        title: 'Harbor Island Beach Club Homes for Sale | Melbourne Beach, FL',
        description:
          'Browse Harbor Island Beach Club homes for sale — Lennar-built single-family homes in a gated ocean-to-river Melbourne Beach, FL community with a private marina.',
        keywords: [
          'Harbor Island Beach Club homes for sale',
          'Harbor Island Beach Club single family homes',
          'Harbor Island Beach Club real estate',
          'Harbor Island Beach Club Melbourne Beach homes',
        ],
      },
      Condo: {
        title: 'Harbor Island Beach Club Condos for Sale | Melbourne Beach, FL',
        description:
          'Browse Harbor Island Beach Club condos for sale — riverfront and ocean-view condos in a gated Melbourne Beach, FL community with a private beach and marina.',
        keywords: [
          'Harbor Island Beach Club condos for sale',
          'Harbor Island Beach Club condominiums',
          'Harbor Island Beach Club real estate',
          'Harbor Island Beach Club Melbourne Beach condos',
        ],
      },
    },
    placeDescription:
      'Harbor Island Beach Club is a gated, 146-unit community of single-family homes, oceanfront villas, and condominiums in Melbourne Beach, Florida, between the Indian River and the Atlantic Ocean.',
    about: [
      'Harbor Island Beach Club is a gated, 146-unit community on the barrier island just south of Melbourne Beach, Florida, between the Indian River and the Atlantic Ocean. Developed by Phoenix Park Development, it mixes 54 single-family homes, 4 oceanfront villas, and 88 riverfront and ocean-view condominiums — so Harbor Island Beach Club homes for sale and condos for sale share the same gated setting.',
      'Residents get private beach access on the Atlantic, riverfront privileges on the Indian River, a resort-style pool and spa, shaded cabanas, and a private marina with 42 boat slips and direct Intracoastal Waterway access. The single-family homes are Lennar-built, in three floorplans of roughly 3,165–4,076 square feet. Every home and condo here is zoned for Gemini Elementary, Hoover Middle, and Melbourne High School, and HOA fees range from about $300/month on smaller condos to about $1,000/month on larger units and homes.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Harbor Island Beach Club real estate — single-family homes, oceanfront villas, and riverfront or ocean-view condos — and negotiate purchases in Melbourne Beach.',
    secondaryLink: { href: '/melbourne-beach/area-guide', label: 'explore the Melbourne Beach Area Guide' },
  },
  // Remaining neighborhood pages (2026-10-03, per Ryan: "do the same for
  // the neighborhood pages"). Lansing Island, Tortoise Island and Suntree
  // from their NEIGHBORHOOD_AREA_GUIDE_CONTENT; Beach Woods and South
  // Merritt Island (no Area Guide yet) only from facts already documented
  // in this file (BEACH_WOODS_SUBDIVISION_NAMES / SOUTH_MERRITT_ISLAND_LAT_MAX
  // comments, the Merritt Island and Melbourne Beach city guides).
  // `aboutHeading` overrides the default "About {name} {area} Real Estate".
  'lansing-island': {
    name: 'Lansing Island',
    area: 'Indian Harbour Beach',
    areaPath: '/indian-harbour-beach',
    seo: {
      title: 'Lansing Island Homes for Sale | Indian Harbour Beach, FL',
      description:
        'Browse Lansing Island homes for sale — waterfront homes and estates on a guard-gated Indian Harbour Beach island reached by a covered drawbridge.',
      keywords: ['Lansing Island homes for sale', 'Lansing Island real estate', 'Lansing Island Indian Harbour Beach', 'Lansing Island waterfront homes', 'Lansing Island FL'],
    },
    placeDescription:
      'Lansing Island is a private, guard-gated island community in Indian Harbour Beach, Florida, reached by a single causeway and covered drawbridge, with direct water access from nearly every homesite.',
    about: [
      'Lansing Island is a private, guard-gated island community in Indian Harbour Beach, reached by a single causeway and covered drawbridge past a 24-hour manned gatehouse. Fronting the Indian River Lagoon, with the Banana River to the west and the Grand Canal to the east, nearly every Lansing Island homesite has direct water access, about a mile from the Atlantic.',
      'Lansing Island is all single-family homes — no condos or vacant lots. Homes range roughly 3,000 to over 10,000 square feet on homesites typically three-quarters of an acre to nearly a full acre. Residents share a clubhouse, tennis, pickleball and basketball courts, a resort-style pool, a fitness center, and a playground. Area sources most often cite Ocean Breeze Elementary, DeLaura Middle, and Satellite High School — confirm by address.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Lansing Island homes, from waterfront family homes to luxury estates, and negotiate purchases in Indian Harbour Beach.',
    secondaryLink: { href: '/indian-harbour-beach/area-guide', label: 'explore the Indian Harbour Beach Area Guide' },
  },
  'tortoise-island': {
    name: 'Tortoise Island',
    area: 'Satellite Beach',
    areaPath: '/satellite-beach',
    seo: {
      title: 'Tortoise Island Homes for Sale | Satellite Beach, FL',
      description:
        'Browse Tortoise Island homes for sale — a 24-hour guard-gated waterfront community in Satellite Beach with deep-water canals and private docks.',
      keywords: ['Tortoise Island homes for sale', 'Tortoise Island real estate', 'Tortoise Island Satellite Beach', 'Tortoise Island waterfront homes', 'Tortoise Island FL'],
    },
    placeDescription:
      'Tortoise Island is a 24-hour guard-gated waterfront community in South Patrick Shores, Satellite Beach, Florida, with 357 homesites on about 210 acres along deep-water canals and the Banana and Indian Rivers.',
    about: [
      'Tortoise Island is a 24-hour guard-gated waterfront community in South Patrick Shores, with a Satellite Beach address, entered through a single gate off Tortoise Drive near the Pineda Causeway. Its 357 homesites (about 340 built homes) on roughly 210 acres sit along deep-water canals and the Banana and Indian Rivers, and most Tortoise Island homes for sale have private docks with direct boating access to the Intracoastal Waterway.',
      'Tortoise Island is all single-family homes — no condos or vacant lots. Built out mostly between the late 1970s and early 2000s, homes sit on homesites of roughly a third to nearly a full acre. Homes run about 2,300–6,700 square feet, most of them riverfront. The Tortoise Island Recreation Center offers a pool, a fitness center, four tennis and four pickleball courts, a game room, a rentable clubhouse, and a free boat ramp for residents, and homes are zoned for Sea Park Elementary, DeLaura Middle, and Satellite High School.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Tortoise Island real estate, from riverfront homes with private docks to canal-front homes, and negotiate purchases in Satellite Beach.',
    secondaryLink: { href: '/satellite-beach/area-guide', label: 'explore the Satellite Beach Area Guide' },
  },
  suntree: {
    name: 'Suntree',
    area: 'Melbourne',
    areaPath: '/melbourne',
    homeOnly: true,
    aboutHeading: 'About Suntree Real Estate',
    seo: {
      title: 'Suntree Homes for Sale & Real Estate | Melbourne, FL',
      description:
        'Browse Suntree homes for sale — golf-course estates, family homes, villas, and condos in Melbourne’s established master-planned community near Viera.',
      keywords: ['Suntree homes for sale', 'Suntree FL homes for sale', 'Suntree real estate', 'Suntree Melbourne FL', 'Suntree Country Club homes'],
    },
    placeDescription:
      'Suntree is a large, established master-planned community with a Melbourne, Florida address, along North Wickham Road between Melbourne and Viera, centered on Suntree Country Club.',
    about: [
      'Suntree is a large, established master-planned community with a Melbourne address, along the North Wickham Road corridor between Melbourne and Viera. Its roughly 6,470 homes span dozens of sub-neighborhoods — Suntree Woods, Holiday Springs, Lake Pointe, the golf-course Enclaves, Cypress Cove’s condos, and more — built mostly from the 1970s to the 2000s, with larger lots and a mature tree canopy.',
      'Suntree Country Club anchors the community with 36 holes of championship golf designed by Robert Trent Jones Jr. and Arnold Palmer, and more than 45 miles of lakes, parks, and trails run throughout. Homes range from villas and condos to single-family homes and golf-course estates. Most homes are zoned for Suntree Elementary, DeLaura Middle, and Viera High School.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Suntree real estate across its many sub-neighborhoods, from golf-course estates to villas and condos, and negotiate purchases in Melbourne.',
    secondaryLink: { href: '/melbourne/area-guide', label: 'explore the Melbourne Area Guide' },
  },
  'south-merritt-island': {
    name: 'South Merritt Island',
    area: 'Merritt Island',
    areaPath: '/merritt-island',
    homeOnly: true,
    aboutHeading: 'About South Merritt Island Real Estate',
    seo: {
      title: 'South Merritt Island Homes for Sale | Merritt Island, FL',
      description:
        'Browse South Merritt Island homes for sale — the quieter, residential south end of Merritt Island, between the Indian and Banana Rivers near Cocoa Beach.',
      keywords: ['South Merritt Island homes for sale', 'South Merritt Island real estate', 'South Merritt Island FL', 'Merritt Island homes for sale', 'South Tropical Trail homes'],
    },
    placeDescription:
      'South Merritt Island is the residential south end of Merritt Island, Florida, south of Randon Lane, Crooked Mile Road, and Hilltop Lane, between the Indian River and the Banana River.',
    about: [
      'South Merritt Island is the quieter, residential south end of Merritt Island — everything south of Randon Lane, Crooked Mile Road, and Hilltop Lane, along roads like South Tropical Trail. Like the rest of the island, it sits between the Indian River and the Banana River rather than on the Atlantic, with Cocoa Beach a short drive east.',
      'South Merritt Island is unincorporated Brevard County. Riverfront and low-lying areas commonly fall in FEMA’s AE flood zone while inland areas sit in the lower-risk X zone, and most Merritt Island neighborhoods carry no HOA or a modest one — confirm the flood zone and any fees on each listing. Most Merritt Island addresses are zoned for Jefferson Middle and Merritt Island High School; confirm zoning for the specific address.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare South Merritt Island real estate, from riverfront homes to quiet residential streets, and negotiate purchases on Merritt Island.',
    secondaryLink: { href: '/merritt-island/area-guide', label: 'explore the Merritt Island Area Guide' },
  },
  'beach-woods': {
    name: 'Beach Woods',
    area: 'Melbourne Beach',
    areaPath: '/melbourne-beach',
    seo: {
      title: 'Beach Woods Condos & Townhomes for Sale | Melbourne Beach',
      description:
        'Browse Beach Woods condos and townhomes for sale — a gated river-to-ocean community in Melbourne Beach with villas, townhomes, and beachfront units.',
      keywords: ['Beach Woods condos for sale', 'Beach Woods Melbourne Beach', 'Beach Woods townhomes for sale', 'Beach Woods real estate', 'Beach Woods Melbourne Beach FL'],
    },
    placeDescription:
      'Beach Woods is a gated community in Melbourne Beach, Florida, stretching from the Indian River Lagoon to the Atlantic Ocean, with townhomes, villas, single-family homes, beachfront units, and a riverside condominium.',
    about: [
      'Beach Woods is a gated community in Melbourne Beach that stretches from the Indian River Lagoon to the Atlantic Ocean, with town homes, villas, quads, single-family residences, beachfront units, and a six-story riverside condominium.',
      'Built out in numbered phases, Beach Woods homes are listed in the MLS as condos across several subdivision names, so this page gathers every Beach Woods listing in one place. Each carries a community association fee covering exterior maintenance, insurance, and shared amenities — confirm the fee, what it covers, and the flood zone on each listing. Most Melbourne Beach addresses are zoned for Gemini Elementary, Hoover Middle, and Melbourne High School.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Beach Woods real estate, from riverside condos to beachfront units and townhomes, and negotiate purchases in Melbourne Beach.',
    secondaryLink: { href: '/melbourne-beach/area-guide', label: 'explore the Melbourne Beach Area Guide' },
  },
  // Floridana Beach (2026-10-05) — from Ryan's pasted profile and the
  // active listings he shared (mostly single-family homes built from the
  // 1950s to 2024). See MELBOURNE_BEACH_NEIGHBORHOOD_PAGES.
  'floridana-beach': {
    name: 'Floridana Beach',
    area: 'Melbourne Beach',
    areaPath: '/melbourne-beach',
    aboutHeading: 'About Floridana Beach Real Estate',
    seo: {
      title: 'Floridana Beach Homes for Sale | Melbourne Beach, FL',
      description:
        'Browse Floridana Beach homes for sale — a quiet, river-to-ocean community on South A1A in Melbourne Beach with deeded beach access and an old Florida feel.',
      keywords: [
        'Floridana Beach homes for sale',
        'Floridana Beach real estate',
        'Floridana Beach Melbourne Beach FL',
        'South Melbourne Beach homes for sale',
        'Melbourne Beach oceanfront homes',
      ],
    },
    placeDescription:
      'Floridana Beach is a quiet, primarily residential community along South Highway A1A in Melbourne Beach, Florida (32951), stretching from the Atlantic Ocean to the Indian River Lagoon on Brevard County’s South Beaches.',
    about: [
      'Floridana Beach is a quiet, mostly residential community along South Highway A1A in Melbourne Beach, on the narrow stretch of barrier island that Brevard calls the South Beaches. It runs from the Atlantic Ocean to the Indian River Lagoon, and it’s known for a mellow, old Florida surf-town feel: no high-rises, no commercial strip, and beaches that stay uncrowded on weekdays and weekends alike.',
      'The Floridana Beach Civic Association maintains deeded private beach accesses and a community park and clubhouse for residents and members. Homes are mostly single-family, from 1950s and 1970s beach cottages and ranch homes to new construction, on streets like Floridana Avenue, Angeles Road, Matanzas Road, Margarita Road, and Estrella Road, plus oceanfront homes right on A1A.',
      'Residents surf, surf fish, beachcomb, and kayak or boat on the lagoon side. The Indian River Lagoon Preserve State Park is next door, the Archie Carr National Wildlife Refuge — one of the most important sea turtle nesting beaches in the world — is close by, and Sebastian Inlet State Park is a short drive south. Dogs aren’t allowed on the beach. Oceanfront and low-lying lots can fall in a FEMA flood zone, so confirm the flood zone, any civic association dues, and school zoning on each listing.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes lives in Melbourne Beach and helps buyers compare Floridana Beach homes, from oceanfront A1A homes to cottages on the lagoon side, and negotiate purchases on the South Beaches.',
    secondaryLink: { href: '/melbourne-beach/area-guide', label: 'explore the Melbourne Beach Area Guide' },
  },
  // Crystal Lakes (2026-10-05) — from Ryan's pasted profile and community
  // map. See MELBOURNE_BEACH_NEIGHBORHOOD_PAGES.
  'crystal-lakes': {
    name: 'Crystal Lakes',
    area: 'Melbourne Beach',
    areaPath: '/melbourne-beach',
    aboutHeading: 'About Crystal Lakes Real Estate',
    seo: {
      title: 'Crystal Lakes Homes for Sale | Melbourne Beach, FL',
      description:
        'Browse Crystal Lakes homes for sale — custom homes on oversized lots with deepwater canal and Indian River access, a short walk to the beach in Melbourne Beach, FL.',
      keywords: [
        'Crystal Lakes homes for sale',
        'Crystal Lakes Melbourne Beach',
        'Crystal Lakes real estate',
        'Melbourne Beach canalfront homes',
        'Melbourne Beach riverfront homes for sale',
      ],
    },
    placeDescription:
      'Crystal Lakes is a casual canal and riverfront neighborhood just west of the 5000 block of South Highway A1A in Melbourne Beach, Florida (32951), with custom single-family homes on oversized lots and deepwater canal and Indian River access.',
    about: [
      'Crystal Lakes is a relaxed neighborhood just west of the 5000 block of South Highway A1A in Melbourne Beach, reaching from Palm Drive to the Indian River between Spoonbill Lane to the north and Atlantic Drive to the south, with streets like Riggs Avenue, Ross Avenue, and Lakeview Drive. Quiet cul-de-sacs mix dry lots with deepwater canalfront and riverfront homes that lead out to the Indian River.',
      'Homes are custom single-family residences of about 1,500 to 4,000 square feet on generous lots of roughly a quarter to a third of an acre. Deeded and public beach access, with parking, is right across A1A from Atlantic Drive — a short walk or golf-cart ride from most homes. Listings here are tightly held and don’t come up often.',
      'Most homes use private wells and septic systems, and the HOA fee is very low, around $50 a year — ask for well, septic, and seawall or dock inspections on any purchase. Homes are commonly zoned for Gemini Elementary, Hoover Middle, and Melbourne High School. Canalfront and low-lying lots can fall in a FEMA flood zone, so confirm the flood zone and school zoning on each listing.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes lives in Melbourne Beach and helps buyers compare Crystal Lakes homes, from deepwater canalfront and riverfront homes to dry lots near the beach, and negotiate purchases on the South Beaches.',
    secondaryLink: { href: '/melbourne-beach/area-guide', label: 'explore the Melbourne Beach Area Guide' },
  },
  // Indian Landing (2026-10-05) — from Ryan's pasted profile, community
  // map and the listings he shared. See MELBOURNE_BEACH_NEIGHBORHOOD_PAGES.
  'indian-landing': {
    name: 'Indian Landing',
    area: 'Melbourne Beach',
    areaPath: '/melbourne-beach',
    aboutHeading: 'About Indian Landing Real Estate',
    seo: {
      title: 'Indian Landing Homes for Sale | Gated Community, Melbourne Beach FL',
      description:
        'Browse Indian Landing homes for sale — a gated ocean-to-river community in Melbourne Beach with deeded beach access, a fishing pier, boat ramp, clubhouse, and pool.',
      keywords: [
        'Indian Landing homes for sale',
        'Indian Landing Melbourne Beach',
        'Indian Landing real estate',
        'gated communities Melbourne Beach',
        'Melbourne Beach riverfront homes for sale',
      ],
    },
    placeDescription:
      'Indian Landing is a gated ocean-to-river community in South Melbourne Beach, Florida (32951), with oceanfront, riverfront, canalfront, and lakefront homes and townhomes.',
    about: [
      'Indian Landing is a gated community in South Melbourne Beach that runs from the Atlantic Ocean to the Indian River, on private streets like Sea Dunes Drive, Pentland Drive, Solway Drive, Clyde Street, Moray Place, and Tay Court. Homes include oceanfront, riverfront, canalfront, and lakefront single-family homes, plus townhomes with docks, built with consistent architecture under the community’s deed restrictions, which also rule out short-term rentals.',
      'Residents have deeded beach access, a community fishing pier on the river, a boat ramp with boat storage, a clubhouse, and a community pool. The HOA fee covers the private roads, the gated entrance, and landscaping — confirm the current fee and the rental rules on each listing. Driftwood Plaza, with a Publix, is a short drive away.',
      'Between the ocean and the river, residents boat, fish, and spend time on the beach, and the clubhouse hosts community events. Oceanfront, riverfront, and low-lying lots can fall in a FEMA flood zone, so confirm the flood zone and school zoning on each listing.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes lives in Melbourne Beach and helps buyers compare Indian Landing homes, from canal and lakefront homes to oceanfront and riverfront properties, and negotiate purchases on the South Beaches.',
    secondaryLink: { href: '/melbourne-beach/area-guide', label: 'explore the Melbourne Beach Area Guide' },
  },
  // Melbourne Shores (2026-10-05) — from Ryan's pasted profile, community
  // map and the active listings he shared (MLS subdivisions "Melbourne
  // Shores Subd", "Melbourne Shores 1St Addn", "...2nd Addn").
  'melbourne-shores': {
    name: 'Melbourne Shores',
    area: 'Melbourne Beach',
    areaPath: '/melbourne-beach',
    aboutHeading: 'About Melbourne Shores Real Estate',
    seo: {
      title: 'Melbourne Shores Homes for Sale | Melbourne Beach, FL',
      description:
        'Browse Melbourne Shores homes for sale — an ocean-to-river neighborhood on South A1A in Melbourne Beach with a private beach park, river park, fishing pier, and boat ramp.',
      keywords: [
        'Melbourne Shores homes for sale',
        'Melbourne Shores Melbourne Beach',
        'Melbourne Shores real estate',
        'Melbourne Shores FL',
        'South Melbourne Beach homes for sale',
      ],
    },
    placeDescription:
      'Melbourne Shores is a quiet ocean-to-river residential community on South Highway A1A in Melbourne Beach, Florida (32951), about 8 miles south of downtown Melbourne Beach.',
    about: [
      'Melbourne Shores is a quiet, ocean-to-river neighborhood on South Highway A1A, about 8 miles south of downtown Melbourne Beach, between the Atlantic Ocean and the Indian River Lagoon. Its streets are named for shorebirds — Heron, Ibis, Flamingo, Cardinal, and Pelican Drives — running from Oceanside Drive to Riverside Drive, just south of Indian Mound Drive.',
      'The voluntary Melbourne Shores Property Owners Association funds and maintains two private parks: an ocean park with deeded beach access, parking, a picnic area, shaded seating, a barbecue, and bike racks, and a river park with a fishing pier, boat launch ramp, small boat and kayak storage, and a children’s playground. Public conservation land with a nature trail borders the neighborhood to the south, and sea turtles nest on the beaches near the Archie Carr National Wildlife Refuge.',
      'Homes are mostly single-family, plus some townhomes, built from the late 1950s to new construction, with an old Florida coastal feel. Riverfront and low-lying lots can fall in a FEMA flood zone, so confirm the flood zone and school zoning on each listing.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes lives in Melbourne Beach and helps buyers compare Melbourne Shores homes, from riverfront homes on Riverside Drive to homes a short walk from the ocean park, and negotiate purchases on the South Beaches.',
    secondaryLink: { href: '/melbourne-beach/area-guide', label: 'explore the Melbourne Beach Area Guide' },
  },
  // Turtle Bay (2026-10-05) — from Ryan's pasted profile and community map.
  // See MELBOURNE_BEACH_NEIGHBORHOOD_PAGES.
  'turtle-bay': {
    name: 'Turtle Bay',
    area: 'Melbourne Beach',
    areaPath: '/melbourne-beach',
    aboutHeading: 'About Turtle Bay Real Estate',
    seo: {
      title: 'Turtle Bay Homes for Sale | Gated Community, Melbourne Beach FL',
      description:
        'Browse Turtle Bay homes for sale — a small gated community in Melbourne Beach with riverfront homes, a private beachfront cabana, a fishing dock, and tennis courts.',
      keywords: [
        'Turtle Bay homes for sale',
        'Turtle Bay Melbourne Beach',
        'Turtle Bay real estate',
        'gated communities Melbourne Beach',
        'Melbourne Beach riverfront homes for sale',
      ],
    },
    placeDescription:
      'Turtle Bay is a small gated community on the Indian River side of South Highway A1A in Melbourne Beach, Florida (32951), about 3 miles south of the Driftwood shopping center, with a private beachfront cabana across A1A.',
    about: [
      'Turtle Bay is a small gated community about 3 miles south of the Driftwood shopping center in South Melbourne Beach. Its homes sit along Loggerhead Drive and Terrapin Court around a central lake, between South A1A and the Indian River, with county and federal preserve land nearby.',
      'Homes were built between about 1995 and 2005 and mostly range from 2,000 to 3,000 square feet, on lots from a quarter acre to almost half an acre; some larger homes sit directly on the river. Residents share a private beachfront cabana across A1A with bathrooms, a shower, a locker room with assigned lockers, and a grilling area, plus a riverfront dock for fishing and sunsets and two tennis courts.',
      'Listings in Turtle Bay are few and far between, so it pays to be ready when one comes up. Community association fees apply — confirm the current fee and what it covers, along with the flood zone and school zoning, on each listing.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes lives in Melbourne Beach and helps buyers find Turtle Bay homes, including riverfront homes that rarely come up for sale, and negotiate purchases on the South Beaches.',
    secondaryLink: { href: '/melbourne-beach/area-guide', label: 'explore the Melbourne Beach Area Guide' },
  },
  // Sunnyland Beach (2026-10-05) — from Ryan's pasted profile and the
  // active listings he shared. See MELBOURNE_BEACH_NEIGHBORHOOD_PAGES.
  'sunnyland-beach': {
    name: 'Sunnyland Beach',
    area: 'Melbourne Beach',
    areaPath: '/melbourne-beach',
    aboutHeading: 'About Sunnyland Beach Real Estate',
    seo: {
      title: 'Sunnyland Beach Homes for Sale | Melbourne Beach, FL',
      description:
        'Browse Sunnyland Beach homes for sale — canalfront, riverfront, and oceanfront homes with private beach access on South A1A in Melbourne Beach, near Sebastian Inlet.',
      keywords: [
        'Sunnyland Beach homes for sale',
        'Sunnyland Beach Melbourne Beach',
        'Sunnyland Beach real estate',
        'Melbourne Beach canal homes for sale',
        'South Melbourne Beach waterfront homes',
      ],
    },
    placeDescription:
      'Sunnyland Beach is a quiet, low-density residential and boating community on the 7300 block of South Highway A1A in Melbourne Beach, Florida (32951), stretching from the Atlantic Ocean to the Indian River.',
    about: [
      'Sunnyland Beach is a quiet, low-density neighborhood on the 7300 block of South Highway A1A in South Melbourne Beach, entered off Beverly Court. It runs from the Atlantic Ocean to the Indian River, with streets like Arrowhead Lane, Hiawatha Way, Mohican Way, and Nikomas Way, and canals that give many homes their own docks and a short boat run to Sebastian Inlet. The Archie Carr National Wildlife Refuge is nearby.',
      'Homes are mostly single-family — canalfront, riverfront, and oceanfront — with occasional vacant lots. Most have 3 to 4 bedrooms and about 1,500 to over 3,200 square feet, built mainly from the mid-1970s through the 2020s. Residents have private deeded beach access, and the voluntary Property Owners Association keeps annual dues minimal.',
      'Water comes from the community-run South Brevard Water Co-Op’s reverse-osmosis treatment system, and homes are on private septic tanks, so ask for the septic inspection and water co-op details on any purchase. Waterfront and low-lying lots can fall in a FEMA flood zone, so confirm the flood zone and school zoning on each listing.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes lives in Melbourne Beach and helps buyers compare Sunnyland Beach homes, from canalfront homes with docks to oceanfront A1A homes, and negotiate purchases on the South Beaches.',
    secondaryLink: { href: '/melbourne-beach/area-guide', label: 'explore the Melbourne Beach Area Guide' },
  },
  // Viera West neighborhood pages (2026-10-04) — see VIERA_WEST_NEIGHBORHOOD_PAGES.
  // Del Webb at Viera facts added 2026-10-04 from delwebb.com (community
  // page, read via the research helper session): manned gatehouse, 30,000
  // sq ft Catamaran Clubhouse, 12 pickleball courts, Villa/Scenic/
  // Distinctive/Echelon collections, 1,405–3,453 sq ft, from $363,990.
  'del-webb-viera': {
    name: 'Del Webb at Viera',
    areaPath: '/viera-west',
    aboutHeading: 'About Del Webb at Viera Real Estate',
    seo: {
      title: 'Del Webb Viera Homes for Sale | Gated 55+ Community, Viera FL',
      description:
        'Browse Del Webb at Viera homes for sale — a gated 55+ community with new and resale homes, a 30,000 sq ft clubhouse, and 12 pickleball courts in Viera, FL.',
      keywords: [
        'Del Webb Viera homes for sale',
        'Del Webb at Viera',
        'Del Webb Viera new homes',
        'Del Webb Viera Catamaran Clubhouse',
        '55+ communities Viera',
        'Del Webb Melbourne FL',
      ],
    },
    placeDescription:
      'Del Webb at Viera is a gated 55+ community by Del Webb in Viera West, Florida (32940), with single-family homes and villas on a network of ponds and the 30,000-square-foot Catamaran Clubhouse.',
    about: [
      'Del Webb at Viera is a gated 55+ community by Del Webb, PulteGroup’s active-adult brand, in Viera West. Single-family homes and villas are set along a network of ponds, many with water views, behind a manned gatehouse. Del Webb is still building here, so buyers can choose a new home or a resale — this page shows both from the MLS.',
      'The community centers on the waterfront Catamaran Clubhouse, with about 30,000 square feet under roof: the Salt & Ember tavern and grille, an outdoor bar, a ballroom, craft and hobby rooms, a movement studio, and a fitness center. Outside are a zero-entry resort pool with lap lanes, cabanas, a spa, fire pits, an event lawn, 12 pickleball courts, tennis, dog parks, and a community garden, plus clubs from bocce and yoga to mahjongg and book club. The Shoppes at Lake Andrew are about 4 miles away, and Viera Regional Park and the Brevard Zoo about 5.',
      'New homes come in four collections: Villa (about 1,579 sq ft), Scenic (about 1,405–1,655 sq ft), Distinctive (about 1,670–2,080 sq ft), and Echelon (about 2,269–3,453 sq ft), most with two to four bedrooms and two- or three-car garages.  Del Webb’s sales center and model homes are at 8926 Coventina Way. Community association fees apply — confirm the current fee, what it covers, any CDD fee, and the 55+ occupancy rules on each listing.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare new and resale Del Webb at Viera homes across all four collections, alongside Viera West’s other 55+ communities like Heritage Isle and Bridgewater at Viera, and can represent you on a new-construction purchase.',
    secondaryLink: { href: '/viera-west/area-guide', label: 'explore the Viera West Area Guide' },
  },
  // Heritage Isle facts added 2026-10-04 from details Ryan pasted (a 55+
  // community profile): 478 acres, ~1,500 homes, gated, built 2005–2017,
  // resale only, 21,000 sq ft clubhouse, next to Duran Golf Club, HOA
  // $279–$532/mo. Rewritten rather than copied to avoid duplicate content.
  'heritage-isle': {
    name: 'Heritage Isle',
    areaPath: '/viera-west',
    aboutHeading: 'About Heritage Isle Viera Real Estate',
    seo: {
      title: 'Heritage Isle Homes for Sale | Gated 55+ Community, Viera FL',
      description:
        'Browse Heritage Isle homes for sale — a gated 55+ community in Viera with a 21,000 sq ft clubhouse by Duran Golf Club. Condos, villas & single-family homes.',
      keywords: [
        'Heritage Isle Viera homes for sale',
        'Heritage Isle Viera',
        'Heritage Isle 55+ community',
        'Heritage Isle condos for sale',
        'Heritage Isle Melbourne FL',
        'gated 55+ communities Viera',
      ],
    },
    placeDescription:
      'Heritage Isle is a gated, 478-acre 55+ active adult community of about 1,500 homes in Viera West, Florida, built between 2005 and 2017 and centered on a 21,000-square-foot clubhouse next to Duran Golf Club.',
    about: [
      'Heritage Isle is a gated 55+ active adult community covering 478 acres in Viera West, with about 1,500 homes built between 2005 and 2017. Its villages are linked by landscaped Legacy Boulevard and pedestrian bridges, and the community sits right next to Duran Golf Club’s 18-hole championship course and 9-hole par-3 course. It has drawn recognition since opening, including Florida Today readers’ “Best 55+ Community in Brevard County” and a National Association of Home Builders Innovation Award in 2005.',
      'Life centers on the 21,000-square-foot Heritage Isle Club, with a fitness center, ballroom, library, computer center, billiards, card, game, and arts and crafts rooms, plus a resort-style pool and outdoor courts for tennis, bocce, shuffleboard, basketball, and horseshoes. A full-time activities director runs a busy calendar of clubs, classes, dances, and group trips.',
      'Every sale here is a resale, across four home types: elevator condo buildings with covered parking and screened porches overlooking the golf course (about 1,194–1,408 sq ft, 2–3 bedrooms, 2 baths); attached villas, duplexes, and townhomes (about 1,337–1,842 sq ft); and single-family homes from Lennar’s Manors and Estates collections (about 1,582–2,615 sq ft, 2–4 bedrooms) and a small number of semi-custom Burgoon-Berger Heritage Collection homes. HOA dues run roughly $279–$532 a month depending on the home; confirm the current fee, what it covers, any CDD fee, and the community’s 55+ occupancy rules on each listing.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Heritage Isle condos, villas, and single-family homes with Viera West’s other 55+ communities, like Del Webb at Viera and Bridgewater at Viera, and negotiate purchases from first showing to closing.',
    secondaryLink: { href: '/viera-west/area-guide', label: 'explore the Viera West Area Guide' },
  },
  // Bridgewater at Viera facts added 2026-10-04 from details Ryan pasted (a
  // 55+ community profile): Lennar, 408 acres, ~870 homes, built 2017–2023,
  // gated, resale only, 23,000 sq ft clubhouse, HOA $171–$548/mo.
  'bridgewater-at-viera': {
    name: 'Bridgewater at Viera',
    areaPath: '/viera-west',
    aboutHeading: 'About Bridgewater at Viera Real Estate',
    seo: {
      title: 'Bridgewater at Viera Homes for Sale | Gated 55+ by Lennar',
      description:
        'Browse Bridgewater at Viera homes for sale — a gated 55+ Lennar community in Viera with a 23,000 sq ft clubhouse, pool, pickleball & tennis. Live listings.',
      keywords: [
        'Bridgewater at Viera homes for sale',
        'Bridgewater Viera 55+',
        'Bridgewater at Viera Lennar',
        'Bridgewater at Viera HOA',
        'gated 55+ communities Viera',
        '55+ communities Melbourne FL',
      ],
    },
    placeDescription:
      'Bridgewater at Viera is a gated, 408-acre 55+ community of about 870 Lennar homes in Viera West, Florida, built between 2017 and 2023 around a 23,000-square-foot clubhouse.',
    about: [
      'Bridgewater at Viera is a gated 55+ community of about 870 homes on 408 acres in Viera West, built by Lennar between 2017 and 2023. The community is now complete, so every home for sale is a resale. It is not the Bridgewater neighborhood on South Merritt Island — this page shows only Bridgewater at Viera listings.',
      'Residents share a 23,000-square-foot clubhouse complex with a fitness center, aerobics studio, arts and crafts studio, theater, and café, plus a resort-style pool and patio with an outdoor bar, and courts for tennis, pickleball, and bocce. North Wickham Road shopping and dining, Health First’s Viera Hospital, and Duran Golf Club are all close by.',
      'Lennar built three collections here: the Villas (about 1,593–1,916 sq ft, two bedrooms plus a den, two-car garage), the Grand Villas (about 1,822–2,389 sq ft, two to three bedrooms plus a den), and the Classic series (about 2,434 to more than 2,700 sq ft, three bedrooms plus a den, three-car garage). HOA dues run roughly $171–$548 a month depending on the home; confirm the current fee, what it covers, any CDD fee, and the community’s 55+ occupancy rules on each listing.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Bridgewater at Viera’s Villas, Grand Villas, and Classic homes with Viera West’s other 55+ communities, like Del Webb at Viera and Heritage Isle, and negotiate purchases from first showing to closing.',
    secondaryLink: { href: '/viera-west/area-guide', label: 'explore the Viera West Area Guide' },
  },
  // Sonoma at Viera facts added 2026-10-04 from a community profile Ryan
  // pasted: gated, 384 homesites on 75–130 ft lots, Lennar and
  // Burgoon-Berger, 1,500–3,600 sq ft, park with courts, fishing dock and
  // pavilion; follow-up details (3–5 bedrooms, ¼–½ acre lots, pickleball,
  // playground, sand volleyball, reservable pavilion, Publix across the
  // street, Rockledge mailing addresses) from sources Ryan pasted.
  'sonoma-at-viera': {
    name: 'Sonoma at Viera',
    areaPath: '/viera-west',
    aboutHeading: 'About Sonoma at Viera Real Estate',
    seo: {
      title: 'Sonoma at Viera Homes for Sale | Gated Community, Viera FL',
      description:
        'Browse Sonoma at Viera homes for sale — a gated Viera West community of 384 homesites by Lennar and Burgoon-Berger, with lake views, a park and fishing dock.',
      keywords: [
        'Sonoma at Viera homes for sale',
        'Sonoma Viera',
        'Sonoma South Viera',
        'Sonoma Rockledge FL',
        'gated communities Viera',
        'Sonoma at Viera real estate',
        'Viera West homes for sale',
      ],
    },
    placeDescription:
      'Sonoma at Viera is a gated community of 384 homesites in northern Viera West, Florida, near Summer Lakes, with single-family homes by Lennar and Burgoon-Berger, many on the water.',
    about: [
      'Sonoma at Viera is a gated community of 384 homesites in the northern part of Viera West, just south of Summer Lakes, with palm-lined streets and many homes carrying a Rockledge mailing address. Homes were built by Lennar and Burgoon-Berger on lots from about 75 to 130 feet wide, and many look out over the community’s lakes. The MLS lists homes across Sonoma at Viera Phases 1–4 and Sonoma South, all gathered on this page.',
      'Homes range from about 1,500 to 3,600 square feet with three to five bedrooms and two- or three-car garages, on lots from roughly a quarter to nearly half an acre, often with brick paver driveways, hurricane shutters, and upgraded cabinetry. Sonoma’s own recreation park has tennis, pickleball, and basketball courts, a playground, a sand volleyball court, a fishing dock, and a pavilion with restrooms that residents can reserve. Publix is right across the street, and The Avenue Viera, Health First’s Viera Hospital, and Duran Golf Club are a short drive away.',
      'Like most of Viera West, homes carry an HOA fee and often a Viera West Community Development District (CDD) fee — confirm both, and the flood zone, on each listing. Viera West homes are commonly zoned for Manatee Elementary, Kennedy Middle, and Viera High School; confirm with Brevard Public Schools for the specific address.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Sonoma at Viera homes with nearby Viera West neighborhoods like Summer Lakes, and negotiate purchases from first showing to closing.',
    secondaryLink: { href: '/viera-west/area-guide', label: 'explore the Viera West Area Guide' },
  },
  // Strom Park facts added 2026-10-04 from a neighborhood profile Ryan
  // pasted: ~343 single-family homes, built mostly 2014–2017 by Viera
  // Builders, lake/preserve lots, pedestrian trails, off Lake Andrew Drive.
  'strom-park': {
    name: 'Strom Park',
    areaPath: '/viera-west',
    aboutHeading: 'About Strom Park Viera Real Estate',
    seo: {
      title: 'Strom Park Homes for Sale | Viera Builders, Viera West FL',
      description:
        'Browse Strom Park homes for sale — about 343 Viera Builders homes in Viera West with lake and preserve lots and walking trails, off Lake Andrew Drive.',
      keywords: [
        'Strom Park Viera homes for sale',
        'Strom Park Viera',
        'Strom Park Viera Builders',
        'Strom Park real estate',
        'Viera West homes for sale',
        'homes for sale 32940',
      ],
    },
    placeDescription:
      'Strom Park is a neighborhood of about 343 single-family homes in Viera West, Florida (32940), built mostly between 2014 and 2017 by Viera Builders, with lake and preserve lots and pedestrian trails.',
    about: [
      'Strom Park is a family-oriented neighborhood of about 343 single-family homes in Viera West, built mostly between 2014 and 2017 by Viera Builders. It sits off Lake Andrew Drive with quick access to I-95, The Avenue Viera, Health First’s Viera Hospital, and the Costco and Publix shopping nearby.',
      'Homes range from roughly 1,800 to more than 3,200 square feet, most with two- or three-car garages and open floor plans, and many lots back up to a lake or preserve. Pedestrian-only trails wind through the neighborhood for walking, jogging, and biking.',
      'Strom Park is deed-restricted, and like most of Viera West, homes carry an HOA fee and often a Viera West Community Development District (CDD) fee — confirm both, and the flood zone, on each listing. Viera West homes are commonly zoned for Manatee Elementary, Kennedy Middle, and Viera High School; confirm with Brevard Public Schools for the specific address.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Strom Park homes with Viera Builders’ newer communities and other Viera West neighborhoods, and negotiate purchases from first showing to closing.',
    secondaryLink: { href: '/viera-west/area-guide', label: 'explore the Viera West Area Guide' },
  },
  // Arrivas Village facts added 2026-10-04 from a community overview Ryan
  // pasted: Spanish Colonial architecture, courtyards with optional summer
  // kitchens, golf-cart friendly, Duran Golf Club right behind it. Its
  // "from the low $300s" pricing was left out as outdated. Follow-up profile
  // added: ~200 homes in two phases, zero-lot-line/rear-entry alley design,
  // across from The Avenue Viera, pool/dog park/playground, association
  // exterior painting and landscaping for many homes.
  'arrivas-village': {
    name: 'Arrivas Village',
    areaPath: '/viera-west',
    aboutHeading: 'About Arrivas Village Viera Real Estate',
    seo: {
      title: 'Arrivas Village Homes for Sale | Viera, FL Near Duran Golf',
      description:
        'Browse Arrivas Village homes for sale — Spanish Colonial courtyard homes in central Viera, across from The Avenue Viera and next to Duran Golf Club.',
      keywords: [
        'Arrivas Village homes for sale',
        'Arrivas Village Viera',
        'Arrivas Village Viera Builders',
        'Spanish Colonial homes Viera',
        'homes near Duran Golf Club',
        'Viera West homes for sale',
      ],
    },
    placeDescription:
      'Arrivas Village is a Viera Builders neighborhood of just over 200 Spanish Colonial-style courtyard homes in central Viera West, Florida, across from The Avenue Viera and directly behind Duran Golf Club.',
    about: [
      'Arrivas Village is a Viera Builders neighborhood in central Viera West, known for its Spanish Colonial architecture — arched doorways, wrought-iron gates, and barrel-tile roofs on many homes. Its just-over-200 single-family courtyard homes, built in two phases, use zero-lot-line designs with rear-entry garages off alleys, which keeps the sidewalk-lined streets open and walkable. Homes were designed around outdoor living, with balconies, verandas, and private courtyards, some with summer kitchens, along with energy-efficient features.',
      'Arrivas Village sits across from The Avenue Viera’s shops, restaurants, and movie theater, with Duran Golf Club right behind it, and residents share a community pool, dog park, and playground. It’s a golf-cart-friendly part of Viera — residents ride to breakfast, Viera’s parks, the USSSA Space Coast ballpark complex, or a Friday night game at Viera High School — and the association handles exterior painting and landscaping for many homes, so confirm what a specific home’s fees cover.',
      'Like most of Viera West, homes carry an HOA fee and often a Viera West Community Development District (CDD) fee — confirm both, and the flood zone, on each listing. Viera West homes are commonly zoned for Manatee Elementary, Kennedy Middle, and Viera High School; confirm with Brevard Public Schools for the specific address.',
    ],
    agentLine:
      'Ryan Pohl of Brevard Coastal Homes helps buyers compare Arrivas Village homes with Viera Builders’ newer communities like Reeling Park, and negotiate purchases from first showing to closing.',
    secondaryLink: { href: '/viera-west/area-guide', label: 'explore the Viera West Area Guide' },
  },
};

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
// `blurb` (2026-10-03, per Ryan — the community pages weren't showing up
// in Google): a one-line description shown under each link on the Viera
// Builders Communities Viera West hub page, so the hub carries real text
// about every community instead of bare links. From each community's
// NEIGHBORHOOD_AREA_GUIDE_CONTENT entry.
// Hub page title/description (2026-10-03, per Ryan) — the backend's
// templated title for /neighborhoods/viera-builders-communities-viera-west
// runs past its 70-character cap and gets cut off with an ellipsis
// ("...| Viera Builders…"), and its description is generic. Used by
// app/neighborhoods/[slug]/page.js's generateMetadata.
export const VIERA_BUILDERS_HUB_SEO = {
  title: 'Viera Builders Communities in Viera West, FL | Homes for Sale',
  description:
    'New-construction homes for sale in Viera Builders’ Viera West communities: Laurasia, Pangea Park, Reeling Park, Crossmolina, Farallon Fields & Atlin Cove.',
  keywords: [
    'Viera Builders homes for sale',
    'Viera Builders communities',
    'Viera West new construction',
    'Laurasia Viera',
    'Pangea Park Viera',
    'Reeling Park Viera',
    'Crossmolina Viera',
    'Farallon Fields Viera',
  ],
};

export const VIERA_BUILDERS_SUB_COMMUNITIES = [
  { slug: 'laurasia', name: 'Laurasia', blurb: 'Gated, Mediterranean-inspired homes near Duran Golf Club' },
  { slug: 'pangea-park', name: 'Pangea Park', blurb: 'Single-family homes and condos with a park, lap pool, and tennis' },
  { slug: 'reeling-park', name: 'Reeling Park', blurb: 'Spanish Colonial courtyard homes with Addison Village Club access' },
  { slug: 'crossmolina', name: 'Crossmolina', blurb: 'One- and two-story homes with a resort-style pool and trails' },
  { slug: 'farallon-fields', name: 'Farallon Fields', blurb: 'Mid-century modern homes with a gated section and lakes' },
  { slug: 'atlin-cove', name: 'Atlin Cove', comingSoon: true, blurb: 'Viera Builders’ next community' },
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

// Aquarina listing filter (2026-10-07, per Ryan: Aquarina has 18
// neighborhoods, but its Recently Sold section only showed 4 sales). The
// exact list above came from active listings only and missed sub-
// associations with nothing for sale at the time (Osprey Villas, Blue
// Heron, Sandpiper Cove, River Oaks, Cranes Point Ph 2, ...). A full dump
// of MLS areas 384/385 subdivision names showed every Aquarina sub-
// association either has "Aquarina" in its name or is one of the four
// below, so the page now matches by name fragment within Melbourne Beach.
// St Andrews Village and Sunnyland Groves (next door) stay out.
export const AQUARINA_SUBDIVISION_PATTERNS = [
  'Aquarina',
  'Maritime Hammock',
  'Egret Trace Condo',
  'Tidewater Condo No 1',
  'The Hammock Condo I',
];
export const AQUARINA_LISTINGS_FILTER = {
  city: 'melbourne-beach',
  subdivisionLike: AQUARINA_SUBDIVISION_PATTERNS.join(','),
};

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

// Viera West neighborhood pages (2026-10-04, per Ryan: link Del Webb,
// Heritage Isle, Strom Park, Sonoma at Viera, Arrivas Village and
// Bridgewater at Viera from the Viera West pages). None is a backend
// neighborhood row, so — like Beach Woods — each page is synthetic and
// filters listings itself: MLS area 217 (Viera West of I-95) plus any
// subdivision name containing one of `subdivisionLike` (case-insensitive,
// backend `subdivisionLike`), so new MLS phases ("Del Webb at Viera Phase
// 5", "Heritage Isle PUD Phase 9") show up without a code change. Names
// confirmed against the live MLS feed's area-217 subdivision list on
// 2026-10-04; `senior` marks communities whose every listing carries the
// MLS SeniorCommunityYN flag (55+).
export const VIERA_WEST_NEIGHBORHOOD_PAGES = {
  'del-webb-viera': {
    name: 'Del Webb at Viera',
    subdivisionLike: ['Del Webb'],
    senior: true,
    h1: 'Del Webb at Viera Homes For Sale - Gated 55+ Community in Viera, Florida',
    intro:
      'Explore new and resale homes for sale in Del Webb at Viera, a gated 55+ community in Viera West built around the 30,000 sq ft Catamaran Clubhouse. We can help you compare floor plans, tour homes, and negotiate from first showing to closing.',
  },
  'heritage-isle': {
    name: 'Heritage Isle',
    subdivisionLike: ['Heritage Isle'],
    senior: true,
    h1: 'Heritage Isle Homes For Sale - Gated 55+ Community in Viera, Florida',
    intro:
      'Explore homes and condos for sale in Heritage Isle, a gated 55+ community of about 1,500 homes in Viera West, next to Duran Golf Club. We can help you compare condos, villas, and single-family homes, tour properties, and negotiate from first showing to closing.',
  },
  'bridgewater-at-viera': {
    name: 'Bridgewater at Viera',
    subdivisionLike: ['Bridgewater at Viera'],
    senior: true,
    h1: 'Bridgewater at Viera Homes For Sale - Gated 55+ Community in Viera, Florida',
    intro:
      'Explore homes for sale in Bridgewater at Viera, a gated 55+ Lennar community of about 870 homes in Viera West. We can help you compare its Villas, Grand Villas, and Classic homes, tour properties, and negotiate from first showing to closing.',
  },
  'sonoma-at-viera': {
    name: 'Sonoma at Viera',
    subdivisionLike: ['Sonoma'],
    h1: 'Sonoma at Viera Homes For Sale - Gated Community in Viera, Florida',
    intro:
      'Explore homes for sale in Sonoma at Viera, a gated Viera West community of 384 homesites near Summer Lakes, with many lakefront lots. We can help you compare homes, tour properties, and negotiate from first showing to closing.',
  },
  'strom-park': {
    name: 'Strom Park',
    subdivisionLike: ['Strom Park'],
    h1: 'Strom Park Homes For Sale - Viera, Florida',
    intro:
      'Explore homes for sale in Strom Park, a Viera Builders neighborhood of about 343 homes in Viera West, with lake and preserve lots and walking trails. We can help you compare homes, tour properties, and negotiate from first showing to closing.',
  },
  'arrivas-village': {
    name: 'Arrivas Village',
    subdivisionLike: ['Arrivas Village'],
    h1: 'Arrivas Village Homes For Sale - Viera, Florida',
    intro:
      'Explore homes for sale in Arrivas Village, a Viera Builders neighborhood of Spanish Colonial-style homes with private courtyards, right behind Duran Golf Club in the heart of Viera West. We can help you compare homes, tour properties, and negotiate from first showing to closing.',
  },
};

// Listing filter for a VIERA_WEST_NEIGHBORHOOD_PAGES slug (see above).
export function vieraWestNeighborhoodFilter(slug) {
  const page = VIERA_WEST_NEIGHBORHOOD_PAGES[slug];
  return page ? { mlsArea: VIERA_WEST_MLS_AREA, subdivisionLike: page.subdivisionLike.join(',') } : null;
}

// Melbourne Beach neighborhood pages (2026-10-05, per Ryan, who lives in
// Melbourne Beach and wants the site to focus there). Same synthetic-page
// setup as VIERA_WEST_NEIGHBORHOOD_PAGES, but filtered to Melbourne Beach
// city listings whose MLS subdivision name contains `subdivisionLike`.
export const MELBOURNE_BEACH_NEIGHBORHOOD_PAGES = {
  'floridana-beach': {
    name: 'Floridana Beach',
    subdivisionLike: ['Floridana'],
    h1: 'Floridana Beach Homes For Sale - Melbourne Beach, Florida',
    intro:
      'Explore homes for sale in Floridana Beach, a quiet, residential river-to-ocean community along South A1A in Melbourne Beach, with deeded beach access through the Floridana Beach Civic Association. We can help you compare homes, tour properties, and negotiate from first showing to closing.',
  },
  'crystal-lakes': {
    name: 'Crystal Lakes',
    subdivisionLike: ['Crystal Lake'],
    h1: 'Crystal Lakes Homes For Sale - Melbourne Beach, Florida',
    intro:
      'Explore homes for sale in Crystal Lakes, a laid-back canal and riverfront neighborhood just west of the 5000 block of South A1A in Melbourne Beach, with custom homes on oversized lots, deepwater canals to the Indian River, and beach access across A1A. We can help you compare homes, tour properties, and negotiate from first showing to closing.',
  },
  'indian-landing': {
    name: 'Indian Landing',
    subdivisionLike: ['Indian Landing'],
    h1: 'Indian Landing Homes For Sale - Gated Community in Melbourne Beach, Florida',
    intro:
      'Explore homes for sale in Indian Landing, a gated ocean-to-river community in South Melbourne Beach with deeded beach access, a fishing pier, boat ramp, clubhouse, and pool. We can help you compare homes, tour properties, and negotiate from first showing to closing.',
  },
  'melbourne-shores': {
    name: 'Melbourne Shores',
    subdivisionLike: ['Melbourne Shores'],
    h1: 'Melbourne Shores Homes For Sale - Melbourne Beach, Florida',
    intro:
      'Explore homes for sale in Melbourne Shores, a quiet ocean-to-river neighborhood on South A1A in Melbourne Beach with its own private ocean park and river park with a fishing pier and boat ramp. We can help you compare homes, tour properties, and negotiate from first showing to closing.',
  },
  'turtle-bay': {
    name: 'Turtle Bay',
    subdivisionLike: ['Turtle Bay'],
    h1: 'Turtle Bay Homes For Sale - Gated Community in Melbourne Beach, Florida',
    intro:
      'Explore homes for sale in Turtle Bay, a small gated river-to-ocean community in South Melbourne Beach with a private beachfront cabana, riverfront fishing dock, and tennis courts. We can help you compare homes, tour properties, and negotiate from first showing to closing.',
  },
  'sunnyland-beach': {
    name: 'Sunnyland Beach',
    subdivisionLike: ['Sunnyland'],
    // Sunnyland Groves (7800 block of S A1A, near Aquarina) is a separate
    // subdivision, per Ryan 2026-10-06.
    excludeSubdivisionLike: ['Sunnyland Groves'],
    h1: 'Sunnyland Beach Homes For Sale - Melbourne Beach, Florida',
    intro:
      'Explore homes for sale in Sunnyland Beach, a quiet boating community on the 7300 block of South A1A in Melbourne Beach, running from the Atlantic to the Indian River with canalfront, riverfront, and oceanfront homes and private beach access. We can help you compare homes, tour properties, and negotiate from first showing to closing.',
  },
};

// Every synthetic neighborhood landing page, with the city it belongs to.
export const NEIGHBORHOOD_LANDING_PAGES = {
  ...Object.fromEntries(
    Object.entries(VIERA_WEST_NEIGHBORHOOD_PAGES).map(([slug, page]) => [
      slug,
      { ...page, citySlug: 'viera-west', cityName: 'Viera West' },
    ])
  ),
  ...Object.fromEntries(
    Object.entries(MELBOURNE_BEACH_NEIGHBORHOOD_PAGES).map(([slug, page]) => [
      slug,
      { ...page, citySlug: 'melbourne-beach', cityName: 'Melbourne Beach' },
    ])
  ),
};

// Listing filter for a NEIGHBORHOOD_LANDING_PAGES slug.
export function neighborhoodLandingFilter(slug) {
  if (VIERA_WEST_NEIGHBORHOOD_PAGES[slug]) return vieraWestNeighborhoodFilter(slug);
  const page = MELBOURNE_BEACH_NEIGHBORHOOD_PAGES[slug];
  if (!page) return null;
  return {
    city: 'melbourne-beach',
    subdivisionLike: page.subdivisionLike.join(','),
    ...(page.excludeSubdivisionLike && { excludeSubdivisionLike: page.excludeSubdivisionLike.join(',') }),
  };
}

// Melbourne Beach neighborhood links (2026-10-05, per Ryan) — every
// Melbourne Beach neighborhood page, shown as a link row on the Melbourne
// Beach listing pages (components/NeighborhoodLinkRow.js) and on each of
// those neighborhood pages. Same order as the nav's Melbourne Beach tab.
export const MELBOURNE_BEACH_NEIGHBORHOOD_LINKS = [
  { href: '/neighborhoods/aquarina', label: 'Aquarina' },
  { href: '/neighborhoods/beach-woods', label: 'Beach Woods' },
  { href: '/neighborhoods/crystal-lakes', label: 'Crystal Lakes' },
  { href: '/neighborhoods/floridana-beach', label: 'Floridana Beach' },
  { href: '/neighborhoods/harbor-island-beach-club', label: 'Harbor Island Beach Club' },
  { href: '/neighborhoods/indian-landing', label: 'Indian Landing' },
  { href: '/neighborhoods/melbourne-shores', label: 'Melbourne Shores' },
  { href: '/neighborhoods/sunnyland-beach', label: 'Sunnyland Beach' },
  { href: '/neighborhoods/turtle-bay', label: 'Turtle Bay' },
];

// Lansing Island (Indian Harbour Beach, per Ryan 2026-10-03; originally
// labeled Satellite Beach here) — added 2026-09-23, same day and same
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
 *
 * licenseNumber added 2026-09-25/26 (see BROKERAGE_INFO's comment below for
 * the full history) — this is Ryan's own individual FL sales associate
 * license number, confirmed directly by Ryan. Plain hardcoded value, same
 * reasoning as BROKERAGE_INFO below: compliance/legal text shouldn't
 * silently go blank the way NEXT_PUBLIC_BUSINESS_PHONE did in the past.
 */
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
        blurb: 'Gated oceanfront-to-riverfront golf community north of Sebastian Inlet.',
      },
      {
        // Swapped for Tortoise Island (2026-09-24, per Ryan: "Tortoise
        // island is not in Melbourne beach. You can add harbor island
        // Beach club in its place.") — Tortoise Island removed from this
        // list (2026-10-03: re-homed to Satellite Beach's list once Ryan
        // confirmed the city; the NEIGHBORHOODS seed data still disagrees).
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
        blurb: 'Gated ocean-to-river community of homes, villas, and condos with a private beach and marina.',
      },
      {
        name: 'Beach Woods',
        href: '/neighborhoods/beach-woods',
        blurb: 'Condo and townhome community across several phases, near the beach.',
      },
      // Added 2026-10-05 with the new Melbourne Beach neighborhood pages.
      {
        name: 'Crystal Lakes',
        href: '/neighborhoods/crystal-lakes',
        blurb: 'Custom homes on oversized lots with deepwater canals to the Indian River, just west of A1A.',
      },
      {
        name: 'Floridana Beach',
        href: '/neighborhoods/floridana-beach',
        blurb: 'Quiet, old Florida river-to-ocean community on South A1A with deeded beach access.',
      },
      {
        name: 'Indian Landing',
        href: '/neighborhoods/indian-landing',
        blurb: 'Gated ocean-to-river community with a fishing pier, boat ramp, clubhouse, and pool.',
      },
      {
        name: 'Melbourne Shores',
        href: '/neighborhoods/melbourne-shores',
        blurb: 'Ocean-to-river neighborhood with private beach and river parks, a fishing pier, and boat ramp.',
      },
      {
        name: 'Sunnyland Beach',
        href: '/neighborhoods/sunnyland-beach',
        blurb: 'Canalfront, riverfront, and oceanfront homes with docks and a short boat run to Sebastian Inlet.',
      },
      {
        name: 'Turtle Bay',
        href: '/neighborhoods/turtle-bay',
        blurb: 'Small gated community with riverfront homes, a beachfront cabana, and a fishing dock.',
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
    hoa: 'HOA fees vary widely here — current listings range from around $135/quarter on smaller associations up to $700-$1,250/year on others, with some communities, like guard-gated Lansing Island, carrying their own separate association fees on top. Always confirm the fee on the specific listing.',
    neighborhoods: [
      {
        name: 'Lansing Island',
        href: '/neighborhoods/lansing-island',
        blurb: 'Guard-gated island community of waterfront homes between the Banana River and Indian River Lagoon.',
      },
      // Harbor Island Beach Club removed (2026-10-03, per Ryan: it's in
      // Melbourne Beach, where it's already listed — the backend's
      // NEIGHBORHOODS seed parents it to Indian Harbour Beach by mistake).
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
    // Tortoise Island (2026-10-03, per Ryan: "Tortoise island is located
    // in Satellite Beach") — removed from Melbourne Beach's list 2026-09-24
    // but never re-homed until Ryan confirmed the city.
    neighborhoods: [
      {
        name: 'Tortoise Island',
        href: '/neighborhoods/tortoise-island',
        blurb: 'Guard-gated waterfront community on deep-water canals in South Patrick Shores.',
      },
    ],
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
        blurb: 'Gated, wooded custom-home community on the south side of Viera.',
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
        blurb: 'Gated, custom-home community on Lake Adelaide in northern Viera.',
      },
      {
        name: 'Summer Lakes',
        href: '/neighborhoods/summer-lakes',
        blurb: 'Guard-gated lakefront estate community in central Viera.',
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
      a: 'HOA fees vary widely here — current listings range from around $135/quarter up to $700-$1,250/year, with some communities, like guard-gated Lansing Island, carrying their own separate fees. Always confirm the fee on the specific listing.',
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
  // Viera Builders Communities sub-community sourcing (2026-09-24, per
  // Ryan: "can you do the same thing for the 6 communities listed under
  // viera builders" — pointing at the same grid VIERA_BUILDERS_SUB_
  // COMMUNITIES above renders). These 5 entries (laurasia, pangea-park,
  // reeling-park, crossmolina, farallon-fields) cover 5 of the 6 —
  // atlin-cove is deliberately excluded, matching this file's own
  // VIERA_BUILDERS_SUB_COMMUNITIES comment and sitemap.js's existing
  // gating: it's marked comingSoon with genuinely zero MLS data (re-
  // confirmed live today — a subdivision-filtered query for "Atlin Cove"
  // still returns 0 results, same as when it was first flagged
  // 2026-09-15), unlike Crossmolina/Farallon Fields below which are real,
  // currently-empty-but-active subdivisions. Sourced from the 11 pages
  // Ryan sent across vierabuilders.com (the builder's own community pages
  // for each, plus its communities index and a Farallon Fields blog post)
  // and viera.com (Viera Company's own neighborhood pages for 5 of the
  // 6). Schools cited consistently across every source as Viera
  // Elementary/Viera Middle School/Viera High School/Viera Charter School
  // — the standard Viera Builders slate — corroborated by live MLS data
  // for Laurasia/Pangea Park/Reeling Park below (with Reeling Park's
  // Quest Elementary/DeLaura Middle pattern as the one real exception,
  // confirmed live rather than assumed from the standard slate). Every
  // homesitesTitle override below reads 'New Construction Homes' (or
  // 'New Homes & Condos' for Pangea Park, which genuinely mixes both) —
  // unlike Adelaide/Aripeka's 'Homesites & Builders' default, these are
  // single-builder (Viera Builders only) new-construction communities,
  // not multi-builder custom-homesite ones, so neither the default title
  // nor "Homes & Estates"/"Homes & Homesites" (used for the resale-only
  // communities elsewhere in this file) fit.
  //
  // Laurasia (5 active MLS listings, all clean — no rental/data-quality
  // artifacts): schools unanimous Viera Elementary/Viera High, middle
  // school Viera Middle School on 4 of 5 (1 shows plain "Viera"); HOA a
  // flat $400/quarter across all 5; price $985,000-$1,225,000, sqft
  // 2,931-5,189, lots 0.21-0.5 acres, all built 2024-2025 (matches
  // vierabuilders.com's "starting in the $750s" as a launch price — active
  // resale/remaining inventory now runs higher).
  //
  // Pangea Park (20 listings pulled, 2 discarded as rental artifacts —
  // ids showing $4,500 and $3,000 against sqft that exactly matches other
  // for-sale listings at $829,999/3,243 sqft and typical condo sizes,
  // same "price-per-sqft far below any genuine sale" pattern lib/api.js's
  // own isDataQualityArtifact filter already catches sitewide): 18 clean
  // listings split 2 homes ($769,900-$829,999, 2,766-3,243 sqft) and 16
  // condos ($428,000-$496,000, 1,481-1,921 sqft). Schools: Viera
  // Elementary most common (some condo listings show no elementary
  // field), Viera High unanimous where present, middle school split
  // Viera Middle School (most, especially condos) vs. Johnson Middle
  // School (the 2 homes). HOA: condos $1,225-$1,480/quarter; the one home
  // with a fee showed ~$1,024/year instead (a different billing structure
  // for the home side vs. the condo side).
  //
  // Reeling Park (20 listings pulled, 2 discarded as rental artifacts —
  // $3,800 and $4,650 against sqft matching genuine $649,500/$2,517-sqft
  // and similar for-sale comps): 18 clean home listings (no condos here,
  // matching every source's "courtyard homes" framing), $556,790-
  // $1,175,000, 1,850-3,738 sqft, lots 0.09-0.23 acres. Schools: Quest
  // Elementary/DeLaura Middle dominant (13 and 12 of 18 respectively),
  // Viera Elementary/Viera Middle School also serve part of the
  // community, Viera High effectively unanimous. HOA mostly $585-$676/
  // quarter, with one earlier-built listing billed $400 semi-annually
  // instead.
  //
  // Crossmolina and Farallon Fields both re-confirmed at 0 active MLS
  // listings live today (matching this file's own VIERA_BUILDERS_SUB_
  // COMMUNITIES comment noting both were already "between listings" as of
  // 2026-09-15) — with no live listings to draw from, their homesites/
  // schools/HOA fields below say so honestly and lean on vierabuilders.com's
  // own published starting prices, sqft ranges, and school lists instead
  // of "based on current MLS listings" framing, same approach used for
  // Lansing Island above.
  laurasia: {
    intro:
      'Laurasia is a gated, new-construction community by Viera Builders in Viera, offering 14 floor plans across two collections — Inglenook and Silverado — with Mediterranean-inspired architecture. It’s a walkable, golf-cart-friendly community close to Duran Golf Club, The Avenue Viera, and the Brevard Zoo.',
    amenities:
      'Laurasia includes shaded, tree-lined walking trails, open green space for games and gatherings, and a modern playground, with an outdoor adult workout area planned. Every home comes with Viera Builders’ Healthy Home Advantage program, FPL BuildSmart® energy-efficient construction, and Brilliant Smart Home technology built in, plus a 2-year builder warranty and 10-year structural warranty.',
    homesitesTitle: 'New Construction Homes',
    homesites:
      'Laurasia is built exclusively by Viera Builders, with one- and two-story floor plans from its Inglenook and Silverado collections. Homes run about 2,931–5,189 square feet on lots roughly a quarter- to half-acre.',
    schools:
      'Based on current MLS listings for Laurasia, homes are zoned for Viera Elementary, Viera Middle School, and Viera High School (Brevard Public Schools) — Viera Builders’ own site additionally lists Viera Charter School (K–8) as an option. School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'HOA fees in Laurasia are billed quarterly and run a consistent $400/quarter (roughly $1,600/year) based on current MLS listings. Always confirm the exact fee on the specific listing you’re considering.',
  },

  'pangea-park': {
    intro:
      'Pangea Park is a new-construction community by Viera Builders in South Viera, mixing single-family homes with condos across Craftsman, Modern Coastal, and Farmhouse-style elevations.',
    amenities:
      'Residents share a neighborhood park with a pavilion, playground, tennis courts, and a lap pool. Every home includes Google Smart Home products and FPL BuildSmart® energy-efficient construction designed to cut energy costs by up to 30%, plus Viera Builders’ Healthy Home Advantage certification.',
    homesitesTitle: 'New Homes & Condos',
    homesites:
      'Pangea Park is built exclusively by Viera Builders, mixing single-family homes with condos. Homes run roughly 2,750–3,250 sq ft and condos roughly 1,480–1,920 sq ft.',
    schools:
      'Based on current MLS listings for Pangea Park, most homes are zoned for Viera Elementary and Viera High School, with middle school split between Viera Middle School (most condos) and Johnson Middle School (some homes). School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'HOA fees in Pangea Park are billed quarterly, typically $1,225–$1,480 for condos based on current MLS listings; one home listing instead showed roughly $1,024/year. Always confirm the exact fee on the specific listing you’re considering.',
  },

  'reeling-park': {
    intro:
      'Reeling Park is a new-construction, courtyard-home community by Viera Builders in Viera, built around Traditional Neighborhood Design principles with Spanish Colonial-inspired architecture from its San Marco and Castillo Courtyard Collections — a style similar to Florida’s own St. Augustine.',
    amenities:
      'Reeling Park includes a dog park, a half-basketball court, a tot-lot playground, a sand volleyball court, a multi-use soccer field, picnic areas, and a pavilion with restrooms, plus membership to Addison Village Club’s two swimming pools, tennis, and pickleball facilities. Homes offer optional golf-cart garages, and every home is built to FPL BuildSmart® standards designed to save up to 30% on energy bills.',
    homesitesTitle: 'New Construction Homes',
    homesites:
      'Reeling Park is built exclusively by Viera Builders, with courtyard-style homes from its San Marco and Castillo Courtyard Collections (1,850–2,852 sq ft per the builder). Homes run about 1,850–3,738 square feet on lots roughly a tenth to a quarter acre.',
    schools:
      'Based on current MLS listings for Reeling Park, most homes are zoned for Quest Elementary and DeLaura Middle School (Viera Elementary and Viera Middle School also serve part of the community), with Viera High School effectively unanimous. School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'HOA fees in Reeling Park are billed quarterly and typically run $585–$676 based on current MLS listings, with one earlier-built listing instead billed semi-annually at $400. Always confirm the exact fee on the specific listing you’re considering.',
  },

  crossmolina: {
    intro:
      'Crossmolina is a new-construction community by Viera Builders in Viera, offering one- and two-story homes from its Mia and Ellis floor plan collections. Homes range 1,960–3,108 square feet with flexible layouts supporting multigenerational living.',
    amenities:
      'Crossmolina includes a resort-style community pool, a park, recreational trails, and scenic conservation areas and lakes. Every home comes with Viera Builders’ Healthy Home Advantage program, Brilliant Smart Home technology, FPL BuildSmart® energy-efficient construction, and a 2-year builder warranty plus 10-year structural warranty.',
    homesitesTitle: 'New Construction Homes',
    homesites:
      'Crossmolina is built exclusively by Viera Builders, with one- and two-story floor plans from its Mia and Ellis collections (1,960–3,108 sq ft). Brevard Coastal Homes has no active MLS listings in Crossmolina as of this writing — inventory here moves in and out as new phases release, so these figures come from the builder’s own site rather than live listings.',
    schools:
      'Viera Builders lists Crossmolina as zoned for Viera Elementary, Viera Middle School, and Viera High School (Brevard Public Schools), with Viera Charter School (K–8) also an option — the same slate serving Viera Builders’ other communities nearby. With no active MLS listings here to confirm zoning directly, confirm current school boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'Viera Builders’ own site doesn’t publish a specific HOA fee for Crossmolina, and there are no active MLS listings here to pull one from. Contact us and we can look into current dues for you, or confirm directly with Viera Builders.',
  },

  'farallon-fields': {
    intro:
      'Farallon Fields is a new-construction community by Viera Builders in west Viera, with one- and two-story homes inspired by mid-century modern design. Homes range from 1,740 to nearly 4,000 square feet, with a gated section available for added privacy.',
    amenities:
      'Farallon Fields includes walking and golf-cart paths, lakes and parks throughout the community, a playground and covered pavilion with restrooms, and a golf-cart path with a safe underpass connecting directly to Viera Elementary School. A community pool is planned. Every home comes with Viera Builders’ Healthy Home Advantage program, Brilliant Smart Home technology, and FPL BuildSmart® energy-efficient construction.',
    homesitesTitle: 'New Construction Homes',
    homesites:
      'Farallon Fields is built exclusively by Viera Builders, with one- and two-story floor plans ranging from 1,740 to nearly 4,000 square feet. Brevard Coastal Homes has no active MLS listings in Farallon Fields as of this writing — inventory here moves in and out as new phases release, so these figures come from the builder’s own site rather than live listings.',
    schools:
      'Viera Builders lists Farallon Fields as zoned for Viera Elementary, Viera Middle School, and Viera High School (Brevard Public Schools), with Viera Charter School (K–8) also an option, and notes a golf-cart path with a safe underpass connecting directly to Viera Elementary. With no active MLS listings here to confirm zoning directly, confirm current school boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'Viera Builders’ own site doesn’t publish a specific HOA fee for Farallon Fields, and there are no active MLS listings here to pull one from. Contact us and we can look into current dues for you, or confirm directly with Viera Builders.',
  },

  // Lansing Island sourcing (2026-09-24): all facts below come from the
  // four pages Ryan sent — carpenterkessel.com's development page,
  // lansingisland.net (the community's own site, though light on detail),
  // teamandonia.com's guide, and karrprofessionalgroup.com's community
  // page. Unlike every other neighborhood built out so far, Lansing
  // Island has ZERO active MLS listings as of this writing — confirmed by
  // re-checking both the LANSING_ISLAND_SUBDIVISION_NAMES filter (0
  // results) and a broad keyword search across all Indian Harbour Beach/
  // Satellite Beach listings for "lansing" in subdivision or address
  // fields (also 0 results), same root cause LANSING_ISLAND_SUBDIVISION_
  // NAMES's own comment above already documented on 2026-09-23. With no
  // live listings to fall back on, schools/HOA/price/sqft below are
  // sourced entirely from the four pages rather than "based on current
  // MLS listings" framing used elsewhere in this file, and say so
  // explicitly rather than implying MLS confirmation that doesn't exist.
  // Price range is genuinely wide and inconsistent across sources
  // (carpenterkessel.com: $1.2M-$5M; karrprofessionalgroup.com: existing
  // homes "starting at $500,000"; teamandonia.com: ~$3M average list,
  // ~$2.5M median sale, $4.9M highest recent sale) — given as a full
  // range covering all of them rather than picking one. Schools: Ocean
  // Breeze Elementary, DeLaura Middle School, and Satellite High School
  // are each named by 2 of the 4 sources (teamandonia.com and
  // karrprofessionalgroup.com); karrprofessionalgroup.com additionally
  // lists Hoover Middle School and Indian Harbour Montessori (pre-K-6) as
  // options, included as alternatives. No HOA fee dollar figure appears
  // on any of the four sources, so that field says so honestly instead of
  // guessing. Sets homesitesTitle: 'Homes & Homesites' (see
  // app/neighborhoods/[slug]/page.js) since — like Aripeka — Lansing
  // Island genuinely mixes existing resale homes with buildable vacant
  // lots (ARIPEKA_PROPERTY_TYPE_OPTIONS's Home/Land options apply to
  // isLansingIsland too), but unlike Aripeka/Adelaide, no source names a
  // specific builder here, so the default 'Homesites & Builders' title
  // would overstate what's actually known.
  'lansing-island': {
    intro:
      'Lansing Island is a private, guard-gated barrier-island community in Indian Harbour Beach, reached by a single causeway and covered drawbridge past a manned guardhouse. Fronting the Indian River Lagoon with the Banana River to the west and the Grand Canal to the east, nearly every homesite has direct water access, about a mile from the Atlantic Ocean.',
    amenities:
      'A 24-hour guarded gatehouse with drawbridge access controls the island’s single entry. Residents share a clubhouse (hardwood floors, a granite bar, and a fireplace, per the community’s own site) used for events, plus tennis, pickleball, and basketball courts, a resort-style pool, a fitness center, and a playground. Nearby public parks — Algonquin Sports Complex, Oars and Paddles Park, Gleason Park, and Pelican Park — add beach access and additional recreation a few minutes away.',
    // Reworded 2026-10-03 (per Ryan: "Lansing island doesnt have condos or
    // lots either") — was "mixes existing resale homes with ready-to-build
    // vacant lots for custom construction", from the sources above.
    homesitesTitle: 'Homes & Estates',
    homesites:
      'Lansing Island is all single-family homes — no condos or vacant lots — and no single builder is tied to the community. Homes here range roughly 3,000 to over 10,000 square feet on homesites typically three-quarters of an acre to just under a full acre, with some larger parcels approaching two acres.',
    schools:
      'Area real estate sources most commonly cite Ocean Breeze Elementary, DeLaura Middle School, and Satellite High School for Lansing Island, with Hoover Middle School and Indian Harbour Montessori (pre-K–6) also mentioned as options. With no active MLS listings here to confirm zoning directly, confirm current school boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'None of the sources reviewed publish a specific HOA fee for Lansing Island, and there are no active MLS listings here to pull one from. Contact us and we can look into current dues for you, or confirm directly with the Lansing Island community office.',
  },

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
      'Tortoise Island is a 24-hour guard-gated, waterfront community in South Patrick Shores, accessed through a single entry off Tortoise Drive near the Pineda Causeway and I-95. Built out mostly between the late 1970s and early 2000s across 357 homesites on about 210 acres, it sits along deep-water canals and the Banana/Indian River, with most homesites offering direct water access.',
    amenities:
      'A single guarded entry point and round-the-clock security give Tortoise Island a private, resort-like feel. The Tortoise Island Recreation Center anchors the community with a pool, fitness center, tennis and pickleball courts, and a clubhouse available for events, plus walking paths and native habitat preserved for the community’s namesake gopher tortoises. Most homes have private docks with direct boating access to the Banana River, Indian River Lagoon, and Intracoastal Waterway.',
    homesitesTitle: 'Homes & Estates',
    homesites:
      'Tortoise Island is a built-out, established community rather than new construction — homes here date mostly from the late 1970s to early 2000s on homesites averaging roughly a third to nearly a full acre. Most homes are riverfront with private dock access and run roughly 2,300–6,700 square feet.',
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
      'Summer Lakes is a built-out estate-home community rather than an active new-construction site — homes here date mainly from 2006–2007 on nearly acre-sized lots (roughly 0.7–0.9 acres among current listings), many with private docks, saltwater pools, and outdoor summer kitchens. Homes range roughly 3,200–9,000 square feet.',
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
      'Aquarina’s 18 neighborhoods span a wide range of property types — oceanfront condos, riverfront single-family homes, villas, and townhomes — so pricing varies widely by neighborhood and waterfront exposure rather than following one typical range. Active inventory here is limited at any given time, so new listings are worth watching closely.',
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
      'Suntree isn’t one builder or one subdivision — it’s a collection of many distinct sub-neighborhoods (Suntree Woods, Holiday Springs, Lake Pointe, the golf-course Enclaves, and Cypress Cove’s condos among them), each with its own architecture and price point. Single-family homes typically run roughly 1,500–2,400 sq ft, alongside condos, villas, and larger golf-course estates.',
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
      'Harbor Island Beach Club offers three ways to live in the community: Lennar-built single-family homes (three floorplans, roughly 3,165–4,076 square feet), 4 oceanfront villas, and 88 riverfront or ocean-view condos. Single-family homes run about 2,500–4,700 sq ft, and condos about 1,650–2,150 sq ft.',
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
      'Aripeka is a custom-build community with four builders: CDS Builders, Joyal Homes, LifeStyle Homes, and Stanley Homes. Floor plans range from roughly 2,400 to over 5,000 square feet depending on the builder and model. Vacant homesites, roughly a quarter-acre to half an acre, also come up for sale.',
    schools:
      'Based on current MLS records for Aripeka listings, homes are zoned for Viera Elementary and Viera High School (Brevard Public Schools), with middle school most commonly Viera Middle School (DeLaura Middle School also serves part of the community). Viera Charter School (K–8) is also nearby. School zoning can vary by exact address and does change over time — confirm current boundaries directly with Brevard Public Schools before buying with a specific school in mind.',
    hoa: 'HOA fees in Aripeka are typically billed twice a year at around $750 per installment (roughly $1,500/year) based on current MLS listings. Always confirm the exact fee on the specific listing you’re considering.',
  },

  adelaide: {
    intro:
      'Adelaide is a 460-acre gated, custom-home community in northern Viera, built around Lake Adelaide and a 25-acre water-to-wetlands preserve. One of Brevard County’s higher-end new-construction communities, it’s made up of four distinct sections — The Reserve, The Preserve, The Lakes, and The Park — with homesites from about half an acre to over an acre, more than a third of the community set aside as water or preservation area.',
    amenities:
      'A staffed guard gate controls entry. Residents share a 5-acre park, a 120-acre central recreational lake with a dock and boardwalk for paddle sports, tennis courts, a basketball half-court, a jogging trail system, a community pavilion, and a playground. Because so much of Adelaide is water or preserved wetlands, most homesites get a water or preserve view along with their privacy.',
    // Homes only, no condos or lots (per Ryan, 2026-10-03), so not the
    // default 'Homesites & Builders' heading.
    homesitesTitle: 'Homes & Builders',
    homesites:
      'Adelaide is custom-build only — there’s no production-builder tract here. AR Homes (Rosewood Homes, Inc.), Christopher Burton Luxury Homes, and Elan Builders are the community’s recognized builders. More than 120 homesites are spread across the four sections: The Reserve’s 18 gated residences, The Preserve around the wetlands, The Lakes on or near the main lake, and The Park’s 24 more recently released sites. Completed and under-construction homes run roughly 3,550–5,500 square feet.',
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
  laurasia: [
    {
      q: 'What kind of community is Laurasia in Viera, FL?',
      a: 'Laurasia is a gated, new-construction community by Viera Builders offering 14 floor plans across two collections — Inglenook and Silverado — with Mediterranean-inspired architecture. It’s walkable and golf-cart-friendly, close to Duran Golf Club, The Avenue Viera, and the Brevard Zoo.',
    },
    {
      q: 'Who builds in Laurasia?',
      a: 'Laurasia is built exclusively by Viera Builders, with homes from its Inglenook and Silverado collections.',
    },
    {
      q: 'What amenities does Laurasia have?',
      a: 'Shaded, tree-lined walking trails, open green space for games and gatherings, and a modern playground, with an outdoor adult workout area planned. Every home includes Viera Builders’ Healthy Home Advantage program, FPL BuildSmart® construction, and Brilliant Smart Home technology.',
    },
    {
      q: 'What schools serve Laurasia?',
      a: 'Based on current MLS listings, Laurasia homes are zoned for Viera Elementary, Viera Middle School, and Viera High School, with Viera Charter School (K–8) also an option. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'What is the HOA fee in Laurasia?',
      a: 'HOA fees run a consistent $400 per quarter (roughly $1,600/year) based on current MLS listings. Always confirm the exact fee on the specific listing you’re considering.',
    },
  ],

  'pangea-park': [
    {
      q: 'What kind of community is Pangea Park in Viera, FL?',
      a: 'Pangea Park is a new-construction community by Viera Builders in South Viera, mixing single-family homes with condos across Craftsman, Modern Coastal, and Farmhouse-style elevations.',
    },
    {
      q: 'Does Pangea Park have condos or just single-family homes?',
      a: 'Both — Pangea Park mixes single-family homes with condos. Homes run roughly 2,750–3,250 sq ft and condos roughly 1,480–1,920 sq ft.',
    },
    {
      q: 'What amenities does Pangea Park have?',
      a: 'A neighborhood park with a pavilion, playground, tennis courts, and a lap pool. Every home includes Google Smart Home products and FPL BuildSmart® construction designed to cut energy costs by up to 30%.',
    },
    {
      q: 'What schools serve Pangea Park?',
      a: 'Based on current MLS listings, most Pangea Park homes are zoned for Viera Elementary and Viera High School, with middle school split between Viera Middle School (most condos) and Johnson Middle School (some homes). Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'What is the HOA fee in Pangea Park?',
      a: 'Condos typically run $1,225–$1,480 per quarter based on current MLS listings; one home listing instead showed roughly $1,024/year. Always confirm the exact fee on the specific listing you’re considering.',
    },
  ],

  'reeling-park': [
    {
      q: 'What kind of community is Reeling Park in Viera, FL?',
      a: 'Reeling Park is a new-construction, courtyard-home community by Viera Builders built around Traditional Neighborhood Design principles, with Spanish Colonial-inspired architecture similar to Florida’s own St. Augustine.',
    },
    {
      q: 'Who builds in Reeling Park?',
      a: 'Reeling Park is built exclusively by Viera Builders, with courtyard-style homes from its San Marco and Castillo Courtyard Collections, ranging 1,850–2,852 square feet per the builder.',
    },
    {
      q: 'What amenities does Reeling Park have?',
      a: 'A dog park, a half-basketball court, a tot-lot playground, a sand volleyball court, a multi-use soccer field, picnic areas, and a pavilion with restrooms, plus membership to Addison Village Club’s two swimming pools, tennis, and pickleball facilities.',
    },
    {
      q: 'What schools serve Reeling Park?',
      a: 'Based on current MLS listings, most Reeling Park homes are zoned for Quest Elementary and DeLaura Middle School (Viera Elementary and Viera Middle School also serve part of the community), with Viera High School effectively unanimous. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'What is the HOA fee in Reeling Park?',
      a: 'HOA fees typically run $585–$676 per quarter based on current MLS listings, with one earlier-built listing instead billed semi-annually at $400. Always confirm the exact fee on the specific listing you’re considering.',
    },
  ],

  crossmolina: [
    {
      q: 'What kind of community is Crossmolina in Viera, FL?',
      a: 'Crossmolina is a new-construction community by Viera Builders offering one- and two-story homes from its Mia and Ellis floor plan collections. Homes range 1,960–3,108 square feet with flexible layouts for multigenerational living.',
    },
    {
      q: 'What amenities does Crossmolina have?',
      a: 'A resort-style community pool, a park, recreational trails, and scenic conservation areas and lakes. Every home includes Viera Builders’ Healthy Home Advantage program, Brilliant Smart Home technology, and FPL BuildSmart® construction.',
    },
    {
      q: 'What schools serve Crossmolina?',
      a: 'Viera Builders lists Crossmolina as zoned for Viera Elementary, Viera Middle School, and Viera High School, with Viera Charter School (K–8) also an option. There are no active MLS listings here yet to confirm zoning directly — confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'Is there current inventory in Crossmolina?',
      a: 'Brevard Coastal Homes has no active MLS listings in Crossmolina as of this writing — inventory moves in and out as new phases release. Contact us to be notified as soon as something new comes on the market.',
    },
  ],

  'farallon-fields': [
    {
      q: 'What kind of community is Farallon Fields in Viera, FL?',
      a: 'Farallon Fields is a new-construction community by Viera Builders in west Viera, with one- and two-story homes inspired by mid-century modern design. Homes range from 1,740 to nearly 4,000 square feet, with a gated section available.',
    },
    {
      q: 'What amenities does Farallon Fields have?',
      a: 'Walking and golf-cart paths, lakes and parks throughout the community, a playground and covered pavilion with restrooms, and a golf-cart path with a safe underpass connecting directly to Viera Elementary School. A community pool is planned.',
    },
    {
      q: 'What schools serve Farallon Fields?',
      a: 'Viera Builders lists Farallon Fields as zoned for Viera Elementary, Viera Middle School, and Viera High School, with Viera Charter School (K–8) also an option. There are no active MLS listings here yet to confirm zoning directly — confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
    {
      q: 'Is there current inventory in Farallon Fields?',
      a: 'Brevard Coastal Homes has no active MLS listings in Farallon Fields as of this writing — inventory moves in and out as new phases release. Contact us to be notified as soon as something new comes on the market.',
    },
  ],

  'lansing-island': [
    {
      q: 'What kind of community is Lansing Island?',
      a: 'Lansing Island is a private, guard-gated barrier-island community in Indian Harbour Beach, reached by a single causeway and covered drawbridge past a manned guardhouse. It fronts the Indian River Lagoon, with the Banana River to the west and the Grand Canal to the east.',
    },
    {
      q: 'Is Lansing Island waterfront?',
      a: 'Yes — nearly every homesite on Lansing Island has direct water access via the Banana River or the Grand Canal, and the Atlantic Ocean is about a mile away.',
    },
    {
      q: 'What amenities does Lansing Island have?',
      a: 'A 24-hour guarded gatehouse with drawbridge access, a community clubhouse, tennis, pickleball, and basketball courts, a resort-style pool, a fitness center, and a playground, plus nearby public parks with beach access.',
    },
    {
      q: 'What kinds of homes are in Lansing Island?',
      a: 'Lansing Island is all single-family homes — no condos or vacant lots — ranging from waterfront family homes to luxury estates on homesites typically three-quarters of an acre to just under a full acre. Brevard Coastal Homes has no active MLS listings here as of this writing — contact us to be notified as soon as something new comes on the market.',
    },
    {
      q: 'What schools serve Lansing Island?',
      a: 'Area real estate sources most commonly cite Ocean Breeze Elementary, DeLaura Middle School, and Satellite High School, with Hoover Middle School and Indian Harbour Montessori also mentioned as options. Confirm current boundaries with Brevard Public Schools before buying based on a specific school.',
    },
  ],

  'tortoise-island': [
    {
      q: 'What kind of community is Tortoise Island in South Patrick Shores, FL?',
      a: 'Tortoise Island is a 24-hour guard-gated, waterfront community accessed through a single entry off Tortoise Drive near the Pineda Causeway. It’s built out across 357 homesites on about 210 acres, with homes dating mostly from the late 1970s to early 2000s, along deep-water canals and the Banana/Indian River.',
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
      a: 'The single-family homes are Lennar-built (three floorplans, roughly 3,165–4,076 sq ft); the 4 oceanfront villas are custom units directly on the Atlantic; and the 88 condos are riverfront or ocean-view. ',
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
      a: 'Aripeka is a custom-build community with four builders: CDS Builders, Joyal Homes, LifeStyle Homes, and Stanley Homes. ',
    },
    {
      q: 'Can I buy a vacant lot in Aripeka?',
      a: 'Yes — Aripeka includes both completed custom homes and available vacant homesites. Lots are generally a quarter-acre to half an acre, ready to build with one of the community’s four builders.',
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
    // Added 2026-10-07 (per Ryan) to match how buyers search: "Adelaide in
    // Viera", "Adelaide Viera FL", model home tours.
    {
      q: 'Where is Adelaide in Viera, FL?',
      a: 'Adelaide is in northern Viera in Brevard County, Florida (ZIP 32940), built around Lake Adelaide and a 25-acre water-to-wetlands preserve. It’s part of the Viera master-planned community, close to Viera’s shopping, dining, schools, and I-95.',
    },
    {
      q: 'Can I tour the model homes in Adelaide?',
      a: 'Yes. AR Homes (Rosewood Homes) shows its Lumina model at 3639 Lake Adelaide Place, and Christopher Burton Luxury Homes has a fully furnished waterfront model, The Reserve, in Adelaide’s gated Reserve enclave. Register with your own agent before your first visit so you keep independent representation — Ryan Pohl can schedule model tours with each builder.',
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
//
// 2026-10-04 (per Ryan: non-Viera West homes on /viera-west, "Interstate 95
// is the east boundary"): Viera West now filters on Space Coast MLS's own
// area "217 - Viera West of I 95" instead of a lat/lng box — I-95 runs on a
// diagonal, so no rectangle could follow it (MLS area 217's homes reach
// longitude -80.715, well east of the old -80.74 cutoff). Viera keeps its
// box but leaves out area 217 so the two pages don't overlap.
export const VIERA_WEST_MLS_AREA = '217 - Viera West of I 95';

export function cityListingsQueryParams(citySlug) {
  if (citySlug === 'viera-west') {
    return { mlsArea: VIERA_WEST_MLS_AREA };
  }
  if (citySlug === 'viera') {
    return {
      latMin: VIERA_LAT_MIN,
      latMax: VIERA_LAT_MAX,
      lngMin: VIERA_LNG_MIN,
      lngMax: VIERA_LNG_MAX,
      excludeMlsArea: VIERA_WEST_MLS_AREA,
    };
  }
  return { city: citySlug };
}

// SEO audit fix (2026-09-24, per Ryan: "Lets do this next", pasting the
// audit doc's "Strategic (this quarter)" row — "Wire the backend's
// existing ItemList schema into city/neighborhood listing pages... GET
// /api/seo/listing-collection already builds this... but nothing in the
// frontend calls it — those pages only carry BreadcrumbList today").
// ItemList structured data tells Google "this is a real results page
// listing N items" (can surface as a rich-result carousel), layered on
// top of the BreadcrumbList every city/neighborhood page already gets
// from getCitySeo/getNeighborhoodSeo/getOceanfrontSeo's jsonLd.
//
// The backend endpoint this audit row names (confirmed live: GET
// /api/seo/listing-collection?entityType=city|neighborhood&slug=...)
// works for a plain city page, but isn't used here — it re-queries
// listings from scratch by `city_id`/`neighborhood_id` with no
// page/sort/filter awareness, which has three problems every call site
// below already has to work around some other way:
//  1. `neighborhood_id` is known incomplete for several neighborhoods
//     (Tortoise Island, Summer Lakes, Lansing Island, Aquarina, Suntree —
//     see each *_SUBDIVISION_NAMES constant above), which filter by
//     `subdivision` text match instead. Calling the backend endpoint with
//     entityType=neighborhood for these would silently reintroduce the
//     exact "0 active listings" bug already found and fixed once in this
//     project's Area Guide Market Snapshot (see getListingsFilterParams's
//     comment in app/neighborhoods/[slug]/area-guide/page.js).
//  2. The 6 Viera Builders Communities sub-communities, Beach Woods, and
//     South Merritt Island aren't real `neighborhoods`/`cities` table
//     rows at all (see VIERA_BUILDERS_SUB_COMMUNITIES/
//     BEACH_WOODS_SUBDIVISION_NAMES's own comments) — the backend
//     endpoint 404s for every one of them.
//  3. It ignores pagination/sort/price-beds-baths filtering entirely
//     (always the same first-50-by-insertion-order slice), so it
//     wouldn't necessarily match what a visitor filtering the grid, or
//     viewing page 2, actually sees.
//
// Built here instead, directly from whatever `listings` array a page has
// already fetched with its own correct listingsFilterParams/
// cityListingsQueryParams — this guarantees the ItemList always matches
// what's actually rendered, which is also what Google's structured data
// guidelines require (markup must describe visible content), rather than
// adding a second, separately-filtered fetch that can silently drift from
// it. `total` (not listings.length) is used for numberOfItems per
// schema.org's ItemList spec — the true count across every page, not just
// how many ListItem entries this one page/request includes.
const SITE_URL = 'https://brevardcoastalhomes.com';
export function buildItemListSchema({ pageTitle, path, listings, total, pageStart = 1 }) {
  if (!listings || !listings.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    url: `${SITE_URL}${path}`,
    numberOfItems: typeof total === 'number' ? total : listings.length,
    itemListElement: listings.map((listing, i) => ({
      '@type': 'ListItem',
      position: pageStart + i,
      url: `${SITE_URL}/listings/${listing.id}`,
      name: listing.address,
    })),
  };
}

// Community + agent structured data for COMMUNITY_SEO pages (2026-10-03,
// per Ryan). A `Place` entity for the community itself (so search engines
// and AI tools tie the name to Viera, FL rather than another place with the
// same name) and a `RealEstateAgent` naming it as an area served. Tied to
// the entry's `area` (default Viera). geo is
// included only when the backend's neighborhood row has coordinates, and
// postalCode only where confirmed — never guessed.
export function buildCommunitySchema(slug, { latitude, longitude } = {}, community = COMMUNITY_SEO[slug]) {
  if (!community) return [];
  const pageUrl = `${SITE_URL}/neighborhoods/${slug}`;
  const place = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${pageUrl}#community`,
    name: community.name,
    alternateName: `${community.name} ${community.area || 'Viera'}`,
    description: community.placeDescription,
    url: pageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: community.area || 'Viera',
      addressRegion: 'FL',
      ...(community.postalCode ? { postalCode: community.postalCode } : {}),
      addressCountry: 'US',
    },
    containedInPlace: {
      '@type': 'Place',
      name: `${community.area || 'Viera'}, FL`,
      url: `${SITE_URL}${community.areaPath || '/viera'}`,
    },
    ...(latitude != null && longitude != null
      ? { geo: { '@type': 'GeoCoordinates', latitude, longitude } }
      : {}),
  };
  const agent = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: AGENT_INFO.businessName,
    url: SITE_URL,
    ...(AGENT_INFO.phone ? { telephone: AGENT_INFO.phone } : {}),
    employee: { '@type': 'Person', name: 'Ryan Pohl', url: `${SITE_URL}/about` },
    areaServed: [
      { '@id': `${pageUrl}#community` },
      { '@type': 'Place', name: `${community.area || 'Viera'}, FL` },
      { '@type': 'AdministrativeArea', name: 'Brevard County, FL' },
    ],
  };
  return [place, agent];
}

// City page SEO (2026-10-03, per Ryan: "any suggestions for all of the
// melbourne beach pages?" → "yes do all 6"). Per-page title/description/
// keywords, an optional H1, a page-specific intro sentence that replaces
// the generic "Discover {type} for sale in {city}…" paragraph every city
// page shares (Google treats identical boilerplate across ~70 pages as
// filler), and an "About" section below the listings. Keys are the city
// slug, then `listings` for /{city} or the property slug for
// /{city}/{propertySlug}. Facts come from CITY_AREA_GUIDE_CONTENT /
// CITY_LISTINGS_FAQ for the city.
//
// Melbourne Beach: the MLS "Melbourne Beach" address covers the 1.4-square-
// mile town plus the unincorporated beachside communities south along A1A
// to Sebastian Inlet (Aquarina, Harbor Island Beach Club), so the copy
// says so. It also separates Melbourne Beach from mainland Melbourne
// across the lagoon, which search engines and AI tools often conflate.
export const CITY_PAGE_SEO = {
  'melbourne-beach': {
    name: 'Melbourne Beach',
    placeDescription:
      'Melbourne Beach is a low-rise barrier island town in Brevard County, Florida, between the Indian River Lagoon and the Atlantic Ocean, separate from mainland Melbourne and near Sebastian Inlet.',
    relatedLinks: [
      { href: '/melbourne-beach', label: 'All Melbourne Beach real estate' },
      { href: '/melbourne-beach/homes-for-sale', label: 'Homes for sale' },
      { href: '/melbourne-beach/condos-for-sale', label: 'Condos for sale' },
      { href: '/melbourne-beach/land-for-sale', label: 'Lots & land for sale' },
      { href: '/melbourne-beach/oceanfront-homes-for-sale', label: 'Oceanfront homes' },
      { href: '/melbourne-beach/oceanfront-condos-for-sale', label: 'Oceanfront condos' },
      { href: '/melbourne-beach/oceanfront-listings', label: 'All oceanfront listings' },
      { href: '/melbourne-beach/riverfront-listings', label: 'Riverfront listings' },
      { href: '/neighborhoods/aquarina', label: 'Aquarina' },
      { href: '/neighborhoods/harbor-island-beach-club', label: 'Harbor Island Beach Club' },
      { href: '/neighborhoods/beach-woods', label: 'Beach Woods' },
      { href: '/melbourne-beach/area-guide', label: 'Melbourne Beach Area Guide' },
    ],
    pages: {
      listings: {
        title: 'Melbourne Beach Real Estate | Homes, Condos & Land for Sale',
        description:
          'Melbourne Beach real estate in one place — homes, condos, and land for sale on the barrier island between the Indian River and Atlantic, near Sebastian Inlet.',
        keywords: ['Melbourne Beach real estate', 'Melbourne Beach FL real estate', 'Melbourne Beach homes for sale', 'Melbourne Beach condos for sale', 'Melbourne Beach land for sale'],
        h1: 'Melbourne Beach, FL Real Estate — Homes, Condos & Land for Sale',
        intro:
          'Browse every Melbourne Beach home, condo, and lot for sale in one place. Melbourne Beach is a quiet barrier island town between the Indian River Lagoon and the Atlantic Ocean — separate from mainland Melbourne across the lagoon — with no high-rises and easy access to Sebastian Inlet.',
        aboutHeading: 'About Melbourne Beach Real Estate',
        about: [
          'Melbourne Beach real estate covers the 1.4-square-mile town itself — incorporated in 1923 and low-rise by nature of its size — plus the beachside communities that share its Melbourne Beach address south along A1A to Sebastian Inlet, including Aquarina, Harbor Island Beach Club, and Beach Woods. Most of it is single-family homes and low-rise condo buildings, on the ocean, on the river, and in between.',
          'It’s popular with retirees and second-home buyers drawn to a slower pace than Cocoa Beach or Satellite Beach. Most addresses are zoned for Gemini Elementary, Hoover Middle, and Melbourne High School, and much of the island falls in FEMA coastal flood zones (AE/VE near the water), so check the flood zone and insurance on any property you’re considering.',
        ],
        agentNoun: 'real estate',
      },
      'homes-for-sale': {
        title: 'Melbourne Beach Homes for Sale | Melbourne Beach, FL',
        description:
          'Browse Melbourne Beach homes for sale — beach cottages, riverfront homes, and gated-community homes in a quiet, low-rise island town near Sebastian Inlet.',
        keywords: ['Melbourne Beach homes for sale', 'Melbourne Beach FL homes for sale', 'Melbourne Beach houses for sale', 'Melbourne Beach real estate', 'Melbourne Beach riverfront homes'],
        intro:
          'Browse Melbourne Beach homes for sale on the barrier island between the Indian River Lagoon and the Atlantic Ocean — a quiet, low-rise beach town separate from mainland Melbourne, minutes from Sebastian Inlet.',
        aboutHeading: 'About Melbourne Beach Homes for Sale',
        about: [
          'Melbourne Beach homes for sale range from classic beach cottages and riverfront homes in the 1.4-square-mile town to single-family homes in gated communities like Aquarina and Harbor Island Beach Club further south along A1A. Most single-family homes here carry no HOA, or only a small voluntary neighborhood fee.',
          'Most Melbourne Beach homes are zoned for Gemini Elementary, Hoover Middle, and Melbourne High School. As a barrier island, much of the area sits in FEMA coastal flood zones — AE/VE are common near the water, with X zones further toward the Indian River — which affects flood insurance, so check the exact zone for any home you’re considering.',
        ],
        agentNoun: 'homes',
      },
      'condos-for-sale': {
        title: 'Melbourne Beach Condos for Sale | Melbourne Beach, FL',
        description:
          'Browse Melbourne Beach condos for sale — oceanfront and riverside low-rise condos in Aquarina, Harbor Island Beach Club, Beach Woods, and more, with HOA info.',
        keywords: ['Melbourne Beach condos for sale', 'Melbourne Beach FL condos for sale', 'Melbourne Beach townhomes for sale', 'Melbourne Beach condo HOA fees', 'Melbourne Beach real estate'],
        intro:
          'Browse Melbourne Beach condos for sale — oceanfront, riverside, and in between — in a quiet, low-rise barrier island town between the Indian River Lagoon and the Atlantic, separate from mainland Melbourne.',
        aboutHeading: 'About Melbourne Beach Condos for Sale',
        about: [
          'Melbourne Beach has no high-rises, so condos for sale here are in low-rise buildings and townhome communities, from oceanfront buildings to riverside complexes. Communities like Aquarina, Harbor Island Beach Club, and Beach Woods each have their own association, and condo HOA fees range from roughly $50/month on smaller associations to $1,300+/month in full-amenity oceanfront buildings.',
          'Those fees typically cover exterior maintenance, building insurance, and shared amenities, so compare what’s included, not just the amount. Much of the island sits in FEMA coastal flood zones, which affects a building’s insurance costs — always confirm the HOA fee, what it covers, and the flood zone on the specific listing.',
        ],
        agentNoun: 'condos',
      },
      'land-for-sale': {
        title: 'Melbourne Beach Lots & Land for Sale | Melbourne Beach, FL',
        description:
          'Browse lots and land for sale in Melbourne Beach, FL — buildable homesites on the barrier island between the Indian River Lagoon and the Atlantic Ocean.',
        keywords: ['Melbourne Beach land for sale', 'Melbourne Beach lots for sale', 'Melbourne Beach FL land for sale', 'Melbourne Beach vacant land', 'Melbourne Beach homesites'],
        h1: 'Melbourne Beach, FL Lots & Land For Sale',
        intro:
          'Browse lots and land for sale in Melbourne Beach, a quiet barrier island town between the Indian River Lagoon and the Atlantic Ocean — separate from mainland Melbourne — where vacant homesites are limited by the island’s size.',
        aboutHeading: 'About Melbourne Beach Lots & Land',
        about: [
          'Vacant land is scarce in Melbourne Beach — the town itself covers just 1.4 square miles and is largely built out, so lots and land for sale tend to be infill homesites in town or parcels along A1A south toward Sebastian Inlet.',
          'Before buying a Melbourne Beach lot, check its FEMA flood zone (AE/VE zones near the water carry elevation requirements for new construction), zoning, and utilities. We can pull the flood zone for any lot and help connect you with local builders.',
        ],
        agentNoun: 'lots and land',
      },
      'oceanfront-homes-for-sale': {
        title: 'Melbourne Beach Oceanfront Homes for Sale | Florida',
        description:
          'Browse oceanfront homes for sale in Melbourne Beach, FL — direct Atlantic beach access in a quiet, low-rise barrier island town near Sebastian Inlet.',
        keywords: ['Melbourne Beach oceanfront homes for sale', 'Melbourne Beach FL oceanfront homes', 'Melbourne Beach beachfront homes', 'oceanfront homes Melbourne Beach FL', 'Melbourne Beach real estate'],
        intro:
          'Browse oceanfront homes for sale in Melbourne Beach, where the barrier island’s Atlantic side offers direct beach access in a quiet, low-rise town — separate from mainland Melbourne — near Sebastian Inlet.',
        aboutHeading: 'About Melbourne Beach Oceanfront Homes',
        about: [
          'Oceanfront homes in Melbourne Beach sit directly on the Atlantic side of the barrier island, from homes in the 1.4-square-mile town to gated communities further south along A1A. With no high-rises, the shoreline stays low-density, and Coconut Point Park, a sea turtle nesting beach, sits right in town.',
          'Oceanfront homes typically fall in FEMA’s coastal AE/VE flood zones, which affects flood insurance and any future construction, and most Melbourne Beach homes are zoned for Gemini Elementary, Hoover Middle, and Melbourne High School. Check the exact flood zone for any oceanfront home you’re considering.',
        ],
        agentNoun: 'oceanfront homes',
      },
      'oceanfront-condos-for-sale': {
        title: 'Melbourne Beach Oceanfront Condos for Sale | Florida',
        description:
          'Browse oceanfront condos for sale in Melbourne Beach, FL — low-rise buildings directly on the Atlantic, from smaller associations to full-amenity communities.',
        keywords: ['Melbourne Beach oceanfront condos for sale', 'Melbourne Beach FL oceanfront condos', 'Melbourne Beach beachfront condos', 'oceanfront condos Melbourne Beach FL', 'Melbourne Beach condos for sale'],
        intro:
          'Browse oceanfront condos for sale in Melbourne Beach — low-rise buildings directly on the Atlantic in a quiet barrier island town separate from mainland Melbourne, near Sebastian Inlet.',
        aboutHeading: 'About Melbourne Beach Oceanfront Condos',
        about: [
          'Oceanfront condos in Melbourne Beach are in low-rise buildings, since the town has no high-rises, giving many units direct beach access without a tower’s density. Options run from smaller oceanfront associations to full-amenity buildings in communities like Aquarina and Harbor Island Beach Club.',
          'HOA fees on oceanfront condos here sit toward the higher end of the area’s roughly $50–$1,300+/month range, since they usually cover building insurance, exterior maintenance, and amenities on the coast. Oceanfront buildings fall in FEMA’s coastal flood zones — always confirm the fee, what it covers, and the building’s flood zone on the specific listing.',
        ],
        agentNoun: 'oceanfront condos',
      },
      'oceanfront-listings': {
        title: 'Melbourne Beach Oceanfront Real Estate | Homes & Condos',
        description:
          'Browse every oceanfront home and condo for sale in Melbourne Beach, FL — low-rise Atlantic beachfront in a quiet barrier island town near Sebastian Inlet.',
        keywords: ['Melbourne Beach oceanfront real estate', 'Melbourne Beach oceanfront homes and condos', 'Melbourne Beach beachfront property', 'oceanfront property Melbourne Beach FL'],
        intro:
          'Browse every oceanfront home and condo for sale in Melbourne Beach, a quiet, low-rise barrier island town between the Indian River Lagoon and the Atlantic — separate from mainland Melbourne — near Sebastian Inlet.',
        aboutHeading: 'About Melbourne Beach Oceanfront Real Estate',
        about: [
          'Oceanfront real estate in Melbourne Beach runs along the Atlantic side of the barrier island, from homes and low-rise condo buildings in the 1.4-square-mile town to gated communities like Aquarina and Harbor Island Beach Club further south along A1A. With no high-rises, the shoreline stays low-density, and Coconut Point Park, a sea turtle nesting beach, sits right in town.',
          'Oceanfront property typically falls in FEMA’s coastal AE/VE flood zones, which affects flood insurance and any future construction, and oceanfront condo HOA fees sit toward the higher end of the area’s roughly $50–$1,300+/month range. Always confirm the flood zone — and for condos, the fee and what it covers — on the specific listing.',
        ],
        agentNoun: 'oceanfront homes and condos',
      },
      'riverfront-listings': {
        title: 'Melbourne Beach Riverfront Real Estate | Indian River Lagoon',
        description:
          'Browse Melbourne Beach riverfront homes, condos, and land for sale on the Indian River Lagoon, with the Atlantic just across A1A.',
        keywords: ['Melbourne Beach riverfront homes for sale', 'Melbourne Beach riverfront real estate', 'Melbourne Beach Indian River homes', 'riverfront property Melbourne Beach FL'],
        intro:
          'Browse riverfront homes, condos, and land for sale in Melbourne Beach, on the Indian River Lagoon side of a quiet barrier island town separate from mainland Melbourne, with the Atlantic just across A1A.',
        aboutHeading: 'About Melbourne Beach Riverfront Real Estate',
        about: [
          'Riverfront property in Melbourne Beach faces the Indian River Lagoon on the west side of the barrier island, from homes in the 1.4-square-mile town to riverfront communities like Harbor Island Beach Club further south along A1A — with the beach just across the road.',
          'Flood zones on the river side vary — AE/VE zones are common near the water, with X zones on higher ground — so check the exact zone for any riverfront property. Most Melbourne Beach addresses are zoned for Gemini Elementary, Hoover Middle, and Melbourne High School.',
        ],
        agentNoun: 'riverfront real estate',
      },
    },
  },
};

// Town + agent structured data for CITY_PAGE_SEO cities (2026-10-03). A
// `Place` for the town (separating e.g. Melbourne Beach from mainland
// Melbourne) and a `RealEstateAgent` naming it as an area served. geo only
// when the backend's city row has coordinates.
export function buildCityPlaceSchema(citySlug, { latitude, longitude } = {}) {
  const config = CITY_PAGE_SEO[citySlug];
  if (!config) return [];
  const cityUrl = `${SITE_URL}/${citySlug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      '@id': `${cityUrl}#place`,
      name: config.name,
      alternateName: [`${config.name}, FL`, ...(config.altNames || [])],
      description: config.placeDescription,
      url: cityUrl,
      address: { '@type': 'PostalAddress', addressLocality: config.name, addressRegion: 'FL', addressCountry: 'US' },
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Brevard County, FL' },
      ...(latitude != null && longitude != null ? { geo: { '@type': 'GeoCoordinates', latitude, longitude } } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: AGENT_INFO.businessName,
      url: SITE_URL,
      ...(AGENT_INFO.phone ? { telephone: AGENT_INFO.phone } : {}),
      employee: { '@type': 'Person', name: 'Ryan Pohl', url: `${SITE_URL}/about` },
      areaServed: [{ '@id': `${cityUrl}#place` }, { '@type': 'AdministrativeArea', name: 'Brevard County, FL' }],
    },
  ];
}

// Shared page templates for the other beach towns in CITY_PAGE_SEO
// (Cocoa Beach, Satellite Beach, Indialantic, Indian Harbour Beach —
// 2026-10-03, per Ryan: "roll it out"). Each town supplies its own facts
// (from CITY_AREA_GUIDE_CONTENT / CITY_LISTINGS_FAQ) and this builds the
// same six-page shape as Melbourne Beach's hand-written entry. Titles fall
// back to shorter variants to stay within ~60 characters.
function buildBeachTownSeo(t) {
  const n = t.name;
  const fit = (...options) => options.find((o) => o.length <= 60) || options[options.length - 1];
  const kw = (...phrases) => [...phrases, ...(t.altKeywords || [])];
  const p = `/${t.slug}`;
  return {
    name: n,
    altNames: t.altNames,
    placeDescription: t.placeDescription,
    relatedLinks: [
      { href: p, label: `All ${n} real estate` },
      { href: `${p}/homes-for-sale`, label: 'Homes for sale' },
      { href: `${p}/condos-for-sale`, label: 'Condos for sale' },
      { href: `${p}/land-for-sale`, label: 'Lots & land for sale' },
      { href: `${p}/oceanfront-homes-for-sale`, label: 'Oceanfront homes' },
      { href: `${p}/oceanfront-condos-for-sale`, label: 'Oceanfront condos' },
      { href: `${p}/oceanfront-listings`, label: 'All oceanfront listings' },
      { href: `${p}/riverfront-listings`, label: 'Riverfront listings' },
      ...(t.neighborhoods || []),
      { href: `${p}/area-guide`, label: `${n} Area Guide` },
    ],
    pages: {
      listings: {
        title: fit(`${n} Real Estate | Homes, Condos & Land for Sale`, `${n} Real Estate | Homes, Condos & Land`),
        description: t.descriptions.listings,
        keywords: kw(`${n} real estate`, `${n} FL real estate`, `${n} homes for sale`, `${n} condos for sale`, `${n} land for sale`),
        h1: `${n}, FL Real Estate — Homes, Condos & Land for Sale`,
        intro: `Browse every ${n} home, condo, and lot for sale in one place. ${t.town}`,
        aboutHeading: `About ${n} Real Estate`,
        about: [t.overview, `${t.schools} ${t.flood}`],
        agentNoun: 'real estate',
      },
      'homes-for-sale': {
        title: fit(`${n} Homes for Sale | ${n}, FL`, `${n} Homes for Sale | Brevard County, FL`, `${n} Homes for Sale | FL`),
        description: t.descriptions.homes,
        keywords: kw(`${n} homes for sale`, `${n} FL homes for sale`, `${n} houses for sale`, `${n} real estate`),
        intro: `Browse ${n} homes for sale. ${t.town}`,
        aboutHeading: `About ${n} Homes for Sale`,
        about: [t.homes, `${t.schools} ${t.flood}`],
        agentNoun: 'homes',
      },
      'condos-for-sale': {
        title: fit(`${n} Condos for Sale | ${n}, FL`, `${n} Condos for Sale | Brevard County, FL`, `${n} Condos for Sale | FL`),
        description: t.descriptions.condos,
        keywords: kw(`${n} condos for sale`, `${n} FL condos for sale`, `${n} townhomes for sale`, `${n} condo HOA fees`),
        intro: `Browse ${n} condos for sale. ${t.town}`,
        aboutHeading: `About ${n} Condos for Sale`,
        about: [
          t.condos,
          `Condo HOA fees typically cover exterior maintenance, building insurance, and shared amenities, so compare what’s included, not just the amount. ${t.flood}`,
        ],
        agentNoun: 'condos',
      },
      'land-for-sale': {
        title: fit(`${n} Lots & Land for Sale | ${n}, FL`, `${n} Lots & Land for Sale | Brevard, FL`, `${n} Lots & Land for Sale | FL`),
        description: t.descriptions.land,
        keywords: kw(`${n} land for sale`, `${n} lots for sale`, `${n} FL land for sale`, `${n} vacant land`),
        h1: `${n}, FL Lots & Land For Sale`,
        intro: `Browse lots and land for sale in ${n}. ${t.town}`,
        aboutHeading: `About ${n} Lots & Land`,
        about: [
          t.land,
          `Before buying a ${n} lot, check its FEMA flood zone (AE/VE zones near the water carry elevation requirements for new construction), zoning, and utilities. We can pull the flood zone for any lot and help connect you with local builders.`,
        ],
        agentNoun: 'lots and land',
      },
      'oceanfront-homes-for-sale': {
        title: fit(`${n} Oceanfront Homes for Sale | Florida`, `${n} Oceanfront Homes for Sale | FL`),
        description: t.descriptions.oceanfrontHomes,
        keywords: kw(`${n} oceanfront homes for sale`, `${n} FL oceanfront homes`, `${n} beachfront homes`, `oceanfront homes ${n} FL`),
        intro: `Browse oceanfront homes for sale in ${n}. ${t.town}`,
        aboutHeading: `About ${n} Oceanfront Homes`,
        about: [
          `${t.ocean} Oceanfront homes here offer direct Atlantic beach access, and inventory is limited at any given time.`,
          `Oceanfront homes typically fall in FEMA’s coastal AE/VE flood zones, which affects flood insurance and any future construction. ${t.schools}`,
        ],
        agentNoun: 'oceanfront homes',
      },
      'oceanfront-condos-for-sale': {
        title: fit(`${n} Oceanfront Condos for Sale | Florida`, `${n} Oceanfront Condos for Sale | FL`),
        description: t.descriptions.oceanfrontCondos,
        keywords: kw(`${n} oceanfront condos for sale`, `${n} FL oceanfront condos`, `${n} beachfront condos`, `oceanfront condos ${n} FL`),
        intro: `Browse oceanfront condos for sale in ${n}. ${t.town}`,
        aboutHeading: `About ${n} Oceanfront Condos`,
        about: [
          `${t.ocean} Oceanfront condos here give direct beach access, with amenities and association fees that vary by building.`,
          'Oceanfront condo HOA fees usually cover building insurance, exterior maintenance, and amenities on the coast, and oceanfront buildings fall in FEMA’s coastal flood zones — always confirm the fee, what it covers, and the building’s flood zone on the specific listing.',
        ],
        agentNoun: 'oceanfront condos',
      },
      'oceanfront-listings': {
        title: fit(`${n} Oceanfront Real Estate | Homes & Condos`, `${n} Oceanfront Homes & Condos | FL`),
        description: t.descriptions.oceanfrontListings,
        keywords: kw(`${n} oceanfront real estate`, `${n} oceanfront homes and condos`, `${n} beachfront property`, `oceanfront property ${n} FL`),
        intro: `Browse every oceanfront home and condo for sale in ${n}. ${t.town}`,
        aboutHeading: `About ${n} Oceanfront Real Estate`,
        about: [
          `${t.ocean} Oceanfront homes and condos here offer direct Atlantic beach access, and inventory is limited at any given time.`,
          'Oceanfront property typically falls in FEMA’s coastal AE/VE flood zones, which affects flood insurance and any future construction, and oceanfront condo HOA fees usually cover building insurance, exterior maintenance, and amenities. Always confirm the flood zone — and for condos, the fee and what it covers — on the specific listing.',
        ],
        agentNoun: 'oceanfront homes and condos',
      },
      'riverfront-listings': {
        title: fit(`${n} Riverfront Real Estate | ${t.river}`, `${n} Riverfront Real Estate | FL`),
        description: t.descriptions.riverfrontListings,
        keywords: kw(`${n} riverfront homes for sale`, `${n} riverfront real estate`, `${n} ${t.river} homes`, `riverfront property ${n} FL`),
        intro: `Browse riverfront homes, condos, and land for sale in ${n}, on the ${t.river}. ${t.town}`,
        aboutHeading: `About ${n} Riverfront Real Estate`,
        about: [t.riverfront, `${t.flood} ${t.schools}`],
        agentNoun: 'riverfront real estate',
      },
    },
  };
}

// CITY_PAGE_SEO entries for the mainland/river-island cities (Melbourne,
// Rockledge, Merritt Island — 2026-10-03, per Ryan): their riverfront
// Listings page first, then (same day, "yes, do Melbourne, Rockledge and
// Merritt Island") their main, homes, condos and land pages. Not beach
// towns, so no oceanfront pages. `titleName` lets Melbourne's titles say
// "Melbourne, FL" (Melbourne, Australia dominates searches for the bare
// name). Also used for Viera and Viera West (same day), which have no
// riverfront Listings page — `riverfront` is optional.
function buildRiverCitySeo(t) {
  const n = t.name;
  const tn = t.titleName || n;
  const p = `/${t.slug}`;
  const fit = (...options) => options.find((o) => o.length <= 60) || options[options.length - 1];
  return {
    name: n,
    altNames: t.altNames,
    placeDescription: t.placeDescription,
    relatedLinks: [
      { href: p, label: `All ${n} real estate` },
      { href: `${p}/homes-for-sale`, label: 'Homes for sale' },
      { href: `${p}/condos-for-sale`, label: 'Condos for sale' },
      { href: `${p}/land-for-sale`, label: 'Lots & land for sale' },
      ...(t.riverfront ? [{ href: `${p}/riverfront-listings`, label: 'Riverfront listings' }] : []),
      ...(t.neighborhoods || []),
      { href: `${p}/area-guide`, label: `${n} Area Guide` },
    ],
    pages: {
      // Optional: Viera/Viera West have no riverfront Listings page.
      ...(t.riverfront ? { 'riverfront-listings': {
        title: t.riverTitle,
        description: t.description,
        keywords: [`${n} riverfront homes for sale`, `${n} riverfront real estate`, `${n} waterfront homes`, `riverfront property ${n} FL`],
        intro: `Browse riverfront homes, condos, and land for sale in ${n}. ${t.town}`,
        aboutHeading: `About ${n} Riverfront Real Estate`,
        about: [t.riverfront, `${t.riverFlood} ${t.schools}`],
        agentNoun: 'riverfront real estate',
      } } : {}),
      listings: {
        title: fit(`${tn} Real Estate | Homes, Condos & Land for Sale`, `${tn} Real Estate | Homes, Condos & Land`),
        description: t.descriptions.listings,
        keywords: [`${n} real estate`, `${n} FL real estate`, `${n} FL homes for sale`, `${n} FL condos for sale`, `${n} FL land for sale`],
        h1: `${n}, FL Real Estate — Homes, Condos & Land for Sale`,
        intro: `Browse every ${n} home, condo, and lot for sale in one place. ${t.town}`,
        aboutHeading: `About ${n} Real Estate`,
        about: [t.overview, `${t.schools} ${t.flood}`],
        agentNoun: 'real estate',
      },
      'homes-for-sale': {
        title: fit(`${tn} Homes for Sale | ${tn === n ? `${n}, FL` : 'Brevard County Real Estate'}`, `${tn} Homes for Sale | Brevard County, FL`),
        description: t.descriptions.homes,
        keywords: [`${n} FL homes for sale`, `${n} homes for sale`, `${n} FL houses for sale`, `${n} real estate`],
        intro: `Browse ${n} homes for sale. ${t.town}`,
        aboutHeading: `About ${n} Homes for Sale`,
        about: [t.homes, `${t.schools} ${t.flood}`],
        agentNoun: 'homes',
      },
      'condos-for-sale': {
        title: fit(`${tn} Condos for Sale | ${tn === n ? `${n}, FL` : 'Brevard County Real Estate'}`, `${tn} Condos for Sale | Brevard County, FL`),
        description: t.descriptions.condos,
        keywords: [`${n} FL condos for sale`, `${n} condos for sale`, `${n} townhomes for sale`, `${n} condo HOA fees`],
        intro: `Browse ${n} condos and townhomes for sale. ${t.town}`,
        aboutHeading: `About ${n} Condos for Sale`,
        about: [
          t.condos,
          `Condo and townhome HOA fees typically cover exterior maintenance, building insurance, and shared amenities, so compare what’s included, not just the amount. ${t.flood}`,
        ],
        agentNoun: 'condos',
      },
      'land-for-sale': {
        title: fit(`${tn} Lots & Land for Sale | ${tn === n ? `${n}, FL` : 'Brevard County'}`, `${tn} Lots & Land for Sale | Brevard, FL`),
        description: t.descriptions.land,
        keywords: [`${n} FL land for sale`, `${n} lots for sale`, `${n} vacant land`, `${n} homesites`],
        h1: `${n}, FL Lots & Land For Sale`,
        intro: `Browse lots and land for sale in ${n}. ${t.town}`,
        aboutHeading: `About ${n} Lots & Land`,
        about: [
          t.land,
          `Before buying a ${n} lot, check its FEMA flood zone, zoning, and utilities — lots near the water can carry elevation requirements for new construction. We can pull the flood zone for any lot and help connect you with local builders.`,
        ],
        agentNoun: 'lots and land',
      },
    },
  };
}

const COCOA_BEACH_SEO = buildBeachTownSeo({
  slug: 'cocoa-beach',
  name: 'Cocoa Beach',
  placeDescription:
    'Cocoa Beach is a barrier island city in Brevard County, Florida, along 5.6 miles of Atlantic oceanfront, separate from the mainland city of Cocoa across the Indian River.',
  town: 'Cocoa Beach is Brevard County’s best-known beach town — a barrier island city along 5.6 miles of Atlantic oceanfront, separate from the mainland city of Cocoa across the Indian River, with the Cocoa Beach Pier and Kennedy Space Center launches visible from the beach.',
  overview:
    'Incorporated in 1925, Cocoa Beach runs along 5.6 miles of Atlantic oceanfront, with the Banana River and its canal-laced Thousand Islands neighborhoods on the west side. Known as Florida’s surfing capital — home to Ron Jon Surf Shop and the Easter Surfing Festival — it draws both full-time residents and second-home buyers, and its market has as many condos as single-family homes.',
  schools:
    'Cocoa Beach listings split mainly between Cape View and Roosevelt Elementary, with nearly every address zoned for Cocoa Beach Jr/Sr High School.',
  flood:
    'Built partly on dredged fill from the Banana River, most of Cocoa Beach sits in FEMA coastal flood zones (AE/VE), which usually means a lender requires flood insurance — check the zone on any property you’re considering.',
  homes:
    'Cocoa Beach homes for sale range from oceanside homes near the beach to canal-front homes in the Thousand Islands neighborhoods along the Banana River, many with water access. Single-family homes, especially in the canal neighborhoods, are more likely to have a modest HOA fee or none at all.',
  condos:
    'Cocoa Beach’s market leans heavily toward condos, from oceanfront buildings to riverside complexes, so HOA fees are the norm — recent listings show fees from roughly $125/month on smaller buildings to $900+/quarter on larger ones.',
  land: 'Cocoa Beach is a built-out barrier island city, so lots and land for sale are limited and typically infill homesites, including canal-front lots on the Banana River side.',
  ocean:
    'Oceanfront property in Cocoa Beach lines 5.6 miles of Atlantic shoreline, a short drive from the Cocoa Beach Pier, with Kennedy Space Center launches visible from the beach.',
  river: 'Banana River',
  riverfront:
    'Riverfront property in Cocoa Beach lines the Banana River on the island’s west side, including the canal-laced Thousand Islands neighborhoods, where many homes have water access — with the Atlantic a short drive east.',
  descriptions: {
    oceanfrontListings:
      'Browse every oceanfront home and condo for sale in Cocoa Beach, FL — direct Atlantic beach access along 5.6 miles of shoreline near the Cocoa Beach Pier.',
    riverfrontListings:
      'Browse Cocoa Beach riverfront homes, condos, and land for sale on the Banana River, including canal-front homes in the Thousand Islands neighborhoods.',
    listings:
      'Cocoa Beach real estate in one place — homes, condos, and land for sale along 5.6 miles of barrier island oceanfront in Florida’s surfing capital.',
    homes:
      'Browse Cocoa Beach homes for sale — oceanside homes and canal-front homes in the Thousand Islands on the Banana River, in Florida’s surfing capital.',
    condos:
      'Browse Cocoa Beach condos for sale — oceanfront and riverside condos in Florida’s surfing capital, near the Cocoa Beach Pier, with HOA fee info.',
    land: 'Browse lots and land for sale in Cocoa Beach, FL — infill and canal-front homesites on the barrier island between the Banana River and the Atlantic.',
    oceanfrontHomes:
      'Browse oceanfront homes for sale in Cocoa Beach, FL — direct Atlantic beach access along 5.6 miles of shoreline near the Cocoa Beach Pier.',
    oceanfrontCondos:
      'Browse oceanfront condos for sale in Cocoa Beach, FL — beachfront buildings along 5.6 miles of Atlantic shoreline in Florida’s surfing capital.',
  },
});

const SATELLITE_BEACH_SEO = buildBeachTownSeo({
  slug: 'satellite-beach',
  name: 'Satellite Beach',
  placeDescription:
    'Satellite Beach is the largest beachside city in South Brevard County, Florida, on the barrier island between the Atlantic Ocean and the Banana River, just south of Patrick Space Force Base.',
  town: 'Satellite Beach is the largest beachside community in South Brevard — an established barrier island city between the Atlantic Ocean and the Banana River, just south of Patrick Space Force Base.',
  overview:
    'Incorporated in 1957, Satellite Beach has about 7.7 miles of beach and canal shoreline between the Atlantic and the Banana River. It’s known for its early commitment to solar power and beach restoration, sea turtle nesting beaches, and an established, affluent residential character, and guard-gated Tortoise Island nearby shares its Satellite Beach address.',
  schools:
    'Most Satellite Beach addresses are zoned for DeLaura Middle and Satellite High School, with elementary zoning split mainly between Sea Park, Surfside, and Holland Elementary.',
  flood:
    'As a barrier island city, most of Satellite Beach sits in FEMA coastal flood zones (AE/VE), which usually means a lender requires flood insurance — check the zone on any property you’re considering.',
  homes:
    'Satellite Beach homes for sale are mostly in established single-family neighborhoods, including canal-front homes with Banana River access and guard-gated waterfront homes on nearby Tortoise Island. Single-family homes are more likely to have no HOA or a smaller one than the city’s condo buildings.',
  condos:
    'Satellite Beach condos range from oceanfront buildings to riverside complexes, and HOA fees are fairly consistent — recent listings commonly show fees around $380–$385/month.',
  land: 'Satellite Beach is a largely built-out barrier island city, so lots and land for sale are limited and typically infill homesites, including occasional canal-front lots.',
  ocean:
    'Oceanfront property in Satellite Beach sits along restored Atlantic beaches where sea turtles nest each season, just south of Patrick Space Force Base.',
  neighborhoods: [{ href: '/neighborhoods/tortoise-island', label: 'Tortoise Island' }],
  river: 'Banana River',
  riverfront:
    'Riverfront property in Satellite Beach sits along the Banana River and its canals on the west side of the island, with sunset views across the river and water access from many canal-front homes.',
  descriptions: {
    oceanfrontListings:
      'Browse every oceanfront home and condo for sale in Satellite Beach, FL — restored Atlantic beaches with sea turtle nesting, south of Patrick SFB.',
    riverfrontListings:
      'Browse Satellite Beach riverfront homes, condos, and land for sale on the Banana River and its canals, in South Brevard’s largest beachside city.',
    listings:
      'Satellite Beach real estate in one place — homes, condos, and land for sale in South Brevard’s largest beachside city, between the Atlantic and Banana River.',
    homes:
      'Browse Satellite Beach homes for sale — established neighborhoods, canal-front homes with Banana River access, and guard-gated Tortoise Island.',
    condos:
      'Browse Satellite Beach condos for sale — oceanfront and riverside condos in South Brevard’s largest beachside city, with HOA fee info.',
    land: 'Browse lots and land for sale in Satellite Beach, FL — infill and canal-front homesites on the barrier island between the Atlantic and the Banana River.',
    oceanfrontHomes:
      'Browse oceanfront homes for sale in Satellite Beach, FL — direct Atlantic beach access on restored sea turtle nesting beaches south of Patrick SFB.',
    oceanfrontCondos:
      'Browse oceanfront condos for sale in Satellite Beach, FL — beachfront buildings on restored Atlantic beaches in South Brevard’s largest beach city.',
  },
});

const INDIALANTIC_SEO = buildBeachTownSeo({
  slug: 'indialantic',
  name: 'Indialantic',
  placeDescription:
    'Indialantic is a small barrier island town in Brevard County, Florida, between the Indian River Lagoon and the Atlantic Ocean, across the Melbourne Causeway from mainland Melbourne.',
  town: 'Indialantic is a small, established barrier island town across the Melbourne Causeway from mainland Melbourne, between the Indian River Lagoon and the Atlantic Ocean, with a quieter, more residential feel than Cocoa Beach.',
  overview:
    'Incorporated in 1952 as Indialantic-By-The-Sea, the town covers just over a square mile between the Indian River Lagoon and the Atlantic, with its own police and fire departments and a stretch of A1A recognized as one of Florida’s best scenic drives. It’s a mature, established community — the median age is 52.',
  schools:
    'Indialantic listings are essentially unanimous on school zoning: Indialantic Elementary, Hoover Middle, and Melbourne High School.',
  flood:
    'As a barrier island town, most of Indialantic sits in FEMA coastal flood zones (AE/VE), which usually means a lender requires flood insurance — check the zone on any property you’re considering.',
  homes:
    'Indialantic homes for sale are mostly established single-family homes on the narrow strip between the river and the ocean. Most carry no HOA or a modest fee — recent listings range from about $300/year to roughly $500/quarter.',
  condos:
    'Indialantic condos are mainly beachside buildings along A1A, with HOA fees commonly from $125/month and up depending on amenities.',
  land: 'At just over a square mile and largely built out, Indialantic has few vacant lots, so land for sale here is typically an occasional infill homesite.',
  ocean:
    'Oceanfront property in Indialantic sits along the town’s stretch of Atlantic beach on scenic A1A, minutes across the Melbourne Causeway from the mainland.',
  river: 'Indian River Lagoon',
  riverfront:
    'Riverfront property in Indialantic faces the Indian River Lagoon on the west side of the narrow island, across from mainland Melbourne, with the ocean a short walk or bike ride away.',
  descriptions: {
    oceanfrontListings:
      'Browse every oceanfront home and condo for sale in Indialantic, FL — Atlantic beachfront on scenic A1A, across the causeway from Melbourne.',
    riverfrontListings:
      'Browse Indialantic riverfront homes, condos, and land for sale on the Indian River Lagoon, across the causeway from mainland Melbourne.',
    listings:
      'Indialantic real estate in one place — homes, condos, and land for sale in a small barrier island town across the causeway from Melbourne, FL.',
    homes:
      'Browse Indialantic homes for sale — established single-family homes between the Indian River and the Atlantic, across the causeway from Melbourne.',
    condos:
      'Browse Indialantic condos for sale — beachside condos along scenic A1A, across the Melbourne Causeway from the mainland, with HOA fee info.',
    land: 'Browse lots and land for sale in Indialantic, FL — infill homesites in a small barrier island town between the Indian River and the Atlantic.',
    oceanfrontHomes:
      'Browse oceanfront homes for sale in Indialantic, FL — direct Atlantic beach access on scenic A1A, across the causeway from Melbourne.',
    oceanfrontCondos:
      'Browse oceanfront condos for sale in Indialantic, FL — beachfront buildings on scenic A1A, across the Melbourne Causeway from the mainland.',
  },
});

const INDIAN_HARBOUR_BEACH_SEO = buildBeachTownSeo({
  slug: 'indian-harbour-beach',
  name: 'Indian Harbour Beach',
  // Commonly searched with the American spelling too.
  altNames: ['Indian Harbor Beach'],
  altKeywords: ['Indian Harbor Beach real estate', 'Indian Harbor Beach homes for sale'],
  placeDescription:
    'Indian Harbour Beach is a barrier island city in Brevard County, Florida, between the Atlantic Ocean and the Banana River, between Indialantic and Satellite Beach.',
  town: 'Indian Harbour Beach is a mid-size barrier island city between Indialantic and Satellite Beach, stretching from the Atlantic Ocean to the Banana River, with single-family neighborhoods and waterfront communities.',
  overview:
    'Incorporated in 1955, Indian Harbour Beach covers 2.67 square miles between the Atlantic Ocean and the Banana River. It was the first community on the East Coast certified NOAA Tsunami Ready, and its beaches and river shoreline support nesting sea turtles and manatee habitat. Guard-gated Lansing Island, with waterfront homes reached by a covered drawbridge, is one of its best-known communities.',
  schools:
    'Most Indian Harbour Beach addresses are zoned for Ocean Breeze Elementary, Hoover Middle, and Satellite High School, though some are zoned for DeLaura Middle instead.',
  flood:
    'As a barrier island city, most of Indian Harbour Beach sits in FEMA coastal flood zones (AE/VE), which usually means a lender requires flood insurance — check the zone on any property you’re considering.',
  homes:
    'Indian Harbour Beach homes for sale range from established single-family neighborhoods to waterfront homes along the Banana River and on guard-gated Lansing Island. HOA fees vary widely — recent listings range from about $135/quarter to $700–$1,250/year, and some communities carry their own association fees.',
  condos:
    'Indian Harbour Beach condos include oceanfront and riverside communities, each with its own association, and fees vary widely by building — confirm what’s included on each listing.',
  land: 'Indian Harbour Beach is largely built out, so lots and land for sale are limited and typically infill homesites, some with Banana River access.',
  ocean:
    'Oceanfront property in Indian Harbour Beach sits along beaches where sea turtles nest each season, between Indialantic and Satellite Beach.',
  neighborhoods: [{ href: '/neighborhoods/lansing-island', label: 'Lansing Island' }],
  river: 'Banana River',
  riverfront:
    'Riverfront property in Indian Harbour Beach sits along the Banana River, including guard-gated Lansing Island, where nearly every homesite has direct water access.',
  descriptions: {
    oceanfrontListings:
      'Browse every oceanfront home and condo for sale in Indian Harbour Beach, FL — Atlantic beachfront between Indialantic and Satellite Beach.',
    riverfrontListings:
      'Browse Indian Harbour Beach riverfront homes, condos, and land for sale on the Banana River, including guard-gated Lansing Island.',
    listings:
      'Indian Harbour Beach real estate in one place — homes, condos, and land for sale on the barrier island between Indialantic and Satellite Beach.',
    homes:
      'Browse Indian Harbour Beach homes for sale — established neighborhoods and Banana River waterfront homes, including guard-gated Lansing Island.',
    condos:
      'Browse Indian Harbour Beach condos for sale — oceanfront and riverside condos between Indialantic and Satellite Beach, with HOA fee info.',
    land: 'Browse lots and land for sale in Indian Harbour Beach, FL — infill homesites on the barrier island between the Atlantic and the Banana River.',
    oceanfrontHomes:
      'Browse oceanfront homes for sale in Indian Harbour Beach, FL — direct Atlantic beach access on sea turtle nesting beaches in South Brevard.',
    oceanfrontCondos:
      'Browse oceanfront condos for sale in Indian Harbour Beach, FL — beachfront buildings between Indialantic and Satellite Beach.',
  },
});

const MELBOURNE_RIVER_SEO = buildRiverCitySeo({
  slug: 'melbourne',
  name: 'Melbourne',
  placeDescription:
    'Melbourne is Brevard County’s largest city, on the Florida mainland along the Indian River Lagoon, separate from the barrier island town of Melbourne Beach.',
  riverTitle: 'Melbourne, FL Riverfront Real Estate | Indian River Lagoon',
  description:
    'Browse Melbourne riverfront homes, condos, and land for sale on the Indian River Lagoon, from Downtown Melbourne to the Eau Gallie Arts District.',
  town: 'Melbourne is Brevard County’s largest city — a mainland hub along the Indian River Lagoon with two historic downtown districts, separate from the beach town of Melbourne Beach across the lagoon.',
  titleName: 'Melbourne, FL',
  altNames: ['Melbourne, Florida'],
  riverfront:
    'Riverfront property in Melbourne faces the Indian River Lagoon along the mainland shore, from homes near Historic Downtown Melbourne and the Eau Gallie Arts District to riverfront estates, with the beaches a causeway away.',
  riverFlood:
    'Waterfront and low-lying areas near the river can fall into FEMA’s AE flood zone, while most of the city sits in the lower-risk X zone, so check the exact zone for any riverfront property.',
  flood:
    'Most of Melbourne sits in FEMA’s lower-risk X flood zone, while waterfront and low-lying areas near the river can fall into the AE zone — check the zone on any property you’re considering.',
  schools:
    'School zoning varies significantly by neighborhood in Melbourne — listings are most commonly zoned for University Park, Quest, or Suntree Elementary; Johnson, DeLaura, or Stone Middle; and Viera, Melbourne, or Eau Gallie High School.',
  overview:
    'Incorporated in 1888 and merged with Eau Gallie in 1969, Melbourne is home to Melbourne Orlando International Airport, L3Harris Technologies’ headquarters, the Brevard Zoo, and two downtown districts — Historic Downtown Melbourne and the Eau Gallie Arts District. With over 84,000 residents, it’s Brevard County’s largest and most diverse city, with a younger median age than the beach towns.',
  homes:
    'Melbourne homes for sale range from older, established neighborhoods with no HOA to newer subdivisions, riverfront homes, and golf communities like Suntree. Newer communities carry HOA fees — recent listings run from about $165/year on small associations to $400+/quarter.',
  condos:
    'Melbourne condos range from starter condos to units in newer buildings near the river and the two downtown districts, with association fees that vary by building — confirm what’s included on each listing.',
  land: 'As Brevard County’s largest city, Melbourne has far more vacant land than the barrier islands, from infill lots in established neighborhoods to larger parcels for new construction.',
  descriptions: {
    listings:
      'Melbourne, FL real estate in one place — homes, condos, and land for sale in Brevard’s largest city, from Downtown Melbourne to the Eau Gallie Arts District.',
    homes:
      'Browse Melbourne, FL homes for sale — established neighborhoods, newer subdivisions, and riverfront homes in Brevard County’s largest city.',
    condos:
      'Browse Melbourne, FL condos for sale — from starter condos to newer buildings near the Indian River and two historic downtowns, with HOA info.',
    land: 'Browse lots and land for sale in Melbourne, FL — infill lots and larger parcels in Brevard County’s largest city on the Indian River Lagoon.',
  },
  neighborhoods: [{ href: '/neighborhoods/suntree', label: 'Suntree' }],
});

const ROCKLEDGE_RIVER_SEO = buildRiverCitySeo({
  slug: 'rockledge',
  name: 'Rockledge',
  placeDescription:
    'Rockledge is Brevard County’s oldest incorporated city, on the Florida mainland along the Indian River Lagoon between Cocoa and Viera.',
  riverTitle: 'Rockledge Riverfront Real Estate | Indian River Lagoon',
  description:
    'Browse Rockledge riverfront homes, condos, and land for sale on the Indian River Lagoon, including historic riverfront homes in Brevard’s oldest city.',
  town: 'Rockledge is Brevard County’s oldest incorporated city — a mainland community along the Indian River Lagoon between Cocoa and Viera, with historic riverfront homes and newer subdivisions to the west.',
  riverfront:
    'Riverfront property in Rockledge faces the Indian River Lagoon, home to some of Brevard County’s oldest riverfront homes, dating back to the city’s 1880s citrus and river-tourism roots.',
  overview:
    'Founded in 1887, Rockledge is the oldest incorporated city in Brevard County, rooted in citrus groves and early Indian River tourism. Today it’s a mainland community of about 27,700 people between Cocoa to the north and Viera and Melbourne to the south, with 17 public parks and a mature, established character.',
  homes:
    'Rockledge homes for sale range from historic homes along the Indian River to newer subdivisions west toward Viera. Most older neighborhoods carry no HOA, while newer subdivisions do — recent listings range from about $250 semi-annually to $600/quarter.',
  condos:
    'Rockledge condos and townhomes offer a lower-maintenance option in a mainland city between Cocoa and Viera, with association fees that vary by community — confirm what’s included on each listing.',
  land: 'Rockledge has more room for new construction than the built-out barrier islands, from infill lots in established neighborhoods to sites in its newer areas west toward Viera.',
  flood:
    'As a mainland city with no oceanfront, Rockledge generally carries lower flood risk than the barrier islands — most of the city sits in FEMA’s X zone, though low-lying areas along the river can fall into the AE zone.',
  descriptions: {
    listings:
      'Rockledge, FL real estate in one place — homes, condos, and land for sale in Brevard County’s oldest city, on the Indian River between Cocoa and Viera.',
    homes:
      'Browse Rockledge homes for sale — historic riverfront homes and newer subdivisions toward Viera in Brevard County’s oldest incorporated city.',
    condos:
      'Browse Rockledge condos and townhomes for sale in a mainland city on the Indian River Lagoon, between Cocoa and Viera, with HOA fee info.',
    land: 'Browse lots and land for sale in Rockledge, FL — infill lots and new-construction sites in Brevard County’s oldest city, between Cocoa and Viera.',
  },
  riverFlood:
    'As a mainland city with no oceanfront, Rockledge generally carries lower flood risk than the barrier islands, but low-lying areas along the river can fall into FEMA’s AE zone — check the exact zone for any riverfront property.',
  schools:
    'Rockledge listings are most commonly zoned for Golfview, Manatee, or Andersen Elementary; Kennedy or McNair Middle; and Rockledge or Viera High School.',
});

const MERRITT_ISLAND_RIVER_SEO = buildRiverCitySeo({
  slug: 'merritt-island',
  name: 'Merritt Island',
  placeDescription:
    'Merritt Island is an unincorporated river island community in Brevard County, Florida, between the Indian River and the Banana River, west of Cocoa Beach.',
  riverTitle: 'Merritt Island Riverfront Real Estate | Brevard County, FL',
  description:
    'Browse Merritt Island riverfront homes, condos, and land for sale on the Indian River and Banana River, between the mainland and Cocoa Beach.',
  town: 'Merritt Island is a large, unincorporated river island between the Indian River and the Banana River — not oceanfront itself, but bordered on the north by Kennedy Space Center and the Merritt Island National Wildlife Refuge.',
  riverfront:
    'Merritt Island fronts both the Indian River and the Banana River rather than the Atlantic, so riverfront property here includes homes facing either river, from established central neighborhoods to quieter areas on the south end of the island.',
  riverFlood:
    'Riverfront and low-lying areas commonly fall into FEMA’s AE flood zone, while inland parts of the island sit in the lower-risk X zone, so check the exact zone for any riverfront property.',
  flood:
    'Riverfront and low-lying areas commonly fall into FEMA’s AE flood zone, while inland parts of the island sit in the lower-risk X zone — check the zone on any property you’re considering.',
  schools:
    'Most Merritt Island addresses are zoned for Jefferson Middle and Merritt Island High School, with elementary zoning split mainly between Carroll, Tropical, and Audubon Elementary.',
  overview:
    'Merritt Island sits between the mainland and the barrier islands of Cocoa Beach and Cape Canaveral, fronting the Indian and Banana Rivers rather than the Atlantic. It’s unincorporated Brevard County, with a mature population, established central neighborhoods, quieter residential areas to the south, and the Merritt Island National Wildlife Refuge — home to roughly 356 bird species — on its north end.',
  homes:
    'Merritt Island homes for sale range from established central neighborhoods to riverfront homes and quieter residential areas on the south end, including South Merritt Island. Most single-family neighborhoods carry no HOA or a modest one — recent listings range from about $410/year to $1,150/year — while some riverfront and newer communities carry higher fees.',
  condos:
    'Merritt Island condos and townhomes offer lower-maintenance living between the mainland and Cocoa Beach, with association fees that vary by community — confirm what’s included on each listing.',
  land: 'Merritt Island has more room than the built-out barrier islands, so lots and land for sale range from infill lots in established neighborhoods to homesites near the rivers.',
  descriptions: {
    listings:
      'Merritt Island real estate in one place — homes, condos, and land for sale between the Indian and Banana Rivers, west of Cocoa Beach.',
    homes:
      'Browse Merritt Island homes for sale — established neighborhoods and riverfront homes between the Indian and Banana Rivers, near Kennedy Space Center.',
    condos:
      'Browse Merritt Island condos and townhomes for sale between the Indian River and Banana River, minutes from Cocoa Beach, with HOA fee info.',
    land: 'Browse lots and land for sale on Merritt Island, FL — infill lots and homesites between the Indian and Banana Rivers, near Kennedy Space Center.',
  },
  neighborhoods: [{ href: '/neighborhoods/south-merritt-island', label: 'South Merritt Island' }],
});

const VIERA_SEO = buildRiverCitySeo({
  slug: 'viera',
  name: 'Viera',
  placeDescription:
    'Viera is the original, east-of-I-95 half of the Viera master-planned community in Brevard County, Florida, built around The Avenue Viera, Space Coast Stadium, and more than 100 miles of trails.',
  town: 'Viera is the original half of the Viera master-planned community — inland, east of I-95 and separate from newer Viera West, built around The Avenue Viera’s shops and restaurants, Space Coast Stadium, and more than 100 miles of trails.',
  overview:
    'Developed by The Viera Company (A. Duda & Sons) starting in 1989, Viera spans about 14,500 acres split into Viera and Viera West, with roughly half the land set aside for conservation. Viera itself has around 11,700 residents across a mix of neighborhoods, including several active-adult communities, plus The Avenue Viera’s 100+ shops and restaurants, Space Coast Stadium, the Brevard Zoo, and Duran Golf Club nearby.',
  schools: 'Most Viera homes are zoned for Viera Elementary, Viera Middle, and Viera High School, though exact zoning can vary by neighborhood.',
  flood:
    'Viera sits inland, so most of the community falls in FEMA’s lower-risk X flood zone, though low-lying areas near ponds or preserved wetlands can carry a designation — check the zone on any property you’re considering.',
  homes:
    'Viera homes for sale span a mix of master-planned neighborhoods, from established single-family streets to several active-adult communities and custom homes in Aripeka, close to Duran Golf Club and the Brevard Zoo. Nearly every home belongs to an HOA, and many neighborhoods also fall within the Viera Community Development District (CDD), a separate fee that funds master-plan roads, parks, and infrastructure.',
  condos:
    'Viera condos and townhomes give a lower-maintenance option near The Avenue Viera’s 100+ shops and restaurants. Like Viera’s homes, they typically carry an HOA and may fall within the Viera CDD — confirm both fees on each listing.',
  land: 'Lots and land for sale in Viera are mostly homesites within the master plan, including the custom-build community of Aripeka with its own recognized builders.',
  neighborhoods: [{ href: '/neighborhoods/aripeka', label: 'Aripeka' }],
  descriptions: {
    listings:
      'Viera real estate in one place — homes, condos, and land for sale in Brevard’s master-planned community near The Avenue Viera and Space Coast Stadium.',
    homes:
      'Browse Viera homes for sale — master-planned neighborhoods, active-adult communities, and custom homes near The Avenue Viera and Duran Golf Club.',
    condos:
      'Browse Viera condos and townhomes for sale near The Avenue Viera’s shops and restaurants, with HOA and CDD fee info.',
    land: 'Browse lots and land for sale in Viera, FL — homesites in Brevard’s master-planned community, including the custom-build community of Aripeka.',
  },
});

// Viera West neighborhood links (2026-10-04, per Ryan) — every Viera West
// neighborhood page on the site, shown as a link row near the top of the
// Viera West listing pages (components/NeighborhoodLinkRow.js) and in their
// About section. 55+ communities are labeled.
export const VIERA_WEST_NEIGHBORHOOD_LINKS = [
  { href: '/neighborhoods/viera-builders-communities-viera-west', label: 'Viera Builders Communities' },
  { href: '/neighborhoods/adelaide', label: 'Adelaide' },
  { href: '/neighborhoods/aripeka', label: 'Aripeka' },
  { href: '/neighborhoods/summer-lakes', label: 'Summer Lakes' },
  { href: '/neighborhoods/pangea-park', label: 'Pangea Park' },
  { href: '/neighborhoods/reeling-park', label: 'Reeling Park' },
  { href: '/neighborhoods/laurasia', label: 'Laurasia' },
  ...Object.entries(VIERA_WEST_NEIGHBORHOOD_PAGES)
    .sort(([, a], [, b]) => Number(Boolean(a.senior)) - Number(Boolean(b.senior)))
    .map(([slug, page]) => ({
      href: `/neighborhoods/${slug}`,
      label: page.senior ? `${page.name} (55+)` : page.name,
    })),
];

// Neighborhood link rows by city slug (see components/NeighborhoodLinkRow.js).
export const CITY_NEIGHBORHOOD_LINKS = {
  'viera-west': VIERA_WEST_NEIGHBORHOOD_LINKS,
  'melbourne-beach': MELBOURNE_BEACH_NEIGHBORHOOD_LINKS,
};

// The link row a neighborhood page shows for its siblings ("Other Melbourne
// Beach neighborhoods: ..."), or null if it isn't in one of the rows above.
export function siblingNeighborhoodLinks(slug) {
  const href = `/neighborhoods/${slug}`;
  for (const [citySlug, links] of Object.entries(CITY_NEIGHBORHOOD_LINKS)) {
    if (links.some((l) => l.href === href)) {
      return {
        cityName: citySlug === 'viera-west' ? 'Viera West' : 'Melbourne Beach',
        links: links.filter((l) => l.href !== href),
      };
    }
  }
  return null;
}

const VIERA_WEST_SEO = buildRiverCitySeo({
  slug: 'viera-west',
  name: 'Viera West',
  placeDescription:
    'Viera West is the newer, west-of-I-95 half of the Viera master-planned community in Brevard County, Florida.',
  town: 'Viera West is the newer, faster-growing half of the Viera master-planned community, west of I-95, with a family-oriented mix of established and newly built neighborhoods.',
  overview:
    'Viera West’s population nearly tripled between 2010 and 2020 (6,641 to 16,688 residents) as new phases of the master plan built out west of I-95. It’s a family-oriented community — about 64% married couples and nearly a third with kids under 18 — with a younger median age (45.2) than most Brevard cities, plus its share of the shops, schools, and recreation the broader Viera plan offers.',
  schools: 'Homes in Viera West are commonly zoned for Manatee Elementary, Kennedy Middle, and Viera High School, though exact zoning can vary by neighborhood.',
  flood:
    'Viera West sits inland, so most of the community falls in FEMA’s lower-risk X flood zone, though low-lying areas near ponds or preserved wetlands can carry a designation — check the zone on any property you’re considering.',
  homes:
    'Viera West homes for sale range from established neighborhoods to new construction by Viera Builders in communities like Laurasia, Pangea Park, and Reeling Park, plus custom homes in Adelaide and lakefront estates in Summer Lakes. Nearly every home belongs to an HOA, and many also fall within the Viera West Community Development District (CDD), a separate fee for master-plan infrastructure.',
  condos:
    'Viera West condos and townhomes include newer options like Pangea Park, where Viera Builders mixes condos with single-family homes. Expect an HOA and often a Viera West CDD fee — confirm both on each listing.',
  land: 'Lots and land for sale in Viera West are mostly homesites within the newer phases of the master plan, including custom-home communities like Adelaide.',
  neighborhoods: VIERA_WEST_NEIGHBORHOOD_LINKS,
  descriptions: {
    listings:
      'Viera West real estate in one place — homes, condos, and land for sale in the newer, west-of-I-95 half of Viera’s master-planned community.',
    homes:
      'Browse Viera West homes for sale — new construction by Viera Builders, custom homes in Adelaide, and established family neighborhoods west of I-95.',
    condos:
      'Browse Viera West condos and townhomes for sale, including newer Viera Builders options in Pangea Park, with HOA and CDD fee info.',
    land: 'Browse lots and land for sale in Viera West, FL — homesites in the newer phases of Viera’s master plan, including custom-home communities.',
  },
});

Object.assign(CITY_PAGE_SEO, {
  viera: VIERA_SEO,
  'viera-west': VIERA_WEST_SEO,
  melbourne: MELBOURNE_RIVER_SEO,
  rockledge: ROCKLEDGE_RIVER_SEO,
  'merritt-island': MERRITT_ISLAND_RIVER_SEO,
  'cocoa-beach': COCOA_BEACH_SEO,
  'satellite-beach': SATELLITE_BEACH_SEO,
  indialantic: INDIALANTIC_SEO,
  'indian-harbour-beach': INDIAN_HARBOUR_BEACH_SEO,
});

// "9/27/2026" from an MLS CloseDate ("2026-09-27") for SOLD badges
// (2026-10-04). Parsed as a plain calendar date so it never shifts a day
// across time zones.
export function formatSoldDate(closeDate) {
  const m = typeof closeDate === 'string' && closeDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${Number(m[2])}/${Number(m[3])}/${m[1]}` : null;
}
