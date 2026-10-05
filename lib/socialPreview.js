import * as api from './api';

// Link previews (2026-10-05, per Ryan). Every page used to inherit
// app/layout.js's openGraph/twitter card, so a shared Adelaide or Cocoa
// Beach link showed "Brevard Coastal Homes", the generic site description
// and the hero photo. withSocialPreview copies a page's own title,
// description and canonical URL into its card; city and neighborhood pages
// also pass a current listing photo so the card shows a real home there.
// (Next.js replaces the whole openGraph object when a page sets one, so
// siteName/type are repeated here. Listing pages set their own card.)

export const DEFAULT_PREVIEW_IMAGE = {
  url: '/hero/brevard-hero-no-ship.jpg',
  width: 1200,
  height: 630,
  alt: 'Brevard Coastal Homes',
};

export function withSocialPreview(meta, photo) {
  if (!meta || !meta.title) return meta;
  const title = typeof meta.title === 'string' ? meta.title : meta.title.absolute || meta.title.default;
  const { description } = meta;
  const url = meta.alternates?.canonical;
  const images = [photo ? { url: photo, alt: title } : DEFAULT_PREVIEW_IMAGE];
  return {
    ...meta,
    openGraph: {
      type: 'website',
      siteName: 'Brevard Coastal Homes',
      title,
      ...(description && { description }),
      ...(url && { url }),
      images,
      ...meta.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      ...(description && { description }),
      images: images.map((image) => image.url),
      ...meta.twitter,
    },
  };
}

// First photo of the newest active listing matching a page's filter
// (rentals and the cheapest outliers skipped), or null.
export async function listingPreviewPhoto(filter) {
  try {
    const data = await api.getListings({ ...filter, priceMin: 100000, sort: 'newest', pageSize: 6 });
    const listing = (data.results || []).find((l) => l.photos && l.photos[0]);
    return listing ? listing.photos[0] : null;
  } catch {
    return null;
  }
}
