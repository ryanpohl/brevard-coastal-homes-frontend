// Where a visitor came from (2026-11-02, per Ryan: show the source on every
// lead notification email). On the first page of each visit we work out
// the source — Google Ads, Google search, an AI assistant, direct, … — from
// the landing URL and the referrer, and remember two things on this device:
//   first:  the very first visit we saw (kept for good), and
//   latest: the visit the person is on now.
// lib/api.js sends both with every lead form and signup; the backend adds
// them to Ryan's notification email. Convenience only: with storage
// blocked, the lead still goes through, just without a source.
const FIRST_KEY = 'bch-first-source';
const LATEST_KEY = 'bch-latest-source';
const SESSION_KEY = 'bch-visit-recorded';

const SEARCH = [
  [/(^|\.)google\./, 'Google search'],
  [/(^|\.)bing\.com$/, 'Bing search'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo search'],
  [/(^|\.)search\.brave\.com$/, 'Brave search'],
  [/(^|\.)yahoo\.com$/, 'Yahoo search'],
  [/(^|\.)ecosia\.org$/, 'Ecosia search'],
];
const AI = [
  [/(^|\.)(chatgpt\.com|chat\.openai\.com)$/, 'AI assistant (ChatGPT)'],
  [/(^|\.)perplexity\.ai$/, 'AI assistant (Perplexity)'],
  [/(^|\.)gemini\.google\.com$/, 'AI assistant (Gemini)'],
  [/(^|\.)copilot\.microsoft\.com$/, 'AI assistant (Copilot)'],
  [/(^|\.)claude\.ai$/, 'AI assistant (Claude)'],
];
const SOCIAL = [
  [/(^|\.)(facebook\.com|fb\.com)$/, 'Facebook'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'LinkedIn'],
  [/(^|\.)(x\.com|twitter\.com|t\.co)$/, 'X (Twitter)'],
  [/(^|\.)youtube\.com$/, 'YouTube'],
  [/(^|\.)nextdoor\.com$/, 'Nextdoor'],
];

/** The source of a visit that landed on `url` from `referrer`. */
export function classifyVisit(url, referrer) {
  let params;
  try {
    params = new URL(url).searchParams;
  } catch {
    params = new URLSearchParams();
  }
  if (params.get('gclid') || params.get('gbraid') || params.get('wbraid')) {
    // Ryan's ads add utm_campaign={campaignid} (Final URL suffix, 2026-11-02).
    const campaign = (params.get('utm_campaign') || '').replace(/[^\w-]/g, '').slice(0, 30);
    return campaign ? `Google Ads (campaign ${campaign})` : 'Google Ads';
  }
  if (params.get('msclkid')) return 'Microsoft (Bing) Ads';
  const utmSource = params.get('utm_source');
  // ChatGPT and other assistants tag their links (utm_source=chatgpt.com).
  const aiTag = utmSource && AI.find(([re]) => re.test(utmSource.toLowerCase()));
  if (aiTag) return aiTag[1];
  if (utmSource) {
    const medium = (params.get('utm_medium') || '').toLowerCase();
    if (/cpc|ppc|paid/.test(medium)) return `${utmSource} ads`;
    return medium ? `${utmSource} / ${medium}` : utmSource;
  }
  if (params.get('fbclid')) return 'Facebook';

  let host = '';
  try {
    host = referrer ? new URL(referrer).hostname.toLowerCase() : '';
  } catch {
    host = '';
  }
  if (!host || /(^|\.)brevardcoastalhomes\.com$/.test(host)) return 'Direct';
  for (const list of [AI, SEARCH, SOCIAL]) {
    const hit = list.find(([re]) => re.test(host));
    if (hit) return hit[1];
  }
  return `Referral (${host.replace(/^www\./, '')})`;
}

function read(storage, key) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked: no source on this visitor's leads.
  }
}

/** Call on every page load; records the source once per visit. */
export function recordVisitSource() {
  if (typeof window === 'undefined') return;
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    return;
  }
  const visit = {
    source: classifyVisit(window.location.href, document.referrer),
    landing: window.location.pathname,
    at: new Date().toISOString(),
  };
  write(localStorage, LATEST_KEY, visit);
  if (!read(localStorage, FIRST_KEY)) write(localStorage, FIRST_KEY, visit);
  // Count visits from ChatGPT and other AI assistants (2026-11-06, per
  // Ryan: the Friday report). Only the assistant and the landing page.
  if (visit.source.startsWith('AI assistant')) {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://listings.brevardcoastalhomes.com').replace(/\/$/, '');
    try {
      fetch(`${base}/api/visits/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: visit.source, landing: visit.landing }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Counting is best-effort.
    }
  }
}

/** { first, latest } for a lead submission, or undefined when unknown. */
export function leadSource() {
  if (typeof window === 'undefined') return undefined;
  const first = read(localStorage, FIRST_KEY);
  const latest = read(localStorage, LATEST_KEY);
  return first || latest ? { first, latest } : undefined;
}
