// "{Area} Realtor" pages (2026-10-18, per Ryan: "show up in the search
// rankings for the different cities & neighborhoods when buyers & sellers
// are looking for an agent" — e.g. "realtor Adelaide", "sell my house
// Adelaide", "Adelaide realtors"). One page per area at
// /neighborhoods/{slug}/realtor, linked by a single line under that area's
// listings so the listing pages stay uncluttered. Live market numbers make
// each page specific to its area; the agent facts (8+ years, top 3%, 5.0
// Google rating, New England native living in Melbourne Beach, securities
// and financial services background) come from the About and Reviews
// pages; Park City (5 years, $100M+ in sales) and Fidelity / Morgan
// Stanley from Ryan, 2026-10-18. Start with Adelaide; add areas here as
// Ryan approves them.
export const REALTOR_PAGES = {
  adelaide: {
    name: 'Adelaide',
    area: 'Viera',
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
      'Adelaide is custom-build only, with three recognized builders: AR Homes (Rosewood Homes), Christopher Burton Luxury Homes, and Elan Builders. Ryan sets up private tours with the builders’ sales agents, goes with you to answer questions, and helps you compare builders, plans, and homesites side by side.',
      'Contact Ryan before your first model home visit: builders may not let you add your own agent after you’ve registered on your own. Ryan negotiates the build contract, upgrades, and closing timeline, and reviews resale homes across The Reserve, The Preserve, The Lakes, and The Park. Using Ryan for a new build costs you nothing — Adelaide’s builders typically pay the buyer’s agent.',
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
        a: 'Adelaide’s recognized builders are AR Homes (Rosewood Homes), Christopher Burton Luxury Homes, and Elan Builders. Ryan can set up private model tours with the builders’ sales agents and help you compare them.',
      },
      {
        q: 'Why work with Ryan Pohl in Adelaide?',
        a: 'Ryan has been licensed for 8 years, including 5 years in the Park City, Utah luxury market with over $100 million in sales. He has been ranked in the top 3% of Realtors for multiple years, holds a 5.0-star rating on Google, and spent his earlier career in finance with Fidelity and Morgan Stanley. He works directly with Adelaide’s builders and their sales teams.',
      },
    ],
  },
};
