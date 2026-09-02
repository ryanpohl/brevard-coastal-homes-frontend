'use client';

import { createPortal } from 'react-dom';
import { AGENT_INFO } from '@/lib/constants';
import ContactForm from './ContactForm';

/**
 * "Contact Us" nav link (components/Nav.js) opens this instead of
 * navigating to the standalone /contact page — per Ryan, 2026-08-15:
 * "Can you make the 'contact us' link in the main menu a pop up window
 * instead of its own separate page."
 *
 * Mirrors the site's established modal pattern (see PropertyContactPanel.js's
 * ModalShell and ScheduleShowingModal.js): portal straight to
 * document.body — Nav lives in its own stacking context (z-index: 30,
 * sibling of <main> in app/layout.js), so a plain absolutely-positioned
 * dropdown panel can't reliably sit above page content the way the
 * Sign In/Join panels do; a body-level `.modal-overlay` sidesteps that
 * entirely, same reasoning ScheduleShowingModal.js documents. Closes on
 * backdrop click or the × button; a click inside the panel itself is
 * stopped from bubbling to the backdrop.
 *
 * Reuses the same ContactForm shown on the standalone /contact page, plus
 * the agent's phone/email. The page's "Map placeholder" box is left out
 * here — it's a literal placeholder with no real map wired up, and isn't
 * worth the extra height in a popup. The standalone /contact page itself
 * is untouched and still works for anyone who lands on it directly (a
 * bookmark, a search result, a shared link) — this only changes what the
 * nav link does.
 *
 * Heading/intro sizing per Ryan, 2026-08-15: "Make the Contact Us on the
 * top larger & just include the following text & make it larger too.
 * 'Send us a message and we'll get back to you shortly.'" — bumped the
 * "Contact Us" heading from 20px to 30px, dropped the intro paragraph's
 * leading "Have a question about a listing..." sentence (the standalone
 * /contact page keeps both sentences — this trim is popup-only, per the
 * request), and sized the remaining sentence up from 14px to 18px.
 *
 * "Call or Text Us - 321-350-7661" line added 2026-08-26, per Ryan, right
 * under the "Contact Us" heading. Hardcoded rather than sourced from
 * AGENT_INFO.phone (used by the phone displays elsewhere on this site,
 * e.g. PropertyContactPanel.js) because AGENT_INFO.phone reads
 * NEXT_PUBLIC_BUSINESS_PHONE, which is baked in at Next.js build time and
 * has been confirmed empty on the live production bundle (see CLAUDE.md's
 * 2026-08-04 note — that env var issue was flagged but never fixed) — a
 * conditional render on it would have silently shown nothing. Ryan gave
 * the exact number directly in this request, so it's hardcoded here
 * instead of depending on that still-broken env var. Wrapped in a
 * `tel:` link so it's tap-to-call on mobile.
 *
 * "How would you like us to respond?" Call/Text/Email checkboxes added
 * 2026-09-02, per Ryan (referencing a screenshot of that exact block):
 * "add the options from the first screen shot to it like the rest of the
 * popups" — every other Ask a Question/inquiry popup on the site already
 * has this, so ContactForm.js grew a `showContactPreference` prop for it;
 * passed true only here, not from the standalone /contact page's own
 * ContactForm usage, since this request was specifically about the popup.
 */
export default function ContactModal({ onClose }) {
  const modal = (
    <div className="modal-overlay" onClick={onClose}>
      <div
        style={{
          background: '#fff',
          borderRadius: 6,
          width: 'min(480px, 100%)',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '22px 26px',
            borderBottom: '1px solid var(--color-border-light)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 600, color: 'var(--color-ink)' }}>
            Contact Us
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ cursor: 'pointer', fontSize: 20, color: 'var(--color-muted)', lineHeight: 1, background: 'none', border: 'none' }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '22px 26px 28px' }}>
          <p style={{ color: 'var(--color-ink)', fontWeight: 600, marginBottom: 12, fontSize: 16 }}>
            Call or Text Us - <a href="tel:+13213507661" style={{ color: 'var(--color-ink)' }}>321-350-7661</a>
          </p>

          <p style={{ color: 'var(--color-muted-dark)', marginBottom: 18, fontSize: 18 }}>
            Send us a message and we&apos;ll get back to you shortly.
          </p>

          <ContactForm showContactPreference />

          {(AGENT_INFO.phone || AGENT_INFO.email) && (
            <div
              style={{
                marginTop: 18,
                paddingTop: 16,
                borderTop: '1px solid var(--color-border-light)',
                fontSize: 13,
                color: 'var(--color-muted-dark)',
              }}
            >
              {AGENT_INFO.phone && <p style={{ marginBottom: 4 }}>{AGENT_INFO.phone}</p>}
              {AGENT_INFO.email && <p>{AGENT_INFO.email}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
