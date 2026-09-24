/**
 * Collapsed, tap-to-open FAQ accordion (2026-09-24, per Ryan: "Add a
 * collapsed FAQ at the bottom, below the listings. Show 4-5 questions that
 * open when tapped. It takes almost no space on mobile, and Google still
 * reads the hidden text.") — native <details>/<summary> rather than a
 * client-side accordion, on purpose: it works with zero JavaScript (no
 * 'use client' needed), is keyboard/screen-reader accessible for free, and
 * the answer text is still present in the server-rendered HTML while
 * closed, so it's indexable even though it's visually collapsed.
 *
 * Also emits FAQPage JSON-LD (same "Schema Markup" pattern as the
 * homepage's Organization/WebSite JSON-LD in app/page.js and the
 * per-listing JSON-LD in the city/neighborhood pages) so these questions
 * are eligible for Google's FAQ rich results and the kind of direct
 * quoting ChatGPT/Claude do from structured Q&A content.
 *
 * Used both in the collapsed accordion at the bottom of a city's listings
 * pages and again, same items, near the bottom of that city's Area Guide
 * page — see lib/constants.js's CITY_LISTINGS_FAQ for the content and the
 * sourcing notes on how each answer was arrived at.
 */
export default function Faq({ items, heading = 'Frequently Asked Questions' }) {
  if (!items || items.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 style={{ fontSize: 22, marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>{heading}</h2>
      <div>
        {items.map((item, i) => (
          <details key={i} className="faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
