'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

/**
 * "What's My Home Worth" lead-capture form for app/home-value/page.js.
 * Added 2026-10-02, per Ryan (scoping conversation referencing
 * homes.com/waverealtybrevard.com/howardhanna/viewbrevardhomes/
 * bluemarlinre/ajmetzger as reference competitors). Posts to the new
 * dedicated POST /api/inquiries/home-value endpoint (api.submitHomeValue) —
 * see backend's inquiries.controller.js submitHomeValueRequest for why
 * this isn't folded into the generic inquiries table, and for why this
 * site deliberately does NOT generate an automated instant valuation
 * (checked direct local competitors; none of them do either — they all
 * capture the lead and have an agent pull real comps by hand).
 *
 * City is a <select> built from api.getCities() rather than a free-text
 * field, both to keep submissions scoped to Brevard County (per Ryan: "Do
 * I offer the evaluation for just properties in Brevard county Florida?" —
 * yes, same cities this site already serves) and because the backend
 * rejects anything that doesn't match one of those cities anyway
 * (resolveBrevardCity) — a dropdown means a visitor never gets a rejected
 * submission over a typo or an out-of-area address.
 *
 * `cities` is passed in from the server-rendered page (app/home-value/
 * page.js already calls api.getCities() for other reasons — Nav/Footer do
 * the same, see app/layout.js) rather than fetched again here client-side.
 */
export default function HomeValueForm({ cities = [] }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',
    timeline: '',
  });
  const [status, setStatus] = useState({ submitting: false, error: '', success: '' });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '' });
    try {
      const result = await api.submitHomeValue({
        ...form,
        bedrooms: form.bedrooms || undefined,
        bathrooms: form.bathrooms || undefined,
        squareFeet: form.squareFeet || undefined,
        yearBuilt: form.yearBuilt || undefined,
        timeline: form.timeline || undefined,
      });
      setStatus({
        submitting: false,
        error: '',
        success: result.message || "Thanks! We're putting together your home value report now — check your email shortly.",
      });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '' });
    }
  }

  if (status.success) {
    return (
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <p style={{ color: 'var(--color-success)', fontSize: 16 }}>{status.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Property Address</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <input placeholder="Street address" required value={form.address} onChange={(e) => update('address', e.target.value)} />
          <select required value={form.city} onChange={(e) => update('city', e.target.value)}>
            <option value="" disabled>
              City
            </option>
            {cities.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <input placeholder="Zip (optional)" value={form.zip} onChange={(e) => update('zip', e.target.value)} />
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Property Details (optional)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <input type="number" min="0" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} />
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="Bathrooms"
            value={form.bathrooms}
            onChange={(e) => update('bathrooms', e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="Square feet"
            value={form.squareFeet}
            onChange={(e) => update('squareFeet', e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="Year built"
            value={form.yearBuilt}
            onChange={(e) => update('yearBuilt', e.target.value)}
          />
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>When are you thinking of selling?</div>
        <select value={form.timeline} onChange={(e) => update('timeline', e.target.value)}>
          <option value="">Not sure yet</option>
          <option value="right_away">Right away</option>
          <option value="3_months">Within 3 months</option>
          <option value="6_months">Within 6 months</option>
          <option value="1_year">Within a year</option>
          <option value="not_sure">Just curious</option>
        </select>
      </div>

      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Your Contact Info</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <input placeholder="Full name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
          <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
      </div>

      {status.error && <p className="error-text">{status.error}</p>}

      <button type="submit" className="btn btn-primary" disabled={status.submitting}>
        {status.submitting ? 'Sending…' : 'Get My Free Home Value Report'}
      </button>

      <p style={{ fontSize: 11, color: 'var(--color-muted)', lineHeight: 1.5 }}>
        This is a free estimate based on comparable sales and current market conditions, not a formal appraisal.
        We&apos;ll never share your information, and there&apos;s no obligation to list with us.
      </p>
    </form>
  );
}
