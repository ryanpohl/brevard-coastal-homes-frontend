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
 */
export default function InquiryModals({
  listingId,
  containerStyle,
  scheduleClassName = 'btn btn-primary',
  questionClassName = 'btn btn-outline',
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(null); // 'schedule' | 'question' | null
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', preferredDate: '', preferredTime: '' });
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function openModal(kind) {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      message: '',
      preferredDate: '',
      preferredTime: '',
    });
    setStatus({ submitting: false, error: '', success: '' });
    setOpen(kind);
  }

  function closeModal() {
    setOpen(null);
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '' });
    try {
      const payload = { ...form, listingId };
      const result =
        open === 'schedule' ? await api.submitScheduleShowing(payload) : await api.submitAskQuestion(payload);
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  return (
    <>
      <div style={containerStyle || { display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button type="button" className={scheduleClassName} onClick={() => openModal('schedule')}>
          Schedule a Showing
        </button>
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
