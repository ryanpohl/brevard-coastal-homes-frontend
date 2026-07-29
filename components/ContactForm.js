'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '' });
    try {
      const result = await api.submitContact(form);
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
      setForm({ name: '', email: '', phone: '', message: '' });
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
