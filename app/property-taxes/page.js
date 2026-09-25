import Link from 'next/link';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * Property Taxes & Florida Homestead Exemption guide (2026-09-25, per
 * Ryan — fourth evergreen guide page, same lightweight static pattern as
 * the down-payment-assistance/flood-insurance/hurricane-insurance guides).
 *
 * Ryan sent a screenshot of an AI-generated summary (with inline source
 * pills: BCPAO, Island Pineapple Realty, rocasells.com) plus 4 competitor/
 * reference URLs. Both were used only as a starting point — every figure
 * below was independently verified against primary sources, which was a
 * good thing to do: one of the 4 URLs (brevardhomesandcondos.com) got the
 * basic exemption structure wrong (claimed a single "$51,411" homestead
 * reduction figure, when the real structure is $25,000 + up to another
 * $25,000 — see below), which is exactly the kind of stale/incorrect
 * figure this engagement has been catching in competitor content since
 * the down-payment-assistance guide. Once a source got a checkable fact
 * wrong, its other figures (a specific millage range, "$800-$1,200/year
 * savings") were treated as unverified and left out rather than repeated.
 *
 * Sourced 2026-09-25 from:
 *   - Brevard County Property Appraiser (BCPAO) — official exemptions
 *     list, amounts, and filing deadline: bcpao.us/exemptions.aspx
 *   - Florida Dept. of Revenue — official Save Our Homes cap rule and the
 *     current (2026) CPI-based cap: floridarevenue.com/property/Documents/
 *     SaveOurHomes.pdf (revised January 2026)
 *   - Palm Beach County Property Appraiser — portability rules (statewide
 *     rule administered per-county; Brevard's own bcpao.us portability
 *     page wasn't fetched directly, but the $500,000 cap, the "by Jan 1 of
 *     the third year" window, and Form DR-501T are all state statute, not
 *     county-specific, so this source is authoritative): pbcpao.gov/
 *     portability.htm
 *   - Brevard County government's own Budget Office FAQ (confirmed the
 *     millage-rate concept but had no current specific rate figures)
 *   - taxbycounty.com, citing U.S. Census Bureau ACS 2019-2023 5-year
 *     estimates, for the illustrative effective tax rate / median bill —
 *     used instead of the two realtor blogs' figures since it's the only
 *     one of the bunch citing a checkable underlying dataset
 */
export const metadata = {
  title: 'Property Taxes & Homestead Exemption in Brevard County, FL | Brevard Coastal Homes',
  description:
    'A 2026 guide to Brevard County property taxes and the Florida homestead exemption — how much it saves, the Save Our Homes cap, portability, and how to file by March 1.',
  alternates: { canonical: '/property-taxes' },
};

const FAQ_ITEMS = [
  {
    q: 'How much does the Florida homestead exemption actually save me?',
    a: "It removes up to $50,000 from your home's taxable value: the first $25,000 applies to every taxing authority, including school taxes, and a second $25,000 applies only to assessed value between $50,000 and $75,000, and only to non-school taxes. The dollar savings depends on your local millage rate, but it's a meaningful cut on top of the Save Our Homes cap protecting you from future assessment spikes.",
  },
  {
    q: "What's the filing deadline, and can I file online?",
    a: 'March 1 of the year you want the exemption to apply — if you buy in 2026, you\'d file by March 1, 2027 for that tax year. Brevard County Property Appraiser (BCPAO) lets you file online, and once it\'s granted it renews automatically each year as long as you still own and live in the home as your permanent residence.',
  },
  {
    q: 'What is the Save Our Homes cap, and why does it matter?',
    a: "Once you have homestead status, your assessed value can't increase more than 3% a year, or the change in the Consumer Price Index, whichever is lower (2.7% for 2026). Over time that can create a real gap between your assessed value and market value — which is exactly what portability (see below) is designed to protect when you move.",
  },
  {
    q: "I'm moving from another Florida home — can I bring my tax savings with me?",
    a: "Often, yes, through portability. You can transfer up to $500,000 of your accumulated Save Our Homes benefit to a new Florida homestead, as long as you establish the new homestead by January 1 of the third year after leaving the old one. You'd file a portability application (Form DR-501T) alongside your new homestead exemption, by the same March 1 deadline.",
  },
  {
    q: 'Are there other property tax exemptions I might qualify for?',
    a: "Several: an additional exemption for limited-income seniors 65+, a $5,000 exemption for widows/widowers, blind persons, or non-total disabilities, and full (100%) exemptions for veterans or first responders with a service-connected or line-of-duty total and permanent disability, plus their surviving spouses. Eligibility and required documentation vary — BCPAO's exemptions page has the full list.",
  },
];

