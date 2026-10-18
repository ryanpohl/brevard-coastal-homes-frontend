'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import * as api from '@/lib/api';
import { rememberedAlertEmail, rememberAlertEmail } from '@/lib/alertMemory';

/**
 * "Email me similar homes" on Pending and Sold listings (2026-10-18, per
 * Ryan): someone who loved a home that's gone is a ready buyer. Just an
 * email — it's a regular listing alert (POST /api/alerts) for the same
 * town, type, price range and bedrooms (`filter` and `label` built in
 * app/listings/[id]/page.js's similarHomesAlert). The welcome email shows
 * homes like it for sale now; Ryan gets a "Similar Homes Alert Signup".
 * Shown in the contact panel where the Request Showing form would be.
 */
export default function SimilarHomesSignup({ label, filter }) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ sending: false, error: '', done: '' });

  useEffect(() => {
    setEmail((current) => current || rememberedAlertEmail());
  }, []);

  async function submit(e) {
    e.preventDefault();
    setStatus({ sending: true, error: '', done: '' });
    try {
      await api.subscribeListingAlert({ email: email.trim(), label, pagePath: pathname, filter });
      rememberAlertEmail(email);
      setStatus({ sending: false, error: '', done: 'You’re signed up! Check your email for homes like this for sale now.' });
    } catch (err) {
      setStatus({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: '' });
    }
  }

  return (
    <div style={{ padding: '22px 24px 26px' }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, color: 'var(--color-ink)' }}>Email me similar homes</div>
      <p style={{ fontSize: 14, color: 'var(--color-muted-dark)', margin: '6px 0 14px', lineHeight: 1.5 }}>
        Get new listings like this one ({label}) as soon as they hit the market. No account needed — unsubscribe anytime.
      </p>
      {status.done ? (
        <p role="status" style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: 15, margin: 0 }}>
          ✓ {status.done}
        </p>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="email"
            required
            placeholder="Your email"
            aria-label="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ minHeight: 44, padding: '10px 14px', border: '1px solid var(--color-border-warm)', borderRadius: 4, fontSize: 15 }}
          />
          <button type="submit" className="btn btn-gold" disabled={status.sending} style={{ minHeight: 44 }}>
            {status.sending ? 'Signing up…' : 'Email Me Similar Homes'}
          </button>
          {status.error && <p className="error-text" style={{ margin: 0 }}>{status.error}</p>}
        </form>
      )}
    </div>
  );
}
