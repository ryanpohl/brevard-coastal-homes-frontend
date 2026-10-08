import { formatPrice } from '@/lib/siteConstants';

// "{Name} Real Estate Market" stats bar — see lib/neighborhoodMarketStats.js.
// Reuses the city Market Snapshot's tile styles (.market-*).
const NOUNS = { Home: ['Homes', 'home'], Land: ['Homesites', 'homesite'], Condo: ['Condos', 'condo'] };

export default function NeighborhoodMarketStats({ name, stats }) {
  if (!stats) return null;
  const sold = stats.sold && stats.sold.count ? stats.sold : null;
  const land = stats.land && stats.land.count ? stats.land : null;
  const [plural, single] = NOUNS[stats.kind] || [null, 'home'];
  const n = (v) => v.toLocaleString('en-US');
  const tiles = land
    ? [
        { label: 'Homes for sale', value: n(stats.count) },
        stats.medianListPrice ? { label: 'Median home list price', value: formatPrice(stats.medianListPrice) } : null,
        { label: 'Homesites for sale', value: n(land.count) },
        land.medianListPrice ? { label: 'Median homesite price', value: formatPrice(land.medianListPrice) } : null,
        sold ? { label: 'Homes sold in the last 12 months', value: n(sold.count) } : null,
        sold?.medianPrice ? { label: 'Median sold home price', value: formatPrice(sold.medianPrice) } : null,
      ]
    : [
        { label: plural ? `${plural} for sale` : 'For sale now', value: n(stats.count) },
        stats.medianListPrice ? { label: 'Median list price', value: formatPrice(stats.medianListPrice) } : null,
        sold ? { label: 'Sold in the last 12 months', value: n(sold.count) } : null,
        sold?.medianPrice ? { label: 'Median sold price', value: formatPrice(sold.medianPrice) } : null,
        sold?.medianPerSqft && stats.kind !== 'Land' ? { label: 'Median sold price / sq ft', value: formatPrice(sold.medianPerSqft) } : null,
      ];
  const shown = tiles.filter(Boolean);
  return (
    <section className="market-report neighborhood-market-stats" style={{ margin: '4px 0 20px' }}>
      <h2 className="market-report-title" style={{ fontSize: 20 }}>
        {name} Real Estate Market
      </h2>
      <p className="market-report-sub">Space Coast MLS · listings updated hourly, sales daily</p>
      <div className={`market-tiles${shown.length === 6 ? ' market-tiles--six' : ''}`}>
        {shown.map((t) => (
          <div key={t.label} className="market-tile">
            <div className="market-tile-value">{t.value}</div>
            <div className="market-tile-label">{t.label}</div>
          </div>
        ))}
      </div>
      {sold?.medianSaleToListPct ? (
        <p className="market-report-note" style={{ fontSize: 14, marginTop: 10 }}>
          The typical {name} {single} sold for {sold.medianSaleToListPct}% of its final asking price
          {sold.medianDaysOnMarket != null ? <> after about {sold.medianDaysOnMarket} days on the market</> : null}.
        </p>
      ) : null}
    </section>
  );
}
