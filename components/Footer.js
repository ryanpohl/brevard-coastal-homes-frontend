'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PROPERTY_TYPE_TO_SLUG, BROKERAGE_INFO, AGENT_INFO } from '@/lib/siteConstants';
import { NEIGHBORHOOD_NAV_LABELS, groupNeighborhoodsForNav } from '@/lib/neighborhoodNav';
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
        background: 'var(--color-footer-bg)',
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
              // Lazy (2026-10-08): without it React preloads this footer photo
              // at the top of every page, ahead of the homepage hero.
              loading="lazy"
              decoding="async"
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
            <h2 style={{ color: '#fff', fontSize: 18, margin: 0 }}>Brevard Coastal Homes</h2>
            {/* Agent name (2026-09-12, per Ryan: "add my name Ryan Pohl below
                Brevard coastal Homes & above the phone number") — sits right
                under the brand heading, above the "Call or Text" line below. */}
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, fontWeight: 600, margin: '10px 0 0' }}>
              Ryan Pohl
            </p>
            {/* Ryan's own license, moved here from under the Tropical Realty
                logo (2026-10-02, per Ryan) — sits with his name as his
                credentials; the brokerage's license stays under its logo. */}
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: '4px 0 0' }}>
              FL License #{AGENT_INFO.licenseNumber}
            </p>
          </div>
          {/* "Call or Text: 321-350-7661" added 2026-08-29, per Ryan, directly
              under the heading — hardcoded literal number, same reasoning as
              ContactModal.js's phone line (AGENT_INFO.phone reads
              NEXT_PUBLIC_BUSINESS_PHONE, confirmed empty on the live
              production bundle per CLAUDE.md's 2026-08-04 note). Wrapped in a
              tel: link for tap-to-call on mobile.
              whiteSpace: 'nowrap' added 2026-09-26, per Ryan ("fix the phone
              number so its all on one line") — the line was wrapping mid-
              number, right after "321-350-" and before "7661". Not a true
              overflow (the column had room); browsers treat a hyphen as a
              soft line-break opportunity by default, so "321-350-7661" was
              splitting at one of its own hyphens. nowrap stops any break in
              this line, hyphen or otherwise. */}
          <p style={{ color: 'var(--color-gold, #c9a15a)', fontWeight: 700, fontSize: 17, margin: '6px 0 4px', whiteSpace: 'nowrap' }}>
            Call or Text:{' '}
            <a href="tel:+13213507661" style={{ color: 'inherit', textDecoration: 'none' }}>
              321-350-7661
            </a>
          </p>
          {/* Brokerage name and license right under the phone number
              (2026-10-05, per Ryan): Florida Rule 61J2-10.025 requires the
              brokerage's licensed name above, below or next to any contact
              point. This replaces the Tropical Realty logo block that used to
              sit under the Company links, far from the number. */}
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: '0 0 2px', lineHeight: 1.5 }}>
            {BROKERAGE_INFO.name}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
            Brokerage License #{BROKERAGE_INFO.licenseNumber}
          </p>
        </div>

        <div>
          <h2 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Cities</h2>
          {/* One link per city (2026-10-02, per Ryan: footer "looks very
              busy") — was "Homes · Condos · Oceanfront" per city (~27 links,
              most wrapping to 2 lines). Each city's page still offers the
              condo/oceanfront views. */}
          {cities.map((city) => (
            <div key={city.slug} style={{ marginBottom: 8 }}>
              <Link href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Home}`} className="footer-link" style={footerLinkStyle}>
                {city.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Neighborhood columns (2026-10-05, per Ryan) use the same groups as
            the nav's Search by Neighborhood tabs, so the newer pages (Viera
            West neighborhoods, 55+ communities, Viera Builders communities)
            get a link from every page, not just the backend's 10. Viera gets
            its own column since it's the longest group; Coming Soon
            communities are left out until they have listings. */}
        {(() => {
          const groups = groupNeighborhoodsForNav(neighborhoods).map((g) => ({
            ...g,
            neighborhoods: g.neighborhoods.filter((n) => !n.comingSoon),
          }));
          const viera = groups.find((g) => g.label === 'Viera & Viera West');
          const others = groups.filter((g) => g !== viera);
          const renderLinks = (g) =>
            g.neighborhoods.map((n) => (
              <div key={n.slug} style={{ marginBottom: 8 }}>
                <Link href={`/neighborhoods/${n.slug}`} className="footer-link" style={footerLinkStyle}>
                  {NEIGHBORHOOD_NAV_LABELS[n.slug] || n.name}
                </Link>
              </div>
            ));
          return (
            <>
              <div>
                <h2 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Neighborhoods</h2>
                {others.map((g, i) => (
                  <div key={g.label} style={{ marginTop: i ? 20 : 0 }}>
                    <div style={footerSubheadStyle}>{g.label}</div>
                    {renderLinks(g)}
                  </div>
                ))}
              </div>
              {viera && (
                <div>
                  <h2 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>{viera.label}</h2>
                  {renderLinks(viera)}
                </div>
              )}
            </>
          );
        })()}

        {/* Buyer Guides column (2026-09-25, per Ryan: "put as many of
            these in the footer if possible") — a dedicated column rather
            than folding guide links into Company, since Company was
            already at 3 links and this is meant to grow: down payment
            assistance and flood insurance today, more evergreen guides
            (hurricane insurance, property taxes, relocation, VA loans)
            landing here as each one shipped. Reached 6 direct guide links
            (see below); at that point Ryan said to freeze it there rather
            than keep growing it flat: "Lets stop at 6 with the Buyers
            Guides. task #68 next." Task #68 (see app/buyer-resources/
            page.js) is a pillar/index page listing all 6 guides — per
            Ryan's explicit choice (asked directly rather than guessed),
            it's added here as its OWN 7th link, above the 6 direct guide
            links rather than replacing them, so a visitor can still jump
            straight to one guide or land on the full list. Any future
            guide beyond these 6 should be added to the hub page's GUIDES
            array, not to this column — this column is done growing. */}
        <div>
          <h2 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Buyer Guides</h2>
          {/* Buyer Resources hub page (2026-09-25, per Ryan — Task #68).
              Listed first, above the 6 individual guides, since it's the
              "see everything" entry point into this column. */}
          <div style={{ marginBottom: 8 }}>
            <Link href="/buyer-resources" className="footer-link" style={footerLinkStyle}>
              Buyer Resources
            </Link>
          </div>
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

        <div style={{ marginTop: 28 }}>
          <h2 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Company</h2>
          {/* 8px spacers between links (2026-10-02, per Ryan) — were plain <br />s,
              which stacked these links tighter than the other columns'
              (each of those links sits in a div with marginBottom: 8). */}
          {/* About (2026-09-25, per Ryan — new agent bio page, see
              app/about/page.js) — listed first in this column, above
              Contact Us/Looking to Sell, same as it leads off the nav bar. */}
          <Link href="/about" className="footer-link" style={footerLinkStyle}>
            About
          </Link>
          <div style={{ height: 8 }} />
          {/* Reviews (2026-09-25, per Ryan — client testimonials page, see
              app/reviews/page.js) — grouped with About in Company rather
              than the Buyer Guides column above: it's a trust/company page
              about Ryan, not a topical buyer guide. */}
          <Link href="/reviews" className="footer-link" style={footerLinkStyle}>
            Reviews
          </Link>
          <div style={{ height: 8 }} />
          <button
            type="button"
            onClick={() => setContactModalOpen(true)}
            className="footer-link"
            // fontFamily (not the `font` shorthand) so footerLinkStyle's 13px size
            // isn't reset to the inherited 16px — that's why Contact Us looked
            // bigger than the links around it (fixed 2026-10-02).
            style={{ ...footerLinkStyle, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', lineHeight: 'inherit' }}
          >
            Contact Us
          </button>
          <div style={{ height: 8 }} />
          <Link href="/looking-to-sell" className="footer-link" style={footerLinkStyle}>
            Looking to Sell
          </Link>
          <div style={{ height: 8 }} />
          {/* Monthly market report (2026-10-07, per Ryan). */}
          <Link href="/market-report" className="footer-link" style={footerLinkStyle}>
            Brevard Market Report
          </Link>
          <div style={{ height: 8 }} />
          {/* What's My Home Worth (2026-10-02, per Ryan) — see
              app/home-value/page.js. Grouped right under Looking to Sell,
              same section, since both target a seller-intent visitor. */}
          <Link href="/home-value" className="footer-link" style={footerLinkStyle}>
            What&apos;s My Home Worth
          </Link>
        </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', padding: '16px clamp(16px, 4vw, 56px)', fontSize: 12 }}>
        © {new Date().getFullYear()} Brevard Coastal Homes. All rights reserved.
      </div>

      {contactModalOpen && <ContactModal onClose={() => setContactModalOpen(false)} />}
    </footer>
  );
}

const footerLinkStyle = { fontSize: 13, color: 'rgba(255,255,255,0.72)' };
const footerSubheadStyle = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  color: 'var(--color-gold)',
  marginBottom: 10,
};
