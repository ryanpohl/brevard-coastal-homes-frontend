import Link from 'next/link';
import {
  VIERA_BUILDERS_PRICES,
  VIERA_BUILDERS_AS_OF,
  VIERA_BUILDERS_BUILD_TIME,
  VIERA_BUILDERS_MODEL_HOURS,
  VIERA_BUILDERS_INCENTIVE,
  vieraBuilderPrice,
} from '@/lib/vieraBuilders';

/**
 * Viera Builders prices by neighborhood (2026-11-07, per Ryan), with build
 * time, models, incentive and quick move-in homes from his Viera Builders
 * contact (2026-11-08). Same look as the Aripeka builder table (shares its
 * CSS). On a neighborhood's own page, that neighborhood is listed first and
 * its quick move-in homes are listed below the table.
 */
export default function VieraBuilderPrices({ slug }) {
  const rows = [...VIERA_BUILDERS_PRICES].sort((a, b) => (a.slug === slug ? -1 : b.slug === slug ? 1 : 0));
  const own = vieraBuilderPrice(slug);
  return (
    <section className="aripeka-builders" aria-labelledby="viera-builders-title">
      <h2 id="viera-builders-title" className="aripeka-builders__title">
        Viera Builders prices ({VIERA_BUILDERS_AS_OF})
      </h2>
      <div className="aripeka-builders__scroll">
        <table className="aripeka-builders__table">
          <thead>
            <tr>
              <th scope="col">Neighborhood</th>
              <th scope="col">Starts at</th>
              <th scope="col">Starting plan</th>
              <th scope="col">Up to</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.slug}>
                <th scope="row">
                  {c.slug === slug ? c.name : <Link href={c.href || `/neighborhoods/${c.slug}`}>{c.name}</Link>}
                  {c.model && <div className="aripeka-builders__specs">Model: {c.model}</div>}
                </th>
                <td data-label="Starts at">{c.from}</td>
                <td data-label="Starting plan">
                  <strong>{c.plan}</strong>
                  <div className="aripeka-builders__specs">{c.specs}</div>
                  <div className="aripeka-builders__specs">{c.note}</div>
                </td>
                <td data-label="Up to">
                  {c.top}
                  {c.topPlan && <div className="aripeka-builders__specs">{c.topPlan}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="aripeka-builders__note">
        <strong>Build time:</strong> about {VIERA_BUILDERS_BUILD_TIME} from contract to move-in.{' '}
        <strong>Incentive:</strong> {VIERA_BUILDERS_INCENTIVE}.{' '}
        <strong>Models:</strong> open {VIERA_BUILDERS_MODEL_HOURS}.
      </p>

      {own?.quickMoveIns?.length > 0 && (
        <>
          <h3 className="aripeka-builders__title" style={{ fontSize: 20, marginTop: 24 }}>
            Quick move-in homes in {own.name}
          </h3>
          <div className="aripeka-builders__scroll">
            <table className="aripeka-builders__table">
              <thead>
                <tr>
                  <th scope="col">Address</th>
                  <th scope="col">Plan</th>
                  <th scope="col">Status</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {own.quickMoveIns.map((h) => (
                  <tr key={h.address}>
                    <th scope="row">{h.address}</th>
                    <td data-label="Plan">
                      <strong>{h.plan}</strong>
                      <div className="aripeka-builders__specs">{h.specs}</div>
                    </td>
                    <td data-label="Status">{h.status}</td>
                    <td data-label="Price">{h.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="aripeka-builders__note">
        Prices from Viera Builders, {VIERA_BUILDERS_AS_OF}: base prices for each plan’s standard elevation (other
        elevations, options and lot premiums add to the price) and promo prices on its quick move-in list. Prices and
        availability change often, so ask Ryan for current numbers, and contact Ryan before your first visit to a Viera
        Builders model so he can represent you at no cost to you.
      </p>
    </section>
  );
}
