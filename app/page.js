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
      <div style={{ position: 'relative', width: '100%', minHeight: 716, background: 'var(--color-nav-bg)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 716, overflow: 'hidden' }}>
          <Image
            src="/hero/brevard-hero.jpg"
            alt="Beachfront estate with private pool overlooking the Brevard County coastline"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(15,35,45,0.35) 0%, rgba(15,35,45,0.15) 40%, rgba(10,25,32,0.55) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '188px 16px 104px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 'clamp(28px, 5vw, 46px)',
              color: '#ffffff',
              margin: '0 0 28px',
              textAlign: 'center',
              textShadow: '0 2px 18px rgba(0,0,0,0.35)',
              letterSpacing: 1,
            }}
          >
            Brevard County Listings
          </h1>

          <SearchBar cities={cities} neighborhoods={neighborhoods} />
        </div>
      </div>

      <div style={{ background: 'var(--color-nav-bg)', padding: '64px 0' }}>
        <section className="container">
          <h2 className="section-heading" style={{ color: '#fff' }}>
            Search By City
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {cities.map((city) => (
              <PlaceCard
                key={city.slug}
                name={city.name}
                thumbnail={city.thumbnail}
                href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Home}`}
                sizes="(min-width: 900px) 20vw, (min-width: 600px) 33vw, 50vw"
              />
            ))}
          </div>
        </section>
      </div>

      <div style={{ background: 'var(--color-nav-bg)', padding: '0 0 64px' }}>
        <section className="container">
          <h2 className="section-heading" style={{ color: '#fff' }}>
            Search By Neighborhood
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {neighborhoods.map((n) => (
              <PlaceCard
                key={n.slug}
                name={n.name}
                thumbnail={n.thumbnail}
                href={`/neighborhoods/${n.slug}`}
                sizes="(min-width: 900px) 25vw, (min-width: 600px) 33vw, 50vw"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function PlaceCard({ name, thumbnail, href, sizes }) {
  const src = placePhotoUrl(thumbnail);
  return (
    <Link
      href={href}
      style={{ position: 'relative', display: 'block', overflow: 'hidden', width: '100%', paddingTop: '75%', background: '#2a3942' }}
    >
      {src && (
        <Image
          src={src}
          alt={name}
          fill
          sizes={sizes}
          style={{ objectFit: 'cover' }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(8,18,23,0.82) 100%)',
          pointerEvents: 'none',
        }}
      />
      <p
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: '10px 14px 16px',
          color: '#fff',
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          fontSize: 18,
          textAlign: 'center',
          lineHeight: 1.25,
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
      >
        {name}
      </p>
    </Link>
  );
}
