'use client';

import { useState } from 'react';
import ListingCard from './ListingCard';
import ListingMap from './ListingMap';
import Pagination from './Pagination';

/**
 * Shared map + results-grid layout for the city (app/[citySlug]/[propertySlug]/page.js)
 * and neighborhood (app/neighborhoods/[slug]/page.js) search-results pages.
 *
 * Both of those pages are async Server Components, so the hover-highlight
 * state below has to live in a Client Component instead — this one. It
 * lifts a single `hoveredId` up from whichever ListingCard the visitor's
 * mouse is over, then feeds it back down to ListingMap so that card's pin
 * gets highlighted too. Per Ryan (2026-08-10), referencing a competitor
 * site's map-search UX: hovering a property card highlights the card and
 * shows the visitor where it sits on the map.
 */
export default function ListingResultsLayout({ mapCenter, results, mapZoom, resultsLabel, page, totalPages }) {
    const [hoveredId, setHoveredId] = useState(null);

  return (
        <div className="listing-page-layout">
          <div className="listing-page-map">
            <ListingMap center={mapCenter} listings={results} height="100%" zoom={mapZoom} hoveredListingId={hoveredId} />
    </div>

      <div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>{resultsLabel}</div>

        <div
          style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: 20,
          }}
        >
{results.map((listing) => (
              <ListingCard
                           key={listing.id}
              listing={listing}
              onHoverChange={(hovering) => setHoveredId(hovering ? listing.id : null)}
            />
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
  );
}
