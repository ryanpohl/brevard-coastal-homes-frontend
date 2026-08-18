'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';

/**
 * Fire-and-forget: records that the signed-in user viewed this listing
 * (mirrors FavoriteButton.js's addFavorite call), so it shows up under
 * that lead's "Viewed" tab in the CRM (added 2026-08-18, per Ryan - same
 * request as favorites: "I just want to see what properties people are
 * favoriting and viewing on the website from in the CRM"). Renders
 * nothing; fires once per listing detail page load. Anonymous visitors
 * are skipped (no lead identity to attach a view to, same limitation as
 * favoriting - see FavoriteButton.js).
 */
export default function ViewTracker({ listingId }) {
  const { signedIn, token } = useAuth();

  useEffect(() => {
    if (!signedIn) return;
    api.recordView(token, listingId).catch(() => {
      // Never let a tracking hiccup affect the visitor's experience.
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId, signedIn]);

  return null;
}
