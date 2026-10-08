import { formatPrice } from '@/lib/siteConstants';

// "{Name} Real Estate Market" stats bar — see lib/neighborhoodMarketStats.js.
// Reuses the city Market Snapshot's tile styles (.market-*).
export default function NeighborhoodMarketStats({ name, stats }) {
  if (!stats) return null;
  const sold = stats.sold && stats.sold.count ? stats.sold : null;
  const tiles = [
    { label: 'For sale now', value: stats.activeCount.toLocaleString('en-US') },
    stats.medianListPrice ? { label: 'Median list price', value: formatPrice(stats.medianListPrice) } : null,
    sold ? { label: 'Sold in the last 12 months', value: sold.count.toLocaleString('en-US') } : null,
    sold?.medianPrice ? { label: 'Median sold price', value: formatPrice(sold.medianPrice) } : null,
    sold?.medianPerSqft ? { label: 'Median sold price / sq ft', value: formatPrice(sold.medianPerSqft) } : null,
  ].filter(Boolean);
  return (
    <section className="market-report neighborhood-market-stats" style={{ margin: '4px 0 20px' }}>
      <h2 className="market-report-title" style={{ fontSize: 20 }}>
        {name} Real Estate Market
      </h2>
      <p className="market-report-sub">Space Coast MLS · listings updated hourly, sales daily</p>
      <div className="market-tiles">
        {tiles.map((t) => (
          <div key={t.label} className="market-tile">
            <div className="market-tile-value">{t.value}</div>
            <div className="market-tile-label">{t.label}</div>
          </div>
        ))}
      </div>
      {sold?.medianSaleToListPct ? (
        <p className="market-report-note" style={{ fontSize: 14, marginTop: 10 }}>
          The typical {name} home sold for {sold.medianSaleToListPct}% of its final asking price
          {sold.medianDaysOnMarket != null ? <> after about {sold.medianDaysOnMarket} days on the market</> : null}.
        </p>
      ) : null}
    </section>
  );
}
