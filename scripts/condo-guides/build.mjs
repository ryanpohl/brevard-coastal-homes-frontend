// Condo building guides (2026-11-14, per Ryan): one PDF per beach town
// comparing every condo building the site tracks (lib/condoBuildings.js),
// with live MLS numbers. This writes the guide HTML into the backend repo
// (assets/guides/neighborhoods/<town>-condos.html); the backend's
// scripts/build-neighborhood-guides.js turns it into the PDF.
//
// Rebuild every month or two so the numbers stay fresh:
//   NODE_USE_ENV_PROXY=1 node --import ./scripts/condo-guides/loader.mjs scripts/condo-guides/build.mjs [town ...]
//   cd ../brevard-coastal-homes-backend && NODE_PATH=... node scripts/build-neighborhood-guides.js cocoa-beach-condos ...
import fs from 'node:fs';
import path from 'node:path';

const { condoBuildings, getCondoBuildingComparison } = await import('../../lib/condoBuildings.js');
const api = await import('../../lib/api.js');
const { cityListingsQueryParams } = await import('../../lib/constants.js');

const OUT = path.resolve(process.cwd(), '../brevard-coastal-homes-backend/assets/guides/neighborhoods');
const FRONT = process.cwd();

// Town name, page and cover photo (from public/place-photos; none for Cape Canaveral yet).
const TOWNS = {
  'cocoa-beach': { name: 'Cocoa Beach', photo: 'cocoa-beach-pier.jpg', alt: 'The Cocoa Beach Pier' },
  'satellite-beach': { name: 'Satellite Beach', photo: 'satellite-beach.jpg', alt: 'Satellite Beach' },
  'indian-harbour-beach': { name: 'Indian Harbour Beach', photo: 'indian-harbour-beach.jpg', alt: 'Indian Harbour Beach' },
  indialantic: { name: 'Indialantic', photo: 'indialantic.jpg', alt: 'Indialantic' },
  'cape-canaveral': { name: 'Cape Canaveral', photo: null, alt: '' },
  'melbourne-beach': { name: 'Melbourne Beach', photo: 'melbourne-beach.jpg', alt: 'Melbourne Beach' },
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (n) => (n ? `$${Math.round(n).toLocaleString('en-US')}` : '—');
const short = (n) => (!n ? '—' : n >= 1e6 ? `$${(n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/0$/, '')}M` : `$${Math.round(n / 1000)}K`);
const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' });
const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/New_York' });

function where(b) {
  if (b.oceanfront) return 'Oceanfront';
  // Whole communities (Aquarina, Harbor Island Beach Club, Beach Woods) use their own label.
  if (b.detail) return b.detail === 'Gated community' ? 'Gated, ocean to river' : b.detail;
  if (b.near) return b.near.replace(/^on the /, '').replace(/^./, (c) => c.toUpperCase());
  return 'Off the ocean';
}
function built(b) {
  return b.newConstruction ? 'New' : b.built || '—';
}
// "3 Months" → months, for grouping by rental rules.
function rentalMonths(r) {
  if (!r) return null;
  const m = /(\d+)\s*(day|week|month|year)/i.exec(r);
  if (!m) return null;
  const n = Number(m[1]);
  return { day: n / 30, week: (n * 7) / 30, month: n, year: n * 12 }[m[2].toLowerCase()];
}

async function townSummary(citySlug) {
  const base = { ...cityListingsQueryParams(citySlug), propertyType: 'Condo' };
  const prices = [];
  let page = 1;
  let total = 0;
  for (;;) {
    const r = await api.getListings({ ...base, pageSize: 100, page });
    total = r.total ?? total;
    (r.results || []).forEach((l) => l.price > 0 && prices.push(l.price));
    if (page >= (r.totalPages || 1) || page >= 6) break;
    page += 1;
  }
  prices.sort((a, b) => a - b);
  const ocean = await api.getListings({ ...base, waterfront: 'Oceanfront', pageSize: 1 }).catch(() => null);
  const sold = await api.getSoldStats({ ...base, closedWithinDays: 365 }).catch(() => null);
  return {
    forSale: total,
    medianAsk: prices.length ? prices[Math.floor(prices.length / 2)] : null,
    low: prices[0],
    high: prices[prices.length - 1],
    oceanfront: ocean?.total ?? null,
    sold,
  };
}

function page(n, eyebrow, title, body, town) {
  return `<section class="page">
  <div class="eyebrow">${eyebrow}</div>
  <h2>${title}</h2>
  <div class="gold-rule"></div>
${body}
  <div class="footer"><span>The ${esc(town.name)} Condo Guide</span><span>brevardcoastalhomes.com/${town.slug}/condos-for-sale</span></div>
</section>`;
}

function list(rows, empty) {
  if (!rows.length) return `<p class="note">${empty}</p>`;
  return `<p class="inline">${rows.map((r) => `${esc(r.building.name)}${r.extra ? ` <span class="n">(${r.extra})</span>` : ''}`).join(' &middot; ')}</p>`;
}

async function build(citySlug) {
  const town = { ...TOWNS[citySlug], slug: citySlug };
  const rows = await getCondoBuildingComparison(citySlug);
  if (!rows) throw new Error(`No comparison data for ${citySlug}`);
  const s = await townSummary(citySlug);
  const byName = [...rows].sort((a, z) => a.building.name.replace(/^The /, '').localeCompare(z.building.name.replace(/^The /, '')));
  const year = new Date().getFullYear();

  // Cover photo copied next to the HTML.
  let coverImg = '';
  if (town.photo) {
    fs.mkdirSync(path.join(OUT, 'img'), { recursive: true });
    fs.copyFileSync(path.join(FRONT, 'public/place-photos', town.photo), path.join(OUT, 'img', `${citySlug}-condos-cover.jpg`));
    coverImg = `<img src="img/${citySlug}-condos-cover.jpg" alt="${esc(town.alt)}" />`;
  }

  const PER_PAGE = 13;
  const tableFor = (part) => `<table class="t small">
    <tr><th>Building</th><th>Where</th><th>Built</th><th>For sale now</th><th>Median sold, 12 mo.</th><th>HOA / mo.</th><th>Rental minimum</th></tr>
    ${part
      .map(
        (r) => `<tr><td>${esc(r.building.name)}${r.building.address ? `<div class="addr">${esc(r.building.address)}</div>` : ''}</td><td>${esc(where(r.building))}</td><td>${built(r.building)}</td><td>${
          r.forSale ? `${r.forSale}: ${r.low === r.high ? short(r.low) : `${short(r.low)}–${short(r.high)}`}` : 'None'
        }</td><td>${r.soldMedian ? `${short(r.soldMedian)} <span class="n">(${r.soldCount})</span>` : '—'}</td><td>${r.feeMedian ? money(r.feeMedian) : '—'}</td><td>${esc(r.rentalMinimum || '—')}</td></tr>`
      )
      .join('')}
  </table>`;
  const tableNote = `<p class="note">For sale now: listings and asking prices as of ${today}. Median sold: closed sales in the last 12 months (number of sales in brackets). HOA: the typical monthly fee in recent listings and sales. Rental minimum: the shortest rental term most often shown in the building&rsquo;s MLS listings; confirm current rules with the association. All from Space Coast MLS records.</p>`;
  const parts = [];
  for (let i = 0; i < byName.length; i += PER_PAGE) parts.push(byName.slice(i, i + PER_PAGE));

  const shortStay = rows.filter((r) => { const m = rentalMonths(r.rentalMinimum); return m != null && m <= 1; }).map((r) => ({ ...r, extra: esc(r.rentalMinimum.toLowerCase()) }));
  const yearLong = rows.filter((r) => { const m = rentalMonths(r.rentalMinimum); return m != null && m >= 12; }).map((r) => ({ ...r, extra: esc(r.rentalMinimum.toLowerCase()) }));
  const newer = rows.filter((r) => r.building.newConstruction || r.building.built >= 2000).map((r) => ({ ...r, extra: r.building.newConstruction ? 'new' : `${r.building.built}` }));
  const older = rows.filter((r) => r.building.built && r.building.built <= 1985).sort((a, z) => a.building.built - z.building.built).map((r) => ({ ...r, extra: `${r.building.built}` }));
  const oceanfront = rows.filter((r) => r.building.oceanfront).length;

  const soldLine = s.sold?.count
    ? `<div class="fact"><b>${short(s.sold.medianPrice)}</b><span>Median condo sold price; ${s.sold.count} sold in the last 12 months</span></div>`
    : '';
  const facts = `<div class="facts">
    <div class="fact"><b>${s.forSale} condos for sale</b><span>Median asking ${short(s.medianAsk)}, from ${short(s.low)} to ${short(s.high)}</span></div>
    ${soldLine}
    ${s.oceanfront != null ? `<div class="fact"><b>${s.oceanfront} oceanfront</b><span>Oceanfront condos for sale now</span></div>` : ''}
    ${s.sold?.medianDaysOnMarket ? `<div class="fact"><b>${s.sold.medianDaysOnMarket} days</b><span>Median time on market; about ${Math.round(s.sold.medianSaleToListPct)}% of asking</span></div>` : ''}
    <div class="fact"><b>${rows.length} buildings compared</b><span>${oceanfront} oceanfront, ${rows.length - oceanfront} off the ocean or on the river</span></div>
    <div class="fact"><b>Updated ${esc(today)}</b><span>Live numbers on brevardcoastalhomes.com</span></div>
  </div>`;

  const cover = `<section class="page cover${town.photo ? '' : ' cover--plain'}">
  ${coverImg}
  <div class="inner">
    <div class="eyebrow" style="color:#c9a15a">Free condo guide · ${esc(monthYear)}</div>
    <h1>The ${esc(town.name)} Condo Guide</h1>
    <div class="sub">Every ${esc(town.name)} condo building we track, side by side: what&rsquo;s for sale, what units sold for, HOA fees, rental rules and building age.</div>
    <div class="by">RYAN POHL · BREVARD COASTAL HOMES</div>
  </div>
</section>`;

  const p2 = page(2, `${esc(town.name)} condos`, `The ${esc(town.name)} condo market`, `  <p>Condo prices in ${esc(town.name)} depend most on the building: its location on the water, its age, its fees and its rental rules. This guide puts every building side by side so you can narrow the list before you tour.</p>
  ${facts}
  <h3>How to use this guide</h3>
  <ul>
    <li><b>The comparison table</b> shows every building: location, year built, what&rsquo;s for sale, recent sale prices, HOA and rental minimum.</li>
    <li><b>&ldquo;Buildings by what matters to you&rdquo;</b> groups them by what buyers ask about most: rentals, newer buildings and older buildings.</li>
    <li><b>&ldquo;Buying a condo here&rdquo;</b> covers what to check before you buy a Florida condo.</li>
  </ul>
  <p class="note">Market figures are from Space Coast MLS records as of ${esc(today)}.</p>`, town);

  const p3 = parts
    .map((part, i) =>
      page(3 + i, 'Compare', i ? 'Every building side by side (continued)' : 'Every building side by side', tableFor(part) + (i === parts.length - 1 ? tableNote : ''), town)
    )
    .join('\n');

  const p4 = page(4, 'Narrow it down', 'Buildings by what matters to you', `  <div class="sections">
    <div><b>Short stays allowed (1 month or less)</b>${list(shortStay, 'No building here commonly allows rentals of a month or less.')}</div>
    <div><b>Year-long minimum</b>${list(yearLong, 'No building here commonly requires a 1-year minimum.')}</div>
    <div><b>Newer buildings (2000 and later)</b>${list(newer, 'All buildings here were built before 2000.')}</div>
    <div><b>Older buildings (1985 and earlier)</b>${list(older, 'No buildings here are from 1985 or earlier.')}</div>
  </div>
  <p class="note">Rental minimums are the ones most often shown in each building&rsquo;s MLS listings and can change; always confirm with the association. Older buildings aren&rsquo;t a bad buy, but check their inspections and reserves (next page).</p>`, town);

  const p5 = page(5, 'Before you buy', 'Buying a condo here', `  <h3 style="margin-top:0">What the HOA fee covers</h3>
  <p>Condo fees usually cover the building&rsquo;s insurance, exterior maintenance, reserves and amenities. Two buildings with the same fee can cover very different things, so ask for the budget and what&rsquo;s included.</p>
  <div class="box"><b>Florida&rsquo;s condo safety rules:</b> since 2022, Florida requires condo buildings three stories or taller to complete milestone structural inspections and structural integrity reserve studies. In some older buildings this has raised fees or led to special assessments. Ask for the latest inspection report, the reserve study, the reserve balance and any planned assessments before you buy.</div>
  <h3>Flood and insurance</h3>
  <p>Beachside condos are often in FEMA coastal flood zones. The association insures the building; you insure your unit&rsquo;s interior and belongings. Ryan can pull the flood zone and an insurance estimate for any unit.</p>
  <h3>Your condo checklist</h3>
  <ul class="checklist">
    <li>Pick oceanfront, ocean view or river side</li>
    <li>If you&rsquo;ll rent it out, confirm the building&rsquo;s rental minimum first</li>
    <li>Get the inspection report, reserve study and any special assessments</li>
    <li>Compare HOA fees and what they cover</li>
    <li>Check pet, parking and storage rules</li>
    <li>Get insurance quotes before you make an offer</li>
  </ul>`, town);

  const p6 = `<section class="page">
  <div class="eyebrow">Your agent</div>
  <h2>Let&rsquo;s find your ${esc(town.name)} condo</h2>
  <div class="gold-rule"></div>
  <div class="about">
    <img src="../relocation/img/ryan.jpg" alt="Ryan Pohl" />
    <div>
      <p>I&rsquo;m Ryan Pohl, the Realtor behind Brevard Coastal Homes. I help buyers compare ${esc(town.name)}&rsquo;s condo buildings and find the right unit, and I help owners price and sell.</p>
      <p>I can:</p>
      <ul>
        <li>Tour units with you, in person or by live video</li>
        <li>Get a building&rsquo;s inspection report, reserve study and rental rules</li>
        <li>Pull flood zones and insurance estimates for any unit</li>
        <li>Set up alerts for new listings and price drops in the buildings you like</li>
        <li>Prepare a free market analysis if you own a unit and want to sell</li>
      </ul>
    </div>
  </div>
  <div class="contact">
    <div style="font-family:Georgia,serif;font-size:16pt;margin-bottom:6px">Ryan Pohl</div>
    <div style="font-size:10pt;color:#d9cfb8;margin-bottom:10px">Brevard Coastal Homes</div>
    Call or text: <a href="tel:+13213507661">321-350-7661</a><br />
    Email: <a href="mailto:Ryan@BrevardCoastalHomes.com">Ryan@BrevardCoastalHomes.com</a><br />
    ${esc(town.name)} condos for sale: <a href="https://brevardcoastalhomes.com/${citySlug}/condos-for-sale">brevardcoastalhomes.com/${citySlug}/condos-for-sale</a>
  </div>
  <p class="note" style="margin-top:14px">Ryan Pohl, Realtor, FL license 3612865. Brokerage: Tropical Realty &amp; Inv. of Brevard, license 1001937.</p>
  <div class="footer"><span>The ${esc(town.name)} Condo Guide</span><span>brevardcoastalhomes.com/${citySlug}/condos-for-sale</span></div>
</section>`;

  // Same look as the other guides (assets/guides/neighborhoods/adelaide.html).
  const style = fs.readFileSync(path.join(OUT, 'adelaide.html'), 'utf8').match(/<style>[\s\S]*?<\/style>/)[0].replace(
    '</style>',
    `  table.t.small { font-size: 8.6pt; }
  table.t.small td, table.t.small th { padding: 5px 5px; }
  table.t.small td:first-child { width: 20%; }
  table.t .addr { font-weight: normal; color: #667377; font-size: 7.5pt; }
  table.t .n { color: #8a8f92; }
  .cover--plain .inner { padding-top: 3.2in; }
  .sections .inline { font-size: 10pt; line-height: 1.6; margin: 4px 0 0; }
</style>`
  );
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>The ${esc(town.name)} Condo Guide — Brevard Coastal Homes</title>
<!-- Generated ${new Date().toISOString()} by the frontend repo's scripts/condo-guides/build.mjs from live MLS data. Edit the script, not this file. -->
${style}
</head>
<body>
${cover}
${p2}
${p3}
${p4}
${p5}
${p6}
</body>
</html>
`;
  const file = path.join(OUT, `${citySlug}-condos.html`);
  fs.writeFileSync(file, html);
  console.log(`Wrote ${file} (${rows.length} buildings, ${s.forSale} condos for sale)`);
}

const wanted = process.argv.slice(2);
for (const c of wanted.length ? wanted : Object.keys(TOWNS)) await build(c);
