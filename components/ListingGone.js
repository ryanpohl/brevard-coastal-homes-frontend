'use client';

// "No longer available" page for a listing that sold or came off the market
// (2026-11-12, per Ryan: Search Console showed ~395 old listing pages
// returning a plain 404). The page still answers 404 so Google drops it;
// visitors see similar homes in the same community or town instead.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ListingCard from '@/components/ListingCard';
import { API_BASE_URL } from '@/lib/api';

async function getJson(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, { signal: AbortSignal.timeout(8000) });
  return { status: res.status, data: await res.json().catch(() => null) };
}

async function listings(params) {
  const qs = new URLSearchParams({ pageSize: '6', ...params }).toString();
  const { data } = await getJson(`/api/listings?${qs}`);
  return (data && data.results) || [];
}

export default function ListingGone() {
  const pathname = usePathname();
  const [hint, setHint] = useState(null);
  const [homes, setHomes] = useState(null);

  useEffect(() => {
    const id = (pathname || '').split('/').filter(Boolean)[1];
    let cancelled = false;
    (async () => {
      let similar = null;
      try {
        if (id) similar = (await getJson(`/api/listings/${encodeURIComponent(id)}`)).data?.similar || null;
      } catch {
        similar = null;
      }
      const tries = [];
      if (similar) {
        const base = { propertyType: similar.propertyType };
        const band = similar.price > 0 ? { priceMin: Math.round(similar.price * 0.7), priceMax: Math.round(similar.price * 1.4) } : {};
        if (similar.neighborhoodSlug) tries.push({ ...base, ...band, neighborhood: similar.neighborhoodSlug });
        tries.push({ ...base, ...band, city: similar.citySlug });
        tries.push({ ...base, city: similar.citySlug });
        tries.push({ city: similar.citySlug });
      }
      tries.push({});
      let found = [];
      for (const params of tries) {
        try {
          found = await listings(params);
        } catch {
          found = [];
        }
        if (found.length >= 3) break;
      }
      if (!cancelled) {
        setHint(similar);
        setHomes(found);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const place = hint ? hint.neighborhoodName || hint.cityName : null;
  return (
    <div className="container" style={{ padding: '40px clamp(16px, 4vw, 56px) 64px' }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', marginBottom: 10, fontFamily: 'var(--font-inter-tight)' }}>
        This home is no longer available
      </h1>
      <p style={{ fontSize: 17, marginBottom: 28, color: 'var(--color-muted-dark)', maxWidth: 720 }}>
        It has sold or come off the market.{' '}
        {place ? `Here are similar homes for sale in ${place} right now.` : 'Here are homes for sale right now.'}
      </p>
      {homes === null ? (
        <p style={{ color: 'var(--color-muted-dark)' }}>Finding similar homes…</p>
      ) : (
        homes.length > 0 && (
          <div className="condo-listing-grid">
            {homes.slice(0, 6).map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )
      )}
      <p style={{ marginTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {hint && (
          <Link
            href={hint.neighborhoodSlug ? `/neighborhoods/${hint.neighborhoodSlug}` : `/${hint.citySlug}`}
            style={{ fontWeight: 700, textDecoration: 'underline', color: '#000' }}
          >
            See all {place} listings &rarr;
          </Link>
        )}
        <Link href="/search" style={{ fontWeight: 700, textDecoration: 'underline', color: '#000' }}>
          Search all homes &rarr;
        </Link>
      </p>
      <p style={{ marginTop: 16, color: 'var(--color-muted-dark)' }}>
        Questions about this home or ones like it? Call or text Ryan at{' '}
        <a href="tel:+13213507661" style={{ color: '#000', fontWeight: 600 }}>
          321-350-7661
        </a>
        .
      </p>
    </div>
  );
}
