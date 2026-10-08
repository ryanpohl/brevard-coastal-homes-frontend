import Link from 'next/link';
import { condoBuildings, condoBuildingDetail } from '@/lib/condoBuildings';

// "{City} Condo Buildings" A–Z directory (2026-10-08, per Ryan) on the city
// /condos-for-sale page; links each building page in lib/condoBuildings.js.
// 4 columns of 5 on desktop (2 columns for 14 or fewer), 2 on phones
// (.condo-directory in globals.css).
export default function CondoBuildingDirectory({ citySlug, cityName, currentSlug = null, heading }) {
  const buildings = condoBuildings(citySlug).filter((b) => b.slug !== currentSlug);
  if (!buildings.length) return null;
  return (
    <section className="container" style={{ padding: '0 clamp(16px, 4vw, 56px) 48px', maxWidth: 1100 }}>
      <h2 className="market-report-title">{heading || `${cityName} Condo Buildings`}</h2>
      <p className="market-report-sub">
        Listings, recent sales, HOA fees and rental rules for {cityName}&rsquo;s most active condo buildings, A&ndash;Z.
      </p>
      <ul className={`condo-directory${buildings.length <= 14 ? ' condo-directory--two' : ''}`}>
        {buildings.map((b) => {
          const detail = condoBuildingDetail(b);
          return (
            <li key={b.slug}>
              <Link href={`/${citySlug}/condos/${b.slug}`} className="condo-directory-link">
                {b.name}
              </Link>
              {detail && <span className="condo-directory-detail">{detail}</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
