import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import { SLUG_TO_PROPERTY_TYPE, PROPERTY_TYPE_LABEL } from '@/lib/constants';
import FilterBar from '@/components/FilterBar';
import ListingCard from '@/components/ListingCard';
import Pagination from '@/components/Pagination';

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
  let listingCount = null;
  let jsonLd = null;
  try {
    ({ seo, listingCount, jsonLd } = await api.getCitySeo(citySlug, propertyType));
  } catch {
    // No SEO row yet (e.g. seed:seo hasn't run) — render with sensible fallbacks below.
  }

  // The URL segment picks the primary property type; SearchBar/FilterBar can widen
  // the filter to multiple types via the `propertyType` query param (comma-joined).
  const effectivePropertyTypes = searchParams.propertyType ? searchParams.propertyType.split(',') : [propertyType];

  const page = Number(searchParams.page) || 1;

  let results = [];
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
    });
    results = data.results || [];
    totalPages = data.totalPages || 1;
  } catch {
    // Backend unreachable or no matches — render an empty grid rather than crashing.
  }

  return (
    <div>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 0' }}>
        <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12 }}>
          {seo?.h1 || `${PROPERTY_TYPE_LABEL[propertyType]} in ${city.name}, FL`}
        </h1>
        {seo?.introCopy && (
          <p style={{ maxWidth: 760, color: 'var(--color-muted-dark)', marginBottom: 16 }}>{seo.introCopy}</p>
        )}
      </div>

      <FilterBar waterfrontFlags={city.filters} showZoning={propertyType === 'Land'} />

      <div className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 16px', fontSize: 13, color: 'var(--color-muted)' }}>
        {listingCount ?? results.length} listing{(listingCount ?? results.length) === 1 ? '' : 's'} found
      </div>

      <div
        className="container"
        style={{
          padding: '0 clamp(16px, 4vw, 56px) 32px',
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

      <div className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 64px' }}>
        <div
          className="card"
          style={{
            height: 320,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-muted)',
            background: 'var(--color-bg)',
          }}
        >
          Map placeholder — {city.name} {PROPERTY_TYPE_LABEL[propertyType]}
        </div>
      </div>
    </div>
  );
}
