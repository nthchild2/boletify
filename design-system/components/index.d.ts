import * as React from "react";

/* Boletify Design System — component types (documentation). window.BoletifyDesignSystem_c6a0b5.<Name> */

// ---- HeroKicker --------------------------------------------------
/**
 * Overline pill with a glowing signal-lime dot — marks the top of a hero or
 * section. The dot is a brand marker, not a state indicator.
 */
export interface HeroKickerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export function HeroKicker(props: HeroKickerProps): JSX.Element;

// ---- Marquee -----------------------------------------------------
/**
 * Edge-to-edge looping brand band in display type, middle-dot separated.
 * Decorative; respects reduced-motion.
 */
export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Words to loop. Array (preferred) or a "·"-separated string. */
  items: string[] | string;
  className?: string;
}

export function Marquee(props: MarqueeProps): JSX.Element;

// ---- Avatar ------------------------------------------------------
/**
 * Round identity chip — photo when `src` is set, otherwise up-to-two
 * uppercased initials on a raised surface. Always circular with a glass-edge
 * hairline + glass-sm shadow.
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. When present, renders the photo instead of initials. */
  src?: string;
  /** Fallback initials (sliced to 2, uppercased). */
  initials?: string;
  /** Default "md". */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Accessible label / img alt. Falls back to initials. */
  alt?: string;
  className?: string;
}

export function Avatar(props: AvatarProps): JSX.Element;

// ---- Badge -------------------------------------------------------
/**
 * Overline-type status / category pill. Brand-color variants are theme-fixed;
 * `ink` is a translucent glass chip that adapts.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Default "ink". Brand colors carry semantic meaning — see prompt. */
  variant?: "signal" | "rosa" | "oxblood" | "leaf" | "sun" | "cenote" | "ink";
  children?: React.ReactNode;
  className?: string;
}

export function Badge(props: BadgeProps): JSX.Element;

// ---- Button ------------------------------------------------------
/**
 * Boletify Brutal-Glass button. Brutal variants carry a brick-shadow that is
 * absorbed on press; the label ramps weight on hover. `glass` is the soft
 * translucent exception for use over imagery.
 *
 * @startingPoint section="Core" subtitle="Brick-shadow CTA with press absorb" viewport="700x200"
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** Button label (alternative to children). */
  text?: string;
  /** Render as an anchor pointing here instead of a <button>. */
  href?: string;
  /** Visual treatment. Default "primary". */
  variant?: "primary" | "accent" | "secondary" | "ghost" | "glass" | "danger";
  /** Size. "xl" switches the label to display type. Default "md". */
  size?: "sm" | "md" | "lg" | "xl";
  /** Disabled state — drops shadow, halves opacity. */
  disabled?: boolean;
  /** Native button type when not an anchor. */
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler;
  children?: React.ReactNode;
  className?: string;
}

export function Button(props: ButtonProps): JSX.Element;

// ---- Card --------------------------------------------------------
/**
 * Brutal surface panel that casts a hard brick-shadow. Utility radius (14px).
 * Becomes a pressable link when given an href (or `interactive`).
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "bordered" | "ghost";
  /** Brick-shadow weight. Default "brick-md". */
  shadow?: "none" | "brick-sm" | "brick-md" | "brick-lg";
  /** Render as a link; makes the card pressable (hover-lift, press-absorb). */
  href?: string;
  /** Force interactive press behaviour without a link. */
  interactive?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function Card(props: CardProps): JSX.Element;

// ---- GlassCard ---------------------------------------------------
/**
 * Translucent, backdrop-blurred soft-radius panel with layered glass shadow
 * and inner catch-light. For precious / floating surfaces over imagery/mesh.
 */
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Blur + shadow weight. Default "md". */
  intensity?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
}

export function GlassCard(props: GlassCardProps): JSX.Element;

// ---- Input -------------------------------------------------------
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

// ---- StatStrip ---------------------------------------------------
export interface StatItem {
  label: string;
  /** Pre-formatted value — keep numbers tabular ($1,247,830, 8,421, T+3). */
  value: string;
  /** Optional small delta in the primary hue (e.g. "+12.4%"). */
  delta?: string;
}

/**
 * Dashboard stat row: big tabular-mono numbers with overline labels.
 *
 * @startingPoint section="Data" subtitle="Tabular-mono dashboard stat row" viewport="900x160"
 */
export interface StatStripProps extends React.HTMLAttributes<HTMLDListElement> {
  stats: StatItem[];
  className?: string;
}

export function StatStrip(props: StatStripProps): JSX.Element;

// ---- EventCard ---------------------------------------------------
export interface EventCardEvent {
  id?: string;
  /** Full event name. Falls back to the poster headline. */
  title?: string;
  /** Big poster headline (supports \n line breaks). Defaults to title. */
  posterTitle?: string;
  /** Organiser cover image URL (preferred — no stock photography). */
  posterImage?: string;
  /** CSS background used when there's no image (gradient poster fallback). */
  posterBackground?: string;
  /** Category chip (e.g. "INDIE"). Rendered as an ink Badge, top-right. */
  category?: string;
  /** Sale-state label (e.g. "EN VENTA", "AGOTADO"). Top-left Badge. */
  status?: string;
  /** Badge variant for the status. Default "signal". */
  statusVariant?: "signal" | "rosa" | "oxblood" | "leaf" | "sun" | "cenote" | "ink";
  /** Hide the status badge even if `status` is set. */
  showStatus?: boolean;
  /** Date string, already formatted (e.g. "SÁB 17 MAY"). Tabular mono. */
  date?: string;
  /** Time / access string (e.g. "21:00"). */
  access?: string;
  venue?: string;
  location?: string;
  /** Formatted price (e.g. "$450 MXN" or "GRATIS"). */
  price?: string;
  href?: string;
}

/**
 * Buyer-facing poster card: 4:5 organiser image under a brick-shadow chassis.
 *
 * @startingPoint section="Events" subtitle="Poster event card with sale badge" viewport="360x520"
 */
export interface EventCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  event: EventCardEvent;
  /** Overrides event.href / derived /events/:id. */
  href?: string;
  className?: string;
}

export function EventCard(props: EventCardProps): JSX.Element;

// ---- TicketArtifact ----------------------------------------------
export interface TicketArtifactEvent {
  title?: string;
  venue?: string;
  location?: string;
  /** Formatted date (e.g. "Sáb 17 may"). */
  date?: string;
  /** Access / door time (e.g. "21:00 hrs"). */
  access?: string;
  /** Section label. Default "GRAL A". */
  section?: string;
  /** Formatted price (mono, lime). */
  price?: string;
  /** Lineup / sub-line under the title. */
  lineup?: string;
  /** Ticket ID printed under the QR. Default "TCK · 0412 · 0091". */
  ticketId?: string;
}

/**
 * The signature glass ticket — a precious skeuomorphic artifact (the one
 * place paper grain + perforation are allowed). Stays dark-glass in both
 * themes.
 *
 * @startingPoint section="Events" subtitle="The signature glass ticket artifact" viewport="480x720"
 */
export interface TicketArtifactProps extends React.HTMLAttributes<HTMLDivElement> {
  event: TicketArtifactEvent;
  /** Real QR image src. Omit to render the decorative stand-in pattern. */
  qr?: string;
  className?: string;
}

export function TicketArtifact(props: TicketArtifactProps): JSX.Element;
