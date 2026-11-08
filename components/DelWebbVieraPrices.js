import { DEL_WEBB_VIERA_COLLECTIONS, DEL_WEBB_VIERA_AS_OF } from '@/lib/delWebbViera';

/**
 * Del Webb at Viera new-home prices by collection (2026-11-08, per Ryan).
 * Same look as the Aripeka and Viera Builders tables (shares their CSS).
 */
export default function DelWebbVieraPrices() {
  return (
    <section className="aripeka-builders" aria-labelledby="del-webb-prices-title">
      <h2 id="del-webb-prices-title" className="aripeka-builders__title">
        Del Webb at Viera new-home prices ({DEL_WEBB_VIERA_AS_OF})
      </h2>
      <div className="aripeka-builders__scroll">
        <table className="aripeka-builders__table">
          <thead>
            <tr>
              <th scope="col">Collection</th>
              <th scope="col">Starts at</th>
              <th scope="col">Starting plan</th>
              <th scope="col">Plans up to</th>
            </tr>
          </thead>
          <tbody>
            {DEL_WEBB_VIERA_COLLECTIONS.map((c) => (
              <tr key={c.name}>
                <th scope="row">{c.name}</th>
                <td data-label="Starts at">{c.from}</td>
                <td data-label="Starting plan">
                  <strong>{c.plan}</strong>
                  <div className="aripeka-builders__specs">{c.specs}</div>
                  <div className="aripeka-builders__specs">{c.note}</div>
                </td>
                <td data-label="Plans up to">
                  {c.top || '—'}
                  {c.topPlan && <div className="aripeka-builders__specs">{c.topPlan}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="aripeka-builders__note">
        Del Webb’s starting prices, {DEL_WEBB_VIERA_AS_OF}. Options, upgrades and lot premiums add to the price, and Del Webb
        also sells move-in-ready homes, shown in the listings above. Prices change, so ask Ryan for current numbers, and
        contact Ryan before your first visit to the Del Webb sales center so he can represent you at no cost to you.
      </p>
    </section>
  );
}
