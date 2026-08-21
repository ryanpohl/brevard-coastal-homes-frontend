'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { PROPERTY_TYPE_TO_SLUG } from '@/lib/constants';
import AuthPanel from './AuthPanel';
import ContactModal from './ContactModal';

// Neighborhoods whose "Search by Neighborhood" dropdown entry also gets a
// "Condos" link, on top of the shared "<Name> Listings" + "Homes" treatment
// every neighborhood now uses (see the map below). Originally added
// 2026-08-20 per Ryan ("make harbor Island island Beach Club & Aquarina
// look just like the Indialantic screenshot") when only these two had the
// header/Homes/Condos format and every other neighborhood was a single flat
// link. A same-day follow-up ("add the word Listings after each
// Neighborhood that doesn't have it already... add home links under
// [the other 8 neighborhoods]... Do not add condos link to any of those
// though") extended the header + Homes treatment to every neighborhood, so
// this set is now just the allowlist for the extra Condos link, not a gate
// on the header/Homes treatment itself.
const NEIGHBORHOOD_CONDO_PAGE_SLUGS = new Set(['harbor-island-beach-club', 'aquarina']);

// Neighborhoods whose "Search by Neighborhood" dropdown entry also gets a
// "Lots" link, filtered to that neighborhood's Land listings. Added
// 2026-08-21 per Ryan ("under Aripeka add a 'Lots' link connected to a
// Aripeka Lots page") — scoped to Aripeka only, not a general pattern.
// Aripeka's neighborhood page already supports a Land-filtered view (see
// lib/constants.js's ARIPEKA_PROPERTY_TYPE_OPTIONS, which includes 'Land'
// alongside 'Home' — Aripeka drops Condos/Townhomes entirely, per Ryan,
// 2026-08-05), so this reuses that existing route/filter rather than
// building a new page.
const NEIGHBORHOOD_LOTS_PAGE_SLUGS = new Set(['aripeka']);

/**
 * Top nav. Matches the design spec's dropdown behavior: opens on hover/click,
 * closes on a ~250ms delay after the mouse leaves (so users can move
 * diagonally from the trigger into the panel), and only one top-level menu
 * is open at a time. See design/README.md's "Header/filter dropdown menus"
 * section for the full spec this recreates.
 */
