import Link from 'next/link';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * Buyer Resources hub page (2026-09-25, per Ryan — Task #68 from the SEO
 * suggestions list). Built after the Buyer Guides footer column reached 6
 * links (down payment assistance, flood insurance, hurricane insurance,
 * property taxes, moving to Brevard, VA loans) and Ryan said to stop
 * growing that column further and build this instead: "Lets stop at 6
 * with the Buyers Guides. task #68 next."
 *
 * This is a pillar/index page linking to all 6 existing guides — it
 * doesn't duplicate their content, just gives each one a short summary and
 * a link, plus gives search engines and visitors a single, stable place
 * that lists every guide (useful as the site adds more guides later
 * without growing the footer further). Per Ryan's explicit choice (see
 * clarifying question asked before building this), this page is linked
 * from the footer's Buyer Guides column as its own 7th entry, ABOVE the 6
 * direct guide links rather than replacing them — so a visitor can still
 * jump straight to any one guide from the footer, or land here for the
 * full list.
 *
 * GUIDES array order matches the footer's existing link order.
 */
export const metadata = {
  title: 'Buyer Resources: Guides for Brevard County Home Buyers | Brevard Coastal Homes',
  description:
    'Every buyer guide in one place — down payment assistance, flood & hurricane insurance, property taxes, relocating to Brevard County, and VA home loans.',
  alternates: { canonical: '/buyer-resources' },
};

const GUIDES = [
  {
    title: 'Down Payment Assistance',
    href: '/down-payment-assistance',
    description:
      'Every down payment assistance program available to Brevard County buyers — county, HFA, and Florida Hometown Heroes grants.',
  },
  {
    title: 'Flood Zones & Insurance',
    href: '/flood-insurance',
    description:
      'How Brevard County flood zones work, what NFIP flood insurance actually costs, and how to find out if a specific property needs it.',
  },
  {
    title: 'Hurricane Insurance',
    href: '/hurricane-insurance',
    description:
      'Wind vs. flood coverage, the hurricane deductible, wind mitigation credits, and Citizens Property Insurance Corporation explained.',
  },
  {
    title: 'Property Taxes & Homestead Exemption',
    href: '/property-taxes',
    description:
      'How Brevard County property taxes are calculated, the homestead exemption, Save Our Homes cap, and portability.',
  },
  {
    title: 'Moving to Brevard County',
    href: '/moving-to-brevard',
    description:
      'A relocation guide covering major employers, commute times, climate, and what to do to become a Florida resident after you buy.',
  },
  {
    title: 'VA Home Loans',
    href: '/va-loans',
    description:
      'VA loan eligibility, the funding fee, Florida-specific appraisal quirks, and property tax exemptions for veterans.',
  },
];

export default function BuyerResourcesPage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 860 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        Buyer Resources
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 40 }}>
        Everything we&apos;ve put together to help you buy in Brevard County with confidence — insurance, taxes,
        financing, and what to expect moving here. Pick a topic below.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
        {GUIDES.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="card"
            style={{ padding: 24, display: 'block', color: 'inherit', textDecoration: 'none' }}
          >
            <h2 style={{ fontSize: 19, marginBottom: 8, fontFamily: 'var(--font-inter-tight)' }}>{guide.title}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
              {guide.description}
            </p>
            <span style={{ fontSize: 14, fontWeight: 600, textDecoration: 'underline' }}>Read the guide →</span>
          </Link>
        ))}
      </div>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Ready to start your search, or have a question first?</p>
        <p style={{ fontSize: 15 }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
            Browse Brevard County Listings →
          </Link>
        </p>
        <p style={{ fontSize: 15, marginTop: 10 }}>
          <strong>
            <ContactUsTrigger>Contact Us</ContactUsTrigger>
          </strong>
        </p>
      </div>
    </div>
  );
}
