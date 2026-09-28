'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';

/**
 * "Schedule a Showing" and "Ask a Question" trigger buttons + modal forms.
 * Both post to the backend's /api/inquiries/* endpoints. Two call sites:
 *  - Property Detail page's sidebar (default props): listingId is always
 *    passed, so the request is tied to that one listing.
 *  - The city/neighborhood listing page's filter bar (FilterBar.js): no
 *    listingId — these are general "ask about this area" submissions, and
 *    the backend accepts that (listingId is optional there). Passes just
 *    `containerStyle` to lay the buttons out inline instead of the
 *    sidebar's stacked layout — as of 2026-09-27 it no longer overrides
 *    `scheduleClassName`/`questionClassName` (was a green/maroon pill pair,
 *    unified back to this component's own btn-primary/btn-outline defaults
 *    per Ryan's design-feedback request, so both call sites now render
 *    identically styled buttons).
 *
 * `showSchedule` (default true) lets a caller suppress this component's own
 * "Schedule a Showing" button/modal — used by FilterBar.js (per Ryan,
 * 2026-08-06), which renders its own "Schedule a Showing" button that opens
 * the richer ScheduleShowingModal/PropertyContactPanel design instead, while
 * still using this component for "Ask a Question".
 *
 * "How would you like us to respond?" Call/Text/Email checkboxes added to
 * the Ask a Question mode 2026-08-30, per Ryan (referencing a screenshot of
 * this exact block) — every OTHER "Ask a Question" popup on the site
 * already had it (PropertyContactPanel.js's AskQuestionModal on the
 * Property Detail page's sidebar, HarborIslandInquiryModals.js's
 * foreclosures variant); this was the one place it was missing, since it's
 * this component's own simpler modal. Same `preferredContactMethod` field
 * the backend's ask_question inquiry type already accepts (see
 * AskQuestionModal's identical usage) — no backend change needed. Not
 * shown for 'schedule' mode, matching every other implementation of this
 * block, which is Ask-a-Question-specific.
 *
 * "Are you currently working with an agent?" (optional Yes/No) added
 * 2026-09-27, per Ryan — he wants to spend less time on buyer leads who are
 * already repped by another agent, and asked for this on Schedule a Showing
 * and Ask a Question (Property Management left as-is; not a buyer-side
 * inquiry). Shown for BOTH modes here (unlike the contact-method checkboxes
 * above), since Schedule a Showing is the more time-costly one for Ryan and
 * was the primary motivator. Deliberately plain "working with an agent?"
 * wording rather than Make an Offer's "signed an exclusive buyer agency
 * agreement" phrasing (see PropertyContactPanel.js's MakeOfferModal) — that
 * legal phrasing fits the higher-stakes offer step, but reads as too
 * technical/off-putting for these lower-commitment, earlier-funnel forms.
 * The `ask_question`/`schedule_showing` inquiry types have no dedicated
 * column for this (only the separate `offers` table does, for Make an
 * Offer), and the backend's shared createInquiry handler doesn't forward an
 * arbitrary new field into the staff notification email the way it does for
 * `preferredContactMethod`/`tourType` — so rather than a backend change,
 * this is folded into the free-text `message` field as a `[Working with an
 * agent: Yes/No]` prefix, matching the same no-backend-change pattern this
 * file's `propertyAddress` field and HarborIslandInquiryModals.js's
 * Property Management modal already use. Still fully optional/non-blocking,
 * matching Make an Offer's treatment of the same underlying question.
 */
