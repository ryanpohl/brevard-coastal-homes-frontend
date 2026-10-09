import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AuthPromptHost from '@/components/AuthPromptHost';
import MobileContactBar, { ContactBarProvider } from '@/components/MobileContactBar';
import * as api from '@/lib/api';
import { navNeighborhoods } from '@/lib/navNeighborhoods';

// Fonts (2026-10-08, per Ryan's mobile PageSpeed report): Playfair Display
// and Inter Tight are self-hosted from public/fonts (latin subset, variable
// weight — the same files Google Fonts served) with @font-face rules at the
// top of app/globals.css. That CSS is inlined into each page, so the
// browser finds the fonts right away instead of waiting on
// fonts.googleapis.com and then fonts.gstatic.com, as before. Both fonts
// are SIL Open Font License.


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
        url: '/hero/brevard-hero-no-ship.jpg',
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
    images: ['/hero/brevard-hero-no-ship.jpg'],
  },
};

// Cities/neighborhoods barely change, so this is safe to cache for a while
// (see lib/api.js's default revalidate). Both the nav and footer need the
// full lists, so we fetch once here and pass down rather than re-fetching
// in every component.
async function getNavData() {
  try {
    const [{ cities }, { neighborhoods }] = await Promise.all([api.getCities(), api.getNeighborhoods()]);
    return { cities, neighborhoods: navNeighborhoods(neighborhoods) };
  } catch {
    // Backend unreachable at build/request time — render nav/footer empty
    // rather than crashing the whole site.
    return { cities: [], neighborhoods: navNeighborhoods([]) };
  }
}

export default async function RootLayout({ children }) {
  const { cities, neighborhoods } = await getNavData();

  return (
    <html lang="en">
      <body>
        {/* Google Ads conversion tracking (gtag.js), added 2026-08-20 per Ryan.
            Loaded here in the root layout so it's present on every page.

            Strategy changed afterInteractive -> lazyOnload 2026-10-01, per
            Ryan — mobile PageSpeed's "Reduce unused JavaScript" finding
            flagged this script at 186.1 KiB with 64.9 KiB unused, and it
            was contributing to Total Blocking Time (370ms). afterInteractive
            already didn't block the initial render, but it still fetches
            and executes right after hydration, competing with the rest of
            the page for the main thread during the window TBT measures.
            lazyOnload pushes it to whenever the browser is next idle
            instead — conversion tracking has no reason to win that race.
            Trade-off: a visitor who navigates away within roughly a second
            or two of landing, before the browser goes idle, could have a
            conversion event missed. Standard practice for ad/analytics
            tags and an acceptable trade for the performance win here. */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18381671560"
          strategy="lazyOnload"
        />
        <Script id="google-ads-gtag" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18381671560');
          `}
        </Script>
        <AuthProvider>
          <ContactBarProvider>
            <Nav cities={cities} neighborhoods={neighborhoods} />
            <main>{children}</main>
            <Footer cities={cities} neighborhoods={neighborhoods} />
            {/* Call / Text Ryan bar on phones (2026-10-09) — MobileContactBar.js. */}
            <MobileContactBar />
          </ContactBarProvider>
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
