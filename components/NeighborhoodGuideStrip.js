'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import * as api from '@/lib/api';
import { rememberAlertEmail, rememberedAlertEmail } from '@/lib/alertMemory';
import { NEIGHBORHOOD_GUIDES } from '@/lib/neighborhoodGuides';


/**
 * "Get the free {Community} Guide" strip near the top of a community page
 * (2026-11-13, per Ryan). Same look as GuideStrip; tapping it opens a single
 * email box in place (no name or phone, to keep it short). The guide PDF is
 * emailed right away and the request goes to Ryan's Website Leads sheet.
 */
export default function NeighborhoodGuideStrip({ slug }) {
  const guide = NEIGHBORHOOD_GUIDES[slug];
  const name = guide?.name;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, error: '', done: '' });

  useEffect(() => {
    if (open) setEmail((current) => current || rememberedAlertEmail());
  }, [open]);

  if (!name) return null;

  async function submit(e) {
    e.preventDefault();
    setState({ sending: true, error: '', done: '' });
    try {
      const res = await api.requestNeighborhoodGuide({ email: email.trim(), slug, pagePath: pathname });
      rememberAlertEmail(email);
      setState({ sending: false, error: '', done: res?.message || `Check your inbox — your ${name} Guide is on its way.` });
    } catch (err) {
      setState({ sending: false, error: err.message || 'Something went wrong. Please try again.', done: '' });
    }
  }

  if (state.done) {
    return (
      <div className="guide-strip guide-strip--open" role="status">
        <span className="guide-strip__text">✓ {state.done}</span>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" className="guide-strip" onClick={() => setOpen(true)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="guide-strip__cover" src={guide.cover} alt="" width="28" height="36" loading="lazy" />
        <span className="guide-strip__text">
          <strong>Free {name} Guide:</strong> {guide.blurb}, sent to your inbox
        </span>
        <span className="guide-strip__arrow" aria-hidden="true">
          &rarr;
        </span>
      </button>
    );
  }

  return (
    <form className="guide-strip guide-strip--open" onSubmit={submit}>
      <span className="guide-strip__text">
        <strong>Free {name} Guide</strong>
      </span>
      <input
        type="email"
        required
        autoFocus
        placeholder="Your email"
        aria-label="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="btn btn-gold" disabled={state.sending}>
        {state.sending ? 'Sending…' : 'Send Guide'}
      </button>
      {state.error && <p className="error-text" style={{ width: '100%', margin: 0 }}>{state.error}</p>}
    </form>
  );
}
