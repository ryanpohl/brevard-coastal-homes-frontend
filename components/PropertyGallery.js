'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { askIfAvailable, scheduleTour } from '@/lib/listingAsk';
import { tourEmbedUrl, visibleTourUrl } from '@/lib/virtualTour';

// Number of thumbnails shown per "page" of the strip below the hero photo:
// 6 on wider screens, 4 in a single row on phones (2026-10-29, per Ryan —
// 6 wrapped to two rows on a phone).
const THUMBS_PER_PAGE = 6;
const PHONE_THUMBS_PER_PAGE = 4;
const PHONE_QUERY = '(max-width: 640px)';
// Horizontal finger travel (px) that counts as a swipe on the hero photo.
const SWIPE_MIN = 40;

/**
 * Property Detail page's photo gallery: one large hero photo with left/right
 * arrow buttons to step through every photo, plus a paged strip of
 * thumbnails below it (its own left/right arrows page through the strip 6
 * at a time so all of a listing's photos are reachable, not just the first
 * 6) — matches design/design_files/Property Detail.dc.html, extended with
 * arrow navigation per Ryan (2026-08-10) so large photo counts (e.g. 70+)
 * are actually browsable instead of only the first 7 photos being reachable.
 * Plus a Photos / Virtual Tour tab pair, shown only when the listing has a
 * tour (`virtualTourUrl`, 2026-10-23 — it used to be a placeholder on every
 * listing, with no MLS field behind it). Was: that tab showed a placeholder instead of
 * crashing or silently doing nothing.
 */
