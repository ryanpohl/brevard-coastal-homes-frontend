// Photo description for search engines (2026-10-18, per Ryan: get listing
// photos into Google Images): what the home is and that it's for sale, not
// just the street address, e.g. "Condo for sale at 264 Aquarina Boulevard
// 264, Melbourne Beach, FL 32951 – 3 bed, 2 bath".
export function listingPhotoAlt(listing) {
  const type = listing.propertyType === 'Condo' ? 'Condo' : listing.propertyType === 'Land' ? 'Lot' : 'Home';
  const rooms =
    listing.propertyType !== 'Land' && listing.beds != null && listing.baths != null
      ? ` – ${listing.beds} bed, ${listing.baths} bath`
      : '';
  return `${type} for sale at ${listing.address}${rooms}`;
}
