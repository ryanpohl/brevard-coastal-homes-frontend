import { notFound } from 'next/navigation';
import Image from 'next/image';
import * as api from '@/lib/api';
import { formatPrice, PROPERTY_TYPE_LABEL, AGENT_INFO } from '@/lib/constants';
import FavoriteButton from '@/components/FavoriteButton';
import InquiryModals from '@/components/InquiryModals';
import ListingMap from '@/components/ListingMap';

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

  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px' }}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: photos.length > 1 ? '2fr 1fr' : '1fr',
          gap: 10,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '62%',
            borderRadius: 8,
            overflow: 'hidden',
            background: 'var(--color-border-light)',
          }}
        >
          {photos[0] && (
            <Image
              src={photos[0]}
              alt={listing.address}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 60vw"
              style={{ objectFit: 'cover' }}
            />
          )}
          <div style={{ position: 'absolute', top: 14, right: 14 }}>
            <FavoriteButton listingId={listing.id} initialFavorited={listing.isFavorited} size={44} />
          </div>
        </div>

        {photos.length > 1 && (
          <div
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(${Math.min(photos.length - 1, 3)}, 1fr)`,
              gap: 10,
            }}
          >
            {photos.slice(1, 4).map((photo, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: 90,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: 'var(--color-border-light)',
                }}
              >
                <Image src={photo} alt={`${listing.address} photo ${i + 2}`} fill sizes="20vw" style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
        <div>
          <p style={{ fontSize: 30, fontWeight: 700, marginBottom: 6 }}>{formatPrice(listing.price)}</p>
          <p style={{ fontSize: 16, color: 'var(--color-muted-dark)', marginBottom: 12 }}>{listing.address}</p>

          <div
            style={{
              display: 'flex',
              gap: 20,
              flexWrap: 'wrap',
              fontSize: 14,
              color: 'var(--color-muted-dark)',
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: '1px solid var(--color-border-light)',
            }}
          >
            {isLand ? (
              <>
                {listing.acreage && <span>{listing.acreage} acres</span>}
                {listing.zoning && <span>{listing.zoning} zoning</span>}
              </>
            ) : (
              <>
                <span>{listing.beds ?? '—'} beds</span>
                <span>{listing.baths ?? '—'} baths</span>
                {listing.sqft && <span>{listing.sqft.toLocaleString()} sqft</span>}
              </>
            )}
            <span>{PROPERTY_TYPE_LABEL[listing.propertyType] || listing.propertyType}</span>
            {listing.waterfront && <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{listing.waterfront}</span>}
          </div>

          {listing.description && <p style={{ lineHeight: 1.7 }}>{listing.description}</p>}

          <div style={{ marginTop: 32 }}>
            <ListingMap
              center={listing.latitude != null && listing.longitude != null ? { lat: listing.latitude, lng: listing.longitude } : null}
              listings={[listing]}
              height={320}
              zoom={15}
            />
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 20, position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-border-light)', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 600 }}>{AGENT_INFO.name}</p>
                <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>{AGENT_INFO.businessName}</p>
              </div>
            </div>
            {AGENT_INFO.phone && <p style={{ fontSize: 14, marginBottom: 4 }}>{AGENT_INFO.phone}</p>}
            {AGENT_INFO.email && <p style={{ fontSize: 14, marginBottom: 16 }}>{AGENT_INFO.email}</p>}

            <InquiryModals listingId={listing.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
