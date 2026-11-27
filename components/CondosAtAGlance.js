import * as api from '@/lib/api';
import { cityListingsQueryParams } from '@/lib/constants';

/**
 * "{City} Condos/Homes at a Glance" (2026-11-27, per Ryan: "our #1 priority
 * should be that we get quoted on Google AI & ChatGPT"; "use any numbers &
 * statements that will increase our odds"). Google's AI Overviews for
 * "melbourne beach condos for sale" / "melbourne beach real estate" quoted
 * Zillow for the price range, median list price, days on market and
 * settings. This box puts those facts near the top, live from the MLS: what's
 * for sale by setting (oceanfront / riverfront / not on the water), price
 * tiers, the past 12 months of sales, and for condos HOA fees and how many
 * allow which rental terms.
 *
 * Condos box: Condos page of cities in CONDO_GLANCE_CITIES.
 * Homes box: Homes page of cities in HOME_GLANCE_CITIES.
 */
export const CONDO_GLANCE_CITIES = new Set(['melbourne-beach', 'satellite-beach', 'cocoa-beach', 'cape-canaveral', 'indian-harbour-beach', 'indialantic', 'merritt-island', 'viera-west']);
// Cocoa Beach added 2026-11-27 (Google's answer for "cocoa beach homes for sale"
// was all Zillow).
export const HOME_GLANCE_CITIES = new Set(['melbourne-beach', 'cocoa-beach', 'satellite-beach', 'indialantic', 'merritt-island', 'viera-west']);

const PER_MONTH = { Monthly: 1, Quarterly: 1 / 3, Annually: 1 / 12, Yearly: 1 / 12, 'Semi-Annually': 1 / 6 };
const short = (n) => (n >= 1e6 ? `$${parseFloat((n / 1e6).toFixed(2))}M` : `$${Math.round(n / 1000)}K`);
const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;
const v = (n, many, one) => (n === 1 ? one : many);
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor((s.length - 1) / 2)] : null;
};
const list = (parts) => (parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0]);

