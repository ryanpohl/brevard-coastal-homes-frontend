'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import * as api from '@/lib/api';
import { rememberedAlertEmail, rememberAlertEmail } from '@/lib/alertMemory';

/**
 * "Email me this weekend's {town} open houses" (2026-10-24, per Ryan) on
 * the city Open Houses pages. Just an email: the backend
 * (src/services/openHouseEmail.service.js) sends every upcoming open house
 * right away, then that weekend's open houses each Friday morning, and
 * notifies Ryan + the CRM. Styled like SoldReportSignup.js.
 */
export default function OpenHouseEmailSignup({ townName, filter }) {
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
      const res = await api.subscribeOpenHouses({ email: email.trim(), townName, pagePath: pathname, filter });
      rememberAlertEmail(email);
      setStatus({ sending: false, error: '', done: res.message || 'You’re signed up!' });
    } catch (err) {
      setStatus({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: '' });
    }
  }

  return (
    <section className="listing-alert" aria-label={`Weekly ${townName} open house email`} style={{ margin: '0 0 24px' }}>
      <div className="listing-alert__text">
        <div className="listing-alert__title">Email me this weekend&apos;s {townName} open houses</div>
        <div className="listing-alert__sub">
          Every Friday morning: each open house in {townName} with the times, photos and prices. No account needed — unsubscribe anytime.
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
            {status.sending ? 'Signing up…' : 'Email Me'}
          </button>
          {status.error && <p className="error-text listing-alert__error">{status.error}</p>}
        </form>
      )}
    </section>
  );
}
