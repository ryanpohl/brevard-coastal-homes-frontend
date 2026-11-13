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
};
