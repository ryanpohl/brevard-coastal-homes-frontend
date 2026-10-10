'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';
import { isWatchedHome, rememberAlertEmail, rememberWatchedHome, rememberedAlertEmail } from '@/lib/alertMemory';

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
 */
const TOAST_EVENT = 'bch-card-alert-toast';

function shortAddress(address) {
  return String(address || '').split(',')[0];
}

export default function CardAlertButton({ listing }) {
  const { user } = useAuth();
  const [watching, setWatching] = useState(false);
  const [popup, setPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, error: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    setWatching(isWatchedHome(listing.id));
  }, [listing.id]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // One confirmation on screen at a time: a newer one from another card
  // replaces this card's.
  useEffect(() => {
    const onOther = (e) => {
      if (e.detail !== listing.id) setToast('');
    };
    window.addEventListener(TOAST_EVENT, onOther);
    return () => window.removeEventListener(TOAST_EVENT, onOther);
  }, [listing.id]);

  function showToast(message) {
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: listing.id }));
    setToast(message);
  }

  async function subscribe(address) {
    setState({ sending: true, error: '' });
    try {
      await api.watchHome(listing.id, address);
      rememberAlertEmail(address);
      rememberWatchedHome(listing.id);
      setWatching(true);
      setPopup(false);
      setState({ sending: false, error: '' });
      showToast(`🔔 Watching ${shortAddress(listing.address)} — alerts go to ${address}`);
      try {
        window.gtag?.('event', 'home_alert_signup', { event_category: 'lead', event_label: `card:${listing.id}` });
      } catch {
        // Tracking never blocks the signup.
      }
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
      showToast(`🔔 You're already watching ${shortAddress(listing.address)}`);
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
        className={`card-alert-btn${watching ? ' card-alert-btn--on' : ''}`}
        onClick={onBellClick}
        aria-label={watching ? 'Watching this home for price drops' : 'Get price-drop alerts for this home'}
        title={watching ? 'Watching for price drops' : 'Get price-drop alerts'}
        disabled={state.sending}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                We&rsquo;ll email you the full property report now, then let you know if the price drops, it goes under
                contract, sells, or comes back on the market. No account needed &mdash; unsubscribe anytime.
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
          <div className="card-alert-toast" role="status">
            {toast}
          </div>,
          document.body
        )}
    </>
  );
}
