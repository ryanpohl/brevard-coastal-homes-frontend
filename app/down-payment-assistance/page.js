import Link from 'next/link';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * Down Payment Assistance guide (2026-09-25, per Ryan — the site's first
 * piece of evergreen guide/blog-style content, flagged as a gap in the SEO
 * audit's "Other gaps" list). Static page, same lightweight pattern as
 * app/looking-to-sell/page.js — no CMS/blog infrastructure exists yet, and
 * one article doesn't justify building one; if more guides like this get
 * added later, this is the page to generalize into a
 * app/guides/[slug]/page.js pattern.
 *
 * Sourced 2026-09-25 directly from each program's own site rather than from
 * competitor articles (several of which turned out to have stale numbers —
 * e.g. one competitor's write-up of the Brevard County HFA program still
 * quoted a $10,000 second-mortgage cap that's actually $15,000 as of this
 * writing, and an outdated, much-lower purchase price limit):
 *   - Brevard County Purchase Assistance Program: brevardfl.gov/
 *     HousingAndHumanServices/HousingPrograms/PurchaseAssistanceProgram
 *   - Housing Finance Authority of Brevard County First-Time Homebuyer
 *     Program: brevardhfa.org
 *   - Florida Hometown Heroes Program: statewide program via Florida
 *     Housing Finance Corporation; Brevard-specific income limit is
 *     intentionally NOT hard-coded below (it's set per county and changes
 *     annually — confirmed current limits for the counties actually
 *     checked, but not Brevard's specific figure, so this points readers to
 *     a lender/floridahousing.org rather than risk publishing a stale
 *     number).
 * All dollar figures/limits here are exactly what's live on those sources
 * as of 2026-09-25 — these programs change funding levels and limits
 * year to year, so the page says so explicitly rather than implying these
 * numbers are permanent.
 */
export const metadata = {
  title: 'Brevard County Down Payment Assistance | Brevard Coastal Homes',
  description:
    'A 2026 guide to every down payment assistance program available to Brevard County home buyers — county, HFA, and Florida Hometown Heroes grants up to $75,000.',
  alternates: { canonical: '/down-payment-assistance' },
};

const FAQ_ITEMS = [
  {
    q: 'Can I combine more than one down payment assistance program?',
    a: 'Usually not two second-mortgage programs at once — but a Mortgage Credit Certificate can typically be paired with one of them. Because the rules change and depend on your specific loan, a participating lender is the best source for what you can combine.',
  },
  {
    q: 'Do I have to be a first-time home buyer to qualify?',
    a: "For the Brevard County and Brevard County HFA programs, yes — generally defined as not having owned a primary residence in the past three years (this is waived for qualifying military veterans). Florida Hometown Heroes is based on your employer/profession rather than first-time buyer status.",
  },
  {
    q: 'What credit score do I need?',
    a: 'The Brevard County HFA program and Florida Hometown Heroes both set a 640 minimum FICO score. The county Purchase Assistance Program does not publish a minimum score, but your first mortgage lender will still have its own requirement.',
  },
  {
    q: 'Is the assistance a grant I never have to pay back?',
    a: "No — all three programs here structure the assistance as a 0% interest, deferred second mortgage, not a grant. You don't make monthly payments on it, but it becomes due if you sell, refinance, or stop using the home as your primary residence, so budget accordingly.",
  },
  {
    q: 'How do I actually apply?',
    a: "You apply through a participating first-mortgage lender, not directly through the county or the state — the lender layers the assistance on top of your regular mortgage application. Reach out and we can point you to lenders in Brevard County who work with these programs regularly.",
  },
];

export default function DownPaymentAssistancePage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        Down Payment Assistance Programs in Florida: A Guide for Brevard County Buyers
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
        Saving a full down payment is the single biggest hurdle for most first-time buyers — but Brevard County
        buyers actually have three separate assistance programs to look into, and they aren&apos;t always well known.
        Here&apos;s what each one actually offers, who qualifies, and how they work.
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-muted)', marginBottom: 36 }}>
        Figures below are current as of 2026 and sourced directly from each program&apos;s administrator, but funding
        levels, income limits, and purchase price caps change from year to year. This page is general information,
        not financial or legal advice — confirm current details and your own eligibility with a participating
        lender before making decisions.
      </p>

      <ProgramSection
        title="Brevard County Purchase Assistance Program"
        source="Brevard County Housing and Human Services"
      >
        <p>
          Brevard County&apos;s own program, funded through the State Housing Initiatives Partnership (SHIP), offers
          up to <strong>$75,000</strong> for very-low-income buyers (at or below 50% of area median income) or up to{' '}
          <strong>$60,000</strong> for low-income buyers (51–80% AMI). The assistance is a 0% interest deferred
          payment loan recorded as a second mortgage — no monthly payments, but it&apos;s repaid in full if you
          sell, refinance, or stop using the home as your primary residence.
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: 'var(--color-muted-dark)' }}>
          <li>First-time buyers only (no ownership interest in a home in the past 3 years)</li>
          <li>Liquid assets can&apos;t exceed $15,000</li>
          <li>A 5-hour homebuyer education workshop is required</li>
          <li>Minimum buyer contribution: $500 (very-low income) or $1,000 (low income)</li>
          <li>Property must be in Brevard County, new or existing (manufactured homes excluded)</li>
        </ul>
        <p>
          Applications go through Community Housing Initiative, Brevard County&apos;s program administrator, at{' '}
          <a href="tel:+13212530053" style={{ color: 'inherit' }}>
            (321) 253-0053
          </a>
          .
        </p>
      </ProgramSection>

      <ProgramSection
        title="Housing Finance Authority of Brevard County First-Time Homebuyer Program"
        source="Brevard County Housing Finance Authority (brevardhfa.org)"
      >
        <p>
          Brevard County&apos;s Housing Finance Authority pairs a 30-year fixed-rate first mortgage (1.0% origination
          fee) with up to <strong>$15,000</strong> in down payment and closing cost assistance, structured the same
          way — a 0% interest, 30-year deferred second mortgage. Buyers can also request a Mortgage Credit
          Certificate worth up to $2,000 per year as a federal tax credit for the life of the loan.
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: 'var(--color-muted-dark)' }}>
          <li>Minimum 640 FICO score</li>
          <li>First-time buyers only (same 3-year rule, waived for qualifying veterans)</li>
          <li>Household income limit: $149,850</li>
          <li>Purchase price limit: $466,355 (most of Brevard County) or $592,211 in designated target areas</li>
          <li>Single-family homes, condos, townhomes, and PUDs in Brevard County</li>
        </ul>
        <p>
          Funds are available first-come, first-served through the Authority&apos;s participating lenders — there&apos;s no
          direct application to the county or the Authority itself.
        </p>
      </ProgramSection>

      <ProgramSection title="Florida Hometown Heroes Program" source="Florida Housing Finance Corporation, statewide">
        <p>
          Hometown Heroes is a statewide program open to Florida&apos;s community workforce — full-time employees of
          hospitals, K-12 schools, fire departments, law enforcement agencies, the courts, and licensed childcare
          facilities, among others. Eligibility is based on where you work, not your specific job title.
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: 'var(--color-muted-dark)' }}>
          <li>
            Down payment assistance equal to 5% of your first mortgage loan amount — a minimum of $10,000, up to
            $35,000
          </li>
          <li>0% interest, deferred second mortgage with no monthly payment</li>
          <li>Minimum 640 FICO score</li>
          <li>
            Income limits are set per county and adjusted annually — check current Brevard County limits with a
            participating lender or Florida Housing directly, since this figure isn&apos;t fixed statewide
          </li>
        </ul>
        <p>Like the two programs above, this is a deferred loan, not a grant — it&apos;s repaid when the home sells, is refinanced, or stops being your primary residence.</p>
      </ProgramSection>

      <div className="card" style={{ padding: 24, marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, marginBottom: 10, fontFamily: 'var(--font-inter-tight)' }}>Which one is right for you?</h2>
        <p style={{ color: 'var(--color-muted-dark)', lineHeight: 1.7 }}>
          It depends on your income, whether you&apos;ve owned a home before, and whether your employer qualifies
          for Hometown Heroes. A participating lender can run your numbers against all three at once — we work with
          buyers across Brevard County regularly and can point you toward lenders who handle these programs often.
        </p>
      </div>

      <section style={{ marginBottom: 36 }}>
        <Faq items={FAQ_ITEMS} heading="Down Payment Assistance FAQ" />
      </section>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Thinking about buying in Brevard County?</p>
        <p style={{ fontSize: 15 }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            Browse Brevard County Listings →
          </Link>
        </p>
        <p style={{ fontSize: 15, marginTop: 10 }}>
          Have a question about qualifying?{' '}
          <strong>
            <ContactUsTrigger>Contact Us</ContactUsTrigger>
          </strong>
        </p>
      </div>
    </div>
  );
}

function ProgramSection({ title, source, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 22, marginBottom: 4, fontFamily: 'var(--font-inter-tight)' }}>{title}</h2>
      <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>Source: {source}</p>
      <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-muted-dark)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </section>
  );
}
