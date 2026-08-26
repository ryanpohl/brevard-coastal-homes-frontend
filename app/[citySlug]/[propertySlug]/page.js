import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import {
  SLUG_TO_PROPERTY_TYPE,
  PROPERTY_TYPE_LABEL,
  CONDO_PRICE_BANDS,
  OCEANFRONT_SLUG_TO_PROPERTY_TYPE,
  OCEANFRONT_CITY_SLUGS,
} from '@/lib/constants';
import FilterBar from '@/components/FilterBar';
import ListingResultsLayout from '@/components/ListingResultsLayout';
import HarborIslandInquiryModals from '@/components/HarborIslandInquiryModals';

// "Request Information on Property Management" CTA (per Ryan, 2026-08-26)
// — the blue button/modal originally built for the Harbor Island Beach
// Club neighborhood page (see HarborIslandInquiryModals.js), added here
// (without its Harbor-Island-specific Foreclosures button) to both the
// plain Condos pages AND the Oceanfront Condos pages for these 5 cities
// (the second, Oceanfront-Condos ask came as a same-day follow-up) — the
// same 5 barrier-island cities as OCEANFRONT_CITY_SLUGS above, chosen
// after confirming with Ryan that "Cape Canaveral" (not an actual city on
// this site) meant Indialantic.
const PROPERTY_MANAGEMENT_CTA_CITY_SLUGS = [
  'cocoa-beach',
  'melbourne-beach',
  'satellite-beach',
  'indian-harbour-beach',
  'indialantic',
];

// Matches the reference design's "1-30 of 34 Homes" pagination — the
// backend defaults to 24 if this isn't passed.
const PAGE_SIZE = 30;

/**
 * City listing page — one route covers all 10 cities x 3 property types
 * (homes-for-sale / condos-for-sale / land-for-sale), e.g. /cocoa-beach/homes-for-sale,
 * PLUS the 5-city x 2-type Oceanfront variant added 2026-08-22 (per Ryan)
 * — oceanfront-homes-for-sale/oceanfront-condos-for-sale, e.g.
 * /cocoa-beach/oceanfront-homes-for-sale — reusing this same dynamic
 * route rather than a separate one, since the URL shape
 * (/{citySlug}/{propertySlug}) already fits. See
 * OCEANFRONT_SLUG_TO_PROPERTY_TYPE/OCEANFRONT_CITY_SLUGS in
 * lib/constants.js for the gating.
 * SEO metadata (title/description/canonical) comes from the backend's
 * pre-generated /api/seo/city/:slug endpoint (or, for Oceanfront pages,
 * the computed-on-the-fly /api/seo/oceanfront/:citySlug endpoint) —
 * never hand-write per-page meta here.
 */
export async function generateMetadata({ params }) {
  const { citySlug, propertySlug } = params;
  const isOceanfront = Boolean(OCEANFRONT_SLUG_TO_PROPERTY_TYPE[propertySlug]);
  const propertyType = isOceanfront ? OCEANFRONT_SLUG_TO_PROPERTY_TYPE[propertySlug] : SLUG_TO_PROPERTY_TYPE[propertySlug];
  if (!propertyType) return {};
  if (isOceanfront && !OCEANFRONT_CITY_SLUGS.includes(citySlug)) return {};

  try {
    const { seo } = isOceanfront
      ? await api.getOceanfrontSeo(citySlug, propertyType)
      : await api.getCitySeo(citySlug, propertyType);
    return {
      title: seo.title,
      description: seo.metaDescription,
      keywords: seo.keywords,
      alternates: { canonical: seo.canonicalUrl || seo.canonicalPath },
    };
  } catch {
    return {};
  }
}

