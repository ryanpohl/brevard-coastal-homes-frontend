'use client';

import { useState } from 'react';
import ContactModal from './ContactModal';

// "Schedule a Model Tour" button (2026-10-04, per Ryan) for new-construction
// neighborhood pages (Aripeka and Adelaide). Opens the
// site's Contact popup with the message pre-filled, so the inquiry says
// which community's models the buyer wants to see.
export default function ModelTourButton({ communityName }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
        Schedule a Model Tour
      </button>
      {open && (
        <ContactModal
          title="Schedule a Model Tour"
          initialMessage={`I'd like to schedule a model home tour in ${communityName}.`}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