const TIERS = {
  Condo: [
    { max: 450000, label: (n) => `${n} under $450K` },
    { max: 800000, label: (n) => `${n} from $450K to $800K` },
    { max: Infinity, label: (n) => `${n} at $800K or more` },
  ],
  Home: [
    { max: 600000, label: (n) => `${n} under $600K` },
    { max: 1000000, label: (n) => `${n} from $600K to $1M` },
    { max: 2000000, label: (n) => `${n} from $1M to $2M` },
    { max: Infinity, label: (n) => `${n} at $2M or more` },
  ],
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

// Every active listing of this type in the city (up to 5 pages of 100).
async function allListings(params) {
  const out = [];
  for (let page = 1; page <= 5; page += 1) {
    const data = await api.getListings({ ...params, pageSize: 100, page });
    const rows = data?.results || [];
    out.push(...rows);
    if (rows.length < 100 || (typeof data.total === 'number' && out.length >= data.total)) break;
  }
  return out;
}

// `extra`: an optional closing paragraph (e.g. Viera West's community links).
export async function PropertyAtAGlance({ citySlug, cityName, asOf, propertyType, showBuildingsLink = false, extra = null }) {
  const isCondo = propertyType === 'Condo';
  const noun = isCondo ? { one: 'condo', many: 'condos', Many: 'Condos' } : { one: 'home', many: 'homes', Many: 'Homes' };
  const base = { ...cityListingsQueryParams(citySlug), propertyType };
  const [rows, sold] = await Promise.all([allListings(base).catch(() => []), api.getSoldStats(base).catch(() => null)]);
  const listings = rows.filter((l) => l.status === 'Active' && typeof l.price === 'number' && l.price > 0);
  if (!listings.length) return null;

  const all = group(listings);
  const settings = [
    { label: 'Oceanfront', rows: listings.filter((l) => l.waterfront === 'Oceanfront') },
    { label: 'Riverfront', rows: listings.filter((l) => l.waterfront === 'Riverfront') },
    { label: 'Not on the water', rows: listings.filter((l) => l.waterfront !== 'Oceanfront' && l.waterfront !== 'Riverfront') },
  ]
    .filter((s) => s.rows.length)
    .map((s) => ({ label: s.label, ...group(s.rows) }));

  let prev = 0;
  const tierParts = TIERS[propertyType].map((t) => {
    const n = listings.filter((l) => l.price >= prev && l.price < t.max).length;
    prev = t.max;
    return n ? t.label(n) : null;
  }).filter(Boolean);

  // Bedrooms, square feet and years built across what's for sale (2026-11-27:
  // Google quoted Trulia/Zillow for these ranges on "cocoa beach condos").
  const nums = (key, min) => listings.map((l) => l[key]).filter((x) => typeof x === 'number' && x > min);
  // Typical range: the middle 80% once there are 10+ listings, so one
  // multi-unit building or pre-construction listing doesn't skew it.
  const typical = (xs) => {
    const s2 = [...xs].sort((a, b) => a - b);
    if (s2.length < 10) return [s2[0], s2[s2.length - 1]];
    return [s2[Math.floor(s2.length * 0.1)], s2[Math.ceil(s2.length * 0.9) - 1]];
  };
  const span = (xs, f = (x) => x) => {
    if (!xs.length) return null;
    const [lo, hi] = typical(xs);
    return lo === hi ? f(lo) : `${f(lo)}–${f(hi)}`;
  };
  const thisYear = new Date().getFullYear();
  const builtYears = nums('yearBuilt', 1800);
  const newBuilds = builtYears.filter((y) => y > thisYear).length;
  const builtSpan = span(builtYears.filter((y) => y <= thisYear));
  const bedsSpan = span(nums('beds', 0));
  const sqftSpan = span(nums('sqft', 0), (x) => x.toLocaleString('en-US'));
  const sizeLine = [
    bedsSpan && `mostly ${bedsSpan} bedrooms`,
    sqftSpan && `${sqftSpan} sq ft`,
    builtSpan && `built ${builtSpan}${newBuilds ? `, plus ${newBuilds} new-construction ${v(newBuilds, 'listings', 'listing')}` : ''}`,
  ]
    .filter(Boolean)
    .join(', ');
  // Median list price by bedrooms (2026-11-27: Google quoted Homes.com's
  // 1-, 2- and 3-bed medians for "cape canaveral condos for sale").
  const byBeds = {};
  for (const l of listings) {
    if (!(l.beds > 0)) continue;
    const key = l.beds >= 4 ? 4 : l.beds;
    (byBeds[key] ||= []).push(l.price);
  }
  const bedLine = Object.keys(byBeds)
    .map(Number)
    .sort((a, b) => a - b)
    .filter((b) => byBeds[b].length >= 2)
    .map((b) => `${b === 4 ? '4+' : b}-bedroom median ${short(median(byBeds[b]))} (${byBeds[b].length})`)
    .join(', ');
  const buckets = {};
  if (isCondo) {
    for (const l of listings) {
      const b = rentalBucket(l.rentalRestrictions);
      if (b) buckets[b] = (buckets[b] || 0) + 1;
    }
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

  const headingId = `${noun.many}-glance-heading`;
  return (
    <section className="hibc-prices" aria-labelledby={headingId}>
      <h2 id={headingId} className="hibc-prices__title">
        {cityName} {noun.Many} at a Glance
      </h2>
      <p className="glance-lead">
        <strong>
          {all.count} {v(all.count, noun.many, noun.one)}
        </strong>{' '}
        {v(all.count, 'are', 'is')} for sale in {cityName}, FL right now, from {short(all.low)} to {short(all.high)}, with a
        median list price of {short(all.median)}.
        {sold?.count >= 3 && sold.medianPrice
          ? ` In the past 12 months, ${sold.count} ${noun.many} sold at a median ${short(sold.medianPrice)}${
              sold.medianPerSqft ? ` ($${sold.medianPerSqft} per sq ft)` : ''
            }${sold.medianDaysOnMarket != null ? `, after a median ${sold.medianDaysOnMarket} days on the market` : ''}${
              sold.medianSaleToListPct != null ? `, at ${sold.medianSaleToListPct}% of asking` : ''
            }.`
          : ''}
      </p>
      {/* Inland towns (Viera West, 2026-11-27) have no ocean or river split, so
          the setting table only shows when there is more than one setting. */}
      {settings.length > 1 && (
      <div className="glance-table-wrap">
        <table className="hibc-prices__table glance-table">
          <thead>
            <tr>
              <th scope="col">Setting</th>
              <th scope="col">For sale</th>
              <th scope="col">Price range</th>
              <th scope="col">Median</th>
              {isCondo && <th scope="col">HOA a month</th>}
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s.label}>
                <th scope="row">{s.label}</th>
                <td>{s.count}</td>
                <td>{s.low === s.high ? short(s.low) : `${short(s.low)}–${short(s.high)}`}</td>
                <td>{short(s.median)}</td>
                {isCondo && (
                  <td>
                    {s.hoaLow == null ? '—' : s.hoaLow === s.hoaHigh ? money(s.hoaLow) : `${money(s.hoaLow)}–${money(s.hoaHigh)}`}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {settings.length <= 1 && isCondo && all.hoaLow != null && (
        <p className="glance-lead" style={{ marginTop: 10 }}>
          <strong>HOA:</strong> about{' '}
          {all.hoaLow === all.hoaHigh ? money(all.hoaLow) : `${money(all.hoaLow)}–${money(all.hoaHigh)}`} a month.
        </p>
      )}
      {bedLine && (
        <p className="glance-lead" style={{ marginTop: 10 }}>
          <strong>By bedrooms:</strong> {bedLine}.
        </p>
      )}
      {sizeLine && (
        <p className="glance-lead" style={{ marginTop: 10 }}>
          <strong>Sizes:</strong> {sizeLine}.
        </p>
      )}
      <p className="glance-lead" style={{ marginTop: 10 }}>
        <strong>By price:</strong> {list(tierParts)}.
        {showBuildingsLink ? (
          <>
            {' '}
            <a href="#condo-buildings">Compare {cityName} condo buildings ↓</a>
          </>
        ) : null}
      </p>
      {extra && (
        <p className="glance-lead" style={{ marginTop: 10 }}>
          {extra}
        </p>
      )}
      {isCondo && withRules >= 5 && rentalParts.length > 0 && (
        <p className="glance-lead" style={{ marginTop: 10 }}>
          <strong>Rental rules:</strong> of the {withRules} condos for sale that list their rental rules, {list(rentalParts)}.
          Rules are set by each building, so confirm them on the listing.
        </p>
      )}
      <p className="hibc-prices__note">
        From the Space Coast MLS as of {asOf}.{isCondo ? ' HOA fees shown per month.' : ''}
      </p>
    </section>
  );
}

export default function CondosAtAGlance(props) {
  return <PropertyAtAGlance {...props} propertyType="Condo" />;
}
