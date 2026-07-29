import { AGENT_INFO } from '@/lib/constants';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Us | Brevard Coastal Homes',
  description:
    'Get in touch with Brevard Coastal Homes about buying, selling, or renting a home, condo, or land in Brevard County, FL.',
};

export default function ContactPage() {
  return (
    <div className="container" style={{ padding: '48px clamp(16px, 4vw, 56px) 64px' }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12 }}>Contact Us</h1>
      <p style={{ maxWidth: 640, color: 'var(--color-muted-dark)', marginBottom: 32 }}>
        Have a question about a listing, or just getting started with your search? Send us a message and we&apos;ll
        get back to you shortly.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32 }}>
        <ContactForm />

        <div>
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-border-light)', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 600 }}>{AGENT_INFO.name}</p>
                <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>{AGENT_INFO.businessName}</p>
              </div>
            </div>
            {AGENT_INFO.phone && <p style={{ fontSize: 14, marginBottom: 4 }}>{AGENT_INFO.phone}</p>}
            {AGENT_INFO.email && <p style={{ fontSize: 14 }}>{AGENT_INFO.email}</p>}
          </div>

          <div
            className="card"
            style={{
              height: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-muted)',
              background: 'var(--color-bg)',
            }}
          >
            Map placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
