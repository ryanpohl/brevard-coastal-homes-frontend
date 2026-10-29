import Link from 'next/link';
import ListingCard from '@/components/ListingCard';

// "More Homes in {community}" at the bottom of a listing page (2026-10-29,
// per Ryan — like corcoran.com's "Community Portrait"): a link to the
// community (or city) page plus up to 4 other active homes there, so a
// visitor who finishes a listing keeps browsing, and every listing links to
// its community page. Picked by property type first, then closest price.
const COUNT = 4;

export function pickMoreHomes(listing, results) {
  return results
    .filter((l) => l.id !== listing.id && l.status === 'Active')
    .sort((a, b) => {
      const typeA = a.propertyType === listing.propertyType ? 0 : 1;
      const typeB = b.propertyType === listing.propertyType ? 0 : 1;
      return typeA - typeB || Math.abs(a.price - listing.price) - Math.abs(b.price - listing.price);
    })
    .slice(0, COUNT);
}

export default function MoreHomesNearby({ area, homes }) {
  if (!area || !homes.length) return null;
  return (
    <section className="more-homes">
      <div className="more-homes__head">
        <h2>More Homes in {area.name}</h2>
        <Link href={area.path} className="more-homes__link">
          See all {area.name} homes for sale →
        </Link>
      </div>
      <div className="more-homes__grid">
        {homes.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  );
}
