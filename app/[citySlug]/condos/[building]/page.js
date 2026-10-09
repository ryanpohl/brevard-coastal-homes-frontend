import Link from 'next/link';
import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import { formatPrice } from '@/lib/siteConstants';
import {
  condoBuildingDetail,
  condoBuildingFilter,
  findCondoBuilding,
  getCondoBuildingData,
} from '@/lib/condoBuildings';
import { listingPreviewPhoto, withSocialPreview } from '@/lib/socialPreview';
import ListingCard from '@/components/ListingCard';
import RecentlySold from '@/components/RecentlySold';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';
import CondoBuildingDirectory from '@/components/CondoBuildingDirectory';
import BrokerageNote from '@/components/BrokerageNote';
import { formatMiles, nearbyFor } from '@/lib/nearby';

// Condo building page (2026-10-08, per Ryan): /{city}/condos/{building} —
// see lib/condoBuildings.js for which buildings and why. Live from the MLS:
// active listings, the last 12 months of sales, HOA fees and the minimum
// rental term listed. Links back to the city's condo page and the other
// buildings.
export const revalidate = 3600;

const SITE_URL = 'https://brevardcoastalhomes.com';

async function load(params) {
  const { citySlug, building: slug } = await params;
  const building = findCondoBuilding(citySlug, slug);
  if (!building) return null;
  let city = null;
  try {
    ({ city } = await api.getCity(citySlug));
  } catch {
    // Fall back to the slug below.
  }
  const cityName = city?.name || citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { citySlug, building, cityName };
}

export async function generateMetadata({ params }) {
  const page = await load(params);
  if (!page) return {};
  const { citySlug, building, cityName } = page;
  const where = building.oceanfront ? 'oceanfront condos' : 'condos';
  const meta = {
    title: { absolute: `${building.name} Condos for Sale | ${cityName}, FL` },
    description: `${building.name} ${where} for sale in ${cityName}, FL${building.address ? ` at ${building.address}` : ''}: current listings, recent sales, HOA fees and rental rules, updated from the MLS.`,
    alternates: { canonical: `/${citySlug}/condos/${building.slug}` },
  };
  const photo = await listingPreviewPhoto(condoBuildingFilter(citySlug, building));
  return withSocialPreview(meta, photo);
}

