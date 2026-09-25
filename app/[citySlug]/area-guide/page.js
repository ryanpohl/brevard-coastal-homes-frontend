import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as api from '@/lib/api';
import {
  CITY_AREA_GUIDE_SLUGS,
  CITY_AREA_GUIDE_CONTENT,
  CITY_LISTINGS_FAQ,
  formatPrice,
  cityListingsQueryParams,
} from '@/lib/constants';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * City "Area Guide" page (2026-09-24, per Ryan — see CITY_AREA_GUIDE_SLUGS/
 * CITY_AREA_GUIDE_CONTENT/CITY_LISTINGS_FAQ in lib/constants.js for the
 * full backstory and rollout plan). This is the in-depth counterpart to
 * the clean, minimal Homes/Condos/Land listings pages
 * (app/[citySlug]/[propertySlug]/page.js) — schools, flood zones, HOA
 * fees, a live market snapshot, neighborhoods, and FAQs live here instead
 * of on the listings page itself, which links to this page rather than
 * carrying all of it directly. Piloting with Melbourne Beach only; a
 * citySlug not in CITY_AREA_GUIDE_SLUGS 404s rather than rendering an
 * empty page.
 *
 * A static route segment ("area-guide") under the dynamic [citySlug]
 * segment, sibling to [propertySlug] — Next.js matches the literal
 * segment first, so this never collides with the [propertySlug] catch-all
 * that handles homes-for-sale/condos-for-sale/etc.
 */
export async function generateMetadata({ params }) {
  const { citySlug } = await params;
  if (!CITY_AREA_GUIDE_SLUGS.includes(citySlug)) return {};
  try {
    const { city } = await api.getCity(citySlug);
    return {
      // Shortened 2026-09-25 (per the SEO audit's Titles & meta descriptions
      // table — flagged as running 84-88+ chars, past the ~60-char point
      // Google truncates at in results) — dropped ", FL" and the itemized
      // "Schools, Flood Zones & HOA Fees" list from the <title> itself
      // (that detail still lives in the description below, so it's not
      // lost from the search snippet, just out of the truncation-prone
      // blue link) and matched the "${name} Real Estate | Brevard Coastal
      // Homes" pattern already used by the sibling bare-city Listings page
      // (app/[citySlug]/page.js) for consistency. Longest city name (Indian
      // Harbour Beach) comes to 55 chars this way — comfortably under the
      // limit for every one of the 10 cities in CITY_AREA_GUIDE_SLUGS.
      title: `${city.name} Area Guide | Brevard Coastal Homes`,
      description: `What to know before buying in ${city.name}, FL: schools, flood zones, HOA fees, current market stats, and neighborhoods.`,
      alternates: { canonical: `/${citySlug}/area-guide` },
    };
  } catch {
    return {};
  }
}

// Same shape as buildListingCountPrefix in the sibling [propertySlug]
// page, but returns count + median price for a compact "Market Snapshot"
// stat row instead of a single count used in a sentence. Pages through
// results (pageSize 100, capped at 3 pages / 300 listings — plenty for
// any one city today) rather than trusting a single-page `total`, since
// the median needs every price, not just a count. lib/api.js's getListings
// already strips known rental/commercial data-quality artifacts from each
// page before this ever sees them (see its isDataQualityArtifact), so no
// separate filtering is needed here.
async function getMarketSnapshot(citySlug, propertyType) {
  let page = 1;
  let totalPages = 1;
  let results = [];
  try {
    do {
      // See cityListingsQueryParams's comment (lib/constants.js) — needed
      // here too, since this function is exactly what surfaced Viera
      // West's "0 results" bug in the first place (an empty Market
      // Snapshot on its own Area Guide page).
      const data = await api.getListings({ ...cityListingsQueryParams(citySlug), propertyType, page, pageSize: 100 });
      results = results.concat(data.results || []);
      totalPages = Math.min(data.totalPages || 1, 3);
      page += 1;
    } while (page <= totalPages);
  } catch {
    return { count: 0, median: null };
  }
  const prices = results.map((l) => l.price).filter((p) => typeof p === 'number').sort((a, b) => a - b);
  const median = prices.length ? prices[Math.floor(prices.length / 2)] : null;
  return { count: results.length, median };
}

export default async function AreaGuidePage({ params }) {
  const { citySlug } = await params;
  if (!CITY_AREA_GUIDE_SLUGS.includes(citySlug)) notFound();

  const content = CITY_AREA_GUIDE_CONTENT[citySlug];
  if (!content) notFound();

  let city;
  try {
    ({ city } = await api.getCity(citySlug));
  } catch {
    notFound();
  }

  const [homes, condos, land] = await Promise.all([
    getMarketSnapshot(citySlug, 'Home'),
    getMarketSnapshot(citySlug, 'Condo'),
    getMarketSnapshot(citySlug, 'Land'),
  ]);

  const faqItems = CITY_LISTINGS_FAQ[citySlug];

  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
      <p style={{ fontSize: 15, marginBottom: 20 }}>
        <Link href={`/${citySlug}/homes-for-sale`} style={{ color: '#000', textDecoration: 'underline' }}>
          ← View {city.name} Homes For Sale
        </Link>
      </p>

      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        {city.name}, FL Area Guide
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 36 }}>
        {content.intro}
      </p>

      <GuideSection title="Lifestyle & Character" text={content.lifestyle} />
      <GuideSection title="Schools" text={content.schools} />
      <GuideSection title="Flood Zones & Insurance" text={content.floodZones} />
      <GuideSection title="HOA & Community Fees" text={content.hoa} />

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 22, marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>Market Snapshot</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <StatTile label="Homes For Sale" count={homes.count} median={homes.median} href={`/${citySlug}/homes-for-sale`} />
          <StatTile label="Condos For Sale" count={condos.count} median={condos.median} href={`/${citySlug}/condos-for-sale`} />
          <StatTile label="Land For Sale" count={land.count} median={land.median} href={`/${citySlug}/land-for-sale`} />
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 8 }}>
          Live counts and median list prices, updated continuously from the MLS.
        </p>
      </section>

      {content.neighborhoods && content.neighborhoods.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
            Neighborhoods in {city.name}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {content.neighborhoods.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="card"
                style={{ display: 'block', padding: '14px 16px', color: 'inherit', textDecoration: 'none' }}
              >
                <div style={{ fontFamily: 'var(--font-inter-tight)', fontWeight: 600, marginBottom: 2 }}>{n.name} →</div>
                <div style={{ fontSize: 14, color: 'var(--color-muted-dark)' }}>{n.blurb}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {faqItems && (
        <section style={{ marginBottom: 36 }}>
          <Faq items={faqItems} heading={`Frequently Asked Questions About ${city.name}`} />
        </section>
      )}

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Ready to start your search?</p>
        <p style={{ fontSize: 15 }}>
          <Link href={`/${citySlug}/homes-for-sale`} style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            View {city.name} Homes For Sale →
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
