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

// Places compared: `places` (any number, 2026-11-10: the four beach towns)
// or the original two-sided `a`/`b` with `chooseA`/`chooseB`.
function placesOf(c) {
  return c.places || [
    { ...c.a, choose: c.chooseA },
    { ...c.b, choose: c.chooseB },
  ];
}

function joinNames(names) {
  return names.length <= 2 ? names.join(' and ') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function numberRows(places, stats) {
  const col = (fn) => stats.map(fn);
  const rows = [
    ['Homes for sale now', ...col((x) => x.homes?.count ?? '—')],
    ['Median list price, homes', ...col((x) => money(x.homes?.median))],
    ['Median sold price, past 12 months', ...col((x) => money(x.sold?.medianPrice))],
    ['Homes sold, past 12 months', ...col((x) => x.sold?.count ?? '—')],
    ['Median sold price per sq ft', ...col((x) => (x.sold?.medianPerSqft ? `$${x.sold.medianPerSqft}` : '—'))],
    ['Median days on market', ...col((x) => x.sold?.medianDaysOnMarket ?? '—')],
  ];
  if (places.some((pl) => pl.stats.condos)) {
    rows.push(['Condos for sale now', ...col((x) => x.condos?.count ?? '—')]);
    rows.push(['Median list price, condos', ...col((x) => money(x.condos?.median))]);
  }
  if (places.some((pl) => pl.stats.lots)) {
    rows.push([
      'Vacant lots on the MLS',
      ...places.map((pl, i) =>
        pl.stats.lots ? (stats[i].lots?.count ? `${stats[i].lots.count} from ${money(stats[i].lots.low)}` : 'None right now') : 'Through the builders'
      ),
    ]);
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

  const places = placesOf(c);
  const stats = await Promise.all(places.map((pl) => sideStats(pl.stats)));
  const head = places.map((pl) => pl.name);
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

      <CompareTable caption={`By the numbers · live from the MLS, updated ${updated}`} head={head} rows={numberRows(places, stats)} />
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
        {places.map((side) => [side, side.choose]).map(([side, reasons]) => (
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
        <strong>Still deciding between {joinNames(head)}?</strong> Ryan can show you homes in {places.length > 2 ? 'all of them' : 'both'} on the same day. Call or text{' '}
        <a href="tel:+13213507661">321-350-7661</a>.
      </div>

      <Faq items={c.faq} />

      <p className="compare-page__links">
        {places.map((pl) => (
          <Link key={pl.name} href={pl.href}>
            {pl.name} homes for sale →
          </Link>
        ))}
      </p>
    </div>
  );
}
