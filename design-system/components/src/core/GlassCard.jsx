import * as React from "react";

/**
 * GlassCard — the liquid surface. Translucent, backdrop-blurred, soft-radius
 * (28px) panel with a layered glass shadow and an inner top-edge catch-light.
 * Reserved for precious / floating things: ticket overlays, filter bars,
 * checkout panels, the scanner chrome. Always sits over a mesh or image so
 * the blur has something to do.
 */

const CSS = `
.bds-glass {
  position: relative; border-radius: var(--radius-2xl); padding: 20px;
  border: 1px solid var(--color-glass-edge); background: var(--color-glass-tint);
  color: var(--color-fg);
}
.bds-glass--sm { box-shadow: var(--shadow-glass-sm); backdrop-filter: blur(var(--blur-glass-sm)); -webkit-backdrop-filter: blur(var(--blur-glass-sm)); }
.bds-glass--md { box-shadow: var(--shadow-glass-md); backdrop-filter: blur(var(--blur-glass-md)); -webkit-backdrop-filter: blur(var(--blur-glass-md)); }
.bds-glass--lg { box-shadow: var(--shadow-glass-lg); backdrop-filter: blur(var(--blur-glass-lg)); -webkit-backdrop-filter: blur(var(--blur-glass-lg)); }
.bds-glass__edge { position: absolute; left: 0; right: 0; top: 0; height: 1px; background: var(--color-glass-edge); pointer-events: none; }
`;

if (typeof document !== "undefined" && !document.getElementById("bds-glasscard-styles")) {
  const s = document.createElement("style");
  s.id = "bds-glasscard-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function GlassCard({ children, intensity = "md", className = "", ...rest }) {
  return (
    <div className={`bds-glass bds-glass--${intensity} ${className}`.trim()} {...rest}>
      <span className="bds-glass__edge" aria-hidden="true" />
      {children}
    </div>
  );
}
