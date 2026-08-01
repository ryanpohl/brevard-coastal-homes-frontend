'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * Property Detail page's photo gallery: one large hero photo with a strip of
 * up to 6 thumbnails below it (click one to swap it into the hero slot),
 * plus a Photos / Virtual Tour tab pair — matches
 * design/design_files/Property Detail.dc.html. Virtual Tour has no backing
 * data yet (no MLS field for it), so that tab shows a placeholder instead of
 * crashing or silently doing nothing.
 */
export default function PropertyGallery({ photos = [], address }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tab, setTab] = useState('photos'); // 'photos' | 'tour'

  const hasPhotos = photos.length > 0;
  const heroPhoto = hasPhotos ? photos[Math.min(activeIndex, photos.length - 1)] : null;
  // Thumbnail strip is always photos[1..6] in their original order (design
  // shows exactly 6 slots) — clicking one swaps its photo into the hero
  // slot above rather than reshuffling the strip itself, the same pattern
  // ListingCard/other galleries on real estate sites use.
  const thumbnails = photos.slice(1, 7);
  const extraCount = photos.length - 7;

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
          </div>

          {thumbnails.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 8, marginTop: 8 }}>
              {thumbnails.map((photo, i) => {
                const photoIndex = i + 1; // offset for the slice(1, 7) above
                const isLast = i === thumbnails.length - 1;
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
                    {isLast && extraCount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(16,36,44,0.55)',
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        +{extraCount}
                      </div>
                    )}
                  </button>
                );
              })}
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
