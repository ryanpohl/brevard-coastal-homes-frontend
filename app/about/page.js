import Link from 'next/link';
import { AGENT_INFO, BROKERAGE_INFO } from '@/lib/constants';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * About / agent bio page (2026-09-25, per Ryan — one of the 9 SEO/internal-
 * linking suggestions he asked to build ("Lets do all of your suggestions
 * but start with the flood insurance guide & about page")).
 *
 * A dedicated bio page for Ryan didn't exist anywhere on the site before
 * this — /contact shows only his name, business name, phone, and email in
 * a small card, with no actual bio copy, credentials, or photo of him at
 * any real size. This page also doubles as an E-E-A-T signal for search
 * engines (real, named, credentialed author/agent behind the site), which
 * is part of why it made the SEO suggestions list in the first place.
 *
 * Bio copy is Ryan's own facts (8 years in real estate after a career in
 * securities/financial services, top 3% of all Realtors ranking, works
 * with waterfront/luxury/first-time buyers/investment/new construction,
 * Bachelor's in Marketing & Business, New England native now in Melbourne
 * Beach), polished into flowing prose per his "Can you make this sound
 * better?" request. The "top 3%" ranking years were 2022 & 2023, per Ryan
 * — phrased below as "for multiple years" rather than naming the specific
 * years, per his own follow-up ("can I just say it was for a couple
 * different years?"), so this doesn't need editing every time another
 * qualifying year passes.
 *
 * IMPORTANT accuracy note: the top-3% ranking was earned through the Salt
 * Lake Board of Realtors in Utah, not in Brevard County — per Ryan, who
 * does not want the page to announce that he's newer to the Brevard
 * market. So this deliberately never claims the "8 years" or the top-3%
 * ranking were earned IN Brevard County specifically: the copy says Ryan
 * "brings" his experience TO Brevard County / the Space Coast market,
 * which is accurate either way, rather than "has spent eight years [...]
 * in Brevard County" (the first draft's wording, corrected here) or
 * "8+ years of Brevard County real estate experience" in the credentials
 * list below. Neither the state/board the ranking came from, nor how long
 * Ryan has specifically worked the Brevard market, is stated anywhere on
 * this page — both omissions are intentional per Ryan, and neither one
 * makes any claim on the page false.
 */
export const metadata = {
  title: 'About Ryan Pohl | Brevard Coastal Homes',
  // Brokerage name corrected 2026-09-26, per Ryan, to match
  // BROKERAGE_INFO.name's confirmed spelling — this was previously
  // hardcoded as "Tropical Realty & Inv. of Brevard" (see that constant's
  // own comment in lib/constants.js for the full naming history).
  description: `Meet Ryan Pohl, a Brevard County, FL real estate agent with ${BROKERAGE_INFO.name} — ranked in the top 3% of all Realtors, specializing in waterfront, luxury, first-time buyer, investment, and new construction properties.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 860 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 28, fontFamily: 'var(--font-inter-tight)' }}>
        About Ryan Pohl
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 28, marginBottom: 8, alignItems: 'start' }}>
        {/* Same headshot asset already used in Footer.js — plain <img>, not
            next/image, for the same Hostinger-optimizer-corruption reason
            documented on that component's own copy of this image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/team/ryan-headshot.jpg"
          alt="Ryan Pohl, Brevard Coastal Homes"
          style={{
            display: 'block',
            width: 180,
            height: 248,
            borderRadius: 12,
            objectFit: 'cover',
            objectPosition: 'top',
            border: '1px solid var(--color-border-light)',
          }}
        />

        <div>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--color-muted-dark)', marginBottom: 16 }}>
            Ryan Pohl brings eight years of real estate experience to helping buyers and sellers across Brevard
            County&apos;s coastal market — after spending most of his earlier career in the securities and financial
            services industry. That background shows up in how he works: methodical, numbers-driven, and always
            pushing for the best possible price on behalf of his clients.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--color-muted-dark)', marginBottom: 16 }}>
            That approach gets results — Ryan has been ranked in the top 3% of all Realtors for multiple years
            running. He works across the full range of the market: waterfront and luxury homes, first-time buyers,
            investment properties, and new construction. He holds a Bachelor&apos;s degree in Marketing &amp;
            Business.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--color-muted-dark)' }}>
            A New England native, Ryan now calls Melbourne Beach home. When he&apos;s not touring properties or
            negotiating offers, you&apos;ll usually find him at the beach, at the gym, or otherwise enjoying
            everything Brevard County&apos;s outdoors has to offer.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginTop: 36, marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, marginBottom: 14, fontFamily: 'var(--font-inter-tight)' }}>Credentials</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 1.9, color: 'var(--color-muted-dark)', fontSize: 15 }}>
          <li>Top 3% of all Realtors, ranked for multiple years</li>
          <li>8+ years of real estate experience</li>
          <li>Bachelor&apos;s degree in Marketing &amp; Business</li>
          <li>Specializes in waterfront &amp; luxury, first-time buyers, investment properties, and new construction</li>
          <li>Background in securities &amp; financial services</li>
        </ul>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 16, lineHeight: 1.6 }}>
          {/* CORRECTED 2026-09-26, per Ryan: the number originally shown
              here was his own individual license, not the brokerage's —
              see AGENT_INFO/BROKERAGE_INFO's comments in lib/constants.js
              for the full history. Now each entity gets its own license
              number, Ryan's individual license and the brokerage's
              corporate license. */}
          {AGENT_INFO.name}, FL License #{AGENT_INFO.licenseNumber}
          <br />
          {BROKERAGE_INFO.name}, FL License #{BROKERAGE_INFO.licenseNumber}
        </p>
      </div>

      {/* Cross-link to the Reviews page (2026-09-25, per Ryan) — a visitor
          reading Ryan's credentials is exactly who wants to see what past
          clients actually say next. */}
      <p style={{ fontSize: 15, marginBottom: 36 }}>
        <Link href="/reviews" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
          Read what past clients say →
        </Link>
      </p>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Ready to start your search, or have a question first?</p>
        <p style={{ fontSize: 15 }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            Browse Brevard County Listings →
          </Link>
        </p>
        <p style={{ fontSize: 15, marginTop: 10 }}>
          <strong>
            <ContactUsTrigger>Contact Ryan</ContactUsTrigger>
          </strong>
        </p>
      </div>
    </div>
  );
}
