"use client";

/**
 * FeaturedSlider — horizontal carousel for the home-page hero.
 *
 * - One slide visible at a time, transform-based for smooth animation.
 * - Prev/next arrows + dot indicators.
 * - Keyboard arrow keys move slides when the slider is focused.
 * - Pointer/touch swipe (>40px horizontal drag).
 * - Auto-advance every 7s; paused on hover, focus, or while dragging.
 * - Respects prefers-reduced-motion (no transitions, no auto-advance).
 *
 * No external deps. Brutal-Glass styling — borders, brick chassis, mono
 * counter, signal-lime accents on the active dot.
 */

import * as React from "react";
import Link from "next/link";
import { BrutalButton } from "./brutal-glass";

export interface FeaturedSliderEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  access: string;
  venue: string;
  location: string;
  price: string;
  posterImage?: string;
  posterClassName?: string;
  lineup: string;
}

export interface FeaturedSliderProps {
  events: FeaturedSliderEvent[];
  /** Auto-advance interval in ms. Pass 0 to disable. Default 7000. */
  autoAdvanceMs?: number;
}

const SWIPE_THRESHOLD_PX = 40;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function FeaturedSlider({ events, autoAdvanceMs = 7000 }: FeaturedSliderProps) {
  const total = events.length;
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState(0);
  const reducedMotion = usePrefersReducedMotion();

  // Refs for pointer drag tracking
  const startX = React.useRef<number | null>(null);
  const containerWidth = React.useRef<number>(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const goTo = React.useCallback(
    (next: number) => {
      if (total === 0) return;
      // Wrap-around so swiping past the ends loops naturally.
      const wrapped = ((next % total) + total) % total;
      setIndex(wrapped);
    },
    [total],
  );

  const next = React.useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = React.useCallback(() => goTo(index - 1), [index, goTo]);

  // Keyboard navigation when the slider has focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  // Auto-advance — disabled when paused, dragging, reduced motion, or single slide
  React.useEffect(() => {
    if (autoAdvanceMs <= 0 || paused || dragging || reducedMotion || total <= 1) return;
    const id = window.setTimeout(() => next(), autoAdvanceMs);
    return () => window.clearTimeout(id);
  }, [autoAdvanceMs, paused, dragging, reducedMotion, total, index, next]);

  // Pointer drag to swipe
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (total <= 1) return;
    startX.current = e.clientX;
    containerWidth.current = e.currentTarget.clientWidth;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const delta = e.clientX - startX.current;
    setDragOffset(delta);
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const delta = e.clientX - startX.current;
    startX.current = null;
    setDragging(false);
    setDragOffset(0);
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      delta < 0 ? next() : prev();
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // pointer may already be released — ignore
    }
  };

  if (total === 0) return null;

  // Build the transform so each slide takes 100% of the track width.
  const dragPercent =
    dragging && containerWidth.current > 0
      ? (dragOffset / containerWidth.current) * 100
      : 0;
  const trackTransform = `translate3d(calc(${-index * 100}% + ${dragPercent}%), 0, 0)`;
  const trackTransition = dragging || reducedMotion
    ? "none"
    : "transform 720ms cubic-bezier(0.16, 1, 0.3, 1)";

  return (
    <section
      ref={containerRef}
      className="relative"
      aria-roledescription="carousel"
      aria-label="Eventos destacados"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Track — overflow-hidden clips the off-screen slides; the inner
          flex container slides via transform. */}
      <div
        className="relative overflow-hidden rounded-xl"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="flex"
          style={{
            transform: trackTransform,
            transition: trackTransition,
            // Disable text selection during drag so the cursor doesn't
            // accidentally select copy mid-swipe.
            userSelect: dragging ? "none" : "auto",
          }}
        >
          {events.map((event, i) => (
            <div
              key={event.id}
              className="w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}: ${event.title}`}
              aria-hidden={i !== index}
            >
              <SlideContent event={event} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer row — dots + counter on the left, paired prev/next on the
          right. Arrows live here (not overlaid on the slide) so they don't
          obscure the title or the poster artwork. */}
      {total > 1 ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Ir a evento destacado"
            >
              {events.map((event, i) => {
                const active = i === index;
                return (
                  <button
                    key={event.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Ir a ${event.title}`}
                    onClick={() => goTo(i)}
                    className={[
                      "h-2 rounded-full border border-border-ink transition-all duration-base ease-motion-base focus-visible:outline-none focus-visible:shadow-glow-focus",
                      active ? "w-10 bg-signal-500" : "w-2 bg-transparent hover:bg-fg-muted",
                    ].join(" ")}
                  />
                );
              })}
            </div>
            <span className="font-mono text-mono-sm uppercase tracking-[0.08em] text-fg-muted">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <SliderArrow direction="prev" onClick={prev} />
            <SliderArrow direction="next" onClick={next} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function SliderArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Evento anterior" : "Siguiente evento"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border-ink bg-surface text-fg shadow-brick-sm transition duration-instant ease-motion-instant hover:bg-primary hover:text-primary-fg active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:shadow-glow-focus"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isPrev ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

function SlideContent({ event }: { event: FeaturedSliderEvent }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="flex flex-col justify-center">
        <span className="font-mono text-mono-sm uppercase tracking-widest text-primary">
          Evento destacado
        </span>
        <h1 className="mt-4 font-display text-5xl font-black leading-none tracking-tight text-fg md:text-8xl">
          {event.title}
        </h1>
        <p className="mt-4 max-w-md text-lg text-fg-secondary">{event.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-mono-sm uppercase tracking-[0.08em] text-fg-muted">
          <span className="text-mono-md text-primary">{event.price}</span>
          <span aria-hidden="true">·</span>
          <span>
            {event.date}
            {event.access ? ` · ${event.access}` : ""}
          </span>
          <span aria-hidden="true">·</span>
          <span>{event.venue}</span>
        </div>
        <div className="mt-8">
          <BrutalButton href={`/events/${event.id}`} size="lg">
            Ver detalles
          </BrutalButton>
        </div>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
        {event.posterImage ? (
          <img
            src={event.posterImage}
            alt={event.title}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className={`absolute inset-0 ${event.posterClassName ?? "bg-surface"}`} />
        )}
        {/* Bottom legibility gradient stays dark — posters always carry
            dark imagery so the same overlay reads in both themes. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="font-mono text-mono-sm uppercase tracking-widest text-bone-50/80">
            {event.lineup}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Smaller standalone export so consumers can pull just the slide layout
    if they ever want to reuse it (e.g. in a non-slider hero). */
export { SlideContent as FeaturedSlide };
