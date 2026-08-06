import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import { SLUG_TO_PROPERTY_TYPE, PROPERTY_TYPE_LABEL } from '@/lib/constants';
import FilterBar from '@/components/FilterBar';
import ListingCard from '@/components/ListingCard';
import ListingMap from '@/components/ListingMap';
import Pagination from '@/components/Pagination';

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

  // Melbourne (per Ryan, 2026-08-06): drop Oceanfront from the Waterfront
  // dropdown on its Homes and Condos pages specifically — Melbourne's
  // mainland side only fronts the Indian River, not the ocean (unlike its
  // barrier-island neighbors such as Indialantic/Melbourne Beach). Land
  // wasn't mentioned, so it's left with the full Oceanfront+Riverfront set
  // from city.filters. Same excludeWaterfrontOptions prop FilterBar already
  // supports for Lansing Island/Tortoise Island on the neighborhood pages.
  const excludeWaterfrontOptions = citySlug === 'melbourne' && propertyType !== 'Land' ? ['Oceanfront'] : undefined;

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
        {seo?.introCopy && (
          <p style={{ maxWidth: 760, color: 'var(--color-muted-dark)', marginBottom: 16 }}>{seo.introCopy}</p>
        )}
      </div>

      <FilterBar
        waterfrontFlags={city.filters}
        showZoning={propertyType === 'Land'}
        excludeWaterfrontOptions={excludeWaterfrontOptions}
      />

      <div className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 64px' }}>
        <div className="listing-page-layout">
          <div className="listing-page-map">
            <ListingMap center={mapCenter} listings={results} height="100%" />
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>
              {total === 0 ? '0 results' : `${rangeStart}-${rangeEnd} of ${total} ${typeLabel}`}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 20,
              }}
            >
              {results.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
              {results.length === 0 && (
                <p style={{ gridColumn: '1 / -1', color: 'var(--color-muted)' }}>
                  No listings match your search yet. Try adjusting your filters.
                </p>
              )}
            </div>

            <Pagination page={page} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
