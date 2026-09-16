'use client';

import { useState } from 'react';
import ContactModal from './ContactModal';

/**
 * Reusable clickable/underlined inline-text trigger for the same "Contact
 * Us" popup Nav.js opens (see ContactModal.js) — added 2026-09-16, per
 * Ryan: "Underline Contact us today & make it a live link for the popup
 * Contact us," as part of rewriting the Adelaide neighborhood page's
 * builder text (app/neighborhoods/[slug]/page.js's isAdelaide block).
 *
 * Modeled after HarborIslandForeclosuresTrigger.js's inline
 * underlined-span-as-trigger pattern (same role="button"/tabIndex/
 * onKeyDown-for-Enter-or-Space treatment for keyboard/screen-reader
 * accessibility), but simpler: HarborIslandForeclosuresTrigger has to
 * dispatch a window CustomEvent because that page's foreclosures modal
 * lives in a separate component tree (HarborIslandInquiryModals.js,
 * rendered via FilterBar's extraActions) with no direct prop path back to
 * the server-rendered neighborhood page. ContactModal has no such
 * constraint — it's a self-contained client component that only needs an
 * onClose callback — so this trigger just owns its own open/close state
 * and renders ContactModal directly, no event plumbing or changes to
 * Nav.js needed. Reusable anywhere on the site an inline "Contact us"
 * link should open this same popup, not just the Adelaide page.
 */
export default function ContactUsTrigger({ children }) {
  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
  }

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
          }
        }}
        style={{ textDecoration: 'underline', cursor: 'pointer' }}
      >
        {children}
      </span>
      {open && <ContactModal onClose={() => setOpen(false)} />}
    </>
  );
}
