import Link from 'next/link';
import GuideForm from './GuideForm';
import { GUIDE_TOWNS, RELOCATION_GUIDE_PATH } from '@/lib/relocationGuide';
import { withSocialPreview } from '@/lib/socialPreview';

/**
 * Landing page for the free "Moving to Brevard County" relocation guide
 * (2026-10-11, per Ryan). Visitors leave an email (name, phone, where
 * they're moving from and when are optional) and the backend emails the
 * PDF, notifies Ryan and adds them to the CRM. ?town=<city slug> (from a
 * city page's offer) personalizes the heading and the email.
 */
export const metadata = withSocialPreview({
  title: 'Free Brevard County Relocation Guide | Moving to the Space Coast | Brevard Coastal Homes',
  description:
    'Moving to Brevard County, FL? Get the free relocation guide: which Space Coast town fits you, commute times, property taxes and homestead, insurance, condo rules and buying from out of state.',
  alternates: { canonical: RELOCATION_GUIDE_PATH },
});

const INSIDE = [
  ['Which town fits you', 'Beach towns vs. mainland, with typical commute times to Kennedy Space Center and the Melbourne tech corridor.'],
  ['Town-by-town profiles', 'Cocoa Beach, Satellite Beach, Indian Harbour Beach, Indialantic, Melbourne Beach, Merritt Island, Viera, Rockledge and Melbourne — plus Titusville, Cocoa and Palm Bay.'],
  ['The costs people don’t expect', 'Property taxes and the homestead exemption, hurricane deductibles, wind mitigation, flood zones, and condo fees and inspections.'],
  ['Buying from out of state', 'Video tours, inspection periods, insurance quotes, remote closings, and a new-resident checklist.'],
];

export default async function RelocationGuidePage({ searchParams }) {
  const { town } = await searchParams;
  const townName = GUIDE_TOWNS[town];
  return (
    <div className="guide-landing">
      <section className="container guide-landing__hero">
        <div className="guide-landing__intro">
          <div className="guide-landing__eyebrow">Free relocation guide · 2026</div>
          <h1>{townName ? `Moving to ${townName}?` : 'Moving to Brevard County?'}</h1>
          <p className="guide-landing__lede">
            Get the free <strong>Brevard County Relocation Guide</strong>: an 11-page, town-by-town look at Florida&rsquo;s
            Space Coast, plus the costs, insurance and steps to know before you buy here.
          </p>
        </div>
        {/* On phones the form comes right after the headline; the list follows. */}
        <div className="guide-landing__side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="guide-landing__cover" src="/guides/relocation-cover.webp" alt="The Brevard County Relocation Guide cover" width="300" height="388" />
          <GuideForm town={townName ? town : ''} />
        </div>
        <ul className="guide-landing__inside">
          {INSIDE.map(([title, text]) => (
            <li key={title}>
              <strong>{title}.</strong> {text}
            </li>
          ))}
        </ul>
      </section>

      <section className="container guide-landing__peek">
        <h2>A look inside</h2>
        <div className="guide-landing__pages">
          {[
            ['relocation-towns-fit', 'Which town fits you?'],
            ['relocation-beach-towns', 'Town-by-town profiles'],
            ['relocation-costs', 'The costs people don’t expect'],
          ].map(([img, label]) => (
            <figure key={img}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/guides/${img}.webp`} alt={`Guide page: ${label}`} width="300" height="388" loading="lazy" />
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container guide-landing__about">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/team/ryan-headshot.jpg" alt="Ryan Pohl" width="120" height="120" loading="lazy" />
        <div>
          <h2>From Ryan Pohl</h2>
          <p>
            I help buyers relocating to Brevard County find the right town, neighborhood and home, whether you&rsquo;re here
            for a scouting weekend or buying from a thousand miles away. Questions before you download? Call or text me at{' '}
            <a href="tel:+13213507661">321-350-7661</a>.
          </p>
          <p className="guide-landing__small">
            Ryan Pohl, Realtor · Tropical Realty &amp; Inv. of Brevard · Prefer to read online? See{' '}
            <Link href="/moving-to-brevard">Moving to Brevard County</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
