import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import ListingCard from '@/components/ListingCard';
import Pagination from '@/components/Pagination';

/**
 * Neighborhood listing page — one route covers all 8 neighborhoods, e.g.
 * /neighborhoods/pineda-landing. Unlike the city pages, property type isn't
 * baked into the URL segment; it's driven entirely by the FilterBar/query
 * string, defaulting to showing all types.
 */
export async function generateMetadata({ params, searchParams }) {
  const primaryType = (searchParams.propertyType || 'Home').split(',')[0];
  try {
    const { seo } = await api.getNeighborhoodSeo(params.slug, primaryType);
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

export default async function NeighborhoodListingsPage({ params, searchParams }) {
  const { slug } = params;

  let neighborhood;
  try {
    ({ neighborhood } = await api.getNeighborhood(slug));
  } catch {
    notFound();
  }

  // The neighborhood object itself doesn't carry waterfront filter flags —
  // those live on its parent city (and encode the Merritt Island /
  // Viera West special cases) — so fetch the city to get them.
  let waterfrontFlags = {};
  if (neighborhood.city) {
    try {
      const { city: parentCity } = await api.getCity(neighborhood.city.slug);
      waterfrontFlags = parentCity.filters || {};
    } catch {
      // No parent city data available — FilterBar simply won't show a Waterfront option.
    }
  }

  const primaryType = (searchParams.propertyType || 'Home').split(',')[0];

  let seo = null;
  let listingCount = null;
  let jsonLd = null;
  try {
    ({ seo, listingCount, jsonLd } = await api.getNeighborhoodSeo(slug, primaryType));
  } catch {
    // No SEO row yet for this neighborhood/property type — render with fallbacks below.
  }

  const page = Number(searchParams.page) || 1;

  let results = [];
  let totalPages = 1;
  try {
    const data = await api.getListings({
      neighborhood: slug,
      propertyType: searchParams.propertyType ? searchParams.propertyType.split(',') : undefined,
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
          {seo?.h1 || `Homes for Sale in ${neighborhood.name}, FL`}
        </h1>
        {seo?.introCopy && (
          <p style={{ maxWidth: 760, color: 'var(--color-muted-dark)', marginBottom: 16 }}>{seo.introCopy}</p>
        )}
      </div>

      <FilterBar waterfrontFlags={waterfrontFlags} />

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
          Map placeholder — {neighborhood.name}
        </div>
      </div>
    </div>
  );
}
