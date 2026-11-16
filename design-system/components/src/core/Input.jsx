import * as React from "react";

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

export function Input({
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

  return (
    <div className="bds-field">
      {label ? <label className="bds-field__label" htmlFor={fieldId}>{label}</label> : null}
      {multiline ? (
        <textarea id={fieldId} className={inputClass} rows={rows} {...rest} />
      ) : (
        <input id={fieldId} className={inputClass} {...rest} />
      )}
      {error || hint ? (
        <p className={`bds-field__hint ${error ? "bds-field__hint--error" : ""}`.trim()}>{error ?? hint}</p>
      ) : null}
    </div>
  );
}
