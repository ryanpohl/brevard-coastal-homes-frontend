'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

/**
 * `showContactPreference` (default false, per Ryan, 2026-09-02: "On the pop
 * up screen for contact us Can you add the options from the first screen
 * shot to it like the rest of the popups") — adds the "How would you like
 * us to respond?" Call/Text/Email checkbox row that every other Ask a
 * Question/inquiry popup on the site already has (see InquiryModals.js's
 * identical block/comment for the same addition there on 2026-08-30).
 * Gated behind a prop, defaulting off, rather than always shown, because
 * this component is shared with the standalone /contact page
 * (app/contact/page.js) — Ryan's request and screenshots were specifically
 * about "the pop up screen," so ContactModal.js is the only caller that
 * passes `showContactPreference`, leaving the standalone page's plainer
 * form untouched. Same `preferredContactMethod` field name the backend's
 * other inquiry endpoints already accept.
 */
export default function ContactForm({ showContactPreference = false }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactMethods, setContactMethods] = useState([]);
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleContactMethod(method) {
    setContactMethods((methods) => (methods.includes(method) ? methods.filter((m) => m !== method) : [...methods, method]));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '' });
    try {
      const payload = showContactPreference
        ? { ...form, preferredContactMethod: contactMethods.length ? contactMethods : undefined }
        : form;
      const result = await api.submitContact(payload);
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
      setForm({ name: '', email: '', phone: '', message: '' });
      setContactMethods([]);
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  if (status.success) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <p style={{ color: 'var(--color-success)' }}>{status.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {showContactPreference && (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>How would you like us to respond?</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Call', 'Text', 'Email'].map((method) => (
              <label key={method} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={contactMethods.includes(method)}
                  onChange={() => toggleContactMethod(method)}
                  style={{ width: 'auto' }}
                />
                {method}
              </label>
            ))}
          </div>
        </div>
      )}
      <input placeholder="Full name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
      <input type="email" placeholder="Email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
      <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
      <textarea
        rows={5}
        placeholder="How can we help?"
        required
        value={form.message}
        onChange={(e) => update('message', e.target.value)}
      />
      {status.error && <p className="error-text">{status.error}</p>}
      <button type="submit" className="btn btn-primary" disabled={status.submitting}>
        {status.submitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
