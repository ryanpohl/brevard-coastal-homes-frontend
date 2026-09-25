import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as api from '@/lib/api';
import {
  NEIGHBORHOOD_AREA_GUIDE_CONTENT,
  NEIGHBORHOOD_LISTINGS_FAQ,
  VIERA_BUILDERS_SUB_COMMUNITIES,
  AQUARINA_SUBDIVISION_NAMES,
  TORTOISE_ISLAND_SUBDIVISION_NAMES,
  SUMMER_LAKES_SUBDIVISION_NAMES,
  LANSING_ISLAND_SUBDIVISION_NAMES,
  SUNTREE_SUBDIVISION_NAMES,
  formatPrice,
} from '@/lib/constants';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';

// Mirrors app/neighborhoods/[slug]/page.js's own listingsFilterParams
// switch (2026-09-24, added while wiring up the 5 Viera Builders Communities
// sub-community Area Guides below) — but only the subset of branches that
// apply to a slug with real NEIGHBORHOOD_AREA_GUIDE_CONTENT: the 6 Viera
// Builders sub-communities (subCommunity, e.g. Pangea Park) aren't real
// `neighborhoods` table rows, so `{ neighborhood: slug }` — this file's
// previous unconditional query — returns nothing for them; Aquarina/
// Tortoise Island/Summer Lakes/Lansing Island/Suntree ARE real rows, but
// their listings' neighborhood_id links are known incomplete or entirely
// missing (see each *_SUBDIVISION_NAMES constant's own comment in
// lib/constants.js), so they need the same `subdivision` list the main
// listings page already filters by. Caught live while building this: before
// this fix, Tortoise Island's and Summer Lakes's Area Guide pages were both
// silently showing "0 Active Listings" in the Market Snapshot despite 11
// and 4 real active listings respectively, because `{ neighborhood: slug }`
// matched zero of them — Aquarina/Suntree happened to show correct-looking
// numbers only because enough of their listings' neighborhood_id links were
// intact to coincidentally match their own already-thin/small counts.
function getListingsFilterParams(slug) {
  const subCommunity = VIERA_BUILDERS_SUB_COMMUNITIES.find((c) => c.slug === slug);
  if (subCommunity) return { subdivision: subCommunity.name };
  if (slug === 'aquarina') return { subdivision: AQUARINA_SUBDIVISION_NAMES.join(',') };
  if (slug === 'tortoise-island') return { subdivision: TORTOISE_ISLAND_SUBDIVISION_NAMES.join(',') };
  if (slug === 'summer-lakes') return { subdivision: SUMMER_LAKES_SUBDIVISION_NAMES.join(',') };
  if (slug === 'lansing-island') return { subdivision: LANSING_ISLAND_SUBDIVISION_NAMES.join(',') };
  if (slug === 'suntree') return { subdivision: SUNTREE_SUBDIVISION_NAMES.join(',') };
  return { neighborhood: slug };
}

