import { notFound } from 'next/navigation';
import NeighborhoodListingsPage, { generateMetadata as generateNeighborhoodMetadata } from '../page';
import { neighborhoodViewPropertyType } from '@/lib/neighborhoodViews';

// Clean single-type neighborhood URLs (2026-10-05, per Ryan), e.g.
// /neighborhoods/aquarina/condos-for-sale. Renders the regular neighborhood
// page with the matching propertyType filter — see lib/neighborhoodViews.js.
// `__viewPropertyType` tells the page (and its FilterBar) the type comes
// from the path rather than the query string.
async function resolve(paramsPromise, searchParamsPromise) {
  const [{ slug, view }, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);
  const propertyType = neighborhoodViewPropertyType(slug, view);
  if (!propertyType) return null;
  return {
    params: Promise.resolve({ slug }),
    searchParams: Promise.resolve({ ...searchParams, propertyType, __viewPropertyType: propertyType }),
  };
}

export async function generateMetadata({ params, searchParams }) {
  const resolved = await resolve(params, searchParams);
  return resolved ? generateNeighborhoodMetadata(resolved) : {};
}

export default async function NeighborhoodViewPage({ params, searchParams }) {
  const resolved = await resolve(params, searchParams);
  if (!resolved) notFound();
  return NeighborhoodListingsPage(resolved);
}
