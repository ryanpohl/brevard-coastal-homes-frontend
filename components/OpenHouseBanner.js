'use client';

import Link from 'next/link';
import { scheduleTour } from '@/lib/listingAsk';

/**
 * Open house banner at the top of a listing (2026-10-18, per Ryan): "Open
 * House Saturday, October 31 · 10 AM – 12 PM". Times come from the MLS
 * (backend upcomingOpenHouses — only ones still to come, Eastern time).
 * Buyers can find these times on the portals anyway, so the banner pairs
 * them with "Want Ryan to meet you there?", which opens the Schedule a
 * Tour popup with "meet me at the open house at {address}" in the message.
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

// "Saturday, October 31 · 10 AM – 12 PM"
function label(oh) {
  return [formatDay(oh.date), oh.start ? [formatTime(oh.start), formatTime(oh.end)].filter(Boolean).join(' – ') : null].filter(Boolean).join(' · ');
}

// `cityPage` ({ name, href }, 2026-10-26): links to that city's Open Houses
// page, where visitors can sign up for the Friday open house email.
export default function OpenHouseBanner({ openHouses, cityPage }) {
  if (!openHouses?.length) return null;
  return (
    <div className="open-house-banner">
      <div className="open-house-banner__times">
        <span className="open-house-banner__label">Open House</span>
        {openHouses.map((oh) => (
          <span key={`${oh.date}-${oh.start}`} className="open-house-banner__time">
            {label(oh)}
          </span>
        ))}
        {cityPage && (
          <Link href={cityPage.href} className="open-house-banner__link">
            See all {cityPage.name} open houses this weekend →
          </Link>
        )}
      </div>
      <button type="button" className="open-house-banner__btn" onClick={() => scheduleTour({ openHouse: true })}>
        Want Ryan to meet you there?
      </button>
    </div>
  );
}
