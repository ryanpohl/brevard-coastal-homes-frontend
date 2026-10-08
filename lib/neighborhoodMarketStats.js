import * as api from './api';

// Neighborhood market stats bar (2026-10-08, per Ryan, to help neighborhood
// pages rank for "{Name} homes for sale" / "{Name} real estate"): live
// numbers from the Space Coast MLS at the top of the page — what's for sale
// now and what sold in the last 12 months. Fresh numbers give search
// engines a reason to recrawl, and AI answers tend to quote them. Add a
// slug here to turn it on for another neighborhood. `splitLand`: the
// combined view shows homes and homesites separately (Aripeka sells lots on
// the MLS; mixing them with homes would make the medians meaningless).
const MARKET_STATS = {
  adelaide: {},
  aripeka: { splitLand: true },
};

export function showsNeighborhoodMarketStats(slug) {
  return Boolean(MARKET_STATS[slug]);
}

function median(values) {
  const sorted = values.filter((v) => typeof v === 'number' && v > 0).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

async function activeStats(filter) {
  const active = await api.getListings({ ...filter, pageSize: 100 });
  const listings = (active.results || []).filter((l) => l.price > 0);
  return {
    count: typeof active.total === 'number' ? active.total : listings.length,
    medianListPrice: median(listings.map((l) => l.price)),
  };
}

// The property type in `filter` is the page's own view (e.g. Land on
// /lots-for-sale); with none, split-land neighborhoods get Home and Land
// numbers separately.
export async function getNeighborhoodMarketStats(slug, filter) {
  try {
    const split = MARKET_STATS[slug]?.splitLand && !filter.propertyType;
    const homeFilter = split ? { ...filter, propertyType: 'Home' } : filter;
    const [active, sold, land] = await Promise.all([
      activeStats(homeFilter),
      api.getSoldStats(homeFilter).catch(() => null),
      split ? activeStats({ ...filter, propertyType: 'Land' }).catch(() => null) : null,
    ]);
    return { ...active, sold, land, kind: split ? 'Home' : filter.propertyType || null };
  } catch {
    return null;
  }
}
