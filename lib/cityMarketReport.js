import * as api from './api';
import { CITY_NEIGHBORHOOD_LINKS } from './constants';
import { neighborhoodListingsFilter } from './neighborhoodFilters';

// City market report (2026-10-07, per Ryan, starting with Melbourne Beach):
// 12-month sold stats for a city's Homes or Condos page, plus the same
// numbers for each of the city's neighborhood pages.
export const MARKET_REPORT_CITY_SLUGS = new Set(['melbourne-beach']);

export async function getCityMarketReport({ citySlug, cityFilter, propertyType }) {
  try {
    const neighborhoods = (CITY_NEIGHBORHOOD_LINKS[citySlug] || []).map((l) => ({
      slug: l.href.replace('/neighborhoods/', ''),
      label: l.label,
      href: l.href,
    }));
    const [city, ...rows] = await Promise.all([
      api.getSoldStats({ ...cityFilter, propertyType }),
      ...neighborhoods.map((n) =>
        api
          .getSoldStats({ ...neighborhoodListingsFilter(n.slug), propertyType })
          .then((stats) => ({ ...n, stats }))
          .catch(() => ({ ...n, stats: null }))
      ),
    ]);
    return {
      city,
      neighborhoods: rows.filter((r) => r.stats && r.stats.count > 0).sort((a, b) => (b.stats.medianPrice || 0) - (a.stats.medianPrice || 0)),
    };
  } catch {
    return null;
  }
}
