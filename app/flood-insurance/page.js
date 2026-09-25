import Link from 'next/link';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * Flood Zones & Flood Insurance guide (2026-09-25, per Ryan — second
 * evergreen guide page, same lightweight static pattern as
 * app/down-payment-assistance/page.js; see that file's own comment for why
 * this doesn't use a CMS/blog route yet).
 *
 * Sourced 2026-09-25 directly from official/authoritative sources rather
 * than competitor round-ups:
 *   - Brevard County flood zone lookup, NFIP participation, coverage
 *     limits, elevation certificates, CRS program: brevardfl.gov/
 *     PublicWorks/EngineeringProgram/FloodZoneInformation
 *   - Zone-by-zone average premiums (Zone V/A/X) and the Risk Rating 2.0
 *     18%/year rate-increase cap: NerdWallet's 2026 Florida flood
 *     insurance guide (nerdwallet.com/insurance/homeowners/learn/
 *     flood-insurance-florida)
 * Brevard County's specific CRS class/discount percentage is deliberately
 * NOT hard-coded below — couldn't confirm the current class number from an
 * authoritative source, and CRS classes get re-verified annually, so this
 * points readers to the county and their insurance agent instead of
 * risking a stale/wrong number (same caution applied to Florida Hometown
 * Heroes' county-specific income limit on the down-payment-assistance
 * page).
 */
export const metadata = {
  title: 'Flood Insurance in Brevard County, FL | Brevard Coastal Homes',
  description:
    'A 2026 guide to Brevard County flood zones and flood insurance — how to find your zone, typical NFIP costs by zone, and when coverage is required.',
  alternates: { canonical: '/flood-insurance' },
};

const FAQ_ITEMS = [
  {
    q: 'How do I find out my flood zone in Brevard County?',
    a: "Brevard County's Public Works department maintains an online flood zone map at gis.brevardfl.gov, or you can look up any address directly on FEMA's Flood Map Service Center. For a listing you're actively considering, we can pull the flood zone for you.",
  },
  {
    q: 'Is flood insurance required to buy a home in Brevard County?',
    a: "It's required by your mortgage lender if the home sits in a Special Flood Hazard Area (a zone with at least a 1% annual chance of flooding) and you're using a federally backed loan. Outside those zones it's optional, though many owners carry it anyway given how much of Brevard County is coastal.",
  },
  {
    q: 'How much does flood insurance actually cost here?',
    a: "It varies a lot by zone. Statewide NFIP averages run around $637/year in lower-risk Zone X, $1,313/year in Zone A, and $2,413/year in coastal Zone V — but your specific premium depends on your elevation, the age and construction of the structure, and your coverage limits. An insurance agent can quote your exact property.",
  },
  {
    q: 'Can flood insurance premiums jump a lot after I buy?',
    a: "Under FEMA's Risk Rating 2.0 system, annual increases are capped at 18% per year for most policies, so a policy transferred at closing won't spike overnight — but it can still rise steadily year over year if your risk-based rate is higher than what's currently being charged.",
  },
  {
    q: 'What does flood insurance actually cover, and what does it not cover?',
    a: "NFIP policies cover the structure up to $250,000 and contents up to $100,000 for a residential property — separate limits, and you need to buy contents coverage separately if you want it. Flood damage is NOT covered by a standard homeowners policy, which is exactly why this is a separate policy in the first place.",
  },
];

export default function FloodInsurancePage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        Flood Zones & Flood Insurance in Brevard County: What Buyers Need to Know
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
        With barrier island cities on one side and the Indian River Lagoon on the other, flood risk — and flood
        insurance — comes up in almost every Brevard County home search. Here&apos;s what the zones actually mean,
        what coverage typically costs, and when you&apos;re required to carry it.
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-muted)', marginBottom: 36 }}>
        Figures below are current as of 2026 and sourced directly from Brevard County and NFIP data, but flood zone
        maps and insurance rates change over time. This page is general information, not insurance or legal advice —
        confirm your specific zone and premium with the county and a licensed insurance agent.
      </p>

      <GuideSection title="Understanding flood zones">
        <p>
          FEMA flood maps divide Brevard County into zones based on flood risk. The two you&apos;ll see most often on
          a listing or a lender&apos;s disclosure:
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: 'var(--color-muted-dark)' }}>
          <li>
            <strong>Zone V / VE</strong> — coastal high-hazard areas subject to storm wave action. Most common along
            the barrier island (Cocoa Beach, Satellite Beach, Melbourne Beach, and similar oceanfront areas).
          </li>
          <li>
            <strong>Zone A / AE</strong> — inland high-risk areas near rivers, lakes, or the Indian River Lagoon, with
            at least a 1% annual chance of flooding but without the coastal wave-action risk of V/VE.
          </li>
          <li>
            <strong>Zone X</strong> — moderate-to-low risk. Flood insurance usually isn&apos;t required here, though it
            can still be a smart idea in a county this close to the coast.
          </li>
        </ul>
        <p>
          Both zone and distance to water vary block by block, not just city by city — two homes a few streets apart
          can be in different zones, so always check the specific address rather than assuming based on the city
          name alone.
        </p>
      </GuideSection>

      <GuideSection title="How to find your flood zone">
        <p>
          Brevard County&apos;s Public Works department maintains the official, current flood zone map at{' '}
          <a href="https://gis.brevardfl.gov/public_works/flood_map/" style={{ color: 'inherit' }} target="_blank" rel="noopener noreferrer">
            gis.brevardfl.gov
          </a>
          , and you can look up any U.S. address directly on{' '}
          <a href="https://msc.fema.gov/portal/search" style={{ color: 'inherit' }} target="_blank" rel="noopener noreferrer">
            FEMA&apos;s Flood Map Service Center
          </a>
          . For elevation certificates on a specific structure, Brevard County&apos;s floodplain office can be reached
          at{' '}
          <a href="tel:+13216177340" style={{ color: 'inherit' }}>
            (321) 617-7340
          </a>
          .
        </p>
      </GuideSection>

      <GuideSection title="What flood insurance typically costs">
        <p>
          Flood insurance is priced separately from your regular homeowners policy — standard homeowners insurance
          does not cover flood damage. Through the National Flood Insurance Program (NFIP), statewide Florida
          averages run roughly:
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: 'var(--color-muted-dark)' }}>
          <li>Zone X (lower risk): around $637/year</li>
          <li>Zone A (inland high-risk): around $1,313/year</li>
          <li>Zone V (coastal high-risk): around $2,413/year</li>
        </ul>
        <p>
          Your actual premium depends on your home&apos;s elevation, age, construction, and coverage limits — these are
          averages, not quotes. Under FEMA&apos;s current Risk Rating 2.0 system, most policies can&apos;t increase more
          than 18% in a single year, so a policy you take over at closing won&apos;t spike overnight, even if it&apos;s
          below full risk-based pricing.
        </p>
      </GuideSection>

      <GuideSection title="Is it required, and what does it cover?">
        <p>
          If a home is in a Special Flood Hazard Area (at least a 1% annual chance of flooding) and you&apos;re using a
          federally backed mortgage, your lender will require flood insurance as a condition of the loan. Outside
          those zones it&apos;s optional — but given how much of Brevard County sits near the coast or the Indian River
          Lagoon, plenty of owners in lower-risk zones carry it anyway.
        </p>
        <p>
          NFIP policies cover the structure itself up to $250,000 and contents up to $100,000, as two separate
          coverage amounts — you have to elect contents coverage if you want it. There&apos;s typically a 30-day
          waiting period before a new policy takes effect, so this isn&apos;t something to leave until the week of
          closing.
        </p>
      </GuideSection>

      <GuideSection title="Community Rating System discounts">
        <p>
          Brevard County participates in FEMA&apos;s Community Rating System (CRS), a voluntary program that rewards
          local floodplain management efforts with flood insurance discounts for residents — the county&apos;s own
          floodplain office describes it as providing &ldquo;reduced premiums for flood insurance&rdquo; countywide.
          The exact discount depends on the county&apos;s current CRS class rating, which is reverified periodically, so
          ask your insurance agent or the county&apos;s floodplain office what the current discount looks like for your
          property.
        </p>
      </GuideSection>

      <section style={{ marginBottom: 36 }}>
        <Faq items={FAQ_ITEMS} heading="Flood Insurance FAQ" />
      </section>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Weighing flood risk on a specific listing?</p>
        <p style={{ fontSize: 15 }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            Browse Brevard County Listings →
          </Link>
        </p>
        <p style={{ fontSize: 15, marginTop: 10 }}>
          Have a question about a property&apos;s flood zone or coverage?{' '}
          <strong>
            <ContactUsTrigger>Contact Us</ContactUsTrigger>
          </strong>
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
