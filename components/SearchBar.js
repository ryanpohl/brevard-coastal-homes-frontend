'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PROPERTY_TYPE_TO_SLUG, BED_OPTIONS, BATH_OPTIONS } from '@/lib/constants';

/**
 * Home page hero search bar. Rebuilt to match the Claude Design mockup's
 * "hero search" component (design/design_files/Home.dc.html) — dark glass
 * pill buttons that each open a dropdown panel: City/Neighborhood (two-column
 * list, underlined headers), Property Type (checkboxes), Price (dual-handle
 * range slider + Min/Max selects), Beds, Baths — plus an address/MLS text
 * field, a Search button, and a Schedule a Showing button.
 *
 * The mockup's Beds/Baths lists and price labels were display-only (no
 * onClick/bound label in the exported prototype); here they're wired up for
 * real, since this is the production site, not a static mockup.
 */

const PRICE_STEPS = buildPriceSteps();

function buildPriceSteps() {
  const values = [];
  for (let v = 100000; v < 1000000; v += 50000) values.push(v);
  for (let v = 1000000; v <= 10000000; v += 1000000) values.push(v);
  return values.map((v) => ({
    value: v,
    label: v >= 1000000 ? `$${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1)}M` : `$${(v / 1000).toFixed(0)}K`,
  }));
}

function minLabelForIndex(idx) {
  if (idx <= 0) return 'No Min';
  return PRICE_STEPS[idx - 1].label;
}

function maxLabelForIndex(idx) {
  if (idx >= PRICE_STEPS.length) return 'No Max';
  return PRICE_STEPS[idx].label;
}

const BED_ITEMS = ['Any Beds', ...BED_OPTIONS.map((n) => `${n}+`)];
const BATH_ITEMS = ['Any Baths', ...BATH_OPTIONS.map((n) => `${n}+`)];

