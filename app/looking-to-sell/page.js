import * as api from '@/lib/api';
import PropertyManagementModal from '@/components/PropertyManagementModal';
import HomeValueForm from '@/components/HomeValueForm';

export const metadata = {
  title: 'Looking to Sell Your Brevard County Home? | Brevard Coastal Homes',
  description:
    'Thinking of selling your home, condo, or land in Brevard County, FL? Get a free market analysis and learn about our property management services.',
  // Canonical added 2026-09-25 (SEO audit finding: this page had no
  // alternates.canonical at all, unlike every other static-metadata page
  // in the app — e.g. app/contact/page.js's own canonical-less metadata
  // was an oversight too, but Ryan's checklist named this page
  // specifically). Same static string pattern as the homepage's own
  // `alternates: { canonical: '/' }` in app/page.js.
  alternates: { canonical: '/looking-to-sell' },
};

// Fetches the Brevard city list for HomeValueForm's city dropdown — same
// fallback pattern as app/home-value/page.js's own getCities: an empty list
// rather than a crashed page if the backend is unreachable at request time.
async function getCities() {
  try {
    const { cities } = await api.getCities();
    return cities || [];
  } catch {
    return [];
  }
}

export default async function LookingToSellPage() {
  const cities = await getCities();

  return (
    <div>
      <div style={{ background: 'var(--color-nav-bg)', color: '#fff', padding: '64px clamp(16px, 4vw, 56px)' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', maxWidth: 720, marginBottom: 16 }}>
            Thinking About Selling Your Brevard County Property?
          </h1>
          <p style={{ maxWidth: 620, color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            From Cocoa Beach to Melbourne Beach, we know the coastal Brevard market inside and out. Get a free,
            no-obligation valuation and a straightforward plan to get your property sold at the best price.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px clamp(16px, 4vw, 56px)' }}>
        <div className="sell-points-grid" style={{ marginBottom: 48 }}>
          <SellPoint title="Local Market Expertise" text="Pricing guidance based on real, up-to-date Space Coast MLS data — not guesswork." />
          <SellPoint title="Maximum Exposure" text="Your listing gets featured across our site and marketing channels targeting serious buyers." />
          <SellPoint title="Full-Service Support" text="From listing prep to closing, we handle the details so you don't have to." />
        </div>

        {/* Lead-capture tool for the free valuation this page's H1 already
            promises (2026-08-30, per Ryan). Originally SellWithUsForm — a
            general "I want to sell" contact form with no address/property
            fields — swapped out 2026-10-02, per Ryan, for the actual
            home-value tool (components/HomeValueForm.js, same one used on
            the dedicated /home-value page) once it existed: it collects
            the real property details needed to pull comps, which actually
            delivers on "free valuation" rather than just routing to a
            generic contact form. SellWithUsForm.js is kept in the codebase
            but no longer used anywhere — left in place rather than
            deleted in case this page's form ever needs to revert.

            Mini-heading + intro line added 2026-10-02, per Ryan, so the
            form doesn't just appear after the three SellPoint cards with
            no framing of its own — the page's H1/subhead above are about
            the page as a whole, not specifically introducing this tool.
            Also sets the "comps-based, not instant" expectation up front,
            since competitor valuation pages researched for this feature
            (e.g. megansellsbrevard.com) lead with "instant" results —
            worth heading off that comparison before a visitor fills out
            the form and is surprised it's not immediate. */}
        <h2 style={{ fontSize: 22, textAlign: 'center', marginBottom: 8 }}>
          Start With a Free Home Value Report
        </h2>
        <p style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 24px', fontSize: 14, color: 'var(--color-muted-dark)' }}>
          Enter your property details below and we&apos;ll pull real comparable sales for your neighborhood — not an
          instant algorithm guess.
        </p>

        <div style={{ marginBottom: 12 }}>
          <HomeValueForm cities={cities} />
        </div>

        {/* Fallback for a visitor who doesn't want to fill out property
            details and would rather just talk to someone directly
            (2026-10-02, per Ryan) — same phone number SellWithUsForm used
            to surface above its own form. */}
        <p style={{ textAlign: 'center', marginBottom: 48, fontSize: 14, color: 'var(--color-muted-dark)' }}>
          Prefer to just talk it through? Call or text{' '}
          <a href="tel:+13213507661" style={{ fontWeight: 600 }}>
            321-350-7661
          </a>
          .
        </p>

        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>Own a Rental Property?</h2>
          <p style={{ maxWidth: 560, margin: '0 auto 20px', color: 'var(--color-muted-dark)' }}>
            We also offer full-service property management for investment owners across Brevard County — leasing,
            maintenance coordination, and tenant relations handled for you.
          </p>
          <PropertyManagementModal />
        </div>
      </div>
    </div>
  );
}

function SellPoint({ title, text }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ fontSize: 16, marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--color-muted-dark)', lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}
