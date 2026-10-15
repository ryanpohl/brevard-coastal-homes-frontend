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

// Exit popup (2026-10-14, per Ryan): on computers, when the mouse leaves the
// top of the window (heading for the tabs, back button or address bar),
// the page's email prompt opens once as a centered "Before you go" card.
// Desktop only (phones have no cursor to track), and not in the first few
// seconds on a page, so a quick move to the address bar on arrival
// doesn't trigger it. Calls onExit at most once; returns a cleanup.
const EXIT_ARM_MS = 5000;

export function watchExitIntent(onExit) {
  if (typeof window === 'undefined') return () => {};
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth < 900) return () => {};
  let fired = false;
  let armed = false;
  const armTimer = setTimeout(() => {
    armed = true;
  }, EXIT_ARM_MS);
  const onOut = (e) => {
    if (!armed || fired || e.relatedTarget || e.clientY > 0) return;
    fired = true;
    onExit();
  };
  document.addEventListener('mouseout', onOut);
  return () => {
    clearTimeout(armTimer);
    document.removeEventListener('mouseout', onOut);
  };
}
