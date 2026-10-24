/**
 * Short open house label for listing cards (2026-10-24, per Ryan):
 * "Sat 10/24 · 12–3 PM". Dates/times arrive from the backend already in
 * Eastern time and limited to upcoming ones (upcomingOpenHouses).
 */
function hourParts(hhmm) {
  const [h, min] = hhmm.split(':').map(Number);
  return { text: `${h % 12 || 12}${min ? `:${String(min).padStart(2, '0')}` : ''}`, suffix: h >= 12 ? 'PM' : 'AM' };
}

export function shortOpenHouseLabel(oh) {
  if (!oh?.date) return '';
  const [y, m, d] = oh.date.split('-').map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
  const day = `${weekday} ${m}/${d}`;
  if (!oh.start) return day;
  const start = hourParts(oh.start);
  if (!oh.end) return `${day} · ${start.text} ${start.suffix}`;
  const end = hourParts(oh.end);
  // "12–3 PM" when both share AM/PM, "11 AM–2 PM" otherwise.
  const time = start.suffix === end.suffix ? `${start.text}–${end.text} ${end.suffix}` : `${start.text} ${start.suffix}–${end.text} ${end.suffix}`;
  return `${day} · ${time}`;
}
