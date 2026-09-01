'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AGENT_INFO } from '@/lib/constants';
import * as api from '@/lib/api';

const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const inputStyle = { border: '1px solid var(--color-border-warm)' };

/**
 * Property Detail page's entire right-hand sidebar: the dark "Call or Text"
 * hero card (Make an Offer / Ask a Question gold buttons, each opening a
 * modal), and the inline "Request Showing" panel below it (a 12-day date
 * grid + In Person/Virtual + contact fields — submits directly, no modal).
 * Matches design/design_files/Property Detail.dc.html.
 */
export default function PropertyContactPanel({ listingId, listingAddress }) {
  const { user } = useAuth();
  const [offerOpen, setOfferOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

  const dateOptions = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return { iso: d.toISOString().slice(0, 10), dow: DOW[d.getDay()], day: String(d.getDate()).padStart(2, '0'), month: MONTH[d.getMonth()] };
    });
  }, []);

  return (
    <div style={{ background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}>
      <div style={{ background: 'var(--color-ink-dark)', color: '#fff', textAlign: 'center', padding: '28px 24px' }}>
        {AGENT_INFO.phone && (
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 600 }}>Call or Text {AGENT_INFO.phone}</div>
        )}
        <div style={{ fontSize: 22, letterSpacing: 0.5, marginTop: 4 }}>{AGENT_INFO.businessName}</div>
        <div style={{ fontSize: 14, marginTop: 12, opacity: 0.9 }}>We are standing by to assist you.</div>
        <div style={{ fontSize: 13, marginTop: 16, opacity: 0.85 }}>
          {listingId != null
            ? 'Want to make an offer or ask a question? Select one the buttons below.'
            : 'Have a question? Select the button below.'}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {/* Make an Offer only ever makes sense tied to a specific
              listing (the backend requires a listingId — see
              MakeOfferModal's submit below). This panel is also rendered
              with no listingId as a general "reach out to us" entry point
              (the homepage's "Schedule a Showing" popup, ScheduleShowingModal.js,
              and FilterBar.js's general contact modal) — Make an Offer used
              to render there too and always failed with a confusing
              "listingId is required" error on submit (per Ryan,
              2026-08-16, who ran into this live and asked for it fixed by
              removing the button rather than loosening the backend
              requirement). Gated here instead of hiding it deeper in
              MakeOfferModal so the button + intro copy above disappear
              together. */}
          {listingId != null && (
            <button
              type="button"
              onClick={() => setOfferOpen(true)}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: 'var(--color-gold)',
                color: 'var(--color-ink-dark)',
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 20px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ★ Make an Offer
            </button>
          )}
          <button
            type="button"
            onClick={() => setAskOpen(true)}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'var(--color-gold)',
              color: 'var(--color-ink-dark)',
              fontSize: 14,
              fontWeight: 600,
              padding: '12px 20px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ★ Ask a Question
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '14px 0', fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', borderBottom: '2px solid var(--color-ink)' }}>
          REQUEST SHOWING
        </div>
      </div>

      <RequestShowingForm listingId={listingId} listingAddress={listingAddress} dateOptions={dateOptions} user={user} />

      {offerOpen && <MakeOfferModal listingId={listingId} listingAddress={listingAddress} onClose={() => setOfferOpen(false)} />}
      {askOpen && <AskQuestionModal listingId={listingId} listingAddress={listingAddress} user={user} onClose={() => setAskOpen(false)} />}
    </div>
  );
}

