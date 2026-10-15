import Link from 'next/link';
import { condoBuildingDetail, condoBuildingHref } from '@/lib/condoBuildings';
import { formatPrice } from '@/lib/constants';

// Building-by-building comparison table on a city's condo pages
// (2026-10-15, per Ryan). Rows come from getCondoBuildingComparison in
// lib/condoBuildings.js. Scrolls sideways inside its own box on phones
// (.condo-compare in globals.css), never the whole page.
const short = (n) => (n >= 1000000 ? `$${(n / 1000000).toFixed(n >= 10000000 ? 0 : 2).replace(/\.?0+$/, '')}M` : `$${Math.round(n / 1000)}K`);

export default function CondoBuildingComparison({ rows, citySlug, cityName, oceanfrontOnly = false }) {
  if (!rows || !rows.length) return null;
  const what = oceanfrontOnly ? 'oceanfront condo buildings' : 'condo buildings';
  return (
    <section className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 40px', maxWidth: 1100 }}>
      <h2 className="market-report-title">
        {cityName} {oceanfrontOnly ? 'Oceanfront Condo Buildings' : 'Condo Buildings'} Compared
      </h2>
      <p className="market-report-sub">
        How {cityName}&rsquo;s most active {what} compare right now: listings for sale, asking prices, what units sold for over
        the last 12 months, typical HOA fees and the usual minimum rental term. Updated hourly from the MLS.
      </p>
      <p className="condo-compare-hint">Swipe the table to see prices, HOA fees and rental rules &rarr;</p>
      <div className="condo-compare">
        <table>
          <thead>
            <tr>
              <th>Building</th>
              <th>For sale now</th>
              <th>Asking prices</th>
              <th>Median sale (12 mo)</th>
              <th>HOA / month</th>
              <th>Min. rental</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.building.slug}>
                <td>
                  <Link href={condoBuildingHref(citySlug, r.building)} className="condo-compare-name">
                    {r.building.name}
                  </Link>
                  <span className="condo-compare-detail">{condoBuildingDetail(r.building)}</span>
                </td>
                <td>{r.forSale || '—'}</td>
                <td>{r.low == null ? '—' : r.low === r.high ? short(r.low) : `${short(r.low)}–${short(r.high)}`}</td>
                <td>{r.soldMedian ? `${formatPrice(r.soldMedian)}${r.soldCount ? ` (${r.soldCount} sold)` : ''}` : '—'}</td>
                <td>{r.feeMedian ? `~${formatPrice(r.feeMedian)}` : '—'}</td>
                <td>{r.rentalMinimum || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 13, color: 'var(--color-muted-dark)', marginTop: 10 }}>
        HOA is the typical monthly fee across recent listings; always confirm the fee, what it covers and any special
        assessments on the specific unit. Min. rental is the shortest lease term most listings in the building report.
      </p>
    </section>
  );
}
