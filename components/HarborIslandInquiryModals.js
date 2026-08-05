'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

const CONTACT_METHODS = ['Call', 'Text', 'Email'];

/**
 * Harbor Island Beach Club-specific "Contact Us Here about Foreclosures"
 * (maroon) and "Request Information on Property Management" (gold) trigger
 * buttons + modals — per Ryan, 2026-08-05, matching three reference
 * screenshots for copy/fields/styling. Rendered via FilterBar's
 * `extraActions` prop, only on this one neighborhood page (see
 * app/neighborhoods/[slug]/page.js's isHarborIslandBeachClub flag).
 *
 * Field layout differs from the site's other inquiry modals
 * (InquiryModals.js / PropertyManagementModal.js) — a "How would you like
 * us to respond?" Call/Text/Email checkbox row, Name+Phone side by side,
 * Email, and (Property Management only) an Address of Property field — no
 * free-text message box, matching the reference screenshots exactly.
 *
 * Submission mapping (no backend changes needed):
 *  - Foreclosures -> `ask_question` inquiry type, which already has
 *    end-to-end support for `preferredContactMethod` (stored + forwarded
 *    to the CRM's /question webhook as a "[Preferred contact: ...]" note —
 *    see backend/src/controllers/inquiries.controller.js and
 *    crmWebhook.service.js). No visible message field in the mockup, so a
 *    fixed descriptive message is sent along so the CRM lead has context.
 *  - Property Management -> `property_management` inquiry type. That type
 *    doesn't have dedicated columns for preferredContactMethod/
 *    propertyAddress today (only ask_question/schedule_showing do), so
 *    both are folded into the free-text `message` field instead — which
 *    property_management already forwards verbatim to the CRM's
 *    /seller-inquiry webhook — so no data is silently dropped without
 *    needing a backend/schema change.
 */
export default function HarborIslandInquiryModals() {
  const [open, setOpen] = useState(null); // 'foreclosures' | 'propertyManagement' | null
  const [form, setForm] = useState(emptyForm());
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function emptyForm() {
    return { name: '', phone: '', email: '', propertyAddress: '', contactMethods: [] };
  }

  function openModal(kind) {
    setForm(emptyForm());
    setStatus({ submitting: false, error: '', success: '' });
    setOpen(kind);
  }

  function closeModal() {
    setOpen(null);
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleContactMethod(method) {
    setForm((f) => ({
      ...f,
      contactMethods: f.contactMethods.includes(method)
        ? f.contactMethods.filter((m) => m !== method)
        : [...f.contactMethods, method],
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '' });
    try {
      let result;
      if (open === 'foreclosures') {
        result = await api.submitAskQuestion({
          name: form.name,
          email: form.email,
          phone: form.phone,
          preferredContactMethod: form.contactMethods,
          message: 'Interested in current foreclosures & off-market properties in Harbor Island Beach Club.',
        });
      } else {
        const contactNote = form.contactMethods.length
          ? `[Preferred contact: ${form.contactMethods.join(', ')}] `
          : '';
        const addressNote = form.propertyAddress ? `Address of Property: ${form.propertyAddress}. ` : '';
        result = await api.submitPropertyManagement({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: `${contactNote}${addressNote}Property Management inquiry — Harbor Island Beach Club and other Brevard County areas.`,
        });
      }
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn"
        onClick={() => openModal('foreclosures')}
        style={{
          maxWidth: 320,
          whiteSpace: 'normal',
          textAlign: 'center',
          lineHeight: 1.25,
          padding: '8px 20px',
          // Darker yellow per Ryan (2026-08-05) — was btn-maroon, then
          // changed to this deeper gold/amber so it reads distinct from
          // the lighter btn-gold used by the Property Management button.
          background: '#8a6a1f',
          color: '#fff',
        }}
      >
        Contact Us Here about Foreclosures in Harbor Island
      </button>
      <button
        type="button"
        className="btn btn-gold"
        onClick={() => openModal('propertyManagement')}
        style={{ maxWidth: 320, whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.25, padding: '8px 20px' }}
      >
        Request Information on Property Management
      </button>

      {open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 }}>
              <h3 style={{ fontSize: 20 }}>
                {open === 'foreclosures' ? 'Send Us a Message' : 'Send Us a Message about Property Management'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <p style={{ color: 'var(--color-muted-dark)', marginBottom: 16, lineHeight: 1.6 }}>
              {open === 'foreclosures'
                ? 'Send us your contact information if you are interested in the current foreclosures in Harbor Island Beach Club. We will reach out shortly!'
                : 'Let us know if you want information on Property Management services within Harbor Island Beach Club as well as other areas of Brevard County. We will reach out shortly!'}
            </p>

            {status.success ? (
              <p style={{ color: 'var(--color-success)' }}>{status.success}</p>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>How would you like us to respond?</div>
                  <div style={{ display: 'flex', gap: 20 }}>
                    {CONTACT_METHODS.map((method) => (
                      <label key={method} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={form.contactMethods.includes(method)}
                          onChange={() => toggleContactMethod(method)}
                          style={{ width: 'auto' }}
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    placeholder="Name"
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />

                {open === 'propertyManagement' && (
                  <input
                    placeholder="Address of Property"
                    value={form.propertyAddress}
                    onChange={(e) => update('propertyAddress', e.target.value)}
                  />
                )}

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
