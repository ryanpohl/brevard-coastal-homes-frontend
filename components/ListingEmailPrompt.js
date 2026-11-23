'use client';

import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { isWatchedHome, rememberAlertEmail, rememberedAlertEmail, rememberWatchedHome } from '@/lib/alertMemory';
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
// Soft signup box (2026-11-15, per Ryan: "build the soft version"). A bigger,
// centered version of this card on a visitor's 3rd different listing, again
// on the 6th, then every 5th (11, 16, ...). "Continue browsing" closes it
// and quiets the small cards for 7 days (like "No thanks"), but the box
// itself still comes back at the next step. Never on the first page of a visit (the page someone lands on from
// Google or an ad), never for signed-in visitors or anyone who has given an
// email on this device. Google always loads a page fresh, as a first
// visit, so it never sees the box. ?signupbox=1 forces it (testing).
//
// Required from the 6th listing (2026-11-23, per Ryan: "start at 6 & if that
// doesn't work after 2 weeks we can move it down to 5"). From a visitor's
// REQUIRED_AT-th different listing (14 days), the box can't be closed: they
// sign up with an email (or sign in) to keep viewing listings. Same rules
// otherwise: never on the first page of a visit, never for signed-in
// visitors or anyone who has given an email on this device, so Google
// (always a first visit) never sees it. The closable box still shows on the
// 3rd listing. ?signupbox=required forces the required box (testing).
const REQUIRED_AT = 6;
const GATE_KEY = 'bch-signup-box-step';
const SESSION_KEY = 'bch-session-listings';

function nextGateStep(shown) {
  // The closable box shows once, on the 3rd listing; from REQUIRED_AT on the required box takes over.
  return shown < 3 ? 3 : Infinity;
}

function sessionListingCount() {
  try {
    const n = Number(sessionStorage.getItem(SESSION_KEY) || 0) + 1;
    sessionStorage.setItem(SESSION_KEY, String(n));
    return n;
  } catch {
    return 1;
  }
}

function gateForced() {
  try {
    const v = new URLSearchParams(window.location.search).get('signupbox');
    return v === '1' || v === 'required';
  } catch {
    return false;
  }
}

function requiredForced() {
  try {
    return new URLSearchParams(window.location.search).get('signupbox') === 'required';
  } catch {
    return false;
  }
}

