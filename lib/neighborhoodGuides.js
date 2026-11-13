// Communities with an approved neighborhood guide PDF (2026-11-13, per Ryan).
// Must match backend src/services/neighborhoodGuideEmail.service.js; add a
// slug here when its guide goes live. Kept out of the client component so
// server pages can read it.
export const NEIGHBORHOOD_GUIDES = {
  adelaide: { name: 'Adelaide', cover: '/communities/adelaide-gated-community-entrance-viera-fl.webp' },
  aripeka: { name: 'Aripeka', cover: '/communities/aripeka-gated-community-entrance-viera-fl.webp' },
};
