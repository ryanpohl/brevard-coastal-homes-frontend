import Image from 'next/image';
import Link from 'next/link';
import * as api from '@/lib/api';
import { PROPERTY_TYPE_TO_SLUG, placePhotoUrl } from '@/lib/constants';
import SearchBar from '@/components/SearchBar';

export const metadata = {
  title: 'Brevard Coastal Homes | Homes, Condos & Land For Sale in Brevard County, FL',
  description:
    'Search homes, condos, and land for sale across Cocoa Beach, Melbourne Beach, Satellite Beach, Viera East, and every coastal city and neighborhood in Brevard County, FL.',
};

// Per-city crop overrides for PlaceCard's cover photo. The default center
// crop works for most thumbnails, but tall portrait source photos can lose
// their focal point (e.g. the Cocoa Beach Pier sign sits near the top of
// its source image and gets cropped out by a center crop) — override those
// here rather than re-cropping the source file.
const CITY_IMAGE_POSITION = {
  'cocoa-beach': 'top',
};

export default async function HomePage() {
  let cities = [];
  let neighborhoods = [];
  try {
    [{ cities }, { neighborhoods }] = await Promise.all([api.getCities(), api.getNeighborhoods()]);
  } catch {
    // Backend unreachable — render the page with empty search options rather than crashing.
  }

  // Schema Markup for SEO (2026-08-15, per Ryan: "add a Schema Markup for
  // SEO for the homepage") — Organization/RealEstateAgent + WebSite
  // JSON-LD (see backend's getHomeSeo / buildOrganizationSchema /
  // buildWebsiteSchema for what's in it). Fetched separately from
  // cities/neighborhoods above, in its own try/catch — same "render the
  // page rather than crash" pattern every other await here uses, so a
  // temporarily-unreachable backend takes down just the JSON-LD block,
  // not the whole homepage.
  let jsonLd = null;
  try {
    ({ jsonLd } = await api.getHomeSeo());
  } catch {
    // No SEO data available — render the page without JSON-LD rather than crashing.
  }

  return (
    <div>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <div style={{ position: 'relative', width: '100%', minHeight: 692, background: 'var(--color-nav-bg)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 692, overflow: 'hidden' }}>
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
              // Bodoni Moda (2026-09-04, per Ryan: "Use the second option"
              // — picked from a mockup matching a reference site's
              // high-contrast Didot-style serif) — was
              // var(--font-inter-tight) (2026-08-21 sitewide-text change).
              // This is the one homepage headline that's gone back to a
              // serif; everything else on the homepage stays Inter Tight.
              fontFamily: 'var(--font-didot)',
              fontWeight: 500,
              fontSize: 'clamp(28px, 5vw, 46px)',
              color: '#ffffff',
              margin: '0 0 28px',
              textAlign: 'center',
              textShadow: '0 2px 18px rgba(0,0,0,0.35)',
              letterSpacing: 2,
            }}
          >
            Brevard County Listings
          </h1>

          <SearchBar cities={cities} neighborhoods={neighborhoods} />
        </div>
      </div>

      {/* Cream background (2026-09-04, per Ryan: picked "Style B" from a card
          mockup) — was var(--color-nav-bg) (navy) with white heading text.
          Switched together with PlaceCard's label move (see below): the
          card labels moved off the photo to sit underneath it in dark
          serif text, which isn't readable on the old navy band, so this
          section (and Search By Neighborhood below) moved to the site's
          cream body color instead. Bookends nicely with the still-navy
          hero above and Footer below. */}
      <div style={{ background: 'var(--color-bg)', padding: '64px 0' }}>
        <section className="wide-container">
          <h2 className="section-heading" style={{ color: 'var(--color-ink-dark)', fontFamily: 'var(--font-inter-tight)' }}>
            Search By City
          </h2>
          <div className="city-grid">
            {cities.map((city) => (
              <PlaceCard
                key={city.slug}
                name={city.name}
                thumbnail={city.thumbnail}
                href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Home}`}
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 100vw"
                objectPosition={CITY_IMAGE_POSITION[city.slug]}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Cream background (2026-09-04, per Ryan) — see comment on the
          Search By City section above; same reasoning applies here. */}
      <div style={{ background: 'var(--color-bg)', padding: '0 0 64px' }}>
        <section className="wide-container">
          <h2 className="section-heading" style={{ color: 'var(--color-ink-dark)', fontFamily: 'var(--font-inter-tight)' }}>
            Search By Neighborhood
          </h2>
          <div className="city-grid">
            {neighborhoods.map((n) => (
              <PlaceCard
                key={n.slug}
                name={n.name}
                thumbnail={n.thumbnail}
                href={`/neighborhoods/${n.slug}`}
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 100vw"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Name-below-photo treatment (2026-09-04, per Ryan: "Let's do style B" —
// picked from a comparison mockup showing the name overlaid on the photo
// vs. below it in serif caps, matching a reference site he sent). Was:
// name overlaid on the photo itself, white Inter Tight text over a dark
// gradient scrim. Now: the photo runs uncropped by any overlay, and the
// name sits underneath in Playfair Display caps, echoing the header
// wordmark from the 2026-09-04 header redesign. The gold rule that
// originally sat between photo and name was removed the same day, per
// Ryan: "delete the line ... between the pictures & the names."
function PlaceCard({ name, thumbnail, href, sizes, objectPosition = 'center' }) {
  const src = placePhotoUrl(thumbnail);
  return (
    <Link href={href} className="place-card">
      <div className="place-card-photo" style={{ background: '#2a3942' }}>
        {src && (
          <Image
            src={src}
            alt={name}
            fill
            sizes={sizes}
            className="place-card-image"
            style={{ objectFit: 'cover', objectPosition }}
          />
        )}
      </div>
      <div className="place-card-label-wrap">
        <p className="place-card-label">{name}</p>
      </div>
    </Link>
  );
}