export default async function CondoBuildingPage({ params }) {
  const page = await load(params);
  if (!page) notFound();
  const { citySlug, building, cityName } = page;
  const data = await getCondoBuildingData(citySlug, building);
  const name = building.name;
  const sold = data?.soldStats && data.soldStats.count ? data.soldStats : null;
  const fee =
    data?.feeMin && data?.feeMax
      ? data.feeMin === data.feeMax
        ? `${formatPrice(data.feeMin)}/mo`
        : `${formatPrice(data.feeMin)}–${formatPrice(data.feeMax)}/mo`
      : null;
  const rental = data?.rentalMinimum ? data.rentalMinimum.replace(/^No Minimum$/, 'No minimum') : null;

  const tiles = data
    ? [
        { label: 'For sale now', value: data.activeCount.toLocaleString('en-US') },
        data.medianListPrice ? { label: 'Median list price', value: formatPrice(data.medianListPrice) } : null,
        sold ? { label: 'Sold in the last 12 months', value: sold.count.toLocaleString('en-US') } : null,
        sold?.medianPrice ? { label: 'Median sold price', value: formatPrice(sold.medianPrice) } : null,
        fee ? { label: 'HOA fees (recent listings)', value: fee } : null,
        rental ? { label: 'Minimum rental (MLS)', value: rental } : null,
      ].filter(Boolean)
    : [];

  const intro = [
    `${name} is ${building.oceanfront ? 'an oceanfront' : 'a'} condominium${building.address ? ` at ${building.address}` : ''} in ${cityName}, Florida${building.near ? `, ${building.near}` : ''}.`,
    building.newConstruction ? ' It is new construction.' : building.built ? ` It was built in ${building.built}.` : '',
  ].join('');

  const faq = [];
  if (data) {
    faq.push({
      q: `How many condos are for sale at ${name} in ${cityName}?`,
      a: `There ${data.activeCount === 1 ? 'is' : 'are'} currently ${data.activeCount} ${data.activeCount === 1 ? 'condo' : 'condos'} for sale at ${name}${data.medianListPrice ? `, with a median list price of ${formatPrice(data.medianListPrice)}` : ''}, updated hourly from the Space Coast MLS.`,
    });
    if (sold?.medianPrice) {
      faq.push({
        q: `What have condos at ${name} sold for?`,
        a: `${sold.count} ${sold.count === 1 ? 'unit' : 'units'} sold at ${name} in the last 12 months, with a median sold price of ${formatPrice(sold.medianPrice)}${sold.medianPerSqft ? ` (about ${formatPrice(sold.medianPerSqft)} per square foot)` : ''}.`,
      });
    }
    if (fee) {
      faq.push({
        q: `What are the HOA fees at ${name}?`,
        a: `Recent ${name} listings show HOA fees of about ${fee}${data.feeMedian ? ` (median ${formatPrice(data.feeMedian)}/mo)` : ''}. Fees vary by unit size; confirm the current fee and any special assessments with the association before you buy.`,
      });
    }
    if (rental) {
      faq.push({
        q: `Does ${name} allow rentals?`,
        a: `MLS listings for ${name} most often show a minimum rental period of ${rental.toLowerCase()}. Rental rules can change and aren't listed on every unit, so confirm the current rules with the association.`,
      });
    }
  }

  const nearby = data?.center ? nearbyFor(citySlug, data.center) : null;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: `${cityName} Condos for Sale`, item: `${SITE_URL}/${citySlug}/condos-for-sale` },
      { '@type': 'ListItem', position: 3, name: `${name} Condos`, item: `${SITE_URL}/${citySlug}/condos/${building.slug}` },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="container" style={{ padding: '28px clamp(16px, 4vw, 56px) 8px', maxWidth: 1100 }}>
        <nav style={{ fontSize: 14, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
          <Link href={`/${citySlug}/condos-for-sale`} style={{ color: 'inherit', textDecoration: 'underline' }}>
            {cityName} Condos for Sale
          </Link>{' '}
          › {name}
        </nav>
        <h1 style={{ fontFamily: 'var(--font-inter-tight)', fontSize: 'clamp(26px, 4vw, 38px)', color: 'var(--color-ink)', marginBottom: 10 }}>
          {name} Condos for Sale &ndash; {cityName}, FL
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--color-muted-dark)', maxWidth: 760, marginBottom: 6 }}>
          {intro}
          {building.note ? ` ${building.note}` : ''}
        </p>
        {condoBuildingDetail(building) && (
          <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 20 }}>{condoBuildingDetail(building)}</p>
        )}
      </div>

      <div className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 24px', maxWidth: 1100 }}>
        <h2 className="market-report-title">
          {data && data.activeCount > 0
            ? `${data.activeCount} ${name} ${data.activeCount === 1 ? 'Condo' : 'Condos'} for Sale`
            : `${name} Condos for Sale`}
        </h2>
        {data && data.active.length > 0 ? (
          <div className="condo-listing-grid">
            {data.active.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 16, color: 'var(--color-muted-dark)', marginBottom: 8 }}>
            Nothing is listed at {name} right now. Units here come up regularly &mdash;{' '}
            <ContactUsTrigger>ask Ryan to let you know</ContactUsTrigger> when one does.
          </p>
        )}
      </div>

      {tiles.length > 1 && (
        <div className="container" style={{ padding: '8px clamp(16px, 4vw, 56px) 8px', maxWidth: 760 }}>
          <section className="market-report neighborhood-market-stats" style={{ margin: '4px 0 20px' }}>
            <h2 className="market-report-title" style={{ fontSize: 20 }}>
              {name} at a Glance
            </h2>
            <p className="market-report-sub">Space Coast MLS · listings updated hourly, sales daily</p>
            <div className="market-tiles">
              {tiles.map((t) => (
                <div key={t.label} className="market-tile">
                  <div className="market-tile-value">{t.value}</div>
                  <div className="market-tile-label">{t.label}</div>
                </div>
              ))}
            </div>
            {(fee || rental) && (
              <p className="market-report-note" style={{ fontSize: 13, marginTop: 10 }}>
                HOA fees and rental rules are from recent MLS listings at {name} and can change; confirm them with the
                association.
              </p>
            )}
          </section>
        </div>
      )}

      {data && <RecentlySold name={name} data={data.recentlySold} />}

      {nearby && (
        <section className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 40px', maxWidth: 760 }}>
          <h2 className="market-report-title">What&rsquo;s Near {name}</h2>
          <p className="market-report-sub">Distances from {name}; nearby places are straight-line miles.</p>
          {nearby.restaurants.length > 0 && (
            <NearbyTable heading="Restaurants" rows={nearby.restaurants.map((r) => [r.name, r.detail ? `${r.address} · ${r.detail}` : r.address, formatMiles(r.mi)])} />
          )}
          <NearbyTable
            heading="Beach, Shopping & Landmarks"
            rows={[
              ...(building.oceanfront ? [['The beach', 'Oceanfront building', 'On the beach']] : []),
              ...nearby.landmarks.map((r) => [r.name, r.address, formatMiles(r.mi)]),
            ]}
          />
          <NearbyTable
            heading="Further Away"
            columns={['Place', 'Driving', 'Typical drive']}
            rows={nearby.far.map((f) => [f.name, `About ${f.miles} mi`, f.drive])}
          />
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 8 }}>
            Drive times are typical without traffic; Orlando trips use the SR 528 toll road, and rush hour adds time.
          </p>
        </section>
      )}

      <section className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 40px', maxWidth: 760, fontSize: 17, lineHeight: 1.65, color: 'var(--color-muted-dark)' }}>
        <h2 style={{ fontSize: 24, marginBottom: 12, color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
          Buying at {name}
        </h2>
        <p style={{ marginBottom: 12 }}>
          Ryan Pohl of Brevard Coastal Homes helps buyers compare {name} with other {cityName} condo buildings &mdash; HOA
          fees, reserves and assessments, rental rules, and recent sales &mdash; and negotiate from first showing to
          closing. <ContactUsTrigger>Contact Ryan</ContactUsTrigger> about {name}.
        </p>
        <BrokerageNote block />
        <p style={{ marginTop: 16 }}>
          <Link href={`/${citySlug}/condos-for-sale`} style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            See all {cityName} condos for sale &rarr;
          </Link>
        </p>
      </section>

      <CondoBuildingDirectory citySlug={citySlug} cityName={cityName} currentSlug={building.slug} heading={`Other ${cityName} Condo Buildings`} />

      {faq.length > 0 && (
        <div className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
          <Faq items={faq} />
        </div>
      )}
    </div>
  );
}

// One "What's Near" table: name, address (or driving miles), distance.
function NearbyTable({ heading, rows, columns = ['Place', 'Address', 'Distance'] }) {
  if (!rows.length) return null;
  return (
    <div style={{ marginTop: 18 }}>
      <h3 style={{ fontSize: 17, marginBottom: 8, color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>{heading}</h3>
      <div style={{ overflowX: 'auto', border: '1px solid var(--color-border-light)', borderRadius: 6, background: '#fff' }}>
        <table className="market-table nearby-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{r[0]}</td>
                <td>{r[1]}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
