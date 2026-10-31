import Link from 'next/link';
import * as api from '@/lib/api';
import { listingCommunity, listingCityArea } from '@/lib/listingCommunity';
import { similarHomesBand, shortPrice } from '@/lib/similarHomes';
import SimilarAlertClient from './SimilarAlertClient';

// "Also email me new homes like this" (2026-10-31, per Ryan): the button in
// home-alert emails lands here with the alert's token. The page shows the
// area (the home's community page, else its city — lib/listingCommunity.js)
// and price range, and signs them up for new-listing alerts only when they
// click, so a mail scanner opening the link doesn't. Kept out of search.
export const metadata = {
  title: 'New Homes Like This | Brevard Coastal Homes',
  robots: { index: false, follow: false },
};

const box = { maxWidth: 600, padding: '56px 16px', textAlign: 'center', color: 'var(--color-muted-dark)', fontSize: 17, lineHeight: 1.6 };

function NotFound() {
  return (
    <div className="container" style={box}>
      <h1 style={{ fontSize: 28, color: 'var(--color-ink)', marginBottom: 12 }}>This link has expired</h1>
      <p>
        Browse <Link href="/" style={{ color: '#000', textDecoration: 'underline' }}>homes for sale</Link>, or call or text Ryan at{' '}
        <a href="tel:+13213507661" style={{ color: '#000', fontWeight: 600 }}>321-350-7661</a>.
      </p>
    </div>
  );
}

export default async function SimilarAlertPage({ searchParams }) {
  const { token } = await searchParams;
  if (!token) return <NotFound />;
  let watch;
  let listing;
  let neighborhoods = [];
  try {
    watch = await api.getHomeWatch(token);
    [{ listing }, { neighborhoods = [] }] = await Promise.all([api.getListing(watch.listingId), api.getNeighborhoods()]);
  } catch {
    return <NotFound />;
  }
  const band = similarHomesBand(listing);
  const area = listingCommunity(listing, neighborhoods) || listingCityArea(listing);
  if (!band || !area) return <NotFound />;

  const range = `${shortPrice(band.priceMin)}–${shortPrice(band.priceMax)}`;
  const label = `${band.bedsLabel}${area.name} ${band.noun}, ${range}`;
  const filter = { ...area.filter, ...band.filter };
  const street = listing.address.split(',')[0];

  return (
    <div className="container" style={box}>
      <h1 style={{ fontSize: 'clamp(26px, 4vw, 34px)', color: 'var(--color-ink)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        New homes like {street}
      </h1>
      <p style={{ marginBottom: 22 }}>
        Get an email when new <strong style={{ color: 'var(--color-ink)' }}>{band.bedsLabel}{band.noun} in {area.name}</strong> priced{' '}
        <strong style={{ color: 'var(--color-ink)' }}>{range}</strong> come on the market, plus price drops. You’ll keep getting alerts for {street} too.
      </p>
      <SimilarAlertClient email={watch.email} label={label} pagePath={area.path} filter={filter} areaName={area.name} />
      <p style={{ marginTop: 28, fontSize: 15 }}>
        <Link href={area.path} style={{ color: '#000', fontWeight: 600, textDecoration: 'underline' }}>
          See {area.name} homes for sale now →
        </Link>
      </p>
    </div>
  );
}
