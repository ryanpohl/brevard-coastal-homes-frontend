'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS, PRICE_BANDS, BED_OPTIONS, BATH_OPTIONS } from '@/lib/constants';
import InquiryModals from './InquiryModals';
import ScheduleShowingModal from './ScheduleShowingModal';

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
  neighborhoodOptions,
  show55Filter,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openMenu, setOpenMenu] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const closeTimer = useRef(null);
  const containerRef = useRef(null);

  const openNow = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };
  // Tapping/clicking a trigger button toggles it (open <-> closed), unlike
  // openNow above (hover-driven, always just opens — see the mobile fix
  // note below for why the distinction matters).
  const toggleOnClick = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu((current) => (current === key ? null : key));
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 250);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // Mobile filter-dropdown fix (2026-08-13, per Ryan: "dropdown menus...
  // don't seem to be working on mobile" — Property Type/Price/Beds/Baths/
  // Waterfront/Sort). Root cause: every path that CLOSES a menu depended on
  // onMouseLeave (scheduleClose above), which is real-mouse-only behavior.
  // Touchscreens have no cursor and therefore never fire a genuine
  // mouseleave after a tap — so once a menu opened (tapping a trigger does
  // fire its onClick, which used to just call openNow), nothing could ever
  // close it again: tapping the SAME trigger a second time just called
  // openNow(key) again, which is idempotent (already open, stays open), and
  // nothing was listening for taps elsewhere on the page either. The menu
  // would appear to get stuck open, blocking taps on whatever was
  // underneath it — reads exactly like "the dropdown menus aren't working."
  // Fixed with two device-agnostic mechanisms, neither of which depends on
  // hover: (1) the trigger's onClick now toggles instead of only opening
  // (toggleOnClick above), so tapping an already-open trigger closes it;
  // (2) this listens for any click/touchstart landing outside the whole
  // filter bar and closes whatever menu is open — covers tapping a listing
  // card, the map, or blank space to dismiss, same as clicking away does on
  // desktop. Desktop's existing hover-to-open/hover-out-to-close behavior
  // (openNow/scheduleClose/cancelClose) is left in place untouched.
  useEffect(() => {
    if (!openMenu) return undefined;
    function handleOutsideInteraction(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('click', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    return () => {
      document.removeEventListener('click', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, [openMenu]);

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

  const currentSubdivisions = (searchParams.get('subdivision') || '').split(',').filter(Boolean);
  const currentPropertyTypes = (searchParams.get('propertyType') || '').split(',').filter(Boolean);
  const currentWaterfront = (searchParams.get('waterfront') || '').split(',').filter(Boolean);
  const currentSort = searchParams.get('sort') || 'newest';
  const currentBeds = searchParams.get('beds') || '';
  const currentBaths = searchParams.get('baths') || '';
  const currentPriceMin = searchParams.get('priceMin') || '';
  const currentPriceMax = searchParams.get('priceMax') || '';
  // "55+ Communities" (2026-08-14, Viera West Homes/Condos only — see
  // show55Filter below). Tri-state, unlike everything else in this file:
  // 'include' (the default — param absent) applies no filter at all,
  // 'exclude' hides 55+ communities, 'only' shows just them. Mirrors the
  // backend's buildWhereClause in listings.controller.js exactly.
  const currentSeniorCommunity = searchParams.get('seniorCommunity') || 'include';

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
      ref={containerRef}
      className="container"
      style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '20px clamp(16px, 4vw, 56px)' }}
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      {/* Optional page-specific "Neighborhood" dropdown for sub-communities
          within one neighborhood page, e.g. Viera Builders Communities
          Viera West's Atlin Cove/Crossmolina/Farallon Fields/Laurasia/
          Pangea Park/Reeling Park (per Ryan, 2026-08-05). Placed before
          Property Type per Ryan's request. Multi-select checkboxes, same
          pattern as Property Type/Waterfront, driven by a `subdivision`
          URL param. See app/neighborhoods/[slug]/page.js. */}
      {neighborhoodOptions && neighborhoodOptions.length > 0 && (
        <FilterTrigger
          label={currentSubdivisions.length ? currentSubdivisions.join(', ') : 'Neighborhood'}
          active={openMenu === 'subdivision'}
          onEnter={() => openNow('subdivision')}
          onToggle={() => toggleOnClick('subdivision')}
        >
          {neighborhoodOptions.map((name) => (
            <Checkbox
              key={name}
              // Atlin Cove has no data yet (per Ryan, 2026-08-05, same
              // "(Coming Soon)" treatment as its entry in the "Communities"
              // nav dropdown — see lib/constants.js's
              // VIERA_BUILDERS_SUB_COMMUNITIES comingSoon flag). Only the
              // displayed label changes; the checkbox's value/URL param
              // stays the plain name so it still matches the backend's
              // subdivision filter correctly if a visitor checks it anyway.
              label={name === 'Atlin Cove' ? `${name} (Coming Soon)` : name}
              checked={currentSubdivisions.includes(name)}
              onChange={() => toggleMultiValue('subdivision', name)}
            />
          ))}
        </FilterTrigger>
      )}

      {!hidePropertyType && (
        <FilterTrigger
          label={currentPropertyTypes.length ? currentPropertyTypes.join(', ') : 'Property Type'}
          active={openMenu === 'propertyType'}
          onEnter={() => openNow('propertyType')}
          onToggle={() => toggleOnClick('propertyType')}
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
          onToggle={() => toggleOnClick('price')}
        >
          {effectivePriceBands.map((band) => (
            <button
              key={band.label}
              type="button"
              className="btn btn-outline filter-menu-option"
              style={{ width: '100%', marginBottom: 6, justifyContent: 'flex-start' }}
              onClick={() => updateParams({ priceMin: band.priceMin, priceMax: band.priceMax })}
            >
              {band.label}
            </button>
          ))}
        </FilterTrigger>
      )}

      <FilterTrigger
        label={currentBeds ? `${currentBeds}+ Beds` : 'Beds'}
        active={openMenu === 'beds'}
        onEnter={() => openNow('beds')}
        onToggle={() => toggleOnClick('beds')}
      >
        {effectiveBedOptions.map((n) => (
          <button
            key={n}
            type="button"
            className="btn btn-outline filter-menu-option"
            style={{ width: '100%', marginBottom: 6 }}
            onClick={() => updateParams({ beds: n })}
          >
            {n}+
          </button>
        ))}
      </FilterTrigger>

      <FilterTrigger
        label={currentBaths ? `${currentBaths}+ Baths` : 'Baths'}
        active={openMenu === 'baths'}
        onEnter={() => openNow('baths')}
        onToggle={() => toggleOnClick('baths')}
      >
        {effectiveBathOptions.map((n) => (
          <button
            key={n}
            type="button"
            className="btn btn-outline filter-menu-option"
            style={{ width: '100%', marginBottom: 6 }}
            onClick={() => updateParams({ baths: n })}
          >
            {n}+
          </button>
        ))}
      </FilterTrigger>

      {/* "55+ Communities" (2026-08-14, per Ryan) — Viera West Homes/Condos
          pages only, see show55Filter passed from
          app/[citySlug]/[propertySlug]/page.js. Placed here (between Baths
          and Waterfront/Sort) per Ryan's request to put it "between baths &
          sort" — Viera West never renders the Waterfront trigger below
          (waterfrontOptions is empty for it, see seed.js), so on the pages
          this actually shows on, it lands directly between Baths and Sort
          exactly as asked. Three mutually-exclusive radio options (not
          checkboxes, unlike Property Type/Waterfront/Neighborhood above) —
          Include/Don't show/Only show are inherently exclusive states, not
          independently toggleable ones. */}
      {show55Filter && (
        <FilterTrigger
          label="55+ Communities"
          active={openMenu === 'seniorCommunity'}
          onEnter={() => openNow('seniorCommunity')}
          onToggle={() => toggleOnClick('seniorCommunity')}
        >
          <RadioOption
            name="seniorCommunity"
            label="Include"
            checked={currentSeniorCommunity === 'include'}
            onChange={() => updateParams({ seniorCommunity: '' })}
          />
          <RadioOption
            name="seniorCommunity"
            label="Don't show"
            checked={currentSeniorCommunity === 'exclude'}
            onChange={() => updateParams({ seniorCommunity: 'exclude' })}
          />
          <RadioOption
            name="seniorCommunity"
            label="Only show"
            checked={currentSeniorCommunity === 'only'}
            onChange={() => updateParams({ seniorCommunity: 'only' })}
          />
        </FilterTrigger>
      )}

      {!hideWaterfront && waterfrontOptions.length > 0 && (
        <FilterTrigger
          label={currentWaterfront.length ? currentWaterfront.join(', ') : 'Waterfront'}
          active={openMenu === 'waterfront'}
          onEnter={() => openNow('waterfront')}
          onToggle={() => toggleOnClick('waterfront')}
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

      <FilterTrigger
        label="Sort"
        active={openMenu === 'sort'}
        onEnter={() => openNow('sort')}
        onToggle={() => toggleOnClick('sort')}
      >
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className="btn btn-outline filter-menu-option"
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
        {/* Schedule a Showing (per Ryan, 2026-08-06): opens the same
            dark "Call or Text" hero card + gold Make an Offer/Ask a
            Question buttons + inline Request Showing date-grid panel used
            on the homepage hero (SearchBar.js) and the Property Detail
            page's sidebar — see ScheduleShowingModal.js/
            PropertyContactPanel.js. No listingId — general "ask about
            this area" inquiry, same as the homepage's version. */}
        <button type="button" className="btn btn-success" onClick={() => setScheduleModalOpen(true)}>
          Schedule a Showing
        </button>

        {/* Ask a Question keeps its existing simpler modal (InquiryModals.js)
            — schedule button suppressed here since the button above now
            covers that. No listingId, since no one listing is selected here
            (see InquiryModals.js and the backend's now-optional listingId
            on these two inquiry types). */}
        <InquiryModals
          containerStyle={{ display: 'flex', gap: 10 }}
          scheduleClassName="btn btn-success"
          questionClassName="btn btn-maroon"
          showSchedule={false}
        />

        {/* Optional page-specific extra CTA buttons/modals, e.g. Harbor
            Island Beach Club's Foreclosures/Property Management buttons
            (see app/neighborhoods/[slug]/page.js). Rendered in the same
            button group as Schedule a Showing/Ask a Question. */}
        {extraActions}
      </div>

      {scheduleModalOpen && <ScheduleShowingModal onClose={() => setScheduleModalOpen(false)} />}
    </div>
  );
}

function FilterTrigger({ label, children, active, onEnter, onToggle }) {
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const [leftOffset, setLeftOffset] = useState(0);

  // Mobile overflow fix (2026-08-14, per Ryan: "make sure the website is
  // very mobile friendly"). The maxWidth clamp below (already in place)
  // only bounds the panel's OWN width — it doesn't stop the panel from
  // still running off the right edge of the screen when its trigger sits
  // far enough right in the wrapped filter row (measured up to 71px of
  // overflow on the Waterfront trigger at a 390px-wide viewport). This
  // measures the trigger's actual on-screen position each time the panel
  // opens and, only if the panel would overflow, shifts it left by just
  // enough to stay on-screen — otherwise it keeps the normal left-aligned
  // desktop position. useLayoutEffect (not useEffect) so this resolves
  // before the browser paints, avoiding a one-frame flash at the
  // overflowing position.
  useLayoutEffect(() => {
    if (!active) return;
    const wrap = wrapRef.current;
    const panel = panelRef.current;
    if (!wrap || !panel) return;
    const wrapRect = wrap.getBoundingClientRect();
    const margin = 16;
    const overflowRight = wrapRect.left + panel.offsetWidth - (window.innerWidth - margin);
    setLeftOffset(overflowRight > 0 ? -overflowRight : 0);
  }, [active]);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }} onMouseEnter={onEnter}>
      <button
        type="button"
        onClick={onToggle}
        className="btn btn-outline"
        style={{ background: '#fff', textTransform: 'none', letterSpacing: 0, fontSize: 13 }}
      >
        {label} ▾
      </button>
      {active && (
        <div
          ref={panelRef}
          className="card"
          style={{
            position: 'absolute',
            top: '100%',
            left: leftOffset,
            marginTop: 6,
            padding: 14,
            width: 220,
            // Defensive clamp added alongside the mobile toggle/click-outside
            // fix above: on a narrow phone viewport, a trigger that's
            // wrapped onto the right side of the filter row could otherwise
            // push this fixed-220px panel partly off-screen. maxWidth alone
            // (not switching to right:0) keeps the same left-aligned
            // desktop appearance when there's room, and only shrinks when
            // there isn't. Combined with the leftOffset shift above (2026-08-14)
            // for triggers positioned far enough right that width-shrinking
            // alone still wasn't enough to keep the panel on-screen.
            maxWidth: 'calc(100vw - 32px)',
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

// Radio-button equivalent of Checkbox below, for tri-state single-select
// filters (currently just "55+ Communities" — see show55Filter above).
// Deliberately kept as a near-identical clone of Checkbox's exact
// JSX/className/padding/margin rather than a shared generic component:
// the two differ only in <input type>, and Checkbox is a well-established
// pattern already reused in four places above — safer to duplicate a few
// lines than risk an unrelated regression by refactoring it.
function RadioOption({ label, name, checked, onChange }) {
  return (
    <label
      className="filter-menu-option"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        padding: '4px 6px',
        margin: '-4px -6px 4px -6px',
        borderRadius: 'var(--radius-btn)',
        cursor: 'pointer',
      }}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} style={{ width: 'auto' }} />
      {label}
    </label>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label
      className="filter-menu-option"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        // Padding + negative margin (margin shorthand includes the 4px
        // bottom gap that used to be a separate marginBottom: 8 — don't
        // add marginBottom back alongside this, the shorthand overwrites
        // it) so the hover highlight (see .filter-menu-option in
        // globals.css) fills a proper row instead of just tightly hugging
        // the checkbox+text, while keeping the text in the same visual
        // position it was in before this was added.
        padding: '4px 6px',
        margin: '-4px -6px 4px -6px',
        borderRadius: 'var(--radius-btn)',
        cursor: 'pointer',
      }}
    >
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 'auto' }} />
      {label}
    </label>
  );
}
