import * as api from '@/lib/api';

/**
 * Generic "{Community} at a Glance" box (2026-11-27, per Ryan's AI-visibility
 * push: "use any numbers & statements that will increase our odds"). Live
 * from the MLS for the page's own listing filter: what's for sale by type
 * (count and price range), the typical HOA fee, and the past 12 months of
 * sales; then a few confirmed community facts. First used on Avalonia, where
 * Google's AI Overview quoted Jack Jeffcoat and REMAX for prices.
 */
const PER_MONTH = { Monthly: 1, Quarterly: 1 / 3, Annually: 1 / 12, Yearly: 1 / 12, 'Semi-Annually': 1 / 6 };
const short = (n) => (n >= 1e6 ? `$${parseFloat((n / 1e6).toFixed(2))}M` : `$${Math.round(n / 1000)}K`);
const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;

// `hideHoaRange`: leave out the listings' HOA range where listings mix
// association-only dues with totals (Aquarina's master fee + enclave dues).
// `mode` (2026-11-27, per Ryan: "split them all"): 'top' shows the live
// numbers and the first fact above the listings; 'details' shows the other
// facts in an "About {name}: Key Facts" section below the listings, so phones
// reach the listings sooner while Google and AI tools still read every fact.
export default async function CommunityAtAGlance({ name, filter, asOf, types, facts = [], hideHoaRange = false, mode = 'top' }) {
  if (mode === 'details') {
    const rest = facts.slice(1);
    if (!rest.length) return null;
    return (
      <section className="hibc-prices" aria-labelledby="community-details-heading">
        <h2 id="community-details-heading" className="hibc-prices__title">
          About {name}: Key Facts
        </h2>
        <ul className="glance-facts">
          {rest.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </section>
    );
  }
  const [data, sold] = await Promise.all([
    api.getListings({ ...filter, pageSize: 100 }).catch(() => null),
    api.getSoldStats(filter).catch(() => null),
  ]);
  const listings = (data?.results || []).filter((l) => l.status === 'Active' && typeof l.price === 'number' && l.price > 0);
  const rows = types
    .map((t) => {
      const ls = listings.filter((l) => l.propertyType === t.type);
      if (!ls.length) return null;
      const prices = ls.map((l) => l.price);
      const sorted = [...prices].sort((a, b) => a - b);
      return { ...t, count: ls.length, low: sorted[0], high: sorted[sorted.length - 1], median: sorted[Math.floor((sorted.length - 1) / 2)] };
    })
    .filter(Boolean);
  const fees = listings
    .map((l) => (PER_MONTH[l.assocFeeFrequency] && l.assocFee > 0 ? l.assocFee * PER_MONTH[l.assocFeeFrequency] : null))
    .filter((f) => f != null);
  const hoaLow = fees.length ? Math.min(...fees) : null;
  const hoaHigh = fees.length ? Math.max(...fees) : null;

  return (
    <section className="hibc-prices" aria-labelledby="community-glance-heading">
      <h2 id="community-glance-heading" className="hibc-prices__title">
        {name} at a Glance
      </h2>
      <ul className="glance-stats">
        {rows.length ? (
          rows.map((r) => (
            <li key={r.type}>
              <strong>{r.count}</strong> {r.count === 1 ? r.one : r.many} for sale,{' '}
              {r.low === r.high ? short(r.low) : `${short(r.low)}–${short(r.high)}`}
              {r.count >= 3 ? `, median ${short(r.median)}` : ''}
            </li>
          ))
        ) : (
          <li>Nothing listed for sale right now</li>
        )}
        {!hideHoaRange && hoaLow != null && (
          <li>HOA about {hoaLow === hoaHigh ? money(hoaLow) : `${money(hoaLow)}–${money(hoaHigh)}`} a month</li>
        )}
        {sold?.count >= 3 && sold.medianPrice ? (
          <li>
            {sold.count} sold in the past 12 months, median {short(sold.medianPrice)}
            {sold.medianSaleToListPct != null ? ` (${sold.medianSaleToListPct}% of asking)` : ''}
          </li>
        ) : null}
      </ul>
      {facts.length > 0 && <p className="glance-lead">{facts[0]}</p>}
      {facts.length > 1 && (
        <p className="hibc-prices__note" style={{ marginTop: 6 }}>
          <a href="#community-details-heading">More about {name}: sections, amenities and schools ↓</a>
        </p>
      )}
      <p className="hibc-prices__note">From the Space Coast MLS as of {asOf}.</p>
    </section>
  );
}
