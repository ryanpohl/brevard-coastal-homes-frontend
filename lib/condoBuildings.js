import * as api from './api';
import { AQUARINA_SUBDIVISION_PATTERNS, cityListingsQueryParams } from './constants';

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
    { slug: 'beach-winds', name: 'Beach Winds', match: ['Beach Winds'], address: '650 N Atlantic Ave', built: 1978, oceanfront: true, aka: 'Beachwinds', facts: ['A direct-oceanfront, eight-story building of 83 condos (also written Beachwinds) at 650 N Atlantic Ave in central Cocoa Beach, built in 1978, with unobstructed ocean views to the north and south and large balconies; walkable to restaurants and shopping, per community sources.', 'Mostly 2- and 3-bedroom condos of about 1,200–1,800 sq ft, plus a few 1-bedroom and larger units; recent sales run from about $328,000 to $700,000, per the MLS.', 'HOA fees run about $740–$860 a month, with a 3-month minimum rental, per recent MLS listings. Pets up to 30 lbs are allowed, and it is not a 55+ community, per community sources.', 'Amenities include private, secured beach access, a heated oceanfront pool (no hot tub), lighted tennis courts, shuffleboard, a recreation room with kitchen, garage parking, a car-wash area and a secured elevator entry, per community sources.'] },
    { slug: 'conquistador', name: 'Conquistador', match: ['Conquistador'], address: '4100 Ocean Beach Blvd', built: 1974, oceanfront: true },
    { slug: 'the-diplomat', name: 'The Diplomat', match: ['Diplomat'], address: '3150 N Atlantic Ave', built: 1963, oceanfront: true, facts: ['One of the few Cocoa Beach oceanfront communities that allows short stays: per the association, oceanfront units can be rented by the night and other units have a 2-week minimum (most MLS listings show 2 weeks).', '2-bedroom condos of about 700–1,000 sq ft, built in 1963, with recent sales from about $165,000 to $450,000, per the MLS.', 'HOA fees are about $405–$480 a month, among the lowest for an oceanfront community in Cocoa Beach, per recent MLS listings.', 'Amenities include a pool, beach access, tennis, pickleball, shuffleboard and bocce courts, horseshoes, a clubhouse and recreation room, grills and picnic areas, laundry facilities, security cameras and on-site management, per the association.'] },
    { slug: 'emerald-seas', name: 'Emerald Seas', match: ['Emerald Seas'], address: '3400 Ocean Beach Blvd', built: 1992, oceanfront: true, facts: ['A gated, eight-story oceanfront community of 104 condos in two buildings (North and South) at 3400 and 3450 Ocean Beach Blvd, built in 1992, with 2- and 3-bedroom condos of about 1,600–2,400 sq ft; many units have ocean views and launch views toward Cape Canaveral, per the MLS and community sources.', 'Recent sales run from about $515,000 to $1.26 million, with most 2-bedroom units around $550,000–$600,000, per the MLS.', 'HOA fees are about $960–$990 a month and cover building and grounds upkeep, water, sewer, trash, cable and internet and building insurance, with a 3-month minimum rental (tenant approval required on some units, and no leasing in the first year on some), per recent MLS listings and community sources.', 'Amenities include private beach access, a heated pool, spa and sauna, tennis and pickleball courts, a fitness room, a clubhouse, secured lobbies and covered under-building parking, per community sources.'] },
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
    { slug: 'windward-east', name: 'Windward East', match: ['Windward E Condo'], address: '3060 N Atlantic Ave', built: 1978, oceanfront: true, facts: ['A seven-story oceanfront building at 3060 N Atlantic Ave, built in 1978, with 1- to 3-bedroom condos of about 900–1,800 sq ft (some up to about 2,660 sq ft), many with balconies, in-unit laundry and garage spaces; not a 55+ community, per the MLS and community sources.', 'Recent sales run from about $200,000 to $650,000, per the MLS.', 'HOA fees are about $970–$980 a month and cover water, sewer, trash and cable TV, with a 1-month minimum rental, per recent MLS listings. One pet (dog or cat) up to 30 lbs is allowed, per community sources.', 'Building updates reported include a new roof, new elevators, updated fire alarms, new walkways and refurbished balconies and railings, per community sources.', 'Amenities include private beach access, a heated pool overlooking the beach, a hot tub, two tennis courts, a clubhouse with full kitchen and card room, a dry sauna, an exercise room and a car-wash area, per community sources.'] },
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
    { slug: 'commodore-club', name: 'Commodore Club', match: ['Commodore Club'], address: '995 N Hwy A1A', built: 1980, oceanfront: true, facts: ['A direct-oceanfront building of 50 condos at 995 N Hwy A1A, built in 1980, with about 400 feet on the ocean and private beach access, per community sources.', '2- to 5-bedroom condos of about 1,230–2,500 sq ft, many with ocean and river views; recent sales run from about $490,000 to $950,000, with a median of about $575,000, per the MLS.', 'HOA fees run about $870–$900 a month and cover building and grounds upkeep, insurance, water, sewer, trash, pest control, security and cable and internet, with a 3-month minimum rental, per recent MLS listings and community sources.', 'Amenities include a heated pool, an in-ground hot tub, a sauna, an exercise room and garage parking, per community sources.'] },
    { slug: 'indialantic-villas', name: 'Indialantic Villas', match: ['Indialantic Villas'], address: '1145 N Shannon Ave', built: 1981, oceanfront: false },
    { slug: 'magnolia-key', name: 'Magnolia Key', match: ['Magnolia Key'], address: '1 Eighth Ave', built: 2006, oceanfront: true },
    { slug: 'miramar', name: 'Miramar', match: ['Miramar'], address: null, built: 2021, oceanfront: true },
    { slug: 'ocean-side-village', name: 'Ocean Side Village', aka: 'Oceanside Village', match: ['Ocean Side Village'], address: 'Oceanside Blvd', built: 2000, oceanfront: false, facts: ['A gated beachside community between the Atlantic Ocean and the Indian River, across A1A from the ocean with a crosswalk and light for walking or biking to the beach, developed from the late 1990s by Mercedes Homes and Holiday Builders, per community sources.', 'Its condo townhomes are 2- to 4-bedroom homes of about 1,270–2,610 sq ft, built from 2000 to 2006, with recent sales and listings from about $285,000 to $440,000, per the MLS. (Single-family homes in the community are listed separately.)', 'HOA fees are about $490–$570 a month (billed quarterly), with a 6-month minimum rental, per recent MLS listings.', 'Amenities include a clubhouse, a heated pool and hot tub, a fitness center, tennis, pickleball and basketball courts and a playground, per community sources. It sits between the causeways with easy access to Eau Gallie Blvd and downtown Melbourne.'] },
    { slug: 'oceanview', name: 'Oceanview', match: ['Oceanview Condo'], address: '2150 N Hwy A1A', built: 1981, oceanfront: false },
    { slug: 'palm-colony-club', name: 'Palm Colony Club', match: ['Palm Colony'], address: '2700 N Hwy A1A', built: 1974, oceanfront: false, facts: ['A 248-unit, two-story condo community on nine acres of the barrier island at 2700 N Hwy A1A, built from the mid-1970s to the 1980s, and the busiest condo community in Indialantic, with 25 sales and listings in the past two years, per the MLS and the association.', 'Mostly 2-bedroom, 2-bath condos of about 1,130 sq ft, plus 1-bedroom units of about 840 sq ft, with recent sales from about $177,000 to $250,000, one of the most affordable ways to live beachside in Indialantic, per the MLS.', 'HOA fees are about $620 a month (billed quarterly) and cover basic cable, internet, water, sewer, roof, exterior insurance and pest control, with a 2-month minimum rental (tenant approval on many units), per recent MLS listings and the association. One pet up to 15 lbs is allowed, per the association.', 'Amenities include a heated pool, a sauna, tennis and pickleball courts, shuffleboard, table tennis, billiards, a library and social activities, per the association. Schools: Indialantic Elementary, Hoover Middle and Melbourne High.'] },
    // Added 2026-11-27: named in Google's AI answer for "indialantic condos for sale".
    { slug: 'the-marenda', name: 'The Marenda', match: ['The Marenda'], address: '755 N Hwy A1A', built: 2016, oceanfront: false },
    { slug: 'villa-riviera-club', name: 'Villa Riviera Club', match: ['Villa Riviera Club'], address: '2925 N Hwy A1A', built: 1975, oceanfront: true },
    { slug: 'townhomes-of-paradise-beach', name: 'Townhomes of Paradise Beach', match: ['Townhomes of Paradise Beach'], address: '255 Paradise Blvd', built: 1979, oceanfront: false },
    { slug: 'the-duval', name: 'The Duval', match: ['Duval Oceanfront'], address: '1455 N Hwy A1A', built: null, newConstruction: true, oceanfront: true },
    { slug: 'the-villager', name: 'The Villager', match: ['Villager Condo'], address: '877 N Hwy A1A', built: 1975, oceanfront: true, facts: ['A 12-story direct-oceanfront high-rise of 97 condos at 877 N Hwy A1A, built in 1975, one of the tallest buildings in Indialantic, with ocean and river views; walkable to restaurants, shops and Publix, about 15 minutes from Melbourne Orlando International Airport, per community sources.', '2-bedroom, 2- to 3-bath condos of about 1,200–1,405 sq ft with private balconies; recent sales run from about $425,000 to $739,000, with a median of about $550,000, per the MLS.', 'HOA fees run about $695–$940 a month and cover cable, high-speed internet, hot water, pest control, trash, building insurance and grounds upkeep, with a 3-month minimum rental (on many units no leasing in the first year and tenant approval required), per recent MLS listings and community sources. Not a 55+ community; up to 2 pets, per community sources.', 'Amenities include private beach access, a heated 26 x 52 ft pool with a covered cabana and gas grills, outdoor showers, a club room with pool table, elevators, parking and garage options, a controlled-access lobby and an on-site manager, per community sources.'] },
    { slug: 'vizcaya', name: 'Vizcaya', match: ['Vizcaya'], address: '925 N Hwy A1A', built: 1998, oceanfront: true },
    // 2026-11-27 (per Ryan's AI push): oceanfront buildings with 3–6 MLS
    // sales and listings in two years that had no page, including the newer
    // luxury buildings (1625 Ocean, Abacos, The Palm Beach).
    { slug: '1625-ocean', name: '1625 Ocean', match: ['1625 Ocean'], address: '1625–1645 N Hwy A1A', built: 2020, oceanfront: true, facts: ['A newer luxury oceanfront building completed in 2020–2021, with 3- and 4-bedroom residences of about 2,800 sq ft; recent sales and listings run from about $2.43 million to $2.5 million, among the highest in Indialantic, per the MLS.', 'HOA fees run about $1,800–$2,800 a month, with a 3-month minimum rental, per recent MLS listings.'] },
    { slug: 'abacos', name: 'Abacos', match: ['Abacos'], address: '1725 N Hwy A1A', built: 2019, oceanfront: true, facts: ['A newer oceanfront building completed in 2019 with 3-bedroom condos of about 1,600–2,450 sq ft; recent sales and listings run from about $649,000 to $1.43 million, per the MLS.', 'HOA fees run about $1,260–$1,335 a month, with a 6-month minimum rental, per recent MLS listings.'] },
    { slug: 'indialantic-1', name: 'Indialantic 1', match: ['Indialantic 1 Condo'], address: '601 N Miramar Ave', built: 2006, oceanfront: true, facts: ['Oceanfront 3- and 4-bedroom condos of about 1,790–3,260 sq ft on Miramar Avenue, built in 2006; recent sales and listings run from about $675,000 to $1.2 million, per the MLS.', 'HOA fees run about $840–$1,065 a month, with a 3-month minimum rental, per recent MLS listings.'] },
    { slug: 'royal-palm', name: 'Royal Palm', match: ['Royal Palm Condo'], address: '1505 N Hwy A1A', built: 1995, oceanfront: true, facts: ['Oceanfront 3-bedroom condos of about 1,610–2,010 sq ft, built in 1995, with recent sales and listings from about $610,000 to $678,000, per the MLS.', 'HOA fees are about $1,175–$1,185 a month (billed quarterly), with a 1-year minimum rental, per recent MLS listings.'] },
    { slug: 'ocean-sands', name: 'Ocean Sands', match: ['Ocean Sands'], address: '2725–2727 N Hwy A1A', built: 1982, oceanfront: true, facts: ['Oceanfront condos in two buildings (North and South), built in 1982, mostly 2-bedroom units of about 1,460–2,610 sq ft, with recent sales from about $515,000 to $725,000, per the MLS.', 'HOA fees run about $950–$1,000 a month, with a 6-month minimum rental, per recent MLS listings.'] },
    { slug: 'the-reef', name: 'The Reef', match: ['The Reef Condo'], address: '1095 N Hwy A1A', built: 1979, oceanfront: true, facts: ['Oceanfront 2-bedroom condos of about 1,340 sq ft, built in 1979, with recent sales from about $520,000 to $581,000, per the MLS.', 'HOA fees run about $610–$650 a month, with a 3-month minimum rental, per recent MLS listings.'] },
    { slug: 'sandy-kaye', name: 'Sandy Kaye', match: ['Sandy Kaye'], address: '2835 N Hwy A1A', built: 1986, oceanfront: true, facts: ['Oceanfront 2- and 3-bedroom condos of about 1,560–2,080 sq ft, built in 1986, with recent sales and listings from about $529,000 to $1.03 million, per the MLS.', 'HOA fees are about $1,000–$1,200 a month, with a 1-year minimum rental, per recent MLS listings.'] },
    { slug: 'the-palm-beach', name: 'The Palm Beach', match: ['The Palm Beach Condominium'], address: '1795 N Hwy A1A', built: 2022, oceanfront: true, facts: ['An oceanfront building with 3-bedroom condos of about 1,720–2,480 sq ft; recent sales run from about $675,000 to $1.8 million, per the MLS.', 'HOA fees run about $750–$850 a month, with a 6-month minimum rental, per recent MLS listings.'] },
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
    {
      slug: 'oceana-oceanfront',
      name: 'Oceana Oceanfront',
      match: ['Oceana Oceanfront'],
      address: '1025 & 1045 Hwy A1A',
      built: 2019,
      oceanfront: true,
      facts: [
        'Two 10-story luxury oceanfront buildings with 108 residences, completed in 2019–2020, with garage parking on the first floor and homes on floors 2–10; upper floors have views of both the Atlantic and the river, per community sources.',
        '3-bedroom floor plans of about 1,900–2,550 sq ft with 2 to 3 baths and large balconies; recent sales run from about $800,000 to $1.45 million, per the MLS.',
        'HOA fees run about $1,100–$1,350 a month and cover building insurance, cable and internet, water, sewer, trash, pest control and common upkeep and security, with a 3-month minimum rental (no short-term vacation rentals), per recent MLS listings and community sources. Up to 2 pets (about 35 lbs each) are allowed, per community sources.',
        'Amenities include a heated oceanfront pool and sun deck, private beach access, a clubhouse, a fitness center, a secure controlled-access lobby, elevators, garage parking and storage, per community sources.',
      ],
    },
    // 2026-11-27 (per Ryan's AI push): oceanfront buildings with 4–14 MLS
    // sales and listings in two years that had no page.
    // 2026-11-28: The Trident (MLS lists it with no subdivision name; matched
    // by a map box around 1230 Hwy A1A).
    { slug: 'the-trident', name: 'The Trident', aka: 'Trident Residence Condominium', box: { latMin: 28.1782, latMax: 28.1790, lngMin: -80.5930, lngMax: -80.5920 }, address: '1230 Hwy A1A', built: 2028, newConstruction: true, oceanfront: false, near: 'on the west side of A1A', facts: ['A new-construction, 7-story gated condo building on a 3.72-acre site on the west side of A1A at 1230 Hwy A1A (next to the Sand Bar restaurant), scheduled for completion in 2028, with ocean, beach and city views from select residences, per community sources.', '2- to 4-bedroom condos from about 1,030 sq ft of living area for the smaller 2-bedrooms up to about 3,000 sq ft for the largest residences; 20 are listed from about $556,000 to $2.2 million, per the MLS.', 'HOA fees run about $790 a month for smaller 2-bedroom units to about $1,290 for larger ones and cover cable TV, internet, insurance, building and grounds upkeep, pest control, security, sewer, trash and water, per community sources; listings show a 6-month minimum rental, per the MLS.', 'Built with concrete construction and a metal roof, with elevators, gated and key-card entry, security cameras, full-time on-site management, a pool, a clubhouse, a fitness center, a sauna, a barbecue area and a dog park; residences have balconies or terraces, kitchen islands, split-bedroom layouts and in-unit laundry, per community sources.'] },
    { slug: 'las-brisas', name: 'Las Brisas', match: ['Las Brisas Condo'], address: '551–567 Hwy A1A', built: 1979, oceanfront: true, facts: ['Oceanfront 3- and 4-bedroom condos of about 1,900 sq ft, built in 1979–1980, with recent sales and listings from about $760,000 to $860,000, per the MLS.', 'HOA fees are about $975 a month, with a 3-month minimum rental, per recent MLS listings.'] },
    { slug: 'monaco', name: 'Monaco', match: ['Monaco Condo'], address: '571–581 Hwy A1A', built: 1996, oceanfront: true, facts: ['Oceanfront 3-bedroom condos of about 1,900 sq ft (and a larger 4-bedroom of about 3,600 sq ft), built in 1996–1997, with recent sales from about $655,000 to $1.48 million, per the MLS.', 'HOA fees are about $910 a month for most units, with a 3-month minimum rental, per recent MLS listings.'] },
    { slug: 'opal-seas-oceanfront', name: 'Opal Seas Oceanfront', match: ['Opal Seas'], address: '275 Hwy A1A', built: 2002, oceanfront: true, facts: ['Oceanfront 3-bedroom condos of about 1,800–2,200 sq ft, built in 2002, with recent sales and listings from about $725,000 to $1 million, per the MLS.', 'HOA fees are about $1,460 a month, with a 3-month minimum rental, per recent MLS listings.'] },
    { slug: 'pineda-ocean-club', name: 'Pineda Ocean Club', match: ['Pineda Ocean Club'], address: '123–175 Hwy A1A', built: 1980, oceanfront: true, facts: ['A direct-oceanfront community at the north end of Satellite Beach, built around 1980, with Phase 1 townhomes (with their own garages and gated courtyards) and four-story condo buildings with ocean views; mostly 2-bedroom homes of about 1,400 sq ft, per the MLS and community sources.', 'Recent sales run from about $445,000 to $685,000, per the MLS.', 'HOA fees run about $565–$645 a month, among the lowest for oceanfront in Satellite Beach, and cover exterior upkeep and water, with a 4-month minimum rental, per recent MLS listings and community sources. Up to 2 pets (30 lbs each) are allowed, per community sources.', 'Amenities include private beach access, a heated ocean-view pool, a gazebo and picnic area, elevators and garage or assigned parking (no hot tub or clubhouse), per community sources.', 'Schools: Sea Park Elementary, DeLaura Middle and Satellite High.'] },
    { slug: 'the-horizon', name: 'The Horizon', match: ['The Horizon Condo'], address: '401–407 Hwy A1A', built: 1984, oceanfront: true, facts: ['A direct-oceanfront community of about 82 condos in four buildings at 401–407 Hwy A1A, built in phases from 1984 to 1988; mostly 3-bedroom floor plans of about 1,700–2,150 sq ft, with a few larger units up to about 3,600 sq ft, per the MLS and community sources.', 'Recent sales run from about $475,000 to $1.22 million, per the MLS.', 'HOA fees are about $1,010–$1,050 a month, with a 6-month minimum rental (tenant approval on some units), per recent MLS listings. One pet up to 30 lbs is allowed, per community sources.', 'Amenities include direct beach access, a heated pool, a clubhouse, a fitness room, garage parking, balconies and impact-rated windows, per community sources.', 'Schools: Sea Park Elementary, DeLaura Middle and Satellite High.'] },
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
    { slug: 'the-breakers', name: 'The Breakers', match: ['The Breakers Condo'], address: 'Atlantic St', built: 1980, oceanfront: true, facts: ['An oceanfront community of 96 condos in eight buildings on Atlantic Street, about a mile south of Ocean Avenue, built around 1980, with about 2,000 feet of Atlantic beach; residents see rocket launches from the Space Center and sea turtles nest on the beach May through October, per community sources.', '2- and 3-bedroom condos of about 1,300–2,300 sq ft, with recent sales from about $489,000 to $865,000, per the MLS.', 'HOA fees run about $1,050–$1,200 a month, per recent MLS listings, and cover building and grounds upkeep, roof, pool, security, irrigation, property insurance, water, sewer, trash, pest control, cable TV and internet, per community sources. Minimum rental is 3 months (tenant approval on some units); dogs and cats are allowed within count and size limits.', 'Amenities include an oceanfront clubhouse with fitness center, recreation room, kitchen and saunas, a heated pool overlooking the beach, tennis and pickleball courts, a putting green, a car-wash station, under-building parking, storage and guest parking across A1A, per community sources.'] },
    { slug: 'breakers-west', name: 'Breakers West', match: ['Breakers West'], address: '1850 Atlantic St', built: 1981, oceanfront: false },
    { slug: 'harbor-island-beach-club', name: 'Harbor Island Beach Club', href: '/neighborhoods/harbor-island-beach-club/condos-for-sale', detail: 'Gated community', match: ['Harbor Island Beach Club'] },
    { slug: 'lighthouse-cove', name: 'Lighthouse Cove', match: ['Lighthouse Cove'], address: 'Casseekee Trail', built: 1980, oceanfront: false, facts: ['A quiet, ungated community of about 80 one- and two-story condo townhomes and villas off A1A on Casseekee Trail, stretching between the Indian River Lagoon and the Atlantic, built in phases from 1980 to 1998, per community sources.', 'Mostly 2-bedroom, 2-bath homes of about 1,000–1,900 sq ft, many with a one-car garage, with recent sales from about $300,000 to $385,000, per the MLS.', 'HOA fees run about $845–$910 a month, with a 6-month minimum rental, per recent MLS listings.', 'Amenities include private deeded beach access across A1A, a riverfront area with a fishing pier and boat ramp, a community pool and a clubhouse, per community sources.', 'Schools: Gemini Elementary, Hoover Middle and Melbourne High.'] },
    // Added 2026-11-27 (per Ryan: "yes add the buildings now"): the buildings
    // Google's AI named for Melbourne Beach condos (Ebb Tide, Versailles sur
    // la Mer, South Shores Oceanside), plus the busiest others in two years.
    { slug: 'ebb-tide', name: 'Ebb Tide', match: ['Ebb Tide'], address: '2999 S Highway A1A', built: 1985, oceanfront: true, facts: ['A 12-story oceanfront building built in 1985 with just two condos per floor, so units look out on both the Atlantic and the Indian River side, per community sources.', '2- and 3-bedroom condos of about 1,370–2,250 sq ft; recent sales were $685,000–$715,000 for 2-bedroom units, and a 3-bedroom is listed at $1.1 million, per the MLS.', 'HOA fees run about $1,300–$1,670 a month (billed quarterly) and cover building and grounds upkeep, insurance, water, sewer and trash, with a 3-month minimum rental; the association does not allow vacation rentals, per the MLS and community sources.', 'Amenities include private beach access, a heated pool, assigned ground-level garage parking, storage and a secured lobby, per community sources.'] },
    { slug: 'peppertree', name: 'Peppertree', match: ['Peppertree'], address: '201–203 Sixth Avenue', built: 1979, oceanfront: false },
    { slug: 'south-shores-oceanside', name: 'South Shores Oceanside', match: ['South Shores Oceanside'], address: '5635 S Highway A1A', built: 1986, oceanfront: true, facts: ['An eight-story oceanfront building of just 28 residences, built in 1986, with four condos per floor on floors 2–8 above ground-floor garages; units have ocean and Indian River views, per community sources.', '3-bedroom, 2.5- to 3-bath condos of about 2,030–2,430 sq ft with wraparound balconies and, in many units, a den or office; recent sales run from about $657,000 to $930,000, per the MLS.', 'HOA fees run about $1,025–$1,700 a month, per recent MLS listings. Recent MLS listings show a 3-month minimum rental, while community sources cite a 6-month minimum with no short-term rentals, so confirm with the association. One dog or cat up to 20 lbs is allowed, per community sources.', 'Concrete restoration, exterior painting and elevator modernization have been completed. Amenities include a heated pool and spa, a tiki area, a private dune crossover to the beach, a fitness center, two elevators, covered garage parking (1–2 spaces), extra storage and on-site management, per community sources.'] },
    { slug: 'sterling-house', name: 'Sterling House', match: ['Sterling House'], address: '6305–6309 S Highway A1A', built: 1980, oceanfront: true, facts: ['A direct-oceanfront community of three mid-rise buildings in southern Melbourne Beach, near South Beach Community Park and the Maritime Hammock Sanctuary, with ocean views and on-site parking, per community sources.', '2- and 3-bedroom, 2-bath condos of about 1,440–1,660 sq ft, with recent sales from about $630,000 to $760,000, per the MLS.', 'HOA fees run about $860–$1,280 a month and cover building upkeep, roof, landscaping, insurance, the pool, water, sewer, trash, pest control and cable and internet, with a 1-month minimum rental (tenant approval on some units), per recent MLS listings and community sources.', 'Amenities include beach access, a heated pool, a pavilion and clubhouse area and landscaped grounds, per community sources.'] },
    { slug: 'treetop-village', name: 'Treetop Village', match: ['Treetop Village'], address: 'Treetop Drive', built: 1986, oceanfront: false },
    { slug: 'versailles-sur-la-mer', name: 'Versailles sur la Mer', match: ['Versailles Sur La Mer'], address: '3001–3039 S Highway A1A', built: 1981, oceanfront: true, facts: ['A quiet, four-story oceanfront community of just 24 residences, built in 1981, with spacious 3- and 4-bedroom, 3-bath condos of about 2,040–2,140 sq ft, multiple balconies and direct ocean views, per the MLS and community sources.', 'Recent sales run from about $715,000 to $780,000, per the MLS.', 'HOA fees are about $1,235–$1,390 a month, with a 3-month minimum rental, per recent MLS listings.', 'Amenities include a private boardwalk to the beach, a community pool with BBQ grills and reserved garage parking, per community sources. It sits on a quiet stretch of South A1A near Spessard Holland South Beach Park, a short drive from Melbourne Beach and Indialantic shops and restaurants.'] },
    { slug: 'village-of-tramore', name: 'Village of Tramore', match: ['Village of Tramore'], address: 'Tramore Place', built: 1997, oceanfront: false },
    // 2026-11-27: Saltaire (9 units, rarely for sale; Google's AI Overview
    // quotes other agents' pages for it).
    { slug: 'saltaire', name: 'Saltaire', match: ['Saltaire Condo'], address: '3135 S Highway A1A', built: 2006, oceanfront: true, facts: ['A boutique, direct-oceanfront building of just 9 residences on four floors, built in 2006, so units rarely come up for sale, per community sources.', '3-bedroom, 3-bath condos of about 2,200–2,650 sq ft with private balconies and hurricane windows or shutters; two are listed at about $1.2 million and $1.33 million, per the MLS.', 'HOA fees are about $1,320 a month, and rentals are not allowed, per recent MLS listings.', 'Amenities include a pool, a hot tub, private beach access, a fitness room and a car-wash area, per community sources.'] },
  ],
  // Cape Canaveral (2026-11-10, per Ryan's AI screenshot for "cape canaveral
  // condos for sale", which named buildings from other sites). 7+ condo
  // listings/sales in two years, phases combined. Units under the site's
  // $200K floor (many studios) don't show.
  'cape-canaveral': [
    { slug: 'villages-of-seaport', name: 'The Villages of Seaport', match: ['Villages of Seaport'], address: 'Beach Park Lane & Ocean Park Lane', built: 1985, oceanfront: false, facts: ['A gated community of mostly 2-bedroom townhome-style condos on Seaport Blvd, Beach Park Lane and Ocean Park Lane, built in phases from 1985 to 2004, and the busiest condo community in Cape Canaveral, with 52 sales in the past two years, per the MLS.', '1- to 3-bedroom homes of about 700–1,350 sq ft (a few larger), most with 2 or more baths; recent sales run from about $188,000 to $460,000, with a median near $295,000, per the MLS.', 'HOA fees run about $600–$690 a month, with a 1-month minimum rental on most units, which makes it popular as an investment or beach getaway, per recent MLS listings.', 'Amenities include three pools, a hot tub, tennis and racquetball courts, a clubhouse with exercise room, viewing deck and community room, private beach access, a car-wash area and on-site management, per community sources.', 'Close to Port Canaveral and its cruise terminals, fishing, restaurants and Kennedy Space Center.'] },
    { slug: 'royal-mansion', name: 'Royal Mansion', match: ['Royal Mansion'], address: '8600 Ridgewood Avenue', built: 1985, oceanfront: true },
    { slug: 'portside-villas', name: 'Portside Villas', match: ['Portside Villas'], address: '111 Portside Avenue', built: 2005, oceanfront: false, near: 'by Port Canaveral' },
    { slug: 'seaport-ocean-front', name: 'The Seaport Ocean Front', match: ['Seaport Ocean Front'], address: '806 Mystic Drive', built: 2004, oceanfront: true },
    { slug: 'canaveral-towers', name: 'Canaveral Towers', match: ['Canaveral Towers'], address: '7520 Ridgewood Avenue', built: 1975, oceanfront: true },
    { slug: 'costa-del-sol', name: 'Costa Del Sol', match: ['Costa Del Sol'], address: 'N Banana River Drive', built: 1979, oceanfront: false, near: 'on the Banana River side', facts: ['A private condo community of 12 buildings (two- to five-story) on 16.6 acres along the Banana River, built from 1979 to 1990, with a community fishing dock and river views, about two blocks from the beach and a short drive to the Cocoa Beach Pier, per community sources.', '2- and 3-bedroom, 2-bath condos of about 1,120–1,780 sq ft, with recent sales from about $160,000 to $445,000 (median about $316,000), one of the busier condo communities in Cape Canaveral, per the MLS.', 'HOA fees are about $750 a month in most sections and cover water, sewer, trash, cable and internet, insurance and exterior and grounds upkeep, with a 3-month minimum rental, per recent MLS listings and community sources. One pet up to 35 lbs is allowed in some buildings, per community sources.', 'Amenities include a clubhouse with kitchen, pool table and event space, two pools (one heated), two lighted tennis courts, a pickleball court, shuffleboard, a sauna and on-site parking or detached garages depending on the unit; the community is self-managed by an elected board, per community sources.'] },
    { slug: 'ocean-oaks', name: 'Ocean Oaks', match: ['Ocean Oaks'], address: '8700 Ridgewood Avenue', built: 1995, oceanfront: true },
    // Added 2026-11-27: named in Google's AI answer for "cape canaveral condos for sale".
    { slug: 'puerto-del-rio', name: 'Puerto Del Rio', match: ['Puerto Del Rio'], address: 'Puerto Del Rio Drive', built: 2003, oceanfront: false, near: 'on the Banana River side', facts: ['A five-story riverfront community of about 304 condos, built from 2003 to 2007, with about 700 feet on the Banana River and views of the river and Port Canaveral; residents watch cruise ships and rocket launches, per community sources.', 'Mostly 3-bedroom, 2-bath condos of about 1,650–2,290 sq ft with wraparound balconies reachable from every room, impact-rated windows and sliders and private laundry rooms; recent sales run from about $300,000 to $685,000 (median about $440,000), and a 4-bedroom penthouse-size unit is listed near $1.6 million, per the MLS.', 'HOA fees run about $925–$945 a month, and most listings show a 3-month minimum rental with tenant approval, per recent MLS listings. One pet per unit is allowed, per community sources.', 'Amenities include a launch area for kayaks, canoes and paddleboards, a community boat dock, two resort-style pools and two hot tubs, poolside clubhouses, a fitness center, a recreation room, secure lobbies with elevators, assigned under-building garage parking, a car-wash area and storage, per community sources.', 'Nearby: Manatee Sanctuary Park is a 5-minute walk, with Cherie Down Park, Jetty Park and Port Canaveral close by. Schools: Cape View Elementary and Cocoa Beach Jr./Sr. High.'] },
    { slug: 'shorewood', name: 'Shorewood', match: ['Shorewood Condo'], address: '605 Shorewood Drive', built: 1997, oceanfront: true },
    { slug: 'treasure-island-club', name: 'Treasure Island Club', match: ['Treasure Island Club'], address: '300 Columbia Drive', built: 1985, oceanfront: false, near: 'on the Banana River side' },
    { slug: 'bayside', name: 'Bayside', match: ['Bayside Condo'], address: 'Bayside Drive', built: 2002, oceanfront: false },
    // 2026-11-27 (per Ryan's AI push): Cape Canaveral condo communities with
    // 5–21 MLS sales and listings in two years that had no page; Google's AI
    // Overview named Canaveral Bay, Cape Winds and Solana Shores.
    { slug: 'bayport', name: 'Bayport', match: ['Bayport Condo'], address: 'Casa Bella Drive', built: 2005, oceanfront: false, facts: ['3-bedroom condos of about 1,500–2,600 sq ft (and a few 4-bedroom), built in 2005–2006, with recent sales from about $375,000 to $520,000, per the MLS.', 'HOA fees run about $700–$775 a month, and most listings show a 6-month minimum rental, per recent MLS listings.'] },
    { slug: 'canaveral-bay', name: 'Canaveral Bay', match: ['Canaveral Bay Condo'], address: '200 International Drive', built: 1983, oceanfront: false, near: 'on the Banana River side', facts: ['2-bedroom condos of about 890–1,230 sq ft, built in 1983–1989, many on the Banana River side, with recent sales and listings from about $193,000 to $299,000, one of the more affordable condo communities in Cape Canaveral, per the MLS.', 'HOA fees run about $460–$550 a month, with a 1-month minimum rental on most units, per recent MLS listings.'] },
    { slug: 'canaveral-sands', name: 'Canaveral Sands', match: ['Canaveral Sands'], address: '8494–8496 Ridgewood Ave', built: 1981, oceanfront: true, facts: ['Oceanfront 2-bedroom condos of about 1,220–1,320 sq ft, built in 1981–1984, with recent sales from about $365,000 to $570,000, per the MLS.', 'HOA fees run about $550–$730 a month, with a 1-month minimum rental, per recent MLS listings.'] },
    { slug: 'cape-shores', name: 'Cape Shores', match: ['Cape Shores Apt'], address: 'Cape Shores Circle', built: 1972, oceanfront: false, near: 'on the Banana River side', facts: ['2-bedroom condos of about 740–1,090 sq ft, built in 1972–1974, about half of them on the river side, with recent sales and listings from about $190,000 to $290,000, per the MLS.', 'HOA fees are about $640 a month, with a 3-month minimum rental (tenant approval on many units), per recent MLS listings.'] },
    { slug: 'cape-winds', name: 'Cape Winds', match: ['Cape Winds Condo'], address: '7400 Ridgewood Ave', built: 1985, oceanfront: true, facts: ['Oceanfront 1- and 2-bedroom condos of about 610–990 sq ft, built in 1985, with recent sales from about $275,000 to $430,000, per the MLS.', 'HOA fees are about $665 a month, and listings show a 1-week minimum rental, so short stays are allowed, per recent MLS listings.'] },
    { slug: 'flores-del-mar', name: 'Flores Del Mar', match: ['Flores Del Mar'], address: '8470–8472 Ridgewood Ave', built: 2001, oceanfront: true, facts: ['Oceanfront 3- and 4-bedroom condos of about 1,590–2,730 sq ft, built in 2001–2002, with recent sales and listings from about $425,000 to $1.08 million, per the MLS.', 'HOA fees run about $770–$890 a month, with a 3-month minimum rental, per recent MLS listings.'] },
    { slug: 'ocean-woods', name: 'Ocean Woods', match: ['Ocean Woods'], address: null, built: 1978, oceanfront: false, facts: ['A wooded community of 2- and 3-bedroom condo villas of about 890–1,580 sq ft, built from 1978 to 1985, and one of the busiest condo communities in Cape Canaveral, with recent sales from about $240,000 to $375,000, per the MLS.', 'HOA fees are about $200 a month, among the lowest in Cape Canaveral, with a 1-month minimum rental, per recent MLS listings.'] },
    { slug: 'sand-dunes-oceanfront', name: 'Sand Dunes Oceanfront', match: ['Sand Dunes Oceanfront'], address: '425 Buchanan Ave', built: 1997, oceanfront: true, facts: ['Oceanfront 3-bedroom condos of about 1,610–2,140 sq ft, built in 1997, with recent sales and listings from about $495,000 to $1.25 million, per the MLS.', 'HOA fees run about $750–$775 a month, with a 1-month minimum rental (tenant approval on some units), per recent MLS listings.'] },
    { slug: 'solana-lake', name: 'Solana Lake', match: ['Solana Lake'], address: '8891–8961 Lake Drive', built: 2001, oceanfront: false, facts: ['A gated community of 192 condos in five-story buildings around a lake with fountains, built in 2001–2003, steps from the Atlantic with private beach access; many units see rocket launches and cruise ships leaving Port Canaveral, per community sources.', '2- and 3-bedroom condos of about 1,700–1,970 sq ft with covered balconies, walk-in pantries, full-size washers and dryers and hurricane shutters; recent sales run from about $393,000 to $579,000, per the MLS.', 'HOA fees run about $600–$750 a month and cover cable, internet, water, hot water and trash, with a 1-month minimum rental (tenant approval on some units), per recent MLS listings and community sources. Up to two small pets are allowed, per community sources.', 'Amenities include bridges to a "Pool Island" with a heated pool, spa and covered picnic area, tennis courts, a gym and sauna, a clubhouse with full kitchen, walking paths, elevators, a private one-car garage for each unit and a car-wash station, per community sources.', 'Nearby: Jetty Park Beach & Pier is less than a mile away and Manatee Sanctuary Park about two miles. Schools: Cape View Elementary and Cocoa Beach Jr./Sr. High.'] },
    { slug: 'solana-on-the-river', name: 'Solana on the River', match: ['Solana On The River'], address: 'Marbella & Sevilla Court', built: 2004, oceanfront: false, near: 'on the Banana River', facts: ['Riverfront 2- and 3-bedroom condos of about 1,920–2,210 sq ft, built in 2004–2005, with recent sales from about $387,000 to $650,000, per the MLS.', 'HOA fees run about $845–$875 a month, with a 3-month minimum rental, per recent MLS listings.'] },
    { slug: 'solana-shores', name: 'Solana Shores', match: ['Solana Shores'], address: '701 Solana Shores Drive', built: 2000, oceanfront: true, facts: ['Oceanfront 3-bedroom condos of about 1,920–2,560 sq ft, built in 2000, with recent sales and listings from about $600,000 to $1.3 million, among the priciest in Cape Canaveral, per the MLS.', 'HOA fees are about $1,025–$1,035 a month, with a 3-month minimum rental (no leasing in the first year on some units), per recent MLS listings.'] },
    { slug: 'the-oaks', name: 'The Oaks', match: ['The Oaks Condo'], address: '201 International Drive', built: 1983, oceanfront: false, near: 'on the Banana River side', facts: ['2-bedroom condos of about 1,050–1,210 sq ft, built in 1983–1989, about half of them on the river side, with recent sales and listings from about $205,000 to $380,000, per the MLS.', 'HOA fees run about $635–$725 a month, with a 3-month minimum rental and, on many units, no leasing in the first year, per recent MLS listings.'] },
  ],
  // Merritt Island (2026-11-08, per Ryan: Google's AI answers for "merritt
  // towers condos for sale" and "river fly in merritt island" cite other
  // agents' building pages). Smaller condo market than the beach towns, so
  // the cutoff is 7+ condo listings/sales in two years, phases combined.
  // Condos under the site's $200K floor (e.g. Sunset Bay, Summer Place)
  // never show, so they're left out. 15 Houston Lane listings have no
  // complex name in the MLS and can't be matched yet.
  // Viera West (2026-11-28, per Ryan's AI push): townhome-style condo
  // communities with their own MLS names; Avalonia, Heritage Isle and Pangea
  // Park have neighborhood pages.
  'viera-west': [
    { slug: 'loren-cove', name: 'Loren Cove', match: ['Loren Cove'], address: 'Loren Cove Drive', built: 2017, oceanfront: false, facts: ['A Viera West community of 3-bedroom townhome-style condos of about 1,460–2,480 sq ft, built from 2017 to 2022, and one of the busiest condo communities in Viera, with 31 sales and listings in the past two years; recent sales run from about $330,000 to $455,000, per the MLS.', 'HOA fees are about $430–$456 a month, per recent MLS listings.'] },
    { slug: 'stadium-villas', name: 'Stadium Villas', match: ['Stadium Villas'], address: 'Sprint & Sedge', built: 2015, oceanfront: false, facts: ['2- to 4-bedroom townhome-style condos of about 1,360–2,920 sq ft, built from 2015 to 2018, with recent sales from about $342,500 to $417,500, per the MLS.', 'HOA fees are about $428 a month, with a 6-month minimum rental on many units, per recent MLS listings.'] },
    { slug: 'stoneridge', name: 'Stoneridge', match: ['Stoneridge Subdivision'], address: 'Tamarac & Spencer', built: 2012, oceanfront: false, facts: ['3-bedroom townhome-style condos of about 1,460–2,070 sq ft, built from 2012 to 2014, with recent sales from about $319,000 to $391,000, per the MLS.', 'HOA fees are about $380–$400 a month, per recent MLS listings.'] },
    { slug: 'three-fountains', name: 'Three Fountains', match: ['Three Fountains'], address: 'Borasco Drive', built: 2005, oceanfront: false, facts: ['A gated community next to The Avenue Viera with 2- and 3-bedroom condos of about 1,160–1,450 sq ft, built in 2005, optional garages, a pool, a fitness center and pet-friendly rules, per community sources; recent sales run from about $199,000 to $285,000, per the MLS.', 'HOA fees are about $780–$845 a month, per recent MLS listings.'] },
  ],
  // Viera (east of I-95) and Suntree (2026-11-28): condo communities with
  // 6–25 MLS sales and listings in two years.
  viera: [
    { slug: 'briarwood-at-suntree', name: 'Briarwood at Suntree', match: ['Briarwood at Suntree'], address: 'Oakwood & Kenwood', built: 1989, oceanfront: false, near: 'in Suntree', facts: ['2- and 3-bedroom condos of about 1,610–2,720 sq ft in Suntree, built from 1989 to 1994, with recent sales from about $260,000 to $470,000, per the MLS.', 'HOA fees are about $525 a month, per recent MLS listings.'] },
    { slug: 'capron-ridge', name: 'Capron Ridge', match: ['Capron Ridge'], address: 'Ballinton & Kinsale', built: 2005, oceanfront: false, facts: ['3- and 4-bedroom townhome-style condos of about 1,780–2,970 sq ft, built from 2005 to 2010, with recent sales from about $370,000 to $522,500, among the higher-priced condo communities in Viera, per the MLS.', 'HOA fees are about $170–$270 a month (billed quarterly), per recent MLS listings.'] },
    { slug: 'carriage-park', name: 'Carriage Park', match: ['Carriage Park Condo'], address: 'Trotter Lane', built: 2000, oceanfront: false, facts: ['2- and 3-bedroom condos of about 1,380–1,810 sq ft, built from 2000 to 2003, with recent sales from about $245,000 to $340,000, per the MLS.', 'HOA fees are about $230–$260 a month, per recent MLS listings.'] },
    { slug: 'courtyards-at-suntree', name: 'The Courtyards at Suntree', match: ['Courtyards'], address: 'Pine Island & Spring Valley', built: 1985, oceanfront: false, near: 'in Suntree', facts: ['2- and 3-bedroom condos of about 1,170–1,850 sq ft in Suntree, built in 1985–1986, and the busiest condo community in the Viera and Suntree area, with 25 sales and listings in the past two years; recent sales run from about $230,000 to $350,000, per the MLS.', 'HOA fees are about $450–$495 a month, with a 1-year minimum rental and no leasing in the first year on many units, per recent MLS listings.'] },
    { slug: 'greens-at-viera-east', name: 'Greens at Viera East', match: ['Greens at Viera E'], address: 'Long Iron Drive', built: 1998, oceanfront: false, facts: ['A gated Viera East community on Long Iron Drive by the golf course, built in 1998, with 2- and 3-bedroom condos of about 920–1,390 sq ft, ground-floor options and a pool, per the MLS and community sources; recent sales run from about $205,000 to $235,000, per the MLS.', 'HOA fees are about $280–$365 a month, with a 6-month minimum rental, per recent MLS listings.'] },
    { slug: 'hampton-park', name: 'Hampton Park', match: ['Hampton Park'], address: 'Hampton Park', built: 2000, oceanfront: false, facts: ['2-bedroom condos built from 2000 to 2003, with recent sales from about $210,000 to $295,000, per the MLS.', 'HOA fees are about $230–$255 a month, among the lowest for condos in Viera, per recent MLS listings.'] },
    { slug: 'lakes-at-viera-east', name: 'Lakes at Viera East', match: ['Lakes at Viera E'], address: 'Sophias Drive & Star Rush Drive', built: 2002, oceanfront: false, facts: ['2- and 3-bedroom condos of about 1,020–1,280 sq ft around lakes in Viera East, built in 2002–2003, with recent sales from about $182,000 to $240,000, one of the most affordable condo communities in Viera, per the MLS.', 'HOA fees are about $395–$495 a month, with a 6-month minimum rental on most units, per recent MLS listings.'] },
    { slug: 'quail-ridge-at-suntree', name: 'Quail Ridge at Suntree', match: ['Quail Ridge at Suntree'], address: 'Ridge Lake', built: 1987, oceanfront: false, near: 'in Suntree', facts: ['2- and 3-bedroom condos of about 1,590–2,580 sq ft in Suntree, built from 1987 to 1989, with recent sales from about $283,500 to $365,000, per the MLS.', 'HOA fees are about $475–$510 a month, per recent MLS listings.'] },
    { slug: 'river-way', name: 'River Way', match: ['River Way Condo'], address: 'Plover Lane', built: 1982, oceanfront: false, facts: ['2- and 3-bedroom condos of about 1,000–1,780 sq ft, built from 1982 to 2000, with recent sales from about $200,000 to $342,500, per the MLS.', 'HOA fees are about $550 a month, with a 1-year minimum rental, per recent MLS listings.'] },
    { slug: 'villas-at-suntree', name: 'Villas at Suntree', match: ['Villas at Suntree'], address: 'Villa Drive', built: 1989, oceanfront: false, near: 'in Suntree', facts: ['2- and 3-bedroom condos of about 1,170–2,080 sq ft in Suntree, built from 1989 to 1991, with recent sales from about $250,000 to $337,200, per the MLS.', 'HOA fees are about $390 a month, and listings show that rentals are not allowed, per recent MLS listings.'] },
  ],
  // Melbourne (2026-11-28): Paramount Riverfront, which Google's AI Overview
  // lists among Merritt Island condos; it is on US-1 in Melbourne.
  melbourne: [
    { slug: 'paramount-riverfront', name: 'Paramount Riverfront', match: ['Paramount Riverfront'], address: '1435 & 1465 S Harbor City Blvd', built: 2021, oceanfront: false, near: 'on the Indian River', facts: ['A newer luxury riverfront community of 68 condos in two mid-rise buildings on South Harbor City Blvd (US-1) in Melbourne, completed in 2021–2022, with views across the Indian River, per the MLS and community sources.', '3- and 4-bedroom, 3- to 4-bath condos of about 2,080–2,350 sq ft, plus top-floor residences of about 4,400–4,900 sq ft; recent sales run from about $715,000 to $1.75 million, with listings from about $650,000 to $1.88 million, per the MLS.', 'HOA fees are about $1,160 a month for most units (about $1,600–$1,700 for the largest), with a 3-month minimum rental (tenant approval on some units), per recent MLS listings.', 'Amenities include a fitness center and elevators, per community sources.'] },
  ],
  'merritt-island': [
    // 2026-11-28 (per Ryan's AI push): Banyan Cove (new townhome condos the
    // MLS mostly lists without a subdivision name, matched by a map box around
    // Houston Lane), Costa Norte and Island Cove.
    { slug: 'banyan-cove', name: 'Banyan Cove', box: { latMin: 28.3848, latMax: 28.3858, lngMin: -80.7113, lngMax: -80.7089 }, address: 'Houston Lane', built: 2026, newConstruction: true, oceanfront: false, facts: ['New-construction 3-bedroom townhome-style condos of about 1,460 sq ft on Houston Lane, completed in 2026 with more under way; the first sales closed from about $245,000 to $284,000, one of the most affordable new-construction options on Merritt Island, per the MLS.', 'HOA fees are about $118 a month, per recent MLS listings.'] },
    { slug: 'costa-norte', name: 'Costa Norte', match: ['Costa Norte'], address: 'Sykes Creek Drive', built: 1987, oceanfront: false, near: 'on Sykes Creek', facts: ['3-bedroom townhome-style condos of about 2,250–3,240 sq ft on Sykes Creek Drive, built from 1987 to 2006, many on the water, with recent sales and listings from about $275,000 to $789,000, per the MLS.', 'HOA fees are about $260 a month, with a 6-month minimum rental on most units (tenant approval on some), per recent MLS listings.'] },
    { slug: 'island-village', name: 'Island Village', match: ['Island Village Condo'], address: '2135 N Courtenay Pkwy', built: 1974, oceanfront: false, facts: ['A 55+ condo community on North Courtenay Parkway (per community sources), built in 1974, with 1- and 2-bedroom condos; recent sales and listings shown here run from about $200,000 to $225,000, per the MLS (the site shows condos priced at $200,000 and up).'] },
    { slug: 'island-cove', name: 'Island Cove', match: ['Island Cove Condo'], address: '343 N Tropical Trail', built: 1990, oceanfront: false, near: 'on the Indian River', facts: ['Riverfront 2- and 3-bedroom condos of about 1,420–1,860 sq ft on North Tropical Trail, built in 1990, with recent sales and listings from about $305,000 to $470,000, per the MLS.', 'HOA fees run about $785–$1,025 a month, per recent MLS listings.'] },
    { slug: 'cape-crossing', name: 'Cape Crossing', aka: 'Cape Crossing Resort & Marina', match: ['Cape Crossing'], address: 'Ivory Coral Lane & Cutlass Point Lane', built: 2017, oceanfront: false, near: 'on the Canaveral Barge Canal', facts: ['Part of Cape Crossing Resort & Marina, a waterfront resort and condo/townhome community on the Canaveral Barge Canal and the Indian River Lagoon, close to the Port Canaveral cruise terminals, Kennedy Space Center, Cocoa Beach and Jetty Park; residents often see dolphins, manatees and rocket launches, per community sources.', 'Multi-story townhomes on Cutlass Point Lane (built 2017–2018, 3 bedrooms, about 1,480–1,900 sq ft) and an elevator condo building at 202 Ivory Coral Lane (built 2020, 3 and 4 bedrooms, about 1,270–1,900 sq ft); recent sales run from about $372,000 to $705,000, with listings from about $370,000 to $998,000, per the MLS.', 'HOA fees run about $700–$770 a month for the townhomes and about $1,050–$1,170 for the condos, and most listings show no minimum rental, so units can be used as vacation rentals, per recent MLS listings.', 'The resort has a full-service marina with 135 slips and boat, kayak and paddleboard rentals, Dolphins Waterfront Bar & Grill on the canal, an outdoor pool, a hot tub, a sauna and a fitness center; the condo building has elevators, while the townhomes are multi-story, per community sources.'] },
    { slug: 'harbor-del-rio', name: 'Harbor Del Rio', match: ['Harbor Del Rio'], address: null, built: 2004, oceanfront: false, near: 'on Del Rio Way' },
    { slug: 'island-pointe', name: 'Island Pointe', match: ['Island Pointe'], address: 'Sail Lane & Starboard Lane', built: 2004, oceanfront: false, near: 'on the Indian River', facts: ['A guard-gated waterfront condo community on the Indian River, with 185 residences in four 10-story buildings on Sail Lane and Starboard Lane, built from 2004 to 2006, per community sources.', '3- and 4-bedroom condos of about 2,050–3,410 sq ft with waterfront balconies and private enclosed garage parking; recent sales run from about $310,000 to $600,000, with a median of about $400,000, per the MLS.', 'HOA fees are about $1,215–$1,240 a month, with a 3-month minimum rental on most units (tenant approval on some), per recent MLS listings. Up to 2 pets (35 lbs max, with breed limits) are allowed, per community sources.', 'Amenities include guard-gated entry, heated pools with spas, a fitness center, a sauna, a recreation and meeting room and tennis and basketball courts, per community sources.'] },
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
      facts: [
        'A gated, 224-unit waterfront condo community on Sykes Creek, in three 8-story concrete buildings built in phases from 1985 to 1991, with views of Sykes Creek and Newfound Harbor; the busiest condo community on Merritt Island, with 28 sales and listings in the past two years, per the MLS and the association.',
        '1- to 3-bedroom condos of about 980–2,180 sq ft (most 2-bedroom), with recent sales from about $185,000 to $450,000 and a median of about $313,000, per the MLS.',
        'HOA fees run about $605–$790 a month and cover water, sewer, trash and recycling, cable, high-speed internet, pest control, insurance and common-area upkeep, with a 1-year minimum rental (tenant approval on many units), per recent MLS listings and the association. Dogs and cats are allowed within breed, count and size limits, per community sources.',
        'Amenities include two heated pools, a hot tub, saunas, tennis, pickleball and shuffleboard courts, a fishing pier and boardwalk, picnic and BBQ areas, a library and game room, two clubhouses with kitchens, gated entry with 24/7 security and fob access, deeded parking for one car per unit, visitor parking and a car-wash station, per the association and community sources.',
      ],
    },
    {
      slug: 'river-fly-in',
      name: 'River Fly-In',
      match: ['River Fly'],
      address: '735 Pilot Lane',
      built: 2024,
      oceanfront: false,
      near: 'next to Merritt Island Airport',
      facts: [
        'A waterfront fly-in condo community on Pilot Lane next to Merritt Island Airport (3,601-ft runway, with fuel, an FBO and a flight school), on Sykes Creek and the Banana River beside a nature sanctuary; balconies overlook rocket launches, the water and the runway, per community sources.',
        '2- and 3-bedroom residences of about 1,330–2,180 sq ft in named floor plans (Rotex, Continental, Lycoming and Rolls Royce) with full kitchens, private balconies and soundproof construction; recent sales run from about $607,000 to $765,000, with listings from about $550,000 to $2 million, per the MLS and community sources.',
        'HOA fees are about $830–$850 a month, and many listings allow rentals as short as 3 days, so units are marketed both for full-time ownership and short-term rental, per recent MLS listings.',
        'Amenities include private boardwalks and docks, a fire pit, gated 24-hour security, an outdoor pool and hot tub, a sauna, a hydrotherapy pod, a gym, a movie theater and a parking garage with EV charging, per community sources.',
      ],
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

// Viera and Viera West aren't MLS cities (2026-11-28): their listings are
// found by the same map area / MLS area as the town pages.
function buildingArea(citySlug) {
  return citySlug === 'viera' || citySlug === 'viera-west' ? cityListingsQueryParams(citySlug) : { city: citySlug };
}

export function condoBuildingFilter(citySlug, b) {
  // `box` (2026-11-28): new projects the MLS lists with no subdivision name
  // are matched by a map box around their street instead. Such entries have
  // no `match`, so the city comparison table leaves them out.
  if (b.box) return { ...buildingArea(citySlug), propertyType: 'Condo', ...b.box };
  return { ...buildingArea(citySlug), propertyType: 'Condo', subdivisionLike: b.match.join(',') };
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
  const filter = { ...buildingArea(citySlug), propertyType: 'Condo', subdivisionLike: buildings.flatMap((b) => b.match).join(',') };
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
