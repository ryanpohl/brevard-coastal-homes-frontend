import * as api from '@/lib/api';
import {
  PROPERTY_TYPE_TO_SLUG,
  OCEANFRONT_PROPERTY_TYPE_TO_SLUG,
  OCEANFRONT_CITY_SLUGS,
  OCEANFRONT_LISTINGS_SLUG,
  VIERA_BUILDERS_SUB_COMMUNITIES,
} from '@/lib/constants';

// Native Next.js sitemap.xml (2026-09-11, SEO audit finding: brevardcoastalhomes.com/sitemap.xml
// 404s). Same root cause as robots.js's comment: the backend DOES generate a real sitemap
// (seo.controller.js's sitemapXml), but it's mounted on the backend's own domain and, more
// importantly, the live backend deploy (listings-api-deploy-v13.zip, uploaded 2026-09-10) predates
// the GitHub commit that added that route at all — confirmed by comparing the live /api/health
// response (no `deployMarker` field) against GitHub main's server.js (which has one). Rather than
// wait on a backend redeploy — a manually-zip-uploaded deploy this session hasn't done before, and
// one that touches the same live process serving listings/auth/favorites — this generates the
// sitemap natively in the frontend via Next.js's app/sitemap.js convention, with no backend
// dependency for the route to exist at all (it still calls the backend's existing, working
// /api/cities, /api/neighborhoods, and /api/listings endpoints for the actual URL list).
const SITE_URL = 'https://brevardcoastalhomes.com';

// Cached for an hour (App Router route-segment convention) rather than
// regenerated on every crawler hit — this walks every listing page-by-page
// below, which isn't free, and listings don't change fast enough to need it
// live.
export const revalidate = 3600;

// Safety cap, not a real expected ceiling — the MLS Feed Data Quality Report
// (2026-09-10) counted ~2,207 usable listings site-wide, so 20 pages of 200
// (4,000) leaves comfortable headroom without risking an unbounded fetch loop
// if the backend's pagination ever misbehaves.
const LISTING_PAGE_SIZE = 200;
const MAX_LISTING_PAGES = 20;

async function getAllListingIds() {
  const ids = [];
  let page = 1;
  try {
    // eslint-disable-next-line no-constant-condition
    while (page <= MAX_LISTING_PAGES) {
      const data = await api.getListings({ page, pageSize: LISTING_PAGE_SIZE });
      const results = (data && data.results) || [];
      if (!results.length) break;
      results.forEach((listing) => ids.push(listing.id));
      const totalPages = data.totalPages || 1;
      if (page >= totalPages) break;
      page += 1;
    }
  } catch {
    // Backend unreachable — the sitemap still returns every static/city/
    // neighborhood URL below, just without individual listing pages this run.
  }
  return ids;
}

export default async function sitemap() {
  let cities = [];
  let neighborhoods = [];
  try {
    [{ cities }, { neighborhoods }] = await Promise.all([api.getCities(), api.getNeighborhoods()]);
  } catch {
    // Backend unreachable at build/request time — fall back to the static entries below.
  }

  const now = new Date();
  const entries = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/looking-to-sell`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  cities.forEach((city) => {
    Object.values(PROPERTY_TYPE_TO_SLUG).forEach((slug) => {
      entries.push({
        url: `${SITE_URL}/${city.slug}/${slug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });
    // Oceanfront homes/condos + the combined "Listings" view only exist for
    // the 5 barrier-island cities — see OCEANFRONT_CITY_SLUGS's own comment
    // in lib/constants.js.
    if (OCEANFRONT_CITY_SLUGS.includes(city.slug)) {
      Object.values(OCEANFRONT_PROPERTY_TYPE_TO_SLUG).forEach((slug) => {
        entries.push({
          url: `${SITE_URL}/${city.slug}/${slug}`,
          lastModified: now,
          changeFrequency: 'daily',
          priority: 0.7,
        });
      });
      entries.push({
        url: `${SITE_URL}/${city.slug}/${OCEANFRONT_LISTINGS_SLUG}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.6,
      });
    }
  });

  neighborhoods.forEach((n) => {
    entries.push({
      url: `${SITE_URL}/neighborhoods/${n.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    });
  });

  // Viera Builders Communities Viera West's 6 sub-communities are real, live
  // pages (app/neighborhoods/[slug]/page.js special-cases these slugs) but
  // aren't rows in the backend's `neighborhoods` table — see
  // VIERA_BUILDERS_SUB_COMMUNITIES's own comment in lib/constants.js. Skip
  // Atlin Cove: it's marked "Coming Soon" and has no real listing data yet,
  // so it's not worth submitting to search engines until it does.
  VIERA_BUILDERS_SUB_COMMUNITIES.filter((c) => !c.comingSoon).forEach((c) => {
    entries.push({
      url: `${SITE_URL}/neighborhoods/${c.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.6,
    });
  });

  const listingIds = await getAllListingIds();
  listingIds.forEach((id) => {
    entries.push({
      url: `${SITE_URL}/listings/${id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  return entries;
}
