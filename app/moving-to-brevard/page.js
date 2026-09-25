import Link from 'next/link';
import Faq from '@/components/Faq';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * Moving to Brevard County / Space Coast relocation guide (2026-09-25, per
 * Ryan — fifth evergreen guide page, same lightweight static pattern as
 * the down-payment-assistance/flood-insurance/hurricane-insurance/
 * property-taxes guides).
 *
 * Ryan sent 5 competitor URLs. One (cranecreekrealty.com) had no usable
 * content — metadata only, same issue as that same domain's page fetched
 * for the hurricane insurance guide. The rest gave a reasonable starting
 * point, but commute times, employer names, and new-resident logistics
 * were all independently verified against primary/official sources rather
 * than repeated as-is:
 *   - New Florida resident requirements (driver's license within 30 days,
 *     vehicle registration within 10 days, FL insurance required first):
 *     flhsmv.gov/new-resident/ (Florida Dept. of Highway Safety & Motor
 *     Vehicles — official)
 *   - Major employers/industries: spacecoastedc.org/data-downloads/
 *     industry-profile/ (Economic Development Commission of Florida's
 *     Space Coast — the region's official EDC). Confirmed L3Harris as the
 *     area's largest aerospace/defense employer (HQ Melbourne), plus
 *     Boeing, Lockheed Martin, Collins Aerospace, Leonardo DRS, Northrop
 *     Grumman, Embraer, Blue Origin, SpaceX, and OneWeb Satellites, all
 *     anchored around Kennedy Space Center / Cape Canaveral Space Force
 *     Station.
 *   - Commute time ranges (KSC/north county vs. Melbourne tech corridor)
 *     and the ~50-75 minute drive to Orlando International Airport are
 *     the one figure set pulled from competitor content rather than an
 *     official source (no county/DOT source gives area-to-area commute
 *     ranges) — kept as an approximate illustrative range, not exact
 *     quotes, consistent with how this guide handles unverifiable
 *     specifics elsewhere.
 * Deliberately does NOT repeat specific home-price-by-neighborhood figures
 * from competitor content (prices move too fast for a static page to
 * stay accurate) — points to each city's own Area Guide (live Market
 * Snapshot data) instead.
 */
export const metadata = {
  title: 'Moving to Brevard County, FL: A Space Coast Relocation Guide | Brevard Coastal Homes',
  description:
    "A 2026 guide to relocating to Brevard County, FL — major employers, commute times, climate, and what to do to become a Florida resident after you buy.",
  alternates: { canonical: '/moving-to-brevard' },
};

const FAQ_ITEMS = [
  {
    q: 'Is Brevard County expensive compared to other parts of Florida?',
    a: "It tends to run below South Florida and the Atlantic Northeast markets, though it varies a lot by city and by how close you are to the water. Florida also has no state income tax, which is a real ongoing savings compared to most other states. Each city's Area Guide on this site has live market data for that specific area.",
  },
  {
    q: 'What are the major employers in Brevard County?',
    a: "The Space Coast's identity comes from aerospace and defense: Kennedy Space Center, Cape Canaveral Space Force Station, and companies including L3Harris (headquartered in Melbourne and the region's largest employer in the industry), Northrop Grumman, Boeing, Lockheed Martin, Blue Origin, and SpaceX. Health First is the region's major healthcare system, and Florida Institute of Technology anchors higher education in Melbourne.",
  },
  {
    q: "How do I get a Florida driver's license and register my car after moving?",
    a: "By Florida law, you need a Florida driver's license within 30 days of establishing residency, and you need to title and register your vehicle within 10 days — which means getting Florida auto insurance first, since you can't register without it. Brevard County's local tax collector offices handle vehicle titling and registration.",
  },
  {
    q: "What's the commute like if I work at Kennedy Space Center or in the Melbourne tech corridor?",
    a: "It depends heavily on where you live relative to your specific work site. As a rough guide, North Merritt Island and Titusville tend to run 15–25 minutes from the KSC area, while Melbourne, West Melbourne, and North Palm Bay tend to run 10–20 minutes from the Melbourne tech corridor (Northrop Grumman, L3Harris). Beachside communities and Viera can mean longer commutes depending on the causeway and route you use.",
  },
  {
    q: 'What should I know about insurance and hurricanes before moving here?',
    a: "It's worth reading up before you buy, not after: our hurricane insurance guide covers the hurricane deductible and wind mitigation credits, and our flood insurance guide covers flood zones and what NFIP coverage actually costs. Both affect your ongoing costs more than almost anything else about owning a home here.",
  },
];

