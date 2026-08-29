'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';

/**
 * Standalone favorite heart toggle for the Property Detail page (ListingCard
 * has its own inline copy of this same logic for the grid view).
 */
export default function FavoriteButton({ listingId, initialFavorited, size = 40 }) {
  const { signedIn, token, promptSignIn } = useAuth();
  const [favorited, setFavorited] = useState(!!initialFavorited);
  const [busy, setBusy] = useState(false);

  // Signed-out click (2026-08-29, per Ryan) — see the matching comment in
  // ListingCard.js's toggleFavorite() for the full writeup. Pops open the
  // Sign In/Register modal instead of the previous no-op (this button
  // already hinted at that via its `title` below, but clicking did
  // nothing at all).
  async function toggle() {
    if (busy) return;
    if (!signedIn) {
      promptSignIn('Sign in to save this property to your favorites.');
      return;
    }
    setBusy(true);
    try {
      if (favorited) {
        await api.removeFavorite(token, listingId);
      } else {
        await api.addFavorite(token, listingId);
      }
      setFavorited(!favorited);
    } catch {
      // leave state unchanged on failure
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={signedIn ? undefined : 'Sign in to save favorites'}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: 'none',
        background: 'rgba(255,255,255,0.92)',
        cursor: 'pointer',
        fontSize: Math.round(size * 0.45),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {favorited ? '♥' : '♡'}
    </button>
  );
}