export default async function CityListingsPage({ params, searchParams }) {
  const { citySlug, propertySlug } = params;
  const isOceanfront = Boolean(OCEANFRONT_SLUG_TO_PROPERTY_TYPE[propertySlug]);
  const propertyType = isOceanfront ? OCEANFRONT_SLUG_TO_PROPERTY_TYPE[propertySlug] : SLUG_TO_PROPERTY_TYPE[propertySlug];
  if (!propertyType) notFound();
  // Oceanfront pages only exist for the 5 barrier-island cities named by
  // Ryan (2026-08-22) — e.g. /melbourne/oceanfront-homes-for-sale 404s
  // rather than silently rendering an unfiltered/mislabeled page.
  if (isOceanfront && !OCEANFRONT_CITY_SLUGS.includes(citySlug)) notFound();

  let city;
  try {
    ({ city } = await api.getCity(citySlug));
  } catch {
    notFound();
  }

  let seo = null;
  let jsonLd = null;
  try {
    ({ seo, jsonLd } = isOceanfront
      ? await api.getOceanfrontSeo(citySlug, propertyType)
      : await api.getCitySeo(citySlug, propertyType));
  } catch {
    // No SEO row yet (e.g. seed:seo hasn't run) — render with sensible fallbacks below.
  }

  // The URL segment picks the primary property type; SearchBar/FilterBar can widen
  // the filter to multiple types via the `propertyType` query param (comma-joined).
  const effectivePropertyTypes = searchParams.propertyType ? searchParams.propertyType.split(',') : [propertyType];

  const page = Number(searchParams.page) || 1;

  let results = [];
  let total = 0;
  let totalPages = 1;
  try {
    const data = await api.getListings({
      city: citySlug,
      propertyType: effectivePropertyTypes,
      priceMin: searchParams.priceMin,
      priceMax: searchParams.priceMax,
      beds: searchParams.beds,
      baths: searchParams.baths,
      // Oceanfront pages (per Ryan, 2026-08-22) force the Waterfront
      // filter to Oceanfront server-side, ignoring any ?waterfront= a
      // visitor's URL might otherwise carry — there's no Waterfront
      // dropdown on these pages to set it from anyway (see hideWaterfront
      // on FilterBar below).
      waterfront: isOceanfront ? 'Oceanfront' : searchParams.waterfront,
      // "55+ Communities" (2026-08-14) — the control only ever renders on
      // Viera West's Homes/Condos pages (see show55Filter below), so this
      // param will only be set there in practice. Forwarded unconditionally
      // like every other param here rather than gated on isVieraWest — no
      // harm if it were ever set on another city's URL, since the backend's
      // buildWhereClause only applies a clause when it's 'exclude'/'only'.
      seniorCommunity: searchParams.seniorCommunity,
      sort: searchParams.sort,
      page,
      pageSize: PAGE_SIZE,
    });
    results = data.results || [];
    total = data.total ?? results.length;
    totalPages = data.totalPages || 1;
  } catch {
    // Backend unreachable or no matches — render an empty grid rather than crashing.
  }

  // Melbourne and Rockledge (per Ryan, 2026-08-06): drop Oceanfront from
  // the Waterfront dropdown on their Homes and Condos pages specifically —
  // both are mainland cities that only front the Indian River, not the
  // ocean (unlike barrier-island cities such as Indialantic/Melbourne
  // Beach/Satellite Beach). Land wasn't mentioned for either, so it's left
  // with the full Oceanfront+Riverfront set from city.filters. Same
  // excludeWaterfrontOptions prop FilterBar already supports for Lansing
  // Island/Tortoise Island on the neighborhood pages.
  const CITIES_EXCLUDING_OCEANFRONT = ['melbourne', 'rockledge'];
  const excludeWaterfrontOptions =
    CITIES_EXCLUDING_OCEANFRONT.includes(citySlug) && propertyType !== 'Land' ? ['Oceanfront'] : undefined;

  // "55+ Communities" filter (2026-08-14, per Ryan) — Viera West's
  // Homes/Condos pages only, not Land. See FilterBar.js's show55Filter
  // prop and listings.controller.js's buildWhereClause for the rest of
  // the plumbing.
  const show55Filter = citySlug === 'viera-west' && propertyType !== 'Land';

  // See PROPERTY_MANAGEMENT_CTA_CITY_SLUGS above — every Condos page (both
  // the plain city page and, per Ryan's 2026-08-26 follow-up, the
  // Oceanfront Condos variant) for these 5 cities. Not gated on
  // `!isOceanfront` — PROPERTY_MANAGEMENT_CTA_CITY_SLUGS is exactly the
  // same 5-city set as OCEANFRONT_CITY_SLUGS, so this naturally covers
  // both /condos-for-sale and /oceanfront-condos-for-sale for each.
  const showPropertyManagementCTA = propertyType === 'Condo' && PROPERTY_MANAGEMENT_CTA_CITY_SLUGS.includes(citySlug);

  const typeLabel = isOceanfront
    ? `Oceanfront ${PROPERTY_TYPE_LABEL[propertyType] || 'Homes'}`
    : PROPERTY_TYPE_LABEL[propertyType] || 'Homes';
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  // Real per-listing coordinates come from the Spark MLS sync (null until
  // then); the map center falls back to the city's own coordinate so it's
  // always centered on the right place even with zero pins to show yet.
  const mapCenter = city.latitude != null && city.longitude != null ? { lat: city.latitude, lng: city.longitude } : null;

  return (
    <div>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 0' }}>
        {/* fontFamily: Inter Tight (2026-08-21, per Ryan: "Change the font
            to inter tight on all the pages city & neighborhood
            descriptions") — this H1 is the only "description"-style text
            on this page (no separate description paragraph exists, just
            this heading + the "N results" line below it). */}
        <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 8, fontFamily: 'var(--font-inter-tight)' }}>
          {seo?.h1 ||
            (isOceanfront
              ? `Oceanfront ${PROPERTY_TYPE_LABEL[propertyType]} For Sale in ${city.name}, FL`
              : `${PROPERTY_TYPE_LABEL[propertyType]} in ${city.name}, FL`)}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12 }}>
          {total} result{total === 1 ? '' : 's'}
        </p>
      </div>

      <FilterBar
        waterfrontFlags={city.filters}
        showZoning={propertyType === 'Land'}
        excludeWaterfrontOptions={excludeWaterfrontOptions}
        // Oceanfront pages (per Ryan, 2026-08-22) lock the Waterfront
        // filter to Oceanfront server-side (see the getListings call
        // above) — showing a Waterfront dropdown that could uncheck the
        // very filter defining the page wouldn't make sense, so it's
        // hidden entirely rather than just pre-checked.
        hideWaterfront={isOceanfront}
        // Property Type stays visible (so a visitor can still narrow to
        // just Homes or just Condos, or view both together) but Land is
        // excluded from its options — Ryan's request was specifically
        // "Oceanfront Condos & Homes," and Land isn't part of these pages.
        propertyTypeOptions={isOceanfront ? ['Home', 'Condo'] : undefined}
        priceBands={propertyType === 'Condo' ? CONDO_PRICE_BANDS : undefined}
        show55Filter={show55Filter}
        // "Acreage" sort option (per Ryan, 2026-08-15) — kept only on this
        // city's own Land route; hidden on its Homes/Condos routes, where
        // every listing's acreage is null anyway. See FilterBar.js's
        // hideAcreageSort comment.
        hideAcreageSort={propertyType !== 'Land'}
        extraActions={
          showPropertyManagementCTA ? (
            <HarborIslandInquiryModals showForeclosures={false} areaLabel={city.name} />
          ) : undefined
        }
      />

      <div className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 64px' }}>
        <ListingResultsLayout
          mapCenter={mapCenter}
          results={results}
          resultsLabel={total === 0 ? '0 results' : `${rangeStart}-${rangeEnd} of ${total} ${typeLabel}`}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
