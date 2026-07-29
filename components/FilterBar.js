'use client';

import { useCallback, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS, PRICE_BANDS, BED_OPTIONS, BATH_OPTIONS } from '@/lib/constants';

/**
 * Filter bar for listing pages: Property Type, Price, Beds, Baths,
 * Waterfront (conditional on the city's filter flags), Sort. Property Type
 * and Waterfront are multi-select checkboxes; the rest are single-select.
 * Filters are pushed to the URL query string, so the server component that
 * renders this page re-fetches filtered results on navigation.
 */
export default function FilterBar({ waterfrontFlags, showZoning }) {
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
  ].filter(Boolean);

  return (
    <div
      className="container"
      style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '20px clamp(16px, 4vw, 56px)' }}
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      <FilterTrigger
        label={currentPropertyTypes.length ? currentPropertyTypes.join(', ') : 'Property Type'}
        active={openMenu === 'propertyType'}
        onEnter={() => openNow('propertyType')}
      >
        {['Home', 'Condo', 'Land'].map((pt) => (
          <Checkbox
            key={pt}
            label={pt === 'Home' ? 'Single-Family Homes' : pt === 'Condo' ? 'Condos/Townhomes' : 'Land'}
            checked={currentPropertyTypes.includes(pt)}
            onChange={() => toggleMultiValue('propertyType', pt)}
          />
        ))}
      </FilterTrigger>

      <FilterTrigger
        label={currentPriceMin || currentPriceMax ? 'Price' : 'Price'}
        active={openMenu === 'price'}
        onEnter={() => openNow('price')}
      >
        {PRICE_BANDS.map((band) => (
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

      <FilterTrigger label={currentBeds ? `${currentBeds}+ Beds` : 'Beds'} active={openMenu === 'beds'} onEnter={() => openNow('beds')}>
        {BED_OPTIONS.map((n) => (
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
        {BATH_OPTIONS.map((n) => (
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

      {waterfrontOptions.length > 0 && (
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
