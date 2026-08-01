import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import { formatPrice, PROPERTY_TYPE_LABEL } from '@/lib/constants';
import FavoriteButton from '@/components/FavoriteButton';
import PropertyGallery from '@/components/PropertyGallery';
import PropertyContactPanel from '@/components/PropertyContactPanel';
import ListingMap from '@/components/ListingMap';

// Status badge color — matches design/design_files/Property Detail.dc.html's
// olive-green "ACTIVE" for the common case; the other statuses aren't shown
// in that mockup, so these are reasonable extensions in the same spirit.
const STATUS_COLOR = {
  Active: '#7c8a4c',
  Pending: 'var(--color-gold)',
  Sold: 'var(--color-muted)',
  'Off Market': 'var(--color-muted)',
};

export async function generateMetadata({ params }) {
  try {
    const { listing } = await api.getListing(params.id);
    const typeLabel = PROPERTY_TYPE_LABEL[listing.propertyType] || listing.propertyType;
    return {
      title: `${listing.address} | ${formatPrice(listing.price)} — Brevard Coastal Homes`,
      description: listing.description
        ? listing.description.slice(0, 155)
        : `${typeLabel} for sale in ${listing.city.name}, FL — ${listing.address}.`,
    };
  } catch {
    return {};
  }
}

export default async function ListingDetailPage({ params }) {
  let listing;
  let jsonLd;
  try {
    ({ listing, jsonLd } = await api.getListing(params.id));
  } catch {
    notFound();
  }

  const photos = listing.photos && listing.photos.length ? listing.photos : [];
  const isLand = listing.propertyType === 'Land';

  // MLS full-bath/half-bath counts aren't stored separately — `baths` is a
  // single value like 4.5 (4 full + 1 half), which is how MLS feeds
  // typically report it. Split it back out for the design's separate
  // "FULL BATHS" / "PARTIAL BATHS" stat tiles.
  const fullBaths = listing.baths != null ? Math.floor(listing.baths) : null;
  const partialBaths = listing.baths != null ? Math.round(listing.baths - Math.floor(listing.baths)) : null;

  // Design shows the address on two lines ("street" / "city, state zip");
  // this project's `address` field is one string (e.g. "154 Shorebreak
  // Lane, Melbourne Beach, FL 32951"), so split on the first comma.
  const [streetLine, ...restOfAddress] = listing.address.split(',');
  const cityStateZip = restOfAddress.join(',').trim();

  const mapCenter = listing.latitude != null && listing.longitude != null ? { lat: listing.latitude, lng: listing.longitude } : null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
        maxWidth: 1500,
        margin: '0 auto',
        padding: '24px clamp(16px, 4vw, 56px) 88px',
        alignItems: 'start',
      }}
    >
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      {/* LEFT: photos, header, stats, description, map */}
      <div>
        <div style={{ position: 'relative' }}>
          <PropertyGallery photos={photos} address={listing.address} />
          <div style={{ position: 'absolute', top: 14, right: 14 }}>
            <FavoriteButton listingId={listing.id} initialFavorited={listing.isFavorited} size={44} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginTop: 20 }}>
          <div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 400, color: 'var(--color-ink)' }}>
              {streetLine}
            </div>
            {cityStateZip && (
              <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 400, color: 'var(--color-ink)' }}>
                {cityStateZip}
              </div>
            )}
            <div style={{ fontSize: 12, letterSpacing: 0.8, fontWeight: 600, marginTop: 8, color: STATUS_COLOR[listing.status] || 'var(--color-muted)' }}>
              {listing.status?.toUpperCase()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 600, color: 'var(--color-ink)' }}>{formatPrice(listing.price)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '22px 0', borderBottom: '1px solid var(--color-border-light)' }}>
          {isLand ? (
            <>
              {listing.acreage != null && <StatItem value={listing.acreage} label="Acres" />}
              {listing.zoning && <StatItem value={listing.zoning} label="Zoning" big />}
            </>
          ) : (
            <>
              {listing.beds != null && <StatItem value={listing.beds} label="Beds" />}
              {fullBaths != null && <StatItem value={fullBaths} label="Full Baths" />}
              {partialBaths != null && <StatItem value={partialBaths} label="Partial Baths" />}
            </>
          )}
          <StatItem value={PROPERTY_TYPE_LABEL[listing.propertyType] || listing.propertyType} label="Type" big />
          {!isLand && listing.sqft != null && <StatItem value={listing.sqft.toLocaleString()} label="Sq.Ft." />}
          {listing.mlsId && <StatItem value={listing.mlsId} label="MLS #" />}
        </div>

        {listing.waterfront && listing.waterfront !== 'None' && (
          <p style={{ fontSize: 13, color: 'var(--color-success)', fontWeight: 600, marginTop: 16 }}>{listing.waterfront}</p>
        )}

        {listing.description && <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--color-muted-dark)', marginTop: 20 }}>{listing.description}</p>}

        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Location</h2>
          <ListingMap center={mapCenter} listings={[listing]} height={320} zoom={15} />
        </div>
      </div>

      {/* RIGHT: contact panel (Call/Text + Make an Offer + Ask a Question + inline Request Showing) */}
      <PropertyContactPanel listingId={listing.id} />
    </div>
  );
}

function StatItem({ value, label, big }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: big ? 18 : 22, fontWeight: 700, color: 'var(--color-ink)' }}>{value}</div>
      <div style={{ fontSize: 11, letterSpacing: 0.5, color: 'var(--color-muted-light)', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}
