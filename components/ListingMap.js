'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { formatPrice } from '@/lib/constants';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Brevard County's rough center — used only if a city/neighborhood somehow
// has no coordinate at all (shouldn't happen for the 10 seeded cities, but
// keeps the map from crashing rather than showing a blank gray box).
const FALLBACK_CENTER = { lat: 28.24, lng: -80.68 };
const FALLBACK_ZOOM = 10;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/**
 * Google Map for the city/neighborhood listing pages (and, later, Property
 * Detail's single-pin map): centers on `center` ({lat, lng}) and drops a pin
 * for every listing in `listings` that has latitude/longitude — which, until
 * the Spark MLS sync is live, is none of them (mock/manual listings have no
 * coordinate), so it just renders the empty centered map. Each pin opens an
 * info window linking to that listing's detail page.
 *
 * Requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (see frontend/.env.example) —
 * without one, renders a "map coming soon" placeholder instead of a broken
 * map, so pages still work fine before that key is set up.
 */
export default function ListingMap({ center, listings = [], zoom = 12, height = '100%' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [scriptLoaded, setScriptLoaded] = useState(
    () => typeof window !== 'undefined' && !!(window.google && window.google.maps)
  );

  const effectiveCenter = center && center.lat != null && center.lng != null ? center : FALLBACK_CENTER;
  const effectiveZoom = center && center.lat != null && center.lng != null ? zoom : FALLBACK_ZOOM;

  useEffect(() => {
    if (!scriptLoaded || !mapRef.current || !window.google || !window.google.maps) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: effectiveCenter,
        zoom: effectiveZoom,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      });
    }
    const map = mapInstanceRef.current;

    // Clear any markers from a previous render (e.g. filters changed the result set).
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const points = listings.filter((l) => l.latitude != null && l.longitude != null);

    if (points.length === 0) {
      map.setCenter(effectiveCenter);
      map.setZoom(effectiveZoom);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    points.forEach((listing) => {
      const position = { lat: listing.latitude, lng: listing.longitude };
      const marker = new window.google.maps.Marker({ position, map, title: listing.address });
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-family: 'Jost', sans-serif; font-size: 13px; max-width: 190px;">
          <a href="/listings/${listing.id}" style="font-weight: 600; color: #1c2b30; text-decoration: none;">
            ${escapeHtml(formatPrice(listing.price))}
          </a>
          <div style="color: #667377; margin-top: 2px;">${escapeHtml(listing.address)}</div>
        </div>`,
      });
      marker.addListener('click', () => infoWindow.open({ anchor: marker, map }));
      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (points.length > 1) {
      map.fitBounds(bounds);
    } else {
      map.setCenter(bounds.getCenter());
      map.setZoom(15);
    }
  }, [scriptLoaded, effectiveCenter.lat, effectiveCenter.lng, effectiveZoom, listings]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div
        className="card"
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-muted)',
          background: 'var(--color-bg)',
          textAlign: 'center',
          padding: 20,
        }}
      >
        Map coming soon
      </div>
    );
  }

  return (
    <>
      <Script
        id="google-maps-js"
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&loading=async`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div
        ref={mapRef}
        style={{ width: '100%', height, minHeight: 320, borderRadius: 8, overflow: 'hidden', background: 'var(--color-border-light)' }}
      />
    </>
  );
}
