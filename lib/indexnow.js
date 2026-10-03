// IndexNow deploy ping (2026-10-03, per Ryan). Tells IndexNow-enabled
// search engines (Bing — which also powers ChatGPT search and Copilot —
// plus Yandex, Seznam, Naver and others; IndexNow shares each submission
// with all of them) that this site's pages changed, so they recrawl them
// within minutes-to-hours instead of waiting for their own schedule.
//
// Called once per server start from instrumentation.js, i.e. once per
// Hostinger deploy (every push to main redeploys). Submits every sitemap
// URL except individual /listings/ pages — those change with the hourly
// MLS sync rather than with deploys, and resubmitting ~1,300 unchanged
// listing URLs on every deploy is the kind of bulk resubmission IndexNow
// asks sites not to do.
//
// The key is the existing public/557b7fc986414684e9a908d241e38589.txt
// (IndexNow verifies ownership by fetching it from keyLocation).
//
// INDEXNOW_SITE_URL / INDEXNOW_ENDPOINT override the live defaults for
// local testing only.
const SITE_URL = (process.env.INDEXNOW_SITE_URL || 'https://brevardcoastalhomes.com').replace(/\/+$/, '');
const ENDPOINT = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const KEY = '557b7fc986414684e9a908d241e38589';
const TIMEOUT_MS = 20000;

export async function pingIndexNow() {
  const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!sitemapRes.ok) throw new Error(`sitemap.xml responded ${sitemapRes.status}`);
  const xml = await sitemapRes.text();
  const urlList = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
    .map((m) => m[1].replace(/&amp;/g, '&'))
    .filter((url) => !url.includes('/listings/'));
  if (!urlList.length) throw new Error('no URLs found in sitemap.xml');

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'brevardcoastalhomes.com',
      key: KEY,
      keyLocation: `https://brevardcoastalhomes.com/${KEY}.txt`,
      urlList,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  // 200 = accepted, 202 = accepted (key validation pending). Anything else
  // (400 bad request, 403 key not valid, 422 URL/host mismatch, 429 too
  // many requests) is logged with the response body.
  if (res.status !== 200 && res.status !== 202) {
    const body = await res.text().catch(() => '');
    throw new Error(`IndexNow responded ${res.status}: ${body.slice(0, 300)}`);
  }
  return { status: res.status, count: urlList.length };
}
