import Link from 'next/link';
import { BROKERAGE_INFO } from '@/lib/constants';
import { MARKET_REPORTS, MARKET_REPORT_SOURCE, pctChange, sectionSummary } from '@/lib/marketReports';
import ContactUsTrigger from '@/components/ContactUsTrigger';

// Monthly Brevard County market report page body (2026-10-07, per Ryan).
// Mirrors the layout of the report Ryan emails clients; data from
// lib/marketReports.js.
const STATS = [
  { key: 'medianPrice', label: 'Median sales price', format: (v) => `$${Math.round(v).toLocaleString('en-US')}` },
  { key: 'sold', label: 'Sold', format: (v) => v.toLocaleString('en-US') },
  { key: 'daysOnMarket', label: 'Days on market', format: (v) => `${v}` },
  { key: 'monthsSupply', label: 'Months of supply', format: (v) => Number(v).toFixed(1) },
];

function Section({ report, sectionKey, title, soldLabel }) {
  const s = report[sectionKey];
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 24, marginBottom: 12, fontFamily: 'var(--font-inter-tight)', color: 'var(--color-ink)' }}>{title}</h2>
      <div className="report-tiles">
        {STATS.map((stat) => {
          const [current, prior] = s[stat.key];
          const pct = pctChange(s[stat.key]);
          return (
            <div key={stat.key} className="report-tile">
              <div className="report-tile-value">{stat.format(current)}</div>
              <div className="report-tile-label">{stat.key === 'sold' ? soldLabel : stat.label}</div>
              {pct != null && (
                <div className="report-tile-change">
                  {pct > 0 ? '+' : ''}
                  {pct}%
                </div>
              )}
              <div className="report-tile-prior">
                {stat.format(prior)} in {report.priorMonth}
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-muted-dark)', marginTop: 14 }}>{sectionSummary(report, sectionKey)}</p>
    </section>
  );
}

export default function MarketReport({ report }) {
  const others = MARKET_REPORTS.filter((r) => r.slug !== report.slug);
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 960 }}>
      <div style={{ display: 'inline-block', background: 'var(--color-gold)', color: '#fff', fontWeight: 700, letterSpacing: 2, fontSize: 13, padding: '6px 12px', marginBottom: 12, textTransform: 'uppercase' }}>
        {report.month} Market Report
      </div>
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: 10, fontFamily: 'var(--font-inter-tight)' }}>
        Brevard County, FL Home Values: {report.month} Space Coast Real Estate Market Update
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 32 }}>
        Key numbers for Brevard County single-family homes and condos in {report.month}, compared with {report.priorMonth}.
      </p>

      <Section report={report} sectionKey="homes" title="Single-Family Homes" soldLabel="Homes sold" />
      <Section report={report} sectionKey="condos" title="Condos & Townhomes" soldLabel="Units sold" />

      <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: 6, padding: '20px 22px', marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, margin: '0 0 8px', fontFamily: 'var(--font-inter-tight)' }}>What this means for buyers and sellers</h2>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--color-muted-dark)', margin: 0 }}>
          Prices, pace and inventory vary a lot between Brevard’s beach towns, mainland cities and neighborhoods. For
          numbers on a specific area, see the Market Snapshot on any city’s Homes or Condos page — like{' '}
          <Link href="/melbourne-beach/homes-for-sale" style={{ color: 'var(--color-ink)', textDecoration: 'underline' }}>
            Melbourne Beach homes
          </Link>{' '}
          — or <strong><ContactUsTrigger>ask Ryan</ContactUsTrigger></strong> for a free home value estimate or a custom market report.
        </p>
      </div>

      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-muted)', marginBottom: 24 }}>{MARKET_REPORT_SOURCE}</p>

      <p style={{ fontSize: 14, color: 'var(--color-muted-dark)', marginBottom: 28 }}>
        Prepared by Ryan Pohl, {BROKERAGE_INFO.name} · Call or Text:{' '}
        <a href="tel:+13213507661" style={{ color: 'inherit' }}>321-350-7661</a>
      </p>

      {others.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8, fontFamily: 'var(--font-inter-tight)' }}>Past market reports</h2>
          <ul style={{ paddingLeft: 18, lineHeight: 1.9 }}>
            {others.map((r) => (
              <li key={r.slug}>
                <Link href={`/market-report/${r.slug}`} style={{ color: 'var(--color-ink)', textDecoration: 'underline' }}>
                  {r.month} Brevard County Market Report
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
