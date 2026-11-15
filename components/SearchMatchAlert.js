'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { rememberAlertEmail, rememberedAlertEmail } from '@/lib/alertMemory';

/**
 * "Email me new homes that match this search" (2026-11-15, per Ryan: more
 * signups without making the site look busy). One quiet line under the
 * filter bar, shown only once the visitor has set a price, bed, bath or
 * waterfront filter. Tapping it opens one email box in place. The alert
 * uses the exact filter the page's listing grid uses, so new matches and
 * price drops arrive after the hourly MLS update (backend
 * listingAlerts.service.js). Lead sheet: "Listing Alert Signup (saved search)".
 */
function money(n) {
  const v = Number(n);
  if (!v) return '';
  if (v >= 1000000) return `$${(v / 1000000).toFixed(v % 1000000 ? 1 : 0).replace(/\.0$/, '')}M`;
  return `$${Math.round(v / 1000)}K`;
}

const NOUNS = { Home: 'homes', Condo: 'condos', Land: 'lots', Townhouse: 'townhomes' };

export function describeSearch(place, f) {
  const types = String(f.propertyType || '')
    .split(',')
    .filter(Boolean)
    .map((t) => NOUNS[t] || 'homes');
  const uniq = [...new Set(types)];
  const noun = !uniq.length ? 'listings' : uniq.length === 1 ? uniq[0] : `${uniq.slice(0, -1).join(', ')} & ${uniq[uniq.length - 1]}`;
  const parts = [`${place} ${noun}`];
  if (f.priceMin && f.priceMax) parts.push(`${money(f.priceMin)}–${money(f.priceMax)}`);
  else if (f.priceMax) parts.push(`under ${money(f.priceMax)}`);
  else if (f.priceMin) parts.push(`${money(f.priceMin)}+`);
  if (f.beds) parts.push(`${f.beds}+ beds`);
  if (f.baths) parts.push(`${f.baths}+ baths`);
  if (f.waterfront) parts.push(String(f.waterfront).split(',').join(' or ').toLowerCase());
  return parts.join(', ').slice(0, 120);
}

export default function SearchMatchAlert({ place, filter }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, error: '', done: false });

  // Only the keys that matter for an alert, arrays as comma lists, no blanks.
  const clean = Object.fromEntries(
    Object.entries(filter || {})
      .filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length))
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : String(v)])
  );
  const label = describeSearch(place, clean);

  async function send(address) {
    setState({ sending: true, error: '', done: false });
    try {
      await api.subscribeListingAlert({ email: address, label, pagePath: pathname, filter: clean, via: 'search' });
      rememberAlertEmail(address);
      setState({ sending: false, error: '', done: true });
    } catch (err) {
      setState({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: false });
    }
  }

  function start() {
    // Already gave an email on this device (or signed in): one tap.
    const known = user?.email || rememberedAlertEmail();
    if (known) send(known);
    else setOpen(true);
  }

  if (state.done) {
    return (
      <p className="search-match" role="status">
        ✓ Done. We&rsquo;ll email you new matches and price drops ({label}).
      </p>
    );
  }

  if (!open) {
    return (
      <p className="search-match">
        <button type="button" className="search-match__link" onClick={start} disabled={state.sending}>
          <span aria-hidden="true">🔔</span> {state.sending ? 'Signing you up…' : 'Email me new homes that match this search'}
        </button>
        {state.error && <span className="error-text"> {state.error}</span>}
      </p>
    );
  }

  return (
    <form
      className="search-match search-match--open"
      onSubmit={(e) => {
        e.preventDefault();
        send(email.trim());
      }}
    >
      <span className="search-match__label">New matches for {label}:</span>
      <input
        type="email"
        required
        autoFocus
        placeholder="Your email"
        aria-label="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="btn btn-gold" disabled={state.sending}>
        {state.sending ? 'Sending…' : 'Email Me'}
      </button>
      {state.error && <span className="error-text">{state.error}</span>}
    </form>
  );
}
