import * as api from './api';

// Neighborhood market stats bar (2026-10-08, per Ryan, to help the Adelaide
// page rank for "Adelaide homes for sale" / "Adelaide real estate"): live
// numbers from the Space Coast MLS at the top of the page — what's for sale
// now and what sold in the last 12 months. Fresh numbers give search
// engines a reason to recrawl, and AI answers tend to quote them. Add a
// slug here to turn it on for another neighborhood.
const MARKET_STATS_SLUGS = new Set(['adelaide']);

export function showsNeighborhoodMarketStats(slug) {
  return MARKET_STATS_SLUGS.has(slug);
}

function median(values) {
  const sorted = values.filter((v) => typeof v === 'number' && v > 0).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export async function getNeighborhoodMarketStats(filter) {
  try {
    const [active, sold] = await Promise.all([
      api.getListings({ ...filter, pageSize: 100 }),
      api.getSoldStats(filter).catch(() => null),
    ]);
    const listings = (active.results || []).filter((l) => l.price > 0);
    return {
      activeCount: typeof active.total === 'number' ? active.total : listings.length,
      medianListPrice: median(listings.map((l) => l.price)),
      sold,
    };
  } catch {
    return null;
  }
}
