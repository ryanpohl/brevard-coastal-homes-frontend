/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  },
};

module.exports = nextConfig;
