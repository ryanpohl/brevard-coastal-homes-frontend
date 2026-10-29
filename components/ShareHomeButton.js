'use client';

import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import { trackLead } from '@/lib/track';
import { rememberedAlertEmail, rememberAlertEmail } from '@/lib/alertMemory';

/**
 * "Share this home" (2026-10-29, per Ryan) — the round share icon next to
 * the heart on a listing's photo. Opens a small popup with two choices:
 *   - Text or share the link: the phone's own share menu (Messages,
 *     WhatsApp, email…); on a computer, copies the link.
 *   - Email it: your name/email + theirs (+ optional note). The backend
 *     emails them the full property report from you (replies go to you).
 *     You become a lead; they aren't added to anything.
 * No signup is needed for either.
 */
export default function ShareHomeButton({ listingId, address, size = 44 }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Share this home"
        title="Share this home"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(255,255,255,0.92)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-ink)',
        }}
      >
        <svg width={Math.round(size * 0.46)} height={Math.round(size * 0.46)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>
      {open && <SharePopup listingId={listingId} address={address} onClose={() => setOpen(false)} />}
    </>
  );
}

function SharePopup({ listingId, address, onClose }) {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', friendEmail: '', note: '' });
  const [status, setStatus] = useState({ sending: false, error: '', done: '' });

  useEffect(() => {
    setForm((f) => ({ ...f, email: f.email || rememberedAlertEmail() }));
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function shareLink() {
    const url = window.location.href.split('#')[0];
    const title = address ? `${address} — Brevard Coastal Homes` : 'A home on Brevard Coastal Homes';
    trackLead('share_link', { listing_id: String(listingId) });
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Take a look at this home: ${address || ''}`.trim(), url });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return; // closed the share menu
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt('Copy this link:', url);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ sending: true, error: '', done: '' });
    try {
      const res = await api.shareListingByEmail(listingId, {
        name: form.name.trim(),
        email: form.email.trim(),
        friendEmail: form.friendEmail.trim(),
        note: form.note.trim(),
      });
      rememberAlertEmail(form.email);
      setStatus({ sending: false, error: '', done: res.message || 'Sent!' });
    } catch (err) {
      setStatus({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: '' });
    }
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-popup" role="dialog" aria-label="Share this home" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="share-popup__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="share-popup__title">Share this home</h2>
        {address && <p className="share-popup__address">{address}</p>}

        <button type="button" className="btn btn-primary share-popup__link" onClick={shareLink}>
          {copied ? '✓ Link copied — paste it in a text or email' : 'Text or share the link'}
        </button>

        <div className="share-popup__or">or email it</div>

        {status.done ? (
          <p className="share-popup__done" role="status">
            ✓ {status.done}
          </p>
        ) : (
          <form onSubmit={submit} className="share-popup__form">
            <input required placeholder="Your name" aria-label="Your name" value={form.name} onChange={update('name')} maxLength={60} />
            <input required type="email" placeholder="Your email" aria-label="Your email" value={form.email} onChange={update('email')} />
            <input required type="email" placeholder="Their email" aria-label="Their email" value={form.friendEmail} onChange={update('friendEmail')} />
            <textarea placeholder="Add a note (optional)" aria-label="Note" value={form.note} onChange={update('note')} maxLength={300} rows={2} />
            <button type="submit" className="btn btn-gold" disabled={status.sending}>
              {status.sending ? 'Sending…' : 'Send'}
            </button>
            {status.error && <p className="error-text">{status.error}</p>}
            <p className="share-popup__fine">We&rsquo;ll send them this home&rsquo;s details from you, just this once.</p>
          </form>
        )}
      </div>
    </div>
  );
}
