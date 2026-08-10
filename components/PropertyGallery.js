'use client';

import Image from 'next/image';
import { useState } from 'react';

// Number of thumbnails shown per "page" of the strip below the hero photo.
const THUMBS_PER_PAGE = 6;

/**
 * Property Detail page's photo gallery: one large hero photo with left/right
 * arrow buttons to step through every photo, plus a paged strip of
 * thumbnails below it (its own left/right arrows page through the strip 6
 * at a time so all of a listing's photos are reachable, not just the first
 * 6) — matches design/design_files/Property Detail.dc.html, extended with
 * arrow navigation per Ryan (2026-08-10) so large photo counts (e.g. 70+)
 * are actually browsable instead of only the first 7 photos being reachable.
 * Plus a Photos / Virtual Tour tab pair. Virtual Tour has no backing data
 * yet (no MLS field for it), so that tab shows a placeholder instead of
 * crashing or silently doing nothing.
 */
export default function PropertyGallery({ photos = [], address }) {
    const [activeIndex, setActiveIndex] = useState(0);
    // Index of the first thumbnail visible in the current "page" of the strip.
  const [thumbStart, setThumbStart] = useState(0);
    const [tab, setTab] = useState('photos'); // 'photos' | 'tour'

  const hasPhotos = photos.length > 0;
    const total = photos.length;
    const heroPhoto = hasPhotos ? photos[Math.min(activeIndex, total - 1)] : null;

  // Thumbnail strip shows a THUMBS_PER_PAGE-wide window starting at
  // thumbStart; the page-arrows below shift that window without touching
  // which photo is active in the hero. Clicking a thumbnail sets the hero.
  const thumbnails = photos.slice(thumbStart, thumbStart + THUMBS_PER_PAGE);
    const canPageThumbsPrev = thumbStart > 0;
    const canPageThumbsNext = thumbStart + THUMBS_PER_PAGE < total;

  function syncThumbWindow(index) {
        setThumbStart(Math.floor(index / THUMBS_PER_PAGE) * THUMBS_PER_PAGE);
  }

  function showPrevPhoto() {
        if (total < 2) return;
        const next = (activeIndex - 1 + total) % total;
        setActiveIndex(next);
        syncThumbWindow(next);
  }

  function showNextPhoto() {
        if (total < 2) return;
        const next = (activeIndex + 1) % total;
        setActiveIndex(next);
        syncThumbWindow(next);
  }

  function pageThumbsPrev() {
        setThumbStart((s) => Math.max(0, s - THUMBS_PER_PAGE));
  }

  function pageThumbsNext() {
        setThumbStart((s) => Math.min(Math.max(0, total - THUMBS_PER_PAGE), s + THUMBS_PER_PAGE));
  }

  return (
        <div>
  {tab === 'photos' ? (
            <>
             <div
               style={{
                 position: 'relative',
                               width: '100%',
                               height: 'clamp(240px, 42vw, 460px)',
                               borderRadius: 4,
                               overflow: 'hidden',
                               background: 'var(--color-border-light)',
               }}
              >
   {heroPhoto ? (
                   <Image src={heroPhoto} alt={address} fill priority sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: 'cover' }} />
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
                      style={{
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
                     style={{
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 8, flex: 1 }}>
{thumbnails.map((photo, i) => {
                    const photoIndex = thumbStart + i;
                    const isActive = activeIndex === photoIndex;
                    return (
                                          <button
                        key={photoIndex}
                        type="button"
                        onClick={() => setActiveIndex(photoIndex)}
                        aria-label={`Show photo ${photoIndex + 1}`}
                                      style={{
                          position: 'relative',
                          height: 78,
                          borderRadius: 3,
                          overflow: 'hidden',
                          border: isActive ? '2px solid var(--color-ink)' : '2px solid transparent',
                          padding: 0,
                          cursor: 'pointer',
                          background: 'var(--color-border-light)',
}}
                    >
                      <Image src={photo} alt={`${address} photo ${photoIndex + 1}`} fill sizes="120px" style={{ objectFit: 'cover' }} />
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
      ) : (
                <div
                  style={{
                    width: '100%',
                                height: 'clamp(240px, 42vw, 460px)',
                                borderRadius: 4,
                                background: 'var(--color-border-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: 'var(--color-muted)',
                                fontSize: 14,
                                padding: 20,
                  }}
                >
                  Virtual tour not available for this listing yet.
        </div>
      )}

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
            </div>
  );
}
