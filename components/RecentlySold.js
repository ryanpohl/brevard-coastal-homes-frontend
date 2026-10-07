import Link from 'next/link';
import { formatPrice } from '@/lib/constants';
import { RECENTLY_SOLD_VISIBLE } from '@/lib/recentlySold';

// "Recently Sold in {name}" (2026-10-07, per Ryan) — last 12 months of sold
// listings from the MLS feed, server-rendered so search engines and AI tools
// can read the numbers. Data comes from lib/recentlySold.js.
function formatDate(value) {
  if (!value) return '';
  const d = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RecentlySold({ name, data }) {
  if (!data || !data.count) return null;
  const { count, medianPrice, medianPerSqft, recent } = data;
  const shown = recent.slice(0, RECENTLY_SOLD_VISIBLE);
  const more = recent.slice(RECENTLY_SOLD_VISIBLE);
  const renderRow = (l, i) => {
    const sold = l.closePrice ?? l.price;
    const perSqft = l.sqft > 0 ? Math.round(sold / l.sqft) : null;
    const facts = [
      l.beds != null ? `${l.beds} bd` : null,
      l.baths != null ? `${l.baths} ba` : null,
      l.sqft ? `${l.sqft.toLocaleString('en-US')} sq ft` : null,
      perSqft ? `${formatPrice(perSqft)}/sq ft` : null,
    ].filter(Boolean);
    return (
      <div
        key={l.id}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '4px 16px',
          padding: '12px 16px',
          borderTop: i ? '1px solid var(--color-border-light)' : 'none',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <Link href={`/listings/${l.id}`} style={{ color: 'var(--color-ink)', fontWeight: 600, textDecoration: 'underline' }}>
            {l.address}
          </Link>
          <div style={{ fontSize: 14, color: 'var(--color-muted-dark)', marginTop: 2 }}>{facts.join(' · ')}</div>
        </div>
        <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
          <div style={{ fontWeight: 700, color: 'var(--color-ink)' }}>{formatPrice(sold)}</div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Sold {formatDate(l.closeDate)}</div>
        </div>
      </div>
    );
  };
  return (
    <section className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 40px', maxWidth: 760 }}>
      <h2 style={{ fontSize: 24, marginBottom: 8, color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
        Recently Sold in {name}
      </h2>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 16 }}>
        {count} {count === 1 ? 'home' : 'homes'} sold in {name} in the last 12 months
        {medianPrice ? <>, with a median sold price of <strong>{formatPrice(medianPrice)}</strong></> : null}
        {medianPerSqft ? <> and a median of <strong>{formatPrice(medianPerSqft)}/sq ft</strong></> : null}.
      </p>
      <div style={{ border: '1px solid var(--color-border-light)', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
        {shown.map((l, i) => renderRow(l, i))}
        {more.length > 0 && (
          <details className="sold-more">
            <summary
              style={{
                cursor: 'pointer',
                padding: '12px 16px',
                borderTop: '1px solid var(--color-border-light)',
                fontWeight: 600,
                color: 'var(--color-ink)',
                listStyle: 'none',
              }}
            >
              <span className="sold-more-open">Show {more.length} more {name} {more.length === 1 ? 'sale' : 'sales'} ▾</span>
              <span className="sold-more-close">Show fewer sales ▴</span>
            </summary>
            {more.map((l, i) => renderRow(l, i + shown.length))}
          </details>
        )}
      </div>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 8 }}>
        Sold data from the Space Coast MLS, updated daily. Thinking of selling in {name}? Ask Ryan for a free home value estimate.
      </p>
    </section>
  );
}
