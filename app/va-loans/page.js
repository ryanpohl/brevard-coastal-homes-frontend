import Link from 'next/link';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * VA Home Loans guide (2026-09-25, per Ryan — sixth evergreen guide page,
 * Task #66 from the SEO suggestions list, same lightweight static pattern
 * as the other five guides in app/).
 *
 * Ryan sent 7 competitor URLs. Figures below were cross-checked against
 * primary/official sources rather than trusted as-is, the same discipline
 * used on every guide so far:
 *   - VA eligibility/service requirements & Certificate of Eligibility:
 *     va.gov/housing-assistance/home-loans/eligibility/ (U.S. Dept. of
 *     Veterans Affairs — official)
 *   - VA funding fee rates and exemptions: cross-checked against multiple
 *     lender sources (veteransunited.com, spacecoastbydonell.com,
 *     morganfinancial.net) — all independently agree on 2.15% first-use/
 *     no-down-payment, 3.30% subsequent-use/no-down-payment, 1.50% at 5%+
 *     down, 1.25% at 10%+ down, and a full exemption for veterans with any
 *     service-connected disability rating (also Purple Heart recipients
 *     and certain surviving spouses).
 *   - Brevard County veteran property tax exemptions: bcpao.us/veterans.aspx
 *     (Brevard County Property Appraiser — official). IMPORTANT: one
 *     competitor source (spacecoastbydonell.com) repeated the same wrong
 *     "$51,411" homestead exemption figure already caught and rejected on
 *     the property-taxes guide — not used here. The real, BCPAO-confirmed
 *     figures are a $5,000 exemption for a 10%+ service-connected
 *     disability rating (stacking with the up-to-$50,000 standard
 *     homestead exemption, for up to $55,000 off assessed value combined),
 *     full exemption from all ad valorem property tax for veterans with a
 *     service-connected total & permanent disability, an age-65+ combat-
 *     related disability discount, a deployed-servicemember exemption, and
 *     100% ad valorem relief for surviving spouses of veterans who died in
 *     the line of duty.
 * Deliberately does NOT hard-code current mortgage interest rates or
 * county-specific loan limits (full VA entitlement has no county loan
 * limit as of this writing, but the underlying entitlement/appraisal
 * mechanics are lender- and case-specific) — points readers to a
 * VA-experienced lender for those instead.
 */
export const metadata = {
  title: 'VA Home Loans in Brevard County, FL: A Veteran’s Buying Guide | Brevard Coastal Homes',
  description:
    'A 2026 guide to VA home loans for Brevard County veterans — eligibility, the VA funding fee, Florida appraisal quirks, and property tax exemptions for veterans.',
  alternates: { canonical: '/va-loans' },
};

const FAQ_ITEMS = [
  {
    q: 'Do I have to be a combat veteran to qualify for a VA loan?',
    a: 'No. Eligibility is based on service requirements that vary by era and duty status — most veterans, active-duty service members, and many National Guard/Reserve members qualify, along with certain surviving spouses. The only way to know for sure is a Certificate of Eligibility (COE), which your lender can typically pull for you or you can request directly through VA.gov.',
  },
  {
    q: 'Is the VA funding fee the same for every veteran?',
    a: "No. It depends on your down payment and whether it's your first time using the benefit — roughly 1.25% to 3.3% of the loan amount — and veterans with any service-connected disability rating are fully exempt from it, as are Purple Heart recipients and certain surviving spouses.",
  },
  {
    q: 'Can I buy a condo with a VA loan in Brevard County?',
    a: 'Yes, but the specific condo building has to be on the VA-approved condo list first — not every building on the barrier island qualifies. Your lender or agent can check a specific building before you write an offer.',
  },
  {
    q: 'Does the VA appraisal replace a home inspection?',
    a: "No, and this trips people up. The VA appraisal confirms market value and checks the VA's Minimum Property Requirements (safety, structural soundness, sanitation) — it's not a substitute for a full home inspection, which is still on you as the buyer to order separately.",
  },
  {
    q: 'What Florida-specific issues come up with VA loans?',
    a: "Termite (wood-destroying organism) inspections are effectively mandatory here, roof age and condition get close scrutiny since it drives both the appraisal and your insurance quote, and any pool needs a compliant safety barrier. Our hurricane insurance guide covers wind mitigation inspections, which can meaningfully lower your homeowners premium.",
  },
];

