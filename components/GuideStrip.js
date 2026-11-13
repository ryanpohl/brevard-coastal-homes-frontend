import Link from 'next/link';
import { GUIDE_TOWNS, relocationGuideHref } from '@/lib/relocationGuide';

/**
 * Slim relocation guide strip near the top of city "for sale" pages and
 * neighborhood pages (2026-11-13, per Ryan): the guide was the week's top
 * lead source, but on phones its full offer sat 8 to 18 screens down. The
 * full RelocationGuidePromo / OutOfStateBuyers boxes stay below the listings.
 */
export default function GuideStrip({ townSlug }) {
  const town = GUIDE_TOWNS[townSlug];
  return (
    <Link href={relocationGuideHref(townSlug)} className="guide-strip">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="guide-strip__cover" src="/guides/relocation-cover.webp" alt="" width="28" height="36" loading="lazy" />
      <span className="guide-strip__text">
        <strong>{town ? `Moving to ${town}?` : 'Moving to Brevard?'}</strong> Get the free relocation guide
      </span>
      <span className="guide-strip__arrow" aria-hidden="true">
        &rarr;
      </span>
    </Link>
  );
}