export default function PropertyTaxesPage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        Property Taxes &amp; the Florida Homestead Exemption in Brevard County
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
        Florida has no state income tax, but property taxes are a real, ongoing cost of owning here — and the
        homestead exemption is the single biggest way to lower yours. Here&apos;s how it works, what it&apos;s worth,
        and how it protects you over time.
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-muted)', marginBottom: 36 }}>
        Figures below are current as of 2026 and sourced from the Brevard County Property Appraiser and the Florida
        Department of Revenue, but exemption amounts, caps, and deadlines can change. This page is general
        information, not tax or legal advice — confirm your specific numbers with BCPAO or a tax professional.
      </p>

      <GuideSection title="How Brevard County property taxes work">
        <p>
          Your annual tax bill is your home&apos;s taxable assessed value multiplied by the local millage rate — a
          rate expressed as dollars per $1,000 of value, set separately by the county, your school district, your
          city, and any special districts, then combined. On top of that ad valorem (value-based) tax, your bill also
          includes flat non-ad valorem fees for things like solid waste or stormwater service.
        </p>
        <p>
          As a rough, county-wide reference point: recent Census data puts Brevard County&apos;s effective property
          tax rate at around 0.7% of home value, with a county-wide median annual bill in the low-to-mid $2,000s —
          your actual bill depends heavily on your specific city, district, and whether the home is homesteaded.
          BCPAO&apos;s tax roll tool can show the exact millage for any address.
        </p>
      </GuideSection>

      <GuideSection title="The Florida homestead exemption">
        <p>
          If you own a home in Florida and it&apos;s your permanent residence as of January 1 of the tax year, you can
          apply for the homestead exemption. It removes up to $50,000 from your taxable value in two parts:
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: 'var(--color-muted-dark)' }}>
          <li>
            <strong>The first $25,000</strong> applies to every taxing authority, including school district taxes.
          </li>
          <li>
            <strong>An additional exemption up to $25,000</strong> applies only to the portion of your assessed value
            between $50,000 and $75,000, and excludes school taxes.
          </li>
        </ul>
        <p>
          You must file with BCPAO by March 1 of the year you want the exemption applied — buy in 2026, and you&apos;d
          file by March 1, 2027 for that tax year (the year you close, you&apos;re taxed as the prior owner&apos;s
          assessment carries over). Once approved, it renews automatically each year as long as the home stays your
          permanent residence — no annual refiling required.
        </p>
      </GuideSection>

      <GuideSection title="The Save Our Homes cap">
        <p>
          Once you have homestead status, Florida&apos;s &ldquo;Save Our Homes&rdquo; rule caps how much your assessed
          value can rise each year: the lower of 3%, or the change in the Consumer Price Index. For 2026, that cap
          works out to 2.7%. Non-homesteaded property (second homes, rentals, land) has a separate, higher cap of
          10% per year.
        </p>
        <p>
          This is powerful the longer you own: even if your home&apos;s market value jumps well above 3% in a hot
          year, your taxable assessed value can&apos;t follow it up nearly as fast — which is also exactly why a gap
          can open up between what your home is worth and what it&apos;s taxed on the longer you stay.
        </p>
      </GuideSection>

      <GuideSection title="Portability: taking your savings with you">
        <p>
          If you already have a homesteaded property in Florida and you&apos;re buying another one here, you don&apos;t
          have to start your Save Our Homes benefit over from zero. Portability lets you transfer up to $500,000 of
          your accumulated savings to your new home, as long as you establish the new homestead by January 1 of the
          third year after leaving the old one — in practice, roughly a two-year window.
        </p>
        <p>
          You&apos;d file a Portability Application (Form DR-501T) alongside your new homestead exemption application,
          by the same March 1 deadline. If your new home is worth more than your old one, the ported amount reduces
          your new assessed value; if it&apos;s worth less, you can port a proportional share of the difference.
        </p>
      </GuideSection>

      <GuideSection title="Other exemptions you may qualify for">
        <p>Beyond the standard homestead exemption, Brevard County offers several others worth checking:</p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: 'var(--color-muted-dark)' }}>
          <li>
            <strong>Limited-income seniors (65+):</strong> an additional exemption, income-verified annually, filed
            between January 1 and April 30 — a different window than the March 1 deadline above.
          </li>
          <li>
            <strong>Widow/widower, blind, or non-total disability:</strong> $5,000 off taxable value for each,
            documentation required.
          </li>
          <li>
            <strong>Veterans &amp; first responders with a total, permanent, service-connected disability:</strong>{' '}
            a full (100%) exemption from ad valorem property taxes, extending to surviving non-remarried spouses.
          </li>
          <li>
            <strong>Veterans with a 10–100% service-connected disability:</strong> a $5,000 exemption, no homestead
            required.
          </li>
        </ul>
        <p>
          If you&apos;re a veteran, it&apos;s also worth reading our{' '}
          <Link href="/va-loans" style={{ color: 'inherit' }}>
            VA home loans guide
          </Link>{' '}
          — it covers these exemptions alongside VA financing itself.
        </p>
      </GuideSection>

      <section style={{ marginBottom: 36 }}>
        <Faq items={FAQ_ITEMS} heading="Property Taxes & Homestead Exemption FAQ" />
      </section>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Thinking about what homeownership costs will really look like?</p>
        <p style={{ fontSize: 15 }}>
          <Link href="/down-payment-assistance" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            See our down payment assistance guide →
          </Link>
        </p>
        <p style={{ fontSize: 15, marginTop: 10 }}>
          Have a question about taxes on a specific listing?{' '}
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
