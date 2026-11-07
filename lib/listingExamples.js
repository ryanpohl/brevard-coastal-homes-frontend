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
    const b = map.get(key) || { name, count: 0, low: l.price, high: l.price };
    b.count += 1;
    b.low = Math.min(b.low, l.price);
    b.high = Math.max(b.high, l.price);
    map.set(key, b);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || b.high - a.high);
}
