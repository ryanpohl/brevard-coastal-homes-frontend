'use client';

import { useMemo, useState } from 'react';
import ContactUsTrigger from './ContactUsTrigger';
import {
  DEFAULT_DOWN_PERCENT,
  DEFAULT_RATE,
  DEFAULT_TERM_YEARS,
  FLOOD_BY_ZONE,
  defaultInsurance,
  defaultTaxes,
  monthlyBreakdown,
} from '@/lib/mortgage';

/**
 * Florida "full monthly cost" mortgage calculator (2026-10-11, per Ryan):
 * principal & interest plus property taxes, homeowners (or condo) insurance,
 * optional flood insurance, HOA and PMI — the costs generic calculators
 * leave out. Every default is a conservative, editable estimate (see
 * lib/mortgage.js). On a listing page (`compact`) it starts as one
 * "Est. payment" line that opens the full calculator; /mortgage-calculator
 * shows it open, with a home-type picker.
 */
const fmt = (n) => `$${Math.round(n || 0).toLocaleString('en-US')}`;
const num = (v) => {
  const n = Number(String(v).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const ROWS = [
  ['pi', 'Principal & interest', '#10242c'],
  ['taxes', 'Property taxes', '#8a6629'],
  ['insurance', 'Homeowners insurance', '#c9a15a'],
  ['flood', 'Flood insurance', '#5b8fa8'],
  ['hoa', 'HOA / condo fee', '#7a8f6a'],
  ['pmi', 'Mortgage insurance (PMI)', '#a35d5d'],
];

export default function MortgageCalculator({ price: initialPrice = 450000, kind: initialKind = 'house', hoaMonth: initialHoa = 0, compact = false, showKindPicker = false }) {
  const [open, setOpen] = useState(!compact);
  const [price, setPrice] = useState(String(initialPrice || ''));
  const [kind, setKind] = useState(initialKind);
  const [downPercent, setDownPercent] = useState(String(DEFAULT_DOWN_PERCENT));
  const [rate, setRate] = useState(String(DEFAULT_RATE));
  const [years, setYears] = useState(DEFAULT_TERM_YEARS);
  const [taxes, setTaxes] = useState(null); // null = use the estimate
  const [insurance, setInsurance] = useState(null);
  const [flood, setFlood] = useState(false);
  const [zone, setZone] = useState('X');
  const [hoa, setHoa] = useState(String(initialHoa || 0));

  const p = num(price);
  const taxesYear = taxes == null ? defaultTaxes(p) : num(taxes);
  const insuranceYear = insurance == null ? defaultInsurance(p, kind) : num(insurance);
  const floodYear = flood ? FLOOD_BY_ZONE[zone] : 0;

  const result = useMemo(
    () =>
      monthlyBreakdown({
        price: p,
        downPercent: num(downPercent),
        ratePercent: num(rate),
        years,
        taxesYear,
        insuranceYear,
        floodYear,
        hoaMonth: num(hoa),
      }),
    [p, downPercent, rate, years, taxesYear, insuranceYear, floodYear, hoa]
  );

  const isCondo = kind === 'condo';
  const rows = ROWS.filter(([key]) => result.parts[key] > 0.5).map(([key, label, color]) => [
    key,
    key === 'insurance' && isCondo ? 'Condo insurance' : label,
    color,
  ]);

  if (!open) {
    return (
      <div className="mcalc-summary">
        <span>
          Est. payment <strong>{fmt(result.total)}/mo</strong>
        </span>
        <button type="button" className="mcalc-summary__btn" onClick={() => setOpen(true)}>
          See breakdown &amp; adjust
        </button>
      </div>
    );
  }

  return (
    <section className={`mcalc${compact ? ' mcalc--compact' : ''}`} aria-label="Mortgage calculator">
      {compact && (
        <div className="mcalc__head">
          <h2>Estimated monthly payment</h2>
          <button type="button" className="mcalc__close" onClick={() => setOpen(false)}>
            Hide
          </button>
        </div>
      )}
      <div className="mcalc__grid">
        <div className="mcalc__inputs">
          <Field label="Home price">
            <Money value={price} onChange={setPrice} />
          </Field>
          {showKindPicker && (
            <Field label="Home type">
              <select value={kind} onChange={(e) => { setKind(e.target.value); setInsurance(null); }}>
                <option value="house">House</option>
                <option value="olderHouse">House, 25+ years old</option>
                <option value="condo">Condo</option>
              </select>
            </Field>
          )}
          <div className="mcalc__row2">
            <Field label="Down payment" hint={fmt(result.downAmount)}>
              <Suffix suffix="%">
                <input inputMode="decimal" value={downPercent} onChange={(e) => setDownPercent(e.target.value)} aria-label="Down payment percent" />
              </Suffix>
            </Field>
            <Field label="Interest rate" hint="Example rate">
              <Suffix suffix="%">
                <input inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} aria-label="Interest rate" />
              </Suffix>
            </Field>
          </div>
          <Field label="Loan term">
            <select value={years} onChange={(e) => setYears(Number(e.target.value))}>
              <option value={30}>30-year fixed</option>
              <option value={20}>20-year fixed</option>
              <option value={15}>15-year fixed</option>
            </select>
          </Field>
          <Field label="Property taxes (per year)" note="Estimate: about 1.5% of the price. Taxes reset after a sale, so the seller's current bill isn't a guide.">
            <Money value={taxes == null ? String(taxesYear) : taxes} onChange={setTaxes} />
          </Field>
          <Field
            label={isCondo ? "Condo insurance (your unit's interior & belongings, per year)" : 'Homeowners insurance, including wind (per year)'}
            note={
              isCondo
                ? 'Estimate. The building itself is insured through the HOA fee.'
                : 'Estimate. Your quote depends on roof age, wind mitigation features and location.'
            }
          >
            <Money value={insurance == null ? String(insuranceYear) : insurance} onChange={setInsurance} />
          </Field>
          <div className="mcalc__flood">
            <label className="mcalc__check">
              <input type="checkbox" checked={flood} onChange={(e) => setFlood(e.target.checked)} /> Add flood insurance
            </label>
            {flood && (
              <select value={zone} onChange={(e) => setZone(e.target.value)} aria-label="Flood zone">
                <option value="X">Zone X, lower risk (~$637/yr)</option>
                <option value="A">Zone A/AE (~$1,313/yr)</option>
                <option value="V">Zone V/VE, coastal (~$2,413/yr)</option>
              </select>
            )}
            <p className="mcalc__note">Required by lenders in A and V zones. Flood zones vary block by block.</p>
          </div>
          <Field label="HOA / condo fee (per month)">
            <Money value={hoa} onChange={setHoa} />
          </Field>
        </div>

        <div className="mcalc__result">
          <div className="mcalc__total-label">Estimated monthly payment</div>
          <div className="mcalc__total">{fmt(result.total)}</div>
          <div className="mcalc__bar" aria-hidden="true">
            {rows.map(([key, , color]) => (
              <span key={key} style={{ width: `${(result.parts[key] / result.total) * 100}%`, background: color }} />
            ))}
          </div>
          <ul className="mcalc__list">
            {rows.map(([key, label, color]) => (
              <li key={key}>
                <span className="mcalc__dot" style={{ background: color }} />
                <span>{label}</span>
                <strong>{fmt(result.parts[key])}</strong>
              </li>
            ))}
          </ul>
          <p className="mcalc__small">
            Loan amount {fmt(result.loan)}.{result.parts.pmi > 0 ? ' Includes estimated PMI, since the down payment is under 20%.' : ''} All
            figures are estimates, not a loan offer. See our <a href="/property-taxes">property tax</a>,{' '}
            <a href="/hurricane-insurance">hurricane insurance</a> and <a href="/flood-insurance">flood insurance</a> guides.
          </p>
          <div className="mcalc__cta">
            Want real numbers? Ryan can connect you with a trusted local lender.{' '}
            <strong>
              <ContactUsTrigger>Contact Ryan</ContactUsTrigger>
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, hint, note, children }) {
  return (
    <label className="mcalc__field">
      <span className="mcalc__label">
        {label}
        {hint && <span className="mcalc__hint">{hint}</span>}
      </span>
      {children}
      {note && <span className="mcalc__note">{note}</span>}
    </label>
  );
}

function Suffix({ suffix, children }) {
  return (
    <span className="mcalc__affix">
      {children}
      <span>{suffix}</span>
    </span>
  );
}

function Money({ value, onChange }) {
  const shown = value === '' ? '' : num(value).toLocaleString('en-US');
  return (
    <span className="mcalc__affix mcalc__affix--pre">
      <span>$</span>
      <input inputMode="numeric" value={shown} onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))} />
    </span>
  );
}
