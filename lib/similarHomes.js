// "Homes like this one" filters (2026-10-18, per Ryan; shared 2026-10-31):
// same property type, about 20% either side of the price, at least as many
// bedrooms. Used by the listing page's "Email me similar homes" (Pending/
// Sold listings) and the /alerts/similar page behind the "Also email me new
// homes like this" button in home-alert emails. Not for land.

function roundPrice(n, up) {
  const step = n >= 1000000 ? 50000 : 10000;
  return (up ? Math.ceil(n / step) : Math.floor(n / step)) * step;
}

export function shortPrice(n) {
  return n >= 1000000 ? `$${parseFloat((n / 1000000).toFixed(2))}M` : `$${Math.round(n / 1000)}K`;
}

/**
 * The price/type/beds part of a similar-homes alert, or null for land or a
 * listing without a price.
 * @returns {{ filter, priceMin, priceMax, noun, bedsLabel } | null}
 */
export function similarHomesBand(listing) {
  const price = listing.status === 'Sold' && listing.closePrice ? listing.closePrice : listing.price;
  if (!price || !['Home', 'Condo'].includes(listing.propertyType)) return null;
  const priceMin = roundPrice(price * 0.8, false);
  const priceMax = roundPrice(price * 1.2, true);
  const filter = { propertyType: listing.propertyType, priceMin: String(priceMin), priceMax: String(priceMax) };
  if (listing.beds > 0) filter.beds = String(listing.beds);
  return {
    filter,
    priceMin,
    priceMax,
    noun: listing.propertyType === 'Condo' ? 'condos' : 'homes',
    bedsLabel: listing.beds > 0 ? `${listing.beds}+ bed ` : '',
  };
}
