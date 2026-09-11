// Native Next.js robots.txt (2026-09-11, SEO audit finding: brevardcoastalhomes.com/robots.txt
// 404s — the backend DOES have a working /robots.txt handler (controllers/seo.controller.js's
// robotsTxt, mounted at the domain root in server.js), but that route lives on the BACKEND's own
// domain (listings-api.brevardcoastalhomes.com), not this frontend's — and even if it were
// reachable here, the live backend deploy predates that code entirely (see sitemap.js's comment
// for the full story). Next.js's app/robots.js file convention generates a real
// /robots.txt for THIS domain directly from the frontend, with zero backend dependency, so this
// stays correct even while the backend redeploy question is still open.
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://brevardcoastalhomes.com/sitemap.xml',
  };
}
