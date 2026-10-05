/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Inline the site's (small, ~4 KB) CSS into each page's HTML instead of a
  // separate render-blocking stylesheet (2026-10-05, per Ryan's mobile
  // PageSpeed report: the CSS file delayed first paint by ~240 ms).
  experimental: {
    inlineCss: true,
  },
  images: {
    // Listing/city photos come from whatever URLs are stored in the backend
    // (placeholder images today, MLS photo URLs once Spark sync is live).
    // Loosened during early development — tighten this to real MLS photo
    // domains before shipping to production.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    // 2026-09-30, per Ryan — mobile PageSpeed flagged ~245 KiB of "improve
    // image delivery" savings, traced to the Search By City / Search By
    // Neighborhood card photos (app/page.js's PlaceCard) being served at
    // next/image's default quality (75). Those are small 750px-wide card
    // thumbnails, not full-bleed hero art, so a lower quality is visually
    // unnoticeable there — PlaceCard now requests quality={65}. 75 stays
    // listed here too so every other <Image> on the site (property photos,
    // etc.), which don't pass a quality prop and so still default to 75,
    // keeps working exactly as before. Without this allow-list, Next 15
    // only warns about an unconfigured quality value; Next 16 turns that
    // into a hard error, so this is also just getting ahead of that.
    //
    // 2026-10-01, per Ryan — after the above cut mobile's "improve image
    // delivery" finding from 245 KiB to 184 KiB, LCP (5.7s) was still the
    // single worst-scoring metric, and the homepage's hero banner photo
    // (app/page.js, the `priority` <Image> above the headline) is almost
    // certainly what Lighthouse is timing as the LCP element — it's the
    // one image still requested at full default quality. Added 70 here
    // (a smaller cut than the card thumbnails' 65, since this is the most
    // visible image on the site and above-the-fold detail matters more)
    // for that Image to use.
    qualities: [65, 70, 75],
    // 2026-10-02, per Ryan — mobile PageSpeed's "Improve image delivery"
    // finding was still showing ~181 KiB of savings after the quality
    // tuning above. Two more levers, both config-only:
    //
    // formats: Next only served WebP (its default) with nothing set here.
    // AVIF typically comes in 20-30% smaller than WebP at a visually
    // equivalent quality for photos like the hero/card images this site
    // uses. Listed first so Next prefers it whenever the requesting
    // browser's Accept header supports it, falling back to webp (then the
    // original format) otherwise — this is additive, not a replacement for
    // the quality={65}/{70} work above.
    //
    // minimumCacheTTL: left unset, which defaults to a very short window.
    // Every optimized/resized variant (the hero image, each PlaceCard
    // thumbnail) gets re-encoded on the fly on the next request once that
    // expires, rather than served from Next's on-disk cache — on a cold
    // hit that re-encode adds real latency directly on the LCP path, which
    // is almost certainly part of why repeated PageSpeed runs have been
    // landing at different scores. Set to 24 hours: long enough that a
    // PageSpeed re-run (or a normal visitor) almost always hits a warm
    // cache, short enough that if a backend/MLS photo URL were ever reused
    // for different photo content, it corrects within a day rather than
    // being stuck for a year.
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
};

module.exports = nextConfig;
