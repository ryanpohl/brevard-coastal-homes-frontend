/**
 * Lead tracking (2026-10-13, per Ryan: ~1,000 ad visitors a month but Google
 * Analytics showed no key events, so neither Analytics nor Ads could tell
 * which visits turned into leads). One GA4 event per lead action, sent
 * through the site's Google tag. In GA4, mark these as key events
 * (Admin → Events), then import them into Google Ads as conversions.
 *
 *   showing_request, question_request, offer_request, contact_form,
 *   model_tour_request, seller_inquiry, home_value_request,
 *   home_alert_signup, listing_alert_signup, relocation_guide_request,
 *   sign_up, favorite_add, phone_click, text_click, email_click
 *
 * The form events are sent from lib/api.js after the server accepts the
 * form, so a failed submit never counts. Tracking never blocks a lead.
 */
export function trackLead(event, params = {}) {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('event', event, { event_category: 'lead', page_path: window.location.pathname, ...params });
  } catch {
    // Never let tracking break a form.
  }
}
