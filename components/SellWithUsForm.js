'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

/**
 * "Sell With Us" lead-capture section for the Looking to Sell page
 * (2026-08-30, per Ryan, who shared a competitor's "Sell With Us" form
 * screenshot plus a separate "How would you like us to respond?"
 * Call/Text/Email screenshot to combine into one design here). Unlike
 * every other inquiry form on this site (all popup modals), this renders
 * inline as its own section on the page — the Looking to Sell page's H1
 * already promises "Get a free, no-obligation valuation" but had no actual
 * lead-capture form anywhere on the page before this.
 *
 * First name / Last Name are two separate fields — unlike every other form
 * on this site, which collects one combined "Full name" field — because
 * that's how the reference design splits it. They're joined into a single
 * `name` string before submitting, since the backend's inquiries endpoints
 * (and crmWebhook.service.js's own splitName() CRM-forwarding helper) all
 * expect one name field, same as everywhere else on this site.
 *
 * Field labels drop the reference design's "(optional)" suffix on
 * Phone/Message, per Ryan's explicit request ("Don't include the optional
 * text next to message & phone number") — both fields stay functionally
 * optional (only First name/Email are required), just without that label
 * wording.
 *
 * Posts through the existing `property_management` inquiry type
 * (api.submitPropertyManagement) rather than adding a new backend inquiry
 * type — per backend/src/services/crmWebhook.service.js, that type is the
 * "purpose-built match" already wired to the CRM's own /seller-inquiry
 * webhook, i.e. exactly the right bucket for a general "I want to sell"
 * lead (ask_question, by contrast, lands in the CRM's generic /question
 * webhook). The "How would you like us to respond?" Call/Text/Email
 * checkboxes are folded into the free-text `message` field the same way
 * HarborIslandInquiryModals.js's own Property Management form already
 * does — that CRM mapping has no dedicated column for it either, so no
 * schema change needed.
 */
export default function SellWithUsForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const [contactMethods, setContactMethods] = useState([]);
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleMethod(method) {
    setContactMethods((methods) => (methods.includes(method) ? methods.filter((m) => m !== method) : [...methods, method]));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '' });
    try {
      const name = `${form.firstName} ${form.lastName}`.trim();
      const contactNote = contactMethods.length ? `[Preferred contact: ${contactMethods.join(', ')}] ` : '';
      const message = `${contactNote}${form.message}`.trim();
      const result = await api.submitPropertyManagement({
        name,
        email: form.email,
        phone: form.phone,
        message: message || undefined,
      });
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  return (
    <div
      style={{
        background: 'var(--color-nav-bg)',
        color: '#fff',
        borderRadius: 'var(--radius-card, 8px)',
        padding: 'clamp(28px, 5vw, 48px)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 28px)', marginBottom: 10 }}>Sell With Us</h2>
        {/* Hardcoded literal number, same reasoning as every other "Call or
            Text" line on this site (ContactModal.js/Footer.js/Nav.js) —
            AGENT_INFO.phone (NEXT_PUBLIC_BUSINESS_PHONE) is confirmed empty
            on the live production bundle per CLAUDE.md's 2026-08-04 note. */}
        <p style={{ color: 'var(--color-gold)', fontWeight: 700 }}>
          Call or Text:{' '}
          <a href="tel:+13213507661" style={{ color: 'inherit', textDecoration: 'none' }}>
            321-350-7661
          </a>
        </p>
      </div>

      {status.success ? (
        <p style={{ color: '#7bd8a0', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>{status.success}</p>
      ) : (
        <form onSubmit={submit} style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
            <Field label="First name">
              <input required value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
            </Field>
            <Field label="Last Name">
              <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
            <Field label="Email">
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
            </Field>
            <Field label="Phone">
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </Field>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>How would you like us to respond?</div>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Call', 'Text', 'Email'].map((method) => (
                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={contactMethods.includes(method)}
                    onChange={() => toggleMethod(method)}
                    style={{ width: 'auto' }}
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <Field label="Message">
            <textarea rows={3} value={form.message} onChange={(e) => update('message', e.target.value)} />
          </Field>

          {status.error && (
            <p className="error-text" style={{ marginTop: 12 }}>
              {status.error}
            </p>
          )}

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button type="submit" className="btn btn-gold" disabled={status.submitting}>
              {status.submitting ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 0 }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
        {label}
      </span>
      {children}
    </label>
  );
}
