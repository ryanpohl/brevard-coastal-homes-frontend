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
 *    the backend accepts that (listingId is optional there). Passes
 *    `containerStyle`/`scheduleClassName`/`questionClassName` to get the
 *    inline green/maroon pill look instead of the sidebar's stacked buttons.
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
 */
export default function InquiryModals({
  listingId,
  containerStyle,
  scheduleClassName = 'btn btn-primary',
  questionClassName = 'btn btn-outline',
  showSchedule = true,
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(null); // 'schedule' | 'question' | null
  const [contactMethods, setContactMethods] = useState([]); // ['Call', 'Text', 'Email'] — 'question' mode only
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
      const payload = { ...form, listingId };
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

            {status.success ? (
              <p style={{ color: 'var(--color-success)' }}>{status.success}</p>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
