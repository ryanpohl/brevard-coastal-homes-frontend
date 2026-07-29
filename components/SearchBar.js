'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PROPERTY_TYPE_TO_SLUG, PRICE_BANDS } from '@/lib/constants';

export default function SearchBar({ cities, neighborhoods }) {
  const router = useRouter();
  const [citySlug, setCitySlug] = useState('');
  const [neighborhoodSlug, setNeighborhoodSlug] = useState('');
  const [propertyTypes, setPropertyTypes] = useState(['Home']);
  const [priceBand, setPriceBand] = useState('');

  function togglePropertyType(pt) {
    setPropertyTypes((prev) => (prev.includes(pt) ? prev.filter((p) => p !== pt) : [...prev, pt]));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const primaryType = propertyTypes[0] || 'Home';
    const params = new URLSearchParams();
    if (propertyTypes.length > 1) params.set('propertyType', propertyTypes.join(','));

    const band = PRICE_BANDS.find((b) => b.label === priceBand);
    if (band) {
      if (band.priceMin) params.set('priceMin', band.priceMin);
      if (band.priceMax) params.set('priceMax', band.priceMax);
    }

    const qs = params.toString();

    if (neighborhoodSlug) {
      router.push(`/neighborhoods/${neighborhoodSlug}${qs ? `?${qs}` : ''}`);
    } else if (citySlug) {
      router.push(`/${citySlug}/${PROPERTY_TYPE_TO_SLUG[primaryType]}${qs ? `?${qs}` : ''}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        padding: 16,
        marginTop: -56,
        position: 'relative',
        zIndex: 5,
        boxShadow: 'var(--shadow-filter-menu)',
      }}
    >
      <select value={citySlug} onChange={(e) => { setCitySlug(e.target.value); setNeighborhoodSlug(''); }} style={{ flex: '1 1 160px' }}>
        <option value="">Any City</option>
        {cities.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select value={neighborhoodSlug} onChange={(e) => { setNeighborhoodSlug(e.target.value); setCitySlug(''); }} style={{ flex: '1 1 160px' }}>
        <option value="">Any Neighborhood</option>
        {neighborhoods.map((n) => (
          <option key={n.slug} value={n.slug}>
            {n.name}
          </option>
        ))}
      </select>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: '1 1 220px', fontSize: 12 }}>
        {['Home', 'Condo', 'Land'].map((pt) => (
          <label key={pt} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={propertyTypes.includes(pt)} onChange={() => togglePropertyType(pt)} style={{ width: 'auto' }} />
            {pt}
          </label>
        ))}
      </div>

      <select value={priceBand} onChange={(e) => setPriceBand(e.target.value)} style={{ flex: '1 1 160px' }}>
        <option value="">Any Price</option>
        {PRICE_BANDS.map((b) => (
          <option key={b.label} value={b.label}>
            {b.label}
          </option>
        ))}
      </select>

      <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto' }}>
        Search
      </button>
    </form>
  );
}
