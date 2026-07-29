import Image from 'next/image';
import Link from 'next/link';
import * as api from '@/lib/api';
import { PROPERTY_TYPE_TO_SLUG, placePhotoUrl } from '@/lib/constants';
import SearchBar from '@/components/SearchBar';

export const metadata = {
  title: 'Brevard Coastal Homes | Homes, Condos & Land For Sale in Brevard County, FL',
  description:
    'Search homes, condos, and land for sale across Cocoa Beach, Melbourne Beach, Satellite Beach, Viera, and every coastal city and neighborhood in Brevard County, FL.',
};

export default async function HomePage() {
  let cities = [];
  let neighborhoods = [];
  try {
    [{ cities }, { neighborhoods }] = await Promise.all([api.getCities(), api.getNeighborhoods()]);
  } catch {
    // Backend unreachable — render the page with empty search options rather than crashing.
  }

  return (
    <div>
      <div style={{ position: 'relative', height: 560, background: 'var(--color-nav-bg)' }}>
        <Image
          src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80"
          alt="Brevard County coastal estate"
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.85 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#fff',
            background: 'linear-gradient(180deg, rgba(28,27,48,0.15), rgba(28,27,48,0.55))',
          }}
        >
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', maxWidth: 800 }}>Brevard County Listings</h1>
        </div>
      </div>

      <div className="container">
        <SearchBar cities={cities} neighborhoods={neighborhoods} />
      </div>

      <section className="container" style={{ padding: '64px clamp(16px, 4vw, 56px)' }}>
        <h2 className="section-heading">Search By City</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {cities.map((city) => (
            <PlaceCard key={city.slug} name={city.name} thumbnail={city.thumbnail} href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Home}`} />
          ))}
        </div>
      </section>

      <section className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 64px' }}>
        <h2 className="section-heading">Search By Neighborhood</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {neighborhoods.map((n) => (
            <PlaceCard key={n.slug} name={n.name} thumbnail={n.thumbnail} href={`/neighborhoods/${n.slug}`} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PlaceCard({ name, thumbnail, href }) {
  const src = placePhotoUrl(thumbnail);
  return (
    <Link href={href} className="card" style={{ overflow: 'hidden', display: 'block' }}>
      <div style={{ position: 'relative', width: '100%', paddingTop: '75%', background: '#e6e1d6' }}>
        {src && <Image src={src} alt={name} fill sizes="20vw" style={{ objectFit: 'cover' }} />}
      </div>
      <p style={{ padding: 12, fontWeight: 600, fontSize: 14 }}>{name}</p>
    </Link>
  );
}
