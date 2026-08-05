'use client';

import { useCallback, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS, PRICE_BANDS, BED_OPTIONS, BATH_OPTIONS } from '@/lib/constants';
import InquiryModals from './InquiryModals';

/**
 * Filter bar for listing pages: Property Type, Price, Beds, Baths,
 * Waterfront (conditional on the city's filter flags), Sort. Property Type
 * and Waterfront are multi-select checkboxes; the rest are single-select.
 * Filters are pushed to the URL query string, so the server component that
 * renders this page re-fetches filtered results on navigation.
 */
export default function FilterBar({
  waterfrontFlags,
  showZoning,
  hidePropertyType,
  propertyTypeOptions,
  hidePrice,
  priceBands,
  bedOptions,
  bathOptions,
  excludeWaterfrontOptions,
  hideWaterfront,
  extraActions,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openMenu, setOpenMenu] = useState(null);
  const closeTimer = useRef(null);

  const openNow = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 250);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const updateParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete('page'); // any filter change resets pagination
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const toggleMultiValue = (paramKey, value) => {
    const current = (searchParams.get(paramKey) || '').split(',').filter(Boolean);
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updateParams({ [paramKey]: next.join(',') });
  };

  const currentPropertyTypes = (searchParams.get('propertyType') || '').split(',').filter(Boolean);
  const currentWaterfront = (searchParams.get('waterfront') || '').split(',').filter(Boolean);
  const currentSort = searchParams.get('sort') || 'newest';
  const currentBeds = searchParams.get('beds') || '';
  const currentBaths = searchParams.get('baths') || '';
  const currentPriceMin = searchParams.get('priceMin') || '';
  const currentPriceMax = searchParams.get('priceMax') || '';

  const waterfrontOptions = [
    waterfrontFlags?.oceanfront && 'Oceanfront',
    waterfrontFlags?.riverfront && 'Riverfront',
  ].filter(Boolean).filter((opt) => !excludeWaterfrontOptions?.includes(opt));

  const effectivePriceBands = priceBands || PRICE_BANDS;
  const effectiveBedOptions = bedOptions || BED_OPTIONS;
  const effectiveBathOptions = bathOptions || BATH_OPTIONS;
  const effectivePropertyTypes = propertyTypeOptions || ['Home', 'Condo', 'Land'];

  return (
    <div
      className="container"
      style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '20px clamp(16px, 4vw, 56px)' }}
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      {!hidePropertyType && (
        <FilterTrigger
          label={currentPropertyTypes.length ? currentPropertyTypes.join(', ') : 'Property Type'}
          active={openMenu === 'propertyType'}
          onEnter={() => openNow('propertyType')}
        >
          {effectivePropertyTypes.map((pt) => (
            <Checkbox
              key={pt}
              label={pt === 'Home' ? 'Single-Family Homes' : pt === 'Condo' ? 'Condos/Townhomes' : 'Land'}
              checked={currentPropertyTypes.includes(pt)}
              onChange={() => toggleMultiValue('propertyType', pt)}
            />
          ))}
        </FilterTrigger>
      )}

      {!hidePrice && (
        <FilterTrigger
          label={currentPriceMin || currentPriceMax ? 'Price' : 'Price'}
          active={openMenu === 'price'}
          onEnter={() => openNow('price')}
        >
          {effectivePriceBands.map((band) => (
            <button
              key={band.label}
              type="button"
              className="btn btn-outline"
              style={{ width: '100%', marginBottom: 6, justifyContent: 'flex-start' }}
              onClick={() => updateParams({ priceMin: band.priceMin, priceMax: band.priceMax })}
            >
              {band.label}
            </button>
          ))}
        </FilterTrigger>
      )}

      <FilterTrigger label={currentBeds ? `${currentBeds}+ Beds` : 'Beds'} active={openMenu === 'beds'} onEnter={() => openNow('beds')}>
        {effectiveBedOptions.map((n) => (
          <button
            key={n}
            type="button"
            className="btn btn-outline"
            style={{ width: '100%', marginBottom: 6 }}
            onClick={() => updateParams({ beds: n })}
          >
            {n}+
          </button>
        ))}
      </FilterTrigger>

      <FilterTrigger label={currentBaths ? `${currentBaths}+ Baths` : 'Baths'} active={openMenu === 'baths'} onEnter={() => openNow('baths')}>
        {effectiveBathOptions.map((n) => (
          <button
            key={n}
            type="button"
            className="btn btn-outline"
            style={{ width: '100%', marginBottom: 6 }}
            onClick={() => updateParams({ baths: n })}
          >
            {n}+
          </button>
        ))}
      </FilterTrigger>

      {!hideWaterfront && waterfrontOptions.length > 0 && (
        <FilterTrigger
          label={currentWaterfront.length ? currentWaterfront.join(', ') : 'Waterfront'}
          active={openMenu === 'waterfront'}
          onEnter={() => openNow('waterfront')}
        >
          {waterfrontOptions.map((opt) => (
            <Checkbox
              key={opt}
              label={opt}
              checked={currentWaterfront.includes(opt)}
              onChange={() => toggleMultiValue('waterfront', opt)}
            />
          ))}
        </FilterTrigger>
      )}

      <FilterTrigger label="Sort" active={openMenu === 'sort'} onEnter={() => openNow('sort')}>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className="btn btn-outline"
            style={{
              width: '100%',
              marginBottom: 6,
              justifyContent: 'flex-start',
              background: currentSort === opt.value ? 'var(--color-bg)' : undefined,
            }}
            onClick={() => updateParams({ sort: opt.value })}
          >
            {opt.label}
          </button>
        ))}
      </FilterTrigger>

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          // Right-aligned (pinned to the far edge when it wraps to its own
          // line) on every page that has no extraActions — the original
          // Schedule a Showing/Ask a Question CTA placement. Pages that DO
          // pass extraActions (currently just Harbor Island Beach Club,
          // per Ryan 2026-08-05) instead get the whole button group
          // left-aligned, starting under Property Type on its own full-
          // width line, since a longer 4-button row reads better flush
          // left than pinned to the right edge.
          marginLeft: extraActions ? 0 : 'auto',
          width: extraActions ? '100%' : undefined,
        }}
      >
        {/* General "ask about this area" versions of the Property Detail
            page's Schedule a Showing / Ask a Question modals — no
            listingId, since no one listing is selected here (see
            InquiryModals.js and the backend's now-optional listingId on
            these two inquiry types). */}
        <InquiryModals
          containerStyle={{ display: 'flex', gap: 10 }}
          scheduleClassName="btn btn-success"
          questionClassName="btn btn-maroon"
        />

        {/* Optional page-specific extra CTA buttons/modals, e.g. Harbor
            Island Beach Club's Foreclosures/Property Management buttons
            (see app/neighborhoods/[slug]/page.js). Rendered in the same
            button group as Schedule a Showing/Ask a Question. */}
        {extraActions}
      </div>
    </div>
  );
}

function FilterTrigger({ label, children, active, onEnter }) {
  return (
    <div style={{ position: 'relative' }} onMouseEnter={onEnter}>
      <button
        type="button"
        onClick={onEnter}
        className="btn btn-outline"
        style={{ background: '#fff', textTransform: 'none', letterSpacing: 0, fontSize: 13 }}
      >
        {label} ▾
      </button>
      {active && (
        <div
          className="card"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 6,
            padding: 14,
            width: 220,
            boxShadow: 'var(--shadow-filter-menu)',
            zIndex: 35,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 8, cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 'auto' }} />
      {label}
    </label>
  );
}
