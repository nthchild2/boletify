import * as React from "react";

/**
 * Button — Boletify Brutal-Glass action element.
 *
 * Brutal variants (primary / accent / danger) wear a hard brick-shadow that
 * is "absorbed" on press: the element translates +6px/+6px and the shadow
 * collapses to none, in 80ms linear. The label ramps weight 600 → 800 on
 * hover (variable-font signature) instead of changing color.
 *
 * The `glass` variant is the one soft-radius exception — a translucent,
 * backdrop-blurred chip for use over photographic / mesh backgrounds.
 *
 * Styling is pure CSS custom properties from styles.css, so primary flips
 * automatically: lime-on-ink in dark, ink-on-cream in light.
 */

const CSS = `
.bds-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border-radius: var(--radius-md); border: 1.5px solid transparent;
  font-family: var(--font-body); text-transform: uppercase; text-align: center;
  cursor: pointer; user-select: none; text-decoration: none; white-space: nowrap;
  transition: background-color var(--motion-instant) var(--ease-instant),
              color var(--motion-instant) var(--ease-instant),
              box-shadow var(--motion-instant) var(--ease-instant),
              transform var(--motion-instant) var(--ease-instant),
              font-weight var(--motion-fast) var(--ease-fast),
              border-color var(--motion-instant) var(--ease-instant);
}
.bds-btn:focus-visible { outline: none; box-shadow: var(--shadow-glow-focus); }
.bds-btn[disabled], .bds-btn[aria-disabled="true"] { opacity: 0.5; pointer-events: none; box-shadow: none; }

/* Sizes */
.bds-btn--sm { height: 36px; padding: 0 14px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; }
.bds-btn--md { height: 52px; padding: 0 24px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; }
.bds-btn--lg { height: 52px; padding: 0 32px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; }
.bds-btn--xl { height: 64px; padding: 0 32px; font-family: var(--font-display); font-size: 18px; font-weight: 700; text-transform: none; letter-spacing: -0.01em; }

/* Brutal variants */
.bds-btn--primary { border-color: var(--color-border-ink); background: var(--color-primary); color: var(--color-primary-fg); box-shadow: var(--shadow-brick-md); }
.bds-btn--primary:hover { background: var(--color-primary-hover); font-weight: 800; }
.bds-btn--primary:active { transform: translate(6px, 6px); box-shadow: none; }

.bds-btn--accent { border-color: var(--color-border-ink); background: var(--color-accent); color: var(--color-accent-fg); box-shadow: var(--shadow-brick-md); }
.bds-btn--accent:hover { background: var(--color-accent-hover); font-weight: 800; }
.bds-btn--accent:active { transform: translate(6px, 6px); box-shadow: none; }

.bds-btn--danger { border-color: var(--color-border-ink); background: var(--color-danger); color: var(--color-danger-fg); box-shadow: var(--shadow-brick-md); }
.bds-btn--danger:hover { background: var(--color-danger-hover); font-weight: 800; }
.bds-btn--danger:active { transform: translate(6px, 6px); box-shadow: none; }

/* Quiet variants */
.bds-btn--secondary { border-color: var(--color-border-strong); background: transparent; color: var(--color-fg); }
.bds-btn--secondary:hover { border-color: var(--color-primary); color: var(--color-primary); }

.bds-btn--ghost { border-color: transparent; background: transparent; color: var(--color-fg); }
.bds-btn--ghost:hover { color: var(--color-primary); }

/* Glass — the soft-radius exception */
.bds-btn--glass { border-radius: var(--radius-xl); border-color: var(--color-glass-edge); background: var(--color-glass-tint); color: var(--color-fg); box-shadow: var(--shadow-glass-md); backdrop-filter: blur(var(--blur-glass-sm)); -webkit-backdrop-filter: blur(var(--blur-glass-sm)); }
.bds-btn--glass:hover { font-weight: 700; }
`;

if (typeof document !== "undefined" && !document.getElementById("bds-button-styles")) {
  const s = document.createElement("style");
  s.id = "bds-button-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function Button({
  children,
  text,
  href,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...rest
}) {
  const classes = `bds-btn bds-btn--${variant} bds-btn--${size} ${className}`.trim();
  const content = children ?? text;

  if (href && !disabled) {
    return (
      <a href={href} className={classes} onClick={onClick} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...rest}>
      {content}
    </button>
  );
}
