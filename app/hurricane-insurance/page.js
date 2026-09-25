import Link from 'next/link';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * Hurricane & Homeowners Insurance guide (2026-09-25, per Ryan — third
 * evergreen guide page, same lightweight static pattern as
 * app/down-payment-assistance/page.js and app/flood-insurance/page.js).
 *
 * Sourced 2026-09-25 directly from official/primary sources rather than
 * competitor round-ups (5 competitor URLs Ryan sent were fetched first —
 * two had no usable content at all (blocked by robots.txt, or metadata-only
 * pages), and none cited an authoritative source for the figures they did
 * give):
 *   - Florida's Hurricane Deductible (official rules: deductible options,
 *     trigger window, annual reset): myfloridacfo.com/division/consumers/
 *     consumerprotections/floridashurricanedeductible (FL Dept. of
 *     Financial Services)
 *   - Wind mitigation inspection form (OIR-B1-1802) and what it evaluates:
 *     truehomeinspects.com (Brevard/Indian River County home inspector),
 *     cross-checked against the form's own known categories
 *   - Citizens Property Insurance Corporation — what it is, the 20%
 *     "glass ceiling" eligibility rule: citizensfla.com/programs +
 *     nerdwallet.com's 2026 Citizens review
 *   - My Safe Florida Home program — confirmed it currently offers free
 *     wind mitigation inspections + matching grants via myfloridacfo.com/
 *     mysafeflhome, but current funding/enrollment windows have opened and
 *     closed before, so (same caution as the flood insurance guide's CRS
 *     discount and the down-payment guide's income limits) this
 *     deliberately does NOT hard-code a grant dollar amount or "currently
 *     open" status — points to mysafeflhome.com instead.
 *   - 4-point inspection age threshold (~30 years, varies by insurer):
 *     truehomeinspects.com
 * Illustrative dollar figures (wind mitigation inspection cost, impact
 * window cost per opening) are approximate market ranges from a local
 * inspector/insurer source, presented as "typically," not as quotes.
 */
export const metadata = {
  title: 'Hurricane & Homeowners Insurance in Brevard County, FL | Brevard Coastal Homes',
  description:
    "A 2026 guide to hurricane insurance in Brevard County — the hurricane deductible, wind mitigation credits, 4-point inspections, and Citizens Property Insurance explained for buyers.",
  alternates: { canonical: '/hurricane-insurance' },
};

const FAQ_ITEMS = [
  {
    q: 'Does my homeowners policy cover hurricane damage?',
    a: "Wind damage from a hurricane is covered under a standard Florida homeowners policy, but it's subject to a separate hurricane deductible rather than your regular deductible. Flood damage — including storm surge — is never covered by a homeowners policy; that requires a separate flood insurance policy.",
  },
  {
    q: "What is a hurricane deductible, and how much would I actually owe?",
    a: "Florida insurers are required to offer hurricane deductible choices of $500, 2%, 5%, or 10% of your dwelling coverage limit. On a $400,000 dwelling limit with a 2% deductible, that's $8,000 out of pocket before coverage kicks in. It only applies once per calendar year, starting when the National Hurricane Center issues a hurricane watch or warning for any part of Florida.",
  },
  {
    q: 'What is a wind mitigation inspection, and will it lower my premium?',
    a: "It's an inspection (using the state's official OIR-B1-1802 form) that documents features like your roof shape, how the roof is attached to the walls, and whether you have impact-rated windows or shutters. Verified features can qualify you for real premium credits — insurers weigh these differently, so ask your agent for a quote with and without the report.",
  },
  {
    q: 'Will I need a 4-point inspection to buy or insure an older home in Brevard County?',
    a: "Many insurers require one for homes roughly 30 years or older (the exact age varies by carrier). It checks the roof, electrical, plumbing, and HVAC systems for age and condition — not the same as a wind mitigation inspection, though they're often ordered together.",
  },
  {
    q: 'What is Citizens Property Insurance, and would I end up with it?',
    a: "Citizens is a state-created insurer that acts as Florida's insurer of last resort. You generally become eligible if no private insurer will write your home, or if private offers come in more than 20% above Citizens' rate for comparable coverage. It's usually a backstop, not a first choice — private carriers can offer broader coverage.",
  },
];

export default function HurricaneInsurancePage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        Hurricane &amp; Homeowners Insurance in Brevard County: What Buyers Need to Know
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
        Insurance is one of the biggest ongoing costs of owning a home in Brevard County, and hurricane risk is a big
        part of why. Here&apos;s how hurricane coverage actually works, what a wind mitigation inspection can do for
        your premium, and what to expect if you end up with Citizens Property Insurance.
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-muted)', marginBottom: 36 }}>
        Figures below are current as of 2026 and sourced from the Florida Department of Financial Services and other
        official sources, but insurance rules, premiums, and state programs change over time. This page is general
        information, not insurance or legal advice — confirm current details with a licensed Florida insurance
        agent.
      </p>

      <GuideSection title="Wind vs. flood: two different coverages">
        <p>
          These get confused constantly, and it matters: wind damage from a hurricane — including rain that gets in
          once wind creates an opening — is covered under a standard Florida homeowners policy, subject to a
          separate hurricane deductible (more on that below). Flood damage, including storm surge, is{' '}
          <strong>never</strong> covered by a homeowners policy, no matter how the water got in. That&apos;s a
          separate policy entirely — see our{' '}
          <Link href="/flood-insurance" style={{ color: 'inherit' }}>
            full flood insurance guide
          </Link>{' '}
          for zone-by-zone costs and requirements.
        </p>
      </GuideSection>

      <GuideSection title="The hurricane deductible">
        <p>
          Florida law requires insurers to offer a choice of hurricane deductibles: $500, 2%, 5%, or 10% of your
          dwelling coverage limit (homes insured between $1–3 million may see a 3% option in place of 2%). This
          deductible is separate from — and replaces — your regular deductible once it&apos;s triggered.
        </p>
        <p>
          It applies during the window beginning when the National Hurricane Center issues a hurricane watch or
          warning for any part of Florida, and ending 72 hours after the last such watch or warning for the state is
          lifted. It resets each calendar year; if a second hurricane hits in the same year, you&apos;d owe whichever
          is greater — the remaining balance of the first deductible, or your standard all-other-perils deductible.
        </p>
        <p>
          As an example: on a $400,000 dwelling coverage limit, a 2% hurricane deductible works out to $8,000 you&apos;d
          owe before coverage kicks in; at 5%, that&apos;s $20,000. Your actual dwelling coverage limit and chosen
          percentage determine your real number — ask your agent to show it in dollars, not just percent.
        </p>
      </GuideSection>

      <GuideSection title="Wind mitigation inspections & credits">
        <p>
          A wind mitigation inspection uses the state&apos;s official form (OIR-B1-1802) to document how well a home is
          built to resist hurricane winds: roof covering and age, how the roof deck attaches to the trusses, how the
          roof attaches to the walls, roof shape (hip roofs generally score better than gable), secondary water
          resistance under the roof covering, and opening protection — impact-rated windows/doors or code-compliant
          shutters.
        </p>
        <p>
          These inspections typically run in the $75–$150 range and can lead to meaningful premium credits — how much
          varies by insurer, so it&apos;s worth getting one done (or asking a seller for a current one) before you shop
          for a quote. Impact windows often run $1,000 or more per opening installed; hurricane shutters are a lower
          upfront-cost alternative that require deployment before a storm.
        </p>
      </GuideSection>

      <GuideSection title="Home age & the 4-point inspection">
        <p>
          Separate from wind mitigation, many insurers require a 4-point inspection on older homes — commonly around
          30 years or older, though the exact age threshold varies by carrier. It checks the age and condition of the
          roof, electrical panel and wiring, plumbing, and HVAC system. A roof needs to have some meaningful years of
          life left (insurers often look for 5+ years) to pass. This comes up often in Brevard County given how much
          of the housing stock along the barrier island and older neighborhoods was built decades ago.
        </p>
      </GuideSection>

      <GuideSection title="Citizens Property Insurance Corporation">
        <p>
          Citizens is a Florida state-created insurer that exists as a backstop — Florida&apos;s &ldquo;insurer of last
          resort.&rdquo; You generally become eligible for it if no private insurer will offer you a policy, or if the
          private-market offers you do get come in more than 20% above what Citizens would charge for comparable
          coverage. Citizens has grown substantially as some private insurers pulled back from the Florida market in
          recent years.
        </p>
        <p>
          Ending up with Citizens isn&apos;t unusual, especially for older or coastal homes, but it&apos;s generally
          treated as a fallback rather than a first choice — private carriers can offer broader coverage, and
          Citizens policyholders can be subject to assessments after a severe storm season. Your insurance agent can
          tell you where a specific property is likely to land.
        </p>
      </GuideSection>

      <GuideSection title="The My Safe Florida Home program">
        <p>
          The Florida Department of Financial Services runs My Safe Florida Home, a state program that offers
          eligible homeowners a free wind mitigation inspection and, in many cases, a matching grant to help pay for
          qualifying retrofits (things like a new roof, impact windows, or opening protection). Funding and
          enrollment windows have opened and closed over time, so check{' '}
          <a href="https://www.mysafeflhome.com" style={{ color: 'inherit' }} target="_blank" rel="noopener noreferrer">
            mysafeflhome.com
          </a>{' '}
          directly for current eligibility and whether the program is accepting applications.
        </p>
      </GuideSection>

      <section style={{ marginBottom: 36 }}>
        <Faq items={FAQ_ITEMS} heading="Hurricane Insurance FAQ" />
      </section>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Weighing insurance costs on a specific listing?</p>
        <p style={{ fontSize: 15 }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            Browse Brevard County Listings →
          </Link>
        </p>
        <p style={{ fontSize: 15, marginTop: 10 }}>
          Have a question about a property&apos;s insurance history or wind mitigation report?{' '}
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
