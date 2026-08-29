'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

/**
 * "Interested in Building?" CTA button + modal (2026-08-29, per Ryan) —
 * rendered via FilterBar's `extraActions` prop on every city's dedicated
 * Land ("Lot/Land") page (see app/[citySlug]/[propertySlug]/page.js's
 * propertyType === 'Land' branch), alongside the existing Schedule a
 * Showing/Ask a Question buttons that already show there.
 *
 * Modeled on PropertyManagementModal.js's simple button + modal + form
 * shape (Name/Email/Phone/Message, same `btn btn-gold` button styling) —
 * not HarborIslandInquiryModals.js's fuller Call/Text/Email-checkbox +
 * Address-of-Property variant, since Ryan only specified the button text
 * and the modal's title/body copy here, and "Address of Property" doesn't
 * apply to someone asking about building rather than an existing listing.
 *
 * Posts through the existing `ask_question` inquiry type
 * (api.submitAskQuestion) rather than adding a new backend inquiry type —
 * same "no schema change needed" reasoning documented in
 * HarborIslandInquiryModals.js's Property Management case. The visitor's
 * own message (if any) is prefixed with a fixed tag so the lead still
 * reads clearly as a building/home-builder inquiry in the CRM, without a
 * dedicated column for it.
 *
 * Title/body copy is Ryan's exact wording, verbatim.
 */
export default function BuildingInquiryModal() {
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
      const tag = 'Interested in Building inquiry (Lot/Land page).';
      const result = await api.submitAskQuestion({
        ...form,
        message: form.message ? `${tag} ${form.message}` : tag,
      });
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  return (
    <>
      <button type="button" className="btn btn-gold" onClick={openModal}>
        Interested in Building?
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 }}>
              <h3 style={{ fontSize: 20 }}>Send us a message if you are interested in building in Brevard County</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <p style={{ color: 'var(--color-muted-dark)', marginBottom: 16, lineHeight: 1.6 }}>
              Let us know if you are looking to build if you would like information on Home Builders in Brevard
              County. We will reach out shortly!
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
                  placeholder="Tell us what you're looking for (optional)"
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                />
                {status.error && <p className="error-text">{status.error}</p>}
                <button type="submit" className="btn btn-primary" disabled={status.submitting}>
                  {status.submitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
