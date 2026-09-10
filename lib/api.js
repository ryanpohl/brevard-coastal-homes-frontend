/**
 * Thin fetch wrapper around the Brevard Coastal Homes backend API
 * (see ../backend/README.md for full endpoint docs).
 *
 * Works both server-side (Next.js Server Components / route handlers,
 * where `fetch` is Next's cache-aware fetch) and client-side (browser
 * fetch, used from client components for auth/favorites/forms).
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://listings-api.brevardcoastalhomes.com';

/**
 * Core request helper. `revalidate` controls Next.js's fetch cache
 * (seconds); pass `false` to opt a request out of caching entirely
 * (e.g. anything that depends on the signed-in user).
 */
async function request(path, { method = 'GET', body, token, revalidate = 60 } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const init = { method, headers };
  if (body !== undefined) init.body = JSON.stringify(body);

  // Only Server Components / route handlers understand `next.revalidate`;
  // the browser's fetch ignores unknown options harmlessly.
  if (revalidate !== false) {
    init.next = { revalidate };
  } else {
    init.cache = 'no-store';
  }

  const res = await fetch(`${API_BASE_URL}${path}`, init);

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response (e.g. sitemap.xml) — caller should use rawFetch instead.
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request to ${path} failed with ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// --- Cities & neighborhoods -------------------------------------------------

export function getCities() {
  return request('/api/cities');
}

export function getCity(slug) {
  return request(`/api/cities/${slug}`);
}

export function getNeighborhoods() {
  return request('/api/neighborhoods');
}

export function getNeighborhood(slug) {
  return request(`/api/neighborhoods/${slug}`);
}

// --- Listings ----------------------------------------------------------------

// Stopgap data-quality filter (2026-09-10, per Ryan: "Make sure no rentals
// or commercial properties show in the listings" — a follow-up to the same
// day's MLS Feed Data Quality Report). The MLS sync itself doesn't
// distinguish a genuine "for sale" record from a monthly rental or a
// commercial lease — both land in the feed tagged exactly like an ordinary
// Home/Condo listing (see the report's Finding #2 — duplicate rental/sale
// records at the same address — and Finding #3 — commercial suites tagged
// propertyType "Home"). The real fix is upstream in that sync (the report's
// recommended fix, already sent to whoever manages it); this only filters
// what already-known patterns can catch, applied here so every page that
// lists listings (city, neighborhood, oceanfront, property-detail "nearby")
// gets it for free from this one call site.
//
// Known limitation: filtering happens after the backend has already paged
// the results, so `total`/`totalPages` below still reflect the backend's
// unfiltered counts — only the current page's `total` is nudged down by
// however many were removed from THIS page, as a rough approximation, not a
// true site-wide count. Not worth compounding by also touching
// `totalPages`: that number has to keep matching how the backend actually
// paginates the underlying (unfiltered) data, or "next page" links break.

// Finding #3's fingerprint: commercial office/retail suites synced under
// propertyType "Home"/"Condo" carry a literal placeholder of eight
// asterisks in the beds field instead of a real number (299/2,680 listings
// matched this when the report was compiled — a reliable, already-verified
// signal, not a guess).
function isCommercialLeaseArtifact(listing) {
  return listing.beds === '********';
}

// Finding #2's pattern: a rental record (monthly, or in at least one
// checked example a clearly weekly/vacation rate on a multi-million-dollar
// oceanfront estate) synced alongside — or sometimes instead of — its
// matching sale record, priced far below any genuine sale of that property.
// A flat price ceiling doesn't work across the board (a rental on an
// expensive property can price higher than a sale of a cheap one), but
// price-per-square-foot separates the two extremely cleanly: pulling every
// Home/Condo listing site-wide with a usable sqft (2,207 of them, 2026-09-10)
// showed a hard gap in the data — 640 listings under $10/sqft (all read like
// rent, e.g. $15,000 for a 4,077 sqft "oceanfront estate" worth millions;
// $4,200/mo on a home whose sale-listed twin was $649,000), then *nothing*
// again until $38/sqft, where genuine sales start (even the cheapest real
// sale found was $38.26/sqft). $30/sqft sits in the middle of that empty
// gap with margin on both sides. Land is excluded because vacant land can
// legitimately be priced low relative to size. Listings with no usable sqft
// fall back to a flat, conservative floor — chosen low specifically because
// there's no size context to sanity-check against, so it only catches the
// most unambiguous cases. Both are heuristics inferred from live examples,
// not a real "this is a rental" flag from the feed — highly unlikely, but
// not impossible, to also catch a genuinely distressed sale.
const RENTAL_PRICE_PER_SQFT_CEILING = 30;
const RENTAL_PRICE_CEILING_NO_SQFT = 5000;
function looksLikeRentalArtifact(listing) {
  if (listing.propertyType !== 'Home' && listing.propertyType !== 'Condo') return false;
  if (listing.price == null) return false;
  if (listing.sqft > 0) return listing.price / listing.sqft < RENTAL_PRICE_PER_SQFT_CEILING;
  return listing.price < RENTAL_PRICE_CEILING_NO_SQFT;
}

function isDataQualityArtifact(listing) {
  return isCommercialLeaseArtifact(listing) || looksLikeRentalArtifact(listing);
}

/**
 * @param {Object} params - any of city, neighborhood, subdivision, propertyType,
 *   priceMin, priceMax, beds, baths, waterfront, zoning, sort, page, pageSize
 *   (see backend/README.md for the full list). Array values are comma-joined.
 * @param {string} [token] - JWT, if you want `isFavorited` populated per-listing.
 */
export async function getListings(params = {}, token) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.set(key, Array.isArray(value) ? value.join(',') : String(value));
  });
  const qs = query.toString();
  const data = await request(`/api/listings${qs ? `?${qs}` : ''}`, { token, revalidate: token ? false : 30 });

  if (data && Array.isArray(data.results)) {
    const originalCount = data.results.length;
    data.results = data.results.filter((listing) => !isDataQualityArtifact(listing));
    if (typeof data.total === 'number') {
      data.total = Math.max(0, data.total - (originalCount - data.results.length));
    }
  }

  return data;
}

