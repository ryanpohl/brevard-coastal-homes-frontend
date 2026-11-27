import * as api from './api';
import { AQUARINA_SUBDIVISION_PATTERNS } from './constants';

// Condo building pages (2026-10-08, per Ryan) — /{city}/condos/{building},
// listed A–Z in a "Condo Buildings" directory on the city's
// /condos-for-sale page. Buyers search condos by building name ("Twin
// Towers Cocoa Beach"), where the competition is thin, and the building
// pages linking back to the city condo page help it rank too.
//
// Which buildings: every building with 15+ condo listings or sales in the
// two years of MLS data (checked 2026-10-08), so each page always has
// recent sales to show. `match` is the MLS SubdivisionName fragment(s)
// (case-insensitive "contains", within the city, condos only); phases are
// combined (Royale Towers Ph II + Ph III). `address` and `built` come from
// the MLS listings; `note` is Ryan's own line about the building, if any.
export const CONDO_BUILDINGS = {
  'cocoa-beach': [
    { slug: '2100-towers', name: '2100 Towers', match: ['2100 Towers'], address: '2100 N Atlantic Ave', built: 1975, oceanfront: true },
    { slug: 'atlantique', name: 'Atlantique', match: ['Atlantique'], address: '4800 Ocean Beach Blvd', built: 1966, oceanfront: true },
    { slug: 'avon-by-the-sea', name: 'Avon By The Sea', match: ['Avon By The Sea'], address: null, built: null, oceanfront: false },
    { slug: 'beach-winds', name: 'Beach Winds', match: ['Beach Winds'], address: '650 N Atlantic Ave', built: 1978, oceanfront: true },
    { slug: 'conquistador', name: 'Conquistador', match: ['Conquistador'], address: '4100 Ocean Beach Blvd', built: 1974, oceanfront: true },
    { slug: 'the-diplomat', name: 'The Diplomat', match: ['Diplomat'], address: '3150 N Atlantic Ave', built: 1963, oceanfront: true },
    { slug: 'emerald-seas', name: 'Emerald Seas', match: ['Emerald Seas'], address: '3400 Ocean Beach Blvd', built: 1992, oceanfront: true },
    { slug: 'four-seasons', name: 'Four Seasons', match: ['Four Seasons', '4 Seasons'], address: '3799 S Banana River Blvd', built: 1979, oceanfront: false, near: 'on the Banana River side' },
    {
      slug: 'kaia-residence',
      name: 'Kaia Residence',
      match: ['Kaia'],
      address: '4620 Ocean Beach Blvd',
      built: null,
      newConstruction: true,
      oceanfront: true,
      facts: [
        'A boutique four-story oceanfront building of just 15 residences, now selling in pre-construction with completion expected around 2029.',
        'Mostly 3-bedroom floor plans of about 2,860–3,650 sq ft (plus a 2-bedroom of about 2,490 sq ft), listed from about $1.68 million to $3.45 million in the MLS.',
        'HOA fees are listed at about $1,100 a month, with a 1-year minimum rental, per the MLS.',
        'Amenities include a second-floor oceanfront pool, a fitness center, a Zen garden, direct beach access and private 2-car garages with an EV-charger option, per community sources.',
      ],
    },
    { slug: 'oceana-of-cocoa-beach', name: 'Oceana of Cocoa Beach', match: ['Oceana of Cocoa Beach'], address: '744 S Orlando Ave', built: 1989, oceanfront: false },
    { slug: 'royale-towers', name: 'Royale Towers', match: ['Royale Towers'], address: '1830 & 1860 N Atlantic Ave', built: 1980, oceanfront: true, facts: ['Two eight-story oceanfront towers at 1830 and 1860 N Atlantic Ave with 175 condos, built in 1980–1981; units range from 1 to 4 bedrooms (about 800 to 3,000 sq ft), each with a balcony, per the MLS and community sources.', 'Recent sales run from about $300,000 for smaller units to about $1.2 million for the largest, per the MLS.', 'HOA fees run about $725–$835 a month, with a 2-month minimum rental, per recent MLS listings.', 'Amenities include a heated pool, spa and sauna, a clubhouse, a fitness center, tennis, pickleball, basketball, bocce and shuffleboard courts, a car-wash area, elevators, controlled access and gated private beach access, per community sources.', 'Nearby: Publix at Banana River Square is a short walk away, and the Cocoa Beach Pier and Lori Wilson Park are close by. Schools: Cocoa Beach Jr./Sr. High.'] },
    { slug: 'saturn', name: 'Saturn', match: ['Saturn Condo'], address: '3190 N Atlantic Ave', built: 1963, oceanfront: true },
    { slug: 'stonewood-towers', name: 'Stonewood Towers', match: ['Stonewood Towers'], address: '830 N Atlantic Ave', built: 1980, oceanfront: true, facts: ['A 16-story oceanfront building at 830–850 N Atlantic Ave, built in 1980, with a 24/7 guarded entry; mostly 2- and 3-bedroom, 2-bath condos of about 1,300–2,100 sq ft (a few 4-bedroom units of about 3,600 sq ft), many with both ocean and river views, per the MLS and community sources.', 'Recent sales run from about $450,000 to $960,000, per the MLS.', 'HOA fees run about $805–$950 a month, with a 3-month minimum rental (tenant approval on some units), per recent MLS listings.', 'Amenities include a heated oceanfront pool, hot tub and sauna, private beach access, a fitness center, tennis, pickleball and basketball courts, a driving range and putting green, a clubhouse with party room and kitchen, BBQ and shuffleboard areas, on-site management, assigned covered parking, a car wash and storage, per community sources.', 'Nearby: Banana River Square is a short walk away, along with Ron Jon Surf Shop, Lori Wilson Park and Sidney Fischer Park. Schools: Cocoa Beach Jr./Sr. High.'] },
    {
      slug: 'the-surf-at-cocoa-beach',
      name: 'The Surf at Cocoa Beach',
      match: ['Surf at Cocoa Beach'],
      address: '65 N Atlantic Ave',
      built: 2024,
      oceanfront: true,
      facts: [
        'A five-story oceanfront building of 25 residences in downtown Cocoa Beach, completed in 2024–2025 on more than 2 acres, walkable to shops and restaurants.',
        'Mostly 3-bedroom residences of about 2,650–2,970 sq ft, plus 4-bedroom top-floor homes of about 3,700–4,080 sq ft; most first sales closed in late 2024 and early 2025, from $975,000 to $3.15 million, per the MLS.',
        'HOA fees run about $1,000–$1,200 a month, with a 1-month minimum rental, per recent MLS listings.',
        'Features include direct beach access, 10–11 ft ceilings, private 2-car garages and a pool and hot tub, per community sources.',
      ],
    },
    { slug: 'twin-towers', name: 'Twin Towers', match: ['Twin Towers'], address: '2020 N Atlantic Ave', built: 1964, oceanfront: true, facts: ['One of the most affordable ways to own oceanfront in Cocoa Beach: 1- and 2-bedroom condos of about 600–1,000 sq ft, with recent sales from about $190,000 to $420,000, per the MLS.', 'Two six-story buildings with 192 condos in all, each with two elevators and a secured lobby; many units have balconies with views of both the ocean and the Banana River, good for watching rocket launches, per community sources.', 'HOA fees run about $540–$805 a month, with a 3-month minimum rental (tenant approval on some units), per recent MLS listings.', 'Amenities include a heated pool, private beach access, tennis, pickleball and shuffleboard courts, a sauna, a clubhouse, grilling and picnic areas, on-site laundry, a car-wash area, covered parking, storage rooms and an on-site manager, per community sources.', 'Nearby: Sidney Fischer Park is a 5-minute walk, and Banana River Square (with Publix) is about 5 minutes on foot; Lori Wilson Park, the Cocoa Beach Pier and Ron Jon Surf Shop are close by. Schools: Cape View Elementary and Cocoa Beach Jr./Sr. High.'] },
    { slug: 'villa-vista', name: 'Villa Vista', match: ['Villa Vista'], address: '4700 Ocean Beach Blvd', built: 1973, oceanfront: true },
    { slug: 'windrush', name: 'Windrush', match: ['Windrush'], address: '3170 N Atlantic Ave', built: 1979, oceanfront: true, facts: ['A seven-story oceanfront building of 99 condos at 3170–3180 N Atlantic Ave, built in 1979, with 1- to 3-bedroom units of about 900–2,150 sq ft; the larger units have wrap-around balconies with views of the ocean and the Banana River, per the MLS and community sources.', 'Recent sales run from about $240,000 to $685,000, per the MLS.', 'HOA fees are about $855–$885 a month, with a 1-month minimum rental, per recent MLS listings. Pets up to 30 lbs are allowed, per community sources.', 'Amenities include private beach access, a heated pool and hot tub, a tennis court, a gym, shuffleboard, a clubhouse with full kitchen and sauna, elevators and a car-wash area, per community sources.', 'Nearby: Banana River Square is a short walk away, with Sidney Fischer Park, Lori Wilson Park and Ron Jon Surf Shop close by. Schools: Cocoa Beach Jr./Sr. High.'] },
    { slug: 'windward-apartments', name: 'Windward Apartments', match: ['Windward Apts'], address: '5600 N Banana River Blvd', built: 1965, oceanfront: false, near: 'on the Banana River side' },
    { slug: 'windward-east', name: 'Windward East', match: ['Windward E Condo'], address: '3060 N Atlantic Ave', built: 1978, oceanfront: true },
    // 2026-11-27 (per Ryan's AI push): the busiest Cocoa Beach condo
    // communities that had no page (7–31 MLS sales and listings in two
    // years), plus The Sea Oats, which Google's AI Overview named.
    { slug: 'banana-bay', name: 'Banana Bay', match: ['Banana Bay Condo'], address: '200 S Banana River Blvd', built: 1980, oceanfront: false, near: 'on the Banana River' },
    { slug: 'boardwalk', name: 'Boardwalk', match: ['Boardwalk Condo'], address: '15 N Atlantic Ave', built: 1984, oceanfront: true },
    { slug: 'fountain-cove', name: 'Fountain Cove', match: ['Fountain Cove'], address: '3165 N Atlantic Ave', built: 1984, oceanfront: false, near: 'on the Banana River side' },
    { slug: 'hacienda-del-mar', name: 'Hacienda Del Mar', match: ['Hacienda Del Mar'], address: '1305 S Atlantic Ave', built: 1974, oceanfront: true },
    {
      slug: 'harbor-isles',
      name: 'Harbor Isles',
      match: ['Harbor Isles'],
      address: 'S Brevard Ave',
      built: 1987,
      oceanfront: false,
      near: 'on the Banana River',
      note: 'Its buildings went up in phases from 1987 through 1999.',
      facts: [
        'A waterfront condo community off South Brevard Ave and South Banana River Blvd, by the Banana River and the Thousand Islands, about three blocks from the beach and a few blocks south of downtown Cocoa Beach.',
        '2- and 3-bedroom, 2-bath condos of about 1,100–1,740 sq ft, many with river or lake views, in-unit laundry and garages.',
        'HOA fees run about $780–$910 a month, with a 3-month minimum rental, per recent MLS listings.',
        'Amenities include three pools (one a riverfront lap pool), a fitness center, tennis courts, shuffleboard, river docks and a boardwalk, grilling areas and boat/RV storage, per community sources.',
        'Nearby: Ramp Road Park and the Surfside Playhouse. Schools: Theodore Roosevelt Elementary and Cocoa Beach Jr./Sr. High.',
      ],
    },
    { slug: 'magnolia-bay', name: 'Magnolia Bay', match: ['Magnolia Bay'], address: 'Julep Drive', built: 2006, oceanfront: false, near: 'on the Banana River' },
    { slug: 'majestic-seas', name: 'Majestic Seas', match: ['Majestic Seas'], address: '3740 Ocean Beach Blvd', built: 1996, oceanfront: true },
    { slug: 'river-lakes', name: 'River Lakes', match: ['River Lakes Condo'], address: '720–800 S Brevard Ave', built: 1974, oceanfront: false, near: 'on the Banana River' },
    { slug: 'sandcastles', name: 'Sandcastles', match: ['Sandcastles Condo'], address: '1000 & 1050 N Atlantic Ave', built: 1985, oceanfront: true },
    { slug: 'the-sea-oats', name: 'The Sea Oats', match: ['Sea Oats Condo'], address: '4570 Ocean Beach Blvd', built: 1979, oceanfront: true },
    { slug: 'waters-edge', name: 'Waters Edge', match: ['Waters Edge Apts'], address: '2815 S Atlantic Ave', built: 1979, oceanfront: true },
    { slug: 'xanadu', name: 'Xanadu', match: ['Xanadu'], address: '750 N Atlantic Ave', built: 1983, oceanfront: true, facts: ['A 15-story oceanfront building of 108 condos at 750 N Atlantic Ave, built in 1983, about seven blocks north of downtown Cocoa Beach; mostly larger 2- and 3-bedroom condos of about 1,700–2,600 sq ft (a few up to about 3,300 sq ft), per the MLS and community sources.', 'Recent sales run from about $530,000 to $1.375 million, per the MLS.', 'HOA fees are about $995 a month; most listings show a 1-year minimum rental, per recent MLS listings, and pets are not allowed, per community sources.', 'Amenities include direct beach access, a heated pool and spa, a sauna, a fitness center, tennis and pickleball courts, a clubhouse, a grand lobby and covered parking with a car-wash area, per community sources.', 'Nearby: Ron Jon Surf Shop and Lori Wilson Park. Schools: Cocoa Beach Jr./Sr. High.'] },
  ],
  // Indialantic (2026-10-08): fewer, smaller buildings than Cocoa Beach, so
  // the cutoff is 10+ condo listings/sales in two years, with phases
  // combined (Beach Club, Ocean Side Village), plus three newer oceanfront
  // buildings buyers search by name (The Duval, 2795 Ocean, Miramar; per Ryan).
  indialantic: [
    { slug: 'beach-club', name: 'Beach Club', match: ['Beach Club Condo'], address: '1800 Charlesmont Dr', built: 1987, oceanfront: false },
    { slug: '2795-ocean', name: '2795 Ocean', match: ['2795 Ocean'], address: null, built: 2024, oceanfront: true },
    { slug: 'commodore-club', name: 'Commodore Club', match: ['Commodore Club'], address: '995 N Hwy A1A', built: 1980, oceanfront: true },
    { slug: 'indialantic-villas', name: 'Indialantic Villas', match: ['Indialantic Villas'], address: '1145 N Shannon Ave', built: 1981, oceanfront: false },
    { slug: 'magnolia-key', name: 'Magnolia Key', match: ['Magnolia Key'], address: '1 Eighth Ave', built: 2006, oceanfront: true },
    { slug: 'miramar', name: 'Miramar', match: ['Miramar'], address: null, built: 2021, oceanfront: true },
    { slug: 'ocean-side-village', name: 'Ocean Side Village', match: ['Ocean Side Village'], address: null, built: null, oceanfront: false },
    { slug: 'oceanview', name: 'Oceanview', match: ['Oceanview Condo'], address: '2150 N Hwy A1A', built: 1981, oceanfront: false },
    { slug: 'palm-colony-club', name: 'Palm Colony Club', match: ['Palm Colony'], address: '2700 N Hwy A1A', built: 1974, oceanfront: false },
    // Added 2026-11-27: named in Google's AI answer for "indialantic condos for sale".
    { slug: 'the-marenda', name: 'The Marenda', match: ['The Marenda'], address: '755 N Hwy A1A', built: 2016, oceanfront: false },
    { slug: 'villa-riviera-club', name: 'Villa Riviera Club', match: ['Villa Riviera Club'], address: '2925 N Hwy A1A', built: 1975, oceanfront: true },
    { slug: 'townhomes-of-paradise-beach', name: 'Townhomes of Paradise Beach', match: ['Townhomes of Paradise Beach'], address: '255 Paradise Blvd', built: 1979, oceanfront: false },
    { slug: 'the-duval', name: 'The Duval', match: ['Duval Oceanfront'], address: '1455 N Hwy A1A', built: null, newConstruction: true, oceanfront: true },
    { slug: 'the-villager', name: 'The Villager', match: ['Villager Condo'], address: '877 N Hwy A1A', built: 1975, oceanfront: true },
    { slug: 'vizcaya', name: 'Vizcaya', match: ['Vizcaya'], address: '925 N Hwy A1A', built: 1998, oceanfront: true },
  ],
  // Satellite Beach (2026-10-08): same 10+ cutoff as Indialantic; phases
  // combined (Montecito, Waterway Townhouses). "Unrecorded Barberry",
  // "Skyline Subd" and similar subdivision names are left out.
  'satellite-beach': [
    { slug: 'buccaneer', name: 'Buccaneer', match: ['Buccaneer Condo'], address: '1175 Hwy A1A', built: 1973, oceanfront: true },
    { slug: 'buccaneer-beach-club', name: 'Buccaneer Beach Club', match: ['Buccaneer Beach Club'], address: '1125 Hwy A1A', built: 1973, oceanfront: true },
    { slug: 'eastwind', name: 'Eastwind', match: ['Eastwind Condo'], address: '1465 Hwy A1A', built: 1982, oceanfront: true },
    // Has its own neighborhood page (2026-11-02, per Ryan); this page
    // points there so Google treats that one as the main Montecito page.
    { slug: 'montecito', name: 'Montecito', match: ['Montecito'], address: null, built: null, oceanfront: false, neighborhoodPage: '/neighborhoods/montecito', intro: 'Montecito is a gated community in Satellite Beach, Florida, where townhomes are listed on the MLS as condos.' },
    { slug: 'oceana-oceanfront', name: 'Oceana Oceanfront', match: ['Oceana Oceanfront'], address: '1025 Hwy A1A', built: 2019, oceanfront: true },
    { slug: 'oceanus', name: 'Oceanus', match: ['Oceanus'], address: '199 Hwy A1A', built: 1975, oceanfront: true },
    { slug: 'palm-springs', name: 'Palm Springs', match: ['Palm Springs Condo'], address: 'Lancha Circle', built: 2007, oceanfront: false },
    // Added 2026-11-27: named in Google's AI answer for "satellite beach condos for sale".
    { slug: 'sand-castle', name: 'Sand Castle', match: ['Sand Castle Condo'], address: '1273 Hwy A1A', built: 1964, oceanfront: true },
    { slug: 'sandpiper-towers', name: 'Sandpiper Towers', match: ['Sandpiper Towers'], address: '205 Hwy A1A', built: 1964, oceanfront: true },
    { slug: 'sea-breakers', name: 'Sea Breakers', match: ['Sea Breakers Condo'], address: '305 Jimmy Buffett Memorial Hwy', built: 1974, oceanfront: true },
    { slug: 'silver-sands', name: 'Silver Sands', match: ['Silver Sands'], address: '295 Hwy A1A', built: 1987, oceanfront: true },
    { slug: 'south-patrick-apartments', name: 'South Patrick Apartments', match: ['South Patrick Apts'], address: '55 Sea Park Blvd', built: 1962, oceanfront: false },
    { slug: 'townhomes-of-satellite-beach', name: 'Townhomes of Satellite Beach', match: ['Townhomes of Satellite Beach'], address: 'Queens Court', built: 1979, oceanfront: false },
    { slug: 'waterway-townhouses', name: 'Waterway Townhouses', match: ['Waterway Townhouse'], address: null, built: null, oceanfront: false },
  ],
  // Indian Harbour Beach (2026-10-08): same 10+ cutoff; Harbour Royale's
  // north and south buildings combined. Plat names (Burns Village, Lyme Bay
  // Sec 1-3, Gleasons Replat, Town House Estates, Harbour Villa) are left out.
  'indian-harbour-beach': [
    { slug: 'condos-of-indian-harbour', name: 'The Condos of Indian Harbour', match: ['Condos of Indian Harbour'], address: '1045 Cheyenne Blvd', built: 1972, oceanfront: false },
    { slug: 'coquina-palms', name: 'Coquina Palms', match: ['Coquina Palms'], address: 'Thatch Palm Court', built: 1997, oceanfront: false },
    { slug: 'fortebello', name: 'Fortebello', match: ['Fortebello'], address: 'Mediterranean Way', built: 2013, oceanfront: false },
    // 2026-11-27 (per Ryan's AI push): Indian Harbour Beach Club, The Cristal,
    // Gardenia Oceanfront and Marina Isles Club added (Google's AI Overview
    // named them and quoted other agents' pages); The Jamestown removed (its
    // units sell under the site's $200K condo minimum, so its page was always
    // empty) and redirected to the town's condo page (REMOVED_CONDO_BUILDINGS).
    // `facts`: confirmed building facts for the "Key Facts" list (MLS sheets
    // Ryan sent, the association's own site, or worded "per community
    // sources"); `aka`: other spellings people search for.
    {
      slug: 'gardenia-oceanfront',
      name: 'Gardenia Oceanfront',
      match: ['Gardenia Oceanfront'],
      address: '2195 Hwy A1A',
      built: 2001,
      oceanfront: true,
      facts: [
        'A boutique oceanfront building of about 24 residences, many of them 3-bedroom, 2-bath condos of about 2,228 sq ft with oceanfront balconies.',
        'HOA fees run about $1,200 a month, per recent MLS listings.',
        'Amenities include private beach access, a heated oceanfront pool, a secured lobby and under-building parking, per community sources.',
        'Recent listings note a 2023 roof replacement and a completed Structural Integrity Reserve Study (SIRS).',
      ],
    },
    {
      slug: 'harbour-royale',
      name: 'Harbour Royale',
      match: ['Harbour Royale'],
      address: '500 & 520 Palm Springs Blvd',
      built: 1980,
      oceanfront: false,
      facts: [
        'An eight-story condominium community of 232 units built in 1980, on the barrier island within walking distance of public beach access, shops and restaurants.',
        'Units are 2-bedroom (about 1,055–1,100 sq ft) and 3-bedroom (about 1,430 sq ft) floor plans.',
        'HOA fees run about $600–$700 a month and cover water and sewer, trash, Spectrum cable with Wi-Fi, pest control and reserves, per the association.',
        'Amenities include a pool and cabana, a clubhouse with kitchen, library and game room, tennis, pickleball and shuffleboard courts.',
        'Each unit has an assigned covered parking space, with laundry and storage on each floor. One pet up to 25 lbs is allowed, per the association.',
      ],
    },
    {
      slug: 'indian-harbour-beach-club',
      name: 'Indian Harbour Beach Club',
      aka: 'Indian Harbor Beach Club',
      match: ['Indian Harbour Beach Club'],
      address: '2055 Hwy A1A',
      built: 1984,
      oceanfront: true,
      facts: [
        'A six-story oceanfront building (also spelled Indian Harbor Beach Club) with 2-bedroom, 2-bath condos of about 1,300–1,350 sq ft, and one of the few oceanfront buildings here that allows short-term rentals (3-day minimum, per the MLS).',
        'HOA fees are about $600 a month plus $300 a quarter (about $700 a month in all) and cover cable TV, internet, building insurance, water, sewer, trash, pest control and grounds.',
        'The roof was replaced in 2022–2023, concrete restoration was completed in 2024–2025 and the building was painted in 2025, per the MLS.',
        'Amenities include a beachfront pool, private beach access, a barbecue area, shuffleboard, a car-wash area and elevators, with an assigned covered carport space for each unit. Pets are not allowed.',
        'Schools: Ocean Breeze Elementary, Hoover Middle and Satellite High.',
      ],
    },
    {
      slug: 'lantana-oceanfront',
      name: 'Lantana Oceanfront',
      match: ['Lantana Oceanfront'],
      address: '1791–1811 Hwy A1A',
      built: 1999,
      oceanfront: true,
      facts: [
        'Oceanfront 2- and 3-bedroom condos of about 1,720–2,051 sq ft with ocean-facing balconies, completed around 1999–2000.',
        'Amenities include private beach access, a heated oceanfront pool, a clubhouse, a fitness room, garage parking and a car-wash area, per community sources.',
        'Schools: Ocean Breeze Elementary, Hoover Middle and Satellite High.',
      ],
    },
    {
      slug: 'marina-isles-club',
      name: 'Marina Isles Club',
      match: ['Marina Isles Club'],
      address: 'Marina Isles Blvd',
      built: 1985,
      oceanfront: false,
      near: 'on the Banana River',
      facts: [
        'Riverfront condos on Marina Isles Blvd, built from 1985 to 1998, with 2- to 4-bedroom homes of about 1,276–2,643 sq ft.',
        'HOA fees run about $550–$770 a month, per recent MLS listings.',
        'Schools: Ocean Breeze Elementary, Hoover Middle and Satellite High.',
      ],
    },
    { slug: 'ocean-walk', name: 'Ocean Walk', match: ['Ocean Walk Condo'], address: '2225 Hwy A1A', built: 1984, oceanfront: true },
    { slug: 'somerset-oceanfront', name: 'Somerset Oceanfront', match: ['Somerset Oceanfront'], address: '2065 Hwy A1A', built: 2003, oceanfront: true },
    { slug: 'south-harbor-estates', name: 'South Harbor Estates', match: ['South Harbor Estates'], address: 'Anchor Drive', built: 1989, oceanfront: false },
    {
      slug: 'the-cristal',
      name: 'The Cristal',
      match: ['Cristal Condo'],
      address: '1907 & 1919 Hwy A1A',
      built: 2000,
      oceanfront: true,
      facts: [
        'Two four-story oceanfront buildings with 44 condos in all, mostly 3-bedroom, 2-bath floor plans of about 1,800–2,280 sq ft, each with a private one-car garage space.',
        'HOA fees run about $1,200 a month, per recent MLS listings, and cover exterior and roof upkeep, water and trash and basic cable, per community sources.',
        'Amenities include private beach access, a heated oceanfront pool, a clubhouse, a fitness room, a secure lobby and guest parking, per community sources.',
        'Not a 55+ community. Up to 2 pets (about 30–35 lbs each) and a 6-month minimum rental, per community sources; confirm with the association.',
      ],
    },
  ],
  // Melbourne Beach (2026-10-08): most condo sales are in Aquarina, Beach
  // Woods and Harbor Island Beach Club, which already have their own pages
  // (`href` links those instead of making building pages). The Breakers
  // (Ph I-III), Breakers West and Lighthouse Cove (Ph I/III/IV; not part of
  // Aquarina, per Ryan) are the other buildings with 10+ listings/sales.
  // The three community rows also carry `match` (2026-10-15) so the
  // comparison table includes them: Aquarina uses its page's own patterns,
  // Harbor Island Beach Club the MLS name the backend links it by.
  'melbourne-beach': [
    { slug: 'aquarina', name: 'Aquarina', href: '/neighborhoods/aquarina/condos-for-sale', detail: 'Gated community', match: AQUARINA_SUBDIVISION_PATTERNS },
    { slug: 'beach-woods', name: 'Beach Woods', href: '/neighborhoods/beach-woods', detail: 'Townhomes & condos', match: ['Beach Woods'] },
    { slug: 'the-breakers', name: 'The Breakers', match: ['The Breakers Condo'], address: 'Atlantic St', built: 1980, oceanfront: true },
    { slug: 'breakers-west', name: 'Breakers West', match: ['Breakers West'], address: '1850 Atlantic St', built: 1981, oceanfront: false },
    { slug: 'harbor-island-beach-club', name: 'Harbor Island Beach Club', href: '/neighborhoods/harbor-island-beach-club/condos-for-sale', detail: 'Gated community', match: ['Harbor Island Beach Club'] },
    { slug: 'lighthouse-cove', name: 'Lighthouse Cove', match: ['Lighthouse Cove'], address: 'Casseekee Trail', built: 1980, oceanfront: false },
    // Added 2026-11-27 (per Ryan: "yes add the buildings now"): the buildings
    // Google's AI named for Melbourne Beach condos (Ebb Tide, Versailles sur
    // la Mer, South Shores Oceanside), plus the busiest others in two years.
    { slug: 'ebb-tide', name: 'Ebb Tide', match: ['Ebb Tide'], address: '2999 S Highway A1A', built: 1985, oceanfront: true },
    { slug: 'peppertree', name: 'Peppertree', match: ['Peppertree'], address: '201–203 Sixth Avenue', built: 1979, oceanfront: false },
    { slug: 'south-shores-oceanside', name: 'South Shores Oceanside', match: ['South Shores Oceanside'], address: '5635 S Highway A1A', built: 1986, oceanfront: true },
    { slug: 'sterling-house', name: 'Sterling House', match: ['Sterling House'], address: '6305–6309 S Highway A1A', built: 1980, oceanfront: true },
    { slug: 'treetop-village', name: 'Treetop Village', match: ['Treetop Village'], address: 'Treetop Drive', built: 1986, oceanfront: false },
    { slug: 'versailles-sur-la-mer', name: 'Versailles sur la Mer', match: ['Versailles Sur La Mer'], address: '3035–3039 S Highway A1A', built: 1981, oceanfront: true },
    { slug: 'village-of-tramore', name: 'Village of Tramore', match: ['Village of Tramore'], address: 'Tramore Place', built: 1997, oceanfront: false },
  ],
  // Cape Canaveral (2026-11-10, per Ryan's AI screenshot for "cape canaveral
  // condos for sale", which named buildings from other sites). 7+ condo
  // listings/sales in two years, phases combined. Units under the site's
  // $200K floor (many studios) don't show.
  'cape-canaveral': [
    { slug: 'villages-of-seaport', name: 'The Villages of Seaport', match: ['Villages of Seaport'], address: 'Beach Park Lane & Ocean Park Lane', built: 1985, oceanfront: false },
    { slug: 'royal-mansion', name: 'Royal Mansion', match: ['Royal Mansion'], address: '8600 Ridgewood Avenue', built: 1985, oceanfront: true },
    { slug: 'portside-villas', name: 'Portside Villas', match: ['Portside Villas'], address: '111 Portside Avenue', built: 2005, oceanfront: false, near: 'by Port Canaveral' },
    { slug: 'seaport-ocean-front', name: 'The Seaport Ocean Front', match: ['Seaport Ocean Front'], address: '806 Mystic Drive', built: 2004, oceanfront: true },
    { slug: 'canaveral-towers', name: 'Canaveral Towers', match: ['Canaveral Towers'], address: '7520 Ridgewood Avenue', built: 1975, oceanfront: true },
    { slug: 'costa-del-sol', name: 'Costa Del Sol', match: ['Costa Del Sol'], address: 'N Banana River Drive', built: 1979, oceanfront: false, near: 'on the Banana River side' },
    { slug: 'ocean-oaks', name: 'Ocean Oaks', match: ['Ocean Oaks'], address: '8700 Ridgewood Avenue', built: 1995, oceanfront: true },
    // Added 2026-11-27: named in Google's AI answer for "cape canaveral condos for sale".
    { slug: 'puerto-del-rio', name: 'Puerto Del Rio', match: ['Puerto Del Rio'], address: 'Puerto Del Rio Drive', built: 2003, oceanfront: false, near: 'on the Banana River side' },
    { slug: 'shorewood', name: 'Shorewood', match: ['Shorewood Condo'], address: '605 Shorewood Drive', built: 1997, oceanfront: true },
    { slug: 'treasure-island-club', name: 'Treasure Island Club', match: ['Treasure Island Club'], address: '300 Columbia Drive', built: 1985, oceanfront: false, near: 'on the Banana River side' },
    { slug: 'bayside', name: 'Bayside', match: ['Bayside Condo'], address: 'Bayside Drive', built: 2002, oceanfront: false },
  ],
  // Merritt Island (2026-11-08, per Ryan: Google's AI answers for "merritt
  // towers condos for sale" and "river fly in merritt island" cite other
  // agents' building pages). Smaller condo market than the beach towns, so
  // the cutoff is 7+ condo listings/sales in two years, phases combined.
  // Condos under the site's $200K floor (e.g. Sunset Bay, Summer Place)
  // never show, so they're left out. 15 Houston Lane listings have no
  // complex name in the MLS and can't be matched yet.
  'merritt-island': [
    { slug: 'cape-crossing', name: 'Cape Crossing', match: ['Cape Crossing'], address: null, built: 2017, oceanfront: false },
    { slug: 'harbor-del-rio', name: 'Harbor Del Rio', match: ['Harbor Del Rio'], address: null, built: 2004, oceanfront: false, near: 'on Del Rio Way' },
    { slug: 'island-pointe', name: 'Island Pointe', match: ['Island Pointe'], address: null, built: 2004, oceanfront: false },
    { slug: 'marina-village', name: 'Marina Village', match: ['Marina Village'], address: '540 S Banana River Dr', built: 2005, oceanfront: false },
    {
      slug: 'merritt-towers',
      name: 'Merritt Towers',
      match: ['Merritt Towers'],
      address: '200, 250 & 300 S Sykes Creek Pkwy',
      built: 1985,
      oceanfront: false,
      near: 'on Sykes Creek',
      note: 'Its three towers went up in phases through 1991.',
    },
    {
      slug: 'river-fly-in',
      name: 'River Fly-In',
      match: ['River Fly'],
      address: '735 Pilot Lane',
      built: 2024,
      oceanfront: false,
      near: 'next to Merritt Island Airport',
    },
    { slug: 'townhomes-and-villas-of-diana', name: 'Townhomes and Villas of Diana', match: ['Villas of Diana'], address: null, built: 1984, oceanfront: false, near: 'on Jolson Court' },
  ],
};

