import * as api from '@/lib/api';

// Live market snapshot for a listings query (2026-10-03): active count,
// median, low and high list price. Sorted by price so the median is exact
// even past the 100-listing page cap: one request for the low end (and
// the whole set when it fits), one for the page holding the median, and
// one for the high end. Returns null on any failure, so callers can just
// leave the snapshot out rather than show wrong numbers.
export async function getMarketSnapshot(baseParams) {
  const PAGE = 100;
  try {
    const first = await api.getListings({ ...baseParams, sort: 'price_asc', pageSize: PAGE, page: 1 });
    const count = typeof first.total === 'number' ? first.total : (first.results || []).length;
    if (!count) return { count: 0 };
    const priceAt = (results, i) => (results && results[i] && typeof results[i].price === 'number' ? results[i].price : null);
    const firstResults = first.results || [];
    const low = firstResults.map((l) => l.price).find((p) => typeof p === 'number' && p > 0) ?? null;
    const mid = Math.floor(count / 2);
    let median;
    let high;
    if (count <= PAGE) {
      median = priceAt(firstResults, mid);
      high = priceAt(firstResults, firstResults.length - 1);
    } else {
      const [midPage, top] = await Promise.all([
        api.getListings({ ...baseParams, sort: 'price_asc', pageSize: PAGE, page: Math.floor(mid / PAGE) + 1 }),
        api.getListings({ ...baseParams, sort: 'price_desc', pageSize: 1, page: 1 }),
      ]);
      median = priceAt(midPage.results, mid % PAGE);
      high = priceAt(top.results, 0);
    }
    return { count, median, low, high };
  } catch {
    return null;
  }
}

// Year-over-year change in the 12-month median sold price (2026-11-05:
// Zillow and Redfin lead with it). Only with 20+ sales in both periods.
export function medianChangeText(stats) {
  const prior = stats?.prior;
  if (!stats?.medianPrice || !prior?.medianPrice || stats.count < 20 || prior.count < 20) return '';
  const pct = Math.round(((stats.medianPrice - prior.medianPrice) / prior.medianPrice) * 1000) / 10;
  if (pct === 0) return ', unchanged from the 12 months before';
  return `, ${pct > 0 ? 'up' : 'down'} ${Math.abs(pct)}% from the 12 months before`;
}
