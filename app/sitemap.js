import * as api from '@/lib/api';
import {
  PROPERTY_TYPE_TO_SLUG,
  OCEANFRONT_PROPERTY_TYPE_TO_SLUG,
  OCEANFRONT_CITY_SLUGS,
  OCEANFRONT_LISTINGS_SLUG,
  VIERA_BUILDERS_SUB_COMMUNITIES,
  NEIGHBORHOOD_AREA_GUIDE_CONTENT,
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
    // About / agent bio page (2026-09-25, per Ryan) — see app/about/page.js.
    // Same priority tier as Looking to Sell — both are informational,
    // non-listing static pages that link from every page's nav/footer.
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // Down Payment Assistance guide (2026-09-25, per Ryan) — the site's
    // first evergreen guide page, see app/down-payment-assistance/page.js.
    // Priority in line with /looking-to-sell — both are informational,
    // non-listing static pages.
    { url: `${SITE_URL}/down-payment-assistance`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // Flood Insurance guide (2026-09-25, per Ryan) — second evergreen
    // guide page, see app/flood-insurance/page.js. Same priority as the
    // down payment guide.
    { url: `${SITE_URL}/flood-insurance`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // Hurricane Insurance guide (2026-09-25, per Ryan) — third evergreen
    // guide page, see app/hurricane-insurance/page.js. Same priority tier
    // as the other two guides.
    { url: `${SITE_URL}/hurricane-insurance`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // /contact (2026-09-25, Ryan's checklist finding: this was the one
    // sitemap gap left after the city-hub-pages fix on 2026-09-24 — a
    // real, live, unique page that was simply never added to `entries`).
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
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
    // SEO audit fix (2026-09-24) — this loop only ever covered the
    // per-property-type pages above, so the bare "/{city}" combined
    // Listings page (app/[citySlug]/page.js, added 2026-09-01) and the
    // "/{city}/area-guide" page (app/[citySlug]/area-guide/page.js) were
    // both silently missing from the sitemap despite being real, live,
    // unique pages — 20 URLs across the 10 cities, zero of which search
    // engines could discover. Priorities: the combined Listings page sits
    // just under the single-property-type pages (0.75 vs 0.8) since it's
    // the broader, entry-point view; the Area Guide is informational
    // rather than transactional, matching the neighborhood pages' 0.7.
    entries.push({
      url: `${SITE_URL}/${city.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.75,
    });
    entries.push({
      url: `${SITE_URL}/${city.slug}/area-guide`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
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
    // Neighborhood Area Guide pages (2026-09-24, per Ryan — see
    // NEIGHBORHOOD_AREA_GUIDE_CONTENT's own comment in lib/constants.js).
    // Same "don't submit a page that doesn't exist yet" gating as the
    // rollout itself — only added for a neighborhood that object actually
    // has content for, not all 16 neighborhood rows.
    if (NEIGHBORHOOD_AREA_GUIDE_CONTENT[n.slug]) {
      entries.push({
        url: `${SITE_URL}/neighborhoods/${n.slug}/area-guide`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.65,
      });
    }
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
    // Sub-community Area Guide pages (2026-09-24, per Ryan: "can you do the
    // same thing for the 6 communities listed under viera builders") — same
    // NEIGHBORHOOD_AREA_GUIDE_CONTENT gating as the real-neighborhoods loop
    // above, so a sub-community without content yet (or comingSoon, already
    // filtered out above) isn't submitted to search engines. Priority 0.6,
    // one notch below the real neighborhoods' 0.65 Area Guide priority,
    // matching how these 6 sub-communities' own bare listing pages already
    // sit a notch below real neighborhoods' 0.7 just above.
    if (NEIGHBORHOOD_AREA_GUIDE_CONTENT[c.slug]) {
      entries.push({
        url: `${SITE_URL}/neighborhoods/${c.slug}/area-guide`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  });

  // Beach Woods (Melbourne Beach) — same situation as the Viera Builders
  // sub-communities just above: a real, live page (per Ryan, 2026-09-19)
  // but not a `neighborhoods` table row, so it needs its own explicit
  // entry here or it'd be silently missing from the sitemap. Priority 0.7,
  // matching the real neighborhoods loop above rather than the Viera
  // Builders sub-communities' 0.6 — this one has active listings (unlike
  // most of those), same as every other real neighborhood page.
  entries.push({
    url: `${SITE_URL}/neighborhoods/beach-woods`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
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
