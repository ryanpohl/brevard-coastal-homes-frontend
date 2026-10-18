// "Is this home still available?" (2026-10-18, per Ryan). The button under
// the address (components/AvailabilityButton.js) and the card after the
// last photo (PropertyGallery.js) announce this event, and the listing's
// PropertyContactPanel opens its Ask a Question popup with the question
// already written, so the visitor only adds a name and email.
export const ASK_AVAILABLE_EVENT = 'bch:ask-available';

export function askIfAvailable() {
  window.dispatchEvent(new Event(ASK_AVAILABLE_EVENT));
}

export function scrollToShowingForm() {
  const form = document.getElementById('request-showing');
  if (!form) return;
  window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
}
