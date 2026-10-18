'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import * as api from '@/lib/api';
import { rememberedAlertEmail, rememberAlertEmail } from '@/lib/alertMemory';

/**
 * "Get {town} sold prices by email every month" (2026-10-18, per Ryan:
 * seller leads without a forced signup). On the Realtor pages and in the
 * About section of city pages. Just an email: the backend
 * (src/services/soldReport.service.js) sends last month's sales right away,
 * then a new report early each month, with a free home value link, and
 * notifies Ryan + the CRM. `filter` is the page's listings filter, so the
 * report covers the same homes the page does. Styled like the listing
 * alert box (ListingAlertSignup.js).
 */
export default function SoldReportSignup({ townName, filter, listingsPath }) {
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
      const res = await api.subscribeSoldReport({ email: email.trim(), townName, pagePath: pathname, listingsPath, filter });
      rememberAlertEmail(email);
      setStatus({ sending: false, error: '', done: res.message || 'You’re signed up!' });
    } catch (err) {
      setStatus({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: '' });
    }
  }

  return (
    <section className="listing-alert" aria-label={`Monthly ${townName} sold report`} style={{ margin: '18px 0 24px' }}>
      <div className="listing-alert__text">
        <div className="listing-alert__title">Get {townName} sold prices by email every month</div>
        <div className="listing-alert__sub">
          See what homes near you sold for, how fast, and how close to asking. No account needed — unsubscribe anytime.
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
            {status.sending ? 'Signing up…' : 'Send Me the Report'}
          </button>
          {status.error && <p className="error-text listing-alert__error">{status.error}</p>}
        </form>
      )}
    </section>
  );
}
