'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { formatPrice } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';

export default function ListingCard({ listing, onHoverChange }) {
      const { signedIn, token } = useAuth();
      const [favorited, setFavorited] = useState(listing.isFavorited);
      const [busy, setBusy] = useState(false);
      const [isHovering, setIsHovering] = useState(false);
      const photo = listing.photos && listing.photos[0];

  // Hover-highlight (per Ryan, 2026-08-10, referencing a competitor site's
  // map-search UX): hovering a card highlights this card AND the matching
  // pin on the adjacent ListingMap, so a visitor can see where the listing
  // sits. `onHoverChange` is only wired up by ListingResultsLayout (the
  // city/neighborhood search-results pages) — it's undefined/unused
  // wherever ListingCard renders without a map next to it (e.g. My
  // Account's Favorites list), so this is a no-op there.
  function handleMouseEnter() {
          setIsHovering(true);
          onHoverChange?.(true);
  }
      function handleMouseLeave() {
              setIsHovering(false);
              onHoverChange?.(false);
      }

  async function toggleFavorite(e) {
          e.preventDefault();
          if (!signedIn || busy) return;
          setBusy(true);
          try {
                    if (favorited) {
                                await api.removeFavorite(token, listing.id);
                    } else {
                                await api.addFavorite(token, listing.id);
                    }
                    setFavorited(!favorited);
          } catch {
                    // leave state unchanged on failure
          } finally {
                    setBusy(false);
          }
  }

  const isLand = listing.propertyType === 'Land';

  // Rental Restrictions next to sqft on listing cards (city + neighborhood
  // pages), per Ryan (2026-08-10) — e.g. "1 Week", "3 Months, No Lease 1st
  // Year". Explicitly excluded on Adelaide, Aripeka, and Summer Lakes (all
  // Viera neighborhoods — per Ryan's follow-up) even when the MLS feed has a
  // value, hence the slug check here rather than just `listing.rentalRestrictions`.
  const RENTAL_RESTRICTIONS_EXCLUDED_SLUGS = ['adelaide', 'aripeka', 'summer-lakes'];
      const showRentalRestrictions =
              listing.rentalRestrictions && !RENTAL_RESTRICTIONS_EXCLUDED_SLUGS.includes(listing.neighborhood?.slug);

  return (
          <Link
          href={`/listings/${listing.id}`}
      className="card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
                  display: 'block',
                  overflow: 'hidden',
                  borderColor: isHovering ? 'var(--color-gold)' : undefined,
                  boxShadow: isHovering ? '0 0 0 2px var(--color-gold)' : undefined,
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '66%', background: '#e6e1d6' }}>
{photo && (
              <Image src={photo} alt={listing.address} fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
        )}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          border: 'none',
                          background: 'rgba(255,255,255,0.9)',
                          cursor: signedIn ? 'pointer' : 'not-allowed',
                          fontSize: 16,
          }}
        >
{favorited ? '♥' : '♡'}
</button>
    </div>

      <div style={{ padding: 14 }}>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{formatPrice(listing.price)}</p>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 8 }}>{listing.address}</p>

{isLand ? (
              <p style={{ fontSize: 12, color: 'var(--color-muted-dark)' }}>
{listing.acreage ? `${listing.acreage} acres` : ''} {listing.zoning ? `· ${listing.zoning}` : ''}
</p>
        ) : (
                      <p style={{ fontSize: 12, color: 'var(--color-muted-dark)' }}>
            {listing.beds ?? '—'} bd · {listing.baths ?? '—'} ba · {listing.sqft ? `${listing.sqft.toLocaleString()} sqft` : '—'}
{showRentalRestrictions ? ` · Rental Restrictions: ${listing.rentalRestrictions}` : ''}
</p>
        )}
{listing.waterfront && listing.waterfront !== 'None' && (
              <p style={{ fontSize: 11, color: 'var(--color-success)', marginTop: 6, fontWeight: 600 }}>{listing.waterfront}</p>
        )}
</div>
    </Link>
  );
}
