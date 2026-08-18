import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import { formatPrice, PROPERTY_TYPE_LABEL } from '@/lib/constants';
import FavoriteButton from '@/components/FavoriteButton';
import PropertyGallery from '@/components/PropertyGallery';
import PropertyContactPanel from '@/components/PropertyContactPanel';
import ListingMap from '@/components/ListingMap';
import ViewTracker from '@/components/ViewTracker';

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
  // Per Ryan (2026-08-14): on condo/townhome listings, the Assoc Fee /
  // Assoc Fee Freq stats are more useful than the redundant "Type: Condos/
  // Townhomes" tile (the page heading and URL already say it's a condo
  // page), so they replace it in that slot. Falls back to showing Type as
  // before whenever a condo listing has neither value set (e.g. not yet
  // synced/populated by the MLS feed), so the stat row never renders an
  // empty gap.
  const isCondo = listing.propertyType === 'Condo';
  const hasAssocFeeData = listing.assocFee != null || Boolean(listing.assocFeeFrequency);
  const showAssocFeeStats = isCondo && hasAssocFeeData;

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
    <>
      {/* Two-column split for the property detail layout, widened 1.25in
          (120px) toward the LEFT (photos/details) at the RIGHT (scheduling/
          contact panel)'s expense, per Ryan (2026-08-10, bumped up from an
          initial 1in/96px per a follow-up request). Plain CSS Grid instead
          of flexbox: flexbox's percentage flex-basis doesn't account for
          `gap`, and the contact panel's date-picker grid has enough
          intrinsic min-content width to force an unwanted wrap once its
          basis is trimmed. Grid's `fr` unit *does* auto-subtract gap
          (confirmed: 1fr 1fr with a 24px gap splits evenly, no overflow),
          but mixing fr with px inside calc() (`calc(1fr + 120px)`) turned
          out to be broken in this browser (both tracks rendered at 100%
          width) — verified locally with Playwright before relying on it.
          So the 120px shift is done with percentages instead, with the
          24px gap manually pre-subtracted (12px off each side) since,
          unlike fr, percentage tracks do NOT auto-subtract gap (also
          confirmed via the same test — a naive `calc(50% + 120px)` /
          `calc(50% - 120px)` pair would overflow the container by exactly
          the gap width). Below 1050px this collapses to one column — same
          stacking behavior as the previous grid's auto-fit/minmax, just
          re-expressed as an explicit breakpoint since minmax() can't do
          an asymmetric split. 1050px (bumped up from 1000px along with the
          96px→120px change) is where the narrower RIGHT column stays at
          least ~340px right up to the breakpoint — verified with
          Playwright at a range of widths so the contact panel's date-grid
          doesn't get uncomfortably squeezed just before the layout flips
          to single-column. */}
      <style>{`
        .listing-detail-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 24px;
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px clamp(16px, 4vw, 56px) 88px;
          align-items: start;
        }
        @media (min-width: 1050px) {
          .listing-detail-grid {
            grid-template-columns: calc(50% + 108px) calc(50% - 132px);
          }
        }
      `}</style>
      <div className="listing-detail-grid">
        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

        {/* Fire-and-forget page-view tracking for signed-in users (added
            2026-08-18, per Ryan — mirrors FavoriteButton below; see
            components/ViewTracker.js). Renders nothing. */}
        <ViewTracker listingId={listing.id} />

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
            {showAssocFeeStats ? (
              <>
                {listing.assocFee != null && <StatItem value={formatPrice(listing.assocFee)} label="Assoc Fee" big />}
                {listing.assocFeeFrequency && <StatItem value={listing.assocFeeFrequency} label="Assoc Fee Freq" big />}
              </>
            ) : (
              <StatItem value={PROPERTY_TYPE_LABEL[listing.propertyType] || listing.propertyType} label="Type" big />
            )}
            {!isLand && listing.sqft != null && <StatItem value={listing.sqft.toLocaleString()} label="Sq.Ft." />}
            {/* Rental Restrictions, placed immediately after Sq.Ft. per Ryan
                (2026-08-10) — e.g. "1 Week", "3 Months, No Lease 1st Year".
                Sourced from the MLS feed's CustomFields (see
                mapRentalRestrictions() in the backend's
                listingMapper.service.js); null/omitted when not set. */}
            {listing.rentalRestrictions && <StatItem value={listing.rentalRestrictions} label="Rental Restrictions" />}
            {/* mlsNumber is the public MLS# (e.g. "1075392") — fixed 2026-08-10
                per Ryan (was previously showing mlsId, Spark's internal
                ListingKey, by mistake — see backend's schema.sql comment). */}
            {listing.mlsNumber && <StatItem value={listing.mlsNumber} label="MLS #" />}
          </div>

          {listing.waterfront && listing.waterfront !== 'None' && (
            <p style={{ fontSize: 13, color: 'var(--color-success)', fontWeight: 600, marginTop: 16 }}>{listing.waterfront}</p>
          )}

          {listing.description && <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--color-muted-dark)', marginTop: 20 }}>{listing.description}</p>}

          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>Location</h2>
            {/* Height bumped 320 -> 440 (2026-08-16, per Ryan): the popup
                that opens on hovering this page's single self-pin was
                getting clipped to a tiny internal scrollbar (see the
                domready fix in ListingMap.js) because 320px didn't leave
                Google's InfoWindow autopan enough room above the pin to
                fit the full price/address/stats content. A taller map
                gives autopan the room it needs so the popup renders in
                full without scrolling, matching the taller (and
                scroll-free) maps on the city/neighborhood results pages. */}
            <ListingMap center={mapCenter} listings={[listing]} height={440} zoom={15} />
          </div>
        </div>

        {/* RIGHT: contact panel (Call/Text + Make an Offer + Ask a Question + inline Request Showing).
            listingAddress auto-fills the "Address of Property" field in
            both the Make an Offer modal and the Request Showing form
            below (per Ryan, 2026-08-17) — still editable, not read-only. */}
        <PropertyContactPanel listingId={listing.id} listingAddress={listing.address} />
      </div>
    </>
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
