'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as api from '@/lib/api';

// Asks before unsubscribing, so link scanners in email systems (which open
// every link) can't unsubscribe someone by accident.
export default function UnsubscribeClient({ token }) {
  const [state, setState] = useState({ busy: false, done: '', error: token ? '' : 'This unsubscribe link is missing its code.' });

  async function confirm() {
    setState({ busy: true, done: '', error: '' });
    try {
      const res = await api.unsubscribeListingAlert(token);
      setState({ busy: false, done: res.message, error: '' });
    } catch (err) {
      setState({ busy: false, done: '', error: err.message || 'Something went wrong. Please try again.' });
    }
  }

  return (
    <>
      <h1 style={{ fontSize: 28, marginBottom: 14 }}>{state.done ? 'You’re unsubscribed' : 'Unsubscribe from listing alerts'}</h1>
      {state.done ? (
        <p style={{ fontSize: 16, lineHeight: 1.6 }}>{state.done}</p>
      ) : (
        <>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 22 }}>Stop getting new-listing emails for this building or neighborhood?</p>
          {token && (
            <button type="button" className="btn btn-primary" onClick={confirm} disabled={state.busy}>
              {state.busy ? 'Unsubscribing…' : 'Yes, unsubscribe me'}
            </button>
          )}
        </>
      )}
      {state.error && <p className="error-text" style={{ marginTop: 16 }}>{state.error}</p>}
      <p style={{ fontSize: 14, marginTop: 32 }}>
        <Link href="/">Back to Brevard Coastal Homes</Link> · Questions? Call or text Ryan at 321-350-7661.
      </p>
    </>
  );
}
