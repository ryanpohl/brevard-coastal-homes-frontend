'use client';

import { useEffect, useRef, useState } from 'react';
import { formatPrice, formatAssocFee } from '@/lib/constants';

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
  // Each entry is { marker, listingId, listing } — the listingId/listing
  // let the hover-highlight effect below find the right marker and build
  // its popup content without rebuilding the whole marker set on every
  // hover (see ListingResultsLayout, which lifts hover state up from
  // ListingCard).
  const markersRef = useRef([]);
  // One InfoWindow instance shared across every marker AND the
  // sidebar-hover path below, stored in a ref (not a local variable inside
  // the init effect) so both the marker mouseover/mouseout handlers and the
  // hoveredListingId effect can open/close the same popup instead of each
  // spawning their own.
  const infoWindowRef = useRef(null);
  // Popups now open on hover (per Ryan, 2026-08-13) instead of click, which
  // means a marker's mouseout can fire the instant the cursor crosses from
  // the pin into the popup itself (they're separate DOM elements), closing
  // it before a visitor can click through to the listing. Debounce the
  // close with a short timeout that mouseover/domready below can cancel —
  // gives the cursor room to travel from pin to popup without an instant-close.
  const closeTimeoutRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(
    () => typeof window !== 'undefined' && !!window.google?.maps?.importLibrary
  );

  function cancelPopupClose() {
    clearTimeout(closeTimeoutRef.current);
  }

  function schedulePopupClose() {
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      infoWindowRef.current?.close();
    }, 200);
  }

  // Shared by marker-hover (mouse directly over a pin) and the sidebar
  // ListingCard-hover path (hoveredListingId prop) so both show the exact
  // same popup. Originally just a photo/price/address summary (2026-08-11);
  // rebuilt 2026-08-15 (per Ryan, with a screenshot of the map popup next to
  // a full ListingCard and the ask "have the pop up window listing in the
  // maps show exactly what the listing does on the right") to mirror
  // ListingCard.js's full content — Days on Market badge, price + red price-
  // reduction indicator, HOA fee (condos), address, beds/baths/sqft (or
  // acreage/zoning for land) with Rental Restrictions, and the waterfront
  // badge. The field-level logic below (RENTAL_RESTRICTIONS_EXCLUDED_SLUGS,
  // the showAssocFee/priceReduction/waterfront-!=='None' guards) is
  // deliberately kept in exact sync with ListingCard.js's own copies — this
  // is plain HTML built for a Google Maps InfoWindow (not a React
  // component), so it can't just import/reuse ListingCard directly.
  // Deliberately omits the card's favorite-heart button: that's a stateful,
  // auth-gated control (click handler calling the favorites API with the
  // signed-in user's token) that isn't practical to wire up inside a raw
  // InfoWindow string — the whole popup is already a click-through link to
  // the listing, same as before. Colors are hardcoded hex (matching
  // globals.css's design tokens) rather than var(--color-*), same
  // convention the original version of this function already used.
  function buildPopupContent(listing) {
    const thumbnailPhoto = listing.photos && listing.photos.length ? listing.photos[0] : null;
    const isLand = listing.propertyType === 'Land';
    const isCondo = listing.propertyType === 'Condo';

    const RENTAL_RESTRICTIONS_EXCLUDED_SLUGS = ['adelaide', 'aripeka', 'summer-lakes'];
    const showRentalRestrictions =
      listing.rentalRestrictions && !RENTAL_RESTRICTIONS_EXCLUDED_SLUGS.includes(listing.neighborhood?.slug);
    const showAssocFee = isCondo && listing.assocFee != null;
    const priceReduction =
      listing.originalListPrice != null && listing.originalListPrice > listing.price
        ? listing.originalListPrice - listing.price
        : null;
    const showWaterfront = listing.waterfront && listing.waterfront !== 'None';

    const daysOnMarketBadge =
      listing.daysOnMarket != null
        ? `<div style="position: absolute; top: 8px; left: 8px; padding: 5px 10px; border-radius: 999px; background: rgba(255,255,255,0.92); color: #1c2b30; font-size: 11px; font-weight: 700; box-shadow: 0 1px 4px rgba(0,0,0,0.25);">${listing.daysOnMarket} Days on Market</div>`
        : '';

    // Arrow enlarged (2026-08-15, per Ryan: "the red arrow ... hard to
    // see") — kept in sync with ListingCard.js's own copy of this fix: the
    // &darr; glyph gets its own bigger inline font-size than the reduction
    // amount text next to it.
    const priceReductionSpan =
      priceReduction != null
        ? `<span style="font-size: 12px; font-weight: 700; color: #c0392b; margin-left: 6px;"><span style="font-size: 17px; vertical-align: -2px;">&darr;</span> ${escapeHtml(formatPrice(priceReduction))}</span>`
        : '';

    const assocFeeLine = showAssocFee
      ? `<div style="font-size: 12px; font-weight: 600; color: #1c2b30; margin-top: 2px;">HOA ${escapeHtml(formatAssocFee(listing.assocFee, listing.assocFeeFrequency))}</div>`
      : '';

    const statsLine = isLand
      ? `${listing.acreage ? `${listing.acreage} acres` : ''}${listing.zoning ? ` &middot; ${escapeHtml(listing.zoning)}` : ''}`
      : `${listing.beds ?? '&mdash;'} bd &middot; ${listing.baths ?? '&mdash;'} ba &middot; ${listing.sqft ? `${listing.sqft.toLocaleString()} sqft` : '&mdash;'}${showRentalRestrictions ? ` &middot; Rental Restrictions: ${escapeHtml(listing.rentalRestrictions)}` : ''}`;

    const waterfrontLine = showWaterfront
      ? `<div style="font-size: 10px; color: #2f7a4f; margin-top: 4px; font-weight: 600;">${escapeHtml(listing.waterfront)}</div>`
      : '';

    return `<div style="font-family: 'Jost', sans-serif; font-size: 13px; width: 220px;">
        <a href="/listings/${listing.id}" style="display: block; color: #1c2b30; text-decoration: none;">
          <div style="position: relative; width: 100%; height: 130px; border-radius: 4px; overflow: hidden; margin-bottom: 8px; background: #e6e1d6;">
            ${thumbnailPhoto ? `<img src="${escapeHtml(thumbnailPhoto)}" alt="${escapeHtml(listing.address)}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />` : ''}
            ${daysOnMarketBadge}
          </div>
          <div style="font-weight: 700; font-size: 15px;">${escapeHtml(formatPrice(listing.price))}${priceReductionSpan}</div>
          ${assocFeeLine}
          <div style="color: #667377; margin-top: 2px; font-size: 12px;">${escapeHtml(listing.address)}</div>
          <div style="color: #445055; margin-top: 4px; font-size: 11px;">${statsLine}</div>
          ${waterfrontLine}
        </a>
      </div>`;
  }

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
          // Map/Satellite toggle (per Ryan, 2026-08-11) — the built-in
          // Google Maps type control, restricted to just Map + Satellite
          // (dropping Hybrid/Terrain, which Google shows by default) since
          // those two are all that were asked for. This is the ONE shared
          // map component behind every map on the site (city pages,
          // neighborhood pages, and the Property Detail page all render
          // this component — see ListingResultsLayout.js and
          // app/listings/[id]/page.js), so enabling it here turns it on
          // everywhere at once. Property pins need no extra handling to
          // show up on Satellite too — markers are a separate overlay
          // layer from the base map tiles, so they render on top of
          // whichever tile layer (Map or Satellite) is currently active.
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: window.google.maps.ControlPosition.TOP_LEFT,
            mapTypeIds: ['roadmap', 'satellite'],
          },
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
      // moving/re-opening it means opening a new one automatically closes
      // whichever was previously open. Stored in a ref (see above) rather
      // than a local var so the hoveredListingId effect further down can
      // reuse the exact same instance.
      if (!infoWindowRef.current) {
        infoWindowRef.current = new window.google.maps.InfoWindow();
      }
      const sharedInfoWindow = infoWindowRef.current;
      points.forEach((listing) => {
        const position = { lat: listing.latitude, lng: listing.longitude };
        const marker = new window.google.maps.Marker({ position, map, title: listing.address });
        // Popup now opens on hover instead of requiring a click (per Ryan,
        // 2026-08-13) — mouseover opens/refreshes it at this marker,
        // mouseout schedules a debounced close (see schedulePopupClose)
        // rather than closing instantly, so a visitor can move the cursor
        // from the pin onto the popup itself and click through to the
        // listing without it vanishing first.
        marker.addListener('mouseover', () => {
          cancelPopupClose();
          sharedInfoWindow.setContent(buildPopupContent(listing));
          sharedInfoWindow.open({ anchor: marker, map });
        });
        marker.addListener('mouseout', () => {
          schedulePopupClose();
        });
        markersRef.current.push({ marker, listingId: listing.id, listing });
        bounds.extend(position);
      });

      // Lets the cursor travel from the pin onto the popup's own DOM
      // (a separate overlay from the marker) without the debounced close
      // above firing partway through — domready fires each time the
      // popup's content is (re)rendered, so re-attach on every open.
      sharedInfoWindow.addListener('domready', () => {
        const container = document.querySelector('.gm-style-iw');
        if (!container) return;
        container.addEventListener('mouseenter', cancelPopupClose);
        container.addEventListener('mouseleave', schedulePopupClose);
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

  // Hover highlight: hovering a ListingCard in the results list (which lifts
  // its hover state up into `hoveredListingId` — see ListingResultsLayout)
  // now opens the exact same image/price/address popup as hovering the pin
  // directly, instead of the old plain gold-dot marker recolor (per Ryan,
  // 2026-08-13 — "when a property is hovered under the listings, show the
  // popup with the image instead of a gold circle"). Still brings the
  // matching marker to the front via zIndex so it isn't hidden under a
  // neighboring pin while its popup is open. Re-styling just the matching
  // marker (rather than rebuilding the whole marker set) keeps this cheap
  // enough to run on every mouseenter/mouseleave as the visitor moves
  // through the card grid, and avoids re-triggering fitBounds/pan.
  useEffect(() => {
    if (!window.google?.maps || !infoWindowRef.current) return;
    const map = mapInstanceRef.current;

    markersRef.current.forEach(({ marker, listingId }) => {
      marker.setZIndex(listingId === hoveredListingId ? 999 : null);
    });

    if (hoveredListingId == null) {
      schedulePopupClose();
      return;
    }
    const match = markersRef.current.find(({ listingId }) => listingId === hoveredListingId);
    if (match) {
      cancelPopupClose();
      infoWindowRef.current.setContent(buildPopupContent(match.listing));
      infoWindowRef.current.open({ anchor: match.marker, map });
    }
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
