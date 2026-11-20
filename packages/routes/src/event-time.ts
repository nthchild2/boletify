/**
 * Event dates and times in Mexico City time.
 *
 * Every Boletify event happens in Mexico, so its date and time are always
 * shown and entered on a Mexico City clock, whatever time zone the code runs
 * in: UTC on Vercel, the browser's zone on the web, the phone's in the app.
 *
 * Storage: the database holds UTC instants (Drizzle writes `timestamp`
 * columns as UTC). An event whose time isn't set yet is stored as midnight
 * Mexico City time on its date.
 */

export const EVENT_TIME_ZONE = "America/Mexico_City";

// Mexico City has been UTC−6 all year since DST ended in October 2022. Only
// used if the JS engine can't do time-zone maths (older Hermes builds).
const FALLBACK_OFFSET_MS = -6 * 60 * 60 * 1000;

export type EventDateInput = Date | string | number;

type Wall = { year: number; month: number; day: number; hour: number; minute: number; second: number };

function toDate(value: EventDateInput | null | undefined): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

let partsFormatter: Intl.DateTimeFormat | null | undefined;

function getPartsFormatter(): Intl.DateTimeFormat | null {
  if (partsFormatter === undefined) {
    try {
      const f = new Intl.DateTimeFormat("en-US", {
        timeZone: EVENT_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      });
      f.formatToParts(new Date(0));
      partsFormatter = f;
    } catch {
      partsFormatter = null;
    }
  }
  return partsFormatter;
}

/** Date and time of `d` on a Mexico City clock. */
function wallParts(d: Date): Wall {
  const f = getPartsFormatter();
  if (f) {
    const p: Record<string, number> = {};
    for (const { type, value } of f.formatToParts(d)) {
      if (type !== "literal") p[type] = Number(value);
    }
    // Some engines print midnight as "24" even with hourCycle h23.
    return { year: p.year, month: p.month, day: p.day, hour: p.hour % 24, minute: p.minute, second: p.second };
  }
  const s = new Date(d.getTime() + FALLBACK_OFFSET_MS);
  return {
    year: s.getUTCFullYear(),
    month: s.getUTCMonth() + 1,
    day: s.getUTCDate(),
    hour: s.getUTCHours(),
    minute: s.getUTCMinutes(),
    second: s.getUTCSeconds(),
  };
}

/** Mexico City's offset from UTC at `instant`, in ms (negative: behind UTC). */
function offsetAt(instant: number): number {
  const w = wallParts(new Date(instant));
  const wallAsUtc = Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute, w.second);
  return wallAsUtc - Math.floor(instant / 1000) * 1000;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The date ("YYYY-MM-DD") and time ("HH:MM") of an instant on a Mexico City
 * clock: the values for `<input type="date">` and `<input type="time">`.
 */
export function eventWallClock(value: EventDateInput | null | undefined): { date: string; time: string } | null {
  const d = toDate(value);
  if (!d) return null;
  const w = wallParts(d);
  return { date: `${w.year}-${pad(w.month)}-${pad(w.day)}`, time: `${pad(w.hour)}:${pad(w.minute)}` };
}

/**
 * The instant for a date ("YYYY-MM-DD") and optional time ("HH:MM", default
 * midnight) on a Mexico City clock. Returns null for invalid input.
 */
export function eventInstant(date: string, time?: string | null): Date | null {
  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const tm = /^(\d{1,2}):(\d{2})$/.exec((time || "00:00").trim());
  if (!dm || !tm) return null;
  const [year, month, day, hour, minute] = [+dm[1], +dm[2], +dm[3], +tm[1], +tm[2]];
  if (hour > 23 || minute > 59) return null;

  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const check = new Date(guess);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    return null; // e.g. 2026-02-31
  }

  // Shift by the offset, then once more in case that crossed an offset change.
  let instant = guess - offsetAt(guess);
  instant = guess - offsetAt(instant);
  return new Date(instant);
}

/** False for midnight Mexico City time, which means "time not set yet". */
export function hasEventTime(value: EventDateInput | null | undefined): boolean {
  const clock = eventWallClock(value);
  return clock !== null && clock.time !== "00:00";
}

/** `toLocaleString` on a Mexico City clock. Returns "" for missing or invalid dates. */
export function formatEventDate(
  value: EventDateInput | null | undefined,
  options: Intl.DateTimeFormatOptions,
  locale = "es-MX",
): string {
  const d = toDate(value);
  if (!d) return "";
  try {
    return d.toLocaleString(locale, { ...options, timeZone: EVENT_TIME_ZONE });
  } catch {
    return new Date(d.getTime() + FALLBACK_OFFSET_MS).toLocaleString(locale, { ...options, timeZone: "UTC" });
  }
}

/** "21:00" on a Mexico City clock, or "" when the time isn't set. */
export function formatEventTime(value: EventDateInput | null | undefined): string {
  if (!hasEventTime(value)) return "";
  return formatEventDate(value, { hour: "2-digit", minute: "2-digit", hour12: false });
}
