import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AuthPromptHost from '@/components/AuthPromptHost';
import * as api from '@/lib/api';

// Google Fonts (2026-09-24, SEO/performance re-audit) — this used to be a
// `@import url('https://fonts.googleapis.com/...')` at the top of
// globals.css, which is a textbook render-blocking chain: the browser has
// to download globals.css, parse it, discover the @import, THEN fetch
// fonts.googleapis.com's CSS, parse that, THEN finally fetch the actual
// font files from fonts.gstatic.com — three serial round trips before any
// of this site's custom-font text (including hero/H1 text that's often the
// LCP element) could paint. PageSpeed Insights flagged ~1.35s of
// render-blocking delay from this.
//
// First attempt was next/font/google (self-hosts the files at build time,
// no external request at all) — reverted same day after it broke the
// Hostinger build: `next build` failed with "TypeError: Cannot read
// properties of null (reading '1')" inside next/font's Google-fonts
// loader, almost certainly because this build sandbox can't reach
// fonts.googleapis.com/fonts.gstatic.com during the build step (the site
// itself never broke — Hostinger kept serving the last successful build
// throughout). See deployment 01a0d4c3 in Hostinger's build log for the
// full stack trace if this needs revisiting later (e.g. if Hostinger's
// build environment gets broader network access).
//
// Second attempt was a plain <link rel="preconnect"> + <link
// rel="stylesheet"> pair — this correctly moved *discovery* of the font
// CSS request earlier (the browser's preload scanner finds it immediately
// while parsing <head>, instead of only after globals.css finishes
// downloading+parsing), but a synchronous <link rel="stylesheet"> is
// STILL render-blocking no matter how early it's discovered. Re-running
// PageSpeed Insights after that deploy confirmed it: "Render-blocking
// requests" was still flagged with ~1.2s of estimated savings, barely
// down from the original ~1.35s.
//
// This is the actual fix: the "loadCSS" pattern (a well-known technique,
// not Next-specific). `media="print"` makes the browser fetch the
// stylesheet WITHOUT blocking initial render (print stylesheets don't
// apply to screen rendering, so they're never in the critical path); the
// inline <script> immediately after runs synchronously during HTML
// parsing and flips it to `media="all"` once loaded, so the fonts apply
// normally a moment later. This has to be a plain inline <script> rather
// than a React `onLoad` prop — RootLayout is an async Server Component,
// and Server Components can't pass event-handler functions to Client
// Component-style props (there's no client-side JS bundle to run them).
// A vanilla <script> tag sidesteps that entirely: it's just HTML the
// browser executes in document order, no React involved. <noscript>
// keeps fonts working the normal way for the rare visitor with JS
// disabled. Same font families/weights as before; still the same
// fonts.googleapis.com/fonts.gstatic.com runtime request (no build-time
// network dependency, so this doesn't reintroduce the Hostinger build
// failure from the next/font attempt).


// Sitewide SEO defaults (2026-09-11) — metadataBase resolves every page's
// relative image/canonical URLs (e.g. a page's `alternates.canonical: '/foo'`
// or an og:image path) into absolute ones without each page having to spell
// out the domain; openGraph/twitter give every page a real preview card when
// shared on Facebook/iMessage/Slack/X instead of a blank one, since a page
// that doesn't set its own `openGraph`/`twitter` fields inherits these in
// full (Next.js only replaces fields a child page actually sets, it doesn't
// need to declare all of them). Deliberately NOT adding a `title.template`
// here — every page below (homepage, city/neighborhood/listing pages) already
// hand-builds its own full "X | Brevard Coastal Homes"-style title string
// (or gets one verbatim from the backend's page_seo table), so a template
// would double up the suffix instead of applying it once.
export const metadata = {
  metadataBase: new URL('https://brevardcoastalhomes.com'),
  title: 'Brevard Coastal Homes',
  description: 'Real estate search across Brevard County, FL — homes, condos, and land for sale.',
  openGraph: {
    type: 'website',
    siteName: 'Brevard Coastal Homes',
    title: 'Brevard Coastal Homes',
    description: 'Real estate search across Brevard County, FL — homes, condos, and land for sale.',
    url: 'https://brevardcoastalhomes.com',
    images: [
      {
        url: '/hero/brevard-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Brevard Coastal Homes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brevard Coastal Homes',
    description: 'Real estate search across Brevard County, FL — homes, condos, and land for sale.',
    images: ['/hero/brevard-hero.jpg'],
  },
};

// Cities/neighborhoods barely change, so this is safe to cache for a while
// (see lib/api.js's default revalidate). Both the nav and footer need the
// full lists, so we fetch once here and pass down rather than re-fetching
// in every component.
async function getNavData() {
  try {
    const [{ cities }, { neighborhoods }] = await Promise.all([api.getCities(), api.getNeighborhoods()]);
    return { cities, neighborhoods };
  } catch {
    // Backend unreachable at build/request time — render nav/footer empty
    // rather than crashing the whole site.
    return { cities: [], neighborhoods: [] };
  }
}

export default async function RootLayout({ children }) {
  const { cities, neighborhoods } = await getNavData();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          id="google-fonts-css"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Jost:wght@400;500;600;700;800&family=Inter+Tight:wght@400;500;600;700;800&family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600&display=swap"
          media="print"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "document.getElementById('google-fonts-css').media='all';",
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Jost:wght@400;500;600;700;800&family=Inter+Tight:wght@400;500;600;700;800&family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600&display=swap"
          />
        </noscript>
      </head>
      <body>
        {/* Google Ads conversion tracking (gtag.js), added 2026-08-20 per Ryan.
            Loaded here in the root layout so it's present on every page. */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18381671560"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18381671560');
          `}
        </Script>
        <AuthProvider>
          <Nav cities={cities} neighborhoods={neighborhoods} />
          <main>{children}</main>
          <Footer cities={cities} neighborhoods={neighborhoods} />
          {/* Global "sign in to save a property" popup (2026-08-29) — see
              AuthPromptHost.js/AuthPromptModal.js. Mounted once here,
              inside AuthProvider, so any component in the tree can pop it
              open via useAuth().promptSignIn(message). */}
          <AuthPromptHost />
        </AuthProvider>
      </body>
    </html>
  );
}
