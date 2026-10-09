// "What's Near {Building}" on the condo building pages (2026-10-09, per
// Ryan): established restaurants and landmarks with the distance from each
// building, plus typical drives to the cruise port, airports, Kennedy Space
// Center and the Orlando theme parks. Restaurants were picked with Ryan (all
// open as of 2026-10-09; re-check yearly). Coordinates are from the U.S.
// Census geocoder (by street address); Ron Jon and Sandbar, which it didn't
// match, are interpolated from 4000/4300 N Atlantic and 4100 Ocean Beach Blvd. Nearby distances are straight-line
// ("about"); the far-away miles and times are typical drives from the city
// (no traffic; Orlando trips use the SR 528 toll road). The hospital is left
// off until Health First's new Cape Canaveral Hospital opens on Merritt
// Island (early 2027).
export const CITY_NEARBY = {
  'cocoa-beach': {
    restaurants: [
      { name: 'Coconuts on the Beach', address: '2 Minutemen Causeway', lat: 28.318379, lng: -80.608163 },
      { name: 'Dirty Birds Tiki Bar & Grill', address: '142 Minutemen Causeway', lat: 28.318395, lng: -80.609431 },
      { name: 'The Fat Snook', address: '2464 S Atlantic Ave', lat: 28.281904, lng: -80.607542 },
      { name: "Florida's Seafood Bar & Grill", address: '480 W Cocoa Beach Causeway', lat: 28.357763, lng: -80.614078 },
      { name: 'Sunset Cafe Waterfront Bar & Grill', address: '500 W Cocoa Beach Causeway', lat: 28.357761, lng: -80.614211 },
      { name: 'Sandbar Sports Grill', address: '4301 Ocean Beach Blvd', lat: 28.35669, lng: -80.6059 },
      { name: 'Squid Lips', address: '2200 S Orlando Ave', lat: 28.285865, lng: -80.608696 },
      { name: 'Pier 62 & Rikki Tiki Tavern', address: 'Cocoa Beach Pier, 401 Meade Ave', lat: 28.367835, lng: -80.603453 },
      {
        name: 'Port Canaveral restaurants',
        detail: "Rusty's, Fishlips, Grills, Seafood Atlantic, Gator's Portside, Rising Tide",
        address: 'Glen Cheek Dr, Cape Canaveral',
        lat: 28.4084,
        lng: -80.616824,
      },
    ],
    landmarks: [
      { name: 'Cocoa Beach Pier', address: '401 Meade Ave', lat: 28.367835, lng: -80.603453 },
      { name: 'Ron Jon Surf Shop', address: '4151 N Atlantic Ave', lat: 28.3568, lng: -80.6079 },
      {
        name: 'Publix',
        nearestOf: [
          { address: '2067 N Atlantic Ave (Banana River Square)', lat: 28.343271, lng: -80.60997 },
          { address: '5645 N Atlantic Ave (Cornerstone Plaza)', lat: 28.369619, lng: -80.605678 },
        ],
      },
    ],
    far: [
      { name: 'Port Canaveral cruise terminals', miles: '6', drive: '10–15 min' },
      { name: 'Kennedy Space Center Visitor Complex', miles: '20', drive: '30 min' },
      { name: 'Melbourne Orlando Int’l Airport (MLB)', miles: '25', drive: '35–40 min' },
      { name: 'Orlando International Airport (MCO)', miles: '50', drive: '55 min' },
      { name: 'Universal Orlando', miles: '60', drive: '1 hr 10 min' },
      { name: 'Walt Disney World', miles: '65–70', drive: '1 hr 15 min' },
    ],
  },
};

function milesBetween(a, b) {
  const R = 3958.8;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatMiles(mi) {
  if (mi < 0.1) return 'Next door';
  return `${mi < 10 ? mi.toFixed(1) : Math.round(mi)} mi`;
}

// Rows sorted closest first; places without coordinates are skipped.
function rows(places, center) {
  return places
    .map((p) => {
      if (p.nearestOf) {
        const best = p.nearestOf
          .filter((o) => o.lat != null)
          .map((o) => ({ ...o, mi: milesBetween(center, o) }))
          .sort((x, y) => x.mi - y.mi)[0];
        return best ? { name: p.name, address: best.address, mi: best.mi } : null;
      }
      if (p.lat == null || p.lng == null) return null;
      return { name: p.name, detail: p.detail, address: p.address, mi: milesBetween(center, p) };
    })
    .filter(Boolean)
    .sort((a, b) => a.mi - b.mi);
}

export function nearbyFor(citySlug, center) {
  const city = CITY_NEARBY[citySlug];
  if (!city || !center) return null;
  return { restaurants: rows(city.restaurants, center), landmarks: rows(city.landmarks, center), far: city.far };
}
