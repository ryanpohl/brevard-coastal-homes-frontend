'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

/**
 * "What's My Home Worth" form for app/home-value/page.js and the Looking to
 * Sell page. Added 2026-10-02 as a request form Ryan priced by hand; since
 * 2026-11-15 (per Ryan) it shows an instant estimate from recent sales when
 * the backend finds enough close matches (backend
 * homeValueEstimate.service.js: same ZIP, home or condo, similar size, same
 * waterfront type). Otherwise Ryan prices it personally, as before.
 *
 * Brevard County only, per Ryan ("I just don't want to be responsible for
 * what's my home worth outside of brevard county"): the backend checks the
 * ZIP code and turns away anything outside Brevard before saving it. The
 * city list is the site's towns plus "Other Brevard County city".
 */
const fmt = (n) => `$${Number(n).toLocaleString('en-US')}`;

function shortDate(d) {
  const t = Date.parse(d);
  return Number.isFinite(t) ? new Date(t).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : '';
}

function EstimateResult({ estimate, address }) {
  return (
    <div className="card home-value-result" style={{ padding: 'clamp(20px, 4vw, 32px)' }} role="status">
      <div className="home-value-result__kicker">Your home value estimate</div>
      <div className="home-value-result__address">{address}</div>
      <div className="home-value-result__range">
        {fmt(estimate.low)} &ndash; {fmt(estimate.high)}
      </div>
      <p className="home-value-result__basis">
        Based on {estimate.compCount} similar sales in your ZIP code over the last {estimate.months} months.
      </p>
      <table className="home-value-result__comps">
        <tbody>
          {estimate.comps.map((c, i) => (
            <tr key={i}>
              <td>
                {c.street}
                <div>{[c.beds && `${c.beds} bd`, c.baths && `${c.baths} ba`, c.sqft && `${Number(c.sqft).toLocaleString('en-US')} sq ft`].filter(Boolean).join(' · ')}</div>
              </td>
              <td>
                <strong>{fmt(c.soldPrice)}</strong>
                <div>{shortDate(c.soldDate)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-muted-dark)', margin: '16px 0' }}>
        An estimate from sales can&rsquo;t see your home&rsquo;s condition, updates, view or lot. For a more exact number,
        Ryan will prepare a personal valuation at no cost. Just reply to the email we sent you, or call or text{' '}
        <a href="tel:+13213507661" style={{ fontWeight: 600 }}>
          321-350-7661
        </a>
        .
      </p>
      <p style={{ fontSize: 11, color: 'var(--color-muted)' }}>An estimate from recent sales, not an appraisal.</p>
    </div>
  );
}

export default function HomeValueForm({ cities = [] }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    propertyType: 'Home',
    waterfront: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',
    timeline: '',
  });
  const [status, setStatus] = useState({ submitting: false, error: '', success: '', estimate: null });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ submitting: true, error: '', success: '', estimate: null });
    try {
      const result = await api.submitHomeValue({
        ...form,
        waterfront: form.waterfront || undefined,
        bedrooms: form.bedrooms || undefined,
        bathrooms: form.bathrooms || undefined,
        squareFeet: form.squareFeet || undefined,
        yearBuilt: form.yearBuilt || undefined,
        timeline: form.timeline || undefined,
      });
      setStatus({
        submitting: false,
        error: '',
        success: result.message || 'Thanks! Ryan will email you your home value within one business day.',
        estimate: result.estimate || null,
      });
    } catch (err) {
      setStatus({ submitting: false, error: err.message || 'Something went wrong. Please try again.', success: '', estimate: null });
    }
  }

  if (status.estimate) {
    return <EstimateResult estimate={status.estimate} address={form.address} />;
  }

  if (status.success) {
    return (
      <div className="card" style={{ padding: 32, textAlign: 'center' }} role="status">
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
          <select required value={form.city} onChange={(e) => update('city', e.target.value)} aria-label="City">
            <option value="" disabled>
              City
            </option>
            {cities.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="Other">Other Brevard County city</option>
          </select>
          <input
            placeholder="ZIP code"
            required
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            title="5-digit Brevard County ZIP code"
            value={form.zip}
            onChange={(e) => update('zip', e.target.value.replace(/\D/g, ''))}
          />
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6 }}>Brevard County, FL homes only.</p>
      </div>

      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>About the Property</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <select value={form.propertyType} onChange={(e) => update('propertyType', e.target.value)} aria-label="Home or condo">
            <option value="Home">House</option>
            <option value="Condo">Condo or townhome</option>
          </select>
          <select value={form.waterfront} onChange={(e) => update('waterfront', e.target.value)} aria-label="On the water?">
            <option value="">On the water?</option>
            <option value="None">Not on the water</option>
            <option value="Oceanfront">Oceanfront</option>
            <option value="Riverfront">Riverfront</option>
            <option value="Canal">Canal or other water</option>
          </select>
          <input
            type="number"
            min="0"
            placeholder="Square feet"
            aria-label="Square feet"
            value={form.squareFeet}
            onChange={(e) => update('squareFeet', e.target.value)}
          />
          <input type="number" min="0" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} />
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="Bathrooms"
            value={form.bathrooms}
            onChange={(e) => update('bathrooms', e.target.value)}
          />
          <input type="number" min="0" placeholder="Year built" value={form.yearBuilt} onChange={(e) => update('yearBuilt', e.target.value)} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6 }}>Add the square feet to see an instant estimate.</p>
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
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Where should we send it?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <input placeholder="Full name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
          <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
      </div>

      {status.error && <p className="error-text">{status.error}</p>}

      <button type="submit" className="btn btn-primary" disabled={status.submitting}>
        {status.submitting ? 'Checking recent sales…' : 'See My Home Value'}
      </button>

      <p style={{ fontSize: 11, color: 'var(--color-muted)', lineHeight: 1.5 }}>
        A free estimate from recent sales near you, not a formal appraisal. We&apos;ll never share your information,
        and there&apos;s no obligation to list with us.
      </p>
    </form>
  );
}
