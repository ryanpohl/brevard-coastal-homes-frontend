'use client';

import { useEffect, useRef, useState } from 'react';
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
export default function ListingMap({ center, listings = [], zoom = 12, height = '100%', hoveredListingId = null }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    // Each entry is { marker, listingId } — the listingId lets the
  // hover-highlight effect below find and re-style the right marker
  // without rebuilding the whole marker set on every hover (see
  // ListingResultsLayout, which lifts hover state up from ListingCard).
  const markersRef = useRef([]);
    const [scriptLoaded, setScriptLoaded] = useState(
          () => typeof window !== 'undefined' && !!window.google?.maps?.importLibrary
        );

  const effectiveCenter = center && center.lat != null && center.lng != null ? center : FALLBACK_CENTER;
    const effectiveZoom = center && center.lat != null && center.lng != null ? zoom : FALLBACK_ZOOM;

  // Inject the bootstrap loader ourselves instead of relying on next/script's
  // `onLoad` — that callback does not reliably fire for inline
  // (dangerouslySetInnerHTML) scripts, which left `scriptLoaded` stuck at
  // false forever and the map silently never initializing (confirmed via
  // manual QA: importLibrary('maps') worked fine when called directly from
  // the console, but the component's own effect never ran). The IIFE
  // defines `google.maps.importLibrary` synchronously the moment it
  // executes — appending the script tag runs it immediately, so we can flip
  // scriptLoaded right after appending rather than waiting on a load event.
  useEffect(() => {
        if (typeof window === 'undefined' || !GOOGLE_MAPS_API_KEY) return;
        if (window.google?.maps?.importLibrary) {
                setScriptLoaded(true);
                return;
        }
        if (!window.__gmapsBootstrapInjected) {
                window.__gmapsBootstrapInjected = true;
                const script = document.createElement('script');
                script.id = 'google-maps-js';
                script.innerHTML = mapsBootstrapLoaderSrc(GOOGLE_MAPS_API_KEY);
                document.head.appendChild(script);
        }
        setScriptLoaded(true);
  }, []);

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
          markersRef.current.forEach(({ marker }) => marker.setMap(null));
                        markersRef.current = [];

          const points = listings.filter((l) => l.latitude != null && l.longitude != null);

          if (points.length === 0) {
                    map.setCenter(effectiveCenter);
                    map.setZoom(effectiveZoom);
                    return;
          }

          const bounds = new window.google.maps.LatLngBounds();
                        // A single InfoWindow instance shared across every marker (per Ryan,
                        // 2026-08-11 — multiple pin popups were staying open on screen at
                        // once, since each marker previously got its own InfoWindow and
                        // nothing ever closed the others). Reusing one instance and just
                        // moving/re-opening it on each click means opening a new one
                        // automatically closes whichever was previously open.
                        const sharedInfoWindow = new window.google.maps.InfoWindow();
                        points.forEach((listing) => {
                                  const position = { lat: listing.latitude, lng: listing.longitude };
                                  const marker = new window.google.maps.Marker({ position, map, title: listing.address });
                                  const content = `<div style="font-family: 'Jost', sans-serif; font-size: 13px; max-width: 190px;">
                                                          <a href="/listings/${listing.id}" style="font-weight: 600; color: #1c2b30; text-decoration: none;">
                                                                        ${escapeHtml(formatPrice(listing.price))}
                                                                                    </a>
                                                                                                <div style="color: #667377; margin-top: 2px;">${escapeHtml(listing.address)}</div>
                                                                                                          </div>`;
                                  marker.addListener('click', () => {
                                            sharedInfoWindow.setContent(content);
                                            sharedInfoWindow.open({ anchor: marker, map });
                                  });
                                  markersRef.current.push({ marker, listingId: listing.id });
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

  // Hover highlight: re-styles just the matching marker (bigger gold dot,
  // brought to front) instead of rebuilding the marker set above — keeps
  // this cheap enough to run on every mouseenter/mouseleave as the visitor
  // moves through the card grid, and avoids re-triggering fitBounds/pan.
  useEffect(() => {
        if (!window.google?.maps) return;
        markersRef.current.forEach(({ marker, listingId }) => {
                if (listingId === hoveredListingId) {
                          marker.setIcon({
                                      path: window.google.maps.SymbolPath.CIRCLE,
                                      scale: 12,
                                      fillColor: '#c9a15a', // var(--color-gold) — SVG symbol icons can't reference CSS custom properties
                                      fillOpacity: 1,
                                      strokeColor: '#ffffff',
                                      strokeWeight: 2,
                          });
                          marker.setZIndex(999);
                } else {
                          marker.setIcon(null);
                          marker.setZIndex(null);
                }
        });
  }, [hoveredListingId]);

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
        <div
      ref={mapRef}
      style={{ width: '100%', height, minHeight: 320, borderRadius: 8, overflow: 'hidden', background: 'var(--color-border-light)' }}
    />
  );
}
