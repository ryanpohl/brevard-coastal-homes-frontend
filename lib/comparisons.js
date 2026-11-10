import { ARIPEKA_LISTINGS_FILTER, LANSING_ISLAND_LISTINGS_FILTER, TORTOISE_ISLAND_SUBDIVISION_NAMES, cityListingsQueryParams } from '@/lib/constants';

// "X vs. Y" comparison guides (2026-10-29, per Ryan — from
// susanbreitenbach.com's "Wainscott vs. Water Mill"-style pages). People
// searching these are choosing where to buy, so each guide answers the
// question plainly and ends with "Call or text Ryan". Facts come from the
// site's own community and Area Guide content (COMMUNITY_SEO,
// NEIGHBORHOOD_AREA_GUIDE_CONTENT, CITY_AREA_GUIDE_CONTENT in
// lib/constants.js); prices are live, computed on the page from the MLS
// (`stats` filters), so nothing here goes stale. Rendered by
// app/compare/[slug]/page.js and linked from both places' pages.

export const COMPARISONS = {
  // The four South Brevard beach towns side by side (2026-11-10, per Ryan:
  // out-of-state buyers can't tell them apart). Uses `places` instead of a/b.
  'brevard-beach-towns-compared': {
    title: 'Satellite Beach vs. Indian Harbour Beach vs. Indialantic vs. Melbourne Beach, FL',
    description:
      'Compare Brevard’s four South Beaches towns: Satellite Beach, Indian Harbour Beach, Indialantic and Melbourne Beach. Live home prices, schools, water access and the feel of each, with local advice from Ryan Pohl.',
    h1: 'Satellite Beach vs. Indian Harbour Beach vs. Indialantic vs. Melbourne Beach',
    subtitle:
      'Four beach towns in a row on the same barrier island, north to south. They look alike on a map but feel different to live in. Here’s how they compare for buyers.',
    places: [
      {
        name: 'Satellite Beach',
        href: '/satellite-beach',
        homesHref: '/satellite-beach/homes-for-sale',
        stats: { homes: { ...cityListingsQueryParams('satellite-beach'), propertyType: 'Home' }, condos: { ...cityListingsQueryParams('satellite-beach'), propertyType: 'Condo' } },
        choose: [
          'You want an established, family-friendly beach city with good schools nearby',
          'You want a canal-front home with Banana River boating access',
          'You’d like a guard-gated waterfront community like Tortoise Island',
          'You want to be close to Patrick Space Force Base',
        ],
      },
      {
        name: 'Indian Harbour Beach',
        href: '/indian-harbour-beach',
        homesHref: '/indian-harbour-beach/homes-for-sale',
        stats: { homes: { ...cityListingsQueryParams('indian-harbour-beach'), propertyType: 'Home' }, condos: { ...cityListingsQueryParams('indian-harbour-beach'), propertyType: 'Condo' } },
        choose: [
          'You want a quiet, residential town between Satellite Beach and Indialantic',
          'You want Banana River waterfront or guard-gated Lansing Island',
          'You want quick access to the mainland over the Eau Gallie Causeway',
          'You want beachside living at prices that are often below the oceanfront towns',
        ],
      },
      {
        name: 'Indialantic',
        href: '/indialantic',
        homesHref: '/indialantic/homes-for-sale',
        stats: { homes: { ...cityListingsQueryParams('indialantic'), propertyType: 'Home' }, condos: { ...cityListingsQueryParams('indialantic'), propertyType: 'Condo' } },
        choose: [
          'You want to walk or bike to the beach, shops and restaurants',
          'You want the shortest drive to downtown Melbourne and the airport',
          'You want a high-rise oceanfront condo',
          'You like having restaurants, hotels and conveniences nearby',
        ],
      },
      {
        name: 'Melbourne Beach',
        href: '/melbourne-beach',
        homesHref: '/melbourne-beach/homes-for-sale',
        stats: { homes: { ...cityListingsQueryParams('melbourne-beach'), propertyType: 'Home' }, condos: { ...cityListingsQueryParams('melbourne-beach'), propertyType: 'Condo' } },
        choose: [
          'You want the quietest, least touristy beach, with houses instead of high-rises',
          'You want ocean-to-river property, or a riverfront home with a dock',
          'You’d like a gated community like Aquarina or Harbor Island Beach Club',
          'You’d rather have local restaurants than chains',
        ],
      },
    ],
    shortAnswer:
      'From north to south: Satellite Beach is the largest, an established family town with canals on the Banana River; Indian Harbour Beach is smaller and quieter, also on the Banana River, and home to guard-gated Lansing Island; Indialantic is the busiest and most walkable, right at the Melbourne Causeway, with high-rise condos on the beach; and Melbourne Beach is the quietest and least touristy, with houses along the beach and gated ocean-to-river communities to the south.',
    facts: [
      ['Feel', 'Established, family-friendly beach city', 'Small, quiet and residential', 'Busiest and most walkable', 'Quietest and least touristy'],
      ['River side', 'Banana River and its canals', 'Banana River', 'Indian River Lagoon', 'Indian River Lagoon'],
      ['Closest causeway', 'Pineda (north) or Eau Gallie', 'Eau Gallie', 'Melbourne (US-192)', 'Melbourne (US-192)'],
      ['On the beach', 'Mostly low-rise condos and homes', 'Condos and homes', 'High-rise condos and hotels', 'Mostly houses'],
      ['Elementary school', 'Sea Park, Surfside or Holland', 'Ocean Breeze', 'Indialantic Elementary', 'Gemini (most homes)'],
      ['Middle / high school', 'DeLaura Middle, Satellite High', 'Hoover or DeLaura Middle, Satellite High', 'Hoover Middle, Melbourne High', 'Hoover Middle, Melbourne High'],
      ['Gated communities', 'Tortoise Island, Montecito', 'Lansing Island', 'Few', 'Aquarina, Harbor Island Beach Club, Indian Landing, Turtle Bay'],
      ['HOA on homes', 'Usually none or small, except gated communities', 'Varies widely by neighborhood', 'Usually none or small', 'Usually none, except gated communities'],
    ],
    sections: [
      {
        heading: 'Where they are',
        text: [
          'All four towns sit on the same barrier island in South Brevard County, between the Atlantic Ocean and the river, a few minutes apart. Satellite Beach is furthest north, just south of Patrick Space Force Base. Indian Harbour Beach comes next, then Indialantic at the Melbourne Causeway, and Melbourne Beach starts just south of Indialantic, with Melbourne Beach addresses running many miles south along A1A toward Sebastian Inlet.',
          'The river side is the biggest practical difference. Satellite Beach and Indian Harbour Beach face the Banana River, and Satellite Beach in particular has canal neighborhoods where many homes have docks. Indialantic and Melbourne Beach face the Indian River Lagoon, toward mainland Melbourne.',
        ],
      },
      {
        heading: 'Homes and prices',
        text: [
          'Satellite Beach and Indian Harbour Beach are mostly established single-family neighborhoods from the 1960s to the 1990s, plus canal-front homes and the guard-gated waterfront communities of Tortoise Island and Lansing Island. Indialantic has older cottages and mid-century homes on smaller lots and a good number of beachside condos. Melbourne Beach has the widest range, from beach cottages near town to large oceanfront and ocean-to-river estates further south.',
          'The live numbers at the top of this page show where each market is today. Prices move with the water: oceanfront, riverfront and canal-front homes sell for much more than homes a few streets in, in every one of these towns.',
        ],
      },
      {
        heading: 'Schools',
        text: [
          'The towns split between two high schools. Satellite Beach and Indian Harbour Beach are zoned for Satellite High School; Indialantic and Melbourne Beach for Melbourne High School. Middle and elementary schools vary by address, as the table above shows. Zoning can change, so confirm it with Brevard Public Schools for any home you’re serious about.',
        ],
      },
      {
        heading: 'Flood zones and insurance',
        text: [
          'All four are barrier island towns, so many homes sit in FEMA coastal flood zones (AE or VE), which usually means a lender requires flood insurance. Zones vary parcel by parcel, even within a neighborhood, so Ryan can look up the zone for any home you’re considering.',
        ],
      },
    ],
    faq: [
      {
        q: 'Which South Brevard beach town is quietest?',
        a: 'Melbourne Beach is the quietest and least touristy, especially south of town toward Sebastian Inlet. Indian Harbour Beach is also quiet and mostly residential. Indialantic is the busiest, with high-rise condos and hotels near the Melbourne Causeway.',
      },
      {
        q: 'Which beach town is best for boaters?',
        a: 'Satellite Beach has the most canal-front homes with docks and Banana River access, and Tortoise Island and Lansing Island offer guard-gated waterfront living. Melbourne Beach has riverfront and ocean-to-river homes on the Indian River Lagoon.',
      },
      {
        q: 'Do these beach towns go to the same high school?',
        a: 'No. Satellite Beach and Indian Harbour Beach are zoned for Satellite High School, and Indialantic and Melbourne Beach for Melbourne High School. Confirm current zoning with Brevard Public Schools for a specific address.',
      },
      {
        q: 'Can Ryan show me homes in more than one of these towns?',
        a: 'Yes. Ryan Pohl works with buyers in all four towns and can show you homes in several of them on the same day. Call or text 321-350-7661.',
      },
    ],
  },
  'melbourne-beach-vs-indialantic': {
    title: 'Melbourne Beach vs. Indialantic, FL: Which Beach Town Is Right for You?',
    description:
      'Melbourne Beach or Indialantic? Compare home prices, condos, schools, HOA fees and the feel of each beach town, with live MLS numbers and local advice from Ryan Pohl.',
    h1: 'Melbourne Beach vs. Indialantic',
    subtitle: 'Two beach towns on the same barrier island, a few minutes apart: one quiet and local, one busier. Here’s how they differ for buyers.',
    a: {
      name: 'Melbourne Beach',
      href: '/melbourne-beach',
      homesHref: '/melbourne-beach/homes-for-sale',
      stats: { homes: { ...cityListingsQueryParams('melbourne-beach'), propertyType: 'Home' }, condos: { ...cityListingsQueryParams('melbourne-beach'), propertyType: 'Condo' } },
    },
    b: {
      name: 'Indialantic',
      href: '/indialantic',
      homesHref: '/indialantic/homes-for-sale',
      stats: { homes: { ...cityListingsQueryParams('indialantic'), propertyType: 'Home' }, condos: { ...cityListingsQueryParams('indialantic'), propertyType: 'Condo' } },
    },
    shortAnswer:
      'Melbourne Beach is the quieter, less touristy town: no chain or fast-food restaurants, mostly houses along the beach, and small, locally owned places to stay. Indialantic is busier and closer to everything, with beachfront high-rise condos, large chain hotels, and the Melbourne Causeway to the mainland a few minutes away.',
    facts: [
      ['Feel', 'Quiet, less touristy small beach town; quieter still heading south', 'Busier, closer to the mainland and its shops'],
      ['On the beach', 'Mostly houses', 'High-rise condos and large chain hotels'],
      ['Restaurants and hotels', 'Local restaurants (no chain or fast food); small, locally owned hotels', 'Chain restaurants and hotels nearby'],
      ['Town center', 'Ocean Avenue and Ryckman Park on the river', 'Fifth Avenue and Nance Park on the beach'],
      ['Housing mix', 'Mostly single-family, many on ocean or river lots; fewer condos', 'Older cottages and mid-century homes, plus more condos'],
      ['Size', 'Town is 1.4 sq mi, but Melbourne Beach addresses run south to Sebastian Inlet', 'Just over 1 sq mi between the river and the ocean'],
      ['Elementary school', 'Gemini Elementary (most homes)', 'Indialantic Elementary'],
      ['Middle / high school', 'Hoover Middle, Melbourne High', 'Hoover Middle, Melbourne High'],
      ['HOA on homes', 'Usually none, except in gated communities', 'Usually none or a small annual fee'],
      ['Gated communities', 'Aquarina, Harbor Island Beach Club, Indian Landing, Turtle Bay', 'Few; mostly open neighborhoods'],
    ],
    sections: [
      {
        heading: 'Location and feel',
        text: [
          'Both towns sit on the same barrier island between the Indian River Lagoon and the Atlantic, but they feel different. Indialantic is at the north end, where the Melbourne Causeway (US-192) crosses to the mainland, so downtown Melbourne, shopping and the airport are close. Its walkable core runs along Fifth Avenue to Nance Park on the beach, with cafes, casual restaurants and surf shops. Its beachfront has high-rise condos and large chain hotels, and it draws more visitors.',
          'Melbourne Beach is a lot less touristy. The town doesn’t allow chain or fast-food restaurants, so you’ll find local restaurants and shops instead, mostly around Ocean Avenue and riverside Ryckman Park, and its hotels are small and locally owned. Along the ocean it’s mostly houses rather than high-rises, which keeps the beach quiet.',
          'The town of Melbourne Beach starts just south of Indialantic. It’s small, but Melbourne Beach mailing addresses run many miles south along A1A toward Sebastian Inlet. That southern stretch is quieter and more spread out, with ocean-to-river neighborhoods, sea turtle nesting beaches and gated communities like Aquarina and Harbor Island Beach Club.',
        ],
      },
      {
        heading: 'Homes and prices',
        text: [
          'Indialantic’s homes are mostly older, established single-family houses on smaller lots, many dating from the 1950s to the 1970s, plus a good number of beachside condos. Melbourne Beach has a wider range: classic beach cottages near town, newer custom homes further south, riverfront and canalfront homes with docks, and full-amenity oceanfront condos.',
          'The live numbers above show where prices are today. As a rule, Indialantic’s smaller footprint means fewer homes for sale at any one time, so good ones can go quickly.',
        ],
      },
      {
        heading: 'Schools',
        text: [
          'Both towns feed into Hoover Middle School and Melbourne High School. The difference is elementary school: Indialantic is zoned for Indialantic Elementary, and most of Melbourne Beach for Gemini Elementary. Zoning can change and varies by address, so confirm it with Brevard Public Schools for any home you’re serious about.',
        ],
      },
      {
        heading: 'HOA fees and flood insurance',
        text: [
          'Most single-family homes in both towns have no HOA, or a small voluntary fee. In Melbourne Beach, the gated communities are the exception, with real association fees that cover the gate, amenities and common areas. Condos in both towns carry monthly or quarterly fees that vary a lot by building.',
          'Both towns are on a barrier island, so many homes sit in FEMA coastal flood zones, which usually means your lender will require flood insurance. Zones vary parcel by parcel, so Ryan can look up the zone for any home you’re considering.',
        ],
      },
    ],
    chooseA: [
      'You want a quieter, less touristy beach with houses, not high-rises',
      'You’d rather have local restaurants than chains',
      'You’d like a gated community with a pool, clubhouse or marina',
      'You want riverfront or canalfront with a dock, or ocean-to-river access',
    ],
    chooseB: [
      'You want to walk or bike to the beach, shops and restaurants',
      'You want the shortest drive to Melbourne and the airport',
      'You want a high-rise condo with ocean views',
      'You like having hotels, chain restaurants and conveniences nearby',
    ],
    faq: [
      {
        q: 'Is Indialantic or Melbourne Beach more expensive?',
        a: 'It depends on the home. Indialantic has more older, smaller single-family homes and many beachside condos, while Melbourne Beach includes large riverfront and oceanfront estates further south. The live median prices on this page are the best guide to where each market is right now.',
      },
      {
        q: 'Do Indialantic and Melbourne Beach go to the same schools?',
        a: 'Mostly. Both are zoned for Hoover Middle School and Melbourne High School. Elementary school differs: Indialantic Elementary for Indialantic, and Gemini Elementary for most of Melbourne Beach. Always confirm current zoning with Brevard Public Schools for a specific address.',
      },
      {
        q: 'Which is quieter, Melbourne Beach or Indialantic?',
        a: 'Melbourne Beach is the quieter of the two. It doesn’t allow chain or fast-food restaurants, its hotels are small and locally owned, and its beachfront is mostly houses, especially south of town toward Sebastian Inlet. Indialantic has high-rise condos and large chain hotels on the beach and is closer to the causeway, so it sees more visitors.',
      },
      {
        q: 'Can Ryan show me homes in both towns?',
        a: 'Yes. Ryan Pohl works with buyers in Melbourne Beach and Indialantic and can show you homes in both on the same day. Call or text 321-350-7661.',
      },
    ],
  },

  'adelaide-vs-aripeka': {
    title: 'Adelaide vs. Aripeka in Viera, FL: Comparing Two Gated Custom-Home Communities',
    description:
      'Adelaide or Aripeka? Compare prices, builders, lot sizes, HOA fees, schools and amenities in Viera’s two gated custom-home communities, with live MLS numbers.',
    h1: 'Adelaide vs. Aripeka',
    subtitle: 'Viera’s two gated, custom-home communities, compared side by side for buyers.',
    a: {
      name: 'Adelaide',
      href: '/neighborhoods/adelaide',
      homesHref: '/neighborhoods/adelaide',
      stats: { homes: { neighborhood: 'adelaide', propertyType: 'Home' } },
    },
    b: {
      name: 'Aripeka',
      href: '/neighborhoods/aripeka',
      homesHref: '/neighborhoods/aripeka',
      stats: { homes: { ...ARIPEKA_LISTINGS_FILTER, propertyType: 'Home' }, lots: { ...ARIPEKA_LISTINGS_FILTER, propertyType: 'Land' } },
    },
    shortAnswer:
      'Adelaide has the higher price point (homes usually $1.8 million and up) and mostly larger lots: half-acre to acre-plus homesites around a 120-acre lake, plus some smaller lots near the front, a staffed guard gate and three luxury builders. Aripeka is a step down in price (homes start around $1.25 million, including the lot), with far more mature trees and vegetation, four builders, smaller homesites and vacant lots you can buy on the MLS to build your own.',
    facts: [
      ['Location', 'Northern Viera, west of I-95 (Rockledge address)', 'Southern Viera (Melbourne 32940 address)'],
      ['Size', '460 acres, more than a third water or preserve', 'About 400 acres, about 250 wooded homesites'],
      ['Price point', 'Higher: homes usually $1.8 million and up', 'Lower: homes start around $1.25 million, including the lot'],
      ['Homesites', 'Mostly larger: about ½ acre to over an acre, plus smaller lots (about ¼ acre) near the front', 'About ¼ to ½ acre'],
      ['Trees and setting', 'Open lake and preserve views', 'Wooded, with mature oaks, palms and pines'],
      ['Builders', 'AR Homes, Christopher Burton, Elan Builders', 'CDS Builders, Joyal Homes, LifeStyle Homes, Stanley Homes'],
      ['Home sizes', 'About 3,550–5,500 sq ft', 'About 2,400–5,000+ sq ft'],
      ['Gate', 'Staffed guard gate', 'Gated'],
      ['HOA', 'About $1,225 per quarter (~$4,900/yr)', 'About $1,500 per year'],
      ['Schools', 'Manatee Elementary (most homes), Viera High', 'Viera Elementary, Viera Middle, Viera High'],
      ['Buying a lot', 'Homesites sold through the builders, not the MLS', 'Vacant homesites come up on the MLS'],
    ],
    sections: [
      {
        heading: 'Setting and feel',
        text: [
          'Adelaide is built around water, on larger, more open homesites. Lake Adelaide and a 25-acre preserve take up more than a third of the community, so most homesites have a lake or preserve view, and residents share a 120-acre lake with a dock and boardwalk for kayaking, paddleboarding and fishing.',
          'Aripeka was built on former hunting land and laid out around its mature oaks, palms and pines rather than clearing them. It has far more mature trees and vegetation than Adelaide and a wooded, old-Florida feel, with nature trails, pocket parks, lakes and ponds, and a family clubhouse in a park built around the community’s oldest live oaks.',
        ],
      },
      {
        heading: 'Builders and homes',
        text: [
          'Both are custom-build communities, with no production tract homes. Adelaide has three builders: AR Homes (Rosewood Homes), Christopher Burton Luxury Homes and Elan Builders, with homes of about 3,550 to 5,500 square feet. Aripeka has four: CDS Builders, Joyal Homes, LifeStyle Homes and Stanley Homes, with plans from about 2,400 to over 5,000 square feet.',
          'All four Aripeka builders have model homes open, and two Adelaide builders do. Contact Ryan before you visit a model: if you register at a builder’s model without an agent, the builder may not let one represent you later.',
        ],
      },
      {
        heading: 'Prices and lots',
        text: [
          'The live numbers above show current listings and the past year’s sales. Adelaide has the clearly higher price point: its homes usually run $1.8 million and up, reflecting its bigger homesites, lake setting and staffed gate. Aripeka homes start around $1.25 million, including the lot.',
          'Lots work differently in each. Adelaide homesites are mostly sold through the builders’ own sales teams rather than listed on the MLS. In Aripeka, vacant homesites do come up on the MLS, so you can buy a lot and choose a builder. Ryan can help with either path, including builder lots that aren’t advertised.',
        ],
      },
      {
        heading: 'Schools and HOA',
        text: [
          'Most Adelaide homes are zoned for Manatee Elementary and Viera High School, with middle school split by address. Aripeka is zoned for Viera Elementary, Viera Middle and Viera High, with Viera Charter School (K–8) nearby. Confirm zoning with Brevard Public Schools for a specific address.',
          'Adelaide’s HOA runs about $1,225 per quarter, covering the staffed gate, lake and amenities. Aripeka’s is about $1,500 per year. Always check the exact fee on the listing you’re considering.',
        ],
      },
    ],
    chooseA: [
      'You want a larger homesite with a lake or preserve view',
      'A staffed guard gate matters to you',
      'You’ll use the lake for kayaking, paddleboarding or fishing',
      'Your budget is in the upper range of Viera’s market',
    ],
    chooseB: [
      'You love mature trees and a wooded, natural setting',
      'You want to compare four builders’ model homes',
      'You’d like to buy a lot on the MLS and choose your builder',
      'You want lower HOA fees and Viera’s schools close by',
    ],
    faq: [
      {
        q: 'Which is more expensive, Adelaide or Aripeka?',
        a: 'Adelaide has the higher price point: homes there usually run $1.8 million and up, while Aripeka homes start around $1.25 million, including the lot. Most Adelaide homesites are larger, many are on the lake or preserve, and it has a staffed guard gate. Aripeka has much more mature vegetation and trees. The live median prices on this page show where each community is right now.',
      },
      {
        q: 'Can I buy a lot in Adelaide or Aripeka?',
        a: 'In Aripeka, vacant homesites come up on the MLS, and you can then choose one of its four builders. In Adelaide, homesites are mostly sold through the builders’ own sales teams. Ryan can check current availability in both, including builder lots that aren’t listed.',
      },
      {
        q: 'Are Adelaide and Aripeka in Viera?',
        a: 'Yes, both are Viera communities. Adelaide is in northern Viera west of I-95 and has Rockledge mailing addresses. Aripeka is in southern Viera and has Melbourne 32940 mailing addresses, so MLS listings show those cities.',
      },
      {
        q: 'Should I bring an agent to the model homes?',
        a: 'Yes. If you register at a builder’s model home without an agent, the builder may not allow one to represent you later. Ryan can go with you to the Adelaide and Aripeka models, at no cost to you. Call or text 321-350-7661.',
      },
    ],
  },

  // Tortoise Island vs. Lansing Island (2026-11-06, per Ryan: improve how
  // AI answers cover both). Facts from both communities' COMMUNITY_SEO,
  // area guide and FAQ content; prices and HOA figures from the MLS.
  'tortoise-island-vs-lansing-island': {
    title: 'Tortoise Island vs. Lansing Island: Comparing Two Guard-Gated Waterfront Communities',
    description:
      'Tortoise Island or Lansing Island? Compare prices, lot sizes, HOA fees, water access, amenities and schools in two guard-gated waterfront communities near Satellite Beach, with live MLS numbers.',
    h1: 'Tortoise Island vs. Lansing Island',
    subtitle: 'Two guard-gated, waterfront communities of single-family homes a few minutes apart, compared side by side for buyers.',
    a: {
      name: 'Tortoise Island',
      href: '/neighborhoods/tortoise-island',
      homesHref: '/neighborhoods/tortoise-island',
      stats: { homes: { subdivision: TORTOISE_ISLAND_SUBDIVISION_NAMES.join(','), propertyType: 'Home' } },
    },
    b: {
      name: 'Lansing Island',
      href: '/neighborhoods/lansing-island',
      homesHref: '/neighborhoods/lansing-island',
      stats: { homes: { ...LANSING_ISLAND_LISTINGS_FILTER, propertyType: 'Home' } },
    },
    shortAnswer:
      'Lansing Island is the more exclusive and expensive of the two: a private island reached by a covered drawbridge, with larger estate homes on three-quarter-acre to acre lots, and listings that rarely come up. Tortoise Island is larger, with about 340 homes, so more come up for sale, at a lower price point, on lots of about a third of an acre to nearly an acre. Both are 24-hour guard-gated, all single-family, and almost all on the water with private docks.',
    facts: [
      ['Location', 'South Patrick Shores (Satellite Beach address), near the Pineda Causeway', 'Indian Harbour Beach (Satellite Beach address on the MLS)'],
      ['Entry', 'Single 24-hour guard gate off Tortoise Drive', 'Causeway and covered drawbridge past a 24-hour manned gatehouse'],
      ['Size', 'About 340 homes on 357 homesites, about 210 acres', 'Smaller; listings are rare'],
      ['Homes', 'All single-family, about 2,300–6,700 sq ft, built mostly late 1970s–early 2000s', 'All single-family, about 3,000 to over 10,000 sq ft'],
      ['Lots', 'About ⅓ acre to nearly 1 acre', 'About ¾ acre to nearly 1 acre, some approaching 2 acres'],
      ['Water', 'Deep-water canals and the Banana/Indian River; most homes have private docks', 'Banana River and the Grand Canal; nearly every homesite on the water, about a mile from the Atlantic'],
      ['Amenities', 'Recreation center: pool, fitness center, tennis and pickleball courts, clubhouse, free boat ramp', 'Clubhouse, pool, fitness center, tennis, pickleball and basketball courts, playground'],
      ['HOA (MLS)', 'Billed monthly, most commonly about $380 a month', 'About $544–$657 a month in recent sales'],
      ['Schools', 'Sea Park Elementary, DeLaura Middle, Satellite High', 'Most often cited: Ocean Breeze Elementary, DeLaura Middle, Satellite High'],
    ],
    sections: [
      {
        heading: 'Getting in and the feel',
        text: [
          'Tortoise Island is entered through a single 24-hour guard gate off Tortoise Drive, near the Pineda Causeway. It’s an established neighborhood of about 340 homes on roughly 210 acres, with walking paths and native habitat kept for the gopher tortoises it’s named for.',
          'Lansing Island is a private island: you cross a single causeway and covered drawbridge past a manned gatehouse. It’s smaller and more secluded, fronting the Indian River Lagoon with the Banana River on one side and the Grand Canal on the other, about a mile from the Atlantic.',
        ],
      },
      {
        heading: 'Homes and lots',
        text: [
          'Both communities are all single-family homes, with no condos or vacant lots. Tortoise Island homes were built mostly from the late 1970s to the early 2000s and run about 2,300 to 6,700 square feet on lots of roughly a third of an acre to nearly an acre.',
          'Lansing Island has the larger estates: about 3,000 to over 10,000 square feet on homesites of three-quarters of an acre to nearly a full acre, with some parcels approaching two acres. The live numbers above show what each community’s homes are listed and selling for now.',
        ],
      },
      {
        heading: 'Boating',
        text: [
          'Both are built for boaters. Most Tortoise Island homes sit on deep-water canals or the river with private docks and access to the Banana River, Indian River Lagoon and Intracoastal Waterway, and residents also get a free community boat ramp. On Lansing Island, nearly every homesite has direct water access on the Banana River or the Grand Canal.',
        ],
      },
      {
        heading: 'HOA, amenities and schools',
        text: [
          'Tortoise Island’s HOA is billed monthly and most commonly runs about $380 a month, covering the guard gate and the recreation center with its pool, fitness center, tennis and pickleball courts and clubhouse. Lansing Island’s runs about $544 to $657 a month in recent MLS sales, covering the gatehouse and drawbridge, clubhouse, pool, fitness center, courts and playground. Always confirm the current fee on the listing.',
          'Tortoise Island homes are zoned for Sea Park Elementary, DeLaura Middle and Satellite High School. For Lansing Island, area sources most often cite Ocean Breeze Elementary, DeLaura Middle and Satellite High. Confirm zoning with Brevard Public Schools for a specific address.',
        ],
      },
    ],
    chooseA: [
      'You want more homes to choose from, and more often',
      'Your budget is below Lansing Island’s estate prices',
      'You’d use a recreation center with tennis and pickleball',
      'You want a free community boat ramp as well as your own dock',
    ],
    chooseB: [
      'You want the privacy of an island behind a drawbridge',
      'You’re looking for a larger estate home on an acre-size lot',
      'Being about a mile from the Atlantic matters to you',
      'You can wait for one of its rare listings',
    ],
    faq: [
      {
        q: 'Which is more expensive, Tortoise Island or Lansing Island?',
        a: 'Lansing Island has the higher price point, with larger estate homes on bigger lots. Tortoise Island has more homes and a wider range of prices. The live median prices on this page show where each community is right now.',
      },
      {
        q: 'Are Tortoise Island and Lansing Island gated?',
        a: 'Yes, both are 24-hour guard-gated. Tortoise Island has a single gated entry off Tortoise Drive. Lansing Island is reached by a causeway and covered drawbridge past a manned gatehouse.',
      },
      {
        q: 'Do Tortoise Island and Lansing Island homes have docks?',
        a: 'Most do. Most Tortoise Island homes are on deep-water canals or the river with private docks, and residents also have a free boat ramp. Nearly every Lansing Island homesite has direct water access on the Banana River or the Grand Canal.',
      },
      {
        q: 'Why do Lansing Island listings show a Satellite Beach address?',
        a: 'Lansing Island is in Indian Harbour Beach, but its homes are listed on the MLS with a Satellite Beach address. Tortoise Island, in South Patrick Shores, also has a Satellite Beach address.',
      },
      {
        q: 'Can Ryan show me homes in both?',
        a: 'Yes. Ryan Pohl works with buyers in both communities and can set an alert for each, since Lansing Island listings are rare. Call or text 321-350-7661.',
      },
    ],
  },
};

