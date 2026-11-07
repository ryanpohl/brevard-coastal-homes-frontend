import { ARIPEKA_BUILDERS, ARIPEKA_BUILDERS_AS_OF } from '@/lib/aripekaBuilders';

/**
 * Aripeka builder starting prices table (2026-11-05, per Ryan, from his
 * meetings with each builder). Lot included; dated, since prices change.
 */
export default function AripekaBuilderPrices() {
  return (
    <section className="aripeka-builders" aria-labelledby="aripeka-builders-title">
      <h2 id="aripeka-builders-title" className="aripeka-builders__title">
        Aripeka builder starting prices ({ARIPEKA_BUILDERS_AS_OF})
      </h2>
      <div className="aripeka-builders__scroll">
        <table className="aripeka-builders__table">
          <thead>
            <tr>
              <th scope="col">Builder</th>
              <th scope="col">Starts at (lot included)</th>
              <th scope="col">Starting plan</th>
              <th scope="col">Build time</th>
            </tr>
          </thead>
          <tbody>
            {ARIPEKA_BUILDERS.map((b) => (
              <tr key={b.name}>
                <th scope="row">{b.name}</th>
                <td data-label="Starts at (lot included)">{b.from}</td>
                <td data-label="Starting plan">
                  <strong>{b.plan}</strong>
                  <div className="aripeka-builders__specs">{b.specs}</div>
                  {b.model && <div className="aripeka-builders__specs">Model home: {b.model}</div>}
                </td>
                <td data-label="Build time">{b.build}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="aripeka-builders__note">
        From each builder, {ARIPEKA_BUILDERS_AS_OF}. Build time is from contract to move-in. Prices and plans change, so ask
        Ryan for current numbers, and contact Ryan before your first visit to a builder’s model home so he can represent you
        at no cost to you.
      </p>
    </section>
  );
}
