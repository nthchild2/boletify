import * as React from "react";

/**
 * Avatar — a round identity chip. Renders a photo when `src` is given,
 * otherwise the `initials` (max 2, uppercased) on a raised surface. Always
 * circular with a glass-edge hairline and a soft glass-sm shadow, so it reads
 * as a small precious object rather than a flat swatch. Five sizes.
 */

const CSS = `
.bds-avatar {
  display: inline-flex; align-items: center; justify-content: center;
  flex: none; overflow: hidden;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-glass-edge);
  background: var(--color-surface-raised);
  box-shadow: var(--shadow-glass-sm);
  color: var(--color-fg-secondary);
  font-family: var(--font-body); font-weight: 600; line-height: 1;
  -webkit-user-select: none; user-select: none;
}
.bds-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.bds-avatar--xs { width: 24px; height: 24px; font-size: 10px; }
.bds-avatar--sm { width: 32px; height: 32px; font-size: 12px; }
.bds-avatar--md { width: 40px; height: 40px; font-size: 14px; }
.bds-avatar--lg { width: 56px; height: 56px; font-size: 16px; }
.bds-avatar--xl { width: 80px; height: 80px; font-size: 20px; }
`;

if (typeof document !== "undefined" && !document.getElementById("bds-avatar-styles")) {
  const s = document.createElement("style");
  s.id = "bds-avatar-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function Avatar({
  src,
  initials,
  size = "md",
  alt,
  className = "",
  ...rest
}) {
  const classes = `bds-avatar bds-avatar--${size} ${className}`.trim();
  if (src) {
    return (
      <span className={classes} {...rest}>
        <img src={src} alt={alt ?? initials ?? "avatar"} />
      </span>
    );
  }
  return (
    <span className={classes} role="img" aria-label={alt ?? initials ?? "avatar"} {...rest}>
      {(initials || "?").slice(0, 2).toUpperCase()}
    </span>
  );
}
