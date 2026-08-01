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

// Google's official "dynamic library import" bootstrap loader — see
// https://developers.google.com/maps/documentation/javascript/load-maps-js-api.
// This tiny inline snippet synchronously defines `google.maps.importLibrary`
// (no network request yet); the actual Maps JS payload is fetched lazily the
// first time importLibrary() is called, in the effect below. A plain
// `<script src=".../maps/api/js?...&loading=async">` tag does NOT define
// importLibrary on its own in current API versions — using one caused a
// "google.maps.Map is not a constructor" crash. This bootstrap snippet is
// the only supported way to get importLibrary, so don't swap it back out.
function mapsBootstrapLoaderSrc(key) {
  return `(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({key:"${key}",v:"weekly"});`;
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
    () => typeof window !== 'undefined' && !!window.google?.maps?.importLibrary
  );

  const effectiveCenter = center && center.lat != null && center.lng != null ? center : FALLBACK_CENTER;
  const effectiveZoom = center && center.lat != null && center.lng != null ? zoom : FALLBACK_ZOOM;

  useEffect(() => {
    if (!scriptLoaded || !mapRef.current || !window.google?.maps?.importLibrary) return;
    let cancelled = false;

    // Map/Marker/InfoWindow aren't defined until their libraries are
    // explicitly imported through the bootstrap loader above — once
    // imported, the classes are available directly off `google.maps` as
    // used below (importLibrary populates the shared namespace).
    async function init() {
      await Promise.all([
        window.google.maps.importLibrary('maps'),
        window.google.maps.importLibrary('marker'),
      ]);
      if (cancelled || !mapRef.current) return;

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
    }

    init();
    return () => {
      cancelled = true;
    };
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
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        dangerouslySetInnerHTML={{ __html: mapsBootstrapLoaderSrc(GOOGLE_MAPS_API_KEY) }}
      />
      <div
        ref={mapRef}
        style={{ width: '100%', height, minHeight: 320, borderRadius: 8, overflow: 'hidden', background: 'var(--color-border-light)' }}
      />
    </>
  );
}
