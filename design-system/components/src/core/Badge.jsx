import * as React from "react";

/**
 * Badge — overline-type status pill. Brand-color variants keep their hue in
 * both themes (signal is always lime); the `ink` variant is a glass-tint
 * chip that adapts. Used for sale state ("EN VENTA", "AGOTADO"), categories,
 * and metadata.
 */

const CSS = `
.bds-badge {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 4px 10px; border-radius: var(--radius-xs);
  border: 1px solid transparent;
  font-family: var(--font-body); font-size: var(--text-overline-size);
  font-weight: 700; letter-spacing: var(--text-overline-tracking);
  line-height: var(--text-overline-line); text-transform: uppercase;
}
.bds-badge--signal  { border-color: var(--color-border-ink); background: var(--signal-500);  color: var(--ink-950); }
.bds-badge--rosa    { border-color: var(--color-border-ink); background: var(--rosa-500);    color: var(--ink-950); }
.bds-badge--oxblood { border-color: var(--color-border-ink); background: var(--oxblood-500); color: var(--bone-50); }
.bds-badge--leaf    { border-color: var(--color-border-ink); background: var(--leaf-500);    color: var(--ink-950); }
.bds-badge--sun     { border-color: var(--color-border-ink); background: var(--sun-500);     color: var(--ink-950); }
.bds-badge--cenote  { border-color: var(--color-border-ink); background: var(--cenote-500);  color: var(--ink-950); }
.bds-badge--ink     { border-color: var(--color-glass-edge); background: var(--color-nav-tint); color: var(--color-fg); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
`;

if (typeof document !== "undefined" && !document.getElementById("bds-badge-styles")) {
  const s = document.createElement("style");
  s.id = "bds-badge-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function Badge({ children, variant = "ink", className = "", ...rest }) {
  return (
    <span className={`bds-badge bds-badge--${variant} ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}
