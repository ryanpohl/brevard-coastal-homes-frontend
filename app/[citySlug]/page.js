import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import { cityListingsQueryParams } from '@/lib/constants';
import FilterBar from '@/components/FilterBar';
import ListingResultsLayout from '@/components/ListingResultsLayout';
import HarborIslandInquiryModals from '@/components/HarborIslandInquiryModals';
import BuildingInquiryModal from '@/components/BuildingInquiryModal';
import ContactUsTrigger from '@/components/ContactUsTrigger';

// Matches the reference design's "1-30 of 34 Homes" pagination — the
// backend defaults to 24 if this isn't passed. Same value as the sibling
// [propertySlug]/page.js.
const PAGE_SIZE = 30;

// Same 5-city allowlist as [propertySlug]/page.js's own
// PROPERTY_MANAGEMENT_CTA_CITY_SLUGS — kept as its own copy here rather
// than a shared import, matching this project's established "duplicate
// small page-specific logic" convention (see FavoriteButton.js/
// ListingCard.js's own duplicated favorite-toggle logic). This combined
// page always includes Condos (it shows every property type together), so
// it reuses the sibling page's same condition for showing the CTA.
const PROPERTY_MANAGEMENT_CTA_CITY_SLUGS = [
  'cocoa-beach',
  'melbourne-beach',
  'satellite-beach',
  'indian-harbour-beach',
  'indialantic',
];

// Same mainland-city exclusion as [propertySlug]/page.js's own
// CITIES_EXCLUDING_OCEANFRONT — Melbourne/Rockledge only front the Indian
// River, not the ocean, so "Oceanfront" isn't a real Waterfront option in
// either city regardless of property type.
const CITIES_EXCLUDING_OCEANFRONT = ['melbourne', 'rockledge'];

/**
 * City "Listings" page (2026-09-01, per Ryan: "make the Neighborhood, City
 * Listings, & Search Oceanfront live links ... When users click on the
 * Listings page show all the listings which include Homes, Condos, & Lots")
 * — the destination for the new "<City> Listings" header link at the top of
 * each city's Search by City dropdown entry (see Nav.js).
 *
 * Unlike the sibling app/[citySlug]/[propertySlug]/page.js (one property
 * type baked into the URL segment, e.g. /cocoa-beach/homes-for-sale), this
 * bare /{citySlug} route is entirely type-agnostic — same philosophy as
 * app/neighborhoods/[slug]/page.js, which has never baked a property type
 * into its URL and defaults to showing every type combined when no
 * ?propertyType= param narrows it. There's no backend SEO row for an "all
 * types" view (page_seo is keyed by a single propertyType per the sibling
 * page's getCitySeo/getNeighborhoodSeo calls), so this page's metadata is
 * hand-written from the city's own name rather than fetched.
 */
export async function generateMetadata({ params }) {
  // Next.js 15 upgrade (2026-09-03) — `params`/`searchParams` became async
  // (Promises) in the App Router; await once at the top of each
  // function and leave every downstream `citySlug`/`searchParams.x`
  // reference in this file untouched, same pattern applied across every
  // dynamic route this session (see the other three page.js files with
  // this same comment).
  const { citySlug } = await params;
  try {
    const { city } = await api.getCity(citySlug);
    return {
      // Shortened (2026-09-24, per Ryan, pointing at the SEO audit doc's
      // "Shorten bare-city 'Listings' page titles" finding) — the previous
      // title ran 82–97 characters across all 10 cities (e.g. Indian
      // Harbour Beach's own 97-char version), well past the ~50–60
      // character point Google typically truncates a result's title at,
      // cutting off mid-word in search results ("...Homes, Condos & Land
      // For Sale | Brevard C" for Cocoa Beach). This form tops out at 57
      // characters for the longest city name (Indian Harbour Beach) and
      // as low as 42 for the shortest (Viera) — every city fits inside a
      // typical SERP without truncation. "Real Estate" still communicates
      // this page's all-property-types scope (homes, condos, and land
      // combined) in one word the way the old title spelled out in three,
      // matching this page's own meta description just below.
      title: `${city.name} Real Estate | Brevard Coastal Homes`,
      description: `Browse every available listing in ${city.name}, FL in one place — single-family homes, condos, and land, updated from the MLS.`,
      alternates: { canonical: `/${citySlug}` },
    };
  } catch {
    return {};
  }
}

