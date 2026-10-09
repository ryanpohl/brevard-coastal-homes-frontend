'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import * as api from '@/lib/api';

/**
 * "Email me when a home is listed in {label}" box for condo building and
 * neighborhood pages (2026-10-09, per Ryan). Just an email address — no
 * account. `filter` is the page's own listings filter (the same params its
 * listing grid uses), so the alert matches exactly what the page shows.
 * The backend emails each new matching listing once, right after the
 * hourly MLS update (backend src/services/listingAlerts.service.js), and
 * notifies Ryan + the CRM of the signup.
 */
export default function ListingAlertSignup({ label, filter, kind = 'home' }) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ sending: false, error: '', done: '' });

  async function submit(e) {
    e.preventDefault();
    setStatus({ sending: true, error: '', done: '' });
    try {
      const res = await api.subscribeListingAlert({ email: email.trim(), label, pagePath: pathname, filter });
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
    <section className="listing-alert" aria-label={`New listing alerts for ${label}`}>
      <div className="listing-alert__text">
        <div className="listing-alert__title">Get new {label} listings by email</div>
        <div className="listing-alert__sub">
          Be the first to know when a {kind} is listed in {label}. No account needed — unsubscribe anytime.
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
            {status.sending ? 'Signing up…' : 'Email Me New Listings'}
          </button>
          {status.error && <p className="error-text listing-alert__error">{status.error}</p>}
        </form>
      )}
    </section>
  );
}
