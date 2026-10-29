// Native Next.js robots.txt (2026-09-11, SEO audit finding: brevardcoastalhomes.com/robots.txt
// 404s — the backend DOES have a working /robots.txt handler (controllers/seo.controller.js's
// robotsTxt, mounted at the domain root in server.js), but that route lives on the BACKEND's own
// domain (listings-api.brevardcoastalhomes.com), not this frontend's — and even if it were
// reachable here, the live backend deploy predates that code entirely (see sitemap.js's comment
// for the full story). Next.js's app/robots.js file convention generates a real
// /robots.txt for THIS domain directly from the frontend, with zero backend dependency, so this
// stays correct even while the backend redeploy question is still open.
//
// AI training crawlers blocked (2026-10-29, per Ryan: keep AI from copying the
// site's writing). These bots collect pages to train AI models and send no
// visitors. Search engines and the bots AI assistants use to look up and
// link sources while answering (OAI-SearchBot, ChatGPT-User,
// PerplexityBot, Claude-SearchBot, Claude-User) stay allowed, since those
// bring people to the site.
const AI_TRAINING_BOTS = [
  'GPTBot', // OpenAI training
  'ClaudeBot', // Anthropic training
  'anthropic-ai',
  'CCBot', // Common Crawl, used by many AI companies
  'Google-Extended', // Gemini training; doesn't affect Google Search
  'Applebot-Extended', // Apple AI training; doesn't affect Siri/Spotlight search
  'Meta-ExternalAgent', // Meta AI training
  'Bytespider', // ByteDance
  'Amazonbot',
  'cohere-ai',
  'Diffbot',
  'omgili',
];

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_TRAINING_BOTS, disallow: '/' },
    ],
    sitemap: 'https://brevardcoastalhomes.com/sitemap.xml',
  };
}
