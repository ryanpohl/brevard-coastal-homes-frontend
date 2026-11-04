import { MARKET_REPORTS, MARKET_REPORT_SOURCE, sectionSummary } from '@/lib/marketReports';

// The newest monthly market report as JSON (2026-11-04, per Ryan: email it
// to everyone who signed up on the site each month). The backend reads this
// to send the email (src/services/marketReportEmail.service.js), so a new
// month only needs adding to lib/marketReports.js.
export const dynamic = 'force-static';

export function GET() {
  const report = MARKET_REPORTS[0];
  return Response.json({
    ...report,
    source: report.source || MARKET_REPORT_SOURCE,
    url: `/market-report/${report.slug}`,
    summaries: { homes: sectionSummary(report, 'homes'), condos: sectionSummary(report, 'condos') },
  });
}
