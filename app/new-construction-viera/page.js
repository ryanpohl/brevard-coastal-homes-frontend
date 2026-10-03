import Link from 'next/link';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * New Construction in Viera guide (2026-09-30, per Ryan — new evergreen
 * guide page, same lightweight static pattern as app/flood-insurance/page.js
 * and app/down-payment-assistance/page.js; see those files' own comments
 * for why this doesn't use a CMS/blog route yet).
 *
 * Built after Ryan named Viera new construction as one of his two current
 * focus areas — specifically Viera Builders' Viera West communities, plus
 * Adelaide and Aripeka, which already have assigned/recognized builders.
 * This is a process/buyer's-agent-angle guide, not a community profile —
 * app/neighborhoods/adelaide and app/neighborhoods/aripeka already cover
 * each community's own amenities/schools/HOA in depth (see
 * lib/constants.js's NEIGHBORHOOD_AREA_GUIDE_CONTENT.adelaide/.aripeka),
 * so this page deliberately doesn't duplicate that content — it links out
 * to both rather than restating their full profiles, to avoid duplicate-
 * content overlap between the two pages.
 *
 * Builder facts below are pulled from the same already-sourced data those
 * two neighborhood pages use (lib/constants.js, sourced 2026-09-24 from
 * community/builder sites + current MLS listings), plus vierabuilders.com
 * and viera.com/homes/builders confirming Viera Builders is a single
 * builder brand (not a multi-builder collective) operating Viera West's six
 * sub-communities. Land-availability framing for Adelaide and Aripeka
 * reflects live inventory checked 2026-09-30 (Aripeka had active homesites;
 * Adelaide currently has none) — phrased to stay accurate as that inventory
 * changes rather than hard-coding a count that will go stale.
 */
export const metadata = {
  title: "New Construction in Viera, FL: Adelaide, Aripeka & Viera Builders | Brevard Coastal Homes",
  description:
    "A buyer's guide to new construction in Viera, FL — Viera Builders' Viera West communities, and the custom-build communities of Adelaide and Aripeka, plus what a buyer's agent does for you that a builder's on-site rep won't.",
  alternates: { canonical: '/new-construction-viera' },
};

const FAQ_ITEMS = [
  {
    q: 'Does it cost more to use a buyer’s agent when buying new construction?',
    a: 'No — the builder typically pays the buyer’s agent’s commission out of the same budget they’d otherwise spend on their own sales staff, so bringing your own agent from your very first visit to a model home or sales office usually costs you nothing extra.',
  },
  {
    q: 'Who builds in Viera Builders’ Viera West communities?',
    a: 'Viera Builders is a single production builder (not a collection of independent builders) operating across Viera West’s six sub-communities: Laurasia, Pangea Park, Reeling Park, Crossmolina, Farallon Fields, and Atlin Cove.',
  },
  {
    q: 'Who builds in Adelaide?',
    a: 'Adelaide is custom-build only, with three recognized builders: AR Homes (Rosewood Homes, Inc.), Christopher Burton Luxury Homes, and Elan Builders. Based on current MLS listings, completed and under-construction homes run roughly 3,550–5,500 sq ft and $2.35 million–$5.5 million.',
  },
  {
    q: 'Who builds in Aripeka, and can I still buy a vacant lot there?',
    a: 'Aripeka is a custom-build community with four builders: CDS Builders (Live Oak model), Joyal Homes (Sandhill Key model), LifeStyle Homes (Key Largo model), and Stanley Homes (Emerald model). Vacant homesites do come up — based on current MLS listings, they’ve run $150,000–$255,000 for lots between roughly a quarter-acre and half an acre.',
  },
  {
    q: 'What’s the difference between Viera West, Adelaide, and Aripeka?',
    a: 'Viera West’s communities are production-builder neighborhoods with a set list of floor plans from Viera Builders. Adelaide and Aripeka are both fully custom — you select from a small number of recognized builders and largely design the home yourself — with Adelaide the larger, higher-end of the two and Aripeka known for its wooded, natural-terrain lots.',
  },
];

export default function NewConstructionVieraPage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        Buying New Construction in Viera, FL: Adelaide, Aripeka &amp; Viera Builders&apos; Viera West
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
        Viera is one of Brevard County&apos;s most active areas for new construction, and it breaks down into three
        distinct paths depending on how much you want to customize: a production builder with a set list of floor
        plans, or one of two fully custom, builder-assigned communities. Here&apos;s how each one works.
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-muted)', marginBottom: 36 }}>
        Builder rosters and pricing below reflect current listings and builder-quoted figures as of 2026, but new
        construction pricing, available lots, and even a community&apos;s builder lineup can change. Confirm current
        availability and pricing directly with us or the builder before making any decisions.
      </p>

      <GuideSection title="Why use a buyer's agent for new construction?">
        <p>
          It&apos;s tempting to assume you don&apos;t need an agent if you&apos;re buying directly from a builder
          — but the sales representative staffing a builder&apos;s model home works for the builder, not for you,
          even though they&apos;re friendly and helpful. Their job is to sell that community&apos;s inventory at the
          best terms for the builder.
        </p>
        <p>
          Bringing your own buyer&apos;s agent from your very first visit typically costs you nothing extra &mdash;
          builders generally pay the buyer&apos;s agent commission out of the same budget they&apos;d otherwise spend
          on their own sales staff. What it gets you: someone who represents only your interests when it comes to lot
          premiums, upgrade pricing, negotiating on move-in-ready spec homes, reviewing the builder&apos;s contract
          (which is written by the builder&apos;s attorneys, not yours), and keeping the closing timeline on track.
        </p>
      </GuideSection>

      <GuideSection title="Production builder: Viera Builders in Viera West">
        <p>
          Viera West is home to six Viera Builders communities &mdash; Laurasia, Pangea Park, Reeling Park,
          Crossmolina, Farallon Fields, and Atlin Cove &mdash; all built by Viera Builders, a single production
          builder offering a set roster of floor plans across the group rather than a fully custom build. Based on
          current listings, pricing across these communities typically starts in the $600,000s and climbs past $1
          million depending on the community, floor plan, and lot.
        </p>
        <p>
          <Link href="/neighborhoods/viera-builders-communities-viera-west" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            Browse Viera Builders&apos; Viera West Communities &rarr;
          </Link>
        </p>
      </GuideSection>

      <GuideSection title="Fully custom: Adelaide">
        <p>
          Adelaide is a 460-acre gated, custom-home-only community in northern Viera, built around Lake Adelaide and
          a 25-acre water-to-wetlands preserve, split into four sections (The Reserve, The Preserve, The Lakes, and
          The Park). There&apos;s no production-builder tract here &mdash; three recognized builders work in
          Adelaide: AR Homes (Rosewood Homes, Inc.), Christopher Burton Luxury Homes, and Elan Builders. Based on
          current MLS listings, completed and under-construction homes run roughly 3,550&ndash;5,500 sq ft and $2.35
          million&ndash;$5.5 million.
        </p>
        <p>
          Adelaide&apos;s available homesites come and go in smaller numbers than a production community &mdash;
          if you&apos;re specifically looking for a vacant lot to build on rather than an already-underway home,{' '}
          <strong>
            <ContactUsTrigger>contact us</ContactUsTrigger>
          </strong>{' '}
          and we&apos;ll check current availability with the community&apos;s builders directly.
        </p>
        <p>
          <Link href="/neighborhoods/adelaide" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            See Adelaide Homes for Sale &rarr;
          </Link>
        </p>
      </GuideSection>

      <GuideSection title="Fully custom: Aripeka">
        <p>
          Aripeka is a roughly 400-acre gated community on the south side of Viera, laid out on former hunting land
          around its mature oak, palm, and pine trees rather than clearing them, giving it a wooded, old-Florida feel.
          It&apos;s a custom-build community with four builders: CDS Builders (Live Oak model), Joyal Homes (Sandhill
          Key model), LifeStyle Homes (Key Largo model), and Stanley Homes (Emerald model). Builder-quoted pricing
          starts around $1.2 million for a new build.
        </p>
        <p>
          Aripeka is also one of the few Viera communities where buying just the land is realistic right now &mdash;
          based on current MLS listings, available vacant homesites have run $150,000&ndash;$255,000 for lots between
          roughly a quarter-acre and half an acre.
        </p>
        <p>
          <Link href="/neighborhoods/aripeka" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            See Aripeka Homes &rarr;
          </Link>{' '}
          &middot;{' '}
          <Link href="/neighborhoods/aripeka?propertyType=Land" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            See Aripeka Lots &rarr;
          </Link>
        </p>
      </GuideSection>

      <section style={{ marginBottom: 36 }}>
        <Faq items={FAQ_ITEMS} heading="New Construction in Viera FAQ" />
      </section>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Not sure which Viera community fits what you&apos;re after?</p>
        <p style={{ fontSize: 15 }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            Browse Brevard County Listings &rarr;
          </Link>
        </p>
        <p style={{ fontSize: 15, marginTop: 10 }}>
          <strong>
            <ContactUsTrigger>Contact Us</ContactUsTrigger>
          </strong>{' '}
          and we&apos;ll walk you through current availability across all three.
        </p>
      </div>
    </div>
  );
}

function GuideSection({ title, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 22, marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>{title}</h2>
      <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-muted-dark)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </section>
  );
}
