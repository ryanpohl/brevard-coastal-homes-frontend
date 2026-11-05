import { getMarketSnapshot } from './marketSnapshot';
import { cityListingsQueryParams } from './constants';
import { OCEANFRONT_CITY_SLUGS, RIVERFRONT_CITY_SLUGS, formatPrice } from './siteConstants';

// Oceanfront and riverfront line for the live "How much do … cost?" answers
// on city pages (2026-11-05, per Ryan: Google's AI answers for the beach
// towns split prices by oceanfront vs. riverfront and ask buyers which they
// prefer). Live counts and median asking prices, pointing to the town's
// oceanfront and riverfront pages. `propertyType` 'Home' or 'Condo' for a
// single-type page; leave it out for homes and condos together.
const NOUN = { Home: ['home', 'homes'], Condo: ['condo', 'condos'] };

export async function waterfrontPriceLine({ citySlug, cityName, propertyType }) {
  const types = propertyType ? [propertyType] : ['Home', 'Condo'];
  const [one, many] = propertyType ? NOUN[propertyType] : ['home or condo', 'homes and condos'];
  const kinds = [
    OCEANFRONT_CITY_SLUGS.includes(citySlug) && ['Oceanfront', 'oceanfront'],
    RIVERFRONT_CITY_SLUGS.includes(citySlug) && ['Riverfront', 'riverfront'],
  ].filter(Boolean);
  if (!kinds.length) return '';
  const snaps = await Promise.all(
    kinds.map(([waterfront]) => getMarketSnapshot({ ...cityListingsQueryParams(citySlug), propertyType: types, waterfront }))
  );
  const found = kinds
    .map(([, word], i) => {
      const s = snaps[i];
      if (!s || !s.count || s.median == null) return null;
      return {
        word,
        text: `${s.count} ${word} ${s.count === 1 ? one : many} ${s.count === 1 ? 'is' : 'are'} for sale${s.count > 2 ? `, median ${formatPrice(s.median)}` : ` at ${formatPrice(s.median)}`}`,
      };
    })
    .filter(Boolean);
  if (!found.length) return '';
  const parts = found.map((f) => f.text);
  // Only the pages that have listings today.
  const pages = found.map((f) => f.word).join(' and ');
  return `On the water: ${parts.join('; ')} (see the ${cityName} ${pages} ${found.length > 1 ? 'pages' : 'page'} on this site).`;
}