// Link from each place's own page to its comparison(s).
export const COMPARISON_LINKS = {
  'satellite-beach': { slug: 'brevard-beach-towns-compared', label: 'Satellite Beach vs. Indian Harbour Beach vs. Indialantic vs. Melbourne Beach' },
  'indian-harbour-beach': { slug: 'brevard-beach-towns-compared', label: 'Satellite Beach vs. Indian Harbour Beach vs. Indialantic vs. Melbourne Beach' },
  'melbourne-beach': { slug: 'melbourne-beach-vs-indialantic', label: 'Melbourne Beach vs. Indialantic' },
  indialantic: { slug: 'melbourne-beach-vs-indialantic', label: 'Melbourne Beach vs. Indialantic' },
  adelaide: { slug: 'adelaide-vs-aripeka', label: 'Adelaide vs. Aripeka' },
  aripeka: { slug: 'adelaide-vs-aripeka', label: 'Adelaide vs. Aripeka' },
  'tortoise-island': { slug: 'tortoise-island-vs-lansing-island', label: 'Tortoise Island vs. Lansing Island' },
  'lansing-island': { slug: 'tortoise-island-vs-lansing-island', label: 'Tortoise Island vs. Lansing Island' },
};

export const comparisonPath = (slug) => `/compare/${slug}`;
