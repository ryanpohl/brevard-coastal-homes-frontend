import * as api from './api';

// Recently Sold sections (2026-10-07, per Ryan, starting with Adelaide):
// sold listings from the last 12 months for a page's listing filter, plus
// the summary numbers shown above them and in the page's live FAQ answers.
// The backend keeps a year of sold history (SOLD_HISTORY_DAYS).

// Every neighborhood page shows it (2026-10-07, per Ryan) except these.
// Atlin Cove is Coming Soon with no sales yet.
const RECENTLY_SOLD_EXCLUDED = new Set(['atlin-cove']);

export function showsRecentlySold(slug) {
  return !RECENTLY_SOLD_EXCLUDED.has(slug);
}

// Rows listed: the first RECENTLY_SOLD_VISIBLE show, the rest (up to
// RECENTLY_SOLD_MAX, newest first) open with a "Show all" button — all of
// them are in the HTML for search engines (2026-10-07, per Ryan). The
// summary numbers always use every sale in the 12 months.
export const RECENTLY_SOLD_VISIBLE = 6;
export const RECENTLY_SOLD_MAX = 20;

function median(values) {
  const sorted = values.filter((v) => typeof v === 'number' && v > 0).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export async function getRecentlySold(filter) {
  try {
    const [sold, active] = await Promise.all([
      api.getListings({ ...filter, status: 'Sold', closedWithinDays: 365, sort: 'sold_newest', pageSize: 100 }),
      api.getListings({ ...filter, pageSize: 1 }),
    ]);
    const results = (sold.results || []).filter((l) => (l.closePrice ?? l.price) > 0);
    const prices = results.map((l) => l.closePrice ?? l.price);
    const perSqft = results.filter((l) => l.sqft > 0).map((l) => Math.round((l.closePrice ?? l.price) / l.sqft));
    return {
      count: typeof sold.total === 'number' ? sold.total : results.length,
      medianPrice: median(prices),
      medianPerSqft: median(perSqft),
      recent: results.slice(0, RECENTLY_SOLD_MAX),
      activeCount: typeof active.total === 'number' ? active.total : null,
    };
  } catch {
    return null;
  }
}
