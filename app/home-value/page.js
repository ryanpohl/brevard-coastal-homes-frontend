import * as api from '@/lib/api';
import HomeValueForm from '@/components/HomeValueForm';
import { withSocialPreview } from '@/lib/socialPreview';

export const metadata = withSocialPreview({
  title: "What's My Home Worth? Free Brevard County Home Value Report | Brevard Coastal Homes",
  description:
    'See what your Brevard County, FL home is worth: an instant estimate from recent sales near you, plus a free personal valuation from a local Realtor if you want one.',
  alternates: { canonical: '/home-value' },
});

// "What's My Home Worth" lead-capture page. Added 2026-10-02, per Ryan —
// see components/HomeValueForm.js for the form itself and backend's
// inquiries.controller.js submitHomeValueRequest for the endpoint it posts
// to. Scoped to Brevard County, FL only (per Ryan) — the city dropdown
// below only offers this site's existing Brevard County cities, and the
// backend rejects anything else.
async function getCities() {
  try {
    const { cities } = await api.getCities();
    return cities || [];
  } catch {
    // Backend unreachable at build/request time — render the form with an
    // empty city list rather than crashing the whole page (same fallback
    // pattern as app/layout.js's getNavData).
    return [];
  }
}

export default async function HomeValuePage() {
  const cities = await getCities();

  return (
    <div>
      <div style={{ background: 'var(--color-nav-bg)', color: '#fff', padding: '64px clamp(16px, 4vw, 56px)' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', maxWidth: 720, marginBottom: 16 }}>
            What&apos;s Your Brevard County Home Worth?
          </h1>
          <p style={{ maxWidth: 620, color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            See an instant estimate from recent sales of similar homes in your ZIP code, then get a free personal
            valuation from Ryan if you&apos;d like a closer number. No obligation.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px clamp(16px, 4vw, 56px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'start' }}>
          <HomeValueForm cities={cities} />

          <div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, marginBottom: 12 }}>How the Estimate Works</h2>
              <p style={{ fontSize: 14, color: 'var(--color-muted-dark)', lineHeight: 1.7 }}>
                We compare your home with recent MLS sales in your ZIP code: the same kind of property, a similar
                size, and the same waterfront type. You&apos;ll see the range and the sales it came from. Sales
                can&apos;t show your home&apos;s condition, updates or view, so for a closer number Ryan will
                prepare a personal valuation at no cost.
              </p>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 18, marginBottom: 12 }}>Currently Serving Brevard County, FL</h2>
              <p style={{ fontSize: 14, color: 'var(--color-muted-dark)', lineHeight: 1.7 }}>
                From Cocoa Beach to Melbourne Beach, we know the coastal Brevard market. Home values are available
                for Brevard County homes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
