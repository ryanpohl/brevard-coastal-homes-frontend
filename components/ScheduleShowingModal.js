'use client';

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
 */
export default function ScheduleShowingModal({ onClose }) {
  return (
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
}