/**
 * Neighborhood "Area Guide" page (2026-09-24, per Ryan: "make the
 * neighborhood pages look like the city pages with the link instead of
 * all the text on the actual page below the listings") — mirrors
 * app/[citySlug]/area-guide/page.js's pattern exactly, one level down:
 * the in-depth counterpart to the neighborhood's own listings page
 * (app/neighborhoods/[slug]/page.js), which now links here instead of
 * rendering NEIGHBORHOOD_AREA_GUIDE_CONTENT/NEIGHBORHOOD_LISTINGS_FAQ
 * inline. See that constant's own sourcing notes in lib/constants.js for
 * where each neighborhood's facts came from.
 *
 * A static route segment ("area-guide") under the dynamic [slug] segment
 * — Next.js matches the literal segment first, so this never collides
 * with the neighborhood listings page's own query-string-driven property
 * type filtering.
 *
 * Simpler Market Snapshot than the city version: a neighborhood page
 * shows every property type combined under one URL (no per-type route
 * the way a city has /homes-for-sale, /condos-for-sale, /land-for-sale),
 * so this shows one combined stat tile rather than three.
 *
 * Gated the same way as the city version: a slug not in
 * NEIGHBORHOOD_AREA_GUIDE_CONTENT 404s rather than rendering an empty
 * page.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!NEIGHBORHOOD_AREA_GUIDE_CONTENT[slug]) return {};
  // The 6 Viera Builders Communities sub-communities (e.g. Pangea Park)
  // aren't real `neighborhoods` table rows — see VIERA_BUILDERS_SUB_
  // COMMUNITIES's own comment in lib/constants.js — so api.getNeighborhood
  // would 404 for them every time. Same stand-in-name treatment
  // app/neighborhoods/[slug]/page.js already uses for these slugs.
  const subCommunity = VIERA_BUILDERS_SUB_COMMUNITIES.find((c) => c.slug === slug);
  if (subCommunity) {
    return {
      // Shortened 2026-09-25 — see the sibling city Area Guide page's
      // (app/[citySlug]/area-guide/page.js) generateMetadata comment for
      // the full why (SEO audit flagged these as 83+ chars). Same
      // treatment: drop ", FL" and the itemized amenities/schools/HOA list
      // from the <title>, keep the "${name} Area Guide | Brevard Coastal
      // Homes" pattern. Longest neighborhood name (Harbor Island Beach
      // Club) still comes to 59 chars.
      title: `${subCommunity.name} Area Guide | Brevard Coastal Homes`,
      description: `What to know before buying in ${subCommunity.name}, a Viera Builders community in Viera West, FL: amenities, schools, HOA fees, current market stats, and FAQs.`,
      alternates: { canonical: `/neighborhoods/${slug}/area-guide` },
    };
  }
  try {
    const { neighborhood } = await api.getNeighborhood(slug);
    return {
      title: `${neighborhood.name} Area Guide | Brevard Coastal Homes`,
      description: `What to know before buying in ${neighborhood.name}, FL: amenities, schools, HOA fees, current market stats, and FAQs.`,
      alternates: { canonical: `/neighborhoods/${slug}/area-guide` },
    };
  } catch {
    return {};
  }
}

async function getMarketSnapshot(listingsFilterParams) {
  try {
    const data = await api.getListings({ ...listingsFilterParams, pageSize: 100 });
    const results = data.results || [];
    const prices = results.map((l) => l.price).filter((p) => typeof p === 'number').sort((a, b) => a - b);
    const median = prices.length ? prices[Math.floor(prices.length / 2)] : null;
    return { count: typeof data.total === 'number' ? data.total : results.length, median };
  } catch {
    return { count: 0, median: null };
  }
}

export default async function NeighborhoodAreaGuidePage({ params }) {
  const { slug } = await params;
  if (!NEIGHBORHOOD_AREA_GUIDE_CONTENT[slug]) notFound();

  const content = NEIGHBORHOOD_AREA_GUIDE_CONTENT[slug];

  // Same stand-in neighborhood object app/neighborhoods/[slug]/page.js
  // builds for the 6 Viera Builders Communities sub-communities instead of
  // fetching one (see that file's own subCommunity comment) — these aren't
  // real `neighborhoods` table rows, so api.getNeighborhood(slug) 404s.
  const subCommunity = VIERA_BUILDERS_SUB_COMMUNITIES.find((c) => c.slug === slug);
  let neighborhood;
  if (subCommunity) {
    neighborhood = { slug, name: subCommunity.name };
  } else {
    try {
      ({ neighborhood } = await api.getNeighborhood(slug));
    } catch {
      notFound();
    }
  }

  const snapshot = await getMarketSnapshot(getListingsFilterParams(slug));
  const faqItems = NEIGHBORHOOD_LISTINGS_FAQ[slug];

  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
      <p style={{ fontSize: 15, marginBottom: 20 }}>
        <Link href={`/neighborhoods/${slug}`} style={{ color: '#000', textDecoration: 'underline' }}>
          ← View {neighborhood.name} Homes For Sale
        </Link>
      </p>

      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        {neighborhood.name}, FL Area Guide
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 36 }}>
        {content.intro}
      </p>

      <GuideSection title="Community & Amenities" text={content.amenities} />
      <GuideSection title={content.homesitesTitle || 'Homesites & Builders'} text={content.homesites} />
      <GuideSection title="Schools" text={content.schools} />
      <GuideSection title="HOA & Community Fees" text={content.hoa} />

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 22, marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>Market Snapshot</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <StatTile label="Active Listings" count={snapshot.count} median={snapshot.median} href={`/neighborhoods/${slug}`} />
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 8 }}>
          Live count and median list price, updated continuously from the MLS.
        </p>
      </section>

      {faqItems && (
        <section style={{ marginBottom: 36 }}>
          <Faq items={faqItems} heading={`Frequently Asked Questions About ${neighborhood.name}`} />
        </section>
      )}

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Ready to start your search?</p>
        <p style={{ fontSize: 15 }}>
          <Link href={`/neighborhoods/${slug}`} style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            View {neighborhood.name} Homes For Sale →
          </Link>
        </p>
        <p style={{ fontSize: 15, marginTop: 10 }}>
          Have a question first?{' '}
          <strong>
            <ContactUsTrigger>Contact Us</ContactUsTrigger>
          </strong>
        </p>
      </div>
    </div>
  );
}

function GuideSection({ title, text }) {
  if (!text) return null;
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 22, marginBottom: 8, fontFamily: 'var(--font-inter-tight)' }}>{title}</h2>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>{text}</p>
    </section>
  );
}

function StatTile({ label, count, median, href }) {
  return (
    <Link href={href} className="card" style={{ display: 'block', padding: '14px 12px', color: 'inherit', textDecoration: 'none' }}>
      <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-inter-tight)' }}>{count}</div>
      {median != null && (
        <div style={{ fontSize: 13, color: 'var(--color-muted-dark)', marginTop: 2 }}>Median {formatPrice(median)}</div>
      )}
    </Link>
  );
}
