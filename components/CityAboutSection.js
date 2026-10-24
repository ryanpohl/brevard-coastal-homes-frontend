import Link from 'next/link';
import { formatPrice, cityListingsQueryParams } from '@/lib/constants';
import SoldReportSignup from '@/components/SoldReportSignup';
import { REALTOR_PAGES } from '@/lib/realtorPages';
import { OPEN_HOUSE_CITIES, openHousePath } from '@/lib/openHousePages';

// "About {city} …" section for CITY_PAGE_SEO pages (2026-10-03) — page-
// specific copy, a live market snapshot, an agent line, and links to the
// city's other listing pages, neighborhoods and Area Guide (minus the
// current page). Shared by app/[citySlug]/page.js and
// app/[citySlug]/[propertySlug]/page.js.
export default function CityAboutSection({ config, page, currentPath, snapshot }) {
  const updated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  });
  const links = config.relatedLinks.filter((l) => l.href !== currentPath);
  const citySlug = currentPath.split('/')[1];
  // This city's Realtor page, if it has one (lib/realtorPages.js).
  const realtorPage = Object.values(REALTOR_PAGES).find((p) => p.kind === 'city' && p.name === config.name);
  return (
    <section
      className="container"
      style={{
        padding: '0 clamp(16px, 4vw, 56px) 48px',
        maxWidth: 760,
        fontSize: 17,
        lineHeight: 1.65,
        color: 'var(--color-muted-dark)',
      }}
    >
      {/* One-line link to the Realtor page, right under the listings
          (2026-10-18, per Ryan). */}
      {realtorPage && (
        <p style={{ fontSize: 17, margin: '0 0 28px' }}>
          <strong style={{ color: 'var(--color-ink)' }}>Selling or buying in {realtorPage.name}?</strong>{' '}
          <Link href={realtorPage.path} style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            Work with Ryan, your {realtorPage.name} Realtor →
          </Link>
        </p>
      )}
      {/* Link to the city's Open Houses page (2026-10-24). */}
      {OPEN_HOUSE_CITIES[citySlug] && currentPath !== openHousePath(citySlug) && (
        <p style={{ fontSize: 17, margin: '0 0 28px' }}>
          <strong style={{ color: 'var(--color-ink)' }}>Going to open houses?</strong>{' '}
          <Link href={openHousePath(citySlug)} style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            See this weekend&apos;s {OPEN_HOUSE_CITIES[citySlug].name} open houses →
          </Link>
        </p>
      )}
      <h2 style={{ fontSize: 24, marginBottom: 12, color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
        {page.aboutHeading}
      </h2>
      {/* City photo (2026-10-18, per Ryan) — same treatment as the
          neighborhood pages' community photo (.community-photo). */}
      {config.photo && (
        <figure className="community-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.photo.src}
            width={config.photo.width}
            height={config.photo.height}
            alt={config.photo.alt}
            loading="lazy"
          />
          <figcaption>{config.photo.caption}</figcaption>
        </figure>
      )}
      {page.about.map((text) => (
        <p key={text.slice(0, 32)} style={{ marginBottom: 12 }}>
          {text}
        </p>
      ))}
      {/* Optional where-to-buy list with links (2026-10-11) — page.areas in
          CITY_PAGE_SEO; an entry has text + href, or a row of links. */}
      {page.areas && (
        <>
          <h3 style={{ fontSize: 18, margin: '20px 0 8px', color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
            {page.areasHeading}
          </h3>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            {page.areas.map((a) => (
              <li key={a.label} style={{ marginBottom: 8 }}>
                {a.href ? (
                  <Link href={a.href} style={{ color: '#000', fontWeight: 600 }}>
                    {a.label}
                  </Link>
                ) : (
                  <strong style={{ color: 'var(--color-ink)' }}>{a.label}</strong>
                )}
                {a.text && !a.links && <>: {a.text}</>}
                {a.links && (
                  <>
                    :{' '}
                    {a.links.map((l, i) => (
                      <span key={l.href}>
                        {i > 0 && ' · '}
                        <Link href={l.href} style={{ color: '#000', textDecoration: 'underline' }}>
                          {l.label}
                        </Link>
                      </span>
                    ))}
                    {a.text && <> — {a.text}</>}
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {snapshot && snapshot.count > 0 && (
        <p style={{ marginBottom: 12 }}>
          <strong style={{ color: 'var(--color-ink)' }}>Market snapshot:</strong> {snapshot.count} active{' '}
          {snapshot.count === 1 ? 'listing' : 'listings'}
          {snapshot.median != null && <>, median list price {formatPrice(snapshot.median)}</>}
          {snapshot.low != null && snapshot.high != null && snapshot.low !== snapshot.high && (
            <>
              {' '}
              (from {formatPrice(snapshot.low)} to {formatPrice(snapshot.high)})
            </>
          )}
          . Updated {updated}.
        </p>
      )}
      {/* "Realtor" wording (2026-10-13, per Ryan): his keyword list targets
          "Realtors {city}" / "Real estate agents {city}" / "Sell my house
          {city}", and no page named him as a local Realtor or linked
          sellers anywhere but the footer. */}
      <p style={{ marginBottom: 16 }}>
        Ryan Pohl, {/^[AEIOU]/i.test(config.name) ? 'an' : 'a'} {config.name} Realtor® and real estate agent with Brevard Coastal Homes, helps buyers compare{' '}
        {config.name} {page.agentNoun}, arrange private showings, and negotiate purchases from first search to
        closing. Thinking of selling?{' '}
        <Link href="/looking-to-sell" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
          Find out what your {config.name} home is worth
        </Link>{' '}
        or call or text Ryan at <a href="tel:+13213507661" style={{ color: '#000', textDecoration: 'underline' }}>321-350-7661</a>.
      </p>
      {/* Monthly sold report signup (2026-10-18, per Ryan). */}
      <SoldReportSignup townName={config.name} filter={cityListingsQueryParams(citySlug)} listingsPath={`/${citySlug}`} />
      <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
        More {config.name} real estate
      </h3>
      <p style={{ lineHeight: 2 }}>
        {links.map((l, i) => (
          <span key={l.href}>
            {i > 0 && ' · '}
            <Link href={l.href} style={{ color: '#000', textDecoration: 'underline' }}>
              {l.label}
            </Link>
          </span>
        ))}
      </p>
    </section>
  );
}
