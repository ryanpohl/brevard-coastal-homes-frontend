'use client';

import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { isWatchedHome, rememberAlertEmail, rememberWatchedHome } from '@/lib/alertMemory';
import { promptAllowed, promptForced, snoozePrompts, watchExitIntent } from '@/lib/emailPrompt';

/**
 * Gentle email prompt on listing pages (2026-10-13, per Ryan: ad visitors
 * browse for minutes but almost never leave contact info, and he doesn't
 * want a forced signup). On someone's second listing within two weeks,
 * after a few seconds on the page, a small dismissible card offers this
 * home's full property report by email plus price-drop / status alerts —
 * the same POST /api/alerts/home/:id as the 🔔 link (report email, alerts,
 * CRM lead and staff email). Never shown to signed-in visitors, anyone who
 * has already given an email on this device, or for a home they already
 * watch; "No thanks" hides it for 7 days. ?emailprompt=1 forces it (testing).
 * On computers it also opens on the first listing as a centered "Before
 * you go" card when the visitor heads for the top of the window to leave
 * (watchExitIntent), if it hasn't shown yet.
 */
const VIEWS_KEY = 'bch-listing-views';
const MIN_VIEWS = 2;
const WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const DELAY_MS = 6000;

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked: the prompt just won't count views.
  }
}

// Records this listing view; returns how many different listings were viewed in the window.
function countView(listingId) {
  const now = Date.now();
  const views = readJson(VIEWS_KEY, []).filter((v) => v && now - v.t < WINDOW_MS && v.id !== listingId);
  views.push({ id: listingId, t: now });
  writeJson(VIEWS_KEY, views.slice(-50));
  return views.length;
}

export default function ListingEmailPrompt({ listingId, address, status }) {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [exit, setExit] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, error: '', done: false });
  const underContract = status === 'Pending' || status === 'Contingent';

  useEffect(() => {
    const forced = promptForced();
    const viewed = countView(listingId);
    if (!['Active', 'Pending', 'Contingent'].includes(status)) return undefined;
    if (!forced && (!promptAllowed(user) || isWatchedHome(listingId))) return undefined;
    let done = false;
    const open = (onExit = false) => {
      if (done) return;
      done = true;
      setExit(onExit);
      setShow(true);
    };
    // The timed card waits for a second listing; leaving opens it on the first.
    const timer = forced || viewed >= MIN_VIEWS ? setTimeout(() => open(), forced ? 800 : DELAY_MS) : null;
    const stopExit = watchExitIntent(() => open(true));
    return () => {
      if (timer) clearTimeout(timer);
      stopExit();
    };
  }, [listingId, user, status]);

  function dismiss() {
    if (!state.done) snoozePrompts();
    setShow(false);
  }

  async function submit(e) {
    e.preventDefault();
    setState({ sending: true, error: '', done: false });
    try {
      await api.watchHome(listingId, email.trim(), 'email_prompt');
      rememberAlertEmail(email);
      rememberWatchedHome(listingId);
      setState({ sending: false, error: '', done: true });
      setTimeout(() => setShow(false), 6000);
    } catch (err) {
      setState({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: false });
    }
  }

  if (!show) return null;

  return (
    <>
      {exit && <div className="email-prompt-backdrop" onClick={dismiss} aria-hidden="true" />}
      <div className={`email-prompt${exit ? ' email-prompt--exit' : ''}`} role="dialog" aria-label="Get the full report on this home">
        <button type="button" className="email-prompt__close" onClick={dismiss} aria-label="Close">
          ×
        </button>
        {state.done ? (
          <div className="email-prompt__done" role="status">
            <div className="email-prompt__title">✓ The report is on its way</div>
            <p>Check your inbox for the full report on {address}. We&rsquo;ll email you if anything changes.</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            {exit && <div className="email-prompt__kicker">Before you go</div>}
            <div className="email-prompt__title">Want the full report on this home?</div>
            <p className="email-prompt__text">
              We&rsquo;ll email you the details for {address}: taxes, HOA, lot size, schools and more, plus an alert{' '}
              {underContract ? 'if it comes back on the market.' : 'if the price drops or it goes under contract.'}
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
                {state.sending ? 'Sending…' : 'Email Me'}
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
