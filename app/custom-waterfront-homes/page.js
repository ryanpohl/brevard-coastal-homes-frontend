import Link from 'next/link';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * Custom Waterfront Homes guide (2026-09-30, per Ryan — second of two new
 * evergreen guide pages, paired with app/new-construction-viera/page.js;
 * same lightweight static pattern as app/flood-insurance/page.js).
 *
 * Covers Ryan's second focus area: building new or renovating directly on
 * the water in Melbourne Beach, Indialantic, Merritt Island, Cocoa Beach,
 * Indian Harbour Beach, and Satellite Beach, centered on Militano
 * Construction, the builder Ryan regularly refers this kind of business to
 * (founded 1986, based in Indian Harbour Beach, led by Kyle Militano —
 * summarized from militanoconstruction.com 2026-09-30). Per Ryan's explicit
 * instruction, this page does NOT link to militanoconstruction.com — he's
 * building Militano a new site and didn't want the old one linked from here.
 * Revisit once that new site is live to add the link back in.
 *
 * Land-page links below follow the per-city inventory check Ryan asked for
 * on 2026-09-30 (live counts that day): Melbourne Beach, Merritt Island,
 * Cocoa Beach, and Indialantic all had meaningful active land inventory, so
 * those get a direct, inviting link to their /land-for-sale page. Indian
 * Harbour Beach (2 active) and Satellite Beach (1 active) were thin enough
 * that a normal "browse" link would undersell what's actually available, so
 * those two route to Contact Us instead, framed around scarcity — this
 * needs a human read again periodically, since city inventory shifts and a
 * thin city today could easily have real inventory again later.
 */
export const metadata = {
  title: 'Custom Home Building & Renovation on Brevard’s Waterfront | Brevard Coastal Homes',
  description:
    'Building new or renovating directly on the water in Melbourne Beach, Indialantic, Merritt Island, Cocoa Beach, Indian Harbour Beach & Satellite Beach — what to know about land, coastal building requirements, and choosing a builder.',
  alternates: { canonical: '/custom-waterfront-homes' },
};

const FAQ_ITEMS = [
  {
    q: 'Is it realistic to buy land and build on Brevard’s oceanfront or riverfront?',
    a: 'It depends on the city. Melbourne Beach, Merritt Island, Cocoa Beach, and Indialantic regularly have a real number of buildable lots on the market. Indian Harbour Beach and Satellite Beach are far more built-out, so land comes up rarely in either — worth telling us what you’re looking for so we can flag a lot the moment one lists.',
  },
  {
    q: 'What makes building on the water different from building inland?',
    a: 'Mainly flood zone and elevation requirements. Homes in FEMA’s coastal high-hazard V/VE zones (common along the barrier island) or in A/AE zones near the Indian River Lagoon typically have to be built above a specific base flood elevation, which affects everything from the foundation type to where mechanical equipment goes. See our flood insurance guide for how zones work.',
  },
  {
    q: 'Do I need special permitting for wind/hurricane resistance?',
    a: 'Yes — Florida’s building code has coastal-specific wind load requirements that get stricter the closer you are to open water, covering things like impact windows, roof tie-downs, and garage door bracing. An experienced local builder will already be building to these standards; see our hurricane insurance guide for how that connects to your insurance costs down the line.',
  },
  {
    q: 'Can a builder handle a full renovation, not just new construction?',
    a: 'Many waterfront properties in these cities are older homes better suited to a full renovation or a teardown-rebuild than fresh land, depending on the lot and the existing structure’s condition. The builder we work with handles both new custom construction and full renovations/additions.',
  },
];

const LAND_CITIES = [
  { name: 'Melbourne Beach', slug: 'melbourne-beach', available: true },
  { name: 'Indialantic', slug: 'indialantic', available: true },
  { name: 'Merritt Island', slug: 'merritt-island', available: true },
  { name: 'Cocoa Beach', slug: 'cocoa-beach', available: true },
  { name: 'Indian Harbour Beach', slug: 'indian-harbour-beach', available: false },
  { name: 'Satellite Beach', slug: 'satellite-beach', available: false },
];

