'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';
import { forgetWatchedHome, isWatchedHome, rememberAlertEmail, rememberWatchedHome, rememberedAlertEmail } from '@/lib/alertMemory';

/**
 * 🔔 button on each listing card, next to the heart (2026-10-10, per Ryan):
 * price-drop and status alerts for that one home without opening it. Uses
 * the same signup as the listing page's "Get price-drop alerts" link
 * (backend POST /api/alerts/home/:id — full property report, then alerts;
 * Ryan gets a notification and a CRM lead).
 *
 * The first time, a small popup asks for an email. After that the email is
 * remembered on this device (or taken from the signed-in account), so
 * another home is one tap, confirmed by a short toast. Homes watched from
 * this device show a gold bell. See lib/alertMemory.js — the listing-page
 * link and the building/neighborhood box save the email there too.
 *
 * Tapping a gold bell (2026-11-02, per Ryan) shows "You're watching … Stop
 * alerts"; only that second tap stops them, so a stray tap can't.
 */
const TOAST_EVENT = 'bch-card-alert-toast';

function shortAddress(address) {
  return String(address || '').split(',')[0];
}

// `large` (2026-10-29, per Ryan): the bigger round bell on a listing
// page's photo, next to the share icon and heart — same signup.
export default function CardAlertButton({ listing, large = false }) {
  const { user } = useAuth();
  const [watching, setWatching] = useState(false);
  const [popup, setPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, error: '' });
  const [toast, setToast] = useState('');
  // { emails } while the "Stop alerts" toast is showing for a gold bell.
  const [stopOffer, setStopOffer] = useState(null);

  useEffect(() => {
    setWatching(isWatchedHome(listing.id));
  }, [listing.id]);

  useEffect(() => {
    if (!toast) return undefined;
    // Longer when there's a button to tap.
    const t = setTimeout(() => {
      setToast('');
      setStopOffer(null);
    }, stopOffer ? 8000 : 3500);
    return () => clearTimeout(t);
  }, [toast, stopOffer]);

  // One confirmation on screen at a time: a newer one from another card
  // replaces this card's.
  useEffect(() => {
    const onOther = (e) => {
      if (e.detail !== listing.id) {
        setToast('');
        setStopOffer(null);
      }
    };
    window.addEventListener(TOAST_EVENT, onOther);
    return () => window.removeEventListener(TOAST_EVENT, onOther);
  }, [listing.id]);

  function showToast(message, offer = null) {
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: listing.id }));
    setStopOffer(offer);
    setToast(message);
  }

  async function stopAlerts(e) {
    // The toast renders inside the card's link (React portals bubble).
    e.preventDefault();
    e.stopPropagation();
    // Every email this device knows (2026-11-03, per Ryan: a home watched
    // before signing in is under the remembered email, not the account's).
    const emails = stopOffer?.emails || [];
    setStopOffer(null);
    let lastErr = null;
    for (const address of emails) {
      try {
        await api.stopWatchingHome(listing.id, address);
        forgetWatchedHome(listing.id);
        setWatching(false);
        showToast(`Alerts stopped for ${shortAddress(listing.address)}.`);
        return;
      } catch (err) {
        lastErr = err;
        if (err?.status !== 404) break;
      }
    }
    if (lastErr?.status === 409) {
      // Alerts from a saved favorite: the heart controls them.
      showToast(lastErr.message);
    } else if (lastErr?.status === 404) {
      // Nothing active under these emails, so the gold bell was out of
      // date (stopped from an email link, or another device): clear it.
      forgetWatchedHome(listing.id);
      setWatching(false);
      showToast(
        `No bell alerts are on for this home under ${emails.join(' or ')}. If you still get emails about it, use "Stop alerts" in the email.`
      );
    } else if (lastErr?.status === 429) {
      showToast('Too many tries in a short time. Please try again in a little while, or use "Stop alerts" in your alert emails.');
    } else {
      showToast('Something went wrong. Please try again.');
    }
  }

  async function subscribe(address) {
    setState({ sending: true, error: '' });
    try {
      await api.watchHome(listing.id, address, large ? 'photo_bell' : 'card_bell');
      rememberAlertEmail(address);
      rememberWatchedHome(listing.id);
      setWatching(true);
      setPopup(false);
      setState({ sending: false, error: '' });
      showToast(`🔔 Watching ${shortAddress(listing.address)} — alerts go to ${address}`);
    } catch (err) {
      setState({ sending: false, error: err.message || 'Something went wrong. Please try again.' });
      setPopup(true);
    }
  }

  function onBellClick(e) {
    // The card is a link; the bell must not open the listing.
    e.preventDefault();
    e.stopPropagation();
    if (state.sending) return;
    if (watching) {
      const emails = [...new Set([user?.email, rememberedAlertEmail()].filter(Boolean).map((x) => x.toLowerCase()))];
      showToast(`🔔 You're watching ${shortAddress(listing.address)}.`, emails.length ? { emails } : null);
      return;
    }
    const known = user?.email || rememberedAlertEmail();
    if (known) {
      subscribe(known);
      return;
    }
    setEmail('');
    setState({ sending: false, error: '' });
    setPopup(true);
  }

  const underContract = listing.status === 'Pending' || listing.statusLabel === 'Contingent';

  return (
    <>
      <button
        type="button"
        className={`card-alert-btn${large ? ' card-alert-btn--large' : ''}${watching ? ' card-alert-btn--on' : ''}`}
        onClick={onBellClick}
        aria-label={watching ? 'Watching this home for price drops' : 'Get price-drop alerts for this home'}
        title={watching ? 'Watching for price drops' : 'Get price-drop alerts'}
        disabled={state.sending}
      >
        <svg width={large ? 20 : 16} height={large ? 20 : 16} viewBox="0 0 24 24" aria-hidden="true" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" fill="none" />
        </svg>
      </button>

      {popup &&
        createPortal(
          <div
            className="modal-overlay"
            onClick={() => setPopup(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Price-drop alerts"
          >
            <form
              className="modal-panel card-alert-popup"
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => {
                e.preventDefault();
                subscribe(email.trim().toLowerCase());
              }}
            >
              <button type="button" className="card-alert-popup__close" onClick={() => setPopup(false)} aria-label="Close">
                ×
              </button>
              <div className="card-alert-popup__title">
                {underContract ? 'Get an alert if this home comes back on the market' : 'Get price-drop alerts for this home'}
              </div>
              <div className="card-alert-popup__address">{listing.address}</div>
              <p className="card-alert-popup__note">
                We&rsquo;ll email you the full property report now, then let you know{' '}
                {underContract
                  ? 'if it comes back on the market or when it sells.'
                  : 'if the price drops, it goes under contract, or it sells.'}{' '}
                No account needed &mdash; unsubscribe anytime.
              </p>
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
              {state.error && <p className="error-text">{state.error}</p>}
            </form>
          </div>,
          document.body
        )}

      {toast &&
        createPortal(
          <div className="card-alert-toast" role="status" onClick={(e) => e.stopPropagation()}>
            {toast}
            {stopOffer && (
              <button type="button" className="card-alert-toast__action" onClick={stopAlerts}>
                Stop alerts
              </button>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
