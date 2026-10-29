// Key Features row on listing pages (2026-10-29, per Ryan — step 2; like
// corcoran.com's Key Features, kept to one short row). Turns the MLS
// details the backend saves (listing.features: { standard, custom }, see
// the backend's listingFeatures.service.js) into at most MAX short labels,
// most important first. Option wording ("Ocean Front", "Gated with Guard",
// "Pool Private YN") was checked against 350 live listings on 2026-10-29.

// Five fit on one row at common laptop/desktop widths (six wrapped at
// 1280px); phones wrap regardless.
const MAX = 5;

const list = (v) => (v == null || v === '' ? [] : String(v).split(',').map((s) => s.trim()).filter(Boolean));

function reader(features) {
  const std = features?.standard || {};
  const custom = features?.custom || {};
  // RESO name in StandardFields, or the board's spaced name in CustomFields.
  const get = (stdName, customName) => std[stdName] ?? custom[customName ?? stdName.replace(/([a-z])([A-Z])/g, '$1 $2')];
  const yes = (stdName, customName) => {
    const v = get(stdName, customName);
    return v === true || v === 'Yes';
  };
  const has = (stdName, option, customName) => list(get(stdName, customName)).includes(option);
  return { get, yes, has };
}

const FRONTAGE = [
  ['Ocean Front', 'Oceanfront'],
  ['River Front', 'Riverfront'],
  ['Intracoastal', 'Intracoastal Waterfront'],
  ['Canal Front', 'Canalfront'],
  ['Lake Front', 'Lakefront'],
];
const VIEWS = [
  ['Ocean', 'Ocean View'],
  ['Intracoastal', 'Intracoastal View'],
  ['River', 'River View'],
  ['Lake', 'Lake View'],
  ['Golf Course', 'Golf Course View'],
  ['Protected Preserve', 'Preserve View'],
];

/** Up to MAX labels for a listing, or [] when there's nothing to show. */
export function keyFeatureLabels(listing) {
  if (!listing?.features) return [];
  const { get, yes, has } = reader(listing.features);
  const labels = [];
  const add = (label) => label && !labels.includes(label) && labels.push(label);
  const isHome = listing.propertyType === 'Home';

  // Water: frontage first, else the best view (a golf view is covered by
  // "On the Golf Course" below when the lot is on the course).
  const onGolf = has('LotFeatures', 'On Golf Course');
  const frontage = FRONTAGE.find(([opt]) => has('WaterfrontFeatures', opt));
  if (frontage) add(frontage[1]);
  else add(VIEWS.find(([opt, label]) => has('View', opt) && !(onGolf && label === 'Golf Course View'))?.[1]);

  // Private pool (and spa). Pool Features can describe a community pool
  // (condos, HOA communities), so the board's Pool Private YN decides when
  // it's set; pool options only count when it isn't.
  const poolOpts = list(get('PoolFeatures'));
  const poolPrivate = get('PoolPrivateYN');
  const privatePool =
    poolPrivate != null ? yes('PoolPrivateYN') : poolOpts.includes('In Ground') || poolOpts.includes('Above Ground');
  if (privatePool) {
    const heated = poolOpts.some((o) => /heat/i.test(o));
    const salt = poolOpts.includes('Salt Water');
    const spaOpts = list(get('SpaFeatures'));
    const spa = spaOpts.includes('Private') || (spaOpts.length > 0 && !spaOpts.includes('Community'));
    add(`${heated ? 'Heated ' : ''}${salt ? 'Saltwater ' : ''}Pool${spa ? ' & Spa' : ''}`);
  }

  // Boating.
  const dock = has('ExteriorFeatures', 'Dock') || has('ExteriorFeatures', 'Boat Slip');
  const lift = has('ExteriorFeatures', 'Boat Lift');
  if (dock && lift) add('Dock & Boat Lift');
  else if (dock) add('Private Dock');
  else if (lift) add('Boat Lift');
  if (has('WaterfrontFeatures', 'No Fixed Bridges')) add('No Fixed Bridges');

  // Beach access, when it isn't already oceanfront.
  if (!frontage || frontage[1] !== 'Oceanfront') {
    if (has('WaterfrontFeatures', 'Deeded Beach Access')) add('Deeded Beach Access');
    else if (has('AssociationAmenities', 'Beach Access')) add('Beach Access');
  }

  if (onGolf) add('On the Golf Course');

  // Gate.
  if (has('SecurityFeatures', 'Gated with Guard')) add('Guard-Gated');
  else if (
    get('Gated') ||
    has('CommunityFeatures', 'Gated') ||
    has('AssociationAmenities', 'Gated') ||
    has('SecurityFeatures', 'Security Gate')
  )
    add('Gated Community');

  if (yes('SeniorCommunityYN')) add('55+ Community');
  if (yes('NewConstructionYN')) add('New Construction');

  const garage = Number(get('GarageSpaces'));
  if (garage >= 1 && garage <= 10) add(`${garage}-Car Garage`);

  if (has('ExteriorFeatures', 'Impact Windows')) add('Impact Windows');
  else if (has('ExteriorFeatures', 'Storm Shutters')) add('Storm Shutters');

  if (isHome && has('InteriorFeatures', 'Elevator')) add('Private Elevator');
  // "Primary downstairs" only means something in a home with stairs.
  const levels = String(get('Levels') || '');
  if (isHome && /two|three/i.test(levels) && has('InteriorFeatures', 'Primary Downstairs')) add('Main-Floor Primary Suite');
  if (has('InteriorFeatures', 'In-Law Floorplan')) add('In-Law Suite');
  else if (has('InteriorFeatures', 'Guest Suite')) add('Guest Suite');
  if (has('ExteriorFeatures', 'Outdoor Kitchen')) add('Outdoor Kitchen');
  if (has('LotFeatures', 'Cul-De-Sac')) add('Cul-de-Sac Lot');

  return labels.slice(0, MAX);
}
