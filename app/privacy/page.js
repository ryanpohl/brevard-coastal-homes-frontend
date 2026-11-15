import { withSocialPreview } from '@/lib/socialPreview';

// Privacy policy (2026-11-15, per Ryan). Google Ads lead forms require a
// privacy policy link, and the site already collects emails through its
// forms, alerts and guides. Plain language; Ryan reviews the wording.
export const metadata = withSocialPreview({
  title: 'Privacy Policy | Brevard Coastal Homes',
  description: 'How Brevard Coastal Homes collects, uses and protects the information you share on brevardcoastalhomes.com.',
  alternates: { canonical: '/privacy' },
});

const EFFECTIVE = 'November 15, 2026';

const h2 = { fontSize: 20, margin: '32px 0 10px', color: 'var(--color-ink)' };
const p = { fontSize: 15, lineHeight: 1.7, color: 'var(--color-muted-dark)', margin: '0 0 12px' };
const ul = { ...p, paddingLeft: 22 };

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: '48px clamp(16px, 4vw, 56px) 72px', maxWidth: 820 }}>
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 38px)', marginBottom: 6 }}>Privacy Policy</h1>
      <p style={{ ...p, fontSize: 13, color: 'var(--color-muted)' }}>Effective {EFFECTIVE}</p>

      <p style={p}>
        This policy explains what information Brevard Coastal Homes (Ryan Pohl, Realtor) collects through
        brevardcoastalhomes.com and through our ads, how we use it, and the choices you have. We never sell your
        information.
      </p>

      <h2 style={h2}>What we collect</h2>
      <ul style={ul}>
        <li>
          <strong>What you send us:</strong> your name, email address, phone number and message when you request a
          showing, ask a question, make an offer, sign up for listing alerts, request a guide or ask what your home is
          worth, including the property details you enter.
        </li>
        <li>
          <strong>Ad forms:</strong> your name, email and phone number if you fill out a form inside one of our Google
          ads.
        </li>
        <li>
          <strong>How you use the site:</strong> pages viewed, the search or ad that brought you here, and general
          device and browser information, collected through Google Analytics and Google Ads cookies.
        </li>
        <li>
          <strong>On your device:</strong> the site remembers a few things in your browser, such as an email you
          already signed up with and listings you viewed, so it doesn&apos;t ask you again.
        </li>
      </ul>

      <h2 style={h2}>How we use it</h2>
      <ul style={ul}>
        <li>To answer your questions, set up showings and help you buy or sell a home.</li>
        <li>To send what you asked for: guides, home value estimates, listing alerts and price-drop emails.</li>
        <li>
          To follow up after you request a guide, with a few emails of new listings in that area. Every email has a
          link to stop them.
        </li>
        <li>To understand which pages and ads are useful, so we can improve the site.</li>
      </ul>

      <h2 style={h2}>Who we share it with</h2>
      <p style={p}>
        We share your information only with the service providers that help run this site and our business: our
        email provider, our customer management system, Google (Analytics and Ads), and our website and listing data
        providers. They may use it only to provide those services to us. We may also share information when the law
        requires it. We do not sell or rent your information to anyone.
      </p>

      <h2 style={h2}>Your choices</h2>
      <ul style={ul}>
        <li>Every email we send has an unsubscribe link, and you can stop listing alerts at any time.</li>
        <li>
          You can ask us to show you, correct or delete the information we have about you by emailing{' '}
          <a href="mailto:Ryan@BrevardCoastalHomes.com">Ryan@BrevardCoastalHomes.com</a>.
        </li>
        <li>
          You can block or clear cookies in your browser settings, and opt out of Google Analytics with Google&apos;s
          browser add-on. The site still works without them.
        </li>
      </ul>

      <h2 style={h2}>How we protect it</h2>
      <p style={p}>
        Your information is sent over a secure (HTTPS) connection and kept only as long as we need it to help you or as
        the law requires. No method is perfectly secure, but we take reasonable steps to protect it.
      </p>

      <h2 style={h2}>Children</h2>
      <p style={p}>This site is meant for adults. We don&apos;t knowingly collect information from children under 13.</p>

      <h2 style={h2}>Changes</h2>
      <p style={p}>If we change this policy, we&apos;ll update it here with a new effective date.</p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>
        Questions about your information? Email <a href="mailto:Ryan@BrevardCoastalHomes.com">Ryan@BrevardCoastalHomes.com</a>{' '}
        or call or text <a href="tel:+13213507661">321-350-7661</a>.
      </p>
    </div>
  );
}
