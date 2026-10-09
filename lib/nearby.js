// "What's Near {Building}" on the condo building pages (2026-10-09, per
// Ryan): established restaurants and landmarks with the distance from each
// building, plus typical drives to the cruise port, airports, Kennedy Space
// Center and the Orlando theme parks. Restaurants were picked with Ryan (all
// open as of 2026-10-09; re-check yearly). Coordinates are from the U.S.
// Census geocoder (by street address); Ron Jon and Sandbar, which it didn't
// match, are interpolated from 4000/4300 N Atlantic and 4100 Ocean Beach Blvd. Nearby distances are straight-line
// ("about"); the far-away miles and times are typical drives from the city
// (no traffic; Orlando trips use the SR 528 toll road). Cocoa Beach leaves
// the hospital off until Health First's new Cape Canaveral Hospital opens on
// Merritt Island (early 2027).
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
  // Indialantic (2026-10-09): restaurants and Djon's per Ryan; Rooftop Bar
  // is at Djon's Village Market. The Boardwalk and Paradise Beach Park (which
  // the geocoder didn't match) are placed from 111 5th Ave and 255 Paradise
  // Blvd. Holmes Regional (Melbourne) is the nearest
  // hospital. Far-away drives are estimates from the routes (MCO from an
  // airport guide).
  indialantic: {
    restaurants: [
      { name: 'The Original Bizzarro Famous NY Pizza', address: '4 Wavecrest Ave', lat: 28.092157, lng: -80.566863 },
      { name: 'Islands Fish Grill', address: '111 5th Ave', lat: 28.091347, lng: -80.566989 },
      { name: 'Villa Palma Ristorante', address: '874 N Miramar Ave', lat: 28.098139, lng: -80.568969 },
      { name: 'Boardwalk Bar & Grill', address: '205 S Miramar Ave', lat: 28.090762, lng: -80.56639 },
      { name: 'Rooftop Bar', address: "249 5th Ave (at Djon's Village Market)", lat: 28.090519, lng: -80.569932 },
      { name: 'Oceanside Pizza', address: '810 N Miramar Ave', lat: 28.096874, lng: -80.568604 },
    ],
    landmarks: [
      { name: 'Indialantic Boardwalk', address: '5th Ave at A1A', lat: 28.0915, lng: -80.566 },
      { name: 'Paradise Beach Park', address: 'N Hwy A1A at Paradise Blvd', lat: 28.1235, lng: -80.5785 },
      { name: 'Publix', address: '700 N Miramar Ave', lat: 28.096153, lng: -80.568387 },
      { name: "Djon's Village Market", address: '249 5th Ave', lat: 28.090519, lng: -80.569932 },
      { name: 'Downtown Melbourne', address: 'E New Haven Ave', lat: 28.078484, lng: -80.605955 },
      { name: 'Holmes Regional Medical Center', address: '1350 S Hickory St, Melbourne', lat: 28.08776, lng: -80.613603 },
    ],
    far: [
      { name: 'Melbourne Orlando Int’l Airport (MLB)', miles: '7', drive: '15 min' },
      { name: 'Port Canaveral cruise terminals', miles: '30', drive: '35–40 min' },
      { name: 'Kennedy Space Center Visitor Complex', miles: '40', drive: '50 min' },
      { name: 'Orlando International Airport (MCO)', miles: '65', drive: '1 hr' },
      { name: 'Universal Orlando', miles: '75', drive: '1 hr 15 min' },
      { name: 'Walt Disney World', miles: '80', drive: '1 hr 20 min' },
    ],
  },
  'satellite-beach': {
    restaurants: [
      { name: 'Morning Glory Eatery', address: '1753 Hwy A1A', lat: 28.158265, lng: -80.585857 },
      // Not matched by the Census geocoder; interpolated between the matched
      // 700 and 800 S Patrick Dr.
      { name: 'Morning Glory II', address: '724 S Patrick Dr', lat: 28.193256, lng: -80.606275 },
      { name: 'Doubles Beachside', address: '1604 Hwy A1A', lat: 28.16451, lng: -80.587548 },
      { name: 'Cadillac Cove', address: '1462 Hwy A1A', lat: 28.170301, lng: -80.588959 },
      { name: 'Sandbar Sports Grill', address: '1246 Hwy A1A', lat: 28.177753, lng: -80.590959 },
      { name: 'The Breezeway Bar & Grill', address: '30 Tradewinds Dr', lat: 28.160602, lng: -80.605170 },
      { name: 'Drifters Surf Restro', address: '1875 S Patrick Dr, Indian Harbour Beach', lat: 28.152736, lng: -80.599881 },
      { name: "Dunkin'", address: '1000 Hwy A1A', lat: 28.186915, lng: -80.593171 },
    ],
    landmarks: [
      { name: 'Pelican Beach Park', address: '1525 Hwy A1A', lat: 28.166562, lng: -80.587932 },
      // Not matched by the Census geocoder; interpolated along A1A between
      // the matched 100 and 1000 Hwy A1A.
      { name: 'Hightower Beach Park', address: '815 Hwy A1A', lat: 28.1921, lng: -80.5938 },
      { name: 'Publix (Atlantic Plaza)', address: '1024 Hwy A1A', lat: 28.185899, lng: -80.592955 },
      { name: 'Downtown Melbourne', address: 'E New Haven Ave', lat: 28.078484, lng: -80.605955 },
      { name: 'Holmes Regional Medical Center', address: '1350 S Hickory St, Melbourne', lat: 28.08776, lng: -80.613603 },
    ],
    far: [
      { name: 'Melbourne Orlando Int’l Airport (MLB)', miles: '12', drive: '20 min' },
      { name: 'Port Canaveral cruise terminals', miles: '18', drive: '25 min' },
      { name: 'Kennedy Space Center Visitor Complex', miles: '30', drive: '40 min' },
      { name: 'Orlando International Airport (MCO)', miles: '55', drive: '55 min' },
      { name: 'Universal Orlando', miles: '65', drive: '1 hr 10 min' },
      { name: 'Walt Disney World', miles: '70', drive: '1 hr 15 min' },
    ],
  },
  'indian-harbour-beach': {
    restaurants: [
      { name: 'Keywest Bar', address: '2286 Hwy A1A', lat: 28.139964, lng: -80.581462 },
      { name: 'Starbucks', address: '840 E Eau Gallie Blvd', lat: 28.138737, lng: -80.585931 },
      // Not matched by the Census geocoder; interpolated between the matched
      // 840 E Eau Gallie Blvd and ALDI's plus code next door.
      { name: 'Texas Roadhouse', address: '941 E Eau Gallie Blvd', lat: 28.1386, lng: -80.5846 },
      { name: 'Cazadores Mexican Restaurant', address: '630 E Eau Gallie Blvd', lat: 28.138686, lng: -80.590065 },
      { name: "Charlie & Jake's Barbecue", address: '490 E Eau Gallie Blvd', lat: 28.138662, lng: -80.593188 },
      // Not matched; interpolated between the matched 270 and 490 E Eau Gallie Blvd.
      { name: 'Margarita Island', address: '455 E Eau Gallie Blvd', lat: 28.1385, lng: -80.5936 },
      { name: 'Drifters Surf Restro', address: '1875 S Patrick Dr', lat: 28.152736, lng: -80.599881 },
    ],
    landmarks: [
      { name: 'Bicentennial Beach Park', address: '1866 Hwy A1A', lat: 28.153098, lng: -80.584693 },
      // Across A1A from 2186 Hwy A1A (geocoded), on the ocean side.
      { name: 'Millennium Beach Park', address: 'Hwy A1A (across from 2186)', lat: 28.1432, lng: -80.5815 },
      { name: 'Gleason Park & Recreation Center', address: '1233 Yacht Club Blvd', lat: 28.145279, lng: -80.594277 },
      { name: 'Publix (Indian Harbour Place)', address: '270 E Eau Gallie Blvd', lat: 28.138649, lng: -80.595778 },
      // ALDI and Walmart from their Google plus codes (Census didn't match).
      { name: 'ALDI', address: '961 E Eau Gallie Blvd', lat: 28.137688, lng: -80.584187 },
      { name: 'Walmart', address: '1001 E Eau Gallie Blvd', lat: 28.136813, lng: -80.581812 },
      { name: 'Downtown Melbourne', address: 'E New Haven Ave', lat: 28.078484, lng: -80.605955 },
      { name: 'Holmes Regional Medical Center', address: '1350 S Hickory St, Melbourne', lat: 28.08776, lng: -80.613603 },
    ],
    far: [
      { name: 'Melbourne Orlando Int’l Airport (MLB)', miles: '10', drive: '18 min' },
      { name: 'Port Canaveral cruise terminals', miles: '20', drive: '30 min' },
      { name: 'Kennedy Space Center Visitor Complex', miles: '32', drive: '45 min' },
      { name: 'Orlando International Airport (MCO)', miles: '57', drive: '1 hr' },
      { name: 'Universal Orlando', miles: '67', drive: '1 hr 10 min' },
      { name: 'Walt Disney World', miles: '72', drive: '1 hr 15 min' },
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

function formatDrive(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

// Cities whose buildings spread out along A1A (Melbourne Beach runs from the
// town to the South Beaches) give `farFrom`, the point the typical drives are
// measured from, and numeric `min` drive times. A building more than 2 miles
// from that point adds the extra road miles (straight line x 1.15) and time
// (45 mph), rounded to 5 minutes.
function farRows(city, center) {
  if (!city.farFrom) return city.far;
  const straight = milesBetween(center, city.farFrom);
  const extra = straight > 2 ? straight * 1.15 : 0;
  return city.far.map((f) => ({
    name: f.name,
    miles: String(Math.round(f.miles + extra)),
    drive: formatDrive(Math.round((f.min + (extra / 45) * 60) / 5) * 5),
  }));
}

export function nearbyFor(citySlug, center) {
  const city = CITY_NEARBY[citySlug];
  if (!city || !center) return null;
  return { restaurants: rows(city.restaurants, center), landmarks: rows(city.landmarks, center), far: farRows(city, center) };
}
