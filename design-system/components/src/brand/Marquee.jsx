import * as React from "react";

/**
 * Marquee — the brand band. Edge-to-edge, sharp-cornered (radius-0), 1.5px
 * ink borders top + bottom, display type looping horizontally at 28s linear.
 * Items are joined with the middle-dot signature. Decorative — paused under
 * prefers-reduced-motion. Use sparingly: one per page, as a section divider
 * or hero footer (e.g. "DESCUBRE · NOCHES · SONIDOS · CDMX · 2026").
 */

const CSS = `
.bds-marquee { overflow: hidden; border-top: 1.5px solid var(--color-border); border-bottom: 1.5px solid var(--color-border); background: var(--color-bg); padding: 24px 0; }
.bds-marquee__track { display: flex; width: max-content; animation: boletify-marquee var(--motion-marquee) linear infinite; }
.bds-marquee__chunk { padding-right: 48px; font-family: var(--font-display); font-size: 48px; font-weight: 850; text-transform: uppercase; letter-spacing: -0.03em; color: var(--color-fg); white-space: nowrap; }
@media (min-width: 768px) { .bds-marquee__chunk { font-size: 96px; } }
.bds-marquee__dot { color: var(--color-primary); }
@media (prefers-reduced-motion: reduce) { .bds-marquee__track { animation: none; } }
`;

if (typeof document !== "undefined" && !document.getElementById("bds-marquee-styles")) {
  const s = document.createElement("style");
  s.id = "bds-marquee-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function Marquee({ items = [], className = "", ...rest }) {
  const list = Array.isArray(items) ? items : String(items).split("·").map((x) => x.trim());
  const chunk = (
    <span className="bds-marquee__chunk">
      {list.map((it, i) => (
        <React.Fragment key={i}>
          {it} <span className="bds-marquee__dot">·</span>{" "}
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <div className={`bds-marquee ${className}`.trim()} {...rest}>
      <div className="bds-marquee__track">
        {chunk}
        {chunk}
      </div>
    </div>
  );
}
