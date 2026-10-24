/**
 * "{City} Open Houses" pages (2026-10-24, per Ryan: every city has open
 * houses most weekends; neighborhoods don't, so they only get the card
 * badge). Melbourne Beach first — add the other cities here once approved.
 */
export const OPEN_HOUSE_CITIES = {
  'melbourne-beach': {
    name: 'Melbourne Beach',
    blurb:
      'Melbourne Beach sits on the barrier island between the Atlantic Ocean and the Indian River, so open houses here range from oceanfront condos to riverfront homes and quiet beachside streets in between.',
  },
};

export function openHousePath(citySlug) {
  return `/${citySlug}/open-houses`;
}
