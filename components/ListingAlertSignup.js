'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { rememberAlertEmail, rememberWatchedHome, rememberedAlertEmail } from '@/lib/alertMemory';

/**
 * "Get {label} listings & price drops by email" box for condo building and
 * neighborhood pages (2026-10-09, per Ryan; price drops added the same day). Just an email address — no
 * account. `filter` is the page's own listings filter (the same params its
 * listing grid uses), so the alert matches exactly what the page shows.
 * The backend emails each new matching listing once, and any price drop,
 * right after the hourly MLS update (backend src/services/listingAlerts.service.js), and
 * notifies Ryan + the CRM of the signup.
 */
// Small "Get alerts" line near the top of a page that scrolls down to the
// signup box, so visitors see the option without the box pushing the
// listings down (2026-10-09, per Ryan).
export function ListingAlertJumpLink() {
  return (
    <a
      href="#listing-alerts"
      className="listing-alert-jump"
      onClick={(e) => {
        const box = document.getElementById('listing-alerts');
        if (!box) return;
        e.preventDefault();
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Put the cursor in the email box once it's in view.
        setTimeout(() => box.querySelector('input')?.focus({ preventScroll: true }), 500);
      }}
    >
      <span aria-hidden="true">🔔</span> Get alerts for new listings &amp; price drops
    </a>
  );
}

export default function ListingAlertSignup({ label, filter, kind = 'home' }) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ sending: false, error: '', done: '' });

  // Prefill with the email from an earlier alert signup on this device.
  useEffect(() => {
    setEmail((current) => current || rememberedAlertEmail());
  }, []);

  async function submit(e) {
    e.preventDefault();
    setStatus({ sending: true, error: '', done: '' });
    try {
      const res = await api.subscribeListingAlert({ email: email.trim(), label, pagePath: pathname, filter });
      rememberAlertEmail(email);
      setStatus({ sending: false, error: '', done: res.message || 'You’re signed up!' });
      try {
        window.gtag?.('event', 'listing_alert_signup', { event_category: 'lead', event_label: label });
      } catch {
        // Tracking never blocks the signup.
      }
    } catch (err) {
      setStatus({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: '' });
    }
  }

  return (
    <section id="listing-alerts" className="listing-alert" aria-label={`Listing alerts for ${label}`}>
      <div className="listing-alert__text">
        <div className="listing-alert__title">Get {label} listings &amp; price drops by email</div>
        <div className="listing-alert__sub">
          Be the first to know when a {kind} is listed in {label} or drops its price. No account needed — unsubscribe
          anytime.
        </div>
      </div>
      {status.done ? (
        <div className="listing-alert__done" role="status">
          ✓ {status.done}
        </div>
      ) : (
        <form className="listing-alert__form" onSubmit={submit}>
          <input
            type="email"
            required
            placeholder="Your email"
            aria-label="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-gold" disabled={status.sending}>
            {status.sending ? 'Signing up…' : 'Get Alerts'}
          </button>
          {status.error && <p className="error-text listing-alert__error">{status.error}</p>}
        </form>
      )}
    </section>
  );
}

/**
 * "🔔 Get price-drop alerts for this home" under the price on a listing page
 * (2026-10-10, per Ryan). A small link that opens an email box in place, so
 * it doesn't crowd the page. The backend (src/services/homeWatch.service.js)
 * emails when this home drops its price, goes under contract, sells, or
 * comes back on the market. Signed-in visitors get their email filled in;
 * hearting a home turns the same alerts on.
 */
export function HomeAlertSignup({ listingId, status }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, error: '', done: '' });
  const underContract = status === 'Pending' || status === 'Contingent';

  async function submit(e) {
    e.preventDefault();
    setState({ sending: true, error: '', done: '' });
    try {
      await api.watchHome(listingId, email.trim());
      rememberAlertEmail(email);
      rememberWatchedHome(listingId);
      setState({ sending: false, error: '', done: 'You’re signed up for alerts on this home.' });
      try {
        window.gtag?.('event', 'home_alert_signup', { event_category: 'lead', event_label: String(listingId) });
      } catch {
        // Tracking never blocks the signup.
      }
    } catch (err) {
      setState({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: '' });
    }
  }

  if (state.done) {
    return (
      <div className="home-alert home-alert__done" role="status">
        ✓ {state.done}
      </div>
    );
  }
  if (!open) {
    return (
      <div className="home-alert">
        <button
          type="button"
          className="home-alert__toggle"
          onClick={() => {
            setOpen(true);
            if (!email) setEmail(user?.email || rememberedAlertEmail());
          }}
        >
          <span aria-hidden="true">🔔</span>{' '}
          {underContract ? 'Get an alert if this home comes back on the market' : 'Get price-drop alerts for this home'}
        </button>
      </div>
    );
  }
  return (
    <form className="home-alert home-alert__form" onSubmit={submit}>
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
        {state.sending ? 'Signing up…' : 'Get Alerts'}
      </button>
      <p className="home-alert__note">Price drops &amp; status changes for this home. No account needed — unsubscribe anytime.</p>
      {state.error && <p className="error-text home-alert__note">{state.error}</p>}
    </form>
  );
}
