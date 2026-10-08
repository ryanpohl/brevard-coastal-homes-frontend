import * as api from './api';

// Condo building pages (2026-10-08, per Ryan) — /{city}/condos/{building},
// listed A–Z in a "Condo Buildings" directory on the city's
// /condos-for-sale page. Buyers search condos by building name ("Twin
// Towers Cocoa Beach"), where the competition is thin, and the building
// pages linking back to the city condo page help it rank too.
//
// Which buildings: every building with 15+ condo listings or sales in the
// two years of MLS data (checked 2026-10-08), so each page always has
// recent sales to show. `match` is the MLS SubdivisionName fragment(s)
// (case-insensitive "contains", within the city, condos only); phases are
// combined (Royale Towers Ph II + Ph III). `address` and `built` come from
// the MLS listings; `note` is Ryan's own line about the building, if any.
export const CONDO_BUILDINGS = {
  'cocoa-beach': [
    { slug: '2100-towers', name: '2100 Towers', match: ['2100 Towers'], address: '2100 N Atlantic Ave', built: 1975, oceanfront: true },
    { slug: 'atlantique', name: 'Atlantique', match: ['Atlantique'], address: '4800 Ocean Beach Blvd', built: 1966, oceanfront: true },
    { slug: 'avon-by-the-sea', name: 'Avon By The Sea', match: ['Avon By The Sea'], address: null, built: null, oceanfront: false },
    { slug: 'beach-winds', name: 'Beach Winds', match: ['Beach Winds'], address: '650 N Atlantic Ave', built: 1978, oceanfront: true },
    { slug: 'conquistador', name: 'Conquistador', match: ['Conquistador'], address: '4100 Ocean Beach Blvd', built: 1974, oceanfront: true },
    { slug: 'the-diplomat', name: 'The Diplomat', match: ['Diplomat'], address: '3150 N Atlantic Ave', built: 1963, oceanfront: true },
    { slug: 'emerald-seas', name: 'Emerald Seas', match: ['Emerald Seas'], address: '3400 Ocean Beach Blvd', built: 1992, oceanfront: true },
    { slug: 'four-seasons', name: 'Four Seasons', match: ['Four Seasons'], address: '3799 S Banana River Blvd', built: 1979, oceanfront: false, near: 'on the Banana River side' },
    { slug: 'kaia-residence', name: 'Kaia Residence', match: ['Kaia'], address: '4620 Ocean Beach Blvd', built: null, newConstruction: true, oceanfront: true },
    { slug: 'oceana-of-cocoa-beach', name: 'Oceana of Cocoa Beach', match: ['Oceana of Cocoa Beach'], address: '744 S Orlando Ave', built: 1989, oceanfront: false },
    { slug: 'royale-towers', name: 'Royale Towers', match: ['Royale Towers'], address: '1830 & 1860 N Atlantic Ave', built: 1980, oceanfront: true },
    { slug: 'saturn', name: 'Saturn', match: ['Saturn Condo'], address: '3190 N Atlantic Ave', built: 1963, oceanfront: true },
    { slug: 'stonewood-towers', name: 'Stonewood Towers', match: ['Stonewood Towers'], address: '830 N Atlantic Ave', built: 1980, oceanfront: true },
    { slug: 'the-surf-at-cocoa-beach', name: 'The Surf at Cocoa Beach', match: ['Surf at Cocoa Beach'], address: '65 N Atlantic Ave', built: 2020, oceanfront: true },
    { slug: 'twin-towers', name: 'Twin Towers', match: ['Twin Towers'], address: '2020 N Atlantic Ave', built: 1964, oceanfront: true },
    { slug: 'villa-vista', name: 'Villa Vista', match: ['Villa Vista'], address: '4700 Ocean Beach Blvd', built: 1973, oceanfront: true },
    { slug: 'windrush', name: 'Windrush', match: ['Windrush'], address: '3170 N Atlantic Ave', built: 1979, oceanfront: true },
    { slug: 'windward-apartments', name: 'Windward Apartments', match: ['Windward Apts'], address: '5600 N Banana River Blvd', built: 1965, oceanfront: false, near: 'on the Banana River side' },
    { slug: 'windward-east', name: 'Windward East', match: ['Windward E Condo'], address: '3060 N Atlantic Ave', built: 1978, oceanfront: true },
    { slug: 'xanadu', name: 'Xanadu', match: ['Xanadu'], address: '750 N Atlantic Ave', built: 1983, oceanfront: true },
  ],
  // Indialantic (2026-10-08): fewer, smaller buildings than Cocoa Beach, so
  // the cutoff is 10+ condo listings/sales in two years, with phases
  // combined (Beach Club, Ocean Side Village), plus three newer oceanfront
  // buildings buyers search by name (The Duval, 2795 Ocean, Miramar; per Ryan).
  indialantic: [
    { slug: 'beach-club', name: 'Beach Club', match: ['Beach Club Condo'], address: '1800 Charlesmont Dr', built: 1987, oceanfront: false },
    { slug: '2795-ocean', name: '2795 Ocean', match: ['2795 Ocean'], address: null, built: 2024, oceanfront: true },
    { slug: 'commodore-club', name: 'Commodore Club', match: ['Commodore Club'], address: '995 N Hwy A1A', built: 1980, oceanfront: true },
    { slug: 'indialantic-villas', name: 'Indialantic Villas', match: ['Indialantic Villas'], address: '1145 N Shannon Ave', built: 1981, oceanfront: false },
    { slug: 'magnolia-key', name: 'Magnolia Key', match: ['Magnolia Key'], address: '1 Eighth Ave', built: 2006, oceanfront: true },
    { slug: 'miramar', name: 'Miramar', match: ['Miramar'], address: null, built: 2021, oceanfront: true },
    { slug: 'ocean-side-village', name: 'Ocean Side Village', match: ['Ocean Side Village'], address: null, built: null, oceanfront: false },
    { slug: 'oceanview', name: 'Oceanview', match: ['Oceanview Condo'], address: '2150 N Hwy A1A', built: 1981, oceanfront: false },
    { slug: 'palm-colony-club', name: 'Palm Colony Club', match: ['Palm Colony'], address: '2700 N Hwy A1A', built: 1974, oceanfront: false },
    { slug: 'townhomes-of-paradise-beach', name: 'Townhomes of Paradise Beach', match: ['Townhomes of Paradise Beach'], address: '255 Paradise Blvd', built: 1979, oceanfront: false },
    { slug: 'the-duval', name: 'The Duval', match: ['Duval Oceanfront'], address: '1455 N Hwy A1A', built: null, newConstruction: true, oceanfront: true },
    { slug: 'the-villager', name: 'The Villager', match: ['Villager Condo'], address: '877 N Hwy A1A', built: 1975, oceanfront: true },
    { slug: 'vizcaya', name: 'Vizcaya', match: ['Vizcaya'], address: '925 N Hwy A1A', built: 1998, oceanfront: true },
  ],
  // Satellite Beach (2026-10-08): same 10+ cutoff as Indialantic; phases
  // combined (Montecito, Waterway Townhouses). "Unrecorded Barberry",
  // "Skyline Subd" and similar subdivision names are left out.
  'satellite-beach': [
    { slug: 'buccaneer', name: 'Buccaneer', match: ['Buccaneer Condo'], address: '1175 Hwy A1A', built: 1973, oceanfront: true },
    { slug: 'buccaneer-beach-club', name: 'Buccaneer Beach Club', match: ['Buccaneer Beach Club'], address: '1125 Hwy A1A', built: 1973, oceanfront: true },
    { slug: 'eastwind', name: 'Eastwind', match: ['Eastwind Condo'], address: '1465 Hwy A1A', built: 1982, oceanfront: true },
    { slug: 'montecito', name: 'Montecito', match: ['Montecito'], address: null, built: null, oceanfront: false },
    { slug: 'oceana-oceanfront', name: 'Oceana Oceanfront', match: ['Oceana Oceanfront'], address: '1025 Hwy A1A', built: 2019, oceanfront: true },
    { slug: 'oceanus', name: 'Oceanus', match: ['Oceanus'], address: '199 Hwy A1A', built: 1975, oceanfront: true },
    { slug: 'palm-springs', name: 'Palm Springs', match: ['Palm Springs Condo'], address: 'Lancha Circle', built: 2007, oceanfront: false },
    { slug: 'sandpiper-towers', name: 'Sandpiper Towers', match: ['Sandpiper Towers'], address: '205 Hwy A1A', built: 1964, oceanfront: true },
    { slug: 'silver-sands', name: 'Silver Sands', match: ['Silver Sands'], address: '295 Hwy A1A', built: 1987, oceanfront: true },
    { slug: 'south-patrick-apartments', name: 'South Patrick Apartments', match: ['South Patrick Apts'], address: '55 Sea Park Blvd', built: 1962, oceanfront: false },
    { slug: 'townhomes-of-satellite-beach', name: 'Townhomes of Satellite Beach', match: ['Townhomes of Satellite Beach'], address: 'Queens Court', built: 1979, oceanfront: false },
    { slug: 'waterway-townhouses', name: 'Waterway Townhouses', match: ['Waterway Townhouse'], address: null, built: null, oceanfront: false },
  ],
  // Indian Harbour Beach (2026-10-08): same 10+ cutoff; Harbour Royale's
  // north and south buildings combined. Plat names (Burns Village, Lyme Bay
  // Sec 1-3, Gleasons Replat, Town House Estates, Harbour Villa) are left out.
  'indian-harbour-beach': [
    { slug: 'condos-of-indian-harbour', name: 'The Condos of Indian Harbour', match: ['Condos of Indian Harbour'], address: '1045 Cheyenne Blvd', built: 1972, oceanfront: false },
    { slug: 'coquina-palms', name: 'Coquina Palms', match: ['Coquina Palms'], address: 'Thatch Palm Court', built: 1997, oceanfront: false },
    { slug: 'fortebello', name: 'Fortebello', match: ['Fortebello'], address: 'Mediterranean Way', built: 2013, oceanfront: false },
    { slug: 'harbour-royale', name: 'Harbour Royale', match: ['Harbour Royale'], address: '500 & 520 Palm Springs Blvd', built: 1980, oceanfront: false },
    { slug: 'the-jamestown', name: 'The Jamestown', match: ['Jamestown'], address: 'E Colonial Court', built: 1964, oceanfront: false },
    { slug: 'lantana-oceanfront', name: 'Lantana Oceanfront', match: ['Lantana Oceanfront'], address: '1791 Hwy A1A', built: 1999, oceanfront: true },
    { slug: 'ocean-walk', name: 'Ocean Walk', match: ['Ocean Walk Condo'], address: '2225 Hwy A1A', built: 1984, oceanfront: true },
    { slug: 'somerset-oceanfront', name: 'Somerset Oceanfront', match: ['Somerset Oceanfront'], address: '2065 Hwy A1A', built: 2003, oceanfront: true },
    { slug: 'south-harbor-estates', name: 'South Harbor Estates', match: ['South Harbor Estates'], address: 'Anchor Drive', built: 1989, oceanfront: false },
  ],
  // Melbourne Beach (2026-10-08): most condo sales are in Aquarina, Beach
  // Woods and Harbor Island Beach Club, which already have their own pages
  // (`href` links those instead of making building pages). The Breakers
  // (Ph I-III), Breakers West and Lighthouse Cove (Ph I/III/IV; not part of
  // Aquarina, per Ryan) are the other buildings with 10+ listings/sales.
  'melbourne-beach': [
    { slug: 'aquarina', name: 'Aquarina', href: '/neighborhoods/aquarina/condos-for-sale', detail: 'Gated community' },
    { slug: 'beach-woods', name: 'Beach Woods', href: '/neighborhoods/beach-woods', detail: 'Townhomes & condos' },
    { slug: 'the-breakers', name: 'The Breakers', match: ['The Breakers Condo'], address: 'Atlantic St', built: 1980, oceanfront: true },
    { slug: 'breakers-west', name: 'Breakers West', match: ['Breakers West'], address: '1850 Atlantic St', built: 1981, oceanfront: false },
    { slug: 'harbor-island-beach-club', name: 'Harbor Island Beach Club', href: '/neighborhoods/harbor-island-beach-club/condos-for-sale', detail: 'Gated community' },
    { slug: 'lighthouse-cove', name: 'Lighthouse Cove', match: ['Lighthouse Cove'], address: 'Casseekee Trail', built: 1980, oceanfront: false },
  ],
};

