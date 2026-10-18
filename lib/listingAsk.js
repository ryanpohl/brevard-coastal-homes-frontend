// "Is this home still available?" (2026-10-18, per Ryan). The button under
// the address (components/AvailabilityButton.js) and the card after the
// last photo (PropertyGallery.js) announce this event, and the listing's
// PropertyContactPanel opens its Ask a Question popup with the question
// already written, so the visitor only adds a name and email.
export const ASK_AVAILABLE_EVENT = 'bch:ask-available';

export function askIfAvailable() {
  window.dispatchEvent(new Event(ASK_AVAILABLE_EVENT));
}

// "Schedule a Tour" on the listing photos opens the Request Showing form in
// a popup (PropertyContactPanel.js).
export const SCHEDULE_TOUR_EVENT = 'bch:schedule-tour';

export function scheduleTour() {
  window.dispatchEvent(new Event(SCHEDULE_TOUR_EVENT));
}
