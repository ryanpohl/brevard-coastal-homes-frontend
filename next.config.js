/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Listing/city photos come from whatever URLs are stored in the backend
    // (placeholder images today, MLS photo URLs once Spark sync is live).
    // Loosened during early development — tighten this to real MLS photo
    // domains before shipping to production.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

module.exports = nextConfig;
