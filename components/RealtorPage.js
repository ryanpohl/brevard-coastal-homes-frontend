import Link from 'next/link';
import SoldReportSignup from '@/components/SoldReportSignup';
import { AGENT_INFO, BROKERAGE_INFO, formatPrice } from '@/lib/constants';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';
import ModelTourButton from '@/components/ModelTourButton';

// Body of an "{Area} Realtor" page (2026-10-18, per Ryan), shared by the
// neighborhood and city routes — see lib/realtorPages.js.
const SITE_URL = 'https://brevardcoastalhomes.com';

// Two short client quotes from Ryan's Google reviews (Reviews page).
const QUOTES = [
  {
    name: 'Vanessa',
    quote:
      'As a first-time homebuyer, the process could have easily felt overwhelming, but Ryan made sure my sons and I always felt safe, heard, understood, and supported.',
  },
  {
    name: 'Daniel Bajer',
    quote:
      'We were not from the area, Ryan spent plenty of time helping us to decide on a beautiful home that would be best for our Family.',
  },
];

const sectionHeading = { fontSize: 24, margin: '32px 0 12px', color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' };

export function realtorMetadata(page) {
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: page.path },
  };
}

export default function RealtorPage({ page, stats, filter }) {
  const pageUrl = `${SITE_URL}${page.path}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Ryan Pohl, Brevard Coastal Homes',
    url: pageUrl,
    telephone: '+1-321-350-7661',
    employee: { '@type': 'Person', name: 'Ryan Pohl', url: `${SITE_URL}/about` },
    areaServed: [
      { '@type': 'Place', name: page.place },
      { '@type': 'AdministrativeArea', name: 'Brevard County, FL' },
    ],
  };
  const buying = (
    <>
      <h2 style={sectionHeading}>Buying in {page.name}</h2>
      {page.buying.map((t) => (
        <p key={t.slice(0, 30)} style={{ marginBottom: 12 }}>{t}</p>
      ))}
      {page.modelTour && <ModelTourButton communityName={page.name} />}
    </>
  );
  const selling = (
    <>
      <h2 style={sectionHeading}>Selling your {page.name} home</h2>
      {page.selling.map((t) => (
        <p key={t.slice(0, 30)} style={{ marginBottom: 12 }}>{t}</p>
      ))}
      <p>
        <Link href="/looking-to-sell" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
          Get your free {page.name} home value →
        </Link>
      </p>
    </>
  );

  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 860, fontSize: 17, lineHeight: 1.65, color: 'var(--color-muted-dark)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p style={{ fontSize: 14, marginBottom: 8 }}>
        <Link href={page.listingsHref} style={{ color: 'var(--color-muted-dark)' }}>
          ← {page.name} homes for sale
        </Link>
      </p>
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 12, color: 'var(--color-ink)', fontFamily: 'var(--font-inter-tight)' }}>
        {page.h1}
      </h1>
      <p style={{ fontSize: 18 }}>{page.intro}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '18px 0 8px', alignItems: 'center' }}>
        <a href="tel:+13213507661" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Call or Text Ryan: 321-350-7661
        </a>
        <strong>
          <ContactUsTrigger initialMessage={`I'd like to talk about ${page.sellerFirst ? 'selling or buying' : 'buying or selling'} in ${page.name}.`}>Send Ryan a message</ContactUsTrigger>
        </strong>
      </div>

      {page.sellerFirst ? <>{selling}{buying}</> : <>{buying}{selling}</>}

      {stats && stats.count > 0 && (
        <>
          <h2 style={sectionHeading}>The {page.name} market right now</h2>
          <p>
            {stats.count} {stats.count === 1 ? 'home' : 'homes'} sold in {page.name} in the last 12 months
            {stats.medianPrice ? <>, at a median of <strong>{formatPrice(stats.medianPrice)}</strong></> : null}
            {stats.medianPerSqft ? <> (<strong>${stats.medianPerSqft.toLocaleString('en-US')}/sq ft</strong>)</> : null}
            {stats.activeCount != null ? <>, and {stats.activeCount} {stats.activeCount === 1 ? 'is' : 'are'} for sale now</> : null}. Live from the Space Coast MLS.{' '}
            <Link href={page.listingsHref} style={{ color: '#000', textDecoration: 'underline' }}>
              See {page.name} listings and recent sales →
            </Link>
          </p>
        </>
      )}
      {/* Monthly sold report signup (2026-10-18, per Ryan). */}
      {filter && <SoldReportSignup townName={page.name} filter={filter} listingsPath={page.listingsHref} />}

      <h2 style={sectionHeading}>Why work with Ryan Pohl</h2>
      <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
        <li>Licensed for 8 years, including 5 years in Park City, Utah with over $100 million in sales</li>
        <li>Ranked in the top 3% of Realtors for multiple years</li>
        <li>5.0-star rating on Google</li>
        <li>Previously in finance with Fidelity and Morgan Stanley — pricing and negotiation backed by numbers</li>
        {page.extraBullets?.map((t) => <li key={t}>{t}</li>)}
      </ul>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', margin: '8px 0 6px' }}>
        {QUOTES.map((r) => (
          <div key={r.name} className="card" style={{ padding: 18, fontSize: 15 }}>
            <div aria-hidden="true" style={{ color: 'var(--color-gold, #c9a15a)', letterSpacing: 2 }}>★★★★★</div>
            <p style={{ margin: '6px 0' }}>&ldquo;{r.quote}&rdquo;</p>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{r.name}, Google review</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 15 }}>
        <Link href="/reviews" style={{ color: '#000', textDecoration: 'underline' }}>Read more client reviews →</Link>{' '}
        ·{' '}
        <Link href="/about" style={{ color: '#000', textDecoration: 'underline' }}>About Ryan →</Link>
      </p>

      <div style={{ marginTop: 28 }}>
        <Faq items={page.faq} heading={`${page.name} Realtor FAQ`} />
      </div>

      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 24 }}>
        {AGENT_INFO.licensedName}, FL License #{AGENT_INFO.licenseNumber} · {BROKERAGE_INFO.name}, FL License #{BROKERAGE_INFO.licenseNumber}
      </p>
    </div>
  );
}
