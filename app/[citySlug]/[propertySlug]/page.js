import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import { SLUG_TO_PROPERTY_TYPE, PROPERTY_TYPE_LABEL, CONDO_PRICE_BANDS } from '@/lib/constants';
import FilterBar from '@/components/FilterBar';
import ListingResultsLayout from '@/components/ListingResultsLayout';

// Matches the reference design's "1-30 of 34 Homes" pagination — the
// backend defaults to 24 if this isn't passed.
const PAGE_SIZE = 30;

/**
 * City listing page — one route covers all 10 cities x 3 property types
 * (homes-for-sale / condos-for-sale / land-for-sale), e.g. /cocoa-beach/homes-for-sale.
 * SEO metadata (title/description/canonical) comes from the backend's
 * pre-generated /api/seo/city/:slug endpoint — never hand-write per-page meta here.
 */
export async function generateMetadata({ params }) {
  const { citySlug, propertySlug } = params;
  const propertyType = SLUG_TO_PROPERTY_TYPE[propertySlug];
  if (!propertyType) return {};

  try {
    const { seo } = await api.getCitySeo(citySlug, propertyType);
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
  const propertyType = SLUG_TO_PROPERTY_TYPE[propertySlug];
  if (!propertyType) notFound();

  let city;
  try {
    ({ city } = await api.getCity(citySlug));
  } catch {
    notFound();
  }

  let seo = null;
  let jsonLd = null;
  try {
    ({ seo, jsonLd } = await api.getCitySeo(citySlug, propertyType));
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
      waterfront: searchParams.waterfront,
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

  const typeLabel = PROPERTY_TYPE_LABEL[propertyType] || 'Homes';
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
        <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 8 }}>
          {seo?.h1 || `${PROPERTY_TYPE_LABEL[propertyType]} in ${city.name}, FL`}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12 }}>
          {total} result{total === 1 ? '' : 's'}
        </p>
      </div>

      <FilterBar
        waterfrontFlags={city.filters}
        showZoning={propertyType === 'Land'}
        excludeWaterfrontOptions={excludeWaterfrontOptions}
        priceBands={propertyType === 'Condo' ? CONDO_PRICE_BANDS : undefined}
        show55Filter={show55Filter}
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