export default function MovingToBrevardPage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 760 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        Moving to Brevard County, FL: A Space Coast Relocation Guide
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
        Whether you&apos;re relocating for a job with the space industry, retiring to the coast, or just ready for a
        change of pace, here&apos;s what to know about Brevard County before you move — the job market, commute,
        climate, and the practical steps to become a Florida resident.
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-muted)', marginBottom: 36 }}>
        Figures below are current as of 2026 and sourced from official state and regional sources where available.
        This page is general information, not financial, tax, or legal advice.
      </p>

      <GuideSection title="Why people move to the Space Coast">
        <p>
          Brevard County stretches roughly 72 miles along Florida&apos;s Atlantic coast, from Titusville in the north
          down to Palm Bay in the south — barrier island beach towns on one side of the Indian River Lagoon, and
          mainland cities on the other. It&apos;s built its identity around the space industry: Kennedy Space Center
          and Cape Canaveral Space Force Station anchor a genuinely unique local economy, and the whole region is
          branded &ldquo;the Space Coast&rdquo; for a reason.
        </p>
        <p>
          Florida has no state income tax, which is a real, ongoing savings for anyone relocating from a state that
          does. Cost of living here generally runs below South Florida and the Atlantic Northeast, though it varies
          quite a bit city to city — see each city&apos;s own Area Guide on this site for current market data.
        </p>
      </GuideSection>

      <GuideSection title="Jobs & major employers">
        <p>
          Aerospace and defense dominate the local job market. L3Harris Technologies is headquartered in Melbourne
          and is the area&apos;s largest employer in the industry, alongside Northrop Grumman, Boeing, Lockheed
          Martin, Collins Aerospace, Leonardo DRS, Blue Origin, SpaceX, and OneWeb Satellites — most clustered around
          Kennedy Space Center and the Melbourne tech corridor. Manufacturing employment in the county has actually
          grown since 2001, against a national trend of decline.
        </p>
        <p>
          Outside aerospace, Health First is the region&apos;s major healthcare system, and Florida Institute of
          Technology (Florida Tech) anchors higher education in Melbourne. Orlando International Airport is roughly
          50–75 minutes west, depending on where in the county you&apos;re starting from.
        </p>
      </GuideSection>

      <GuideSection title="Getting around: commute & geography">
        <p>
          Where you live relative to your job matters more here than the raw mileage might suggest — causeway
          access, bridge traffic, and which specific facility entrance you use can add real time. As a rough guide:
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: 'var(--color-muted-dark)' }}>
          <li>
            <strong>North county (KSC area):</strong> North Merritt Island and Titusville typically run 15–25
            minutes; Port St. John, Cocoa, Rockledge, and Viera run 25–35 minutes; Cape Canaveral and Cocoa Beach can
            run 30–45+ minutes depending on causeway traffic.
          </li>
          <li>
            <strong>South county (Melbourne tech corridor):</strong> Melbourne, West Melbourne, and North Palm Bay
            typically run 10–20 minutes; Suntree, Indialantic, Indian Harbour Beach, and Satellite Beach run 15–30
            minutes.
          </li>
        </ul>
        <p>
          Both corridors have dual-commute-friendly options if you and a partner work in different parts of the
          county — Rockledge and Viera sit roughly in the middle.
        </p>
      </GuideSection>

      <GuideSection title="Climate & hurricane season">
        <p>
          Summers are hot and humid with predictable afternoon thunderstorms; winters are mild and sunny, with the
          ocean breeze keeping the barrier island a few degrees cooler than inland Central Florida year-round.
          Hurricane season runs June through November — worth reading about before you buy, not after. Our{' '}
          <Link href="/hurricane-insurance" style={{ color: 'inherit' }}>
            hurricane insurance guide
          </Link>{' '}
          and{' '}
          <Link href="/flood-insurance" style={{ color: 'inherit' }}>
            flood insurance guide
          </Link>{' '}
          cover what it actually costs and what&apos;s required.
        </p>
      </GuideSection>

      <GuideSection title="Becoming a Florida resident">
        <p>
          Once you&apos;ve established residency, Florida law gives you 30 days to get a Florida driver&apos;s license
          and 10 days to title and register your vehicle — which means lining up Florida auto insurance first, since
          you can&apos;t register without it. Brevard County&apos;s local tax collector offices handle titling and
          registration.
        </p>
        <p>
          It&apos;s also worth registering to vote and updating your driver&apos;s license address early: both are
          commonly used as proof of permanent residency when you file for the homestead exemption, which can save
          you real money on property taxes. See our{' '}
          <Link href="/property-taxes" style={{ color: 'inherit' }}>
            property taxes &amp; homestead exemption guide
          </Link>{' '}
          for the full breakdown.
        </p>
      </GuideSection>

      <GuideSection title="A few practical things to know">
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: 'var(--color-muted-dark)' }}>
          <li>
            <strong>Salt air is real:</strong> homes near the beach see faster wear on AC units, exterior finishes,
            and metal fixtures — factor that into maintenance expectations.
          </li>
          <li>
            <strong>Termite inspections still matter</strong> even on concrete block homes, since interior framing
            and trim are often still wood.
          </li>
          <li>
            <strong>HOA communities are common,</strong> especially in newer developments — worth reviewing the HOA
            docs and fees for any home you&apos;re seriously considering.
          </li>
          <li>
            <strong>Budget for insurance early,</strong> not as an afterthought — see the hurricane and flood
            insurance guides linked above, and our{' '}
            <Link href="/down-payment-assistance" style={{ color: 'inherit' }}>
              down payment assistance guide
            </Link>{' '}
            if financing the purchase itself is also a factor.
          </li>
        </ul>
      </GuideSection>

      <section style={{ marginBottom: 36 }}>
        <Faq items={FAQ_ITEMS} heading="Moving to Brevard County FAQ" />
      </section>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Ready to see what&apos;s available?</p>
        <p style={{ fontSize: 15 }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            Browse Brevard County Listings →
          </Link>
        </p>
        <p style={{ fontSize: 15, marginTop: 10 }}>
          Still deciding which city or neighborhood is right for you?{' '}
          <strong>
            <ContactUsTrigger>Contact Us</ContactUsTrigger>
          </strong>
        </p>
      </div>
    </div>
  );
}

function GuideSection({ title, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 22, marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>{title}</h2>
      <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-muted-dark)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </section>
  );
}