export function condoBuildings(citySlug) {
  return [...(CONDO_BUILDINGS[citySlug] || [])].sort((a, b) =>
    a.name.replace(/^The /, '').localeCompare(b.name.replace(/^The /, ''))
  );
}

// Building pages taken down, sent to a replacement with a 301 (2026-11-27).
export const REMOVED_CONDO_BUILDINGS = {
  'indian-harbour-beach/the-jamestown': '/indian-harbour-beach/condos-for-sale',
};

// Entries with `href` link an existing community page and get no building page.
export function findCondoBuilding(citySlug, slug) {
  return (CONDO_BUILDINGS[citySlug] || []).find((b) => b.slug === slug && !b.href) || null;
}

export function condoBuildingHref(citySlug, b) {
  return b.href || `/${citySlug}/condos/${b.slug}`;
}

// "Oceanfront · built 1980" under each name in the directory.
export function condoBuildingDetail(b) {
  if (b.detail) return b.detail;
  const near = b.near ? b.near.replace(/^on the /, '').replace(/^a /, 'A ') : null;
  const where = b.oceanfront ? 'Oceanfront' : near ? near.charAt(0).toUpperCase() + near.slice(1) : null;
  const age = b.newConstruction ? 'New construction' : b.built ? `Built ${b.built}` : null;
  return [where, age].filter(Boolean).join(' · ');
}

