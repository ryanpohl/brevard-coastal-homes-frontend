'use client';

import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Slim Call / Text bar pinned to the bottom of the screen on phones
 * (2026-10-09, per Ryan: visitors weren't reaching out, and most buyers
 * would rather text than fill out a form). Hidden on desktop via CSS
 * (.mobile-contact-bar in globals.css). "Text" opens the phone's messages
 * app with a starter message; a listing page swaps in its address and
 * MLS# through <ContactBarMessage>, so Ryan knows which home it's about.
 */
const PHONE = '+13213507661';
const DEFAULT_MESSAGE = 'Hi Ryan, I found your website and have a real estate question.';

const MessageContext = createContext({ message: DEFAULT_MESSAGE, setMessage: () => {} });

export function ContactBarProvider({ children }) {
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  return <MessageContext.Provider value={{ message, setMessage }}>{children}</MessageContext.Provider>;
}

// Rendered by a page to set the starter text while that page is open.
export function ContactBarMessage({ message }) {
  const { setMessage } = useContext(MessageContext);
  useEffect(() => {
    setMessage(message);
    return () => setMessage(DEFAULT_MESSAGE);
  }, [message, setMessage]);
  return null;
}

function track(action) {
  // Google Ads/Analytics event, so text and call taps show up as conversions.
  try {
    window.gtag?.('event', action, { event_category: 'contact', event_label: 'mobile_contact_bar' });
  } catch {
    // Never let tracking block the tap.
  }
}

export default function MobileContactBar() {
  const { message } = useContext(MessageContext);
  // "?&body=" works on both iPhone and Android messages apps.
  const smsHref = `sms:${PHONE}?&body=${encodeURIComponent(message)}`;
  return (
    <div className="mobile-contact-bar" role="region" aria-label="Contact Ryan">
      <a href={`tel:${PHONE}`} className="mobile-contact-bar__btn" onClick={() => track('call_click')}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
        </svg>
        Call
      </a>
      <a href={smsHref} className="mobile-contact-bar__btn mobile-contact-bar__btn--text" onClick={() => track('text_click')}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Text Ryan
      </a>
    </div>
  );
}
