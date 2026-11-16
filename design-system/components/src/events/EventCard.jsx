import * as React from "react";
import { Badge } from "../core/Badge.jsx";

/**
 * EventCard — the buyer-facing poster card. A 4:5 poster (organiser image or
 * a gradient fallback) under a brick-shadow chassis that lifts on hover and
 * absorbs on press. The poster title is the headline — it is NOT repeated in
 * the info strip below. Date + time render in tabular mono; the price uses
 * the primary token (lime on dark, ink on light). Category sits top-right as
 * a glass chip; an optional sale-state Badge sits top-left.
 *
 * No stock photography — organiser images only (design-principles §11).
 */

const CSS = `
.bds-ec {
  display: block; overflow: hidden; border-radius: var(--radius-lg);
  border: 1px solid var(--color-border); background: var(--color-surface);
  color: var(--color-fg); text-decoration: none; box-shadow: var(--shadow-brick-md);
  transition: transform var(--motion-fast) var(--ease-fast), box-shadow var(--motion-fast) var(--ease-fast);
}
.bds-ec:hover { transform: translate(-2px, -2px); box-shadow: var(--shadow-brick-lg); }
.bds-ec:active { transform: translate(6px, 6px); box-shadow: none; }
.bds-ec__poster { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: var(--ink-900); }
.bds-ec__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.bds-ec__legibility { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(8,8,12,0.72) 100%); }
.bds-ec__top { position: absolute; left: 16px; right: 16px; top: 16px; z-index: 2; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.bds-ec__title { position: absolute; inset: 0; z-index: 1; display: flex; align-items: flex-end; padding: 16px; }
.bds-ec__title span { white-space: pre-line; font-family: var(--font-display); font-size: 52px; font-weight: 900; text-transform: uppercase; line-height: 0.9; letter-spacing: -0.035em; color: rgba(246,242,234,0.95); }
.bds-ec__meta { display: grid; gap: 12px; padding: 20px; }
.bds-ec__date { font-family: var(--font-mono); font-size: var(--text-mono-sm-size); text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-fg-muted); }
.bds-ec__row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
.bds-ec__venue { font-size: var(--text-body-sm-size); color: var(--color-fg-secondary); }
.bds-ec__price { font-family: var(--font-mono); font-size: var(--text-mono-md-size); color: var(--color-primary); white-space: nowrap; }
`;

if (typeof document !== "undefined" && !document.getElementById("bds-eventcard-styles")) {
  const s = document.createElement("style");
  s.id = "bds-eventcard-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function EventCard({ event, href, className = "", ...rest }) {
  const e = event || {};
  const link = href ?? e.href ?? (e.id ? `/events/${e.id}` : undefined);
  const showStatus = e.status && e.showStatus !== false;
  return (
    <a className={`bds-ec ${className}`.trim()} href={link} {...rest}>
      <div className="bds-ec__poster" style={e.posterImage ? undefined : { background: e.posterBackground }}>
        {e.posterImage ? <img className="bds-ec__img" src={e.posterImage} alt={e.title || ""} /> : null}
        <div className="bds-ec__legibility" />
        <div className="bds-ec__top">
          {showStatus ? <Badge variant={e.statusVariant || "signal"}>{e.status}</Badge> : <span />}
          {e.category ? <Badge variant="ink">{e.category}</Badge> : null}
        </div>
        <div className="bds-ec__title"><span>{e.posterTitle || e.title}</span></div>
      </div>
      <div className="bds-ec__meta">
        <div className="bds-ec__date">{e.date}{e.access ? ` · ${e.access}` : ""}</div>
        <div className="bds-ec__row">
          <span className="bds-ec__venue">{e.venue}{e.location ? ` · ${e.location}` : ""}</span>
          {e.price ? <span className="bds-ec__price">{e.price}</span> : null}
        </div>
      </div>
    </a>
  );
}
