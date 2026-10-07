import MarketReport from '@/components/MarketReport';
import { MARKET_REPORTS, pctChange } from '@/lib/marketReports';
import { withSocialPreview } from '@/lib/socialPreview';

// Brevard County monthly market report hub (2026-10-07, per Ryan) — always
// the newest month in lib/marketReports.js; older months live at
// /market-report/{slug}.
const latest = MARKET_REPORTS[0];
const homePrice = pctChange(latest.homes.medianPrice);

export const metadata = withSocialPreview({
  title: `Brevard County Housing Market Report: ${latest.month} | Brevard Coastal Homes`,
  description: `Brevard County home values for ${latest.month}: median single-family price $${latest.homes.medianPrice[0].toLocaleString('en-US')} (${homePrice > 0 ? '+' : ''}${homePrice}% year over year), days on market, months of supply, and condo trends on the Space Coast.`,
  alternates: { canonical: '/market-report' },
});

export default function MarketReportPage() {
  return <MarketReport report={latest} />;
}
