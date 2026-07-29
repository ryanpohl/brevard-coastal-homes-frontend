'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';
import ListingCard from '@/components/ListingCard';

/**
 * Sign-in-gated account page (design/README.md's "My Account"): profile
 * info + edit, Favorite Properties list, sign out. This whole page is a
 * Client Component because the session lives in localStorage (client-only)
 * — there's no server-side way to know who's signed in.
 */
export default function MyAccountPage() {
  const { ready, signedIn, user, token, signOut, updateUser } = useAuth();

  return (
    <div className="container" style={{ padding: '48px clamp(16px, 4vw, 56px) 64px' }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 24 }}>My Account</h1>

      {!ready && <p style={{ color: 'var(--color-muted)' }}>Loading…</p>}

      {ready && !signedIn && (
        <div className="card" style={{ padding: 24, maxWidth: 480 }}>
          <p style={{ marginBottom: 12 }}>Please sign in to view your account and saved favorites.</p>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
            Use <strong>Sign In</strong> in the navigation bar above, or{' '}
            <Link href="/" style={{ textDecoration: 'underline' }}>
              go back home
            </Link>
            .
          </p>
        </div>
      )}

      {ready && signedIn && (
        <>
          <ProfileSection user={user} token={token} onUpdated={updateUser} onSignOut={signOut} />
          <FavoritesSection id="favorites" token={token} />
        </>
      )}
    </div>
  );
}

function ProfileSection({ user, token, onUpdated, onSignOut }) {
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '' });
    try {
      const { user: nextUser } = await api.updateAccount(token, { name: form.name, email: form.email });
      onUpdated(nextUser);
      setStatus({ submitting: false, error: '', success: 'Profile updated.' });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong.', success: '' });
    }
  }

  return (
    <div className="card" style={{ padding: 24, maxWidth: 480, marginBottom: 40 }}>
      <h2 style={{ fontSize: 18, marginBottom: 16 }}>Profile</h2>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ fontSize: 12, fontWeight: 600 }}>
          Name
          <input value={form.name} onChange={(e) => update('name', e.target.value)} required style={{ marginTop: 4 }} />
        </label>
        <label style={{ fontSize: 12, fontWeight: 600 }}>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
            style={{ marginTop: 4 }}
          />
        </label>

        {status.error && <p className="error-text">{status.error}</p>}
        {status.success && <p style={{ color: 'var(--color-success)', fontSize: 13 }}>{status.success}</p>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={status.submitting}>
            {status.submitting ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-outline" onClick={onSignOut}>
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
}

function FavoritesSection({ id, token }) {
  const [favorites, setFavorites] = useState(null); // null = loading
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .getFavorites(token)
      .then((data) => {
        if (!cancelled) setFavorites(data.favorites || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load favorites.');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div id={id}>
      <h2 style={{ fontSize: 18, marginBottom: 16 }}>Favorite Properties</h2>

      {error && <p className="error-text">{error}</p>}
      {favorites === null && !error && <p style={{ color: 'var(--color-muted)' }}>Loading your favorites…</p>}
      {favorites && favorites.length === 0 && (
        <p style={{ color: 'var(--color-muted)' }}>
          You haven&apos;t saved any properties yet. Tap the heart icon on any listing to save it here.
        </p>
      )}

      {favorites && favorites.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {favorites.map((listing) => (
            <ListingCard key={listing.id} listing={{ ...listing, isFavorited: true }} />
          ))}
        </div>
      )}
    </div>
  );
}
