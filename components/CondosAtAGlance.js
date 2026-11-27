import * as api from '@/lib/api';
import { cityListingsQueryParams } from '@/lib/constants';

/**
 * "{City} Condos at a Glance" (2026-11-27, per Ryan; AI-visibility push,
 * Melbourne Beach condos first). Google's AI Overview for "melbourne beach
 * condos for sale" quoted Zillow for the price range, median list price,
 * days on market and settings, and quoted this site for rental rules. This
 * box puts all of that near the top, live from the MLS: what's for sale by
 * setting (oceanfront / riverfront / not on the water) with HOA fees, the
 * past 12 months of sales, and how many condos allow which rental terms.
 * Shown on the Condos page of cities in CONDO_GLANCE_CITIES.
 */
export const CONDO_GLANCE_CITIES = new Set(['melbourne-beach']);

const PER_MONTH = { Monthly: 1, Quarterly: 1 / 3, Annually: 1 / 12, Yearly: 1 / 12, 'Semi-Annually': 1 / 6 };
const short = (n) => (n >= 1e6 ? `$${parseFloat((n / 1e6).toFixed(2))}M` : `$${Math.round(n / 1000)}K`);
const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;
const v = (n, many, one) => (n === 1 ? one : many);
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor((s.length - 1) / 2)] : null;
};

// Shortest rental term a listing's rules allow, as one bucket.
function rentalBucket(raw) {
  const r = String(raw || '').toLowerCase();
  if (!r.trim()) return null;
  if (r.includes('no rentals')) return 'none';
  if (r.includes('no minimum')) return 'nomin';
  if (/\b(\d+)\s*(day|week)/.test(r)) return 'short';
  if (/\b1\s*month/.test(r)) return 'month1';
  if (/\b(2|3)\s*months?/.test(r)) return 'month3';
  if (/\b(6|12)\s*months?|1\s*year/.test(r)) return 'month6';
  return null;
}

function group(listings) {
  const prices = listings.map((l) => l.price);
  const fees = listings
    .map((l) => (PER_MONTH[l.assocFeeFrequency] && l.assocFee > 0 ? l.assocFee * PER_MONTH[l.assocFeeFrequency] : null))
    .filter((f) => f != null);
  return {
    count: listings.length,
    low: Math.min(...prices),
    high: Math.max(...prices),
    median: median(prices),
    hoaLow: fees.length ? Math.min(...fees) : null,
    hoaHigh: fees.length ? Math.max(...fees) : null,
  };
}

export default async function CondosAtAGlance({ citySlug, cityName, asOf, showBuildingsLink = false }) {
  const base = { ...cityListingsQueryParams(citySlug), propertyType: 'Condo' };
  const [data, sold] = await Promise.all([
    api.getListings({ ...base, pageSize: 100 }).catch(() => null),
    api.getSoldStats(base).catch(() => null),
  ]);
  const listings = (data?.results || []).filter((l) => l.status === 'Active' && typeof l.price === 'number' && l.price > 0);
  if (!listings.length) return null;

  const all = group(listings);
  const settings = [
    { label: 'Oceanfront', rows: listings.filter((l) => l.waterfront === 'Oceanfront') },
    { label: 'Riverfront', rows: listings.filter((l) => l.waterfront === 'Riverfront') },
    { label: 'Not on the water', rows: listings.filter((l) => l.waterfront !== 'Oceanfront' && l.waterfront !== 'Riverfront') },
  ]
    .filter((s) => s.rows.length)
    .map((s) => ({ label: s.label, ...group(s.rows) }));

  const tiers = {
    entry: listings.filter((l) => l.price < 450000).length,
    mid: listings.filter((l) => l.price >= 450000 && l.price < 800000).length,
    luxury: listings.filter((l) => l.price >= 800000).length,
  };
  const buckets = {};
  for (const l of listings) {
    const b = rentalBucket(l.rentalRestrictions);
    if (b) buckets[b] = (buckets[b] || 0) + 1;
  }
  const withRules = Object.values(buckets).reduce((a, b) => a + b, 0);
  const rentalParts = [
    buckets.short && `${buckets.short} ${v(buckets.short, 'allow', 'allows')} rentals shorter than a month`,
    buckets.month1 && `${buckets.month1} ${v(buckets.month1, 'allow', 'allows')} 1-month rentals`,
    buckets.month3 && `${buckets.month3} ${v(buckets.month3, 'require', 'requires')} 2–3 months`,
    buckets.month6 && `${buckets.month6} ${v(buckets.month6, 'require', 'requires')} 6 months or more`,
    buckets.nomin && `${buckets.nomin} ${v(buckets.nomin, 'have', 'has')} no minimum`,
    buckets.none && `${buckets.none} ${v(buckets.none, 'allow', 'allows')} no rentals`,
  ].filter(Boolean);

  return (
    <section className="hibc-prices" aria-labelledby="condos-glance-heading">
      <h2 id="condos-glance-heading" className="hibc-prices__title">
        {cityName} Condos at a Glance
      </h2>
      <p className="glance-lead">
        <strong>{all.count} condos</strong> are for sale in {cityName}, FL right now, from {short(all.low)} to{' '}
        {short(all.high)}, with a median list price of {short(all.median)}.
        {sold?.count >= 3 && sold.medianPrice
          ? ` In the past 12 months, ${sold.count} condos sold at a median ${short(sold.medianPrice)}${
              sold.medianDaysOnMarket != null ? `, after a median ${sold.medianDaysOnMarket} days on the market` : ''
            }${sold.medianSaleToListPct != null ? `, at ${sold.medianSaleToListPct}% of asking` : ''}.`
          : ''}
      </p>
      <div className="glance-table-wrap">
        <table className="hibc-prices__table glance-table">
          <thead>
            <tr>
              <th scope="col">Setting</th>
              <th scope="col">For sale</th>
              <th scope="col">Price range</th>
              <th scope="col">Median</th>
              <th scope="col">HOA a month</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s.label}>
                <th scope="row">{s.label}</th>
                <td>{s.count}</td>
                <td>{s.low === s.high ? short(s.low) : `${short(s.low)}–${short(s.high)}`}</td>
                <td>{short(s.median)}</td>
                <td>
                  {s.hoaLow == null ? '—' : s.hoaLow === s.hoaHigh ? money(s.hoaLow) : `${money(s.hoaLow)}–${money(s.hoaHigh)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="glance-lead" style={{ marginTop: 10 }}>
        <strong>By price:</strong> {tiers.entry} under $450K, {tiers.mid} from $450K to $800K and {tiers.luxury} at $800K or
        more.{showBuildingsLink ? (
          <>
            {' '}
            <a href="#condo-buildings">Compare {cityName} condo buildings ↓</a>
          </>
        ) : null}
      </p>
      {withRules >= 5 && rentalParts.length > 0 && (
        <p className="glance-lead" style={{ marginTop: 10 }}>
          <strong>Rental rules:</strong> of the {withRules} condos for sale that list their rental rules,{' '}
          {rentalParts.length > 1 ? `${rentalParts.slice(0, -1).join(', ')} and ${rentalParts[rentalParts.length - 1]}` : rentalParts[0]}.
          Rules are set by each building, so confirm them on the listing.
        </p>
      )}
      <p className="hibc-prices__note">From the Space Coast MLS as of {asOf}. HOA fees shown per month.</p>
    </section>
  );
}
