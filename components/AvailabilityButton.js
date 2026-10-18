'use client';

import { askIfAvailable } from '@/lib/listingAsk';

/**
 * "Is this home still available?" under the address on active listings
 * (2026-10-18, per Ryan: as many easy ways to reach out as possible without
 * a forced signup). Opens the Ask a Question popup with the question filled
 * in — see lib/listingAsk.js.
 */
export default function AvailabilityButton() {
  return (
    <button type="button" className="availability-btn" onClick={askIfAvailable}>
      Is this home still available?
    </button>
  );
}