function RequestShowingForm({ listingId, listingAddress, dateOptions, user }) {
  const [selectedDate, setSelectedDate] = useState(null); // iso string
  const [tourType, setTourType] = useState(null); // 'in_person' | 'virtual'
  // propertyAddress auto-fills from the actual listing's address when this
  // form is rendered on that listing's own Property Detail page (per Ryan,
  // 2026-08-17: "on the actual listing page is there a way to make the
  // address of the property auto-populate... from the address of the
  // actual listing") — still a normal editable input, not read-only, same
  // as name/email already auto-filling from the signed-in user below.
  // Falls back to '' when there's no listing (the general-inquiry popups),
  // same as before this change.
  const [form, setForm] = useState({ propertyAddress: listingAddress || '', name: user?.name || '', email: user?.email || '', phone: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '' });
    try {
      const result = await api.submitScheduleShowing({
        ...form,
        listingId,
        preferredDate: selectedDate || undefined,
        tourType: tourType || undefined,
      });
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  if (status.success) {
    return (
      <div style={{ padding: '20px 24px 28px', textAlign: 'center', color: 'var(--color-success)', fontSize: 14 }}>{status.success}</div>
    );
  }

  return (
    <form onSubmit={submit} style={{ padding: '20px 24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap', textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-muted-dark)' }}>Select a Preferred Date</div>
        {AGENT_INFO.phone && (
          <>
            <span style={{ fontSize: 11, color: 'var(--color-muted-light)', letterSpacing: 1, textTransform: 'uppercase' }}>Or</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontSize: 14, color: 'var(--color-ink)' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Set Up by Phone</span>
              <span style={{ color: 'var(--color-muted)', fontSize: 12 }}>(Call or Text)</span>
              <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>{AGENT_INFO.phone}</span>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 16 }}>
        {dateOptions.map((d) => {
          const isSelected = selectedDate === d.iso;
          return (
            <button
              key={d.iso}
              type="button"
              onClick={() => setSelectedDate(d.iso)}
              style={{
                border: isSelected ? '2px solid var(--color-ink)' : '1px solid var(--color-border-warm)',
                background: isSelected ? '#e4e8ea' : 'none',
                borderRadius: 4,
                textAlign: 'center',
                padding: isSelected ? '9px 3px' : '10px 4px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 10, color: 'var(--color-muted-light)', letterSpacing: 0.5 }}>{d.dow}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-ink)' }}>{d.day}</div>
              <div style={{ fontSize: 10, color: 'var(--color-muted-light)', letterSpacing: 0.5 }}>{d.month}</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 16 }}>
        <label
          style={{
            border: tourType === 'in_person' ? '1px solid var(--color-ink)' : '1px solid var(--color-border-warm)',
            borderRadius: 4,
            padding: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            cursor: 'pointer',
            fontWeight: tourType === 'in_person' ? 700 : 400,
          }}
        >
          <input type="radio" name="tour-type" checked={tourType === 'in_person'} onChange={() => setTourType('in_person')} style={{ width: 'auto' }} /> 🏠
          In Person
        </label>
        <label
          style={{
            border: tourType === 'virtual' ? '1px solid var(--color-ink)' : '1px solid var(--color-border-warm)',
            borderRadius: 4,
            padding: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            cursor: 'pointer',
            fontWeight: tourType === 'virtual' ? 700 : 400,
          }}
        >
          <input type="radio" name="tour-type" checked={tourType === 'virtual'} onChange={() => setTourType('virtual')} style={{ width: 'auto' }} /> 📱
          Virtual
        </label>
      </div>

      <input
        placeholder="Address of Property"
        value={form.propertyAddress}
        onChange={(e) => update('propertyAddress', e.target.value)}
        style={{ ...inputStyle, marginBottom: 10 }}
      />
      <input placeholder="Name" required value={form.name} onChange={(e) => update('name', e.target.value)} style={{ ...inputStyle, marginBottom: 10 }} />
      <input
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
        style={{ ...inputStyle, marginBottom: 10 }}
      />
      <input
        type="tel"
        placeholder="Mobile Phone"
        value={form.phone}
        onChange={(e) => update('phone', e.target.value)}
        style={{ ...inputStyle, marginBottom: 10 }}
      />
      <textarea
        placeholder="Add a message or question here ..."
        rows={3}
        value={form.message}
        onChange={(e) => update('message', e.target.value)}
        style={{ ...inputStyle, marginBottom: 16, resize: 'vertical' }}
      />

      {status.error && <p className="error-text" style={{ marginBottom: 10 }}>{status.error}</p>}

      <button
        type="submit"
        disabled={status.submitting}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#8b2626',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: 'uppercase',
          padding: 14,
          borderRadius: 4,
          border: 'none',
          cursor: status.submitting ? 'default' : 'pointer',
          opacity: status.submitting ? 0.7 : 1,
        }}
      >
        {status.submitting ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  );
}

function ModalShell({ onClose, maxWidth = 480, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        style={{
          background: '#fff',
          borderRadius: 6,
          width: `min(${maxWidth}px, 100%)`,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function MakeOfferModal({ listingId, listingAddress, onClose }) {
  const { user } = useAuth();
  // propertyAddress auto-fills from the actual listing's address (per
  // Ryan, 2026-08-17 — see the matching comment in RequestShowingForm
  // above) — still a normal editable input, same as name/email already
  // auto-filling from the signed-in user.
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    propertyAddress: listingAddress || '',
    offerPrice: '',
  });
  const [purchasePlan, setPurchasePlan] = useState(null); // 'cash' | 'financing'
  const [hasBuyerAgency, setHasBuyerAgency] = useState(null); // 'yes' | 'no'
  const [hasToured, setHasToured] = useState(null); // 'yes' | 'no'
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '' });
    try {
      const result = await api.submitMakeOffer({
        ...form,
        listingId,
        purchasePlan: purchasePlan || undefined,
        hasBuyerAgency: hasBuyerAgency || undefined,
        hasToured: hasToured || undefined,
      });
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  return (
    <ModalShell onClose={onClose} maxWidth={560}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#e7e2cf', padding: '18px 26px' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, color: 'var(--color-ink)' }}>Want to make an Offer?</div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ cursor: 'pointer', fontSize: 20, color: 'var(--color-muted)', lineHeight: 1, background: 'none', border: 'none' }}
        >
          ×
        </button>
      </div>
      <div style={{ padding: '26px 30px 32px' }}>
        {status.success ? (
          <p style={{ color: 'var(--color-success)' }}>{status.success}</p>
        ) : (
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '14px 16px', alignItems: 'center' }}>
              <label style={{ fontSize: 13, color: 'var(--color-ink)' }}>Name</label>
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} style={inputStyle} />
              <label style={{ fontSize: 13, color: 'var(--color-ink)' }}>Email</label>
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} style={inputStyle} />
              <label style={{ fontSize: 13, color: 'var(--color-ink)' }}>Mobile Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} style={inputStyle} />
              <label style={{ fontSize: 13, color: 'var(--color-ink)' }}>Address of Property</label>
              <input
                value={form.propertyAddress}
                onChange={(e) => update('propertyAddress', e.target.value)}
                style={inputStyle}
              />
              <label style={{ fontSize: 13, color: 'var(--color-ink)' }}>Offer Price</label>
              <input
                type="number"
                min="1"
                required
                value={form.offerPrice}
                onChange={(e) => update('offerPrice', e.target.value)}
                style={inputStyle}
                className="no-spinner"
              />
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 10 }}>How do you plan to purchase?</div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <RadioLabel name="purchase-plan" checked={purchasePlan === 'cash'} onChange={() => setPurchasePlan('cash')}>
                  I plan to make a cash offer
                </RadioLabel>
                <RadioLabel name="purchase-plan" checked={purchasePlan === 'financing'} onChange={() => setPurchasePlan('financing')}>
                  I plan to use financing
                </RadioLabel>
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 10 }}>
                Have you signed an exclusive buyer agency agreement with another Agent or Broker?
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                <RadioLabel name="buyer-agency" checked={hasBuyerAgency === 'yes'} onChange={() => setHasBuyerAgency('yes')}>
                  Yes
                </RadioLabel>
                <RadioLabel name="buyer-agency" checked={hasBuyerAgency === 'no'} onChange={() => setHasBuyerAgency('no')}>
                  No
                </RadioLabel>
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 10 }}>Have you visited the property for a tour?</div>
              <div style={{ display: 'flex', gap: 24 }}>
                <RadioLabel name="toured" checked={hasToured === 'yes'} onChange={() => setHasToured('yes')}>
                  Yes
                </RadioLabel>
                <RadioLabel name="toured" checked={hasToured === 'no'} onChange={() => setHasToured('no')}>
                  No
                </RadioLabel>
              </div>
            </div>

            {status.error && (
              <p className="error-text" style={{ marginTop: 16 }}>
                {status.error}
              </p>
            )}

            <button
              type="submit"
              disabled={status.submitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-ink-dark)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                padding: 14,
                borderRadius: 4,
                border: 'none',
                cursor: status.submitting ? 'default' : 'pointer',
                width: '100%',
                marginTop: 28,
                opacity: status.submitting ? 0.7 : 1,
              }}
            >
              {status.submitting ? 'Submitting…' : 'Submit Information Here'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-muted)', marginTop: 10 }}>
              *We will get back to you shortly.
            </div>
          </form>
        )}
      </div>
    </ModalShell>
  );
}

