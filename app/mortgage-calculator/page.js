import Link from 'next/link';
import MortgageCalculator from '@/components/MortgageCalculator';
import { withSocialPreview } from '@/lib/socialPreview';

/**
 * Brevard County mortgage calculator (2026-10-11, per Ryan) — the full
 * Florida monthly cost (taxes, wind and flood insurance, HOA, PMI), not
 * just principal & interest. The same calculator sits on every listing
 * page, pre-filled with that home.
 */
export const metadata = withSocialPreview({
  title: 'Brevard County Mortgage Calculator: Full Monthly Payment | Brevard Coastal Homes',
  description:
    'Estimate your full monthly payment on a Brevard County, FL home: principal and interest plus property taxes, homeowners and wind insurance, flood insurance, HOA fees and PMI.',
  alternates: { canonical: '/mortgage-calculator' },
});

export default function MortgageCalculatorPage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 1080 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        Brevard County Mortgage Calculator
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 28, maxWidth: 760 }}>
        See the full monthly cost of a Brevard County home, not just the loan payment. In Florida, property taxes and
        insurance can add hundreds of dollars a month, so they&rsquo;re built in here as estimates you can adjust.
      </p>
      <MortgageCalculator showKindPicker />
      <div style={{ maxWidth: 760, marginTop: 36, fontSize: 16, lineHeight: 1.7, color: 'var(--color-muted-dark)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 10, color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
          How the estimates work
        </h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <strong>Property taxes</strong> start at about 1.5% of the price. Florida resets a home&rsquo;s assessment after it
            sells, so the seller&rsquo;s tax bill usually isn&rsquo;t what you&rsquo;ll pay. See the{' '}
            <Link href="/property-taxes">property taxes &amp; homestead guide</Link>.
          </li>
          <li>
            <strong>Homeowners insurance</strong> starts at about 1% of the price for a house (1.3% for houses 25+ years old),
            including wind. <strong>Condo insurance</strong> covers just your unit&rsquo;s interior and belongings, since the
            building is insured through the HOA fee, so it starts much lower. See the{' '}
            <Link href="/hurricane-insurance">hurricane insurance guide</Link>.
          </li>
          <li>
            <strong>Flood insurance</strong> is optional here and uses average yearly costs by flood zone. See the{' '}
            <Link href="/flood-insurance">flood insurance guide</Link>.
          </li>
          <li>
            <strong>PMI</strong> is added when the down payment is under 20%.
          </li>
        </ul>
        <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>
          Estimates only, not a loan offer. Rates change daily; confirm your numbers with a lender and an insurance agent.
        </p>
      </div>
    </div>
  );
}