export function condoBuildings(citySlug) {
  return [...(CONDO_BUILDINGS[citySlug] || [])].sort((a, b) =>
    a.name.replace(/^The /, '').localeCompare(b.name.replace(/^The /, ''))
  );
}

// Entries with `href` link an existing community page and get no building page.
export function findCondoBuilding(citySlug, slug) {
  return (CONDO_BUILDINGS[citySlug] || []).find((b) => b.slug === slug && !b.href) || null;
}

export function condoBuildingHref(citySlug, b) {
  return b.href || `/${citySlug}/condos/${b.slug}`;
}

// "Oceanfront · built 1980" under each name in the directory.
export function condoBuildingDetail(b) {
  if (b.detail) return b.detail;
  const where = b.oceanfront ? 'Oceanfront' : b.near ? b.near.replace(/^on the /, '').replace(/^a /, 'A ') : null;
  const age = b.newConstruction ? 'New construction' : b.built ? `Built ${b.built}` : null;
  return [where, age].filter(Boolean).join(' · ');
}

export function condoBuildingFilter(citySlug, b) {
  return { city: citySlug, propertyType: 'Condo', subdivisionLike: b.match.join(',') };
}

const FEE_MONTHS = { Monthly: 1, Quarterly: 3, 'Semi-Annually': 6, Annually: 12, Weekly: 12 / 52 };

