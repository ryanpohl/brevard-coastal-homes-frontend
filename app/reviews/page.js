import Link from 'next/link';
import ContactUsTrigger from '@/components/ContactUsTrigger';

/**
 * Client Reviews / Testimonials page (2026-09-25, per Ryan — Task #67 from
 * the SEO suggestions list; previously deferred because it needed real
 * review content from Ryan, which was blocked on him having enough
 * reviews).
 *
 * When Ryan asked whether he should wait for more than his current 6
 * Google reviews before building this page, the answer given was no:
 * Google stopped allowing star-rating rich snippets from a business's OWN
 * on-site review markup back in 2019 (only third-party sites like Google,
 * Zillow, Realtor.com can trigger those), so this page's job is trust/
 * conversion for a visitor already on the site, not a ranking lever by
 * itself — six specific, clearly-real testimonials do that job fine, and
 * more can be added later the same way the other guide pages get updated.
 * That's also why this file deliberately does NOT add Review/
 * AggregateRating JSON-LD schema: marking up a business's own reviews of
 * itself on its own site is explicitly against Google's structured data
 * guidelines (self-serving review snippets), so adding it would be, at
 * best, ignored, and at worst read as a spam signal — not worth the risk
 * for a page whose real job is human trust, not schema.
 *
 * The 6 reviews below are transcribed verbatim from screenshots Ryan sent
 * of his Google Business Profile (5.0 stars, 6 reviews, confirmed live via
 * the actual Google listing — see the CID link below). Two reviews
 * (Chris Harwood, Daniel Bajer) were truncated by Google's own "... More"
 * UI in the screenshot; only the visible text is quoted here rather than
 * guessing at the rest. Relative timestamps ("a week ago", "20 hours ago")
 * and each reviewer's own review/photo counts were deliberately left out
 * of the quotes themselves — both go stale immediately on a static page,
 * unlike the quotes.
 *
 * GOOGLE_REVIEWS_URL is Brevard Coastal Homes' actual Google Business
 * Profile, resolved from Ryan's share.google link to a stable
 * maps?cid=... permalink (CID decoded from the Google-native
 * 0x...:0x... feature id): https://www.google.com/maps?cid=4331176909618130834
 * — confirmed live 2026-09-25 (name, 5.0★, 6 reviews all matched).
 */
export const metadata = {
  title: 'Client Reviews | Brevard Coastal Homes',
  description:
    'Real client reviews for Ryan Pohl and Brevard Coastal Homes — see what buyers and sellers across Brevard County say about working with us.',
  alternates: { canonical: '/reviews' },
};

const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps?cid=4331176909618130834';

const REVIEWS = [
  {
    name: 'Chris Harwood',
    quote:
      'Ryan knows real estate. Not just a guy to open doors, he is data driven, a skilled negotiator and will go above and beyond to achieve his clients goals. Always super friendly and knowledgeable. As a bonus, his website is best in class.',
  },
  {
    name: 'Angelica Leach',
    quote:
      "Ryan makes everyone around him feel welcome and at ease. He's incredibly knowledgeable, hardworking, attentive, and genuinely cares about the people he works with. He goes above and beyond for his clients, and his dedication to making sure they're taken care of really shows. I truly can't recommend him enough!",
  },
  {
    name: 'Kate Mitchell',
    quote:
      'I have worked with Ryan on several transactions over the past 2 years, and have found him to be honest, knowledgeable, and dedicated to his clients. He is quick to answer questions and return phone calls. Highly recommend.',
  },
  {
    name: 'Daniel Bajer',
    quote:
      'Ryan went above and beyond to help us find a 2nd home in Melbourne FL. We were not from the area, Ryan spent plenty of time helping us to decide on a beautiful home that would be best for our Family. Ryan was also easy to get in touch with.',
  },
  {
    name: 'Tariq Abou-Bakr',
    quote: 'Ryan does amazing work he truly makes the whole process so easy and care free.',
  },
  {
    name: 'Duncan Mitchell',
    quote: 'Ryan is extremely knowledgeable and is always willing to go above and beyond for his clients.',
  },
];

export default function ReviewsPage() {
  return (
    <div className="container" style={{ padding: '32px clamp(16px, 4vw, 56px) 64px', maxWidth: 860 }}>
      <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12, fontFamily: 'var(--font-inter-tight)' }}>
        What Our Clients Say
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-muted-dark)', marginBottom: 12 }}>
        Ryan Pohl has a 5.0-star rating on Google from buyers and sellers across Brevard County. Here are a few of
        their reviews, in their own words.
      </p>
      <p style={{ fontSize: 15, marginBottom: 36 }}>
        <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>
          Read all reviews on Google, or leave your own →
        </a>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 48 }}>
        {REVIEWS.map((review) => (
          <div key={review.name} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div aria-hidden="true" style={{ color: 'var(--color-gold, #c9a15a)', fontSize: 16, letterSpacing: 2 }}>
              ★★★★★
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-muted-dark)', flexGrow: 1 }}>
              &ldquo;{review.quote}&rdquo;
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-inter-tight)' }}>{review.name}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 16, marginBottom: 14 }}>Ready to work with a top-rated Brevard County agent?</p>
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
