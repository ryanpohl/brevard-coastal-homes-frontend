'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';
import { isWatchedHome } from '@/lib/alertMemory';
import { SAVED_EVENT, requestSaveHome } from './SaveHomeHost';

/**
 * Standalone favorite heart toggle for the Property Detail page (ListingCard
 * has its own inline copy of this same logic for the grid view).
 */
// address/status (2026-10-13): signed-out visitors save with just an email
// (SaveHomeHost.js) instead of being sent to Sign In / Register.
export default function FavoriteButton({ listingId, initialFavorited, size = 40, address, status }) {
  const { signedIn, token } = useAuth();
  const [favorited, setFavorited] = useState(!!initialFavorited);
  const [busy, setBusy] = useState(false);
  const [savedByEmail, setSavedByEmail] = useState(false);

  useEffect(() => {
    if (signedIn) return undefined;
    setSavedByEmail(isWatchedHome(listingId));
    const onSaved = (e) => {
      if (e.detail === listingId) setSavedByEmail(true);
    };
    window.addEventListener(SAVED_EVENT, onSaved);
    return () => window.removeEventListener(SAVED_EVENT, onSaved);
  }, [signedIn, listingId]);

  // Signed-out click (2026-08-29, per Ryan) — see the matching comment in
  // ListingCard.js's toggleFavorite() for the full writeup. Pops open the
  // Sign In/Register modal instead of the previous no-op (this button
  // already hinted at that via its `title` below, but clicking did
  // nothing at all).
  async function toggle() {
    if (busy) return;
    if (!signedIn) {
      requestSaveHome({ id: listingId, address, status });
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
      aria-label={favorited || savedByEmail ? 'Saved' : 'Save this home'}
      title={signedIn ? undefined : 'Save this home'}
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
      {favorited || (!signedIn && savedByEmail) ? '♥' : '♡'}
    </button>
  );
}
