import Link from 'next/link';
import { GUIDE_TOWNS, relocationGuideHref } from '@/lib/relocationGuide';

/**
 * "Moving to {town}? Get the free Brevard County Relocation Guide" offer
 * (2026-10-11, per Ryan) — on the homepage, city pages and the buyer
 * guide pages. `variant="light"` is a cream card for light page sections
 * (homepage, Buyer Resources). Links to the guide's landing page; from a city page it
 * carries the town, so the page and the email open with that town.
 */
export default function RelocationGuidePromo({ townSlug, compact = false, variant = 'dark' }) {
  const town = GUIDE_TOWNS[townSlug];
  return (
    <aside
      className={`guide-promo${compact ? ' guide-promo--compact' : ''}${variant === 'light' ? ' guide-promo--light' : ''}`}
      aria-label="Free relocation guide"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="guide-promo__cover" src="/guides/relocation-cover.webp" alt="" width="96" height="124" loading="lazy" />
      <div className="guide-promo__text">
        <div className="guide-promo__eyebrow">Free relocation guide</div>
        <div className="guide-promo__title">{town ? `Moving to ${town}?` : 'Moving to Brevard County?'}</div>
        <div className="guide-promo__sub">
          Get the free Brevard County Relocation Guide: which town fits you, property taxes, insurance, condo rules and
          buying from out of state.
        </div>
      </div>
      <Link href={relocationGuideHref(townSlug)} className="btn btn-gold guide-promo__btn">
        Get the Free Guide
      </Link>
    </aside>
  );
}
