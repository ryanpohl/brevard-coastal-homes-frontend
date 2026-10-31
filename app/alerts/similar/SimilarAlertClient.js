'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

// Confirm button for app/alerts/similar/page.js (2026-10-31).
export default function SimilarAlertClient({ email, label, pagePath, filter, areaName }) {
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');

  async function confirm() {
    setState('sending');
    try {
      const res = await api.subscribeListingAlert({ email, label, pagePath, filter });
      setMessage(res?.message || `You're signed up for new ${areaName} homes.`);
      setState('done');
    } catch (err) {
      setMessage(err?.message || 'Something went wrong. Please try again.');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p className="open-house-page__cta" style={{ textAlign: 'left' }}>
        <strong>You’re all set.</strong> {message}
      </p>
    );
  }
  return (
    <div>
      <button type="button" className="btn btn-gold" onClick={confirm} disabled={state === 'sending'} style={{ minWidth: 260 }}>
        {state === 'sending' ? 'Signing you up…' : 'Yes, email me these homes'}
      </button>
      <p style={{ marginTop: 10, fontSize: 14, color: 'var(--color-muted)' }}>Sent to {email}. Unsubscribe anytime.</p>
      {state === 'error' && <p style={{ color: '#b42318', fontSize: 15 }}>{message}</p>}
    </div>
  );
}
