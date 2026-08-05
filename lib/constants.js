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

export const BED_OPTIONS = [1, 2, 3, 4, 5];
export const BATH_OPTIONS = [1, 2, 3, 4];

// Adelaide's Beds/Baths dropdowns start higher than the site-wide default
// (per Ryan, 2026-08-05) to match the community's larger homes — Beds
// starts at 3+ (drops 1+/2+), Baths starts at 2+ (drops 1+). See
// app/neighborhoods/[slug]/page.js, passed to FilterBar only for Adelaide.
export const ADELAIDE_BED_OPTIONS = [3, 4, 5];
export const ADELAIDE_BATH_OPTIONS = [2, 3, 4];

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
