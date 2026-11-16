import * as React from "react";

/**
 * StatStrip — the dashboard data row. Big tabular-mono numbers with overline
 * labels, divided by hairline rules. This single choice (mono + tnum) is what
 * makes the organiser side feel serious — Bloomberg/Stripe Sigma, not a CMS
 * (design-principles §8.6). Optional `delta` renders small in the primary hue.
 */

const CSS = `
.bds-stats { display: grid; grid-template-columns: 1fr; gap: 24px; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 32px 0; margin: 0; }
@media (min-width: 640px) { .bds-stats { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1100px) { .bds-stats { grid-template-columns: repeat(4, 1fr); } }
.bds-stats__item { padding: 0; }
@media (min-width: 1100px) { .bds-stats__item + .bds-stats__item { border-left: 1px solid var(--color-border); padding-left: 24px; } }
.bds-stats__label { margin: 0 0 12px; font-family: var(--font-body); font-size: var(--text-overline-size); font-weight: 700; letter-spacing: var(--text-overline-tracking); text-transform: uppercase; color: var(--color-fg-muted); }
.bds-stats__value { margin: 0; font-family: var(--font-mono); font-feature-settings: "tnum"; font-variant-numeric: tabular-nums; font-size: 36px; line-height: 1; letter-spacing: -0.02em; color: var(--color-fg); }
.bds-stats__delta { margin-left: 8px; font-size: 14px; color: var(--color-primary); }
`;

if (typeof document !== "undefined" && !document.getElementById("bds-statstrip-styles")) {
  const s = document.createElement("style");
  s.id = "bds-statstrip-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function StatStrip({ stats = [], className = "", ...rest }) {
  return (
    <dl className={`bds-stats ${className}`.trim()} {...rest}>
      {stats.map((stat, i) => (
        <div className="bds-stats__item" key={stat.label || i}>
          <dt className="bds-stats__label">{stat.label}</dt>
          <dd className="bds-stats__value">
            {stat.value}
            {stat.delta ? <small className="bds-stats__delta">{stat.delta}</small> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
