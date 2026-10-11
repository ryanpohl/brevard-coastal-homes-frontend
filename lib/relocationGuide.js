// Free "Moving to Brevard County" relocation guide (2026-10-11, per Ryan).
// The PDF is emailed by the backend (assets/guides/brevard-relocation-guide.pdf);
// these are the towns with their own section in it, keyed by city slug, so
// a city page's offer and the email can open with that town.
export const RELOCATION_GUIDE_PATH = '/brevard-relocation-guide';

export const GUIDE_TOWNS = {
  'cocoa-beach': 'Cocoa Beach',
  'satellite-beach': 'Satellite Beach',
  'indian-harbour-beach': 'Indian Harbour Beach',
  indialantic: 'Indialantic',
  'melbourne-beach': 'Melbourne Beach',
  'merritt-island': 'Merritt Island',
  viera: 'Viera',
  'viera-west': 'Viera West',
  rockledge: 'Rockledge',
  melbourne: 'Melbourne',
};

export const GUIDE_TIMEFRAMES = ['Within 3 months', '3–6 months', '6–12 months', 'More than a year', 'Just exploring'];

export function relocationGuideHref(townSlug) {
  return GUIDE_TOWNS[townSlug] ? `${RELOCATION_GUIDE_PATH}?town=${townSlug}` : RELOCATION_GUIDE_PATH;
}
