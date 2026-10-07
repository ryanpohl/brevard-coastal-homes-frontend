import { notFound } from 'next/navigation';
import MarketReport from '@/components/MarketReport';
import { MARKET_REPORTS, getMarketReport, pctChange } from '@/lib/marketReports';
import { withSocialPreview } from '@/lib/socialPreview';

// One month's Brevard County market report (2026-10-07). The newest month
// is also shown at /market-report, so its own page points search engines
// there; older months are canonical on their own URLs.
export function generateStaticParams() {
  return MARKET_REPORTS.map((r) => ({ month: r.slug }));
}

export async function generateMetadata({ params }) {
  const { month } = await params;
  const report = getMarketReport(month);
  if (!report) return {};
  const homePrice = pctChange(report.homes.medianPrice);
  return withSocialPreview({
    title: `Brevard County Housing Market Report: ${report.month} | Brevard Coastal Homes`,
    description: `Brevard County home values for ${report.month}: median single-family price $${report.homes.medianPrice[0].toLocaleString('en-US')} (${homePrice > 0 ? '+' : ''}${homePrice}% year over year), days on market, months of supply, and condo trends.`,
    alternates: { canonical: report.slug === MARKET_REPORTS[0].slug ? '/market-report' : `/market-report/${report.slug}` },
  });
}

export default async function MarketReportMonthPage({ params }) {
  const { month } = await params;
  const report = getMarketReport(month);
  if (!report) notFound();
  return <MarketReport report={report} />;
}
