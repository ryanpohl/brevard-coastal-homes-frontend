import { formatPrice } from './siteConstants';

// Helpers for live FAQ answers built from listings (2026-11-06, per Ryan:
// Google's AI answer for Melbourne Beach oceanfront named specific listings
// and condo buildings, from Zillow and others).

/** "3037 S Hwy A1a 3c, Melbourne Beach, FL" -> "3037 S Hwy A1A 3c" */
export function shortStreet(address) {
  return String(address || '')
    .split(',')[0]
    .replace(/\bA1a\b/g, 'A1A')
    .replace(/\b(Highway A1A) Highway\b/i, '$1')
    .trim();
}

/** MLS subdivision -> plain building name ("Ebb Tide at Melbourne Bch Condo" -> "Ebb Tide"). */
export function buildingName(subdivision) {
  let s = String(subdivision || '').trim();
  if (!s || /^none$/i.test(s)) return '';
  const strip = [
    /\s+(Ph(ase)?|Phase)\s+[IVX\d]+$/i,
    /\s+No\.?\s*\d+$/i,
    /\s+(A\s+)?Condo(minium)?s?(\s+Apts?)?$/i,
    /\s+at\s+\w+\s+Bch$/i,
    /\s+\w+\s+Bch$/i,
  ];
  for (let pass = 0; pass < 3; pass += 1) for (const re of strip) s = s.replace(re, '').trim();
  return s;
}

/** Up to three listings across the price range: top, middle, bottom. */
export function priceSpreadExamples(listings, n = 3) {
  const list = (listings || []).filter((l) => l.price > 0 && l.address).sort((a, b) => b.price - a.price);
  if (list.length <= n) return list;
  const picks = [list[0], list[Math.floor(list.length / 2)], list[list.length - 1]];
  return [...new Set(picks)].slice(0, n);
}

export function exampleText(l, withType = false) {
  const bits = [
    withType ? (l.propertyType === 'Condo' ? 'condo' : l.propertyType === 'Land' ? 'land' : 'home') : null,
    l.beds ? `${l.beds} bed` : null,
    l.sqft ? `${Number(l.sqft).toLocaleString('en-US')} sq ft` : null,
  ].filter(Boolean);
  return `${shortStreet(l.address)}${bits.length ? ` (${bits.join(', ')})` : ''}, ${formatPrice(l.price)}`;
}

/** Condo buildings with units for sale, from the MLS subdivision names. */
export function buildingsFromListings(listings) {
  const map = new Map();
  for (const l of listings || []) {
    const name = buildingName(l.subdivision);
    if (!name || !(l.price > 0)) continue;
    const key = name.toLowerCase();
    const b = map.get(key) || { name, count: 0, low: l.price, high: l.price, rentals: {} };
    b.count += 1;
    const r = (l.rentalRestrictions || '').split(',')[0].trim();
    if (r && r !== 'Other') b.rentals[r] = (b.rentals[r] || 0) + 1;
    b.low = Math.min(b.low, l.price);
    b.high = Math.max(b.high, l.price);
    map.set(key, b);
  }
  return [...map.values()]
    .map((b) => ({ ...b, rentalMinimum: Object.entries(b.rentals).sort((x, y) => y[1] - x[1])[0]?.[0] || null }))
    .sort((a, b) => b.count - a.count || b.high - a.high);
}

/**
 * "3 Months" -> "3-month rental minimum", "No Minimum" -> "no rental minimum"
 * (MLS rental-restriction values, 2026-11-07, per Ryan: AI answers ask
 * about vacation-rental-friendly buildings). Null when unknown.
 */
export function rentalPhrase(value) {
  const v = String(value || '').trim();
  if (!v || v === 'Other') return null;
  if (/^no minimum$/i.test(v)) return 'no rental minimum';
  if (/^no lease 1st year$/i.test(v)) return 'no leasing in the first year';
  const m = v.match(/^(\d+)\s+(day|week|month|year)s?$/i);
  return m ? `${m[1]}-${m[2].toLowerCase()} rental minimum` : null;
}
