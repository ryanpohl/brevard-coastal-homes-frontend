import { BROKERAGE_INFO } from '@/lib/siteConstants';

// Florida Rule 61J2-10.025 (2026-10-05, per Ryan): the brokerage's licensed
// name has to appear above, below or next to every phone number or other
// contact point in an ad. Rendered right after each "Call or Text" line so
// the two can't drift apart. Inline by default; `block` puts it on its own
// line under the number. `agentName={false}` drops "Ryan Pohl, " where the
// name is already shown beside the number (the nav's top strip).
export default function BrokerageNote({ block = false, agentName = true, className = '', style }) {
  return (
    <span
      className={`brokerage-note ${className}`.trim()}
      style={{
        display: block ? 'block' : 'inline',
        fontSize: 13,
        fontWeight: 400,
        color: 'var(--color-muted-dark)',
        marginTop: block ? 4 : 0,
        ...style,
      }}
    >
      {agentName && 'Ryan Pohl, '}
      {BROKERAGE_INFO.name}
    </span>
  );
}