export default function Nav({ cities = [], neighborhoods = [] }) {
  const { signedIn, user, signOut } = useAuth();
  // 'signin'/'join' merged into a single 'auth' key (2026-08-16) — see the
  // "Sign In/Register" NavLink below and AuthPanel.js's own top comment.
  const [openMenu, setOpenMenu] = useState(null); // 'city' | 'neighborhood' | 'account' | 'auth' | null
  // Separate from openMenu, same reasoning as SearchBar.js's scheduleModalOpen:
  // this is a body-portaled modal (see ContactModal.js), not one of the
  // nav-anchored dropdown panels openMenu tracks.
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const closeTimer = useRef(null);
  const containerRef = useRef(null);

  const openNow = useCallback((key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  }, []);

  // Tapping/clicking a trigger toggles it (open <-> closed) instead of just
  // opening it — mirrors FilterBar.js's 2026-08-13 mobile-touch fix (see
  // its own toggleOnClick for the full writeup of why this is needed:
  // touch has no hover-out, so a trigger that only ever opens gets stuck
  // open once tapped). Nav.js never received that same fix when
  // FilterBar.js did — this closes that gap (2026-08-14, per Ryan: "make
  // sure the website is very mobile friendly").
  const toggleOnClick = useCallback((key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu((current) => (current === key ? null : key));
  }, []);

  // Sign In/Register / My Account are click-driven forms, not hover-driven
  // navigation menus — unlike Search by City/Neighborhood, closing them
  // just because the mouse drifted off the nav bar (e.g. to read a listing
  // while typing) silently discards whatever the visitor had typed, since
  // AuthPanel remounts with blank fields the next time it opens. Found
  // 2026-08-14 (Ryan: "the pop up window for join/create account... keeps
  // disappearing before I can fill out all the information") and
  // reproduced directly: opening Join, typing into all three fields, then
  // just moving the mouse off the nav bar (onto the map/listing area, as a
  // real visitor's cursor naturally would while reading the page) closed
  // the panel ~250ms later even mid-focus in the Password field. These
  // panels are still fully closable — via clicking their own trigger again
  // (toggleOnClick), clicking anywhere outside the nav
  // (handleOutsideInteraction below), or a successful sign-in/join/sign-out
  // — just never via this hover-timeout. ('signin'/'join' merged into
  // 'auth' 2026-08-16, see the NavLink below.)
  const scheduleClose = useCallback(() => {
    if (openMenu === 'auth' || openMenu === 'account') return;
    closeTimer.current = setTimeout(() => setOpenMenu(null), 250);
  }, [openMenu]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Immediately closes whatever menu is open — wired to non-dropdown nav
  // items (brand link, Looking to Sell, Contact Us) so hovering one of
  // those closes a dropdown left open from a sibling trigger, instead of
  // it lingering until the mouse leaves the whole nav bar.
  const closeNow = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(null);
  }, []);

  // Second half of the 2026-08-14 mobile-touch fix (see toggleOnClick
  // above): closes whatever menu is open when a tap/click lands outside
  // the whole nav bar (a listing card, the hero, blank page space) —
  // same as FilterBar.js's handleOutsideInteraction. Without this, tapping
  // away from an open City/Neighborhood/Sign In/Join panel on a touch
  // device would leave it stuck open, since there's no mouse to trigger
  // onMouseLeave.
  useEffect(() => {
    if (!openMenu) return undefined;
    function handleOutsideInteraction(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('click', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    return () => {
      document.removeEventListener('click', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, [openMenu]);

  return (
    <div
      ref={containerRef}
      style={{ background: 'var(--color-nav-bg)', position: 'relative', zIndex: 30 }}
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '16px clamp(16px, 4vw, 56px) 10px',
        }}
      >
        <Link
          href="/"
          onMouseEnter={closeNow}
          style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: 0.5 }}
        >
          Brevard Coastal Homes
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {signedIn ? (
            <NavLink label={`My Account`} href="/my-account" active={openMenu === 'account'} onEnter={() => openNow('account')} />
          ) : (
            // Combined Sign In + Join into one entry point (2026-08-16, per
            // Ryan) — AuthPanel now owns its own Log In/Register tab
            // switcher internally (defaulting to Log In), so one button is
            // enough instead of two separate buttons that opened two
            // separately-configured copies of the same panel. Kept the gold
            // styling the old "Join" button used, to keep a visible
            // call-to-action in the nav rather than a plain outlined one.
            <NavLink
              label="Sign In/Register"
              gold
              active={openMenu === 'auth'}
              onEnter={() => openNow('auth')}
              onToggle={() => toggleOnClick('auth')}
            />
          )}
        </div>
      </div>

      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          rowGap: 8,
          columnGap: 'clamp(16px, 4vw, 36px)',
          padding: '0 clamp(16px, 4vw, 56px) 16px',
        }}
      >
        {/* Every Link inside these two DropdownPanels gets onClick={closeNow}
            (added 2026-08-14, per Ryan: clicking e.g. Cocoa Beach's Condos
            link navigated correctly but left the whole dropdown panel
            sitting open on top of the new page). Root cause: Nav lives in
            the root layout, so it persists across a client-side route
            change instead of remounting — `openMenu` state just carries
            over unchanged from before the click, and nothing was resetting
            it back to null when a link inside the panel was the thing that
            triggered the navigation (as opposed to tapping the trigger
            again or tapping outside, both already handled above). */}
        <NavLink
          label="Search by City"
          bare
          active={openMenu === 'city'}
          onEnter={() => openNow('city')}
          onToggle={() => toggleOnClick('city')}
          panel={
            openMenu === 'city' && (
              <DropdownPanel grid={5}>
                {cities.map((city) => (
                  <div key={city.slug}>
                    <div className="nav-dropdown-label" style={cityListingsLabelStyle}>
                      {city.name} Listings
                    </div>
                    <Link
                      href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Home}`}
                      className="hero-search-item nav-dropdown-link"
                      style={cityHomeLinkStyle}
                      onClick={closeNow}
                    >
                      Homes
                    </Link>
                    {city.showCondosInNav !== false && (
                      <Link
                        href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Condo}`}
                        className="hero-search-item-secondary nav-dropdown-link"
                        style={gridCondoLinkStyle}
                        onClick={closeNow}
                      >
                        Condos
                      </Link>
                    )}
                  </div>
                ))}
              </DropdownPanel>
            )
          }
        />
        <NavLink
          label="Search by Neighborhood"
          bare
          active={openMenu === 'neighborhood'}
          onEnter={() => openNow('neighborhood')}
          onToggle={() => toggleOnClick('neighborhood')}
          panel={
            openMenu === 'neighborhood' && (
              <DropdownPanel grid={5}>
                {/* Every neighborhood shows the City-dropdown-style "<Name>
                    Listings" header + a "Homes" link (2026-08-20 follow-up,
                    per Ryan: "add the word Listings after each Neighborhood
                    that doesn't have it already. Also add home links under
                    Adelaide, Aripeka, Summer lakes, Lansing Island, Tortoise
                    island, Suntree, South Merritt Island, & Viera Builders
                    communities. Do not add condos link to any of those
                    though.") — this replaced the single flat link every
                    neighborhood except Harbor Island Beach Club/Aquarina
                    used before. Only the two slugs in
                    NEIGHBORHOOD_CONDO_PAGE_SLUGS (see above) also get a
                    "Condos" link; every other neighborhood intentionally
                    stops at Homes, per Ryan's explicit "do not add condos
                    link" instruction. "Homes" is explicitly filtered to
                    ?propertyType=Home so it always means Homes only,
                    mirroring the City dropdown's Homes link (which never
                    links to the combined Home+Condo view) — without this
                    param the neighborhood route's listings fetch applies no
                    property-type filter and returns every type combined.
                    "Condos" goes to the same /neighborhoods/[slug] route
                    filtered via ?propertyType=Condo — the route's
                    listings-fetch and SEO metadata (getNeighborhoodSeo)
                    already fully support that query param for every
                    neighborhood (page_seo already has Condo-type rows
                    seeded for all 10), so no new route/page was needed. */}
                {neighborhoods.map((n) => (
                  <div key={n.slug}>
                    <div className="nav-dropdown-label" style={cityListingsLabelStyle}>
                      {n.name} Listings
                    </div>
                    <Link
                      href={`/neighborhoods/${n.slug}?propertyType=Home`}
                      className="hero-search-item nav-dropdown-link"
                      style={cityHomeLinkStyle}
                      onClick={closeNow}
                    >
                      Homes
                    </Link>
                    {NEIGHBORHOOD_CONDO_PAGE_SLUGS.has(n.slug) && (
                      <Link
                        href={`/neighborhoods/${n.slug}?propertyType=Condo`}
                        className="hero-search-item-secondary nav-dropdown-link"
                        style={gridCondoLinkStyle}
                        onClick={closeNow}
                      >
                        Condos
                      </Link>
                    )}
                    {NEIGHBORHOOD_LOTS_PAGE_SLUGS.has(n.slug) && (
                      <Link
                        href={`/neighborhoods/${n.slug}?propertyType=Land`}
                        className="hero-search-item-secondary nav-dropdown-link"
                        style={gridCondoLinkStyle}
                        onClick={closeNow}
                      >
                        Lots
                      </Link>
                    )}
                  </div>
                ))}
              </DropdownPanel>
            )
          }
        />
        <NavLink label="Looking to Sell" href="/looking-to-sell" bare onEnter={closeNow} />
        {/* Was a Link to /contact — now opens ContactModal instead, per Ryan
            2026-08-15: "make the Contact Us link ... a pop up window
            instead of its own separate page". closeNow also runs first so
            a dropdown left open from a sibling trigger (e.g. Search by
            City) doesn't linger open behind the modal. */}
        <NavLink
          label="Contact Us"
          bare
          onEnter={closeNow}
          onToggle={() => {
            closeNow();
            setContactModalOpen(true);
          }}
        />
      </div>

      {openMenu === 'account' && signedIn && (
        <div
          className="nav-dropdown-panel"
          style={{
            position: 'absolute',
            top: '100%',
            right: 'clamp(16px, 4vw, 56px)',
            marginTop: 8,
            padding: 18,
            width: 260,
            boxShadow: 'var(--shadow-nav-menu)',
            zIndex: 40,
          }}
        >
          <p style={{ fontWeight: 700, marginBottom: 12, color: '#fff' }}>{user?.name}</p>
          <Link href="/my-account" style={accountRowStyle}>
            My Profile
          </Link>
          <Link href="/my-account#favorites" style={accountRowStyle}>
            Favorite Properties
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut();
              setOpenMenu(null);
            }}
            className="btn btn-outline"
            style={{ width: '100%', marginTop: 8, color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
          >
            Sign Out
          </button>
        </div>
      )}

      {openMenu === 'auth' && <AuthPanel onClose={() => setOpenMenu(null)} />}
      {contactModalOpen && <ContactModal onClose={() => setContactModalOpen(false)} />}
    </div>
  );
}

