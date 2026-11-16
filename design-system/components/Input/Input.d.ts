import * as React from "react";

/**
 * Labelled text input / textarea with overline label and signal-lime focus
 * ring. Solid (sunken) ground by default; `glass` for buyer flows.
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Overline-style field label. */
  label?: string;
  /** Helper text under the field. */
  hint?: string;
  /** Error message — flips border + hint to danger and overrides hint. */
  error?: string;
  /** Translucent glass ground (for dark buyer surfaces over mesh). */
  glass?: boolean;
  /** Render a <textarea> instead of <input>. */
  multiline?: boolean;
  /** Rows when multiline. Default 4. */
  rows?: number;
  className?: string;
}

export function Input(props: InputProps): JSX.Element;
