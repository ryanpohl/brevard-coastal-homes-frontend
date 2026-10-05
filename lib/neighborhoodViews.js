// Clean neighborhood property-type URLs (2026-10-05, per Ryan): a
// neighborhood's single-type views live at
//   /neighborhoods/{slug}/homes-for-sale | /condos-for-sale | /lots-for-sale
// instead of /neighborhoods/{slug}?propertyType=Home|Condo|Land. Shared by
// the [slug]/[view] route, middleware.js (301s the old query-string URLs),
// the Nav, and the neighborhood page's canonical/breadcrumb tags. Kept as
// a tiny standalone module so middleware doesn't pull in lib/constants.js.

export const NEIGHBORHOOD_VIEW_SLUG = {
  Home: 'homes-for-sale',
  Condo: 'condos-for-sale',
  Land: 'lots-for-sale',
};

// Neighborhoods whose Homes view also includes lots (Aripeka's "Homes"
// link has always meant Home + Land — see Nav.js NEIGHBORHOOD_LOTS_PAGE_SLUGS).
const HOMES_INCLUDE_LAND = new Set(['aripeka']);

function normalizeTypes(propertyType) {
  return [...new Set(String(propertyType || '').split(',').map((t) => t.trim()).filter(Boolean))].sort();
}

// "/neighborhoods/aquarina/condos-for-sale" for (aquarina, "Condo"), or null
// when the type combination has no clean URL (e.g. "Home,Condo").
export function neighborhoodViewPath(slug, propertyType) {
  const types = normalizeTypes(propertyType);
  let view = null;
  if (types.length === 1) view = NEIGHBORHOOD_VIEW_SLUG[types[0]] || null;
  else if (HOMES_INCLUDE_LAND.has(slug) && types.join(',') === 'Home,Land') view = NEIGHBORHOOD_VIEW_SLUG.Home;
  return view ? `/neighborhoods/${slug}/${view}` : null;
}

// The propertyType filter a clean view URL stands for, or null if `view`
// isn't one of the view slugs.
export function neighborhoodViewPropertyType(slug, view) {
  if (view === NEIGHBORHOOD_VIEW_SLUG.Home) return HOMES_INCLUDE_LAND.has(slug) ? 'Home,Land' : 'Home';
  if (view === NEIGHBORHOOD_VIEW_SLUG.Condo) return 'Condo';
  if (view === NEIGHBORHOOD_VIEW_SLUG.Land) return 'Land';
  return null;
}