export default function SearchBar({ cities, neighborhoods }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null); // 'location' | 'propertyType' | 'price' | 'beds' | 'baths' | null
  const closeTimer = useRef(null);

  const [citySlug, setCitySlug] = useState('');
  const [neighborhoodSlug, setNeighborhoodSlug] = useState('');
  const [propertyTypes, setPropertyTypes] = useState(['Home', 'Condo', 'Land']);
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(PRICE_STEPS.length);
  const [searchValue, setSearchValue] = useState('');

  const trackRef = useRef(null);
  const draggingRef = useRef(null);
  const rangeRef = useRef({ min: 0, max: PRICE_STEPS.length });
  const formRef = useRef(null);

  const openNow = useCallback((key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  }, []);
  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 250);
  }, []);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Property Type and Price don't auto-close on selection (multi-select /
  // continuous controls), so give click/touch users a way to dismiss them
  // by clicking anywhere outside the search bar.
  useEffect(() => {
    if (!openMenu) return undefined;
    function handleDocClick(e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [openMenu]);

  const posToIndex = useCallback((clientX) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    return Math.round(percent * PRICE_STEPS.length);
  }, []);

  // Drag handling lives outside React state updates (via refs) so the
  // mousemove listener — registered once — always clamps against the
  // *other* handle's latest position without going stale.
  useEffect(() => {
    function handleMove(e) {
      if (!draggingRef.current) return;
      const idx = posToIndex(e.clientX);
      if (draggingRef.current === 'min') {
        const nextMin = Math.min(idx, rangeRef.current.max);
        rangeRef.current.min = nextMin;
        setMinIndex(nextMin);
      } else if (draggingRef.current === 'max') {
        const nextMax = Math.max(idx, rangeRef.current.min);
        rangeRef.current.max = nextMax;
        setMaxIndex(nextMax);
      }
    }
    function handleUp() {
      draggingRef.current = null;
    }
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [posToIndex]);

  function startDrag(which, e) {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = which;
  }

  function onMinSelectChange(e) {
    const idx = parseInt(e.target.value, 10);
    const nextMin = Math.min(idx, rangeRef.current.max);
    rangeRef.current.min = nextMin;
    setMinIndex(nextMin);
  }

  function onMaxSelectChange(e) {
    const idx = parseInt(e.target.value, 10);
    const nextMax = Math.max(idx, rangeRef.current.min);
    rangeRef.current.max = nextMax;
    setMaxIndex(nextMax);
  }

  function togglePropertyType(pt) {
    setPropertyTypes((prev) => (prev.includes(pt) ? prev.filter((p) => p !== pt) : [...prev, pt]));
  }

  function selectCity(slug) {
    setCitySlug(slug);
    setNeighborhoodSlug('');
    setOpenMenu(null);
  }

  function selectNeighborhood(slug) {
    setNeighborhoodSlug(slug);
    setCitySlug('');
    setOpenMenu(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!citySlug && !neighborhoodSlug) {
      // Nothing to route to yet — prompt the location picker instead of
      // silently doing nothing.
      openNow('location');
      return;
    }

    const params = new URLSearchParams();
    if (propertyTypes.length > 0 && propertyTypes.length < 3) {
      params.set('propertyType', propertyTypes.join(','));
    }
    if (minIndex > 0) params.set('priceMin', String(PRICE_STEPS[minIndex - 1].value));
    if (maxIndex < PRICE_STEPS.length) params.set('priceMax', String(PRICE_STEPS[maxIndex].value));
    if (beds) params.set('beds', beds);
    if (baths) params.set('baths', baths);

    const qs = params.toString();
    const primaryType = propertyTypes[0] || 'Home';

    if (neighborhoodSlug) {
      router.push(`/neighborhoods/${neighborhoodSlug}${qs ? `?${qs}` : ''}`);
    } else {
      router.push(`/${citySlug}/${PROPERTY_TYPE_TO_SLUG[primaryType]}${qs ? `?${qs}` : ''}`);
    }
  }

  const selectedCity = cities.find((c) => c.slug === citySlug);
  const selectedNeighborhood = neighborhoods.find((n) => n.slug === neighborhoodSlug);
  const locationLabel = selectedNeighborhood?.name || selectedCity?.name || 'City/Neighborhood';
  const bedsLabel = beds ? `${beds}+ Beds` : 'Beds';
  const bathsLabel = baths ? `${baths}+ Baths` : 'Baths';

  const minPercent = (minIndex / PRICE_STEPS.length) * 100;
  const maxPercent = (maxIndex / PRICE_STEPS.length) * 100;
  const maxPercentInverse = 100 - maxPercent;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      style={{ width: 'min(1000px, 92vw)', display: 'flex', flexDirection: 'column', gap: 12, margin: '0 auto' }}
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <PillField style={{ flex: 1 }} onMouseEnter={() => openNow('location')} onMouseLeave={scheduleClose}>
          <PillTrigger label={locationLabel} onClick={() => openNow('location')} />
          {openMenu === 'location' && (
            <div
              className="hero-search-panel"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 4,
                borderRadius: 4,
                padding: '26px 28px 30px',
                zIndex: 10,
                width: 620,
                maxWidth: '85vw',
              }}
            >
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <PanelHeading>Search by City</PanelHeading>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {cities.map((city) => (
                      <div
                        key={city.slug}
                        className="hero-search-item"
                        onClick={() => selectCity(city.slug)}
                        style={LIST_ITEM_STYLE}
                      >
                        {city.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <PanelHeading>Search by Neighborhood</PanelHeading>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {neighborhoods.map((hood) => (
                      <div
                        key={hood.slug}
                        className="hero-search-item"
                        onClick={() => selectNeighborhood(hood.slug)}
                        style={LIST_ITEM_STYLE}
                      >
                        {hood.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </PillField>

        <PillField style={{ flex: 1 }} onMouseEnter={() => openNow('propertyType')} onMouseLeave={scheduleClose}>
          <PillTrigger label="Property Type" onClick={() => openNow('propertyType')} />
          {openMenu === 'propertyType' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 4,
                background: '#ffffff',
                borderRadius: 4,
                boxShadow: '0 12px 32px rgba(0,0,0,0.32)',
                padding: 10,
                zIndex: 10,
                width: 'min(240px, 80vw)',
              }}
            >
              <PropertyTypeCheckbox
                label="Single-Family Homes"
                checked={propertyTypes.includes('Home')}
                onChange={() => togglePropertyType('Home')}
              />
              <PropertyTypeCheckbox
                label="Condos/Townhomes"
                checked={propertyTypes.includes('Condo')}
                onChange={() => togglePropertyType('Condo')}
              />
              <PropertyTypeCheckbox label="Land" checked={propertyTypes.includes('Land')} onChange={() => togglePropertyType('Land')} />
            </div>
          )}
        </PillField>

        <PillField
          style={{ flex: 1 }}
          onMouseEnter={() => openNow('price')}
          onMouseLeave={() => {
            if (!draggingRef.current) scheduleClose();
          }}
        >
          <PillTrigger label="Price" onClick={() => openNow('price')} />
          {openMenu === 'price' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 4,
                background: '#2b2723',
                borderRadius: 4,
                boxShadow: '0 12px 32px rgba(0,0,0,0.32)',
                padding: '22px 22px 24px',
                zIndex: 10,
              }}
            >
              <div ref={trackRef} style={{ position: 'relative', height: 4, background: '#6b6a66', borderRadius: 2, margin: '4px 6px 14px' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${minPercent}%`,
                    right: `${maxPercentInverse}%`,
                    background: '#ffffff',
                  }}
                />
                <div
                  onMouseDown={(e) => startDrag('min', e)}
                  style={{
                    position: 'absolute',
                    left: `${minPercent}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    zIndex: 2,
                  }}
                />
                <div
                  onMouseDown={(e) => startDrag('max', e)}
                  style={{
                    position: 'absolute',
                    left: `${maxPercent}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    zIndex: 2,
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#ffffff', marginBottom: 18 }}>
                <span>{minLabelForIndex(minIndex)}</span>
                <span>{maxLabelForIndex(maxIndex)}</span>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#ffffff', marginBottom: 8 }}>MIN</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1c1a17', border: '1px solid #55524c', borderRadius: 4, padding: '10px 12px' }}>
                    <span style={{ fontSize: 13, color: '#b9b6ae' }}>$</span>
                    <select
                      value={minIndex}
                      onChange={onMinSelectChange}
                      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontFamily: 'var(--font-body)', fontSize: 13, padding: 0 }}
                    >
                      <option value={0} style={{ color: '#1c2b30' }}>
                        No min
                      </option>
                      {PRICE_STEPS.map((p, i) => (
                        <option key={p.value} value={i + 1} style={{ color: '#1c2b30' }}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#ffffff', marginBottom: 8 }}>MAX</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1c1a17', border: '1px solid #55524c', borderRadius: 4, padding: '10px 12px' }}>
                    <span style={{ fontSize: 13, color: '#b9b6ae' }}>$</span>
                    <select
                      value={maxIndex}
                      onChange={onMaxSelectChange}
                      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontFamily: 'var(--font-body)', fontSize: 13, padding: 0 }}
                    >
                      {PRICE_STEPS.map((p, i) => (
                        <option key={p.value} value={i} style={{ color: '#1c2b30' }}>
                          {p.label}
                        </option>
                      ))}
                      <option value={PRICE_STEPS.length} style={{ color: '#1c2b30' }}>
                        No limit
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PillField>

        <PillField style={{ flex: 0.7 }} onMouseEnter={() => openNow('beds')} onMouseLeave={scheduleClose}>
          <PillTrigger label={bedsLabel} onClick={() => openNow('beds')} narrow />
          {openMenu === 'beds' && (
            <div className="hero-search-panel" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, borderRadius: 4, padding: '8px 0', zIndex: 10 }}>
              {BED_ITEMS.map((label, i) => {
                const value = i === 0 ? '' : String(BED_OPTIONS[i - 1]);
                return (
                  <div
                    key={label}
                    className="hero-search-item"
                    onClick={() => {
                      setBeds(value);
                      setOpenMenu(null);
                    }}
                    style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          )}
        </PillField>

        <PillField style={{ flex: 0.7 }} onMouseEnter={() => openNow('baths')} onMouseLeave={scheduleClose}>
          <PillTrigger label={bathsLabel} onClick={() => openNow('baths')} narrow />
          {openMenu === 'baths' && (
            <div className="hero-search-panel" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, borderRadius: 4, padding: '8px 0', zIndex: 10 }}>
              {BATH_ITEMS.map((label, i) => {
                const value = i === 0 ? '' : String(BATH_OPTIONS[i - 1]);
                return (
                  <div
                    key={label}
                    className="hero-search-item"
                    onClick={() => {
                      setBaths(value);
                      setOpenMenu(null);
                    }}
                    style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          )}
        </PillField>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(20, 35, 40, 0.55)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 4, padding: '0 18px', height: 66 }}>
          <span style={{ fontSize: 16, color: '#ffffff', marginRight: 12 }}>&#128269;</span>
          <input
            type="text"
            placeholder="Address, City, or MLS Number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="hero-search-input"
            style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 15, color: '#ffffff', background: 'transparent', padding: 0 }}
          />
          {searchValue.length > 0 && (
            <span
              style={{ fontSize: 16, color: '#ffffff', cursor: 'pointer', opacity: 0.75, marginLeft: 10 }}
              onClick={() => setSearchValue('')}
            >
              &#10005;
            </span>
          )}
        </div>
        <button
          type="submit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 34px',
            height: 66,
            background: 'var(--color-ink-dark)',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: '#ffffff',
          }}
        >
          Search
        </button>
        <Link
          href="/contact"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 22px',
            height: 66,
            cursor: 'pointer',
            border: '1px solid rgba(139, 38, 38, 0.7)',
            borderRadius: 4,
            background: 'rgba(139, 38, 38, 0.65)',
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: '#ffffff',
            textDecoration: 'none',
          }}
        >
          Schedule a Showing
        </Link>
      </div>
    </form>
  );
}

const LIST_ITEM_STYLE = {
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: 1,
  textTransform: 'uppercase',
  cursor: 'pointer',
};

function PillField({ children, style, onMouseEnter, onMouseLeave }) {
  return (
    <div style={{ position: 'relative', ...style }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
}

function PillTrigger({ label, onClick, narrow }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(20, 35, 40, 0.55)',
        border: '1px solid rgba(255,255,255,0.35)',
        borderRadius: 4,
        padding: narrow ? '0 14px' : '0 20px',
        height: 60,
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: '#ffffff',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 11, color: '#ffffff', marginLeft: 8, flexShrink: 0 }}>&#9662;</span>
    </div>
  );
}

function PanelHeading({ children }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 17,
        fontWeight: 700,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: '#ffffff',
        marginBottom: 16,
        textDecoration: 'underline',
      }}
    >
      {children}
    </div>
  );
}

function PropertyTypeCheckbox({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 6px', fontSize: 14, color: '#1c2b30', cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 'auto' }} />
      <span>{label}</span>
    </label>
  );
}
