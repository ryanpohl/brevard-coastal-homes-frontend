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

  return (
    <div
      style={{ background: 'var(--color-nav-bg)', position: 'relative', zIndex: 30 }}
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px clamp(16px, 4vw, 56px)' }}
      >
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: 0.5 }}
        >
          Brevard Coastal Homes
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <NavLink label="Search by City" active={openMenu === 'city'} onEnter={() => openNow('city')} />
          <NavLink
            label="Search by Neighborhood"
            active={openMenu === 'neighborhood'}
            onEnter={() => openNow('neighborhood')}
          />
          <NavLink label="Looking to Sell" href="/looking-to-sell" plain />
          <NavLink label="Contact Us" href="/contact" plain />

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

      {openMenu === 'city' && (
        <DropdownPanel wide grid={5}>
          {cities.map((city) => (
            <Link key={city.slug} href={`/${city.slug}/${PROPERTY_TYPE_TO_SLUG.Home}`} style={gridLinkStyle}>
              {city.name}
            </Link>
          ))}
        </DropdownPanel>
      )}

      {openMenu === 'neighborhood' && (
        <DropdownPanel wide grid={4}>
          {neighborhoods.map((n) => (
            <Link key={n.slug} href={`/neighborhoods/${n.slug}`} style={gridLinkStyle}>
              {n.name}
            </Link>
          ))}
        </DropdownPanel>
      )}

      {openMenu === 'account' && signedIn && (
        <div
          className="card"
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
          <p style={{ fontWeight: 700, marginBottom: 12 }}>{user?.name}</p>
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
            style={{ width: '100%', marginTop: 8 }}
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

function NavLink({ label, href, plain, gold, active, onEnter }) {
  const base = {
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: 'uppercase',
    padding: '9px 16px',
    borderRadius: 3,
    whiteSpace: 'nowrap',
    border: gold ? 'none' : '1px solid rgba(255,255,255,0.5)',
    background: gold ? 'var(--color-gold)' : 'transparent',
  };
  const style = gold ? { ...base, color: 'var(--color-ink-dark)' } : base;

  if (href) {
    return (
      <Link href={href} style={style}>
        {label}
      </Link>
    );
  }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={onEnter}>
      <button type="button" style={{ ...style, cursor: 'pointer' }} onClick={onEnter}>
        {label}
      </button>
    </div>
  );
}

function DropdownPanel({ children, grid }) {
  return (
    <div
      className="container"
      style={{ position: 'absolute', top: '100%', left: 0, right: 0, display: 'flex', justifyContent: 'flex-end' }}
    >
      <div
        className="card"
        style={{
          marginTop: 8,
          padding: 18,
          display: 'grid',
          gridTemplateColumns: `repeat(${grid}, minmax(140px, 1fr))`,
          gap: 8,
          boxShadow: 'var(--shadow-nav-menu)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

const gridLinkStyle = {
  padding: '8px 10px',
  fontSize: 13,
  borderRadius: 4,
  color: 'var(--color-ink)',
};

const accountRowStyle = {
  display: 'block',
  padding: '10px 12px',
  border: '1px solid var(--color-border-light)',
  borderRadius: 6,
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-success)',
};
