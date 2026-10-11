// Monthly payment estimates for the mortgage calculator (2026-10-11, per
// Ryan) — components/MortgageCalculator.js, used on listing pages and at
// /mortgage-calculator. Every default here is a deliberately conservative,
// editable estimate (Ryan chose percentages over fixed dollar figures);
// the calculator labels them as estimates and links to the buyer guides.

// Example rate only — rates move daily; visitors type their own.
export const DEFAULT_RATE = 6.5;
export const DEFAULT_TERM_YEARS = 30;
export const DEFAULT_DOWN_PERCENT = 20;

// Property taxes after a purchase: the assessment resets to roughly the
// sale price the year after closing, so the seller's bill is no guide.
// ~1.5% of price is a conservative Brevard estimate for a homesteaded
// home at current millage (property-taxes guide: millage varies by city
// and district; homestead takes up to $50,000 off taxable value).
export const TAX_RATE = 0.015;

// Homeowners insurance, % of price per year. Houses carry a full policy
// (wind included); older houses (25+ years) usually cost more to insure
// (4-point inspection, roof age). Condo owners insure only the unit's
// interior and belongings; the building is insured through the HOA fee.
export const INSURANCE_RATE = { house: 0.01, olderHouse: 0.013, condo: 0.003 };
export const OLDER_HOUSE_AGE = 25;

// Flood insurance (optional), yearly averages by FEMA zone — the same
// figures the flood-insurance guide cites (NFIP statewide averages).
export const FLOOD_BY_ZONE = { X: 637, A: 1313, V: 2413 };

// Private mortgage insurance when the down payment is under 20%, as a %
// of the loan per year (a conservative middle of the usual range).
export const PMI_RATE = 0.006;

export const FEE_MONTHS = { Monthly: 1, Quarterly: 3, 'Semi-Annually': 6, Annually: 12, Weekly: 12 / 52 };

export function monthlyHoa(fee, frequency) {
  const months = FEE_MONTHS[frequency];
  if (!(fee > 0) || !months) return 0;
  return Math.round(fee / months);
}

export function homeKind(propertyType, yearBuilt, now = new Date().getFullYear()) {
  if (propertyType === 'Condo') return 'condo';
  if (yearBuilt && now - yearBuilt >= OLDER_HOUSE_AGE) return 'olderHouse';
  return 'house';
}

export function defaultTaxes(price) {
  return Math.round((price || 0) * TAX_RATE);
}

export function defaultInsurance(price, kind) {
  return Math.round((price || 0) * (INSURANCE_RATE[kind] || INSURANCE_RATE.house));
}

export function principalAndInterest(loan, ratePercent, years) {
  if (!(loan > 0) || !(years > 0)) return 0;
  const r = ratePercent / 100 / 12;
  const n = years * 12;
  if (r === 0) return loan / n;
  return (loan * r) / (1 - Math.pow(1 + r, -n));
}

// All amounts yearly except hoa (monthly). Returns monthly figures.
export function monthlyBreakdown({ price, downPercent, ratePercent, years, taxesYear, insuranceYear, floodYear, hoaMonth }) {
  const down = Math.max(0, Math.min(100, downPercent || 0));
  const loan = (price || 0) * (1 - down / 100);
  const pi = principalAndInterest(loan, ratePercent || 0, years);
  const pmi = down < 20 && loan > 0 ? (loan * PMI_RATE) / 12 : 0;
  const parts = {
    pi,
    taxes: (taxesYear || 0) / 12,
    insurance: (insuranceYear || 0) / 12,
    flood: (floodYear || 0) / 12,
    hoa: hoaMonth || 0,
    pmi,
  };
  const total = Object.values(parts).reduce((a, b) => a + b, 0);
  return { loan, downAmount: (price || 0) - loan, parts, total };
}
