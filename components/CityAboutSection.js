import Link from 'next/link';
import { formatPrice } from '@/lib/constants';

// "About {city} …" section for CITY_PAGE_SEO pages (2026-10-03) — page-
// specific copy, a live market snapshot, an agent line, and links to the
// city's other listing pages, neighborhoods and Area Guide (minus the
// current page). Shared by app/[citySlug]/page.js and
// app/[citySlug]/[propertySlug]/page.js.
export default function CityAboutSection({ config, page, currentPath, snapshot }) {
  const updated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  });
  const links = config.relatedLinks.filter((l) => l.href !== currentPath);
  return (
    <section
      className="container"
      style={{
        padding: '0 clamp(16px, 4vw, 56px) 48px',
        maxWidth: 760,
        fontSize: 17,
        lineHeight: 1.65,
        color: 'var(--color-muted-dark)',
      }}
    >
      <h2 style={{ fontSize: 24, marginBottom: 12, color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
        {page.aboutHeading}
      </h2>
      {page.about.map((text) => (
        <p key={text.slice(0, 32)} style={{ marginBottom: 12 }}>
          {text}
        </p>
      ))}
      {snapshot && snapshot.count > 0 && (
        <p style={{ marginBottom: 12 }}>
          <strong style={{ color: 'var(--color-ink)' }}>Market snapshot:</strong> {snapshot.count} active{' '}
          {snapshot.count === 1 ? 'listing' : 'listings'}
          {snapshot.median != null && <>, median list price {formatPrice(snapshot.median)}</>}
          {snapshot.low != null && snapshot.high != null && snapshot.low !== snapshot.high && (
            <>
              {' '}
              (from {formatPrice(snapshot.low)} to {formatPrice(snapshot.high)})
            </>
          )}
          . Updated {updated}.
        </p>
      )}
      <p style={{ marginBottom: 16 }}>
        Ryan Pohl of Brevard Coastal Homes helps buyers compare {config.name} {page.agentNoun}, arrange private
        showings, and negotiate purchases from first search to closing.
      </p>
      <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
        More {config.name} real estate
      </h3>
      <p style={{ lineHeight: 2 }}>
        {links.map((l, i) => (
          <span key={l.href}>
            {i > 0 && ' · '}
            <Link href={l.href} style={{ color: '#000', textDecoration: 'underline' }}>
              {l.label}
            </Link>
          </span>
        ))}
      </p>
    </section>
  );
}
