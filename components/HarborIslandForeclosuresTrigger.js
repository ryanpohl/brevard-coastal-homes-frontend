'use client';

/**
 * Clickable "Foreclosed Bank-Owned Condos" text inline in the Harbor Island
 * Beach Club neighborhood page's subtext (2026-09-15, per Ryan: "make the
 * underlined Foreclosed Bank-Owned Condos an active link & when someone
 * clicks on the link can you have this popup box come up" — referring to
 * the existing "Send Us a Message" foreclosures modal already wired to the
 * "Contact Us Here about Foreclosures in Harbor Island" button below).
 *
 * app/neighborhoods/[slug]/page.js is a Server Component, and the modal
 * itself lives in HarborIslandInquiryModals.js (a separate Client
 * Component rendered elsewhere in the tree, via FilterBar's extraActions
 * prop) — there's no direct prop path between the two without lifting
 * state up through the server-rendered page. Rather than restructure that,
 * this dispatches a plain window CustomEvent that HarborIslandInquiryModals
 * listens for and reacts to by opening its existing 'foreclosures' modal
 * state — no backend or data changes, just wiring two already-existing
 * pieces together. Both components are always rendered together on this
 * page, so the event never has to cross pages.
 */
export const HARBOR_ISLAND_OPEN_FORECLOSURES_EVENT = 'hibc-open-foreclosures-modal';

export default function HarborIslandForeclosuresTrigger({ children }) {
  function open() {
    window.dispatchEvent(new Event(HARBOR_ISLAND_OPEN_FORECLOSURES_EVENT));
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      style={{ textDecoration: 'underline', cursor: 'pointer' }}
    >
      {children}
    </span>
  );
}
