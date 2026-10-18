import { notFound } from 'next/navigation';
import { REALTOR_PAGES } from '@/lib/realtorPages';
import { neighborhoodListingsFilter } from '@/lib/neighborhoodFilters';
import { getRecentlySold } from '@/lib/recentlySold';
import RealtorPage, { realtorMetadata } from '@/components/RealtorPage';

// "{Neighborhood} Realtor" page (2026-10-18, per Ryan) — see
// lib/realtorPages.js and components/RealtorPage.js.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = REALTOR_PAGES[slug];
  return page && page.kind === 'neighborhood' ? realtorMetadata(page) : {};
}

export default async function NeighborhoodRealtorPage({ params }) {
  const { slug } = await params;
  const page = REALTOR_PAGES[slug];
  if (!page || page.kind !== 'neighborhood') notFound();
  const filter = neighborhoodListingsFilter(slug, {});
  const stats = await getRecentlySold(filter);
  return <RealtorPage page={page} stats={stats} filter={filter} />;
}
