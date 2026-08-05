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

export const PROPERTY_TYPE_LABEL = {
  Home: 'Single-Family Homes',
  Condo: 'Condos/Townhomes',
  Land: 'Land',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
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
// dropdown. There's no backend column for a listing's sub-community today
// (see backend/src/db/schema.sql's `listings` table — only `neighborhood_id`
// exists), so this filters via a `subdivision` URL param that's forwarded to
// the listings API but not yet matched against anything server-side; ready
// to wire up for real once real MLS listings (with sub-community data) are
// flowing. See app/neighborhoods/[slug]/page.js, passed to FilterBar only
// when slug === 'viera-builders-communities-viera-west'.
export const VIERA_BUILDERS_COMMUNITIES_VIERA_WEST_NEIGHBORHOOD_OPTIONS = [
  'Atlin Cove',
  'Crossmolina',
  'Farallon Fields',
  'Laurasia',
  'Pangea Park',
  'Reeling Park',
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
