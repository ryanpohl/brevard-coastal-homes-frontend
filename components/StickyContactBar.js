'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrokerageNote from './BrokerageNote';
import ScheduleShowingModal from './ScheduleShowingModal';

/**
 * Slim bar that slides down from the top on tablets and computers once the
 * header has scrolled away (2026-10-12, per Ryan: keep the phone number in
 * view while people browse — the header isn't sticky, so it used to be gone
 * until the footer). Phones have the Call / Text bar at the bottom instead
 * (MobileContactBar.js); the CSS hides this one at 720px and narrower.
 * On a listing page the button scrolls to that home's Request Showing form
 * (#request-showing in PropertyContactPanel.js); elsewhere it opens the
 * general Schedule a Showing popup.
 */
export default function StickyContactBar() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Show once the header (about 240px tall) is out of view.
    const onScroll = () => setShown(window.scrollY > 260);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const onListing = pathname?.startsWith('/listings/');

  function showing() {
    const form = onListing && document.getElementById('request-showing');
    if (form) {
      window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
    } else {
      setModalOpen(true);
    }
  }

  return (
    <>
      <div className={`sticky-contact-bar${shown ? ' is-shown' : ''}`} aria-hidden={!shown}>
        <div className="sticky-contact-bar__inner">
          <Link href="/" className="sticky-contact-bar__brand" tabIndex={shown ? 0 : -1}>
            Brevard Coastal Homes
          </Link>
          <div className="sticky-contact-bar__phone">
            Call or Text Ryan:{' '}
            <a href="tel:+13213507661" tabIndex={shown ? 0 : -1}>
              321-350-7661
            </a>
            <BrokerageNote agentName={false} className="sticky-contact-bar__brokerage" />
          </div>
          <button type="button" className="sticky-contact-bar__btn" onClick={showing} tabIndex={shown ? 0 : -1}>
            {onListing ? 'Request a Showing' : 'Schedule a Showing'}
          </button>
        </div>
      </div>
      {modalOpen && <ScheduleShowingModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