export function getListing(id, token) {
  return request(`/api/listings/${id}`, { token, revalidate: token ? false : 30 });
}

// --- SEO -----------------------------------------------------------------------

// Homepage Schema Markup (2026-08-15, per Ryan) — Organization/RealEstateAgent
// + WebSite JSON-LD, built server-side from static business config (no
// per-request DB lookup), unlike the per-city/neighborhood SEO below which
// reads a page_seo row. See backend/src/controllers/seo.controller.js's
// getHomeSeo.
export function getHomeSeo() {
  return request('/api/seo/home', { revalidate: 3600 });
}

export function getCitySeo(slug, propertyType = 'Home') {
  return request(`/api/seo/city/${slug}?propertyType=${propertyType}`, { revalidate: 3600 });
}

export function getNeighborhoodSeo(slug, propertyType = 'Home') {
  return request(`/api/seo/neighborhood/${slug}?propertyType=${propertyType}`, { revalidate: 3600 });
}

// Oceanfront landing pages (2026-08-22, per Ryan) — same shape as
// getCitySeo, but a separate endpoint since these 10 pages aren't stored
// in the backend's page_seo table (see seo.controller.js's
// getOceanfrontSeo comment for why).
export function getOceanfrontSeo(citySlug, propertyType = 'Home') {
  return request(`/api/seo/oceanfront/${citySlug}?propertyType=${propertyType}`, { revalidate: 3600 });
}

// --- Auth ----------------------------------------------------------------------

// phone/workingWithAgent added 2026-08-16 alongside the Register tab's new
// optional fields (see backend's schema.sql comment on users.phone /
// users.working_with_agent) — both are simply omitted from the request
// body when not provided, same as before this change for callers that
// don't pass them.
export function register({ name, email, password, phone, workingWithAgent }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: { name, email, password, phone, workingWithAgent },
    revalidate: false,
  });
}

export function login({ email, password }) {
  return request('/api/auth/login', { method: 'POST', body: { email, password }, revalidate: false });
}

export function getMe(token) {
  return request('/api/auth/me', { token, revalidate: false });
}

export function requestPasswordReset(email) {
  return request('/api/auth/password-reset/request', {
    method: 'POST',
    body: { email },
    revalidate: false,
  });
}

export function confirmPasswordReset({ token, newPassword }) {
  return request('/api/auth/password-reset/confirm', {
    method: 'POST',
    body: { token, newPassword },
    revalidate: false,
  });
}

export function updateAccount(token, updates) {
  return request('/api/account', { method: 'PUT', token, body: updates, revalidate: false });
}

// --- Favorites (auth required) --------------------------------------------------

export function getFavorites(token) {
  return request('/api/favorites', { token, revalidate: false });
}

export function addFavorite(token, listingId) {
  return request(`/api/favorites/${listingId}`, { method: 'POST', token, revalidate: false });
}

export function removeFavorite(token, listingId) {
  return request(`/api/favorites/${listingId}`, { method: 'DELETE', token, revalidate: false });
}

// --- Views (auth required) -------------------------------------------------

// Records that the signed-in user viewed a listing (added 2026-08-18, per
// Ryan — same request as Favorites: surface it in the CRM's "Viewed" tab).
// Mirrors addFavorite above; see components/ViewTracker.js for the caller.
export function recordView(token, listingId) {
  return request(`/api/views/${listingId}`, { method: 'POST', token, revalidate: false });
}

// --- Inquiries (contact / showing / question / property management) -----------

export function submitContact(payload) {
  return request('/api/inquiries/contact', { method: 'POST', body: payload, revalidate: false });
}

export function submitScheduleShowing(payload) {
  return request('/api/inquiries/schedule-showing', { method: 'POST', body: payload, revalidate: false });
}

export function submitAskQuestion(payload) {
  return request('/api/inquiries/ask-question', { method: 'POST', body: payload, revalidate: false });
}

export function submitPropertyManagement(payload) {
  return request('/api/inquiries/property-management', { method: 'POST', body: payload, revalidate: false });
}

export function submitMakeOffer(payload) {
  return request('/api/inquiries/make-offer', { method: 'POST', body: payload, revalidate: false });
}

export { API_BASE_URL };
