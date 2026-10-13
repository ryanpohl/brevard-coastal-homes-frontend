'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { isWatchedHome, rememberAlertEmail, rememberWatchedHome, rememberedAlertEmail } from '@/lib/alertMemory';

/**
 * Email-only "save this home" for signed-out visitors (2026-10-13, per Ryan:
 * "I would be excited to even get email addresses of buyers"). Tapping a ♥
 * used to open Sign In / Register (name, email, password); now it asks only
 * for an email, like the 🔔 bell: POST /api/alerts/home/:id sends the full
 * property report and price-drop / status alerts, and creates the CRM lead.
 * Once an email is known on this device, a ♥ saves in one tap. Signed-in
 * visitors keep real account favorites; sold homes still go to Sign In.
 *
 * Hearts call requestSaveHome(listing); this host (mounted once in
 * layout.js) shows the popup and toast, then announces SAVED_EVENT so every
 * heart for that home fills in.
 */
const OPEN_EVENT = 'bch-save-home';
export const SAVED_EVENT = 'bch-home-saved';

export function requestSaveHome(listing) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: listing }));
}

function shortAddress(address) {
  return String(address || '').split(',')[0];
}

export default function SaveHomeHost() {
  const { promptSignIn } = useAuth();
  const [listing, setListing] = useState(null);
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, error: '' });
  const [toast, setToast] = useState('');

  async function save(home, address) {
    setState({ sending: true, error: '' });
    try {
      await api.watchHome(home.id, address, 'heart');
      rememberAlertEmail(address);
      rememberWatchedHome(home.id);
      window.dispatchEvent(new CustomEvent(SAVED_EVENT, { detail: home.id }));
      setListing(null);
      setState({ sending: false, error: '' });
      setToast(`♥ Saved ${shortAddress(home.address)}. Updates go to ${address}`);
    } catch (err) {
      setState({ sending: false, error: err.message || 'Something went wrong. Please try again.' });
      setListing(home);
    }
  }

  useEffect(() => {
    function onOpen(e) {
      const home = e.detail;
      if (!home) return;
      if (home.status === 'Sold') {
        promptSignIn('Sign in to save this property to your favorites.');
        return;
      }
      if (isWatchedHome(home.id)) {
        setToast(`♥ ${shortAddress(home.address)} is already saved`);
        return;
      }
      const known = rememberedAlertEmail();
      if (known) {
        save(home, known);
        return;
      }
      setEmail('');
      setState({ sending: false, error: '' });
      setListing(home);
    }
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptSignIn]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const underContract = listing && (listing.status === 'Pending' || listing.status === 'Contingent');

  return (
    <>
      {listing &&
        createPortal(
          <div className="modal-overlay" onClick={() => setListing(null)} role="dialog" aria-modal="true" aria-label="Save this home">
            <form
              className="modal-panel card-alert-popup"
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => {
                e.preventDefault();
                save(listing, email.trim().toLowerCase());
              }}
            >
              <button type="button" className="card-alert-popup__close" onClick={() => setListing(null)} aria-label="Close">
                ×
              </button>
              <div className="card-alert-popup__title">♥ Save this home</div>
              <div className="card-alert-popup__address">{listing.address}</div>
              <p className="card-alert-popup__note">
                We&rsquo;ll email you the full property report now, then let you know{' '}
                {underContract
                  ? 'if it comes back on the market or when it sells.'
                  : 'if the price drops, it goes under contract, or it sells.'}{' '}
                No account or password needed.
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
                {state.sending ? 'Saving…' : 'Save Home'}
              </button>
              {state.error && <p className="error-text">{state.error}</p>}
              <p className="card-alert-popup__note" style={{ marginTop: 10, marginBottom: 0 }}>
                Have an account?{' '}
                <button
                  type="button"
                  className="email-prompt__skip"
                  style={{ marginLeft: 0 }}
                  onClick={() => {
                    setListing(null);
                    promptSignIn('Sign in to save this property to your favorites.');
                  }}
                >
                  Sign in
                </button>
              </p>
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
