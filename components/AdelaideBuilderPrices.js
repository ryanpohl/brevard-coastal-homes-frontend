import { ADELAIDE_BUILDERS, ADELAIDE_BUILDERS_AS_OF } from '@/lib/adelaideBuilders';

/**
 * Adelaide builder starting prices table (2026-11-05, per Ryan, from his
 * builders). Dated, since prices change. See lib/adelaideBuilders.js.
 */
export default function AdelaideBuilderPrices() {
  return (
    <section className="aripeka-builders" aria-labelledby="adelaide-builders-title">
      <h2 id="adelaide-builders-title" className="aripeka-builders__title">
        Adelaide builder starting prices ({ADELAIDE_BUILDERS_AS_OF})
      </h2>
      <div className="aripeka-builders__scroll">
        <table className="aripeka-builders__table">
          <thead>
            <tr>
              <th scope="col">Builder</th>
              <th scope="col">Starts at</th>
              <th scope="col">Starting plan</th>
              <th scope="col">Build time</th>
            </tr>
          </thead>
          <tbody>
            {ADELAIDE_BUILDERS.map((b) => (
              <tr key={b.name}>
                <th scope="row">{b.name}</th>
                <td data-label="Starts at">{b.from}</td>
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
        From the builders, {ADELAIDE_BUILDERS_AS_OF}. Build time is from contract to move-in. Prices and plans change, so ask
        Ryan for current numbers, and contact Ryan before your first visit to a builder’s model home so he can represent you
        at no cost to you.
      </p>
    </section>
  );
}