function NavLink({ label, href, bare, gold, active, onEnter, onToggle, panel }) {
  const base = {
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  };

  let style;
  if (bare) {
    // Plain text nav link — no border/background box, just generous tap
    // padding so it's still comfortable to hit on mobile. Sized up a bit
    // larger than the base (which the Sign In/Join buttons still use)
    // since these links carry more of the header's visual weight.
    style = { ...base, fontSize: 16, padding: '6px 4px', border: 'none', background: 'transparent', opacity: active ? 1 : 0.92 };
  } else if (gold) {
    style = { ...base, padding: '11px 20px', borderRadius: 3, border: 'none', background: 'var(--color-gold)', color: 'var(--color-ink-dark)' };
  } else {
    style = { ...base, padding: '11px 20px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.5)', background: 'transparent' };
  }

  if (href) {
    return (
      <div style={{ position: 'relative' }} onMouseEnter={onEnter}>
        <Link href={href} className={bare ? 'nav-link-bare' : undefined} style={style}>
          {label}
        </Link>
        {panel}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={onEnter}>
      <button
        type="button"
        className={bare ? 'nav-link-bare' : undefined}
        style={{ ...style, cursor: 'pointer' }}
        onClick={onToggle || onEnter}
      >
        {label}
      </button>
      {panel}
    </div>
  );
}

// Anchored to its trigger's own position:relative wrapper (see NavLink)
// so it opens directly underneath the link that triggered it, rather than
// being right-aligned to the whole nav bar regardless of which item opened it.
//
// Mobile overflow fix (2026-08-14, per Ryan: "make sure the website is
// very mobile friendly"). This used to be a hardcoded inline
// `gridTemplateColumns: repeat(${grid}, minmax(140px, 1fr))` with no
// responsive breakpoint at all — since minmax()'s 140px floor applies per
// column, a 5-column grid has a 700px *minimum* content width regardless
// of viewport size, which forced the whole panel (and the page) to
// horizontal-scroll on any phone (measured: 882px of content squeezed
// into a 375px-wide viewport, with 6 of the City dropdown's 10 entries
// pushed off-screen and undiscoverable without scrolling). Fixed two ways:
// (1) the column count now lives in a CSS custom property (--nav-grid-cols)
// consumed by the .nav-grid class in globals.css, which collapses to a
// single column below 480px and 2 columns below 900px — same
// custom-property-driven pattern as this file's own .city-grid, chosen
// because an *inline* gridTemplateColumns can never be overridden by an
// external stylesheet's @media rule (inline styles always win the
// cascade), so the responsive breakpoints have to live in the CSS class
// instead; (2) leftOffset below nudges the panel left, same as
// FilterBar.js's FilterTrigger fix, for cases where even a single-column
// panel would still run past the right edge of the screen because of
// where its trigger sits in the nav bar.
function DropdownPanel({ children, grid }) {
  const panelRef = useRef(null);
  const [leftOffset, setLeftOffset] = useState(0);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const wrap = panel?.parentElement; // the trigger's position:relative wrapper (see NavLink)
    if (!panel || !wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    const margin = 16;
    const overflowRight = wrapRect.left + panel.offsetWidth - (window.innerWidth - margin);
    setLeftOffset(overflowRight > 0 ? -overflowRight : 0);
  }, []);

  return (
    <div
      ref={panelRef}
      className="nav-dropdown-panel nav-grid"
      style={{
        position: 'absolute',
        top: '100%',
        left: leftOffset,
        marginTop: 8,
        padding: 18,
        maxWidth: 'calc(100vw - 32px)',
        '--nav-grid-cols': grid,
        boxShadow: 'var(--shadow-nav-menu)',
        zIndex: 40,
      }}
    >
      {children}
    </div>
  );
}

