import PropertyManagementModal from '@/components/PropertyManagementModal';

export const metadata = {
  title: 'Looking to Sell Your Brevard County Home? | Brevard Coastal Homes',
  description:
    'Thinking of selling your home, condo, or land in Brevard County, FL? Get a free market analysis and learn about our property management services.',
};

export default function LookingToSellPage() {
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
