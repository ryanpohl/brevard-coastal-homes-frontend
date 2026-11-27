'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import * as api from '@/lib/api';
import { rememberAlertEmail, rememberedAlertEmail } from '@/lib/alertMemory';

/**
 * "This month's builder incentives" signup near the top of a new-construction
 * community page (2026-11-26, per Ryan: Adelaide gets plenty of visits but
 * few signups; he gets the incentives from the builders' reps each month).
 * Email only. Signs them up for the page's listing alerts (move-in-ready
 * homes) and the monthly incentives email; the lead sheet shows
 * "{label} Builder Incentives Signup".
 */
export default function BuilderIncentivesSignup({ label, filter }) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, error: '', done: '' });

  useEffect(() => {
    setEmail((current) => current || rememberedAlertEmail());
  }, []);

  async function submit(e) {
    e.preventDefault();
    setState({ sending: true, error: '', done: '' });
    try {
      const res = await api.subscribeListingAlert({
        email: email.trim(),
        label,
        pagePath: pathname,
        filter,
        via: 'builder_incentives',
      });
      rememberAlertEmail(email);
      setState({ sending: false, error: '', done: res?.message || `You're signed up! Look for this month's ${label} builder incentives in your inbox.` });
    } catch (err) {
      setState({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: '' });
    }
  }

  return (
    <div className="incentives-card">
      <div className="incentives-card__label">Builder Incentives</div>
      {state.done ? (
        <p className="incentives-card__text" role="status">
          ✓ {state.done}
        </p>
      ) : (
        <>
          <p className="incentives-card__text">
            <strong>Get this month&rsquo;s {label} builder incentives</strong> and move-in-ready homes, emailed to you.
          </p>
          <form className="incentives-card__form" onSubmit={submit}>
            <label className="visually-hidden" htmlFor="incentives-email">
              Email
            </label>
            <input
              id="incentives-email"
              type="email"
              required
              autoComplete="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-gold" disabled={state.sending}>
              {state.sending ? 'Sending…' : 'Email Me'}
            </button>
          </form>
          {state.error && <p className="error-text">{state.error}</p>}
        </>
      )}
    </div>
  );
}
