'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PROPERTY_TYPE_TO_SLUG } from '@/lib/constants';
import ContactModal from './ContactModal';

// Footer's "Contact Us" link now opens the same popup as the top nav's
// "Contact Us" button (2026-08-26, per Ryan: "Make the bottom Contact us
// pop up window the same as the top Contact us pop up menu"). Previously
// this linked to the standalone /contact page — that page is untouched
// and still reachable directly (a bookmark, a search result, a shared
// link), this just changes what the footer link itself does, matching
// Nav.js's 2026-08-15 change (see CLAUDE.md). Converted to a Client
// Component (it was a plain server-renderable component before) since
// opening a modal needs local state — same reasoning as Nav.js/SearchBar.js.
export default function Footer({ cities = [], neighborhoods = [] }) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  return (
    <footer
      style={{
        background: 'var(--color-nav-bg)',
        color: 'rgba(255,255,255,0.85)',
        borderTop: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      <div className="container" style={{ padding: '48px clamp(16px, 4vw, 56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
        <div>
          <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 16 }}>Brevard Coastal Homes</h4>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            Local expertise across Brevard County&apos;s coastal cities and neighborhoods.
          </p>
          {/* Tropical Realty & Investments of Brevard logo (2026-08-21, per Ryan:
              "put this logo under Brevard Coastal homes & the text on the homepage").
              Plain <img> instead of next/image's <Image> deliberately: this is a
              small, fixed-size 200x200 static logo that doesn't need responsive
              optimization, and going through next/image's /_next/image optimizer
              endpoint routes it through an extra hop that this project's Hostinger
              hosting has a well-documented history of intermittently corrupting
              (see CLAUDE.md's "hcdn CDN corrupts/caches broken streamed responses"
              sections) — confirmed live 2026-08-21: the optimizer-served <Image>
              loaded with naturalWidth/naturalHeight 0 (a corrupted/empty response
              that the browser still marked "complete"), while 8/8 direct fetches
              of the plain static file under /logos/ loaded correctly at 200x200. */}
          <div style={{ marginTop: 16, background: '#fff', display: 'inline-block', padding: 8, borderRadius: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/tropical-realty-logo.jpg"
              alt="Tropical Realty & Investments of Brevard"
              style={{ display: 'block', width: 110, height: 110 }}
            />
          </div>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Cities</h4>
          {cities.map((city) => (
            <div key={city.slug} style={{ marginBottom: 8 }}>
              <Link href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Home}`} className="footer-link" style={footerLinkStyle}>
                {city.name} Homes
              </Link>
              {/* Footer always links to Condos, even for cities excluded from the nav dropdown (e.g. Viera West) */}
              {' · '}
              <Link href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Condo}`} className="footer-link" style={footerLinkStyle}>
                Condos
              </Link>
            </div>
          ))}
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Neighborhoods</h4>
          {neighborhoods.map((n) => (
            <div key={n.slug} style={{ marginBottom: 8 }}>
              <Link href={`/neighborhoods/${n.slug}`} className="footer-link" style={footerLinkStyle}>
                {n.name}
              </Link>
            </div>
          ))}
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Company</h4>
          <button
            type="button"
            onClick={() => setContactModalOpen(true)}
            className="footer-link"
            style={{ ...footerLinkStyle, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
          >
            Contact Us
          </button>
          <br />
          <Link href="/looking-to-sell" className="footer-link" style={footerLinkStyle}>
            Looking to Sell
          </Link>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', padding: '16px clamp(16px, 4vw, 56px)', fontSize: 12 }}>
        © {new Date().getFullYear()} Brevard Coastal Homes. All rights reserved.
      </div>

      {contactModalOpen && <ContactModal onClose={() => setContactModalOpen(false)} />}
    </footer>
  );
}

const footerLinkStyle = { fontSize: 13, color: 'rgba(255,255,255,0.85)' };
