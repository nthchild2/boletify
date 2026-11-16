/* @ds-bundle: {"format":3,"namespace":"BoletifyDesignSystem_c6a0b5","components":[{"name":"HeroKicker","sourcePath":"components/brand/HeroKicker.jsx"},{"name":"Marquee","sourcePath":"components/brand/Marquee.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"GlassCard","sourcePath":"components/core/GlassCard.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"StatStrip","sourcePath":"components/data/StatStrip.jsx"},{"name":"EventCard","sourcePath":"components/events/EventCard.jsx"},{"name":"TicketArtifact","sourcePath":"components/events/TicketArtifact.jsx"}],"sourceHashes":{"components/brand/HeroKicker.jsx":"377f7af393bb","components/brand/Marquee.jsx":"25168c154c75","components/core/Avatar.jsx":"11851b235ed1","components/core/Badge.jsx":"7a5a2eac1844","components/core/Button.jsx":"615d62ceeb0a","components/core/Card.jsx":"3465ad748396","components/core/GlassCard.jsx":"cb4bb069f53f","components/core/Input.jsx":"148dfc2632a2","components/data/StatStrip.jsx":"06e0d1a68cdb","components/events/EventCard.jsx":"998ba8cefdd0","components/events/TicketArtifact.jsx":"11c5223527b0","ui_kits/buyer-web/Checkout.jsx":"1acae17d2f7b","ui_kits/buyer-web/EventDetail.jsx":"c03e246e8efd","ui_kits/buyer-web/Home.jsx":"b4a2b8112e4f","ui_kits/buyer-web/Nav.jsx":"06007b58163c","ui_kits/buyer-web/TicketView.jsx":"6e6d3536a74a","ui_kits/buyer-web/app.jsx":"22312d8e1e9a","ui_kits/buyer-web/data.js":"fe6c46143f1b","ui_kits/marketing-web/Footer.jsx":"bc6587b80f9f","ui_kits/marketing-web/MarketingNav.jsx":"ee110e2d981d","ui_kits/marketing-web/Precios.jsx":"726acba296ab","ui_kits/marketing-web/app.jsx":"b6846a4c6837","ui_kits/organiser-web/CreateEvent.jsx":"f79987bbfcb9","ui_kits/organiser-web/Dashboard.jsx":"0d4eee1085d3","ui_kits/organiser-web/Sidebar.jsx":"ef6222a3aa29","ui_kits/organiser-web/app.jsx":"9b3f58951fdc","ui_kits/organiser-web/data.js":"bf4320759232"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BoletifyDesignSystem_c6a0b5 = window.BoletifyDesignSystem_c6a0b5 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/HeroKicker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function HeroKicker({
  children,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `bds-kicker ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "bds-kicker__dot",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { HeroKicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/HeroKicker.jsx", error: String((e && e.message) || e) }); }

// components/brand/Marquee.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Marquee({
  items = [],
  className = "",
  ...rest
}) {
  const list = Array.isArray(items) ? items : String(items).split("·").map(x => x.trim());
  const chunk = /*#__PURE__*/React.createElement("span", {
    className: "bds-marquee__chunk"
  }, list.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, it, " ", /*#__PURE__*/React.createElement("span", {
    className: "bds-marquee__dot"
  }, "\xB7"), " ")));
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `bds-marquee ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "bds-marquee__track"
  }, chunk, chunk));
}
Object.assign(__ds_scope, { Marquee });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Marquee.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Avatar({
  src,
  initials,
  size = "md",
  alt,
  className = "",
  ...rest
}) {
  const classes = `bds-avatar bds-avatar--${size} ${className}`.trim();
  if (src) {
    return /*#__PURE__*/React.createElement("span", _extends({
      className: classes
    }, rest), /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: alt ?? initials ?? "avatar"
    }));
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes,
    role: "img",
    "aria-label": alt ?? initials ?? "avatar"
  }, rest), (initials || "?").slice(0, 2).toUpperCase());
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Badge({
  children,
  variant = "ink",
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `bds-badge bds-badge--${variant} ${className}`.trim()
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Button({
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
    return /*#__PURE__*/React.createElement("a", _extends({
      href: href,
      className: classes,
      onClick: onClick
    }, rest), content);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: classes,
    disabled: disabled,
    onClick: onClick
  }, rest), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Card({
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
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: classes,
    href: href
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/GlassCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function GlassCard({
  children,
  intensity = "md",
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `bds-glass bds-glass--${intensity} ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "bds-glass__edge",
    "aria-hidden": "true"
  }), children);
}
Object.assign(__ds_scope, { GlassCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/GlassCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — labelled text field. Two grounds: solid (sunken trough, for
 * dashboards/forms) and `glass` (translucent, for buyer flows over mesh).
 * Label uses the overline signature; focus draws the signal-lime glow ring.
 * Pass an `error` string to flip the border + hint to danger.
 */

const CSS = `
.bds-field { display: block; }
.bds-field__label {
  display: block; margin-bottom: 8px;
  font-family: var(--font-body); font-size: var(--text-overline-size);
  font-weight: 700; letter-spacing: var(--text-overline-tracking);
  text-transform: uppercase; color: var(--color-fg-muted);
}
.bds-field__input {
  height: 48px; width: 100%; border-radius: var(--radius-md);
  border: 1px solid var(--color-border-strong); background: var(--color-surface-sunken);
  padding: 0 16px; font-family: var(--font-body); font-size: var(--text-body-md-size);
  color: var(--color-fg);
  transition: border-color var(--motion-fast) var(--ease-fast), box-shadow var(--motion-fast) var(--ease-fast);
}
.bds-field__input::placeholder { color: var(--color-fg-subtle); }
.bds-field__input:focus { outline: none; border-color: var(--color-primary); box-shadow: var(--shadow-glow-focus); }
.bds-field__input--glass {
  border-color: var(--color-glass-edge); background: var(--color-glass-tint);
  box-shadow: var(--shadow-glass-sm); backdrop-filter: blur(var(--blur-glass-sm)); -webkit-backdrop-filter: blur(var(--blur-glass-sm));
}
.bds-field__input--error { border-color: var(--color-danger); }
.bds-field textarea.bds-field__input { height: auto; padding: 12px 16px; resize: vertical; line-height: var(--text-body-md-line); }
.bds-field__hint { margin: 8px 0 0; font-family: var(--font-body); font-size: var(--text-caption-size); color: var(--color-fg-subtle); }
.bds-field__hint--error { color: var(--color-danger); }
`;
if (typeof document !== "undefined" && !document.getElementById("bds-input-styles")) {
  const s = document.createElement("style");
  s.id = "bds-input-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Input({
  label,
  hint,
  error,
  glass = false,
  multiline = false,
  rows = 4,
  className = "",
  id,
  ...rest
}) {
  const fieldId = id || (label ? `bds-${String(label).toLowerCase().replace(/\s+/g, "-")}` : undefined);
  const inputClass = `bds-field__input ${glass ? "bds-field__input--glass" : ""} ${error ? "bds-field__input--error" : ""} ${className}`.trim();
  return /*#__PURE__*/React.createElement("div", {
    className: "bds-field"
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "bds-field__label",
    htmlFor: fieldId
  }, label) : null, multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    id: fieldId,
    className: inputClass,
    rows: rows
  }, rest)) : /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    className: inputClass
  }, rest)), error || hint ? /*#__PURE__*/React.createElement("p", {
    className: `bds-field__hint ${error ? "bds-field__hint--error" : ""}`.trim()
  }, error ?? hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/data/StatStrip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function StatStrip({
  stats = [],
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("dl", _extends({
    className: `bds-stats ${className}`.trim()
  }, rest), stats.map((stat, i) => /*#__PURE__*/React.createElement("div", {
    className: "bds-stats__item",
    key: stat.label || i
  }, /*#__PURE__*/React.createElement("dt", {
    className: "bds-stats__label"
  }, stat.label), /*#__PURE__*/React.createElement("dd", {
    className: "bds-stats__value"
  }, stat.value, stat.delta ? /*#__PURE__*/React.createElement("small", {
    className: "bds-stats__delta"
  }, stat.delta) : null))));
}
Object.assign(__ds_scope, { StatStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatStrip.jsx", error: String((e && e.message) || e) }); }

// components/events/EventCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function EventCard({
  event,
  href,
  className = "",
  ...rest
}) {
  const e = event || {};
  const link = href ?? e.href ?? (e.id ? `/events/${e.id}` : undefined);
  const showStatus = e.status && e.showStatus !== false;
  return /*#__PURE__*/React.createElement("a", _extends({
    className: `bds-ec ${className}`.trim(),
    href: link
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "bds-ec__poster",
    style: e.posterImage ? undefined : {
      background: e.posterBackground
    }
  }, e.posterImage ? /*#__PURE__*/React.createElement("img", {
    className: "bds-ec__img",
    src: e.posterImage,
    alt: e.title || ""
  }) : null, /*#__PURE__*/React.createElement("div", {
    className: "bds-ec__legibility"
  }), /*#__PURE__*/React.createElement("div", {
    className: "bds-ec__top"
  }, showStatus ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: e.statusVariant || "signal"
  }, e.status) : /*#__PURE__*/React.createElement("span", null), e.category ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: "ink"
  }, e.category) : null), /*#__PURE__*/React.createElement("div", {
    className: "bds-ec__title"
  }, /*#__PURE__*/React.createElement("span", null, e.posterTitle || e.title))), /*#__PURE__*/React.createElement("div", {
    className: "bds-ec__meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bds-ec__date"
  }, e.date, e.access ? ` · ${e.access}` : ""), /*#__PURE__*/React.createElement("div", {
    className: "bds-ec__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bds-ec__venue"
  }, e.venue, e.location ? ` · ${e.location}` : ""), e.price ? /*#__PURE__*/React.createElement("span", {
    className: "bds-ec__price"
  }, e.price) : null)));
}
Object.assign(__ds_scope, { EventCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/events/EventCard.jsx", error: String((e && e.message) || e) }); }

// components/events/TicketArtifact.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function TicketArtifact({
  event = {},
  qr,
  className = "",
  ...rest
}) {
  const e = event;
  const title = e.title || "";
  const words = title.split(" ");
  const line1 = words.slice(0, 2).join(" ");
  const line2 = words.slice(2).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `bds-ticket-stage ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "bds-ticket-stage__glow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "bds-ticket"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bds-ticket__grain"
  }), /*#__PURE__*/React.createElement("div", {
    className: "bds-ticket__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bds-ticket__venue"
  }, e.venue, " ", e.location ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, "\xB7"), " ", e.location) : null), /*#__PURE__*/React.createElement("h3", {
    className: "bds-ticket__title"
  }, line1, line2 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), line2) : null), e.lineup ? /*#__PURE__*/React.createElement("p", {
    className: "bds-ticket__lineup"
  }, e.lineup) : null, /*#__PURE__*/React.createElement("dl", {
    className: "bds-ticket__dl"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", {
    className: "bds-ticket__dt"
  }, "Fecha"), /*#__PURE__*/React.createElement("dd", {
    className: "bds-ticket__dd"
  }, e.date)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", {
    className: "bds-ticket__dt"
  }, "Acceso"), /*#__PURE__*/React.createElement("dd", {
    className: "bds-ticket__dd"
  }, e.access)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", {
    className: "bds-ticket__dt"
  }, "Secci\xF3n"), /*#__PURE__*/React.createElement("dd", {
    className: "bds-ticket__dd"
  }, e.section || "GRAL A")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", {
    className: "bds-ticket__dt"
  }, "Precio"), /*#__PURE__*/React.createElement("dd", {
    className: "bds-ticket__dd bds-ticket__dd--price"
  }, e.price))), /*#__PURE__*/React.createElement("div", {
    className: "bds-ticket__perf"
  }), /*#__PURE__*/React.createElement("div", {
    className: "bds-ticket__stamp"
  }, qr ? /*#__PURE__*/React.createElement("img", {
    className: "bds-ticket__qrimg",
    src: qr,
    alt: "QR"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "bds-ticket__qr"
  }, Array.from({
    length: 49
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      background: ON.includes(i) || i % 3 === 0 || i % 5 === 0 ? "var(--ink-950)" : "#fff"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bds-ticket__code"
  }, e.ticketId || "TCK · 0412 · 0091")))));
}
Object.assign(__ds_scope, { TicketArtifact });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/events/TicketArtifact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/buyer-web/Checkout.jsx
try { (() => {
// Checkout — ticket selection + radical fee transparency + payment method.
function Checkout({
  event,
  onBack,
  onPay
}) {
  const {
    Button,
    GlassCard,
    Badge
  } = window.BoletifyDesignSystem_c6a0b5;
  const e = event;
  const [qty, setQty] = React.useState(1);
  const [method, setMethod] = React.useState("card");
  const free = e.priceValue === 0;
  const base = e.priceValue * qty;
  const fee = free ? 0 : Math.round(base * 0.05 + 10 * qty);
  const total = base + fee;
  const fmt = n => n === 0 ? "$0.00" : "$" + n.toLocaleString("es-MX", {
    minimumFractionDigits: 2
  }) + "";
  const methods = [{
    id: "card",
    label: "Tarjeta",
    sub: "Crédito / débito",
    icon: "credit-card"
  }, {
    id: "mp",
    label: "Mercado Pago",
    sub: "Saldo o tarjeta",
    icon: "wallet"
  }, {
    id: "oxxo",
    label: "OXXO",
    sub: "Efectivo · 72 h",
    icon: "banknote"
  }];
  const line = (label, value, opts = {}) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "var(--font-mono)",
      fontSize: opts.big ? 16 : 14,
      color: opts.muted ? "var(--color-fg-muted)" : "var(--color-fg)",
      marginTop: opts.gap ? 12 : 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      letterSpacing: opts.muted ? 0 : 0
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      color: opts.accent ? "var(--color-primary)" : undefined
    }
  }, value, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-fg-subtle)"
    }
  }, "MXN")));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: "0 48px"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      borderTop: "1px solid var(--color-border)",
      padding: "48px 0"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: "none",
      border: 0,
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--color-fg-muted)",
      marginBottom: 16
    }
  }, "\u2190 ", e.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 420px",
      gap: 40,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, "Checkout \xB7 ", e.venue), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "12px 0 0",
      fontFamily: "var(--font-display)",
      fontSize: 56,
      fontWeight: 800,
      lineHeight: 1,
      letterSpacing: "-0.025em",
      color: "var(--color-fg)"
    }
  }, "Tus boletos"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      borderRadius: 14,
      border: "1px solid var(--color-border)",
      background: "var(--color-surface)",
      padding: 20,
      boxShadow: "var(--shadow-brick-md)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: "var(--color-fg)"
    }
  }, "General"), /*#__PURE__*/React.createElement(Badge, {
    variant: e.statusVariant
  }, e.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: "var(--font-mono)",
      fontSize: 14,
      color: "var(--color-primary)"
    }
  }, free ? "GRATIS" : e.price + " c/u")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      border: "1px solid var(--color-border-strong)",
      borderRadius: 8,
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Stepper, {
    sign: "\u2212",
    onClick: () => setQty(q => Math.max(1, q - 1))
  }), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      width: 36,
      textAlign: "center",
      fontFamily: "var(--font-mono)",
      fontSize: 18,
      color: "var(--color-fg)"
    }
  }, qty), /*#__PURE__*/React.createElement(Stepper, {
    sign: "+",
    onClick: () => setQty(q => Math.min(10, q + 1))
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)",
      marginBottom: 14
    }
  }, "M\xE9todo de pago"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 12
    }
  }, methods.map(m => {
    const on = method === m.id;
    return /*#__PURE__*/React.createElement("button", {
      key: m.id,
      onClick: () => setMethod(m.id),
      style: {
        textAlign: "left",
        cursor: "pointer",
        borderRadius: 14,
        padding: "16px 16px",
        border: `1.5px solid ${on ? "var(--color-primary)" : "var(--color-border)"}`,
        background: on ? "rgba(198,255,46,0.06)" : "var(--color-surface)",
        boxShadow: on ? "var(--shadow-glow-focus)" : "none"
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": m.icon,
      style: {
        width: 20,
        height: 20,
        color: on ? "var(--color-primary)" : "var(--color-fg-muted)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: 600,
        color: "var(--color-fg)"
      }
    }, m.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--color-fg-muted)"
      }
    }, m.sub));
  })), method === "oxxo" && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14,
      fontSize: 13,
      lineHeight: "20px",
      color: "var(--color-warning)"
    }
  }, "Generaremos una referencia OXXO. Tienes 72 horas para pagar en cualquier tienda; tu boleto se emite al confirmarse el pago."))), /*#__PURE__*/React.createElement(GlassCard, {
    intensity: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, "Resumen \u2014 precio final"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, line(`${qty} × General`, fmt(base)), !free && line("Cargo de servicio", fmt(fee), {
    muted: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--color-glass-edge)",
      marginTop: 16,
      paddingTop: 16
    }
  }, line("Total a pagar", fmt(total), {
    big: true,
    accent: true,
    gap: false
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 12,
      lineHeight: "18px",
      color: "var(--color-fg-muted)"
    }
  }, "Sin cargos ocultos. El precio que ves es el precio que pagas \u2014 incluido todo."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "xl",
    className: "bds-full",
    onClick: onPay,
    style: {
      width: "100%"
    }
  }, free ? "Registrarme gratis" : "Pagar " + fmt(total))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      gap: 8,
      justifyContent: "center",
      fontSize: 11,
      color: "var(--color-fg-subtle)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "lock",
    style: {
      width: 13,
      height: 13
    }
  }), " Pago cifrado \xB7 datos tokenizados")))));
}
function Stepper({
  sign,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: 36,
      height: 36,
      borderRadius: 6,
      border: "1px solid var(--color-border)",
      background: "var(--color-surface-raised)",
      color: "var(--color-fg)",
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontSize: 18,
      lineHeight: 1
    }
  }, sign);
}
window.Checkout = Checkout;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-web/Checkout.jsx", error: String((e && e.message) || e) }); }

// ui_kits/buyer-web/EventDetail.jsx
try { (() => {
// EventDetail — buyer event page: hero info + the glass ticket artifact.
function EventDetail({
  event,
  onBack,
  onBuy
}) {
  const {
    Button,
    TicketArtifact,
    GlassCard
  } = window.BoletifyDesignSystem_c6a0b5;
  const e = event;
  const infoCard = (label, value, accent) => /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 14,
      border: "1px solid var(--color-border)",
      background: "rgba(15,15,21,0.8)",
      padding: 20,
      boxShadow: "var(--shadow-brick-sm)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: "var(--font-mono)",
      fontSize: 20,
      color: accent ? "var(--color-primary)" : "var(--color-fg)"
    }
  }, value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1440,
      margin: "0 auto",
      padding: "0 48px"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      borderTop: "1px solid var(--color-border)",
      padding: "48px 0"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: "none",
      border: 0,
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--color-fg-muted)",
      marginBottom: 16
    }
  }, "\u2190 Volver a eventos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) 420px",
      gap: 48,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, e.category, " \xB7 ", e.venue), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "16px 0 0",
      fontFamily: "var(--font-display)",
      fontSize: 96,
      fontWeight: 900,
      lineHeight: 0.92,
      letterSpacing: "-0.03em",
      color: "var(--color-fg)"
    }
  }, e.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "20px 0 0",
      maxWidth: 720,
      fontSize: 18,
      lineHeight: "32px",
      color: "var(--color-fg-secondary)"
    }
  }, e.description), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16
    }
  }, infoCard("Fecha", e.date), infoCard("Acceso", e.accessLong), infoCard("Precio", e.price, true)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      display: "flex",
      flexWrap: "wrap",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "xl",
    onClick: onBuy
  }, "Comprar boletos"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "xl"
  }, "Guardar evento"), /*#__PURE__*/React.createElement(Button, {
    variant: "glass",
    size: "xl"
  }, "Compartir")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(GlassCard, {
    intensity: "md"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, "Line-up"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontSize: 16,
      lineHeight: "26px",
      color: "var(--color-fg)"
    }
  }, e.lineup), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      display: "flex",
      justifyContent: "space-between",
      borderTop: "1px solid var(--color-glass-edge)",
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--color-fg-muted)"
    }
  }, e.venue, " \xB7 ", e.location), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 14,
      color: "var(--color-primary)"
    }
  }, "Ver m\xE1s fechas"))))), /*#__PURE__*/React.createElement(TicketArtifact, {
    event: e
  }))));
}
window.EventDetail = EventDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-web/EventDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/buyer-web/Home.jsx
try { (() => {
// Home — buyer discovery feed: featured hero + category filters + event grid.
function Home({
  onOpen
}) {
  const {
    HeroKicker,
    Button,
    EventCard,
    Marquee
  } = window.BoletifyDesignSystem_c6a0b5;
  const events = window.BOLETIFY_EVENTS;
  const filters = window.BOLETIFY_FILTERS;
  const [active, setActive] = React.useState(null);
  const featured = events[0];
  const shown = active ? events.filter(e => e.category === active) : events;
  const chip = (label, isOn, onClick) => /*#__PURE__*/React.createElement("button", {
    key: label,
    onClick: onClick,
    style: {
      borderRadius: 9999,
      border: `1px solid ${isOn ? "var(--color-border-ink)" : "var(--color-border-strong)"}`,
      background: isOn ? "var(--color-primary)" : "transparent",
      color: isOn ? "var(--color-primary-fg)" : "var(--color-fg)",
      padding: "8px 16px",
      fontFamily: "var(--font-body)",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      cursor: "pointer"
    }
  }, label);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1440,
      margin: "0 auto",
      padding: "0 48px"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 64
    }
  }, /*#__PURE__*/React.createElement(HeroKicker, null, "Esta semana \xB7 CDMX")), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 24,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 48,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.16em",
      color: "var(--color-primary)"
    }
  }, "Evento destacado"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "16px 0 0",
      fontFamily: "var(--font-display)",
      fontSize: 88,
      fontWeight: 900,
      lineHeight: 0.92,
      letterSpacing: "-0.035em",
      color: "var(--color-fg)"
    }
  }, featured.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      maxWidth: 440,
      fontSize: 18,
      lineHeight: "28px",
      color: "var(--color-fg-secondary)"
    }
  }, featured.description), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "8px 16px",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--color-fg-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--color-primary)"
    }
  }, featured.price), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, featured.date, " \xB7 ", featured.access), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, featured.venue)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onOpen(featured.id)
  }, "Ver detalles"))), /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen(featured.id),
    style: {
      position: "relative",
      aspectRatio: "4 / 5",
      overflow: "hidden",
      borderRadius: 22,
      cursor: "pointer",
      background: featured.posterBackground
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(0deg, rgba(8,8,12,0.9), transparent 60%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 16,
      display: "flex",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: "pre-line",
      fontFamily: "var(--font-display)",
      fontSize: 72,
      fontWeight: 900,
      textTransform: "uppercase",
      lineHeight: 0.9,
      letterSpacing: "-0.035em",
      color: "rgba(246,242,234,0.95)"
    }
  }, featured.posterTitle)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 16,
      left: 16,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: "rgba(246,242,234,0.8)"
    }
  }, featured.lineup))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 64,
      borderTop: "1px solid var(--color-border)",
      paddingTop: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12
    }
  }, chip(`Todos (${events.length})`, active === null, () => setActive(null)), filters.map(f => {
    const count = events.filter(e => e.category === f).length;
    if (!count) return null;
    return chip(`${f} (${count})`, active === f, () => setActive(f));
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 32,
      paddingBottom: 64,
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 24
    }
  }, shown.map(e => /*#__PURE__*/React.createElement(EventCard, {
    key: e.id,
    event: e,
    href: "#",
    onClick: ev => {
      ev.preventDefault();
      onOpen(e.id);
    }
  })))), /*#__PURE__*/React.createElement(Marquee, {
    items: ["Descubre", "Noches", "Sonidos", "CDMX", "2026"]
  }));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-web/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/buyer-web/Nav.jsx
try { (() => {
// SiteNav — sticky translucent buyer nav with the bolet·ify wordmark.
function SiteNav({
  onHome
}) {
  const {
    Button
  } = window.BoletifyDesignSystem_c6a0b5;
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid var(--color-border)",
      background: "var(--color-nav-tint)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      padding: "16px 48px"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onHome && onHome();
    },
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 22,
      fontWeight: 900,
      letterSpacing: "-0.03em",
      color: "var(--color-fg)"
    }
  }, "bolet", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-primary)"
    }
  }, "ify")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "var(--color-fg-muted)"
    }
  }, "v0.0.2 beta"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Iniciar sesi\xF3n"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Registrarse")));
}
window.SiteNav = SiteNav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-web/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/buyer-web/TicketView.jsx
try { (() => {
// TicketView — order confirmation: success message + the live ticket.
function TicketView({
  event,
  onHome
}) {
  const {
    Button,
    TicketArtifact,
    Badge
  } = window.BoletifyDesignSystem_c6a0b5;
  const e = event;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: "0 48px"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      borderTop: "1px solid var(--color-border)",
      padding: "48px 0 64px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 480px",
      gap: 48,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "leaf"
  }, "Pago confirmado")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "20px 0 0",
      fontFamily: "var(--font-display)",
      fontSize: 72,
      fontWeight: 850,
      lineHeight: 0.95,
      letterSpacing: "-0.03em",
      color: "var(--color-fg)"
    }
  }, "\xA1Nos vemos", /*#__PURE__*/React.createElement("br", null), "en la pista!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "20px 0 0",
      maxWidth: 460,
      fontSize: 18,
      lineHeight: "30px",
      color: "var(--color-fg-secondary)"
    }
  }, "Tu boleto para ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--color-fg)"
    }
  }, e.title), " ya est\xE1 listo. Te enviamos una copia con tu c\xF3digo QR a tu correo \u2014 pres\xE9ntalo en la puerta."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      display: "grid",
      gridTemplateColumns: "repeat(2, max-content)",
      gap: "16px 40px"
    }
  }, /*#__PURE__*/React.createElement(Meta, {
    label: "Evento",
    value: e.dateLong + " · " + e.accessLong
  }), /*#__PURE__*/React.createElement(Meta, {
    label: "Lugar",
    value: e.venue + " · " + e.location
  }), /*#__PURE__*/React.createElement(Meta, {
    label: "Secci\xF3n",
    value: "General A"
  }), /*#__PURE__*/React.createElement(Meta, {
    label: "Orden",
    value: "BLT-2026-0412",
    mono: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      display: "flex",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onHome
  }, "Descubrir m\xE1s eventos"), /*#__PURE__*/React.createElement(Button, {
    variant: "glass",
    size: "lg"
  }, "A\xF1adir a Wallet"))), /*#__PURE__*/React.createElement(TicketArtifact, {
    event: e
  }))));
}
function Meta({
  label,
  value,
  mono
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
      fontSize: 16,
      color: "var(--color-fg)"
    }
  }, value));
}
window.TicketView = TicketView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-web/TicketView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/buyer-web/app.jsx
try { (() => {
// App — buyer-web orchestrator. Simple state router: home → detail → checkout → ticket.
function App() {
  const events = window.BOLETIFY_EVENTS;
  const [route, setRoute] = React.useState({
    name: "home",
    id: events[0].id
  });
  const event = events.find(e => e.id === route.id) || events[0];

  // Re-render Lucide icons after each route change.
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
    window.scrollTo({
      top: 0
    });
  }, [route]);
  const go = (name, id) => setRoute({
    name,
    id: id || route.id
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--bg-mesh)",
      color: "var(--color-fg)"
    }
  }, /*#__PURE__*/React.createElement(window.SiteNav, {
    onHome: () => go("home")
  }), route.name === "home" && /*#__PURE__*/React.createElement(window.Home, {
    onOpen: id => go("detail", id)
  }), route.name === "detail" && /*#__PURE__*/React.createElement(window.EventDetail, {
    event: event,
    onBack: () => go("home"),
    onBuy: () => go("checkout")
  }), route.name === "checkout" && /*#__PURE__*/React.createElement(window.Checkout, {
    event: event,
    onBack: () => go("detail"),
    onPay: () => go("ticket")
  }), route.name === "ticket" && /*#__PURE__*/React.createElement(window.TicketView, {
    event: event,
    onHome: () => go("home")
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-web/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/buyer-web/data.js
try { (() => {
// Mock event data for the Boletify buyer-web UI kit. Mirrors the shape used
// by the real apps/web event mappers (poster gradients from lib/mock-data.ts).
window.BOLETIFY_EVENTS = [{
  id: "noche-indie-rock",
  title: "Noche de Indie Rock",
  posterTitle: "Nubes\nOscuras",
  category: "INDIE",
  status: "En venta",
  statusVariant: "signal",
  date: "SÁB 17 MAY",
  access: "21:00",
  dateLong: "Sáb 17 may",
  accessLong: "21:00 hrs",
  venue: "Foro Puebla",
  location: "Roma Nte",
  price: "$450 MXN",
  priceValue: 450,
  lineup: "Triplete · Las Nubes · Fuente de Juventud",
  description: "Una fecha para perder la voz entre guitarras crudas, synths melancólicos y pogo elegante en el corazón de la Roma.",
  posterBackground: "radial-gradient(circle at 30% 80%, rgba(255,46,136,0.55), transparent 55%), radial-gradient(circle at 80% 20%, rgba(198,255,46,0.35), transparent 52%), linear-gradient(180deg,#24112B,#140C1A)"
}, {
  id: "sonido-del-valle",
  title: "Sonido Gallo Negro Tributo",
  posterTitle: "Sonido\ndel Valle",
  category: "CUMBIA",
  status: "Últimos",
  statusVariant: "rosa",
  date: "VIE 23 MAY",
  access: "22:30",
  dateLong: "Vie 23 may",
  accessLong: "22:30 hrs",
  venue: "Salón Los Ángeles",
  location: "Obrera",
  price: "$350 MXN",
  priceValue: 350,
  lineup: "Sonido Gallo Negro · La Coreañera · Son Rompe Pera",
  description: "Percusión tropical, visuales calientes y una pista lista para zapatear hasta las tres de la mañana.",
  posterBackground: "radial-gradient(circle at 50% 100%, rgba(122,16,32,0.72), transparent 55%), radial-gradient(circle at 20% 10%, rgba(255,158,0,0.28), transparent 58%), linear-gradient(180deg,#2B1112,#12090B)"
}, {
  id: "cenote-club-full-moon",
  title: "Cenote Club Full Moon",
  posterTitle: "Cenote\nClub",
  category: "ELECTRÓNICA",
  status: "Gratis",
  statusVariant: "leaf",
  date: "JUE 29 MAY",
  access: "20:00",
  dateLong: "Jue 29 may",
  accessLong: "20:00 hrs",
  venue: "Terraza Condesa",
  location: "Condesa",
  price: "GRATIS",
  priceValue: 0,
  lineup: "Margarita Solar · DJ Vértigo · Niebla Club",
  description: "House hipnótico bajo la luna con sistema de audio envolvente, visuales acuáticos y entrada libre antes de las 10.",
  posterBackground: "radial-gradient(circle at 70% 30%, rgba(0,179,199,0.35), transparent 60%), radial-gradient(circle at 20% 80%, rgba(198,255,46,0.30), transparent 55%), linear-gradient(180deg,#0B171C,#091116)"
}, {
  id: "gris-electrico-en-vivo",
  title: "Gris Eléctrico En Vivo",
  posterTitle: "Gris &\nEléctrico",
  category: "ROCK",
  status: "Estreno",
  statusVariant: "signal",
  date: "SÁB 31 MAY",
  access: "21:30",
  dateLong: "Sáb 31 may",
  accessLong: "21:30 hrs",
  venue: "El Plaza Condesa",
  location: "Condesa",
  price: "$680 MXN",
  priceValue: 680,
  lineup: "Gris Eléctrico · Motor Fantasma · Pista Roja",
  description: "Una residencia nueva con guitarras afiladas, bajos saturados y un show visual diseñado para sentir cada golpe.",
  posterBackground: "radial-gradient(circle at 50% 50%, rgba(255,46,136,0.45), transparent 60%), linear-gradient(180deg,#251416,#120B0D)"
}, {
  id: "jazz-de-medianoche",
  title: "Jazz de Medianoche",
  posterTitle: "Humo\n& Latón",
  category: "JAZZ",
  status: "En venta",
  statusVariant: "signal",
  date: "DOM 01 JUN",
  access: "20:30",
  dateLong: "Dom 01 jun",
  accessLong: "20:30 hrs",
  venue: "Zinco Jazz Club",
  location: "Centro",
  price: "$300 MXN",
  priceValue: 300,
  lineup: "Cuarteto Latón · Eugenia León (inv.)",
  description: "Standards y composición original en un sótano art déco. Trompeta con sordina, contrabajo cálido y la noche larga.",
  posterBackground: "radial-gradient(circle at 30% 20%, rgba(255,158,0,0.30), transparent 55%), radial-gradient(circle at 80% 90%, rgba(0,179,199,0.25), transparent 55%), linear-gradient(180deg,#1A1710,#0C0A08)"
}, {
  id: "techno-bunker",
  title: "Techno Búnker 04",
  posterTitle: "Búnker\n04",
  category: "TECHNO",
  status: "Agotado",
  statusVariant: "oxblood",
  date: "VIE 06 JUN",
  access: "23:00",
  dateLong: "Vie 06 jun",
  accessLong: "23:00 hrs",
  venue: "Departamento",
  location: "Juárez",
  price: "$520 MXN",
  priceValue: 520,
  lineup: "Rebolledo · Fango · SNTS (live)",
  description: "Cuatro por cuatro sin tregua hasta el amanecer. Niebla densa, luz estroboscópica y un sistema que pega en el pecho.",
  posterBackground: "radial-gradient(circle at 50% 0%, rgba(198,255,46,0.22), transparent 55%), linear-gradient(180deg,#0E0E14,#070709)"
}];
window.BOLETIFY_FILTERS = ["ELECTRÓNICA", "ROCK", "INDIE", "CUMBIA", "JAZZ", "TECHNO"];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-web/data.js", error: String((e && e.message) || e) }); }

// ui_kits/marketing-web/Footer.jsx
try { (() => {
// Footer — the standard Boletify marketing footer: wordmark, mission line,
// real brand social glyphs (the one place fill icons are used), link columns.
function MarketingFooter() {
  const [hover, setHover] = React.useState(null);

  // Real Boletify social glyphs — filled brand SVGs (also saved standalone in
  // assets/icons/). Filled is intentional: social marks are the one exception
  // to the line-icon system.
  const socials = [{
    id: "instagram",
    label: "Instagram",
    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
  }, {
    id: "x",
    label: "X",
    d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
  }, {
    id: "tiktok",
    label: "TikTok",
    d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
  }];
  const colHead = {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "var(--color-fg-subtle)"
  };
  const colLink = {
    display: "block",
    marginTop: 10,
    fontSize: 14,
    color: "var(--color-fg-muted)",
    textDecoration: "none",
    cursor: "pointer"
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: "1px solid var(--color-border)",
      padding: "64px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1440,
      margin: "0 auto",
      padding: "0 48px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 24,
      fontWeight: 900,
      letterSpacing: "-0.02em",
      color: "var(--color-fg)"
    }
  }, "Boletify"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 12,
      maxWidth: 380,
      fontSize: 14,
      lineHeight: "22px",
      color: "var(--color-fg-muted)"
    }
  }, "La plataforma de ticketing transparente para organizadores independientes y fans de la m\xFAsica en vivo."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: "flex",
      gap: 16
    }
  }, socials.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.id,
    href: "#",
    "aria-label": s.label,
    onClick: e => e.preventDefault(),
    onMouseEnter: () => setHover(s.id),
    onMouseLeave: () => setHover(null),
    style: {
      color: hover === s.id ? "var(--color-accent)" : "var(--color-fg-subtle)",
      transition: "color var(--motion-fast) var(--ease-fast)",
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: s.d
  })))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: colHead
  }, "Organizadores"), /*#__PURE__*/React.createElement("a", {
    style: colLink,
    href: "#",
    onClick: e => e.preventDefault()
  }, "Crear evento"), /*#__PURE__*/React.createElement("a", {
    style: colLink,
    href: "#",
    onClick: e => e.preventDefault()
  }, "Panel de control"), /*#__PURE__*/React.createElement("a", {
    style: colLink,
    href: "#",
    onClick: e => e.preventDefault()
  }, "Precios")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: colHead
  }, "Empresa"), /*#__PURE__*/React.createElement("a", {
    style: colLink,
    href: "#",
    onClick: e => e.preventDefault()
  }, "Nosotros"), /*#__PURE__*/React.createElement("a", {
    style: colLink,
    href: "#",
    onClick: e => e.preventDefault()
  }, "Ayuda"), /*#__PURE__*/React.createElement("a", {
    style: colLink,
    href: "#",
    onClick: e => e.preventDefault()
  }, "Contacto"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 16,
      borderTop: "1px solid var(--color-border)",
      paddingTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: "var(--color-fg-subtle)"
    }
  }, "\xA9 2026 Boletify"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: "var(--color-fg-subtle)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: "inherit",
      textDecoration: "none"
    }
  }, "Privacidad"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: "inherit",
      textDecoration: "none"
    }
  }, "T\xE9rminos")))));
}
window.MarketingFooter = MarketingFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-web/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-web/MarketingNav.jsx
try { (() => {
// MarketingNav — light marketing site nav: wordmark + section links + auth CTAs.
function MarketingNav() {
  const {
    Button
  } = window.BoletifyDesignSystem_c6a0b5;
  const link = {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--color-fg-muted)",
    textDecoration: "none",
    cursor: "pointer"
  };
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid var(--color-border)",
      background: "var(--color-nav-tint)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      padding: "16px 48px"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 22,
      fontWeight: 900,
      letterSpacing: "-0.03em",
      color: "var(--color-fg)"
    }
  }, "bolet", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-accent)"
    }
  }, "ify")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: link
  }, "Eventos"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      ...link,
      color: "var(--color-fg)"
    }
  }, "Precios"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: link
  }, "Ayuda"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Iniciar sesi\xF3n"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Crear evento"))));
}
window.MarketingNav = MarketingNav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-web/MarketingNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-web/Precios.jsx
try { (() => {
// Precios — the brand's thesis surface: radical fee transparency. A live
// all-in price calculator (the buyer sees exactly what they pay) + the real
// pricing tiers + a worked example.
function Precios() {
  const {
    HeroKicker,
    Card,
    GlassCard,
    Input,
    Button
  } = window.BoletifyDesignSystem_c6a0b5;
  const [raw, setRaw] = React.useState("350");
  const price = Math.max(0, Number(raw) || 0);
  // Real Boletify fee model (apps/web/app/precios): 5% + $10 MXN per ticket;
  // the fixed $10 is waived for tickets of $100 MXN or less.
  const fixed = price > 100 ? 10 : 0;
  const service = price * 0.05 + fixed;
  const buyerPays = price + service;
  const mxn = n => "$" + n.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " MXN";
  const mono = {
    fontFamily: "var(--font-mono)",
    fontVariantNumeric: "tabular-nums"
  };
  const overline = {
    fontFamily: "var(--font-body)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--color-fg-muted)"
  };
  const tiers = [{
    label: "Cargo por servicio",
    big: "5%",
    sub: "+ $10 MXN por boleto",
    body: "Sobre el precio de venta. Para boletos de $100 MXN o menos, se elimina el cargo fijo."
  }, {
    label: "Eventos gratuitos",
    big: "$0",
    sub: "Sin costo",
    body: "Publica eventos gratuitos con RSVP y check-in por QR sin pagar nada."
  }, {
    label: "Pago OXXO",
    big: "~$13",
    sub: "Cargo adicional al comprador",
    body: "Para pagos en efectivo en OXXO. El organizador no absorbe este costo."
  }];
  const row = (label, value, opts = {}) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 16,
      padding: "12px 0",
      borderTop: opts.divider ? "1px solid var(--color-border)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: opts.strong ? "var(--color-fg)" : "var(--color-fg-muted)",
      fontWeight: opts.strong ? 600 : 400
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: opts.lg ? 15 : 14,
      color: opts.accent ? "var(--color-accent)" : "var(--color-fg)"
    }
  }, value));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1440,
      margin: "0 auto",
      padding: "64px 48px 0"
    }
  }, /*#__PURE__*/React.createElement(HeroKicker, null, "Transparencia total"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
      gap: 64,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 88,
      fontWeight: 850,
      lineHeight: 0.9,
      letterSpacing: "-0.035em",
      color: "var(--color-fg)"
    }
  }, "Precios", /*#__PURE__*/React.createElement("br", null), "sin letra", /*#__PURE__*/React.createElement("br", null), "chica."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 28,
      maxWidth: 460,
      fontSize: 18,
      lineHeight: "30px",
      color: "var(--color-fg-secondary)"
    }
  }, "Sin sorpresas, sin cargos ocultos. El comprador ve exactamente lo que paga desde el primer clic \u2014 y t\xFA recibes el precio completo del boleto."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Crear evento"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg"
  }, "Hablar con ventas"))), /*#__PURE__*/React.createElement(GlassCard, {
    intensity: "md",
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: overline
  }, "Calculadora de precio final"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Precio del boleto (MXN)",
    type: "number",
    min: "0",
    inputMode: "numeric",
    value: raw,
    onChange: e => setRaw(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, row("Precio del boleto", mxn(price)), row(`Cargo por servicio (5%${fixed ? " + $10" : ""})`, mxn(service)), row("El comprador paga", mxn(buyerPays), {
    divider: true,
    strong: true,
    lg: true
  }), row("Tú recibes", mxn(price), {
    accent: true,
    strong: true
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: 12,
      lineHeight: "18px",
      color: "var(--color-fg-subtle)"
    }
  }, "El cargo por servicio lo paga el comprador, no t\xFA. Mostrado completo antes de confirmar.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1440,
      margin: "0 auto",
      padding: "80px 48px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24
    }
  }, tiers.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.label,
    shadow: "brick-sm"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...mono,
      fontSize: 12,
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, t.label), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontFamily: "var(--font-display)",
      fontSize: 48,
      fontWeight: 900,
      letterSpacing: "-0.02em",
      color: "var(--color-accent)"
    }
  }, t.big), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      ...mono,
      fontSize: 12,
      color: "var(--color-fg-muted)"
    }
  }, t.sub), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 14,
      lineHeight: "22px",
      color: "var(--color-fg-secondary)"
    }
  }, t.body)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(GlassCard, {
    intensity: "md",
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...mono,
      fontSize: 12,
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, "Ejemplo"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      fontSize: 16,
      lineHeight: "28px",
      color: "var(--color-fg)"
    }
  }, "Un boleto de ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--color-accent)"
    }
  }, "$350 MXN"), " tiene un cargo por servicio de $27.50 (5% + $10). El comprador paga $377.50. El organizador recibe $350 menos la comisi\xF3n de procesamiento de Stripe. Sin sorpresas.")))));
}
window.Precios = Precios;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-web/Precios.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-web/app.jsx
try { (() => {
// App — marketing-web orchestrator. Light-mode public site: nav, Precios, footer.
function MarketingApp() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--bg-mesh-ambient)",
      color: "var(--color-fg)"
    }
  }, /*#__PURE__*/React.createElement(window.MarketingNav, null), /*#__PURE__*/React.createElement(window.Precios, null), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 96
    }
  }), /*#__PURE__*/React.createElement(window.MarketingFooter, null));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(MarketingApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-web/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/organiser-web/CreateEvent.jsx
try { (() => {
// CreateEvent — two-step event creation form (Detalles → Boletos + fee preview).
function CreateEvent({
  onBack
}) {
  const {
    Button,
    Input,
    Badge
  } = window.BoletifyDesignSystem_c6a0b5;
  const [step, setStep] = React.useState(1);
  const [price, setPrice] = React.useState("450");
  const priceNum = parseFloat(price) || 0;
  const fee = priceNum ? priceNum * 0.05 + 10 : 0;
  const total = priceNum + fee;
  const fmt = n => "$" + n.toLocaleString("es-MX", {
    minimumFractionDigits: 2
  });
  const stepTab = (n, label) => {
    const on = step === n;
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => setStep(n),
      style: {
        borderRadius: 9999,
        padding: "6px 16px",
        fontFamily: "var(--font-body)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        cursor: "pointer",
        border: on ? "1px solid transparent" : "1px solid var(--color-border)",
        background: on ? "var(--color-primary)" : "transparent",
        color: on ? "var(--color-primary-fg)" : "var(--color-fg-muted)"
      }
    }, n, ". ", label);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 40,
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: "none",
      border: 0,
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      fontSize: 12,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)",
      marginBottom: 12
    }
  }, "\u2190 Eventos"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 40,
      fontWeight: 850,
      letterSpacing: "-0.03em",
      color: "var(--color-fg)"
    }
  }, "Crear evento"), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "24px 0 28px",
      display: "flex",
      gap: 8
    }
  }, stepTab(1, "Detalles"), stepTab(2, "Boletos")), step === 1 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nombre del evento",
    defaultValue: "Noche de Indie Rock",
    placeholder: "Ej: Noche de electr\xF3nica en Polanco"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Descripci\xF3n",
    multiline: true,
    rows: 3,
    defaultValue: "Una fecha para perder la voz entre guitarras crudas y synths melanc\xF3licos."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Venue",
    defaultValue: "Foro Puebla"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Ciudad",
    defaultValue: "CDMX"
  })), /*#__PURE__*/React.createElement(Input, {
    label: "Direcci\xF3n del venue",
    defaultValue: "Puebla 186, Roma Nte",
    placeholder: "Calle y n\xFAmero"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Fecha de inicio",
    type: "date",
    defaultValue: "2026-05-17"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Hora de inicio",
    type: "time",
    defaultValue: "21:00"
  })), /*#__PURE__*/React.createElement(Input, {
    label: "Tags de g\xE9nero (separados por coma)",
    defaultValue: "indie, rock"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => setStep(2)
  }, "Siguiente: Boletos \u2192"))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 0,
      fontSize: 14,
      color: "var(--color-fg-muted)"
    }
  }, "Agrega al menos un tipo de boleto. Los precios se manejan en MXN."), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 14,
      border: "1px solid var(--color-border)",
      background: "var(--color-surface)",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--color-fg)"
    }
  }, "Tier 1"), /*#__PURE__*/React.createElement(Badge, {
    variant: "signal"
  }, "General")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nombre",
    defaultValue: "General"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Precio MXN",
    type: "number",
    value: price,
    onChange: e => setPrice(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Cantidad",
    type: "number",
    defaultValue: "400"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      borderRadius: 14,
      border: "1.5px solid var(--color-border-ink)",
      background: "var(--color-surface)",
      padding: 20,
      boxShadow: "var(--shadow-brick-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, "Lo que ver\xE1 el comprador"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "grid",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Precio base",
    value: fmt(priceNum)
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Cargo de servicio (5% + $10)",
    value: fmt(fee),
    muted: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--color-border)",
      paddingTop: 10,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Precio final \xB7 todo incluido",
    value: fmt(total),
    bold: true
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      display: "flex",
      justifyContent: "space-between",
      borderTop: "1px solid var(--color-border)",
      paddingTop: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(1),
    style: {
      background: "none",
      border: 0,
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      fontSize: 13,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, "Volver a detalles"), /*#__PURE__*/React.createElement(Button, null, "Publicar evento"))));
}
function Row({
  label,
  value,
  muted,
  bold
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: bold ? 16 : 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: muted ? "var(--color-fg-muted)" : "var(--color-fg)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontFamily: "var(--font-mono)",
      color: bold ? "var(--color-accent)" : "var(--color-fg)"
    }
  }, value, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-fg-subtle)"
    }
  }, "MXN")));
}
window.CreateEvent = CreateEvent;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/organiser-web/CreateEvent.jsx", error: String((e && e.message) || e) }); }

// ui_kits/organiser-web/Dashboard.jsx
try { (() => {
// Dashboard — organiser home: stats, quick actions, recent events table.
function Dashboard({
  onCreate
}) {
  const {
    StatStrip,
    Button
  } = window.BoletifyDesignSystem_c6a0b5;
  const events = window.ORG_EVENTS;
  const statusPill = status => {
    const map = {
      published: {
        label: "Publicado",
        bg: "rgba(8,8,12,0.06)",
        color: "var(--color-fg)",
        bd: "var(--color-border-strong)"
      },
      draft: {
        label: "Borrador",
        bg: "transparent",
        color: "var(--color-fg-muted)",
        bd: "var(--color-border)"
      },
      cancelled: {
        label: "Cancelado",
        bg: "rgba(122,16,32,0.08)",
        color: "var(--color-danger)",
        bd: "var(--color-danger)"
      }
    };
    const c = map[status] || map.draft;
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        borderRadius: 9999,
        border: `1px solid ${c.bd}`,
        background: c.bg,
        color: c.color,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase"
      }
    }, c.label);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 40,
      maxWidth: 1160
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, "Panel de organizador"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "8px 0 0",
      fontFamily: "var(--font-display)",
      fontSize: 40,
      fontWeight: 850,
      letterSpacing: "-0.03em",
      color: "var(--color-fg)"
    }
  }, "Dashboard")), /*#__PURE__*/React.createElement(StatStrip, {
    stats: window.ORG_STATS
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "32px 0",
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onCreate
  }, "+ Crear evento"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Exportar compradores (CSV)")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 16px",
      fontFamily: "var(--font-body)",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, "Eventos recientes"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "hidden",
      borderRadius: 14,
      border: "1px solid var(--color-border)",
      background: "var(--color-surface)"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: "1px solid var(--color-border)"
    }
  }, ["Evento", "Fecha", "Vendidos", "Venta", "Status", ""].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      textAlign: i >= 2 && i <= 3 ? "right" : "left",
      padding: "12px 16px",
      fontFamily: "var(--font-body)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--color-fg-muted)"
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, events.map(e => /*#__PURE__*/React.createElement("tr", {
    key: e.id,
    style: {
      borderBottom: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: "var(--color-fg)"
    }
  }, e.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--color-fg-muted)"
    }
  }, e.venue, " \xB7 ", e.city)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px",
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--color-fg-secondary)"
    }
  }, e.date), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px",
      textAlign: "right",
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--color-fg)"
    },
    className: "tnum"
  }, e.total ? `${e.sold}/${e.total}` : "—"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px",
      textAlign: "right",
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--color-fg)"
    },
    className: "tnum"
  }, e.revenue), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px"
    }
  }, statusPill(e.status)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: ev => ev.preventDefault(),
    style: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--color-accent)"
    }
  }, "Ver")))))))));
}
window.Dashboard = Dashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/organiser-web/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/organiser-web/Sidebar.jsx
try { (() => {
// Sidebar — organiser panel navigation (light chassis).
function Sidebar({
  active,
  onNav
}) {
  const items = [{
    id: "dashboard",
    label: "Dashboard",
    icon: "layout-dashboard"
  }, {
    id: "events",
    label: "Eventos",
    icon: "ticket"
  }, {
    id: "orders",
    label: "Órdenes",
    icon: "receipt"
  }, {
    id: "settings",
    label: "Ajustes",
    icon: "settings"
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "sticky",
      top: 0,
      height: "100vh",
      width: 240,
      flex: "none",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid var(--color-border)",
      background: "var(--color-surface)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 64,
      display: "flex",
      alignItems: "center",
      padding: "0 20px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 22,
      fontWeight: 850,
      letterSpacing: "-0.04em",
      color: "var(--color-fg)"
    }
  }, "bolet", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-accent)"
    }
  }, "ify"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      padding: "8px 12px"
    }
  }, items.map(it => {
    const on = active === it.id;
    return /*#__PURE__*/React.createElement("a", {
      key: it.id,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNav(it.id);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 2,
        borderRadius: 14,
        padding: "10px 12px",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: on ? "var(--color-primary-fg)" : "var(--color-fg-muted)",
        background: on ? "var(--color-primary)" : "transparent"
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": it.icon,
      style: {
        width: 18,
        height: 18
      }
    }), it.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--color-border)",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 9999,
      background: "var(--color-accent)",
      color: "var(--color-accent-fg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: 13
    }
  }, "R"), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--color-fg)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, "Ra\xFAl \xB7 Promotor"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--color-fg-muted)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, "raul@foroindie.mx"))));
}
window.Sidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/organiser-web/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/organiser-web/app.jsx
try { (() => {
// App — organiser-web orchestrator (light dashboard with sidebar).
function OrgApp() {
  const [view, setView] = React.useState("dashboard");
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [view]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      minHeight: "100vh",
      background: "var(--color-bg)",
      color: "var(--color-fg)"
    }
  }, /*#__PURE__*/React.createElement(window.Sidebar, {
    active: view === "create" ? "events" : view,
    onNav: setView
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflowX: "hidden"
    }
  }, view === "dashboard" && /*#__PURE__*/React.createElement(window.Dashboard, {
    onCreate: () => setView("create")
  }), view === "events" && /*#__PURE__*/React.createElement(window.Dashboard, {
    onCreate: () => setView("create")
  }), view === "create" && /*#__PURE__*/React.createElement(window.CreateEvent, {
    onBack: () => setView("dashboard")
  }), (view === "orders" || view === "settings") && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 40
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 40,
      fontWeight: 850,
      letterSpacing: "-0.03em",
      color: "var(--color-fg)"
    }
  }, view === "orders" ? "Órdenes" : "Ajustes"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--color-fg-muted)"
    }
  }, "Secci\xF3n de muestra \u2014 el kit se enfoca en Dashboard y Crear evento."))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(OrgApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/organiser-web/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/organiser-web/data.js
try { (() => {
// Organiser dashboard mock data (light mode — the panel side).
window.ORG_EVENTS = [{
  id: 1,
  title: "Noche de Indie Rock",
  venue: "Foro Puebla",
  city: "CDMX",
  date: "17 may 2026",
  status: "published",
  sold: 312,
  total: 400,
  revenue: "$140,400",
  tier: "$450"
}, {
  id: 2,
  title: "Sonido del Valle",
  venue: "Salón Los Ángeles",
  city: "CDMX",
  date: "23 may 2026",
  status: "published",
  sold: 388,
  total: 400,
  revenue: "$135,800",
  tier: "$350"
}, {
  id: 3,
  title: "Cenote Club · Full Moon",
  venue: "Terraza Condesa",
  city: "CDMX",
  date: "29 may 2026",
  status: "published",
  sold: 174,
  total: 500,
  revenue: "—",
  tier: "Gratis"
}, {
  id: 4,
  title: "Gris Eléctrico En Vivo",
  venue: "El Plaza Condesa",
  city: "CDMX",
  date: "31 may 2026",
  status: "draft",
  sold: 0,
  total: 0,
  revenue: "—",
  tier: "$680"
}, {
  id: 5,
  title: "Jazz de Medianoche",
  venue: "Zinco Jazz Club",
  city: "CDMX",
  date: "01 jun 2026",
  status: "published",
  sold: 96,
  total: 180,
  revenue: "$28,800",
  tier: "$300"
}, {
  id: 6,
  title: "Búnker 04",
  venue: "Departamento",
  city: "CDMX",
  date: "06 jun 2026",
  status: "draft",
  sold: 0,
  total: 0,
  revenue: "—",
  tier: "$520"
}];
window.ORG_STATS = [{
  label: "Venta bruta · 2026",
  value: "$1,247,830",
  delta: "+12.4%"
}, {
  label: "Boletos vendidos",
  value: "8,421",
  delta: "+284"
}, {
  label: "Eventos activos",
  value: "24"
}, {
  label: "Pago próximo",
  value: "T+3"
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/organiser-web/data.js", error: String((e && e.message) || e) }); }

__ds_ns.HeroKicker = __ds_scope.HeroKicker;

__ds_ns.Marquee = __ds_scope.Marquee;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.GlassCard = __ds_scope.GlassCard;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.StatStrip = __ds_scope.StatStrip;

__ds_ns.EventCard = __ds_scope.EventCard;

__ds_ns.TicketArtifact = __ds_scope.TicketArtifact;

})();
