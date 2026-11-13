// Communities with an approved neighborhood guide PDF (2026-11-13, per Ryan).
// Must match backend src/services/neighborhoodGuideEmail.service.js; add a
// slug here when its guide goes live. Kept out of the client component so
// server pages can read it. `blurb` is the strip's one-line description.
export const NEIGHBORHOOD_GUIDES = {
  adelaide: {
    name: 'Adelaide',
    cover: '/communities/adelaide-gated-community-entrance-viera-fl.webp',
    blurb: 'builders, prices, HOA, schools and model homes',
  },
  aripeka: {
    name: 'Aripeka',
    cover: '/communities/aripeka-gated-community-entrance-viera-fl.webp',
    blurb: 'builders, prices, HOA, schools and model homes',
  },
  aquarina: {
    name: 'Aquarina',
    cover: '/communities/aquarina-beach-and-country-club-entrance-melbourne-beach-fl.webp',
    blurb: 'condos and homes, prices, HOA fees, amenities and schools',
  },
  'harbor-island-beach-club': {
    name: 'Harbor Island Beach Club',
    cover: '/communities/harbor-island-beach-club-entrance-melbourne-beach-fl.webp',
    blurb: 'homes, villas and condos, nightly rentals, prices, HOA fees and the marina',
  },
  // Town guides (2026-11-13): shown on the town's own page and its for-sale pages.
  'melbourne-beach': {
    name: 'Melbourne Beach',
    cover: '/place-photos/melbourne-beach.jpg',
    blurb: 'neighborhoods, home and condo prices, flood zones, HOAs and schools',
  },
  'cocoa-beach': {
    name: 'Cocoa Beach',
    cover: '/place-photos/cocoa-beach-pier.jpg',
    blurb: 'condo buildings and rental rules, home and condo prices, flood zones and schools',
  },
};
