// Ready-made questions (2026-10-18, per Ryan): "Is this home still
// available?" and "Have there been any other offers?" — the buttons under
// the address (components/ListingQuestionButtons.js) and the card after the
// last photo (PropertyGallery.js) announce this event, and the listing's
// PropertyContactPanel opens its Ask a Question popup with the question
// already written, so the visitor only adds a name and email.
export const ASK_QUESTION_EVENT = 'bch:ask-question';

function askQuestion(question) {
  window.dispatchEvent(new CustomEvent(ASK_QUESTION_EVENT, { detail: { question } }));
}

export function askIfAvailable() {
  askQuestion('available');
}

export function askAboutOffers() {
  askQuestion('offers');
}

// "Schedule a Tour" on the listing photos opens the Request Showing form in
// a popup (PropertyContactPanel.js). `openHouse` (from the open house
// banner) writes "meet me at the open house at {address}" into the message.
export const SCHEDULE_TOUR_EVENT = 'bch:schedule-tour';

export function scheduleTour({ openHouse = false } = {}) {
  window.dispatchEvent(new CustomEvent(SCHEDULE_TOUR_EVENT, { detail: { openHouse } }));
}
