'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { rememberAlertEmail } from '@/lib/alertMemory';
import { promptAllowed, promptForced, snoozePrompts, watchExitIntent } from '@/lib/emailPrompt';

/**
 * Email offer on the pages the Google Ads land on (2026-10-13, per Ryan:
 * "I would be excited to even get email addresses of buyers"). After 30
 * seconds on the page, or once the visitor scrolls past the first listings,
 * a small dismissible card slides in:
 *   - neighborhood and condo building pages (`label` + `filter`): new
 *     listings and price drops for that place, the same signup as the Get
 *     Alerts box under the listings (POST /api/alerts);
 *   - city pages (`townSlug` + `townName`): the free relocation guide for
 *     that town, emailed as a PDF (POST /api/guides/relocation). Not
 *     city-wide alerts, which Ryan said would feel like spam.
 * Same rules as the listing prompt (lib/emailPrompt.js). On computers it
 * also opens as a centered "Before you go" card when the visitor heads for
 * the top of the window to leave (watchExitIntent), if it hasn't shown yet.
 */
const DELAY_MS = 30000;
const SCROLL_SHARE = 0.45;

export default function PageEmailPrompt({ label, filter, kind = 'home', townSlug, townName }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [exit, setExit] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, error: '', done: '' });
  const guide = !!townSlug;

  useEffect(() => {
    const forced = promptForced();
    if (!forced && !promptAllowed(user)) return undefined;
    let done = false;
    const open = (onExit = false) => {
      if (done) return;
      done = true;
      setExit(onExit);
      setShow(true);
    };
    const timer = setTimeout(() => open(), forced ? 800 : DELAY_MS);
    const stopExit = watchExitIntent(() => open(true));
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > SCROLL_SHARE) open();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      stopExit();
      window.removeEventListener('scroll', onScroll);
    };
  }, [user, pathname]);

  function dismiss() {
    if (!state.done) snoozePrompts();
    setShow(false);
  }

  async function submit(e) {
    e.preventDefault();
    setState({ sending: true, error: '', done: '' });
    try {
      const address = email.trim();
      if (guide) {
        await api.requestRelocationGuide({ email: address, town: townSlug, pagePath: pathname });
      } else {
        await api.subscribeListingAlert({ email: address, label, pagePath: pathname, filter });
      }
      rememberAlertEmail(address);
      setState({ sending: false, error: '', done: guide ? 'guide' : 'alerts' });
      setTimeout(() => setShow(false), 6000);
    } catch (err) {
      setState({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: '' });
    }
  }

  if (!show) return null;

  const what = kind === 'condo' ? 'condo' : 'home';
  return (
    <>
      {exit && <div className="email-prompt-backdrop" onClick={dismiss} aria-hidden="true" />}
      <div
        className={`email-prompt${exit ? ' email-prompt--exit' : ''}`}
        role="dialog"
        aria-label={guide ? 'Free relocation guide' : `${label} listing alerts`}
      >
        <button type="button" className="email-prompt__close" onClick={dismiss} aria-label="Close">
          ×
        </button>
        {state.done ? (
          <div className="email-prompt__done" role="status">
            <div className="email-prompt__title">✓ You&rsquo;re all set</div>
            <p>
              {state.done === 'guide'
                ? 'Check your inbox. Your Brevard County relocation guide is on its way.'
                : `We’ll email you new ${label} listings and price drops. Unsubscribe anytime.`}
            </p>
          </div>
        ) : (
          <form onSubmit={submit}>
            {exit && <div className="email-prompt__kicker">Before you go</div>}
            <div className="email-prompt__title">
              {guide ? `Moving to ${townName}?` : `Get new ${label} listings first`}
            </div>
            <p className="email-prompt__text">
              {guide
                ? `Get our free Brevard County relocation guide: what it’s like to live in ${townName}, costs, insurance and the steps to buying here, sent to your inbox as a PDF.`
                : `We’ll email you when a new ${what} lists in ${label} or a price drops, so you hear about it before it’s gone.`}
            </p>
            <div className="email-prompt__row">
              <input
                type="email"
                required
                placeholder="Your email"
                aria-label="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-gold" disabled={state.sending}>
                {state.sending ? 'Sending…' : guide ? 'Send Guide' : 'Get Alerts'}
              </button>
            </div>
            {state.error && <p className="error-text email-prompt__note">{state.error}</p>}
            <p className="email-prompt__note">
              No account needed. Unsubscribe anytime.{' '}
              <button type="button" className="email-prompt__skip" onClick={dismiss}>
                No thanks
              </button>
            </p>
          </form>
        )}
      </div>
    </>
  );
}
