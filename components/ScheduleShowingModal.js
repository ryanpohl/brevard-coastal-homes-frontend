'use client';

import { createPortal } from 'react-dom';
import PropertyContactPanel from './PropertyContactPanel';

/**
 * Homepage hero "Schedule a Showing" button (SearchBar.js) opens this —
 * the same "Call or Text" hero card + Make an Offer/Ask a Question buttons
 * + inline Request Showing panel used on the Property Detail page's sidebar
 * (see PropertyContactPanel.js, matches design/design_files/Property
 * Detail.dc.html), just wrapped in a modal since there's no page layout to
 * anchor a sidebar to here. No listingId is passed — this is a general
 * "reach out to us" entry point, not tied to one property (per Ryan,
 * 2026-08-04: keep all three buttons as designed even though "Make an
 * Offer" only really makes sense once a specific listing is picked).
 *
 * Rendered via a portal into document.body (2026-08-04, per Ryan — the nav
 * bar was covering the top of the popup). The hero section in app/page.js
 * wraps its content (including SearchBar, and therefore this modal) in a
 * `position: relative; z-index: 5` div, which creates its own stacking
 * context — so even though .modal-overlay itself has z-index: 100, that
 * only wins against other elements *inside* that z-index:5 context, not
 * against the Nav (components/Nav.js, z-index: 30), which is a sibling of
 * <main> in app/layout.js and lives in a *different* stacking context.
 * Portaling straight to document.body escapes that nesting entirely.
 */
export default function ScheduleShowingModal({ onClose }) {
  const modal = (
    <div className="modal-overlay" onClick={onClose}>
      <div
        style={{ position: 'relative', width: 'min(440px, 100%)', maxHeight: '90vh', overflowY: 'auto', borderRadius: 6 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255,255,255,0.92)',
            color: 'var(--color-ink)',
            fontSize: 18,
            lineHeight: 1,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}
        >
          ×
        </button>
        <PropertyContactPanel />
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
