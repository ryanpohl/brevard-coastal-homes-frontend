// Shared rules for the site's email prompts (2026-10-13, per Ryan): the
// listing-page report prompt (ListingEmailPrompt.js) and the landing-page
// offer (PageEmailPrompt.js). One "No thanks" quiets both for 7 days, and
// nobody who has already given an email on this device sees either.
import { rememberedAlertEmail } from './alertMemory';

const DISMISSED_KEY = 'bch-email-prompt-dismissed';
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

export function promptForced() {
  try {
    return new URLSearchParams(window.location.search).get('emailprompt') === '1';
  } catch {
    return false;
  }
}

export function promptAllowed(user) {
  if (user || rememberedAlertEmail()) return false;
  try {
    return Date.now() - Number(localStorage.getItem(DISMISSED_KEY) || 0) >= SNOOZE_MS;
  } catch {
    return true;
  }
}

export function snoozePrompts() {
  try {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    // Storage blocked: it may show again next visit.
  }
}
