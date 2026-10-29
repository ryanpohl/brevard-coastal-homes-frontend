import { ARIPEKA_LISTINGS_FILTER, cityListingsQueryParams } from '@/lib/constants';

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
      'Adelaide has the higher price point (homes usually $1.8 million and up) and larger lots: half-acre to acre-plus homesites around a 120-acre lake, a staffed guard gate and three luxury builders. Aripeka is a step down in price (homes start around $1.2 million, including the lot), with far more mature trees and vegetation, four builders, smaller homesites and vacant lots you can buy on the MLS to build your own.',
    facts: [
      ['Location', 'Northern Viera, west of I-95 (Rockledge address)', 'Southern Viera (Melbourne 32940 address)'],
      ['Size', '460 acres, more than a third water or preserve', 'About 400 acres, about 250 wooded homesites'],
      ['Price point', 'Higher: homes usually $1.8 million and up', 'Lower: homes start around $1.2 million, including the lot'],
      ['Homesites', 'Larger: about ½ acre to over an acre', 'Smaller: about ¼ to ½ acre'],
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
          'The live numbers above show current listings and the past year’s sales. Adelaide has the clearly higher price point: its homes usually run $1.8 million and up, reflecting its bigger homesites, lake setting and staffed gate. Aripeka homes start around $1.2 million, including the lot.',
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
        a: 'Adelaide has the higher price point: homes there usually run $1.8 million and up, while Aripeka homes start around $1.2 million, including the lot. Adelaide’s homesites are larger, many are on the lake or preserve, and it has a staffed guard gate. Aripeka has much more mature vegetation and trees. The live median prices on this page show where each community is right now.',
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
};

// Link from each place's own page to its comparison(s).
export const COMPARISON_LINKS = {
  'melbourne-beach': { slug: 'melbourne-beach-vs-indialantic', label: 'Melbourne Beach vs. Indialantic' },
  indialantic: { slug: 'melbourne-beach-vs-indialantic', label: 'Melbourne Beach vs. Indialantic' },
  adelaide: { slug: 'adelaide-vs-aripeka', label: 'Adelaide vs. Aripeka' },
  aripeka: { slug: 'adelaide-vs-aripeka', label: 'Adelaide vs. Aripeka' },
};

export const comparisonPath = (slug) => `/compare/${slug}`;
