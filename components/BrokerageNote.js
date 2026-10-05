import { BROKERAGE_INFO } from '@/lib/constants';

// Florida Rule 61J2-10.025 (2026-10-05, per Ryan): the brokerage's licensed
// name has to appear above, below or next to every phone number or other
// contact point in an ad. Rendered right after each "Call or Text" line so
// the two can't drift apart. Inline by default; `block` puts it on its own
// line under the number.
export default function BrokerageNote({ block = false, className = '', style }) {
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
      Ryan Pohl, {BROKERAGE_INFO.name}
    </span>
  );
}
