import Link from 'next/link';
import { notFound } from 'next/navigation';
import * as api from '@/lib/api';
import { formatPrice } from '@/lib/constants';
import { getMarketSnapshot } from '@/lib/marketSnapshot';
import { COMPARISONS, comparisonPath } from '@/lib/comparisons';
import ListingBreadcrumbs, { breadcrumbJsonLd } from '@/components/ListingBreadcrumbs';
import Faq from '@/components/Faq';

// "X vs. Y" comparison guide (2026-10-29, per Ryan) — content in
// lib/comparisons.js. The "By the numbers" table is live from the MLS:
// active listings now (getMarketSnapshot) and the past 12 months of sales
// (sold-stats), so it never goes stale.
const SITE_URL = 'https://brevardcoastalhomes.com';

export const revalidate = 3600;

export function generateStaticParams() {
  return Object.keys(COMPARISONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = COMPARISONS[slug];
  if (!c) return {};
  return { title: c.title, description: c.description, alternates: { canonical: comparisonPath(slug) } };
}

async function sideStats(stats) {
  const [homes, sold, condos, lots] = await Promise.all([
    getMarketSnapshot(stats.homes),
    api.getSoldStats(stats.homes).catch(() => null),
    stats.condos ? getMarketSnapshot(stats.condos) : null,
    stats.lots ? getMarketSnapshot(stats.lots) : null,
  ]);
  return { homes, sold, condos, lots };
}

const money = (n) => (typeof n === 'number' && n > 0 ? formatPrice(n) : '—');

function numberRows(c, a, b) {
  const rows = [
    ['Homes for sale now', a.homes?.count ?? '—', b.homes?.count ?? '—'],
    ['Median list price, homes', money(a.homes?.median), money(b.homes?.median)],
    ['Median sold price, past 12 months', money(a.sold?.medianPrice), money(b.sold?.medianPrice)],
    ['Homes sold, past 12 months', a.sold?.count ?? '—', b.sold?.count ?? '—'],
    ['Median sold price per sq ft', a.sold?.medianPerSqft ? `$${a.sold.medianPerSqft}` : '—', b.sold?.medianPerSqft ? `$${b.sold.medianPerSqft}` : '—'],
    ['Median days on market', a.sold?.medianDaysOnMarket ?? '—', b.sold?.medianDaysOnMarket ?? '—'],
  ];
  if (c.a.stats.condos || c.b.stats.condos) {
    rows.push(['Condos for sale now', a.condos?.count ?? '—', b.condos?.count ?? '—']);
    rows.push(['Median list price, condos', money(a.condos?.median), money(b.condos?.median)]);
  }
  if (c.a.stats.lots || c.b.stats.lots) {
    const lotCell = (side, s) =>
      s.stats.lots ? (side.lots?.count ? `${side.lots.count} from ${money(side.lots.low)}` : 'None right now') : 'Through the builders';
    rows.push(['Vacant lots on the MLS', lotCell(a, c.a), lotCell(b, c.b)]);
  }
  return rows;
}

function CompareTable({ caption, head, rows }) {
  return (
    <div className="compare-table">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col" />
            {head.map((h) => (
              <th scope="col" key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, ...cells]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {cells.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ComparePage({ params }) {
  const { slug } = await params;
  const c = COMPARISONS[slug];
  if (!c) notFound();

  const [a, b] = await Promise.all([sideStats(c.a.stats), sideStats(c.b.stats)]);
  const head = [c.a.name, c.b.name];
  const crumbs = [{ name: 'Home', href: '/' }, { name: c.h1 }];
  const updated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' });
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.title,
    description: c.description,
    url: `${SITE_URL}${comparisonPath(slug)}`,
    author: { '@type': 'Person', name: 'Ryan Pohl', url: `${SITE_URL}/about` },
    publisher: { '@type': 'Organization', name: 'Brevard Coastal Homes', url: SITE_URL },
  };

  return (
    <div className="container compare-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs, SITE_URL)) }} />
      <ListingBreadcrumbs items={crumbs} />
      <h1>{c.h1}</h1>
      <p className="compare-page__subtitle">{c.subtitle}</p>

      <div className="compare-page__answer">
        <div className="compare-page__answer-label">The short answer</div>
        <p>{c.shortAnswer}</p>
      </div>

      <CompareTable caption={`By the numbers · live from the MLS, updated ${updated}`} head={head} rows={numberRows(c, a, b)} />
      <CompareTable caption="At a glance" head={head} rows={c.facts} />

      {c.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.text.map((t) => (
            <p key={t.slice(0, 32)}>{t}</p>
          ))}
        </section>
      ))}

      <h2>Which one fits you?</h2>
      <div className="compare-page__choose">
        {[
          [c.a, c.chooseA],
          [c.b, c.chooseB],
        ].map(([side, reasons]) => (
          <div key={side.name} className="compare-page__choose-card">
            <h3>Choose {side.name} if…</h3>
            <ul>
              {reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <Link href={side.homesHref}>See {side.name} homes for sale →</Link>
          </div>
        ))}
      </div>

      <div className="open-house-page__cta compare-page__cta">
        <strong>Still deciding between {c.a.name} and {c.b.name}?</strong> Ryan can show you homes in both on the same day. Call or text{' '}
        <a href="tel:+13213507661">321-350-7661</a>.
      </div>

      <Faq items={c.faq} />

      <p className="compare-page__links">
        <Link href={c.a.href}>{c.a.name} homes for sale →</Link>
        <Link href={c.b.href}>{c.b.name} homes for sale →</Link>
      </p>
    </div>
  );
}