export default function CustomWaterfrontHomesPage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        Building or Renovating on Brevard&apos;s Waterfront
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
        In Melbourne Beach, Indialantic, Merritt Island, Cocoa Beach, Indian Harbour Beach, and Satellite Beach,
        resale inventory directly on the ocean or the Indian River Lagoon is limited and rarely exactly what a buyer
        has in mind. Buying the right lot &mdash; or fully renovating the right older home &mdash; and building with
        a builder who knows coastal construction can get you a lot closer to it.
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-muted)', marginBottom: 36 }}>
        This page is general information, not construction, engineering, or legal advice. Flood zones, wind-load
        requirements, and permitting vary by exact address and do change over time &mdash; confirm specifics with
        Brevard County and your builder before making any decisions.
      </p>

      <GuideSection title="A builder we regularly refer clients to">
        <p>
          For new custom construction and full renovations on Brevard&apos;s waterfront, we regularly refer clients to
          Militano Construction, a Brevard County builder founded in 1986 and based in Indian Harbour Beach, led by
          president Kyle Militano. They handle new custom home construction, renovations and additions, and
          commercial work, and coordinate directly with architects, interior designers, and landscape architects
          through the process rather than leaving a buyer to line those up separately.
        </p>
        <p>
          <ContactUsTrigger>Contact us</ContactUsTrigger> and we&apos;ll make the introduction and help you get a
          sense of scope and timeline for your specific lot or property.
        </p>
      </GuideSection>

      <GuideSection title="What's different about building on the water">
        <p>
          Coastal construction here comes with two considerations that don&apos;t apply as much further inland. The
          first is flood zone and elevation: homes in FEMA&apos;s coastal high-hazard V/VE zones (common along the
          barrier island) or in A/AE zones near the Indian River Lagoon typically need to be built above a specific
          base flood elevation, which shapes the foundation, garage/storage placement, and where mechanical equipment
          can go. See our{' '}
          <Link href="/flood-insurance" style={{ color: '#000', textDecoration: 'underline' }}>
            flood zone &amp; insurance guide
          </Link>{' '}
          for how zones are determined and what they mean for cost.
        </p>
        <p>
          The second is wind: Florida&apos;s building code sets stricter wind-load standards the closer a property is
          to open water &mdash; impact windows, roof tie-downs, and garage door bracing among them. A builder
          experienced with coastal Brevard construction, like the one above, already builds to these standards as a
          matter of course. See our{' '}
          <Link href="/hurricane-insurance" style={{ color: '#000', textDecoration: 'underline' }}>
            hurricane insurance guide
          </Link>{' '}
          for how wind mitigation features can lower your insurance costs once the home is built.
        </p>
      </GuideSection>

      <GuideSection title="Finding land, city by city">
        <p>
          Land availability varies a lot by city right now. Melbourne Beach, Merritt Island, Cocoa Beach, and
          Indialantic typically have a real number of buildable lots on the market at any given time:
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: 'var(--color-muted-dark)' }}>
          {LAND_CITIES.filter((c) => c.available).map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}/land-for-sale`} style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
                {c.name} Land For Sale &rarr;
              </Link>
            </li>
          ))}
        </ul>
        <p>
          Indian Harbour Beach and Satellite Beach are more built-out, and buildable lots come up far less often in
          either one. Rather than send you to a page with little to see, {' '}
          <strong>
            <ContactUsTrigger>tell us what you&apos;re looking for</ContactUsTrigger>
          </strong>{' '}
          in {LAND_CITIES.filter((c) => !c.available).map((c) => c.name).join(' or ')} and we&apos;ll reach out as
          soon as something matching comes on the market.
        </p>
      </GuideSection>

      <section style={{ marginBottom: 36 }}>
        <Faq items={FAQ_ITEMS} heading="Custom Waterfront Home Building FAQ" />
      </section>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Have a lot in mind, or looking for one first?</p>
        <p style={{ fontSize: 15 }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            Browse Brevard County Listings &rarr;
          </Link>
        </p>
        <p style={{ fontSize: 15, marginTop: 10 }}>
          <strong>
            <ContactUsTrigger>Contact Us</ContactUsTrigger>
          </strong>{' '}
          and we&apos;ll help you think through land, builder, and timeline together.
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
