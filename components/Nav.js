'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { PROPERTY_TYPE_TO_SLUG } from '@/lib/constants';
import AuthPanel from './AuthPanel';

/**
 * Top nav. Matches the design spec's dropdown behavior: opens on hover/click,
 * closes on a ~250ms delay after the mouse leaves (so users can move
 * diagonally from the trigger into the panel), and only one top-level menu
 * is open at a time. See design/README.md's "Header/filter dropdown menus"
 * section for the full spec this recreates.
 */
export default function Nav({ cities = [], neighborhoods = [] }) {
  const { signedIn, user, signOut } = useAuth();
  const [openMenu, setOpenMenu] = useState(null); // 'city' | 'neighborhood' | 'account' | 'signin' | 'join' | null
  const closeTimer = useRef(null);

  const openNow = useCallback((key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 250);
  }, []);

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

  return (
    <div
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
            <>
              <NavLink label="Sign In" active={openMenu === 'signin'} onEnter={() => openNow('signin')} />
              <NavLink label="Join" gold active={openMenu === 'join'} onEnter={() => openNow('join')} />
            </>
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
        <NavLink
          label="Search by City"
          bare
          active={openMenu === 'city'}
          onEnter={() => openNow('city')}
          panel={
            openMenu === 'city' && (
              <DropdownPanel grid={5}>
                {cities.map((city) => (
                  <div key={city.slug}>
                    <Link
                      href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Home}`}
                      className="hero-search-item"
                      style={cityHomeLinkStyle}
                    >
                      {city.name} Homes
                    </Link>
                    <Link
                      href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Condo}`}
                      className="hero-search-item"
                      style={gridCondoLinkStyle}
                    >
                      (Condos)
                    </Link>
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
          panel={
            openMenu === 'neighborhood' && (
              <DropdownPanel grid={4}>
                {neighborhoods.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/neighborhoods/${n.slug}`}
                    className="hero-search-item"
                    style={gridLinkStyle}
                  >
                    {n.name}
                  </Link>
                ))}
              </DropdownPanel>
            )
          }
        />
        <NavLink label="Looking to Sell" href="/looking-to-sell" bare onEnter={closeNow} />
        <NavLink label="Contact Us" href="/contact" bare onEnter={closeNow} />
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

      {openMenu === 'signin' && <AuthPanel mode="signin" onClose={() => setOpenMenu(null)} />}
      {openMenu === 'join' && <AuthPanel mode="join" onClose={() => setOpenMenu(null)} />}
    </div>
  );
}

function NavLink({ label, href, bare, gold, active, onEnter, panel }) {
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
        onClick={onEnter}
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
function DropdownPanel({ children, grid }) {
  return (
    <div
      className="nav-dropdown-panel"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        marginTop: 8,
        padding: 18,
        display: 'grid',
        gridTemplateColumns: `repeat(${grid}, minmax(140px, 1fr))`,
        gap: 8,
        boxShadow: 'var(--shadow-nav-menu)',
        zIndex: 40,
      }}
    >
      {children}
    </div>
  );
}

const gridLinkStyle = {
  display: 'block',
  padding: '8px 10px',
  fontSize: 13,
  borderRadius: 4,
};

// City dropdown items pair a "<City> Homes" link with a "(Condos)" link
// stacked beneath it, so the two split the padding gridLinkStyle uses for
// a single-link cell (top link drops its bottom padding, bottom link
// drops its top padding) instead of each keeping the full 8px and reading
// with an oversized gap between them.
const cityHomeLinkStyle = { ...gridLinkStyle, padding: '8px 10px 0' };
const gridCondoLinkStyle = {
  display: 'block',
  padding: '2px 10px 8px',
  fontSize: 12,
  borderRadius: 4,
  opacity: 0.75,
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
