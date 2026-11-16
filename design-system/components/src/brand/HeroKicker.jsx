import * as React from "react";

/**
 * HeroKicker — the overline pill with a glowing signal dot. Marks the top of
 * a hero or section ("Esta semana · CDMX"). The dot stays signal-lime in both
 * themes — it's a brand marker, not a state indicator.
 */

const CSS = `
.bds-kicker {
  display: inline-flex; align-items: center; gap: 12px;
  border-radius: var(--radius-xs); border: 1px solid var(--color-border-strong);
  padding: 8px 14px; font-family: var(--font-body); font-size: var(--text-overline-size);
  font-weight: 700; letter-spacing: var(--text-overline-tracking); text-transform: uppercase;
  color: var(--color-fg-muted);
}
.bds-kicker__dot { width: 6px; height: 6px; border-radius: 9999px; background: var(--signal-500); box-shadow: var(--shadow-glow-signal); flex: none; }
`;

if (typeof document !== "undefined" && !document.getElementById("bds-kicker-styles")) {
  const s = document.createElement("style");
  s.id = "bds-kicker-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function HeroKicker({ children, className = "", ...rest }) {
  return (
    <div className={`bds-kicker ${className}`.trim()} {...rest}>
      <span className="bds-kicker__dot" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
