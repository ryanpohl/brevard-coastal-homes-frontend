'use client';

import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import { GUIDE_TIMEFRAMES } from '@/lib/relocationGuide';
import { rememberedAlertEmail } from '@/lib/alertMemory';

// Signup form for the free relocation guide (2026-10-11) — the backend
// emails the PDF and notifies Ryan + the CRM.
export default function GuideForm({ town }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', movingFrom: '', timeframe: '' });
  const [state, setState] = useState({ sending: false, error: '', done: '' });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Prefill an email remembered from an earlier signup on this device.
  useEffect(() => {
    const remembered = rememberedAlertEmail();
    if (remembered) setForm((f) => (f.email ? f : { ...f, email: remembered }));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setState({ sending: true, error: '', done: '' });
    try {
      const res = await api.requestRelocationGuide({
        ...form,
        email: form.email.trim(),
        town: town || undefined,
        pagePath: window.location.pathname + window.location.search,
      });
      setState({ sending: false, error: '', done: res.message });
    } catch (err) {
      setState({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: '' });
    }
  }

  if (state.done) {
    return (
      <div className="guide-form guide-form--done" role="status">
        <div className="guide-form__title">✓ It&rsquo;s on its way</div>
        <p>{state.done}</p>
        <p className="guide-form__small">
          Don&rsquo;t see it in a few minutes? Check your spam or promotions folder, or call or text Ryan at 321-350-7661.
        </p>
      </div>
    );
  }

  return (
    <form className="guide-form" onSubmit={submit}>
      <div className="guide-form__title">Get the free guide</div>
      <p className="guide-form__small">We&rsquo;ll email it to you as a PDF.</p>
      <input placeholder="First name" aria-label="First name" value={form.name} onChange={(e) => update('name', e.target.value)} autoComplete="given-name" />
      <input type="email" required placeholder="Email *" aria-label="Email" value={form.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" />
      <input type="tel" placeholder="Phone (optional)" aria-label="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" />
      <input placeholder="Where are you moving from? (optional)" aria-label="Where are you moving from?" value={form.movingFrom} onChange={(e) => update('movingFrom', e.target.value)} />
      <select aria-label="When are you planning to move?" value={form.timeframe} onChange={(e) => update('timeframe', e.target.value)}>
        <option value="">When are you moving? (optional)</option>
        {GUIDE_TIMEFRAMES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-gold" disabled={state.sending}>
        {state.sending ? 'Sending…' : 'Email Me the Guide'}
      </button>
      {state.error && <p className="error-text">{state.error}</p>}
      <p className="guide-form__small">No spam. Ryan may follow up personally to answer questions.</p>
    </form>
  );
}
