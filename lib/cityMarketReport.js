import * as api from './api';
import { CITY_NEIGHBORHOOD_LINKS } from './constants';
import { neighborhoodListingsFilter } from './neighborhoodFilters';

// City market report (2026-10-07, per Ryan): 12-month sold stats for a
// city's Homes or Condos page compared with the 12 months before and with
// all the site's cities, plus current 12-month numbers for each of the
// city's neighborhood pages. On every city (started with Melbourne Beach).
export function showsMarketReport() {
  return true;
}

// Year-over-year changes only show when both 12-month periods have at least
// this many sales, so small samples don't produce misleading swings.
export const MIN_SALES_FOR_CHANGE = 20;

export async function getCityMarketReport({ citySlug, cityFilter, propertyType }) {
  try {
    const neighborhoods = (CITY_NEIGHBORHOOD_LINKS[citySlug] || []).map((l) => ({
      slug: l.href.replace('/neighborhoods/', ''),
      label: l.label,
      href: l.href,
    }));
    const [city, allCities, ...rows] = await Promise.all([
      api.getSoldStats({ ...cityFilter, propertyType, includePrior: 1 }),
      api.getSoldStats({ propertyType }).catch(() => null),
      ...neighborhoods.map((n) =>
        api
          .getSoldStats({ ...neighborhoodListingsFilter(n.slug), propertyType })
          .then((stats) => ({ ...n, stats }))
          .catch(() => ({ ...n, stats: null }))
      ),
    ]);
    return {
      city,
      allCities,
      neighborhoods: rows.filter((r) => r.stats && r.stats.count > 0).sort((a, b) => (b.stats.medianPrice || 0) - (a.stats.medianPrice || 0)),
    };
  } catch {
    return null;
  }
}
