'use client';

import { useEffect } from 'react';
import { trackLead } from '@/lib/track';

/**
 * Tracks taps on any phone, text or email link on the site (2026-10-13,
 * per Ryan) — the header strip, the phone Call / Text bar, the footer,
 * forms and listing pages — as phone_click / text_click / email_click,
 * with where on the page it was tapped. See lib/track.js.
 */
function placeOf(el) {
  if (el.closest('.mobile-contact-bar')) return 'mobile_bar';
  if (el.closest('.sticky-contact-bar')) return 'top_bar';
  if (el.closest('.nav-phone-strip')) return 'header';
  if (el.closest('footer')) return 'footer';
  if (el.closest('.modal-overlay')) return 'popup';
  return 'page';
}

export default function LeadClickTracker() {
  useEffect(() => {
    function onClick(e) {
      const link = e.target.closest?.('a[href^="tel:"], a[href^="sms:"], a[href^="mailto:"]');
      if (!link) return;
      const href = link.getAttribute('href');
      const event = href.startsWith('tel:') ? 'phone_click' : href.startsWith('sms:') ? 'text_click' : 'email_click';
      trackLead(event, { event_label: placeOf(link) });
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
