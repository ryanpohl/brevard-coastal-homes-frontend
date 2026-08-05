import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import {
  ADELAIDE_PRICE_BANDS,
  ADELAIDE_BED_OPTIONS,
  ADELAIDE_BATH_OPTIONS,
  ARIPEKA_PROPERTY_TYPE_OPTIONS,
  ARIPEKA_PRICE_BANDS,
  ARIPEKA_BED_OPTIONS,
  ARIPEKA_BATH_OPTIONS,
} from '@/lib/constants';
import FilterBar from '@/components/FilterBar';
import ListingCard from '@/components/ListingCard';
import ListingMap from '@/components/ListingMap';
import Pagination from '@/components/Pagination';

// Matches the reference design's "1-30 of 34 Homes" pagination — the
// backend defaults to 24 if this isn't passed.
const PAGE_SIZE = 30;

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
  // Viera West special cases) — so fetch the city to get them. The parent
  // city's coordinate also doubles as the map's fallback center when the
  // neighborhood doesn't have its own (most don't — see backend/README.md).
  let waterfrontFlags = {};
  let parentCity = null;
  if (neighborhood.city) {
    try {
      ({ city: parentCity } = await api.getCity(neighborhood.city.slug));
      waterfrontFlags = parentCity.filters || {};
    } catch {
      // No parent city data available — FilterBar simply won't show a Waterfront option.
    }
  }

  const primaryType = (searchParams.propertyType || 'Home').split(',')[0];

  let seo = null;
  let jsonLd = null;
  try {
    ({ seo, jsonLd } = await api.getNeighborhoodSeo(slug, primaryType));
  } catch {
    // No SEO row yet for this neighborhood/property type — render with fallbacks below.
  }

  const page = Number(searchParams.page) || 1;

  let results = [];
  let total = 0;
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
      pageSize: PAGE_SIZE,
    });
    results = data.results || [];
    total = data.total ?? results.length;
    totalPages = data.totalPages || 1;
  } catch {
    // Backend unreachable or no matches — render an empty grid rather than crashing.
  }

  // Adelaide (per Ryan, 2026-08-05) gets its own Price/Beds/Baths dropdown
  // options — a higher-end community than the site-wide defaults fit — and
  // hides Property Type entirely. See lib/constants.js's ADELAIDE_* exports.
  const isAdelaide = slug === 'adelaide';
  // Aripeka (per Ryan, 2026-08-05) gets its own Property Type (no
  // Condos/Townhomes), Price, and Beds/Baths dropdown options. See
  // lib/constants.js's ARIPEKA_* exports.
  const isAripeka = slug === 'aripeka';
  // Summer Lakes (per Ryan, 2026-08-05) hides Property Type entirely (like
  // Adelaide) and reuses Aripeka's Price/Beds/Baths options, since Ryan
  // specified the identical Under $1M / $1M-$1.5M / Above $1.5M price bands
  // and 3+ Beds / 2+ Baths starting points for this community too.
  const isSummerLakes = slug === 'summer-lakes';
  // Lansing Island (per Ryan, 2026-08-05): drops Condos/Townhomes from
  // Property Type (reuses Aripeka's Home/Land-only list), hides the Price
  // dropdown entirely, reuses Aripeka's 3+ Beds / 2+ Baths starting points,
  // and drops Oceanfront from Waterfront — its parent city (Indian Harbour
  // Beach) has both oceanfront and riverfront flags set, so without this
  // override Waterfront would show both; Lansing Island itself only faces
  // the Indian River, not the ocean.
  const isLansingIsland = slug === 'lansing-island';

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  const mapCenter =
    neighborhood.latitude != null && neighborhood.longitude != null
      ? { lat: neighborhood.latitude, lng: neighborhood.longitude }
      : parentCity && parentCity.latitude != null && parentCity.longitude != null
        ? { lat: parentCity.latitude, lng: parentCity.longitude }
        : null;

  return (
    <div>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 0' }}>
        <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 8 }}>
          {seo?.h1 || `Homes for Sale in ${neighborhood.name}, FL`}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12 }}>
          {total} result{total === 1 ? '' : 's'}
        </p>
        {seo?.introCopy && (
          <p style={{ maxWidth: 760, color: 'var(--color-muted-dark)', marginBottom: 16 }}>{seo.introCopy}</p>
        )}
      </div>

      <FilterBar
        waterfrontFlags={waterfrontFlags}
        hidePropertyType={isAdelaide || isSummerLakes}
        propertyTypeOptions={isAripeka || isLansingIsland ? ARIPEKA_PROPERTY_TYPE_OPTIONS : undefined}
        hidePrice={isLansingIsland}
        priceBands={isAdelaide ? ADELAIDE_PRICE_BANDS : isAripeka || isSummerLakes ? ARIPEKA_PRICE_BANDS : undefined}
        bedOptions={isAdelaide ? ADELAIDE_BED_OPTIONS : isAripeka || isSummerLakes || isLansingIsland ? ARIPEKA_BED_OPTIONS : undefined}
        bathOptions={isAdelaide ? ADELAIDE_BATH_OPTIONS : isAripeka || isSummerLakes || isLansingIsland ? ARIPEKA_BATH_OPTIONS : undefined}
        excludeWaterfrontOptions={isLansingIsland ? ['Oceanfront'] : undefined}
      />

      <div className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 64px' }}>
        <div className="listing-page-layout">
          <div className="listing-page-map">
            <ListingMap center={mapCenter} listings={results} height="100%" zoom={neighborhood.mapZoom || 15} />
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>
              {total === 0 ? '0 results' : `${rangeStart}-${rangeEnd} of ${total} Homes`}
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
