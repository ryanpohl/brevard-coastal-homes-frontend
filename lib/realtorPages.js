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
    extraBullets: ['Works directly with Adelaide’s builders, AR Homes and Christopher Burton Luxury Homes, and their sales teams'],
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

  // Viera West (2026-10-18, per Ryan: next seller focus after Melbourne
  // Beach). Facts from VIERA_WEST_SEO, COMMUNITY_SEO and
  // VIERA_WEST_NEIGHBORHOOD_PAGES in lib/constants.js.
  'viera-west': {
    kind: 'city',
    sellerFirst: true,
    name: 'Viera West',
    place: 'Viera West, FL',
    path: '/viera-west/realtor',
    listingsHref: '/viera-west',
    h1: 'Viera West Realtor — Sell or Buy in Viera West, FL',
    title: 'Viera West Realtor | Sell Your Viera West Home | Ryan Pohl',
    description:
      'Selling in Viera West? Ryan Pohl, a 5.0-rated Realtor, prices your home against recent Viera West resales and builder new construction. Free home value, private model tours for buyers.',
    keywords: [
      'Viera West Realtor',
      'Realtors Viera West',
      'Viera West real estate agent',
      'sell my house Viera West',
      'sell my home Viera West FL',
      'Viera West listing agent',
      'top rated realtors Viera West',
      'Viera Realtor',
      'buying in Viera West',
    ],
    intro:
      'Selling your Viera West home, or buying west of I-95? Ryan Pohl helps Viera West sellers price and market against new construction down the street, and represents buyers in custom, new-construction, resale, and 55+ communities across Viera West.',
    selling: [
      'Viera West sellers compete with builders. New homes from Viera Builders, the custom builders in Adelaide and Aripeka, and the 55+ communities come with incentives and fresh finishes, so a resale has to be priced and presented to win. Ryan prices your home against recent Viera West resales in your own community and against current builder pricing, so buyers see the value of a finished, landscaped home they can move into now.',
      'Viera West buyers ask about HOA dues and the Viera West Community Development District (CDD) fee on the tax bill, so Ryan has those numbers ready up front, along with your home’s flood zone and insurance details. Many buyers are relocating from out of state, and Ryan markets to them where they search.',
      'Before his real estate career, Ryan worked in finance with Fidelity and Morgan Stanley, and he negotiates with the numbers in hand. Start with a free market analysis of your home.',
    ],
    buying: [
      'Viera West runs from gated custom-home communities like Adelaide, Aripeka, and Summer Lakes to new construction by Viera Builders in Laurasia, Pangea Park, Reeling Park, and Avalonia, plus 55+ communities like Del Webb, Heritage Isle, and Bridgewater. Ryan helps you compare them, sets up private model home tours with the builders’ sales agents, and goes with you to answer questions. Contact Ryan before your first model visit, since builders may not let you add your own agent afterward.',
    ],
    extraBullets: ['Works with Viera West’s builders and their sales teams, from Viera Builders to Adelaide’s and Aripeka’s custom builders'],
    faq: [
      {
        q: 'How do I sell my house in Viera West?',
        a: 'Start with a free market analysis based on recent Viera West resales in your community and current builder pricing nearby. Ryan will walk you through pricing, preparation, and marketing, then handle showings, offers, and negotiation through closing. Call or text Ryan at 321-350-7661 or request a home value online.',
      },
      {
        q: 'Can I sell my Viera West home with new construction nearby?',
        a: 'Yes, but pricing matters. Buyers compare your home to new builds with incentives, so Ryan prices against recent resales and current builder pricing and highlights what a resale offers: a finished home, landscaping, window treatments, and no build wait.',
      },
      {
        q: 'Do I need my own Realtor to buy new construction in Viera West?',
        a: 'You don’t have to, but the builders’ sales agents represent the builder. Your own Realtor represents you on the contract, upgrades, inspections, and timeline. Register with your agent before your first model visit, since builders may not allow an agent to be added afterward.',
      },
      {
        q: 'Why work with Ryan Pohl in Viera West?',
        a: 'Ryan has been licensed for 8 years, including 5 years in the Park City, Utah luxury market with over $100 million in sales. He has been ranked in the top 3% of Realtors for multiple years, holds a 5.0-star rating on Google, spent his earlier career in finance with Fidelity and Morgan Stanley, and works with Viera West’s builders and their sales teams.',
      },
    ],
  },
  'satellite-beach': {
    kind: 'city',
    sellerFirst: true,
    name: 'Satellite Beach',
    place: 'Satellite Beach, FL',
    path: '/satellite-beach/realtor',
    listingsHref: '/satellite-beach',
    h1: 'Satellite Beach Realtor — Sell or Buy in Satellite Beach, FL',
    title: 'Satellite Beach Realtor | Sell Your Satellite Beach Home | Ryan Pohl',
    description:
      'Selling in Satellite Beach? Ryan Pohl, a 5.0-rated Realtor, prices your home against recent Satellite Beach sales, from canal-front homes to oceanfront condos. Free home value.',
    keywords: [
      'Satellite Beach Realtor',
      'Realtors Satellite Beach',
      'Satellite Beach real estate agent',
      'sell my house Satellite Beach',
      'sell my home Satellite Beach FL',
      'Satellite Beach listing agent',
      'top rated realtors Satellite Beach',
      'buying in Satellite Beach',
    ],
    intro:
      'Selling your Satellite Beach home or condo, or buying on the island? Ryan Pohl helps Satellite Beach sellers price and market their homes, and represents buyers from canal-front homes on the Banana River to oceanfront condos and guard-gated Tortoise Island.',
    selling: [
      'Satellite Beach homes don’t price off a citywide average. A canal-front home with Banana River access, an oceanfront condo, and a home a few streets off the water each sell to different buyers at different prices. Ryan prices your home against recent sales of homes like yours, on your side of the island, so it hits the market at a number buyers respond to.',
      'Satellite Beach buyers ask about flood zones, flood and wind insurance, roof age, and HOA fees on condos, so Ryan has those details ready up front. Buyers come from Patrick Space Force Base and the Space Coast’s employers as well as out of state, and Ryan markets to them where they search.',
      'Before his real estate career, Ryan worked in finance with Fidelity and Morgan Stanley, and he negotiates with the numbers in hand. Start with a free market analysis of your home.',
    ],
    buying: [
      'Satellite Beach is South Brevard’s largest beachside city, with established single-family neighborhoods, canal-front homes with Banana River access, oceanfront and riverside condos, and guard-gated Tortoise Island nearby. Ryan helps you compare them, checks flood zones and condo HOA fees before you offer, and sets up private showings.',
    ],
    extraBullets: ['Lives on the barrier island in nearby Melbourne Beach'],
    faq: [
      {
        q: 'How do I sell my house in Satellite Beach?',
        a: 'Start with a free market analysis based on recent Satellite Beach sales of homes like yours. Ryan will walk you through pricing, preparation, and marketing, then handle showings, offers, and negotiation through closing. Call or text Ryan at 321-350-7661 or request a home value online.',
      },
      {
        q: 'What is my Satellite Beach home worth?',
        a: 'It depends heavily on water: canal-front, oceanfront, and off-water homes each sell at different prices. Ryan compares your home to recent sales of similar homes nearby and gives you a price range for free, with no obligation.',
      },
      {
        q: 'Do you sell condos in Satellite Beach?',
        a: 'Yes. Ryan lists and sells oceanfront and riverside condos in Satellite Beach and has the building’s HOA fee, reserves, and insurance details ready for buyers.',
      },
      {
        q: 'Why work with Ryan Pohl in Satellite Beach?',
        a: 'Ryan has been licensed for 8 years, including 5 years in the Park City, Utah luxury market with over $100 million in sales. He has been ranked in the top 3% of Realtors for multiple years, holds a 5.0-star rating on Google, and spent his earlier career in finance with Fidelity and Morgan Stanley.',
      },
    ],
  },
  'merritt-island': {
    kind: 'city',
    sellerFirst: true,
    name: 'Merritt Island',
    place: 'Merritt Island, FL',
    path: '/merritt-island/realtor',
    listingsHref: '/merritt-island',
    h1: 'Merritt Island Realtor — Sell or Buy in Merritt Island, FL',
    title: 'Merritt Island Realtor | Sell Your Merritt Island Home | Ryan Pohl',
    description:
      'Selling in Merritt Island? Ryan Pohl, a 5.0-rated Realtor, prices your home against recent Merritt Island sales, from riverfront and canal homes to inland neighborhoods. Free home value.',
    keywords: [
      'Merritt Island Realtor',
      'Realtors Merritt Island',
      'Merritt Island real estate agent',
      'sell my house Merritt Island',
      'sell my home Merritt Island FL',
      'Merritt Island listing agent',
      'top rated realtors Merritt Island',
      'buying in Merritt Island',
    ],
    intro:
      'Selling your Merritt Island home, or buying on the island? Ryan Pohl helps Merritt Island sellers price and market their homes, and represents buyers from riverfront homes on the Indian and Banana Rivers to established inland neighborhoods and South Merritt Island.',
    selling: [
      'Merritt Island is a big island, and prices change a lot from one part to the next. A riverfront home on the Indian or Banana River, a canal home with boat access, and an inland home a few miles away sell to different buyers. Ryan prices your home against recent sales of homes like yours, in your part of the island, so it hits the market at a number buyers respond to.',
      'Merritt Island buyers ask about flood zones, since riverfront areas are commonly in the AE zone and inland areas in the lower-risk X zone, along with insurance, roof age, and HOA fees. Ryan has those details ready up front. Buyers come from Kennedy Space Center and the Space Coast’s employers as well as out of state, and Ryan markets to them where they search.',
      'Before his real estate career, Ryan worked in finance with Fidelity and Morgan Stanley, and he negotiates with the numbers in hand. Start with a free market analysis of your home.',
    ],
    buying: [
      'Merritt Island sits between the Indian River and the Banana River, with riverfront and canal homes, established central neighborhoods, quieter South Merritt Island, and most single-family homes carrying no HOA or a modest one. Ryan helps you compare areas, checks flood zones before you offer, and sets up private showings.',
    ],
    extraBullets: [],
    faq: [
      {
        q: 'How do I sell my house in Merritt Island?',
        a: 'Start with a free market analysis based on recent Merritt Island sales of homes like yours. Ryan will walk you through pricing, preparation, and marketing, then handle showings, offers, and negotiation through closing. Call or text Ryan at 321-350-7661 or request a home value online.',
      },
      {
        q: 'What is my Merritt Island home worth?',
        a: 'It depends on location and water: riverfront, canal-front, and inland homes each sell at different prices. Ryan compares your home to recent sales of similar homes nearby and gives you a price range for free, with no obligation.',
      },
      {
        q: 'Do you sell riverfront homes on Merritt Island?',
        a: 'Yes. Ryan lists and sells riverfront and canal-front homes on the Indian River and Banana River, and has the flood zone, dock, and seawall details ready for buyers.',
      },
      {
        q: 'Why work with Ryan Pohl in Merritt Island?',
        a: 'Ryan has been licensed for 8 years, including 5 years in the Park City, Utah luxury market with over $100 million in sales. He has been ranked in the top 3% of Realtors for multiple years, holds a 5.0-star rating on Google, and spent his earlier career in finance with Fidelity and Morgan Stanley.',
      },
    ],
  },
  'cocoa-beach': {
    kind: 'city',
    sellerFirst: true,
    name: 'Cocoa Beach',
    place: 'Cocoa Beach, FL',
    path: '/cocoa-beach/realtor',
    listingsHref: '/cocoa-beach',
    h1: 'Cocoa Beach Realtor — Sell or Buy in Cocoa Beach, FL',
    title: 'Cocoa Beach Realtor | Sell Your Cocoa Beach Home or Condo | Ryan Pohl',
    description:
      'Selling in Cocoa Beach? Ryan Pohl, a 5.0-rated Realtor, prices your condo or home against recent Cocoa Beach sales, from oceanfront buildings to Thousand Islands canal homes. Free home value.',
    keywords: [
      'Cocoa Beach Realtor',
      'Realtors Cocoa Beach',
      'real estate agents Cocoa Beach',
      'Cocoa Beach real estate agent',
      'sell my house Cocoa Beach',
      'sell my condo Cocoa Beach',
      'Cocoa Beach listing agent',
      'top rated realtors Cocoa Beach',
    ],
    intro:
      'Selling your Cocoa Beach condo or home, or buying at the beach? Ryan Pohl helps Cocoa Beach sellers price and market their property, and represents buyers from oceanfront condos to canal-front homes in the Thousand Islands.',
    selling: [
      'Cocoa Beach has as many condos as single-family homes, and each sells differently. A condo sells on its building: HOA fee, reserves, insurance, and the view. A canal-front home in the Thousand Islands sells on its water access. Ryan prices your property against recent sales in your building or on your street, so it hits the market at a number buyers respond to.',
      'Cocoa Beach draws full-time residents, second-home buyers, and investors, and they ask about flood zones, insurance, and condo fees up front. Ryan has those details ready and markets to buyers where they search, in Florida and out of state.',
      'Before his real estate career, Ryan worked in finance with Fidelity and Morgan Stanley, and he negotiates with the numbers in hand. Start with a free market analysis of your home.',
    ],
    buying: [
      'Cocoa Beach runs along 5.6 miles of Atlantic oceanfront, with oceanfront and riverside condos, oceanside homes, and canal-front homes in the Thousand Islands on the Banana River. Ryan helps you compare buildings and neighborhoods, checks flood zones and HOA fees before you offer, and sets up private showings.',
    ],
    extraBullets: [],
    faq: [
      {
        q: 'How do I sell my house or condo in Cocoa Beach?',
        a: 'Start with a free market analysis based on recent Cocoa Beach sales in your building or neighborhood. Ryan will walk you through pricing, preparation, and marketing, then handle showings, offers, and negotiation through closing. Call or text Ryan at 321-350-7661 or request a home value online.',
      },
      {
        q: 'What is my Cocoa Beach condo worth?',
        a: 'It depends on the building, the HOA fee, the floor, and the view. Ryan compares your condo to recent sales in your building and similar buildings nearby and gives you a price range for free, with no obligation.',
      },
      {
        q: 'Do you help second-home buyers and investors in Cocoa Beach?',
        a: 'Yes. Ryan helps buyers compare buildings and neighborhoods, including HOA fees and flood zones, and can handle much of the process remotely for out-of-state buyers.',
      },
      {
        q: 'Why work with Ryan Pohl in Cocoa Beach?',
        a: 'Ryan has been licensed for 8 years, including 5 years in the Park City, Utah luxury market with over $100 million in sales. He has been ranked in the top 3% of Realtors for multiple years, holds a 5.0-star rating on Google, and spent his earlier career in finance with Fidelity and Morgan Stanley.',
      },
    ],
  },
  indialantic: {
    kind: 'city',
    sellerFirst: true,
    name: 'Indialantic',
    place: 'Indialantic, FL',
    path: '/indialantic/realtor',
    listingsHref: '/indialantic',
    h1: 'Indialantic Realtor — Sell or Buy in Indialantic, FL',
    title: 'Indialantic Realtor | Sell Your Indialantic Home | Ryan Pohl',
    description:
      'Selling in Indialantic? Ryan Pohl, a 5.0-rated Realtor, prices your home against recent Indialantic sales, from oceanfront on A1A to riverfront and in-between streets. Free home value.',
    keywords: [
      'Indialantic Realtor',
      'Realtors Indialantic',
      'real estate agents Indialantic',
      'Indialantic real estate agent',
      'sell my house Indialantic',
      'sell my home Indialantic FL',
      'Indialantic listing agent',
      'top rated realtors Indialantic',
    ],
    intro:
      'Selling your Indialantic home, or buying in this small beach town across the causeway from Melbourne? Ryan Pohl helps Indialantic sellers price and market their homes, and represents buyers from oceanfront homes on A1A to riverfront homes on the Indian River Lagoon.',
    selling: [
      'In Indialantic, a few blocks change the price. An oceanfront home on A1A, a riverfront home facing mainland Melbourne, and a home on a quiet street in between each sell to different buyers. Ryan prices your home against recent sales of homes like yours, so it hits the market at a number buyers respond to.',
      'Indialantic buyers ask about flood zones, flood and wind insurance, and roof age, so Ryan has those details ready up front. Buyers come from mainland Melbourne and the Space Coast’s employers as well as out of state, and Ryan markets to them where they search.',
      'Before his real estate career, Ryan worked in finance with Fidelity and Morgan Stanley, and he negotiates with the numbers in hand. Start with a free market analysis of your home.',
    ],
    buying: [
      'Indialantic is a small, established barrier island town between the Indian River Lagoon and the Atlantic, with mostly single-family homes that carry no HOA or a modest fee, beachside condos along A1A, and every address a few minutes from the beach. Ryan helps you compare homes, checks flood zones before you offer, and sets up private showings.',
    ],
    extraBullets: ['Lives on the barrier island in neighboring Melbourne Beach'],
    faq: [
      {
        q: 'How do I sell my house in Indialantic?',
        a: 'Start with a free market analysis based on recent Indialantic sales of homes like yours. Ryan will walk you through pricing, preparation, and marketing, then handle showings, offers, and negotiation through closing. Call or text Ryan at 321-350-7661 or request a home value online.',
      },
      {
        q: 'What is my Indialantic home worth?',
        a: 'It depends on where your home sits between the river and the ocean: oceanfront, riverfront, and in-between homes each sell at different prices. Ryan compares your home to recent sales of similar homes nearby and gives you a price range for free, with no obligation.',
      },
      {
        q: 'Do you also work in nearby Melbourne Beach and Satellite Beach?',
        a: 'Yes. Ryan lives in Melbourne Beach and works the beachside from Melbourne Beach through Indialantic, Indian Harbour Beach, and Satellite Beach.',
      },
      {
        q: 'Why work with Ryan Pohl in Indialantic?',
        a: 'Ryan has been licensed for 8 years, including 5 years in the Park City, Utah luxury market with over $100 million in sales. He has been ranked in the top 3% of Realtors for multiple years, holds a 5.0-star rating on Google, and spent his earlier career in finance with Fidelity and Morgan Stanley.',
      },
    ],
  },
};
