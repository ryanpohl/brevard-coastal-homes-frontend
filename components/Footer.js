import Link from 'next/link';
import { PROPERTY_TYPE_TO_SLUG } from '@/lib/constants';

export default function Footer({ cities = [], neighborhoods = [] }) {
  return (
    <footer style={{ background: 'var(--color-nav-bg)', color: 'rgba(255,255,255,0.85)', marginTop: 64 }}>
      <div className="container" style={{ padding: '48px clamp(16px, 4vw, 56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
        <div>
          <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 16 }}>Brevard Coastal Homes</h4>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            Local expertise across Brevard County&apos;s coastal cities and neighborhoods.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Cities</h4>
          {cities.map((city) => (
            <div key={city.slug} style={{ marginBottom: 8 }}>
              <Link href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Home}`} style={footerLinkStyle}>
                {city.name}
              </Link>
              {/* Footer always links to Condos, even for cities excluded from the nav dropdown (e.g. Viera West) */}
              {' · '}
              <Link href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Condo}`} style={footerLinkStyle}>
                Condos
              </Link>
            </div>
          ))}
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Neighborhoods</h4>
          {neighborhoods.map((n) => (
            <div key={n.slug} style={{ marginBottom: 8 }}>
              <Link href={`/neighborhoods/${n.slug}`} style={footerLinkStyle}>
                {n.name}
              </Link>
            </div>
          ))}
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Company</h4>
          <Link href="/contact" style={footerLinkStyle}>
            Contact Us
          </Link>
          <br />
          <Link href="/looking-to-sell" style={footerLinkStyle}>
            Looking to Sell
          </Link>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', padding: '16px clamp(16px, 4vw, 56px)', fontSize: 12 }}>
        © {new Date().getFullYear()} Brevard Coastal Homes. All rights reserved.
      </div>
    </footer>
  );
}

const footerLinkStyle = { fontSize: 13, color: 'rgba(255,255,255,0.85)' };
