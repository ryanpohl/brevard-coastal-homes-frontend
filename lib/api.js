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

/**
 * @param {Object} params - any of city, neighborhood, subdivision, propertyType,
 *   priceMin, priceMax, beds, baths, waterfront, zoning, sort, page, pageSize
 *   (see backend/README.md for the full list). Array values are comma-joined.
 * @param {string} [token] - JWT, if you want `isFavorited` populated per-listing.
 */
export function getListings(params = {}, token) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.set(key, Array.isArray(value) ? value.join(',') : String(value));
  });
  const qs = query.toString();
  return request(`/api/listings${qs ? `?${qs}` : ''}`, { token, revalidate: token ? false : 30 });
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

// --- Auth ----------------------------------------------------------------------

export function register({ name, email, password }) {
  return request('/api/auth/register', { method: 'POST', body: { name, email, password }, revalidate: false });
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
