'use client';

import { useState, useEffect } from 'react';
import * as api from '@/lib/api';
import { HARBOR_ISLAND_OPEN_FORECLOSURES_EVENT } from './HarborIslandForeclosuresTrigger';

const CONTACT_METHODS = ['Call', 'Text', 'Email'];

/**
 * Harbor Island Beach Club-specific "Contact Us Here about Foreclosures"
 * (maroon) and "Request Information on Property Management" (gold, later
 * changed to blue) trigger buttons + modals — per Ryan, 2026-08-05,
 * matching three reference screenshots for copy/fields/styling. Rendered
 * via FilterBar's `extraActions` prop, originally only on the Harbor
 * Island Beach Club neighborhood page (see
 * app/neighborhoods/[slug]/page.js's isHarborIslandBeachClub flag).
 *
 * Extended 2026-08-26 (per Ryan) to also render just the blue "Request
 * Information on Property Management" button on the plain (non-oceanfront)
 * Condos pages for Cocoa Beach, Melbourne Beach, Satellite Beach, Indian
 * Harbour Beach, and Indialantic, via an optional `areaLabel` prop (default
 * 'Harbor Island Beach Club') — the area name referenced in the Property
 * Management modal's intro copy and CRM message body, so a city page's
 * modal reads e.g. "...within Cocoa Beach as well as other areas of
 * Brevard County" instead of Harbor Island's own wording. Harbor Island's
 * own usage is unaffected since it relies on this prop's default.
 * See app/[citySlug]/[propertySlug]/page.js's showPropertyManagementCTA
 * for the city-page wiring.
 *
 * Used to also render a Harbor-Island-specific Foreclosures button/link
 * here (gated behind a `showForeclosures` prop) — moved out entirely
 * 2026-09-27, per Ryan, to its own text-link paragraph on the neighborhood
 * page itself, right under the "Contact Us Today" link (see
 * app/neighborhoods/[slug]/page.js's HarborIslandForeclosuresTrigger usage
 * there). It fit poorly as a lone plain-text link wedged between this
 * component's own pill buttons, and reads better grouped with the page's
 * other quiet text-links. The foreclosures modal itself is unaffected —
 * still opened via the same HARBOR_ISLAND_OPEN_FORECLOSURES_EVENT listener
 * below, just triggered exclusively from that new location now instead of
 * from a button rendered by this component.
 *
 * Field layout differs from the site's other inquiry modals
 * (InquiryModals.js / PropertyManagementModal.js) — a "How would you like
 * us to respond?" Call/Text/Email checkbox row, Name+Phone side by side,
 * Email, and (Property Management only) an Address of Property field — no
 * free-text message box, matching the reference screenshots exactly.
 *
 * "Are you currently working with an agent?" (optional Yes/No) added
 * 2026-09-27, per Ryan — same request/reasoning as InquiryModals.js's
 * identical addition (see that file's top-of-file comment for the full
 * why). Foreclosures-only here — Property Management inquiries come from
 * landlords, not buyers, so the question doesn't apply and Ryan asked to
 * leave that modal as-is. Folded into the free-text `message` field, same
 * no-backend-change approach already used below for Property Management's
 * contactNote/addressNote.
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
export default function HarborIslandInquiryModals({ areaLabel = 'Harbor Island Beach Club' }) {
  const [open, setOpen] = useState(null); // 'foreclosures' | 'propertyManagement' | null
  const [form, setForm] = useState(emptyForm());
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function emptyForm() {
    return { name: '', phone: '', email: '', propertyAddress: '', contactMethods: [], workingWithAgent: null };
  }

  function openModal(kind) {
    setForm(emptyForm());
    setStatus({ submitting: false, error: '', success: '' });
    setOpen(kind);
  }

  // Listens for both HarborIslandForeclosuresTrigger usages on the
  // neighborhood page — the bolded "Foreclosed bank-owned condos" mention
  // in the intro paragraph, and the "Ask us about foreclosures in Harbor
  // Island" link right under Contact Us Today (moved here from this
  // component's own CTA row 2026-09-27, per Ryan) — since neither of those
  // Client Components can call this component's state setters directly
  // from the Server Component page that renders both; see
  // HarborIslandForeclosuresTrigger.js's own comment for the full why. Both
  // triggers only exist on the Harbor Island Beach Club page, which is the
  // only page that renders this component without areaLabel overridden, so
  // this listener is never mounted without a trigger for it to serve.
  useEffect(() => {
    function handleOpenForeclosuresEvent() {
      openModal('foreclosures');
    }
    window.addEventListener(HARBOR_ISLAND_OPEN_FORECLOSURES_EVENT, handleOpenForeclosuresEvent);
    return () => window.removeEventListener(HARBOR_ISLAND_OPEN_FORECLOSURES_EVENT, handleOpenForeclosuresEvent);
  }, []);

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
        const agentNote = form.workingWithAgent
          ? `[Working with an agent: ${form.workingWithAgent === 'yes' ? 'Yes' : 'No'}] `
          : '';
        result = await api.submitAskQuestion({
          name: form.name,
          email: form.email,
          phone: form.phone,
          preferredContactMethod: form.contactMethods,
          message: `${agentNote}Interested in current foreclosures & off-market properties in Harbor Island Beach Club.`,
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
          message: `${contactNote}${addressNote}Property Management inquiry — ${areaLabel} and other Brevard County areas.`,
        });
      }
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  return (
    <>
      {/* Was a bespoke blue button (#2b6ea8, before that btn-gold) — switched
          to the site's standard btn-outline pill 2026-09-27, per Ryan's
          design-feedback request on the 4-button CTA row: this and the
          neighboring Schedule a Showing/Ask a Question buttons (FilterBar.js)
          were the only 4-button set on the site using one-off colors instead
          of the site's existing btn-primary/btn-outline pair, which is why
          the row read as 4 unrelated colors rather than one button group.
          No more maxWidth/whiteSpace/lineHeight override either — btn-outline
          is used at its default single-line size everywhere else it appears
          (filter triggers, etc.), so this now matches that rather than
          wrapping onto two lines. */}
      {/* btn-cta-outline added 2026-09-27, per Ryan: "the buttons with the
          tan background seem to blend in & not stand out" — see its
          comment in globals.css. Gives this a white rest-state background
          against the filter bar's cream page background, and a solid-ink
          hover fill matching Schedule a Showing. */}
      <button type="button" className="btn btn-outline btn-cta-outline" onClick={() => openModal('propertyManagement')}>
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

            {/* "Call or Text Us: 321-350-7661" added 2026-09-01, per Ryan:
                "Can you add 'Call or Text Us: 321-350-7661' to all the ask a
                question buttons, Foreclosure, & Property management buttons
                popups." Hardcoded (not AGENT_INFO.phone) for the same reason
                as ContactModal.js's own copy of this line — that env var is
                confirmed empty on the live production bundle. */}
            <p style={{ color: 'var(--color-ink)', fontWeight: 600, marginBottom: 12, fontSize: 16 }}>
              Call or Text Us: <a href="tel:+13213507661" style={{ color: 'var(--color-ink)' }}>321-350-7661</a>
            </p>

            <p style={{ color: 'var(--color-muted-dark)', marginBottom: 16, lineHeight: 1.6 }}>
              {open === 'foreclosures'
                ? 'Send us your contact information if you are interested in the current foreclosures in Harbor Island Beach Club. We will reach out shortly!'
                : `Let us know if you want information on Property Management services within ${areaLabel} as well as other areas of Brevard County. We will reach out shortly!`}
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

                {/* "Are you currently working with an agent?" — optional,
                    foreclosures only (not Property Management — see
                    top-of-file comment). */}
                {open === 'foreclosures' && (
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                      Are you currently working with an agent?
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="working-with-agent"
                          checked={form.workingWithAgent === 'yes'}
                          onChange={() => update('workingWithAgent', 'yes')}
                          style={{ width: 'auto' }}
                        />
                        Yes
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="working-with-agent"
                          checked={form.workingWithAgent === 'no'}
                          onChange={() => update('workingWithAgent', 'no')}
                          style={{ width: 'auto' }}
                        />
                        No
                      </label>
                    </div>
                  </div>
                )}

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
