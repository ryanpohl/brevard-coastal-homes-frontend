import Link from 'next/link';

// Breadcrumb trail at the top of a listing page (2026-10-29, per Ryan, like
// corcoran.com): Home › City › Community › street. `items` is
// [{ name, href }], the last one (the home itself) without an href. The
// matching BreadcrumbList JSON-LD lets Google show the trail in results.
export default function ListingBreadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="listing-breadcrumbs">
      <ol>
        {items.map((item, i) => (
          <li key={item.name + i}>
            {item.href ? <Link href={item.href}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function breadcrumbJsonLd(items, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.href && { item: `${siteUrl}${item.href === '/' ? '' : item.href}` }),
    })),
  };
}
