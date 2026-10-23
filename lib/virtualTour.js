// Virtual tours on listing pages (2026-10-23, per Ryan). The MLS sends an
// unbranded tour link (backend listingMapper.service.js's mapVirtualTour);
// tours from these hosts can play inside the page, anything else opens in
// a new tab. Returns the URL to put in an <iframe>, or null.
const EMBED_HOSTS = [
  'matterport.com',
  'youriguide.com',
  'iguide.com',
  'kuula.co',
  'cloudpano.com',
  'zillow.com',
  'tourbuilder.com',
  'my.matterport.com',
];

// Tour sites that collect the visitor's contact info for the listing agent
// (2026-10-23, per Ryan: keep leads on this site). PropertyPanorama's
// "InstaView" is a photo slideshow behind "Your contact info will be shared
// with the listing agent", so those listings show no tour at all.
// VirtualTourCafe tours can turn on a lead form / "Contact Agent" too, so
// they open in a new tab rather than playing inside the page.
const HIDDEN_TOUR_HOSTS = ['propertypanorama.com'];

/** The tour link to show for a listing, or null when it should be hidden. */
export function visibleTourUrl(url) {
  if (!url) return null;
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return HIDDEN_TOUR_HOSTS.some((h) => host === h || host.endsWith(`.${h}`)) ? null : url;
  } catch {
    return null;
  }
}

export function tourEmbedUrl(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  const host = u.hostname.replace(/^www\./, '');
  // YouTube and Vimeo need their player URLs.
  if (host === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
  if (host.endsWith('youtube.com')) {
    const id = u.searchParams.get('v') || (u.pathname.startsWith('/embed/') ? u.pathname.slice(7) : null);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (host === 'vimeo.com') {
    const id = u.pathname.split('/').filter(Boolean)[0];
    return /^\d+$/.test(id || '') ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (host === 'player.vimeo.com') return `https://${u.host}${u.pathname}${u.search}`;
  if (EMBED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
    u.protocol = 'https:';
    return u.toString();
  }
  return null;
}