export function condoBuildingFilter(citySlug, b) {
  return { city: citySlug, propertyType: 'Condo', subdivisionLike: b.match.join(',') };
}

const FEE_MONTHS = { Monthly: 1, Quarterly: 3, 'Semi-Annually': 6, Annually: 12, Weekly: 12 / 52 };

function median(values) {
  const sorted = values.filter((v) => typeof v === 'number' && v > 0).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

// Monthly HOA fee from a listing, or null when missing/unknown frequency.
function monthlyFee(l) {
  if (!(l.assocFee > 0)) return null;
  const months = FEE_MONTHS[l.assocFeeFrequency] || (l.assocFeeFrequency ? null : 1);
  return months ? Math.round(l.assocFee / months) : null;
}

// Most common minimum rental term listed in the MLS ("3 Months"), from the
// first term in each listing's RentalRestrictions.
function commonRentalMinimum(listings) {
  const counts = {};
  listings.forEach((l) => {
    const first = (l.rentalRestrictions || '').split(',')[0].trim();
    if (first && first !== 'Other') counts[first] = (counts[first] || 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : null;
}

// The building's location: the middle (median) of its listings' map
// coordinates, so one mis-pinned listing can't move it.
function buildingCenter(listings) {
  const pts = listings.filter(
    (l) => typeof l.latitude === 'number' && typeof l.longitude === 'number' && l.latitude > 24 && l.latitude < 31 && l.longitude < -79 && l.longitude > -88
  );
  if (!pts.length) return null;
  const mid = (vals) => {
    const v = [...vals].sort((a, b) => a - b);
    const m = Math.floor(v.length / 2);
    return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
  };
  return { lat: mid(pts.map((p) => p.latitude)), lng: mid(pts.map((p) => p.longitude)) };
}

export async function getCondoBuildingData(citySlug, b) {
  const filter = condoBuildingFilter(citySlug, b);
  try {
    const [active, sold, history, soldStats] = await Promise.all([
      api.getListings({ ...filter, pageSize: 60, sort: 'price_desc' }),
      api.getListings({ ...filter, status: 'Sold', closedWithinDays: 365, sort: 'sold_newest', pageSize: 100 }),
      api.getListings({ ...filter, status: 'Sold', closedWithinDays: 730, sort: 'sold_newest', pageSize: 100 }),
      api.getSoldStats(filter).catch(() => null),
    ]);
    const activeListings = (active.results || []).filter((l) => l.price > 0);
    const soldListings = (sold.results || []).filter((l) => (l.closePrice ?? l.price) > 0);
    const all = [...activeListings, ...(history.results || [])];
    const fees = all.map(monthlyFee).filter(Boolean);
    const prices = soldListings.map((l) => l.closePrice ?? l.price);
    // Two years of sales (2026-11-27): small buildings may have only a few
    // sales in 12 months, so the box also shows the 2-year count and range.
    const twoYear = (history.results || []).map((l) => l.closePrice ?? l.price).filter((v) => v > 0);
    const perSqft = soldListings.filter((l) => l.sqft > 0).map((l) => Math.round((l.closePrice ?? l.price) / l.sqft));
    return {
      active: activeListings,
      activeCount: typeof active.total === 'number' ? active.total : activeListings.length,
      medianListPrice: median(activeListings.map((l) => l.price)),
      soldStats,
      recentlySold: {
        count: typeof sold.total === 'number' ? sold.total : soldListings.length,
        medianPrice: median(prices),
        medianPerSqft: median(perSqft),
        recent: soldListings.slice(0, 20),
        activeCount: typeof active.total === 'number' ? active.total : activeListings.length,
      },
      feeMin: fees.length ? Math.min(...fees) : null,
      feeMax: fees.length ? Math.max(...fees) : null,
      feeMedian: median(fees),
      soldTwoYears: twoYear.length
        ? { count: typeof history.total === 'number' ? history.total : twoYear.length, low: Math.min(...twoYear), high: Math.max(...twoYear) }
        : null,
      center: buildingCenter(all),
      rentalMinimum: commonRentalMinimum(all),
    };
  } catch {
    return null;
  }
}

// Building comparison table (2026-10-15, per Ryan: "do the Cocoa Beach condo
// pages next"). One row per building on the city's condo pages: listings
// for sale now, asking prices, median sale price over the last 12 months,
// typical monthly HOA and the usual minimum rental term. Built from two
// paged MLS queries for every building at once (active, and sold in the
// last 2 years), then split by building, instead of four queries per
// building like the building pages. Cities in COMPARISON_CITIES only.
export const COMPARISON_CITIES = ['cocoa-beach', 'indialantic', 'satellite-beach', 'indian-harbour-beach', 'melbourne-beach', 'merritt-island', 'cape-canaveral'];

async function allPages(params, maxPages = 6) {
  const first = await api.getListings({ ...params, pageSize: 100, page: 1 });
  const rows = [...(first.results || [])];
  const pages = Math.min(first.totalPages || 1, maxPages);
  for (let page = 2; page <= pages; page += 1) {
    const next = await api.getListings({ ...params, pageSize: 100, page });
    rows.push(...(next.results || []));
  }
  return rows;
}

export async function getCondoBuildingComparison(citySlug, { oceanfrontOnly = false } = {}) {
  if (!COMPARISON_CITIES.includes(citySlug)) return null;
  const buildings = condoBuildings(citySlug).filter((b) => b.match && (!oceanfrontOnly || b.oceanfront));
  // A comparison needs at least two rows (Melbourne Beach has one
  // oceanfront building page).
  if (buildings.length < 2) return null;
  const filter = { city: citySlug, propertyType: 'Condo', subdivisionLike: buildings.flatMap((b) => b.match).join(',') };
  try {
    const [active, sold] = await Promise.all([
      allPages(filter),
      allPages({ ...filter, status: 'Sold', closedWithinDays: 730, sort: 'sold_newest' }),
    ]);
    const yearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    const belongs = (b) => (l) => {
      const sub = (l.subdivision || '').toLowerCase();
      return b.match.some((m) => sub.includes(m.toLowerCase()));
    };
    const rows = buildings.map((b) => {
      const mine = belongs(b);
      const forSale = active.filter((l) => mine(l) && l.price > 0);
      const soldAll = sold.filter(mine);
      const soldYear = soldAll.filter((l) => {
        const t = Date.parse(l.closeDate || '');
        return Number.isFinite(t) ? t >= yearAgo : false;
      });
      const prices = forSale.map((l) => l.price).sort((a, z) => a - z);
      return {
        building: b,
        forSale: forSale.length,
        low: prices[0] ?? null,
        high: prices[prices.length - 1] ?? null,
        soldCount: soldYear.length,
        soldMedian: median(soldYear.map((l) => l.closePrice ?? l.price)),
        feeMedian: median([...forSale, ...soldAll].map(monthlyFee).filter(Boolean)),
        rentalMinimum: commonRentalMinimum([...forSale, ...soldAll]),
      };
    });
    // Most listings first, then most sales.
    rows.sort((a, z) => z.forSale - a.forSale || z.soldCount - a.soldCount || a.building.name.localeCompare(z.building.name));
    return rows;
  } catch {
    return null;
  }
}
