'use client';

import { scheduleTour } from '@/lib/listingAsk';

/**
 * Open house banner at the top of a listing (2026-10-18, per Ryan): "Open
 * House Saturday, October 31 · 10 AM – 12 PM". Times come from the MLS
 * (backend upcomingOpenHouses — only ones still to come, Eastern time).
 * Buyers can find these times on the portals anyway, so the banner pairs
 * them with "Want Ryan to meet you there?", which opens the Schedule a
 * Tour popup, so they reach out before they walk in.
 */
function formatDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function formatTime(hhmm) {
  if (!hhmm) return '';
  const [h, min] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return min ? `${hour}:${String(min).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`;
}

export default function OpenHouseBanner({ openHouses }) {
  if (!openHouses?.length) return null;
  return (
    <div className="open-house-banner">
      <div className="open-house-banner__times">
        <span className="open-house-banner__label">Open House</span>
        {openHouses.map((oh) => (
          <span key={`${oh.date}-${oh.start}`} className="open-house-banner__time">
            {formatDay(oh.date)}
            {oh.start && (
              <>
                {' · '}
                {formatTime(oh.start)}
                {oh.end && <> – {formatTime(oh.end)}</>}
              </>
            )}
          </span>
        ))}
      </div>
      <button type="button" className="open-house-banner__btn" onClick={scheduleTour}>
        Want Ryan to meet you there?
      </button>
    </div>
  );
}
