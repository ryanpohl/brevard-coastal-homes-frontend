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
  'merritt-island': {
    name: 'Merritt Island',
    blurb:
      'Merritt Island sits between the Indian River and the Banana River, so open houses here range from riverfront and canal homes to established neighborhoods a short drive from Cocoa Beach and Kennedy Space Center.',
  },
  'satellite-beach': {
    name: 'Satellite Beach',
    blurb:
      'Satellite Beach sits between the Atlantic Ocean and the Banana River, so open houses here range from oceanfront condos to canal-front homes on the river side and quiet residential streets in between.',
  },
  'cocoa-beach': {
    name: 'Cocoa Beach',
    blurb:
      'Cocoa Beach sits on the barrier island between the Atlantic Ocean and the Banana River, so open houses here range from oceanfront condos to canal homes on the river side and walkable streets near the pier.',
  },
  indialantic: {
    name: 'Indialantic',
    blurb:
      'Indialantic is a small beach town on the barrier island, just across the Melbourne Causeway from Melbourne, so open houses here range from oceanfront condos to riverfront homes and beachside neighborhoods in between.',
  },
};

export function openHousePath(citySlug) {
  return `/${citySlug}/open-houses`;
}
