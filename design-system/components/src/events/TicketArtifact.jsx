import * as React from "react";

/**
 * TicketArtifact — the one place the system allows skeuomorphism. A precious
 * glass object: 9:16 die-cut body, paper-grain noise, a perforation dashed
 * line splitting event info from the QR stamp, and a signal/rosa glow washed
 * behind. Stays dark-glass in BOTH themes — on light pages it's a precious
 * dark object on cream; on dark pages a glowing translucent panel.
 *
 * The QR here is a deterministic decorative stand-in. Swap in a real QR image
 * via the `qr` prop (any <img> src) for production tickets.
 */

const CSS = `
.bds-ticket-stage { position: relative; display: flex; align-items: center; justify-content: center; padding: 48px 0; }
.bds-ticket-stage__glow { pointer-events: none; position: absolute; inset: 0; background:
  radial-gradient(400px 400px at 50% 50%, rgba(198,255,46,0.12), transparent 60%),
  radial-gradient(500px 500px at 50% 50%, rgba(255,46,136,0.14), transparent 65%); }
.bds-ticket {
  position: relative; aspect-ratio: 9 / 16; width: 360px; max-width: 90%;
  overflow: hidden; border-radius: var(--radius-xl); border: 1px solid rgba(255,255,255,0.10);
  background:
    radial-gradient(600px 300px at 50% 0%, rgba(255,46,136,0.18), transparent 60%),
    radial-gradient(600px 400px at 50% 100%, rgba(198,255,46,0.14), transparent 60%),
    rgba(22,22,32,0.92);
  box-shadow: var(--shadow-glass-lg); backdrop-filter: blur(var(--blur-glass-md)); -webkit-backdrop-filter: blur(var(--blur-glass-md));
}
.bds-ticket__grain { pointer-events: none; position: absolute; inset: 0; opacity: 0.03;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0); background-size: 12px 12px; }
.bds-ticket__body { position: relative; display: flex; flex-direction: column; height: 100%; padding: 28px; }
.bds-ticket__venue { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-200); }
.bds-ticket__venue b { color: var(--signal-500); font-weight: 700; }
.bds-ticket__title { margin: 16px 0 0; font-family: var(--font-display); font-size: 44px; font-weight: 900; line-height: 0.92; letter-spacing: -0.03em; color: var(--bone-50); }
.bds-ticket__lineup { margin: 8px 0 0; font-size: 14px; line-height: 22px; color: var(--ink-200); }
.bds-ticket__dl { margin: 24px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.bds-ticket__dt { margin: 0 0 6px; font-family: var(--font-body); font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-300); }
.bds-ticket__dd { margin: 0; font-family: var(--font-mono); font-size: 16px; color: var(--bone-50); }
.bds-ticket__dd--price { color: var(--signal-500); }
.bds-ticket__perf { position: absolute; left: 0; right: 0; top: 62%; border-top: 1px dashed rgba(255,255,255,0.20); }
.bds-ticket__stamp { margin-top: auto; display: flex; flex-direction: column; align-items: center; gap: 12px; padding-top: 32px; }
.bds-ticket__qr { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; width: 128px; height: 128px; padding: 8px; border-radius: var(--radius-md); background: #fff; box-shadow: var(--shadow-glow-signal); }
.bds-ticket__qr span { border-radius: 1px; }
.bds-ticket__qrimg { width: 128px; height: 128px; border-radius: var(--radius-md); background: #fff; padding: 8px; box-shadow: var(--shadow-glow-signal); }
.bds-ticket__code { font-family: var(--font-mono); font-size: var(--text-mono-md-size); text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-200); }
`;

if (typeof document !== "undefined" && !document.getElementById("bds-ticket-styles")) {
  const s = document.createElement("style");
  s.id = "bds-ticket-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

// Deterministic decorative QR fill — stable per ticket id.
const ON = [0, 1, 2, 7, 9, 14, 15, 16, 42, 43, 44, 35, 37, 28, 29, 30];

export function TicketArtifact({ event = {}, qr, className = "", ...rest }) {
  const e = event;
  const title = e.title || "";
  const words = title.split(" ");
  const line1 = words.slice(0, 2).join(" ");
  const line2 = words.slice(2).join(" ");

  return (
    <div className={`bds-ticket-stage ${className}`.trim()} {...rest}>
      <div className="bds-ticket-stage__glow" />
      <div className="bds-ticket">
        <div className="bds-ticket__grain" />
        <div className="bds-ticket__body">
          <div className="bds-ticket__venue">
            {e.venue} {e.location ? <><b>·</b> {e.location}</> : null}
          </div>
          <h3 className="bds-ticket__title">{line1}{line2 ? <><br />{line2}</> : null}</h3>
          {e.lineup ? <p className="bds-ticket__lineup">{e.lineup}</p> : null}
          <dl className="bds-ticket__dl">
            <div><dt className="bds-ticket__dt">Fecha</dt><dd className="bds-ticket__dd">{e.date}</dd></div>
            <div><dt className="bds-ticket__dt">Acceso</dt><dd className="bds-ticket__dd">{e.access}</dd></div>
            <div><dt className="bds-ticket__dt">Sección</dt><dd className="bds-ticket__dd">{e.section || "GRAL A"}</dd></div>
            <div><dt className="bds-ticket__dt">Precio</dt><dd className="bds-ticket__dd bds-ticket__dd--price">{e.price}</dd></div>
          </dl>
          <div className="bds-ticket__perf" />
          <div className="bds-ticket__stamp">
            {qr ? (
              <img className="bds-ticket__qrimg" src={qr} alt="QR" />
            ) : (
              <div className="bds-ticket__qr">
                {Array.from({ length: 49 }).map((_, i) => (
                  <span key={i} style={{ background: (ON.includes(i) || i % 3 === 0 || i % 5 === 0) ? "var(--ink-950)" : "#fff" }} />
                ))}
              </div>
            )}
            <div className="bds-ticket__code">{e.ticketId || "TCK · 0412 · 0091"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
