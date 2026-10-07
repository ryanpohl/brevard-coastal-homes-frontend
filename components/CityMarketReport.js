import Link from 'next/link';
import { formatPrice } from '@/lib/constants';

// "{City} {Homes|Condos} Market Snapshot" (2026-10-07, per Ryan) — 12-month
// sold stats from the Space Coast MLS plus a compare-the-neighborhoods
// table linking to each neighborhood page. Data from lib/cityMarketReport.js.
export default function CityMarketReport({ cityName, typeLabel, report }) {
  const city = report?.city;
  if (!city || !city.count) return null;
  const noun = typeLabel.toLowerCase();
  const tiles = [
    { label: `${typeLabel} sold`, value: city.count.toLocaleString('en-US') },
    city.medianPrice ? { label: 'Median sold price', value: formatPrice(city.medianPrice) } : null,
    city.medianPerSqft ? { label: 'Median price / sq ft', value: formatPrice(city.medianPerSqft) } : null,
    city.medianDaysOnMarket != null ? { label: 'Median days on market', value: `${city.medianDaysOnMarket}` } : null,
    city.medianSaleToListPct ? { label: 'Sold vs. list price', value: `${city.medianSaleToListPct}%` } : null,
  ].filter(Boolean);
  const rows = report.neighborhoods || [];
  return (
    <section className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 40px', maxWidth: 900 }}>
      <h2 style={{ fontSize: 24, marginBottom: 6, color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
        {cityName} {typeLabel} Market Snapshot
      </h2>
      <p style={{ fontSize: 15, color: 'var(--color-muted-dark)', marginBottom: 16 }}>
        {typeLabel} sold in {cityName} in the last 12 months, from the Space Coast MLS (updated daily).
      </p>
      <div className="market-tiles">
        {tiles.map((t) => (
          <div key={t.label} className="market-tile">
            <div className="market-tile-value">{t.value}</div>
            <div className="market-tile-label">{t.label}</div>
          </div>
        ))}
      </div>
      {city.medianSaleToListPct ? (
        <p style={{ fontSize: 15, color: 'var(--color-muted-dark)', margin: '14px 0 0', lineHeight: 1.6 }}>
          The typical {cityName} {noun.replace(/s$/, '')} sold for {city.medianSaleToListPct}% of its final asking price
          {city.medianDaysOnMarket != null ? <> after about {city.medianDaysOnMarket} days on the market</> : null}.
        </p>
      ) : null}

      {rows.length > 0 && (
        <>
          <h3 style={{ fontSize: 20, margin: '28px 0 10px', color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
            Compare {cityName} Neighborhoods
          </h3>
          <div style={{ overflowX: 'auto', border: '1px solid var(--color-border-light)', borderRadius: 6, background: '#fff' }}>
            <table className="market-table">
              <thead>
                <tr>
                  <th>Neighborhood</th>
                  <th>Sold</th>
                  <th>Median</th>
                  <th>$/sq ft</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.slug}>
                    <td>
                      <Link href={r.href} style={{ color: 'var(--color-ink)', fontWeight: 600, textDecoration: 'underline' }}>
                        {r.label}
                      </Link>
                    </td>
                    <td>{r.stats.count}</td>
                    <td>{r.stats.medianPrice ? formatPrice(r.stats.medianPrice) : '—'}</td>
                    <td>{r.stats.medianPerSqft ? formatPrice(r.stats.medianPerSqft) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 8 }}>
            {typeLabel} sold in the last 12 months. Neighborhoods with no {noun} sold in that time aren’t listed.
          </p>
        </>
      )}
    </section>
  );
}
