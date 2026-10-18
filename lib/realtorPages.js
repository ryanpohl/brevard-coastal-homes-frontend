// "{Area} Realtor" pages (2026-10-18, per Ryan: "show up in the search
// rankings for the different cities & neighborhoods when buyers & sellers
// are looking for an agent" — e.g. "realtor Adelaide", "sell my house
// Adelaide", "Adelaide realtors"). One page per area — /neighborhoods/
// {slug}/realtor for a neighborhood (`kind: 'neighborhood'`), /{city}/
// realtor for a city (`kind: 'city'`) — linked by a single line under that
// area's listings so the listing pages stay uncluttered. `sellerFirst`
// puts the Selling section first (Melbourne Beach, Ryan's #1 area for
// sellers, then Viera West, Satellite Beach and Indialantic). Live market numbers make
// each page specific to its area; the agent facts (8+ years, top 3%, 5.0
// Google rating, New England native living in Melbourne Beach, securities
// and financial services background) come from the About and Reviews
// pages; Park City (5 years, $100M+ in sales) and Fidelity / Morgan
// Stanley from Ryan, 2026-10-18. Start with Adelaide; add areas here as
// Ryan approves them.
export const REALTOR_PAGES = {
  adelaide: {
    kind: 'neighborhood',
    name: 'Adelaide',
    area: 'Viera',
    place: 'Adelaide, Viera, FL',
    path: '/neighborhoods/adelaide/realtor',
    listingsHref: '/neighborhoods/adelaide',
    h1: 'Adelaide Realtor — Buy or Sell in Adelaide, Viera FL',
    modelTour: true,
    extraBullets: ['Works directly with Viera builders and their sales teams'],
    title: 'Adelaide Realtor | Buy or Sell in Adelaide, Viera FL | Ryan Pohl',
    description:
      'Looking for an Adelaide Realtor? Ryan Pohl helps buyers tour Adelaide’s model homes and negotiate custom builds, and helps sellers price against recent Adelaide sales. 5.0 on Google.',
    keywords: [
      'Adelaide Realtor',
      'Adelaide realtors',
      'Adelaide real estate agent',
      'realtor Adelaide Viera',
      'sell my house Adelaide',
      'buying in Adelaide',
      'top rated realtors Adelaide',
      'Adelaide Viera real estate agent',
    ],
    intro:
      'Buying or selling in Adelaide, the gated custom-home community on Lake Adelaide in Viera? Ryan Pohl represents buyers through every step of a custom build and resale purchase, and helps Adelaide owners price and sell with recent Adelaide sales behind every number.',
    buying: [
      'Adelaide is custom-build only, with three recognized builders: AR Homes (Rosewood Homes), Christopher Burton Luxury Homes, and Elan Builders. AR Homes (the Lumina at 3639 Lake Adelaide Place) and Christopher Burton (3717 Upper Floridian Way) have open model homes. Ryan sets up private tours with their sales agents, connects you with Elan Builders, goes with you to answer questions, and helps you compare builders, plans, and homesites side by side.',
      'Contact Ryan before you visit the model home or meet a builder: builders may not let you add your own agent after you’ve registered on your own. Ryan negotiates the build contract, upgrades, and closing timeline, and reviews resale homes across The Reserve, The Preserve, The Lakes, and The Park. Using Ryan for a new build costs you nothing — Adelaide’s builders typically pay the buyer’s agent.',
      'Many Adelaide homesites are sold through the builders rather than listed on the MLS, so Ryan can tell you what’s actually available beyond the listings you see online.',
    ],
    selling: [
      'Selling an Adelaide home means competing with brand-new custom builds down the street. Ryan prices your home against recent Adelaide sales and current new-construction pricing, so buyers see the value of a finished, landscaped home they can move into now.',
      'You get a free market analysis, professional marketing aimed at relocation and luxury buyers, and a negotiator who spent his earlier career in finance with Fidelity and Morgan Stanley. Request your home value or call or text Ryan to talk it through.',
    ],
    faq: [
      {
        q: 'Do I need my own Realtor to buy new construction in Adelaide?',
        a: 'You don’t have to, but the builders’ sales agents represent the builder. Your own Realtor represents you on the contract, upgrades, inspections, and timeline. Register with your agent before your first model visit, since builders may not allow an agent to be added afterward. Using Ryan costs you nothing — the builder typically pays the buyer’s agent.',
      },
      {
        q: 'How do I sell my house in Adelaide?',
        a: 'Start with a free market analysis based on recent Adelaide sales and current builder pricing. Ryan will walk you through pricing, preparation, and marketing, then handle showings, offers, and negotiation through closing. Call or text Ryan at 321-350-7661 or request a home value online.',
      },
      {
        q: 'Who are the builders in Adelaide?',
        a: 'Adelaide’s recognized builders are AR Homes (Rosewood Homes), Christopher Burton Luxury Homes, and Elan Builders. AR Homes (the Lumina at 3639 Lake Adelaide Place) and Christopher Burton (3717 Upper Floridian Way) have open model homes; Elan Builders doesn’t right now. Ryan can set up private tours, connect you with all three, and help you compare them.',
      },
      {
        q: 'Why work with Ryan Pohl in Adelaide?',
        a: 'Ryan has been licensed for 8 years, including 5 years in the Park City, Utah luxury market with over $100 million in sales. He has been ranked in the top 3% of Realtors for multiple years, holds a 5.0-star rating on Google, and spent his earlier career in finance with Fidelity and Morgan Stanley. He works directly with Adelaide’s builders and their sales teams.',
      },
    ],
  },

  // Melbourne Beach (2026-10-18, per Ryan: "#1 area I want to focus on with
  // attracting sellers"). Facts from CITY_PAGE_SEO['melbourne-beach'] and
  // the About page (Ryan lives in Melbourne Beach).
  'melbourne-beach': {
    kind: 'city',
    sellerFirst: true,
    name: 'Melbourne Beach',
    place: 'Melbourne Beach, FL',
    path: '/melbourne-beach/realtor',
    listingsHref: '/melbourne-beach',
    h1: 'Melbourne Beach Realtor — Sell or Buy in Melbourne Beach, FL',
    title: 'Melbourne Beach Realtor | Sell Your Melbourne Beach Home | Ryan Pohl',
    description:
      'Selling in Melbourne Beach? Ryan Pohl, a Melbourne Beach resident and 5.0-rated Realtor, prices oceanfront, riverfront and condo homes against recent local sales. Free home value.',
    keywords: [
      'Melbourne Beach Realtor',
      'Melbourne Beach realtors',
      'Melbourne Beach real estate agent',
      'real estate agents Melbourne Beach',
      'sell my house Melbourne Beach',
      'sell my home Melbourne Beach FL',
      'Melbourne Beach listing agent',
      'top rated realtors Melbourne Beach',
      'buying in Melbourne Beach',
    ],
    intro:
      'Thinking about selling your Melbourne Beach home, or buying on the island? Ryan Pohl lives in Melbourne Beach and works the island every day, from oceanfront and riverfront homes in town to Aquarina, Harbor Island Beach Club, and the communities south toward Sebastian Inlet.',
    selling: [
      'Melbourne Beach homes don’t price like the mainland. Oceanfront, riverfront, and in-town homes a few blocks apart can sell for very different numbers, and condos vary by building, age, and association fees. Ryan prices your home against recent Melbourne Beach sales that actually match it — same side of the island, same water exposure, same type of home — not a county-wide average.',
      'Many Melbourne Beach buyers are relocating or buying a second home from out of state, so Ryan markets to them where they search, with professional photos and a full listing presentation. He prepares the details beach buyers ask about up front — the flood zone, an elevation certificate if you have one, and roof and wind-mitigation reports for insurance — so a deal doesn’t stall after you accept an offer.',
      'Before his real estate career, Ryan worked in finance with Fidelity and Morgan Stanley, and he negotiates with the numbers in hand. Start with a free market analysis of your home.',
    ],
    buying: [
      'Buying in Melbourne Beach means choosing between the 1.4-square-mile town with its pier and Ocean Avenue, gated communities like Aquarina and Harbor Island Beach Club, and quieter beachside neighborhoods to the south. Ryan helps you compare them, checks flood zones and insurance costs before you make an offer, and negotiates from first showing to closing.',
    ],
    extraBullets: ['Lives in Melbourne Beach and works the island every day'],
    faq: [
      {
        q: 'How do I sell my house in Melbourne Beach?',
        a: 'Start with a free market analysis based on recent Melbourne Beach sales that match your home’s location, water exposure, and type. Ryan will walk you through pricing, preparation, and marketing, then handle showings, offers, and negotiation through closing. Call or text Ryan at 321-350-7661 or request a home value online.',
      },
      {
        q: 'What is my Melbourne Beach home worth?',
        a: 'It depends heavily on which side of the island you’re on, how close you are to the water, and your home’s age and condition. Online estimates often miss those differences. Ryan prepares a free, no-obligation market analysis using recent local sales.',
      },
      {
        q: 'What do buyers ask about when buying in Melbourne Beach?',
        a: 'Flood zone and flood insurance, homeowners insurance costs (roof age and wind-mitigation features matter), and for condos, the association fees and what they cover. Having those answers ready helps your home sell faster and keeps deals from falling apart.',
      },
      {
        q: 'Why work with Ryan Pohl in Melbourne Beach?',
        a: 'Ryan lives in Melbourne Beach. He has been licensed for 8 years, including 5 years in the Park City, Utah luxury market with over $100 million in sales, has been ranked in the top 3% of Realtors for multiple years, holds a 5.0-star rating on Google, and spent his earlier career in finance with Fidelity and Morgan Stanley.',
      },
    ],
  },
};