export default function InquiryModals({
  listingId,
  containerStyle,
  scheduleClassName = 'btn btn-primary',
  // btn-cta-outline (2026-09-27, per Ryan: "the buttons with the tan
  // background seem to blend in & not stand out") — gives this button a
  // white rest-state background instead of plain .btn-outline's transparent
  // one, plus a solid-ink hover fill matching Schedule a Showing's own
  // color. See its comment in globals.css for why this isn't just added to
  // .btn-outline directly.
  questionClassName = 'btn btn-outline btn-cta-outline',
  showSchedule = true,
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(null); // 'schedule' | 'question' | null
  const [contactMethods, setContactMethods] = useState([]); // ['Call', 'Text', 'Email'] — 'question' mode only
  const [workingWithAgent, setWorkingWithAgent] = useState(null); // 'yes' | 'no' | null — both modes, see top-of-file comment
  // propertyAddress: added 2026-08-17 per Ryan ("Can you add 'Address of
  // Property' to all the ask a question pop up boxes in all the city &
  // neighborhood pages so I know what property they potentially are asking
  // a question about"). Unlike PropertyContactPanel.js's AskQuestionModal
  // (which auto-fills from a real listing on the Property Detail page),
  // this component's one real call site (FilterBar.js, on city/
  // neighborhood results pages) never passes a listingId — there's no
  // single listing to pull an address from here, so this is always a
  // manual/free-text field the visitor fills in themselves.
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredDate: '',
    preferredTime: '',
    propertyAddress: '',
  });
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function openModal(kind) {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      message: '',
      preferredDate: '',
      preferredTime: '',
      propertyAddress: '',
    });
    setContactMethods([]);
    setWorkingWithAgent(null);
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
    setContactMethods((methods) => (methods.includes(method) ? methods.filter((m) => m !== method) : [...methods, method]));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '' });
    try {
      // Folded into the free-text `message` field rather than sent as its
      // own param — see top-of-file comment on why (no backend column/
      // notification-forwarding for this field on these inquiry types).
      const agentNote = workingWithAgent ? `[Working with an agent: ${workingWithAgent === 'yes' ? 'Yes' : 'No'}] ` : '';
      const payload = { ...form, listingId, message: `${agentNote}${form.message}`.trim() };
      const result =
        open === 'schedule'
          ? await api.submitScheduleShowing(payload)
          : await api.submitAskQuestion({
              ...payload,
              preferredContactMethod: contactMethods.length ? contactMethods : undefined,
            });
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  return (
    <>
      <div style={containerStyle || { display: 'flex', flexDirection: 'column', gap: 10 }}>
        {showSchedule && (
          <button type="button" className={scheduleClassName} onClick={() => openModal('schedule')}>
            Schedule a Showing
          </button>
        )}
        <button type="button" className={questionClassName} onClick={() => openModal('question')}>
          Ask a Question
        </button>
      </div>

      {open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20 }}>{open === 'schedule' ? 'Schedule a Showing' : 'Ask a Question'}</h3>
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
                popups." Question-only (not Schedule a Showing) per the
                request's own wording. Hardcoded (not AGENT_INFO.phone) for
                the same reason as ContactModal.js's own copy of this line —
                that env var is confirmed empty on the live production
                bundle. */}
            {open === 'question' && (
              <p style={{ color: 'var(--color-ink)', fontWeight: 600, marginBottom: 12, fontSize: 16 }}>
                Call or Text Us: <a href="tel:+13213507661" style={{ color: 'var(--color-ink)' }}>321-350-7661</a>
              </p>
            )}

            {status.success ? (
              <p style={{ color: 'var(--color-success)' }}>{status.success}</p>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* "Are you currently working with an agent?" — optional,
                    shown for both modes. See top-of-file comment. */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                    Are you currently working with an agent?
                  </div>
                  <div style={{ display: 'flex', gap: 24 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="working-with-agent"
                        checked={workingWithAgent === 'yes'}
                        onChange={() => setWorkingWithAgent('yes')}
                        style={{ width: 'auto' }}
                      />
                      Yes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="working-with-agent"
                        checked={workingWithAgent === 'no'}
                        onChange={() => setWorkingWithAgent('no')}
                        style={{ width: 'auto' }}
                      />
                      No
                    </label>
                  </div>
                </div>
                {open === 'question' && (
                  <>
                    <input
                      placeholder="Address of Property"
                      value={form.propertyAddress}
                      onChange={(e) => update('propertyAddress', e.target.value)}
                    />
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
                  </>
                )}
                <input placeholder="Full name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
                <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                {open === 'schedule' && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      type="date"
                      value={form.preferredDate}
                      onChange={(e) => update('preferredDate', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="time"
                      value={form.preferredTime}
                      onChange={(e) => update('preferredTime', e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                )}
                <textarea
                  rows={4}
                  placeholder={open === 'schedule' ? 'Anything else we should know? (optional)' : 'Your question'}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  required={open === 'question'}
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
