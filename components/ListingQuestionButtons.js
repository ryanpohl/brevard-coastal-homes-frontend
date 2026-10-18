'use client';

import { askIfAvailable, askAboutOffers } from '@/lib/listingAsk';

/**
 * Ready-made questions under the address on active listings (2026-10-18,
 * per Ryan: as many easy ways to reach out as possible without a forced
 * signup) — "Is this home still available?" and "Have there been any other
 * offers?". Each opens the Ask a Question popup with the question filled
 * in; see lib/listingAsk.js.
 */
export default function ListingQuestionButtons() {
  return (
    <div className="listing-questions">
      <button type="button" className="availability-btn" onClick={askIfAvailable}>
        Is this home still available?
      </button>
      <button type="button" className="availability-btn" onClick={askAboutOffers}>
        Have there been any other offers?
      </button>
    </div>
  );
}
