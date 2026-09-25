'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PROPERTY_TYPE_TO_SLUG, BROKERAGE_INFO } from '@/lib/constants';
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
          {/* Ryan's headshot (2026-09-10, per Ryan: "add this picture in the
              footer where you think it looks best"; enlarged same day per
              Ryan: "make the picture larger to show my blue shirt"; shortened
              same day per Ryan: "make my picture a little bit shorter").
              Stacked above the brand heading, in the same "Brevard Coastal
              Homes" column as the phone number below, so this corner of the
              footer reads as "who you're calling". (The Tropical Realty logo
              used to sit at the bottom of this same column — moved to the
              Company column on 2026-09-12, per Ryan: "move the tropical
              realty logo over under contact us & looking to sell", which
              also shortens this column since it was this column's tallest
              content — see that logo's own comment, now down in the Company
              column, for the rest of its history.) Plain <img>, not
              next/image — see that same comment for why (Hostinger's
              optimizer has a documented history of corrupting <Image>
              responses on this host).
              Source is a tall (400x674) portrait crop. It was first tried as
              a small 56px circle, but a circle forces a 1:1 crop and, at any
              size, a 1:1 crop can only ever show the top ~59% of this
              source's height (cover-scaling to fill the width already
              overflows the height by that much) — so the shirt Ryan asked
              for was cropped out no matter how large the circle got. Fixed
              by sizing the box to (approximately) the source's own aspect
              ratio instead of forcing a square, so almost nothing is
              cropped and the shirt is simply in frame.
              Height trimmed from 219 to 180 (width unchanged at 130) for the
              "a little bit shorter" request — object-fit:cover scales the
              130-wide box to 130x219 first (width is the binding dimension),
              then a 180-tall box crops ~39px total off that. That crop
              defaulted to centered object-position, which split the 39px
              evenly top/bottom — cropping into the top of Ryan's hair, per
              his follow-up: "it cuts off part of my head". Fixed by
              switching objectPosition to 'top': all ~39px now comes off the
              BOTTOM (shirt/chest) instead, so the crop starts flush with the
              top of the scaled image and the whole head clears with room to
              spare. Trades a little more of the shirt for a guaranteed
              full head — the right trade since the head, not the shirt, is
              what a headshot needs uncropped. Previewed locally (PIL,
              simulating the exact cover-scale + top-crop) before deploying. */}
          <div style={{ marginBottom: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/team/ryan-headshot.jpg"
              alt="Ryan, Brevard Coastal Homes"
              style={{
                display: 'block',
                width: 130,
                height: 180,
                borderRadius: 12,
                objectFit: 'cover',
                objectPosition: 'top',
                marginBottom: 12,
                border: '2px solid rgba(255,255,255,0.25)',
              }}
            />
            <h4 style={{ color: '#fff', fontSize: 18, margin: 0 }}>Brevard Coastal Homes</h4>
            {/* Agent name (2026-09-12, per Ryan: "add my name Ryan Pohl below
                Brevard coastal Homes & above the phone number") — sits right
                under the brand heading, above the "Call or Text" line below. */}
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, fontWeight: 600, margin: '10px 0 0' }}>
              Ryan Pohl
            </p>
          </div>
          {/* "Call or Text: 321-350-7661" added 2026-08-29, per Ryan, directly
              under the heading — hardcoded literal number, same reasoning as
              ContactModal.js's phone line (AGENT_INFO.phone reads
              NEXT_PUBLIC_BUSINESS_PHONE, confirmed empty on the live
              production bundle per CLAUDE.md's 2026-08-04 note). Wrapped in a
              tel: link for tap-to-call on mobile. */}
          <p style={{ color: 'var(--color-gold, #c9a15a)', fontWeight: 700, fontSize: 17, margin: '6px 0 12px' }}>
            Call or Text:{' '}
            <a href="tel:+13213507661" style={{ color: 'inherit', textDecoration: 'none' }}>
              321-350-7661
            </a>
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            Local expertise across Brevard County&apos;s coastal cities and neighborhoods.
          </p>
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

        {/* Buyer Guides column (2026-09-25, per Ryan: "put as many of
            these in the footer if possible") — a dedicated column rather
            than folding guide links into Company, since Company was
            already at 3 links and this is meant to grow: down payment
            assistance and flood insurance today, more evergreen guides
            (hurricane insurance, property taxes, relocation, VA loans —
            see the task list) landing here as each one ships. Every guide
            gets linked from every page site-wide this way, which is the
            whole point per Ryan's ask — internal-linking signal plus easy
            discovery. If this list grows past ~5-6 links, consider
            swapping it for a single link to a "Buyer Resources" hub page
            (also planned) that lists them all instead. */}
        <div>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Buyer Guides</h4>
          <div style={{ marginBottom: 8 }}>
            <Link href="/down-payment-assistance" className="footer-link" style={footerLinkStyle}>
              Down Payment Assistance
            </Link>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Link href="/flood-insurance" className="footer-link" style={footerLinkStyle}>
              Flood Zones & Insurance
            </Link>
          </div>
          {/* Hurricane Insurance guide (2026-09-25, per Ryan — "can you put
              this link in the footer also," confirmed via clarifying
              question to mean the hurricane/homeowners insurance guide).
              Third guide in this column, same treatment as the two above. */}
          <div style={{ marginBottom: 8 }}>
            <Link href="/hurricane-insurance" className="footer-link" style={footerLinkStyle}>
              Hurricane Insurance
            </Link>
          </div>
          {/* Property Taxes & Homestead Exemption guide (2026-09-25, per
              Ryan) — fourth guide in this column. Now at 4 links; still
              under the ~5-6 threshold this column's own top comment flags
              for swapping to a single "Buyer Resources" hub link instead
              (see Task list: that hub page is planned once more guides
              ship). */}
          <div style={{ marginBottom: 8 }}>
            <Link href="/property-taxes" className="footer-link" style={footerLinkStyle}>
              Property Taxes
            </Link>
          </div>
          {/* Moving to Brevard County relocation guide (2026-09-25, per
              Ryan) — fifth guide in this column, at the ~5-6 threshold
              this column's own top comment flags for swapping to a single
              "Buyer Resources" hub link (Task #68, still pending) instead
              of a flat list — worth doing on the next guide. */}
          <div style={{ marginBottom: 8 }}>
            <Link href="/moving-to-brevard" className="footer-link" style={footerLinkStyle}>
              Moving to Brevard County
            </Link>
          </div>
          {/* VA Home Loans guide (2026-09-25, per Ryan — see
              app/va-loans/page.js). Sixth guide in this column — now past
              the ~5-6 link threshold this column's top comment has been
              flagging since the fourth guide. Still added as a flat link
              rather than held back, consistent with Ryan's "put as many
              of these in the footer if possible" — but Task #68 (a single
              "Buyer Resources" hub page/link replacing this whole column)
              should be the very next thing built, not deferred again. */}
          <div style={{ marginBottom: 8 }}>
            <Link href="/va-loans" className="footer-link" style={footerLinkStyle}>
              VA Home Loans
            </Link>
          </div>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Company</h4>
          {/* About (2026-09-25, per Ryan — new agent bio page, see
              app/about/page.js) — listed first in this column, above
              Contact Us/Looking to Sell, same as it leads off the nav bar. */}
          <Link href="/about" className="footer-link" style={footerLinkStyle}>
            About
          </Link>
          <br />
          {/* Reviews (2026-09-25, per Ryan — client testimonials page, see
              app/reviews/page.js) — grouped with About in Company rather
              than the Buyer Guides column above: it's a trust/company page
              about Ryan, not a topical buyer guide. */}
          <Link href="/reviews" className="footer-link" style={footerLinkStyle}>
            Reviews
          </Link>
          <br />
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
          <br />
          {/* Tropical Realty & Investments of Brevard logo (2026-08-21, per Ryan:
              "put this logo under Brevard Coastal homes & the text on the homepage").
              Moved here from the Brevard Coastal Homes column on 2026-09-12,
              per Ryan: "move the tropical realty logo over under contact us &
              looking to sell" — that column was the footer's tallest (headshot +
              heading + name + phone + blurb + this logo), so moving the logo out
              of it shortens the whole footer to roughly the height of the
              Cities/Neighborhoods columns instead.
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
          {/* Brokerage name + FL license number as real text (2026-09-25,
              per Ryan, SEO audit finding — the logo above was the only
              place the brokerage was named anywhere on the site, and only
              via alt text; a license number appeared nowhere at all).
              Plain text rather than folded into the logo's alt text so
              it's legible to a visitor too, not just a crawler, and shows
              on every page since Footer is rendered site-wide. */}
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 10, lineHeight: 1.5 }}>
            {BROKERAGE_INFO.name}
            <br />
            FL License #{BROKERAGE_INFO.licenseNumber}
          </p>
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
