import Link from 'next/link';
import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import { cityListingsQueryParams } from '@/lib/constants';
import { OPEN_HOUSE_CITIES, openHousePath } from '@/lib/openHousePages';
import { openHouseDayLabel } from '@/lib/openHouseLabel';
import { REALTOR_PAGES } from '@/lib/realtorPages';
import ListingCard from '@/components/ListingCard';
import OpenHouseEmailSignup from '@/components/OpenHouseEmailSignup';
import Faq from '@/components/Faq';

// "{City} Open Houses" page (2026-10-24, per Ryan) — every upcoming open
// house in the city from the MLS feed, grouped by day. A home open on both
// Saturday and Sunday appears under each day. See lib/openHousePages.js.
const SITE_URL = 'https://brevardcoastalhomes.com';
const MAX_PAGES = 5;

const heading = { fontSize: 24, margin: '36px 0 14px', color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 };

async function getOpenHouseListings(citySlug) {
  const filter = { ...cityListingsQueryParams(citySlug), openHouse: 1, pageSize: 100 };
  const listings = [];
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const data = await api.getListings({ ...filter, page });
      listings.push(...(data.results || []));
      if (!data.totalPages || page >= data.totalPages) break;
    }
  } catch {
    // Show the "no open houses yet" message rather than an error page.
  }
  return listings.filter((l) => l.status === 'Active' && l.openHouses?.length);
}

// [{ date, items: [{ listing, openHouse }] }], soonest day first, each day
// sorted by start time.
function groupByDay(listings) {
  const days = new Map();
  listings.forEach((listing) => {
    listing.openHouses.forEach((openHouse) => {
      if (!days.has(openHouse.date)) days.set(openHouse.date, []);
      days.get(openHouse.date).push({ listing, openHouse });
    });
  });
  return [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({
      date,
      items: items.sort((a, b) => (a.openHouse.start || '').localeCompare(b.openHouse.start || '')),
    }));
}

function faqItems(name) {
  return [
    {
      q: `Do I need an agent to go to a ${name} open house?`,
      a: `No — anyone can walk into an open house. Keep in mind the agent hosting it works for the seller. If you'd like your own agent there, call or text Ryan Pohl at 321-350-7661 and he can meet you at the open house to answer questions about the home, its price and recent sales nearby.`,
    },
    {
      q: `When are open houses in ${name} usually held?`,
      a: `Most ${name} open houses are on Saturdays and Sundays, usually late morning to early afternoon. Listing agents add new open houses during the week, and this page updates automatically from the Space Coast MLS.`,
    },
    {
      q: `Can I see a home if I can't make the open house?`,
      a: `Yes. Ryan can set up a private showing at a time that works for you — call or text 321-350-7661, or tap Schedule a Tour on any listing.`,
    },
  ];
}

export async function generateMetadata({ params }) {
  const { citySlug } = await params;
  const city = OPEN_HOUSE_CITIES[citySlug];
  if (!city) return {};
  return {
    title: `${city.name} Open Houses This Weekend | ${city.name}, FL Homes & Condos`,
    description: `Every upcoming open house in ${city.name}, FL — dates, times, prices and photos, updated daily from the MLS. Want an agent there? Call or text Ryan Pohl at 321-350-7661.`,
    alternates: { canonical: openHousePath(citySlug) },
  };
}

export default async function CityOpenHousesPage({ params }) {
  const { citySlug } = await params;
  const city = OPEN_HOUSE_CITIES[citySlug];
  if (!city) notFound();

  const listings = await getOpenHouseListings(citySlug);
  const days = groupByDay(listings);
  const realtorPage = Object.values(REALTOR_PAGES).find((p) => p.kind === 'city' && p.name === city.name);
  const path = openHousePath(citySlug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: `${city.name} Real Estate`, item: `${SITE_URL}/${citySlug}` },
      { '@type': 'ListItem', position: 3, name: `${city.name} Open Houses`, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', color: 'var(--color-muted-dark)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 12, color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
        {city.name} Open Houses
      </h1>
      <div style={{ maxWidth: 760, fontSize: 17, lineHeight: 1.65 }}>
        <p style={{ marginBottom: 12 }}>
          {listings.length > 0 ? (
            <>
              <strong style={{ color: 'var(--color-ink)' }}>
                {listings.length} {listings.length === 1 ? 'home has an open house' : 'homes have open houses'}
              </strong>{' '}
              coming up in {city.name}, FL, starting {openHouseDayLabel(days[0].date)}.{' '}
            </>
          ) : null}
          {city.blurb} Times come straight from the Space Coast MLS and update throughout the day.
        </p>
        <p className="open-house-page__cta">
          <strong>Want Ryan to meet you at an open house?</strong> Call or text{' '}
          <a href="tel:+13213507661">321-350-7661</a>.
        </p>
      </div>

      {days.length === 0 && (
        <p style={{ fontSize: 17, margin: '28px 0' }}>
          No open houses are scheduled in {city.name} yet — listing agents usually add them Thursday or Friday, so check back soon.{' '}
          <Link href={`/${citySlug}/homes-for-sale`} style={{ color: '#000', fontWeight: 600, textDecoration: 'underline' }}>
            See all {city.name} homes for sale →
          </Link>
        </p>
      )}

      {days.map(({ date, items }) => (
        <section key={date}>
          <h2 style={heading}>
            {openHouseDayLabel(date)}{' '}
            <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-muted)', marginLeft: 10 }}>
              {items.length} {items.length === 1 ? 'open house' : 'open houses'}
            </span>
          </h2>
          <div style={grid}>
            {items.map(({ listing, openHouse }, i) => (
              <ListingCard key={`${listing.id}-${openHouse.start}`} listing={listing} openHouse={openHouse} priority={date === days[0].date && i < 3} />
            ))}
          </div>
        </section>
      ))}

      <div style={{ maxWidth: 760, fontSize: 17, lineHeight: 1.65, marginTop: 40 }}>
        <OpenHouseEmailSignup townName={city.name} filter={cityListingsQueryParams(citySlug)} />
        <p style={{ margin: '28px 0' }}>
          <Link href={`/${citySlug}/homes-for-sale`} style={{ color: '#000', fontWeight: 600, textDecoration: 'underline' }}>
            All {city.name} homes for sale →
          </Link>
          {realtorPage && (
            <>
              <br />
              <Link href={realtorPage.path} style={{ color: '#000', fontWeight: 600, textDecoration: 'underline' }}>
                Work with Ryan, your {city.name} Realtor →
              </Link>
            </>
          )}
        </p>
        <Faq items={faqItems(city.name)} />
      </div>
    </div>
  );
}