// Font sizes bumped 2026-08-20 per Ryan ("make the text in the drop down
// menus larger on the homepage for search by city & search by
// neighborhood") — these were plain module-level style objects (not
// per-render inline styles keyed off state), so a direct fontSize bump
// was sufficient at the time; no CSS-custom-property/@media indirection
// was needed like PlaceCard's label above, since that ask wasn't
// mobile-specific.
//
// Font size itself was later moved OUT of these objects entirely
// (2026-08-20 follow-up, per Ryan: "make the text ... larger but only on
// mobile") into the .nav-dropdown-label/.nav-dropdown-link classes in
// globals.css — an inline style always wins the cascade over an external
// stylesheet's @media rule (same reason .nav-grid/.place-card-label live
// in globals.css instead of here), so a mobile-only bump can't be
// expressed as a plain number on these objects. The base/desktop sizes
// these objects used to set (15/14) now live as those classes' default,
// non-media rule instead — see globals.css for the full value + the
// mobile-tier bump.
const gridLinkStyle = {
  display: 'block',
  padding: '8px 10px',
  borderRadius: 4,
};

// City dropdown items show a non-link "<City> Listings" header, followed
// by "Homes" and "Condos" links stacked beneath it — the three split the
// padding gridLinkStyle uses for a single-link cell (header keeps its top
// padding, the two links drop their top/bottom padding in turn) instead
// of each keeping the full 8px and reading with an oversized gap between
// them.
const cityListingsLabelStyle = {
  padding: '8px 10px 0',
  fontWeight: 700,
  color: '#fff',
};
const cityHomeLinkStyle = { ...gridLinkStyle, padding: '2px 10px 0' };
const gridCondoLinkStyle = {
  display: 'block',
  padding: '2px 10px 8px',
  borderRadius: 4,
};

const accountRowStyle = {
  display: 'block',
  padding: '10px 12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 6,
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 600,
  color: '#fff',
};
