'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScheduleShowingModal from './ScheduleShowingModal';
import { relocationGuideHref } from '@/lib/relocationGuide';

/**
 * "Buying from out of state?" box (2026-11-02, per Ryan: his Google Ads
 * reach out-of-state and out-of-town buyers, who mostly don't have an
 * agent here yet). Below the listings on city and neighborhood pages, so
 * it doesn't crowd the top for local visitors. Two ways in:
 *   - Schedule a Video Tour: the usual showing form with "Virtual" picked.
 *   - The free relocation guide, opening with this town when it has a
 *     section (replaces RelocationGuidePromo on city pages, so there's one
 *     box, not two).
 */
export default function OutOfStateBuyers({ townSlug }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className="guide-promo guide-promo--light oos-box" aria-label="Buying from out of state">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="guide-promo__cover" src="/guides/relocation-cover.webp" alt="" width="96" height="124" loading="lazy" />
      <div className="guide-promo__text">
        <div className="guide-promo__eyebrow">Buying from out of state?</div>
        <div className="guide-promo__title">See homes without making the trip</div>
        <div className="guide-promo__sub">
          Ryan does live video tours, can preview homes in person for you, and handles everything through closing, even if
          you can&apos;t be here.{' '}
          <Link href={relocationGuideHref(townSlug)} className="oos-box__guide">
            Get the free relocation guide
          </Link>
        </div>
      </div>
      <button type="button" className="btn btn-gold guide-promo__btn" onClick={() => setOpen(true)}>
        Schedule a Video Tour
      </button>
      {open && <ScheduleShowingModal initialTourType="virtual" onClose={() => setOpen(false)} />}
    </aside>
  );
}