const VIEWS_KEY = 'bch-listing-views';
const MIN_VIEWS = 2;
const WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const DELAY_MS = 6000;
const GATE_DELAY_MS = 2500;

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
  const { user, promptSignIn } = useAuth();
  const [show, setShow] = useState(false);
  const [exit, setExit] = useState(false);
  const [gate, setGate] = useState(false);
  const [required, setRequired] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, error: '', done: false });
  const underContract = status === 'Pending' || status === 'Contingent';

  useEffect(() => {
    const forced = promptForced();
    const viewed = countView(listingId);
    const inSession = sessionListingCount();
    if (!['Active', 'Pending', 'Contingent'].includes(status)) return undefined;
    // Soft signup box: ignores the 7-day "No thanks" snooze, nothing else.
    const signedUp = !!user || !!rememberedAlertEmail();
    // Views older than two weeks drop off the count; start the steps over then.
    const shown = Number(readJson(GATE_KEY, 0)) || 0;
    const step = nextGateStep(viewed < shown ? 0 : shown);
    const eligible = !signedUp && !isWatchedHome(listingId) && inSession >= 2;
    if (requiredForced() || (eligible && viewed >= REQUIRED_AT)) {
      const t = setTimeout(() => {
        setRequired(true);
        setGate(true);
        setShow(true);
      }, requiredForced() ? 800 : GATE_DELAY_MS);
      return () => clearTimeout(t);
    }
    if (gateForced() || (eligible && viewed >= step)) {
      if (!gateForced()) writeJson(GATE_KEY, viewed);
      const t = setTimeout(() => {
        setGate(true);
        setShow(true);
      }, gateForced() ? 800 : GATE_DELAY_MS);
      return () => clearTimeout(t);
    }
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

  // The required box keeps the page behind it from scrolling.
  useEffect(() => {
    if (!(show && required && !state.done)) return undefined;
    // ...and keeps the phone Call / Text Ryan bar usable above the overlay.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('signup-required');
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove('signup-required');
    };
  }, [show, required, state.done]);

  function dismiss() {
    if (required && !state.done) return;
    // Either close quiets the small cards for 7 days; the signup box ignores that.
    if (!state.done) snoozePrompts();
    setShow(false);
  }

  async function submit(e) {
    e.preventDefault();
    setState({ sending: true, error: '', done: false });
    try {
      await api.watchHome(listingId, email.trim(), required ? 'signup_box_required' : gate ? 'signup_box' : 'email_prompt');
      rememberAlertEmail(email);
      rememberWatchedHome(listingId);
      setState({ sending: false, error: '', done: true });
      setTimeout(() => setShow(false), required ? 2500 : 6000);
    } catch (err) {
      // A returning subscriber can hit the per-email home limit or the hourly
      // signup limit. They're already on Ryan's list, so the required box
      // lets them through instead of leaving them stuck.
      if (required && /maximum|too many/i.test(String(err.message || '')) && /\S+@\S+\.\S+/.test(email)) {
        rememberAlertEmail(email);
        setState({ sending: false, error: '', done: true });
        setTimeout(() => setShow(false), 1500);
        return;
      }
      setState({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: false });
    }
  }

  if (!show) return null;

  if (gate) {
    return (
      <>
        <div className={`email-prompt-backdrop${required ? ' signup-box-backdrop--required' : ''}`} onClick={dismiss} aria-hidden="true" />
        <div className="email-prompt email-prompt--exit signup-box" role="dialog" aria-modal="true" aria-label="Sign up free">
          {!required && (
            <button type="button" className="email-prompt__close" onClick={dismiss} aria-label="Close">
              ×
            </button>
          )}
          {state.done ? (
            <div className="email-prompt__done" role="status">
              <div className="email-prompt__title">✓ You&rsquo;re signed up</div>
              <p>Check your inbox for the full report on {address}. We&rsquo;ll email you if anything changes.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="email-prompt__kicker">Free signup</div>
              <div className="email-prompt__title">{required ? 'Sign up free to keep browsing' : 'Don’t miss the right home'}</div>
              <p className="email-prompt__text">
                {required
                  ? 'Enter your email to keep viewing homes. '
                  : 'Sign up with just your email. '}
                We&rsquo;ll send you the full report on {address} (taxes, HOA, lot size, schools) and let you know{' '}
                {underContract ? 'if it comes back on the market' : 'the moment its price drops or it goes under contract'}.
              </p>
              <div className="email-prompt__row">
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
                  {state.sending ? 'Signing up…' : 'Sign Up Free'}
                </button>
              </div>
              {state.error && <p className="error-text email-prompt__note">{state.error}</p>}
              <p className="email-prompt__note">
                No password. Unsubscribe anytime.{required ? ' Signed up before? Just enter the same email.' : ''}
              </p>
              {required ? (
                <p className="signup-box__alt">
                  Prefer to talk? Call or text{' '}
                  <a href="tel:+13213507661" className="signup-box__link">
                    321-350-7661
                  </a>
                  <br />
                  Already have an account?{' '}
                  <button type="button" className="signup-box__link" onClick={() => promptSignIn('Sign in to keep browsing homes.')}>
                    Sign in
                  </button>
                  {' · '}
                  <button type="button" className="signup-box__link" onClick={() => window.history.back()}>
                    Go back
                  </button>
                </p>
              ) : (
                <button type="button" className="signup-box__continue" onClick={dismiss}>
                  Continue browsing
                </button>
              )}
            </form>
          )}
        </div>
      </>
    );
  }

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
