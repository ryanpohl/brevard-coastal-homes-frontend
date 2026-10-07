import Link from 'next/link';
import { formatPrice } from '@/lib/constants';
import { MIN_SALES_FOR_CHANGE } from '@/lib/cityMarketReport';

// "{City} {Homes|Condos} Market Snapshot" (2026-10-07, per Ryan) — 12-month
// sold stats from the Space Coast MLS with the change from the 12 months
// before (only when both periods have MIN_SALES_FOR_CHANGE sales), a line
// comparing the city with all the site's cities, and a collapsed
// compare-the-neighborhoods table. Data from lib/cityMarketReport.js.
function pct(current, prior) {
  if (!current || !prior) return null;
  return Math.round(((current - prior) / prior) * 1000) / 10;
}

function Change({ value, suffix = '%' }) {
  if (value == null || !Number.isFinite(value)) return null;
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return (
    <div className="market-tile-change">
      {sign}
      {Math.abs(value)}
      {suffix} vs. prior year
    </div>
  );
}

export default function CityMarketReport({ cityName, typeLabel, report }) {
  const city = report?.city;
  if (!city || !city.count) return null;
  const prior = city.prior;
  const showChange = prior && city.count >= MIN_SALES_FOR_CHANGE && prior.count >= MIN_SALES_FOR_CHANGE;
  const noun = typeLabel.toLowerCase();
  const single = noun.replace(/s$/, '');
  const tiles = [
    { label: `${typeLabel} sold`, value: city.count.toLocaleString('en-US'), change: showChange ? pct(city.count, prior.count) : null },
    city.medianPrice
      ? { label: 'Median sold price', value: formatPrice(city.medianPrice), change: showChange ? pct(city.medianPrice, prior.medianPrice) : null }
      : null,
    city.medianPerSqft
      ? { label: 'Median price / sq ft', value: formatPrice(city.medianPerSqft), change: showChange ? pct(city.medianPerSqft, prior.medianPerSqft) : null }
      : null,
    city.medianDaysOnMarket != null
      ? {
          label: 'Median days on market',
          value: `${city.medianDaysOnMarket}`,
          change: showChange && prior.medianDaysOnMarket != null ? city.medianDaysOnMarket - prior.medianDaysOnMarket : null,
          suffix: ' days',
        }
      : null,
    city.medianSaleToListPct
      ? {
          label: 'Sold vs. list price',
          value: `${city.medianSaleToListPct}%`,
          change: showChange && prior.medianSaleToListPct ? Math.round((city.medianSaleToListPct - prior.medianSaleToListPct) * 10) / 10 : null,
          suffix: ' pts',
        }
      : null,
  ].filter(Boolean);
  const all = report.allCities;
  const rows = report.neighborhoods || [];
  return (
    <section className="container market-report" style={{ padding: '0 clamp(16px, 4vw, 56px) 40px', maxWidth: 900 }}>
      <h2 className="market-report-title">
        {cityName} {typeLabel} Market Snapshot
      </h2>
      <p className="market-report-sub">
        {typeLabel} sold in the last 12 months{showChange ? ', compared with the 12 months before' : ''} · Space Coast MLS, updated daily
      </p>
      <div className="market-tiles">
        {tiles.map((t) => (
          <div key={t.label} className="market-tile">
            <div className="market-tile-value">{t.value}</div>
            <div className="market-tile-label">{t.label}</div>
            <Change value={t.change} suffix={t.suffix} />
          </div>
        ))}
      </div>
      {city.medianSaleToListPct ? (
        <p className="market-report-note">
          The typical {cityName} {single} sold for {city.medianSaleToListPct}% of its final asking price
          {city.medianDaysOnMarket != null ? <> after about {city.medianDaysOnMarket} days on the market</> : null}.
          {all && all.medianPrice ? (
            <>
              {' '}Across all 10 Space Coast cities we cover, the median sold {single} price was {formatPrice(all.medianPrice)}
              {all.medianPerSqft ? <> ({formatPrice(all.medianPerSqft)}/sq ft)</> : null}.
            </>
          ) : null}
        </p>
      ) : null}

      {rows.length > 0 && (
        <details className="market-compare">
          <summary>
            <span className="market-compare-open">Compare {cityName} neighborhoods ▾</span>
            <span className="market-compare-close">Hide neighborhood comparison ▴</span>
          </summary>
          <div style={{ overflowX: 'auto', border: '1px solid var(--color-border-light)', borderRadius: 6, background: '#fff', marginTop: 10 }}>
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
        </details>
      )}
    </section>
  );
}
