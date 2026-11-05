import { notFound } from 'next/navigation';
import { REALTOR_PAGES } from '@/lib/realtorPages';
import { cityListingsQueryParams } from '@/lib/constants';
import { getRecentlySold } from '@/lib/recentlySold';
import RealtorPage, { realtorMetadata } from '@/components/RealtorPage';
import * as api from '@/lib/api';

// "{City} Realtor" page (2026-10-18, per Ryan: Melbourne Beach first, for
// sellers) — see lib/realtorPages.js and components/RealtorPage.js.
export async function generateMetadata({ params }) {
  const { citySlug } = await params;
  const page = REALTOR_PAGES[citySlug];
  return page && page.kind === 'city' ? realtorMetadata(page) : {};
}

export default async function CityRealtorPage({ params }) {
  const { citySlug } = await params;
  const page = REALTOR_PAGES[citySlug];
  if (!page || page.kind !== 'city') notFound();
  const filter = cityListingsQueryParams(citySlug);
  // 12-month selling pace for the seller FAQ (2026-11-05).
  const [stats, pace] = await Promise.all([
    getRecentlySold(filter),
    api.getSoldStats({ ...filter, propertyType: 'Home', includePrior: 1 }).catch(() => null),
  ]);
  return <RealtorPage page={page} stats={stats} filter={filter} pace={pace} />;
}
