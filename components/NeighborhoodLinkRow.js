import Link from 'next/link';

// Compact neighborhood link row (2026-10-04, per Ryan) shown under a city
// page's intro — e.g. every Viera West neighborhood on /viera-west — so
// buyers can jump straight to a neighborhood's own listings page.
export default function NeighborhoodLinkRow({ cityName, links }) {
  if (!links?.length) return null;
  return (
    <p style={{ fontSize: 15, lineHeight: 1.9, marginBottom: 12, color: 'var(--color-muted-dark)' }}>
      <strong style={{ color: 'var(--color-ink)' }}>{cityName} neighborhoods:</strong>{' '}
      {links.map((l, i) => (
        <span key={l.href}>
          {i > 0 && ' · '}
          <Link href={l.href} style={{ color: '#000', textDecoration: 'underline' }}>
            {l.label}
          </Link>
        </span>
      ))}
    </p>
  );
}