export default function PropertyGallery({ photos = [], address, alt, tourButton = false, virtualTourUrl: mlsTourUrl = null }) {
  const virtualTourUrl = visibleTourUrl(mlsTourUrl);
  const tourEmbed = virtualTourUrl ? tourEmbedUrl(virtualTourUrl) : null;
  // `alt` (2026-10-18): photo description from lib/listingPhotoAlt.js.
  // `tourButton` (2026-10-18, per Ryan): a "Schedule a Tour" button on the
  // bottom left of the hero photo that opens the Request Showing form in a
  // popup (PropertyContactPanel.js) — another way to reach
  // out, since there's no forced signup. Off for Pending/Sold listings,
  // which have no showing form.
  const altBase = alt || address;
    const [activeIndex, setActiveIndex] = useState(0);
    // Index of the first thumbnail visible in the current "page" of the strip.
  const [thumbStart, setThumbStart] = useState(0);
    const [tab, setTab] = useState('photos'); // 'photos' | 'tour'
  // Card over the last photo (2026-10-18, per Ryan): someone who flipped
  // through every photo is interested, so offer a tour or the "still
  // available?" question. Shown with tourButton (active listings); "View
  // last photo" hides it until they leave and come back to the end.
  const [endCardHidden, setEndCardHidden] = useState(false);
  const [perPage, setPerPage] = useState(THUMBS_PER_PAGE);
  // Swipe on the hero photo (2026-10-29, per Ryan): on phones it replaces the
  // ‹ › arrows, which globals.css hides there (.gallery-arrow).
  const touchStart = useRef(null);
  // Full-screen photo viewer (2026-10-29, per Ryan, like corcoran.com):
  // click/tap the hero photo to see the whole, uncropped photo on black.
  // It shares activeIndex with the hero, so closing lands on the same photo.
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const update = () => setPerPage(mq.matches ? PHONE_THUMBS_PER_PAGE : THUMBS_PER_PAGE);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Keep the active photo's thumbnail in view when the page size changes.
  useEffect(() => {
    setThumbStart(Math.floor(activeIndex / perPage) * perPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage]);

  const hasPhotos = photos.length > 0;
    const total = photos.length;
    const heroPhoto = hasPhotos ? photos[Math.min(activeIndex, total - 1)] : null;
  const showEndCard = tourButton && total > 1 && activeIndex === total - 1 && !endCardHidden;

  // Thumbnail strip shows a perPage-wide window starting at
  // thumbStart; the page-arrows below shift that window without touching
  // which photo is active in the hero. Clicking a thumbnail sets the hero.
  const thumbnails = photos.slice(thumbStart, thumbStart + perPage);
    const canPageThumbsPrev = thumbStart > 0;
    const canPageThumbsNext = thumbStart + perPage < total;

  function syncThumbWindow(index) {
        setThumbStart(Math.floor(index / perPage) * perPage);
  }

  function showPrevPhoto() {
        if (total < 2) return;
        const next = (activeIndex - 1 + total) % total;
        setActiveIndex(next);
        setEndCardHidden(false);
        syncThumbWindow(next);
  }

  function showNextPhoto() {
        if (total < 2) return;
        const next = (activeIndex + 1) % total;
        setActiveIndex(next);
        setEndCardHidden(false);
        syncThumbWindow(next);
  }

  function onTouchStart(e) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) showNextPhoto();
    else showPrevPhoto();
  }

  // Clicks on the hero's own buttons (arrows, Schedule a Tour, end card)
  // keep doing their job; anywhere else on the photo opens the viewer.
  function onHeroClick(e) {
    if (!heroPhoto || e.target.closest('button')) return;
    setViewerOpen(true);
  }

  function closeViewer() {
    setViewerOpen(false);
  }

  function pageThumbsPrev() {
        setThumbStart((s) => Math.max(0, s - perPage));
  }

  function pageThumbsNext() {
        setThumbStart((s) => Math.min(Math.max(0, total - perPage), s + perPage));
  }

  return (
        <div>
  {tab === 'photos' ? (
            <>
             <div
               onTouchStart={onTouchStart}
               onTouchEnd={onTouchEnd}
               onClick={onHeroClick}
               style={{
                 position: 'relative',
                               cursor: heroPhoto ? 'zoom-in' : 'default',
                               touchAction: 'pan-y',
                               width: '100%',
                               height: 'clamp(240px, 42vw, 460px)',
                               borderRadius: 4,
                               overflow: 'hidden',
                               background: 'var(--color-border-light)',
               }}
              >
   {heroPhoto ? (
                   <Image src={heroPhoto} alt={altBase} fill priority sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: 'cover' }} />
                 ) : (
                   <div
                     style={{
                       position: 'absolute',
                                         inset: 0,
                                         display: 'flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         color: 'var(--color-muted)',
                                         fontSize: 14,
                     }}
                   >
                     No photo available
     </div>
                 )}

   {total > 1 && (
                   <>
                     <button
                      type="button"
                      onClick={showPrevPhoto}
                      aria-label="Previous photo"
                      className="gallery-arrow"
                      style={{
                      zIndex: 2,
                                            position: 'absolute',
                                            top: '50%',
                                            left: 12,
                                            transform: 'translateY(-50%)',
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            border: 'none',
                                            background: 'rgba(255,255,255,0.92)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            fontSize: 16,
                                            lineHeight: 1,
                                            color: 'var(--color-ink)',
                      }}
                    >
                     ‹
   </button>
                   <button
                     type="button"
                     onClick={showNextPhoto}
                     aria-label="Next photo"
                     className="gallery-arrow"
                     style={{
                      zIndex: 2,
                       position: 'absolute',
                                           top: '50%',
                                           right: 12,
                                           transform: 'translateY(-50%)',
                                           width: 36,
                                           height: 36,
                                           borderRadius: '50%',
                                           border: 'none',
                                           background: 'rgba(255,255,255,0.92)',
                                           display: 'flex',
                                           alignItems: 'center',
                                           justifyContent: 'center',
                                           cursor: 'pointer',
                                           fontSize: 16,
                                           lineHeight: 1,
                                           color: 'var(--color-ink)',
                     }}
                >
                  ›
                    </button>
                <div
                  style={{
                                        position: 'absolute',
                                        bottom: 10,
                                        right: 12,
                                        background: 'rgba(16,36,44,0.55)',
                                        color: '#fff',
                                        fontSize: 12,
                                        fontWeight: 600,
                                        padding: '3px 8px',
                                        borderRadius: 12,
                  }}
                >
{activeIndex + 1} / {total}
  </div>
  </>
            )}

{showEndCard && (
              <div className="gallery-end-card">
                <div className="gallery-end-card__box">
                  <div className="gallery-end-card__title">Want to see it in person?</div>
                  <div className="gallery-end-card__text">Ryan can set up a private tour, or find out if it’s still available.</div>
                  <div className="gallery-end-card__actions">
                    <button type="button" className="gallery-end-card__primary" onClick={() => scheduleTour()}>
                      Schedule a Tour
                    </button>
                    <button type="button" className="gallery-end-card__secondary" onClick={askIfAvailable}>
                      Is it still available?
                    </button>
                  </div>
                  <div className="gallery-end-card__links">
                    <button type="button" onClick={() => { setActiveIndex(0); syncThumbWindow(0); }}>Back to first photo</button>
                    <span aria-hidden="true">·</span>
                    <button type="button" onClick={() => setEndCardHidden(true)}>View last photo</button>
                  </div>
                </div>
              </div>
            )}

{tourButton && !showEndCard && (
              <button type="button" onClick={() => scheduleTour()} className="gallery-tour-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Schedule a Tour
              </button>
            )}
</div>

{thumbnails.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <button
                type="button"
                onClick={pageThumbsPrev}
                disabled={!canPageThumbsPrev}
                aria-label="Show previous thumbnails"
                style={{
                                    flex: '0 0 auto',
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: canPageThumbsPrev ? 'rgba(255,255,255,0.92)' : 'var(--color-border-light)',
                                    boxShadow: canPageThumbsPrev ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: canPageThumbsPrev ? 'pointer' : 'default',
                                    fontSize: 14,
                                    lineHeight: 1,
                                    color: canPageThumbsPrev ? 'var(--color-ink)' : 'var(--color-muted-light)',
                }}
              >
                ‹
                  </button>

              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))`, gap: 8, flex: 1 }}>
{thumbnails.map((photo, i) => {
                    const photoIndex = thumbStart + i;
                    const isActive = activeIndex === photoIndex;
                    return (
                                          <button
                        key={photoIndex}
                        type="button"
                        onClick={() => { setActiveIndex(photoIndex); setEndCardHidden(false); }}
                        aria-label={`Show photo ${photoIndex + 1}`}
                                      style={{
                          position: 'relative',
                          height: perPage === PHONE_THUMBS_PER_PAGE ? 56 : 78,
                          borderRadius: 3,
                          overflow: 'hidden',
                          border: isActive ? '2px solid var(--color-ink)' : '2px solid transparent',
                          padding: 0,
                          cursor: 'pointer',
                          background: 'var(--color-border-light)',
}}
                    >
                      <Image src={photo} alt={`${altBase}, photo ${photoIndex + 1}`} fill sizes="120px" style={{ objectFit: 'cover' }} />
                      </button>
                  );
})}
  </div>

              <button
                type="button"
                onClick={pageThumbsNext}
                disabled={!canPageThumbsNext}
                aria-label="Show next thumbnails"
                style={{
                                    flex: '0 0 auto',
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: canPageThumbsNext ? 'rgba(255,255,255,0.92)' : 'var(--color-border-light)',
                                    boxShadow: canPageThumbsNext ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: canPageThumbsNext ? 'pointer' : 'default',
                                    fontSize: 14,
                                    lineHeight: 1,
                                    color: canPageThumbsNext ? 'var(--color-ink)' : 'var(--color-muted-light)',
                }}
              >
                ›
                  </button>
                  </div>
          )}
</>
      ) : tourEmbed ? (
        <div>
          <iframe
            src={tourEmbed}
            title={`Virtual tour of ${address}`}
            allow="fullscreen; xr-spatial-tracking; autoplay"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ width: '100%', height: 'clamp(260px, 46vw, 500px)', border: 0, borderRadius: 4, background: 'var(--color-border-light)' }}
          />
          <div className="tour-actions">
            <a href={virtualTourUrl} target="_blank" rel="noopener noreferrer">
              Open the tour full screen ↗
            </a>
            {tourButton && (
              <button type="button" className="btn btn-gold" onClick={() => scheduleTour()}>
                Like what you see? Schedule a Tour
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="tour-linkout">
          <div className="tour-linkout__title">Take the virtual tour of this home</div>
          <a className="btn btn-primary" href={virtualTourUrl} target="_blank" rel="noopener noreferrer">
            Open the virtual tour ↗
          </a>
          {tourButton && (
            <button type="button" className="tour-linkout__secondary" onClick={() => scheduleTour()}>
              Or schedule a private tour in person
            </button>
          )}
        </div>
      )}

      {viewerOpen && heroPhoto && (
        <PhotoViewer
          photo={heroPhoto}
          alt={`${altBase}, photo ${activeIndex + 1}`}
          index={activeIndex}
          total={total}
          onPrev={showPrevPhoto}
          onNext={showNextPhoto}
          onClose={closeViewer}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTour={
            tourButton
              ? () => {
                  closeViewer();
                  scheduleTour();
                }
              : null
          }
        />
      )}

      {virtualTourUrl && (
      <div style={{ display: 'flex', gap: 28, marginTop: 20, borderBottom: '1px solid var(--color-border-light)', paddingBottom: 14 }}>
        <button
          type="button"
          onClick={() => setTab('photos')}
          style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 14,
                        fontWeight: tab === 'photos' ? 600 : 500,
                        color: tab === 'photos' ? 'var(--color-ink)' : 'var(--color-muted-light)',
                        borderBottom: tab === 'photos' ? '2px solid var(--color-ink)' : '2px solid transparent',
                        paddingBottom: 10,
                        background: 'none',
                        border: 'none',
                        borderBottomWidth: 2,
                        cursor: 'pointer',
            }}
        >
          📷 Photos
            </button>
        <button
          type="button"
          onClick={() => setTab('tour')}
          style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 14,
                        fontWeight: tab === 'tour' ? 600 : 500,
                        color: tab === 'tour' ? 'var(--color-ink)' : 'var(--color-muted-light)',
                        borderBottom: tab === 'tour' ? '2px solid var(--color-ink)' : '2px solid transparent',
                        paddingBottom: 10,
                        background: 'none',
                        border: 'none',
                        borderBottomWidth: 2,
                        cursor: 'pointer',
          }}
        >
          ▶ Virtual Tour
            </button>
            </div>
      )}
            </div>
  );
}

/**
 * Full-screen photo viewer (2026-10-29, per Ryan). The whole photo, never
 * cropped, on black. MLS photos are 1024x768, so the photo is never drawn
 * wider than 1024px (Ryan: "we don't have to make the pictures too large if
 * it makes them look soft"). Arrows/counter/Schedule a Tour along the
 * bottom; swipe, ← → and Esc work too.
 */
function PhotoViewer({ photo, alt, index, total, onPrev, onNext, onClose, onTour, onTouchStart, onTouchEnd }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    }
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, onPrev, onNext]);

  // Portal to <body> so no parent's overflow/transform can clip it.
  return createPortal(
    <div className="photo-viewer" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}>
      <button type="button" className="photo-viewer__close" onClick={onClose} aria-label="Close photo viewer">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>
      <div className="photo-viewer__stage" onClick={(e) => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Image src={photo} alt={alt} fill sizes="(max-width: 1024px) 100vw, 1024px" quality={90} style={{ objectFit: 'contain' }} />
      </div>
      <div className="photo-viewer__bar" onClick={(e) => e.stopPropagation()}>
        {onTour ? (
          <button type="button" className="photo-viewer__tour" onClick={onTour}>
            Schedule a Tour
          </button>
        ) : (
          <span />
        )}
        {total > 1 && (
          <div className="photo-viewer__nav">
            <button type="button" onClick={onPrev} aria-label="Previous photo">
              ‹
            </button>
            <span>
              {index + 1} / {total}
            </span>
            <button type="button" onClick={onNext} aria-label="Next photo">
              ›
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
