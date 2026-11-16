import * as React from "react";

/**
 * Card — the brutal surface. A bordered panel that casts a hard brick-shadow.
 * Default radius is utility (14px). Optionally interactive: `as="a"` with an
 * href makes the whole card a pressable link that lifts on hover and absorbs
 * its brick on press.
 */

const CSS = `
.bds-card {
  display: block; border-radius: var(--radius-lg); padding: 20px;
  background: var(--color-surface); border: 1px solid var(--color-border);
  color: var(--color-fg); text-decoration: none;
}
.bds-card--bordered { border-color: var(--color-border-strong); }
.bds-card--ghost { background: transparent; border-color: transparent; }
.bds-card--brick-sm { box-shadow: var(--shadow-brick-sm); }
.bds-card--brick-md { box-shadow: var(--shadow-brick-md); }
.bds-card--brick-lg { box-shadow: var(--shadow-brick-lg); }
.bds-card--interactive {
  transition: transform var(--motion-fast) var(--ease-fast), box-shadow var(--motion-fast) var(--ease-fast);
  cursor: pointer;
}
.bds-card--interactive:hover { transform: translate(-2px, -2px); box-shadow: var(--shadow-brick-lg); }
.bds-card--interactive:active { transform: translate(6px, 6px); box-shadow: none; }
`;

if (typeof document !== "undefined" && !document.getElementById("bds-card-styles")) {
  const s = document.createElement("style");
  s.id = "bds-card-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function Card({
  children,
  variant = "default",
  shadow = "brick-md",
  href,
  interactive = false,
  className = "",
  ...rest
}) {
  const isLink = Boolean(href);
  const isInteractive = interactive || isLink;
  const classes = `bds-card bds-card--${variant} bds-card--${shadow} ${isInteractive ? "bds-card--interactive" : ""} ${className}`.trim();
  const Tag = isLink ? "a" : "div";
  return (
    <Tag className={classes} href={href} {...rest}>
      {children}
    </Tag>
  );
}