export default function VaLoansPage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        VA Home Loans in Brevard County, FL: A Veteran&apos;s Buying Guide
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
        Brevard County is home to a large military and veteran community, and a VA loan is one of the strongest
        benefits available to buy here. Here&apos;s what to know about eligibility, costs, and the Florida-specific
        details that come up along the way.
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-muted)', marginBottom: 36 }}>
        Figures below are current as of 2026 and sourced from official VA and Brevard County sources where
        available. This page is general information, not financial, tax, or legal advice — confirm your specific
        eligibility and numbers with a VA-experienced lender.
      </p>

      <GuideSection title="Who qualifies for a VA loan">
        <p>
          Eligibility depends on your service period and duty status. In general, active-duty service members need
          at least 90 continuous days of service; veterans from the Gulf War era to today typically need 24
          continuous months of service (or the full period they were called to active duty, or 90 days under certain
          qualifying discharges); National Guard and Reserve members generally need at least 90 days of non-training
          active duty, or 6 creditable years of service. Certain surviving spouses also qualify.
        </p>
        <p>
          The only way to know for certain is a Certificate of Eligibility (COE) — most lenders can pull this for
          you in minutes, or you can request it yourself through VA.gov.
        </p>
      </GuideSection>

      <GuideSection title="The core benefits">
        <p>
          A VA loan can finance up to 100% of the purchase price — no down payment required for most qualifying
          buyers — and, unlike a conventional loan with less than 20% down, there&apos;s no monthly private mortgage
          insurance (PMI) at all. That alone can mean a meaningfully lower monthly payment compared to a conventional
          buyer putting down the same amount. VA loans also don&apos;t require a minimum credit score by VA rule,
          though individual lenders still set their own.
        </p>
        <p>
          If you have full entitlement (meaning you haven&apos;t used your VA loan benefit before, or you have and it
          was fully restored), there&apos;s no VA-imposed loan limit — what you can borrow comes down to your
          income, credit, and a lender&apos;s own approval, same as any other loan.
        </p>
      </GuideSection>

      <GuideSection title="The VA funding fee">
        <p>
          Most VA loans carry a one-time funding fee, which can be rolled into the loan rather than paid in cash at
          closing. For a purchase loan, it&apos;s roughly 2.15% of the loan amount with no down payment on a first
          use (3.3% on a subsequent use), dropping to 1.5% with at least 5% down and 1.25% with at least 10% down,
          regardless of prior use.
        </p>
        <p>
          Veterans with any service-connected disability rating are fully exempt from the funding fee, as are Purple
          Heart recipients and certain surviving spouses — worth confirming with your lender before you assume the
          fee applies to you.
        </p>
      </GuideSection>

      <GuideSection title="The VA appraisal, and Florida-specific quirks">
        <p>
          A VA appraisal does two things: it confirms the home&apos;s market value, and it checks the VA&apos;s
          Minimum Property Requirements (MPRs) — that the home is safe, structurally sound, and sanitary. It is
          not a substitute for a full home inspection, which is still worth ordering separately as the buyer.
        </p>
        <p>
          A few things come up more often in Florida specifically: a wood-destroying organism (termite) inspection is
          effectively standard, roof age and condition get close scrutiny (it affects both the appraisal and your
          insurance quote), any pool needs a code-compliant safety barrier, and rural properties may need separate
          well and septic testing. Coastal homes often benefit from a wind mitigation inspection — see our{' '}
          <Link href="/hurricane-insurance" style={{ color: 'inherit' }}>
            hurricane insurance guide
          </Link>{' '}
          for what that can save you on premiums.
        </p>
      </GuideSection>

      <GuideSection title="Buying a condo with a VA loan">
        <p>
          If you&apos;re considering a condo — common along Brevard&apos;s barrier island — the specific building
          has to appear on the VA&apos;s approved condo list before a VA loan can be used there. Not every building
          qualifies, so it&apos;s worth checking a building&apos;s VA approval status before writing an offer, not
          after.
        </p>
      </GuideSection>

      <GuideSection title="Property tax benefits for Florida veterans">
        <p>
          Beyond the loan itself, Brevard County offers several property tax exemptions specifically for veterans,
          on top of the standard homestead exemption covered in our{' '}
          <Link href="/property-taxes" style={{ color: 'inherit' }}>
            property taxes &amp; homestead exemption guide
          </Link>
          . An honorably discharged veteran with a 10% or greater service-connected disability rating qualifies for
          a $5,000 exemption, which stacks with the standard homestead exemption for up to $55,000 off your
          home&apos;s assessed value combined. Veterans with a service-connected total and permanent disability can
          qualify for a full exemption from all ad valorem property tax on their homestead. There&apos;s also an
          age-65+ combat-related disability discount, an exemption for active-duty members deployed outside the U.S.
          on a designated operation during the prior year, and 100% ad valorem tax relief for surviving spouses of
          veterans who died in the line of duty. Brevard County&apos;s Property Appraiser handles applications, with
          a March 1 deadline for most of these.
        </p>
      </GuideSection>

      <section style={{ marginBottom: 36 }}>
        <Faq items={FAQ_ITEMS} heading="VA Home Loans FAQ" />
      </section>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Ready to put your VA benefit to work?</p>
        <p style={{ fontSize: 15 }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            Browse Brevard County Listings →
          </Link>
        </p>
        <p style={{ fontSize: 15, marginTop: 10 }}>
          Have questions about using your VA benefit here?{' '}
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
