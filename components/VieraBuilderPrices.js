import Link from 'next/link';
import { VIERA_BUILDERS_PRICES, VIERA_BUILDERS_AS_OF } from '@/lib/vieraBuilders';

/**
 * Viera Builders starting prices by neighborhood (2026-11-07, per Ryan).
 * Same look as the Aripeka builder table (shares its CSS). On a
 * neighborhood's own page, that neighborhood is listed first.
 */
export default function VieraBuilderPrices({ slug }) {
  const rows = [...VIERA_BUILDERS_PRICES].sort((a, b) => (a.slug === slug ? -1 : b.slug === slug ? 1 : 0));
  return (
    <section className="aripeka-builders" aria-labelledby="viera-builders-title">
      <h2 id="viera-builders-title" className="aripeka-builders__title">
        Viera Builders starting prices ({VIERA_BUILDERS_AS_OF})
      </h2>
      <div className="aripeka-builders__scroll">
        <table className="aripeka-builders__table">
          <thead>
            <tr>
              <th scope="col">Neighborhood</th>
              <th scope="col">Starts at</th>
              <th scope="col">Starting plan</th>
              <th scope="col">Plans up to</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.slug}>
                <th scope="row">
                  {c.slug === slug ? c.name : <Link href={c.href || `/neighborhoods/${c.slug}`}>{c.name}</Link>}
                </th>
                <td data-label="Starts at">
                  {c.remainingOnly ? <Link href={c.href} style={{ textDecoration: 'underline' }}>{c.from}</Link> : c.from}
                </td>
                <td data-label="Starting plan">
                  <strong>{c.plan}</strong>
                  <div className="aripeka-builders__specs">{c.specs}</div>
                  <div className="aripeka-builders__specs">{c.note}</div>
                </td>
                <td data-label="Plans up to">
                  {c.remainingOnly ? '—' : c.top}
                  {!c.remainingOnly && <div className="aripeka-builders__specs">{c.topPlan}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="aripeka-builders__note">
        Viera Builders’ base prices, {VIERA_BUILDERS_AS_OF}, for each plan’s standard elevation; other elevations, options
        and lot premiums add to the price. Prices change, so ask Ryan for current numbers, and contact Ryan before your first
        visit to a Viera Builders model so he can represent you at no cost to you.
      </p>
    </section>
  );
}
