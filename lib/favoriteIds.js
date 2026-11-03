'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getFavorites } from '@/lib/api';

// The signed-in visitor's favorite homes, loaded once per visit
// (2026-11-03, per Ryan). Listing pages are rendered without the visitor's
// account, so on their own they can't tell which homes are favorites:
// hearts showed empty there, and the price-drop bell showed next to homes
// whose alerts the heart already controls. Hearts read this to show filled,
// and the bell (CardAlertButton.js) hides on favorites.
const CHANGED_EVENT = 'bch-favorites-changed';

let cache = { token: null, ids: null, promise: null };

function load(token) {
  if (cache.token === token && (cache.ids || cache.promise)) return cache.promise || Promise.resolve(cache.ids);
  cache = { token, ids: null, promise: null };
  cache.promise = getFavorites(token)
    .then((data) => {
      if (cache.token !== token) return null;
      cache.ids = new Set((data.favorites || []).map((l) => l.id));
      cache.promise = null;
      return cache.ids;
    })
    .catch(() => {
      if (cache.token === token) cache = { token: null, ids: null, promise: null };
      return null;
    });
  return cache.promise;
}

/** Set of favorite listing ids for the signed-in visitor; null while loading or signed out. */
export function useFavoriteIds() {
  const { signedIn, token } = useAuth();
  const [ids, setIds] = useState(signedIn && cache.token === token ? cache.ids : null);

  useEffect(() => {
    if (!signedIn || !token) {
      setIds(null);
      return undefined;
    }
    let live = true;
    load(token).then((loaded) => {
      if (live) setIds(loaded ? new Set(loaded) : null);
    });
    const onChange = () => {
      if (cache.token === token && cache.ids) setIds(new Set(cache.ids));
    };
    window.addEventListener(CHANGED_EVENT, onChange);
    return () => {
      live = false;
      window.removeEventListener(CHANGED_EVENT, onChange);
    };
  }, [signedIn, token]);

  return ids;
}

/** After a heart is toggled, so every heart and bell for that home updates. */
export function markFavorite(listingId, on) {
  if (!cache.ids) return;
  if (on) cache.ids.add(listingId);
  else cache.ids.delete(listingId);
  window.dispatchEvent(new CustomEvent(CHANGED_EVENT));
}
