'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

/**
 * Property Management inquiry modal for the Looking to Sell page, per
 * design/README.md ("Looking to Sell" — seller-focused content + Property
 * Management inquiry modal/CTA). Posts to /api/inquiries/property-management.
 */
export default function PropertyManagementModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function openModal() {
    setForm({ name: '', email: '', phone: '', message: '' });
    setStatus({ submitting: false, error: '', success: '' });
    setOpen(true);
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '' });
    try {
      const result = await api.submitPropertyManagement(form);
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  return (
    <>
      <button type="button" className="btn btn-gold" onClick={openModal}>
        Request a Property Management Quote
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20 }}>Property Management Inquiry</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* "Call or Text Us: 321-350-7661" added 2026-09-01, per Ryan:
                "Can you add 'Call or Text Us: 321-350-7661' to all the ask a
                question buttons, Foreclosure, & Property management buttons
                popups." Hardcoded (not AGENT_INFO.phone) for the same reason
                as ContactModal.js's own copy of this line — that env var is
                confirmed empty on the live production bundle. */}
            <p style={{ color: 'var(--color-ink)', fontWeight: 600, marginBottom: 12, fontSize: 16 }}>
              Call or Text Us: <a href="tel:+13213507661" style={{ color: 'var(--color-ink)' }}>321-350-7661</a>
            </p>

            {status.success ? (
              <p style={{ color: 'var(--color-success)' }}>{status.success}</p>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input placeholder="Full name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
                <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                <textarea
                  rows={4}
                  placeholder="Tell us about your property"
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                />
                {status.error && <p className="error-text">{status.error}</p>}
                <button type="submit" className="btn btn-primary" disabled={status.submitting}>
                  {status.submitting ? 'Sending…' : 'Send'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
