import { redirect } from 'next/navigation';
import * as api from '@/lib/api';
import ListingResultsLayout from '@/components/ListingResultsLayout';

// Hero search box results page (2026-09-13, per Ryan: "When I search by MLS
// number on the home page nothing happens. When i type in an address
// nothing happens either when I push search"). Before this page existed,
// SearchBar.js's "Address, City, or MLS Number" field captured what was
// typed into React state but never did anything with it on submit — the
// field looked real but was entirely dead. See SearchBar.js's handleSubmit
// for the other half of this fix (it now routes here with ?q=<what was
// typed>) and listings.controller.js's buildWhereClause for the matching
// backend mlsNumber/address filters this page relies on.
//
// Deliberately not indexed — this is a dynamic, visitor-driven query page
// (same reasoning as any site's internal search results), not evergreen
// content worth ranking on its own.
export const metadata = {
  title: 'Search Results | Brevard Coastal Homes',
  robots: { index: false, follow: true },
};

const PAGE_SIZE = 30;

// MLS numbers in this feed are purely numeric (e.g. "1075392" — see
// listings-api's migrations.js comment on mls_number, the PUBLIC MLS# —
// never mls_id, Spark's internal key). Anything else typed into the box
// (a street number + name, a city name, etc.) is treated as a partial,
// case-insensitive match against the listing's street address instead.
function isMlsNumber(q) {
  return /^\d+$/.test(q);
}

export default async function SearchPage({ searchParams: searchParamsPromise }) {
  // Next.js 15: searchParams is a Promise — same pattern as every other
  // dynamic route in this app (see e.g. app/[citySlug]/[propertySlug]/page.js).
  const searchParams = await searchParamsPromise;
  const q = (searchParams.q || '').trim();
  const page = Number(searchParams.page) || 1;

  let results = [];
  let total = 0;
  let totalPages = 1;

  if (q) {
    try {
      const data = await api.getListings({
        ...(isMlsNumber(q) ? { mlsNumber: q } : { address: q }),
        page,
        pageSize: PAGE_SIZE,
      });
      results = data.results || [];
      total = data.total ?? results.length;
      totalPages = data.totalPages || 1;
    } catch {
      // Backend unreachable — render an empty "no results" grid rather than crashing.
    }
  }

  // Exactly one match (the overwhelmingly common case for a real MLS# and
  // usually true for a specific street address too) — skip the results
  // grid entirely and take the visitor straight to that listing, matching
  // what Ryan and most real estate sites' address/MLS search actually do.
  // Left outside the try/catch above: redirect() works by throwing a
  // special Next.js control-flow error, which that catch block would
  // otherwise swallow as if the fetch had failed.
  if (results.length === 1 && total <= 1) {
    redirect(`/listings/${results[0].id}`);
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px' }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 8, fontFamily: 'var(--font-inter-tight)' }}>
        {q ? `Search Results for "${q}"` : 'Search'}
      </h1>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12 }}>
        {q ? `${total} result${total === 1 ? '' : 's'}` : 'Enter an address or MLS number above to search.'}
      </p>

      <ListingResultsLayout
        mapCenter={null}
        results={results}
        resultsLabel={total === 0 ? '0 results' : `${rangeStart}-${rangeEnd} of ${total} result${total === 1 ? '' : 's'}`}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
