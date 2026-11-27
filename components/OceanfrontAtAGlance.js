import Link from 'next/link';
import * as api from '@/lib/api';
import { getMarketSnapshot } from '@/lib/marketSnapshot';
import { cityListingsQueryParams, WATER_LAND_PAGES } from '@/lib/constants';

/**
 * "{City} Oceanfront at a Glance" (2026-11-27, per Ryan: "our #1 priority
 * should be that we get quoted on Google AI & ChatGPT"). Google's AI Overview
 * for "Melbourne Beach oceanfront homes" quoted Zillow for the price range by
 * property type, days on market and % of asking; ChatGPT sends more visitors
 * to the Melbourne Beach oceanfront homes page than any other. This box puts
 * the same facts near the top, live from the MLS: for each oceanfront type,
 * what's for sale now (count, range, median) and what sold in the last 12
 * months (count, median sold price, days on market, sold vs. asking).
 * Shown on a city's oceanfront pages for cities in OCEANFRONT_GLANCE_CITIES.
 */
// Satellite Beach, Cocoa Beach, Cape Canaveral, Indian Harbour Beach added
// 2026-11-27 (ChatGPT sends visitors to their oceanfront condo pages).
export const OCEANFRONT_GLANCE_CITIES = new Set(['melbourne-beach', 'satellite-beach', 'cocoa-beach', 'cape-canaveral', 'indian-harbour-beach']);

const TYPES = [
  { type: 'Home', label: 'Homes', slug: 'oceanfront-homes-for-sale' },
  { type: 'Condo', label: 'Condos', slug: 'oceanfront-condos-for-sale' },
  { type: 'Land', label: 'Lots', slug: 'oceanfront-land-for-sale' },
];

const short = (n) => (n >= 1e6 ? `$${parseFloat((n / 1e6).toFixed(2))}M` : `$${Math.round(n / 1000)}K`);

export default async function OceanfrontAtAGlance({ citySlug, cityName, asOf }) {
  const base = { ...cityListingsQueryParams(citySlug), waterfront: 'Oceanfront' };
  const types = TYPES.filter(
    (t) => t.type !== 'Land' || WATER_LAND_PAGES[t.slug]?.cities?.includes(citySlug)
  );
  const rows = (
    await Promise.all(
      types.map(async (t) => {
        const [active, sold] = await Promise.all([
          getMarketSnapshot({ ...base, propertyType: [t.type] }).catch(() => null),
          api.getSoldStats({ ...base, propertyType: t.type }).catch(() => null),
        ]);
        return { ...t, active, sold };
      })
    )
  ).filter((r) => (r.active && r.active.count > 0) || (r.sold && r.sold.count > 0));
  if (!rows.length) return null;

  const all = rows.filter((r) => r.active?.count > 0);
  const total = all.reduce((n, r) => n + r.active.count, 0);
  const low = all.length ? Math.min(...all.map((r) => r.active.low).filter(Boolean)) : null;
  const high = all.length ? Math.max(...all.map((r) => r.active.high).filter(Boolean)) : null;

  return (
    <section className="hibc-prices" aria-labelledby="oceanfront-glance-heading">
      <h2 id="oceanfront-glance-heading" className="hibc-prices__title">
        {cityName} Oceanfront at a Glance
      </h2>
      {total > 0 && low && high && (
        <p className="glance-lead">
          <strong>{total} oceanfront properties</strong> are for sale in {cityName}, FL right now, from {short(low)} to{' '}
          {short(high)}.
        </p>
      )}
      <div className="glance-table-wrap">
        <table className="hibc-prices__table glance-table">
          <thead>
            <tr>
              <th scope="col">Oceanfront</th>
              <th scope="col">For sale now</th>
              <th scope="col">Price range</th>
              <th scope="col">Median sold, past 12 months</th>
              <th scope="col">Days on market</th>
              <th scope="col">Sold vs. asking</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.type}>
                <th scope="row">
                  <Link href={`/${citySlug}/${r.slug}`}>{r.label}</Link>
                </th>
                <td>{r.active?.count || 0}</td>
                <td>
                  {r.active?.count > 0
                    ? r.active.low === r.active.high
                      ? short(r.active.low)
                      : `${short(r.active.low)}–${short(r.active.high)}`
                    : '—'}
                </td>
                <td>
                  {r.sold?.count > 0 && r.sold.medianPrice
                    ? `${short(r.sold.medianPrice)} (${r.sold.count} sold)`
                    : '—'}
                </td>
                <td>{r.sold?.count >= 3 && r.sold.medianDaysOnMarket != null ? `${r.sold.medianDaysOnMarket} days` : '—'}</td>
                <td>{r.sold?.count >= 3 && r.sold.medianSaleToListPct != null ? `${r.sold.medianSaleToListPct}%` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hibc-prices__note">
        From the Space Coast MLS as of {asOf}. Sold figures are medians for oceanfront sales in the past 12 months (days on market and sold vs. asking shown once there are at least 3 sales).
      </p>
    </section>
  );
}
