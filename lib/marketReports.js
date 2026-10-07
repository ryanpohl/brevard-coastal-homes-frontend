// Monthly Brevard County market reports (2026-10-07, per Ryan). Figures come
// from Florida REALTORS® monthly statistics, which Ryan sends as a screenshot
// around the third week of each month. Add each new month at the TOP of
// MARKET_REPORTS; /market-report always shows the first entry and every
// month keeps its own page at /market-report/{slug}.
//
// Each section stores this month's value and the same month a year
// earlier; percentage changes are calculated from those pairs.
export const MARKET_REPORTS = [
  {
    slug: '2026-08',
    month: 'August 2026',
    priorMonth: 'August 2025',
    published: '2026-09-20',
    homes: {
      medianPrice: [376018, 369715],
      sold: [853, 890],
      daysOnMarket: [40, 54],
      monthsSupply: [3.5, 4.5],
    },
    condos: {
      medianPrice: [270000, 265000],
      sold: [214, 193],
      daysOnMarket: [61, 79],
      monthsSupply: [5.8, 8.0],
    },
  },
];

export const MARKET_REPORT_SOURCE =
  'Statistics produced by Florida REALTORS® with data provided by Florida’s multiple listing services. Statistics for each month are compiled from MLS feeds on the 10th day of the following month and released between the 15th and 20th of each month.';

export function getMarketReport(slug) {
  return MARKET_REPORTS.find((r) => r.slug === slug) || null;
}

export function pctChange([current, prior]) {
  if (!prior) return null;
  return Math.round(((current - prior) / prior) * 1000) / 10;
}

function money(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function changeWords(pct, up, down) {
  if (pct == null || pct === 0) return 'held steady';
  return `${pct > 0 ? up : down} ${Math.abs(pct)}%`;
}

// Plain-English summary of one section, e.g. "The median single-family home
// price rose 1.7% year over year to $376,018 ..."
export function sectionSummary(report, key) {
  const s = report[key];
  const kind = key === 'homes' ? 'single-family home' : 'condo and townhome';
  const unit = key === 'homes' ? 'homes' : 'units';
  const price = pctChange(s.medianPrice);
  const sold = pctChange(s.sold);
  const dom = s.daysOnMarket;
  const supply = s.monthsSupply;
  const faster = dom[0] < dom[1];
  return (
    `In ${report.month}, Brevard County’s median ${kind} sale price ${changeWords(price, 'rose', 'fell')} from ${report.priorMonth} to ${money(s.medianPrice[0])}, ` +
    `and ${s.sold[0].toLocaleString('en-US')} ${unit} sold (${changeWords(sold, 'up', 'down')}). ` +
    `${key === 'homes' ? 'Homes' : 'Condos and townhomes'} sold ${faster ? 'faster' : 'more slowly'}, with a median of ${dom[0]} days on market versus ${dom[1]} a year earlier, ` +
    `and inventory stood at ${Number(supply[0]).toFixed(1)} months of supply, ${supply[0] < supply[1] ? 'down' : 'up'} from ${Number(supply[1]).toFixed(1)}.`
  );
}