export default async function CityAllListingsPage({ params, searchParams: searchParamsPromise }) {
  // Next.js 15 upgrade (2026-09-03) — see generateMetadata's identical
  // comment above. Awaiting into the same `searchParams` name here keeps
  // every `searchParams.x` reference below unchanged.
  const { citySlug } = await params;
  const searchParams = await searchParamsPromise;

  let city;
  try {
    ({ city } = await api.getCity(citySlug));
  } catch {
    notFound();
  }

  // No query param narrows this down to one or two specific types (unlike
  // the sibling page, which always starts from one URL-segment-derived
  // type) — defaults to all three, same "no propertyType param = every
  // type" rule app/neighborhoods/[slug]/page.js already uses for its own
  // bare URL. A visitor can still narrow via the Property Type filter
  // below, which sets this same query param.
  const effectivePropertyTypes = searchParams.propertyType
    ? searchParams.propertyType.split(',')
    : ['Home', 'Condo', 'Land'];

  const page = Number(searchParams.page) || 1;

  let results = [];
  let total = 0;
  let totalPages = 1;
  try {
    const data = await api.getListings({
      // See cityListingsQueryParams's comment (lib/constants.js) — plain
      // `{ city: citySlug }` for every city except Viera West, whose real
      // MLS `city` field is never "Viera West".
      ...cityListingsQueryParams(citySlug),
      propertyType: effectivePropertyTypes,
      priceMin: searchParams.priceMin,
      priceMax: searchParams.priceMax,
      beds: searchParams.beds,
      baths: searchParams.baths,
      waterfront: searchParams.waterfront,
      // "55+ Communities" (2026-08-14) — only ever set from Viera West's
      // own filter control (see show55Filter below); forwarded
      // unconditionally like the sibling page does, since the backend's
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

  const excludeWaterfrontOptions = CITIES_EXCLUDING_OCEANFRONT.includes(citySlug) ? ['Oceanfront'] : undefined;

  // "55+ Communities" filter (2026-08-14, per Ryan) — Viera West only, same
  // city gate as the sibling page's own show55Filter (this combined page
  // always includes Homes/Condos, so there's no propertyType !== 'Land'
  // guard needed the way the sibling page has for its single-type routes).
  const show55Filter = citySlug === 'viera-west';

  // This combined page always includes both Condos and Land, so both of
  // the sibling page's single-type CTAs can apply here at once —
  // extraActions accepts any node, including a fragment with both buttons
  // (see FilterBar.js's `{extraActions}`).
  const showPropertyManagementCTA = PROPERTY_MANAGEMENT_CTA_CITY_SLUGS.includes(citySlug);

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  // Real per-listing coordinates come from the Spark MLS sync (null until
  // then); the map center falls back to the city's own coordinate so it's
  // always centered on the right place even with zero pins to show yet.
  const mapCenter = city.latitude != null && city.longitude != null ? { lat: city.latitude, lng: city.longitude } : null;

  return (
    <div>
      <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 0' }}>
        <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 8, fontFamily: 'var(--font-inter-tight)' }}>
          {city.name} Listings — Homes, Condos & Land For Sale, FL
        </h1>
        {/* Intro copy (2026-09-16, per Ryan, pasting the same "Search by
            City" dropdown screenshot that names this page — "Cocoa Beach
            Listings," "Indialantic Listings," etc. — from Nav.js): "Can you
            do it for these pages too. Just use properties in the place of
            homes, condos, & lots. Do it on all the city main pages." — same
            template already added to the sibling single-type page
            (app/[citySlug]/[propertySlug]/page.js's CITY_PAGE_TYPE_NOUN/
            CITY_PAGE_SEARCH_NOUN comment has the original request), but
            since this page always shows Homes + Condos + Land together
            (see effectivePropertyTypes above defaulting to all three),
            there's no single propertyType to pick a noun from — "properties"/
            "property" is hardcoded here instead of a per-type map, exactly
            matching Ryan's own substitution instruction. Uses this page's
            already-fetched city.name so it works correctly across every
            city with no hardcoded city list, same mechanism as the sibling
            page. "Contact Us Today" bold + underlined + a live link via
            ContactUsTrigger.js, identical <strong><ContactUsTrigger>
            pattern used everywhere else this copy has been added. */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
            Discover properties for sale in {city.name}, Florida, and let us make your property search easier.
            We&rsquo;ll help you compare properties, arrange private showings, negotiate with sellers, and guide you
            through every step from your initial search to closing.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)' }}>
            Start your {city.name} property search today.{' '}
            <strong>
              <ContactUsTrigger>Contact Us Today</ContactUsTrigger>
            </strong>{' '}
            to get started.
          </p>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12 }}>
          {total} result{total === 1 ? '' : 's'}
        </p>
      </div>

      <FilterBar
        waterfrontFlags={city.filters}
        showZoning
        excludeWaterfrontOptions={excludeWaterfrontOptions}
        show55Filter={show55Filter}
        extraActions={
          <>
            {showPropertyManagementCTA && <HarborIslandInquiryModals showForeclosures={false} areaLabel={city.name} />}
            <BuildingInquiryModal />
          </>
        }
      />

      <div className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 64px' }}>
        <ListingResultsLayout
          mapCenter={mapCenter}
          results={results}
          resultsLabel={total === 0 ? '0 results' : `${rangeStart}-${rangeEnd} of ${total} Listings`}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
