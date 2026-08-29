'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { formatPrice, formatAssocFee } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';

export default function ListingCard({ listing, onHoverChange }) {
  const { signedIn, token, promptSignIn } = useAuth();
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

  // Signed-out click (2026-08-29, per Ryan: clicking the heart while
  // signed out did nothing — not even the FavoriteButton.js's tooltip,
  // since this card's own copy of the heart never had one). Now pops open
  // the site's Sign In/Register modal with a line explaining why, instead
  // of silently no-op'ing. See lib/auth-context.js's promptSignIn() /
  // AuthPromptModal.js for how that popup itself works. FavoriteButton.js
  // (Property Detail page's standalone heart) gets the matching fix.
  async function toggleFavorite(e) {
    e.preventDefault();
    if (busy) return;
    if (!signedIn) {
      promptSignIn('Sign in to save this property to your favorites.');
      return;
    }
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

  // HOA/condo association fee on listing cards (2026-08-14, per Ryan: "the
  // association fee is very important for the users to see when searching
  // for condos"). Condo-only, same spirit as the Property Detail page's
  // Assoc Fee stats (app/listings/[id]/page.js) — shown directly under the
  // price since Ryan called this out as important, not buried in the
  // smaller bd/ba/sqft line the way Rental Restrictions is.
  const isCondo = listing.propertyType === 'Condo';
  const showAssocFee = isCondo && listing.assocFee != null;

  // Price-reduction indicator (2026-08-15, per Ryan, referencing two Zillow
  // listing cards showing a "↓ $40k"-style price-drop marker next to the
  // price, plus a Space Coast MLS History screenshot confirming the source
  // field: "Original List Price" vs. the listing's current Price). Only
  // shown when the MLS's real OriginalListPrice is on file AND is actually
  // higher than the current price — a listing with no original price synced
  // yet (older sync, or one that's never had a price change) simply shows
  // no indicator, same "omit rather than show a placeholder" pattern as the
  // Days on Market badge above. Ryan asked specifically for the reduction
  // amount to render in red (`--color-error`) — not Zillow's own
  // green/down-is-good convention.
  const priceReduction =
    listing.originalListPrice != null && listing.originalListPrice > listing.price
      ? listing.originalListPrice - listing.price
      : null;

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
        {/* CDOM badge (2026-08-15, per Ryan, referencing a Zillow listing
            card's "742 days on Zillow" badge and his own MLS system's
            DOM/CDOM field — explicitly "Do not show Zillow"; clarified same
            day: "Just show the number for CDOM ... So if the CDOM shows 38
            then it should say '38 Days on Market'" — exact wording/casing
            below matches that, no singular/plural swap for "1").
            listing.daysOnMarket is computed backend-side from the MLS
            feed's OriginalOnMarketTimestamp, i.e. real CDOM semantics, not
            plain DOM (see backend/src/utils/daysOnMarket.js and
            schema.sql's comment on listings.on_market_date) — null for
            listings with no on-market date on file (manually-entered
            listings, or ones synced before this field existed), in which
            case the badge is simply omitted rather than showing a
            placeholder. Explicit `!= null` (not truthy) so a real "0 Days
            on Market" listing (synced today) still shows the badge. */}
        {listing.daysOnMarket != null && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              padding: '6px 12px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.92)',
              color: 'var(--color-ink)',
              fontSize: 12,
              fontWeight: 700,
              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
            }}
          >
            {listing.daysOnMarket} Days on Market
          </div>
        )}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          title={signedIn ? undefined : 'Sign in to save favorites'}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255,255,255,0.9)',
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          {favorited ? '♥' : '♡'}
        </button>
      </div>

      <div style={{ padding: 14 }}>
        <p style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          {formatPrice(listing.price)}
          {priceReduction != null && (
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-error)' }}>
              {/* Arrow enlarged (2026-08-15, per Ryan: "the red arrow ...
                  hard to see") — its own span at a bigger font-size than
                  the reduction amount next to it, so the glyph reads
                  clearly at a glance without the whole indicator's text
                  growing out of proportion with the price line it sits
                  next to. */}
              <span style={{ fontSize: 18, verticalAlign: -2 }}>↓</span> {formatPrice(priceReduction)}
            </span>
          )}
        </p>
        {showAssocFee && (
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 4 }}>
            HOA {formatAssocFee(listing.assocFee, listing.assocFeeFrequency)}
          </p>
        )}
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 8 }}>{listing.address}</p>

        {isLand ? (
          <p style={{ fontSize: 12, color: 'var(--color-muted-dark)' }}>
            {listing.acreage ? `${listing.acreage} acres` : ''} {listing.zoning ? `· ${listing.zoning}` : ''}
          </p>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--color-muted-dark)' }}>
            {listing.beds ?? '—'} bd · {listing.baths ?? '—'} ba · {listing.sqft ? `${listing.sqft.toLocaleString()} sqft` : '—'}
            {/* "Year Built" (2026-08-26, per Ryan, referencing a Space Coast
                MLS listing screenshot showing "Year Built: 1995") — Homes
                and Condos only (Land has no structure), same bd/ba/sqft
                line as Rental Restrictions. Omitted when the MLS hasn't
                populated it (older sync, or a manually-entered listing),
                same "omit rather than show a placeholder" pattern used
                elsewhere on this card. */}
            {listing.yearBuilt != null ? ` · Year Built: ${listing.yearBuilt}` : ''}
            {showRentalRestrictions ? ` · Rental Restrictions: ${listing.rentalRestrictions}` : ''}
          </p>
        )}
        {/* mapWaterfront() (backend) falls back to the literal string 'None'
            when a listing has no real ocean/river signal, rather than null —
            so this must explicitly exclude 'None', same guard already used
            on the Property Detail page (app/listings/[id]/page.js), or every
            non-waterfront card would show a "None" badge as if it were a
            real feature (found 2026-08-11, per Ryan). */}
        {listing.waterfront && listing.waterfront !== 'None' && (
          <p style={{ fontSize: 11, color: 'var(--color-success)', marginTop: 6, fontWeight: 600 }}>{listing.waterfront}</p>
        )}
      </div>
    </Link>
  );
}