function median(values) {
  const sorted = values.filter((v) => typeof v === 'number' && v > 0).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

// Monthly HOA fee from a listing, or null when missing/unknown frequency.
function monthlyFee(l) {
  if (!(l.assocFee > 0)) return null;
  const months = FEE_MONTHS[l.assocFeeFrequency] || (l.assocFeeFrequency ? null : 1);
  return months ? Math.round(l.assocFee / months) : null;
}

// Most common minimum rental term listed in the MLS ("3 Months"), from the
// first term in each listing's RentalRestrictions.
function commonRentalMinimum(listings) {
  const counts = {};
  listings.forEach((l) => {
    const first = (l.rentalRestrictions || '').split(',')[0].trim();
    if (first && first !== 'Other') counts[first] = (counts[first] || 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : null;
}

export async function getCondoBuildingData(citySlug, b) {
  const filter = condoBuildingFilter(citySlug, b);
  try {
    const [active, sold, history, soldStats] = await Promise.all([
      api.getListings({ ...filter, pageSize: 60, sort: 'price_desc' }),
      api.getListings({ ...filter, status: 'Sold', closedWithinDays: 365, sort: 'sold_newest', pageSize: 100 }),
      api.getListings({ ...filter, status: 'Sold', closedWithinDays: 730, sort: 'sold_newest', pageSize: 100 }),
      api.getSoldStats(filter).catch(() => null),
    ]);
    const activeListings = (active.results || []).filter((l) => l.price > 0);
    const soldListings = (sold.results || []).filter((l) => (l.closePrice ?? l.price) > 0);
    const all = [...activeListings, ...(history.results || [])];
    const fees = all.map(monthlyFee).filter(Boolean);
    const prices = soldListings.map((l) => l.closePrice ?? l.price);
    const perSqft = soldListings.filter((l) => l.sqft > 0).map((l) => Math.round((l.closePrice ?? l.price) / l.sqft));
    return {
      active: activeListings,
      activeCount: typeof active.total === 'number' ? active.total : activeListings.length,
      medianListPrice: median(activeListings.map((l) => l.price)),
      soldStats,
      recentlySold: {
        count: typeof sold.total === 'number' ? sold.total : soldListings.length,
        medianPrice: median(prices),
        medianPerSqft: median(perSqft),
        recent: soldListings.slice(0, 20),
        activeCount: typeof active.total === 'number' ? active.total : activeListings.length,
      },
      feeMin: fees.length ? Math.min(...fees) : null,
      feeMax: fees.length ? Math.max(...fees) : null,
      feeMedian: median(fees),
      rentalMinimum: commonRentalMinimum(all),
    };
  } catch {
    return null;
  }
}