function AskQuestionModal({ listingId, listingAddress, user, onClose }) {
  const [contactMethods, setContactMethods] = useState([]); // ['Call', 'Text', 'Email']
  // propertyAddress auto-fills from the actual listing's address when this
  // modal is opened on that listing's own Property Detail page (per Ryan,
  // 2026-08-17: "Can you add a text box on the ask a question popup menu &
  // have that auto populate also on the individual listings page") — same
  // pattern as RequestShowingForm/MakeOfferModal above, still a normal
  // editable input, not read-only. Falls back to '' when there's no listing
  // (the general-inquiry popups), same as the other two forms.
  const [form, setForm] = useState({ propertyAddress: listingAddress || '', name: user?.name || '', email: user?.email || '', phone: '', message: '' });
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
      const result = await api.submitAskQuestion({
        ...form,
        listingId,
        preferredContactMethod: contactMethods.length ? contactMethods : undefined,
      });
      setStatus({ submitting: false, error: '', success: result.message || "Thanks — we'll be in touch shortly." });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  return (
    <ModalShell onClose={onClose}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '22px 26px',
          borderBottom: '1px solid var(--color-border-light)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, color: 'var(--color-ink)' }}>Ask a Question Here</div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ cursor: 'pointer', fontSize: 20, color: 'var(--color-muted)', lineHeight: 1, background: 'none', border: 'none' }}
        >
          ×
        </button>
      </div>
      <div style={{ padding: '24px 26px 30px' }}>
        {/* "Call or Text Us: 321-350-7661" added 2026-09-01, per Ryan:
            "Can you add 'Call or Text Us: 321-350-7661' to all the ask a
            question buttons, Foreclosure, & Property management buttons
            popups." Hardcoded (not AGENT_INFO.phone) for the same reason as
            ContactModal.js's own copy of this line — that env var is
            confirmed empty on the live production bundle. */}
        <p style={{ color: 'var(--color-ink)', fontWeight: 600, marginBottom: 12, fontSize: 16 }}>
          Call or Text Us: <a href="tel:+13213507661" style={{ color: 'var(--color-ink)' }}>321-350-7661</a>
        </p>

        {status.success ? (
          <p style={{ color: 'var(--color-success)' }}>{status.success}</p>
        ) : (
          <form onSubmit={submit}>
            <div style={{ fontSize: 16, color: 'var(--color-muted-dark)', marginBottom: 10 }}>
              Enter your contact information below &amp; we will reach out to you shortly with an answer.
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-ink)',
                marginBottom: 8,
                textDecoration: 'underline',
              }}
            >
              How would you like us to respond?
            </div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
              {['Call', 'Text', 'Email'].map((method) => (
                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--color-muted-dark)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={contactMethods.includes(method)} onChange={() => toggleMethod(method)} style={{ width: 'auto' }} />
                  {method}
                </label>
              ))}
            </div>
            <input
              placeholder="Address of Property"
              value={form.propertyAddress}
              onChange={(e) => update('propertyAddress', e.target.value)}
              style={{ ...inputStyle, marginBottom: 10 }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 10 }}>
              <input placeholder="Name" required value={form.name} onChange={(e) => update('name', e.target.value)} style={inputStyle} />
              <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} style={inputStyle} />
            </div>
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              style={{ ...inputStyle, marginBottom: 10 }}
            />
            <textarea
              placeholder="Enter your question here......"
              rows={3}
              required
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              style={{ ...inputStyle, marginBottom: 18, resize: 'vertical' }}
            />

            {status.error && (
              <p className="error-text" style={{ marginBottom: 10 }}>
                {status.error}
              </p>
            )}

            <button
              type="submit"
              disabled={status.submitting}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-success)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                padding: 14,
                borderRadius: 4,
                border: 'none',
                cursor: status.submitting ? 'default' : 'pointer',
                opacity: status.submitting ? 0.7 : 1,
              }}
            >
              {status.submitting ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </ModalShell>
  );
}

function RadioLabel({ name, checked, onChange, children }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--color-muted-dark)', cursor: 'pointer' }}>
      <input type="radio" name={name} checked={checked} onChange={onChange} style={{ width: 'auto' }} />
      {children}
    </label>
  );
}
