// Per-device memory for alert signups (2026-10-10, per Ryan): the email a
// visitor last signed up with, and which homes they watch from this
// device. Lets the listing-card bells (CardAlertButton.js) sign up in one
// tap after any alert signup on the site — the card bell, a listing page's
// "Get price-drop alerts" link, or a building/neighborhood "Get Alerts"
// box — and prefills those boxes. Convenience only; the backend is the
// record, and everything works without it (private mode, blocked storage).
const EMAIL_KEY = 'bch-alert-email';
const WATCHED_KEY = 'bch-watched-homes';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked: not remembered, nothing else affected.
  }
}

export function rememberedAlertEmail() {
  return read(EMAIL_KEY, '');
}

export function rememberAlertEmail(email) {
  if (email) write(EMAIL_KEY, String(email).trim().toLowerCase());
}

export function isWatchedHome(listingId) {
  return read(WATCHED_KEY, []).includes(listingId);
}

export function rememberWatchedHome(listingId) {
  const watched = read(WATCHED_KEY, []);
  if (!watched.includes(listingId)) write(WATCHED_KEY, [...watched, listingId].slice(-200));
}
