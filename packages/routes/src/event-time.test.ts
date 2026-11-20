import { describe, expect, it } from 'vitest';
import { eventInstant, eventWallClock, formatEventDate, formatEventTime, hasEventTime } from './event-time';

// These run in whatever time zone the machine has (UTC on CI, Mexico City on
// a dev Mac); the results must be the same in both.

describe('eventInstant (Mexico City clock -> UTC instant)', () => {
  it('a Friday 21:00 show is 03:00 UTC on Saturday', () => {
    expect(eventInstant('2027-03-12', '21:00')?.toISOString()).toBe('2027-03-13T03:00:00.000Z');
  });

  it('defaults to midnight Mexico City time when no time is given', () => {
    expect(eventInstant('2026-06-02')?.toISOString()).toBe('2026-06-02T06:00:00.000Z');
    expect(eventInstant('2026-06-02', '')?.toISOString()).toBe('2026-06-02T06:00:00.000Z');
  });

  it('uses the summer-time offset that applied before Mexico dropped DST in 2022', () => {
    expect(eventInstant('2020-07-01', '12:00')?.toISOString()).toBe('2020-07-01T17:00:00.000Z');
    expect(eventInstant('2020-01-15', '12:00')?.toISOString()).toBe('2020-01-15T18:00:00.000Z');
  });

  it('rejects malformed or impossible dates and times', () => {
    for (const [date, time] of [
      ['', '21:00'],
      ['2026-02-31', '21:00'],
      ['2026-13-01', null],
      ['12/03/2027', '21:00'],
      ['2027-03-12', '24:00'],
      ['2027-03-12', '21:60'],
      ['2027-03-12', '9pm'],
    ] as const) {
      expect(eventInstant(date, time)).toBeNull();
    }
  });
});

describe('eventWallClock (UTC instant -> Mexico City clock)', () => {
  it('shows the late show on its local day, not the UTC day', () => {
    expect(eventWallClock('2027-03-13T03:00:00.000Z')).toEqual({ date: '2027-03-12', time: '21:00' });
  });

  it('round-trips with eventInstant', () => {
    for (const [date, time] of [
      ['2026-06-02', '21:00'],
      ['2026-12-31', '23:59'],
      ['2027-01-01', '00:00'],
      ['2026-07-04', '06:30'],
    ]) {
      expect(eventWallClock(eventInstant(date, time))).toEqual({ date, time });
    }
  });

  it('returns null for missing or invalid input', () => {
    expect(eventWallClock(null)).toBeNull();
    expect(eventWallClock('not a date')).toBeNull();
  });
});

describe('hasEventTime', () => {
  it('is false at midnight Mexico City time (time not set yet)', () => {
    expect(hasEventTime(eventInstant('2026-06-02'))).toBe(false);
  });

  it('is true at midnight UTC, which is 18:00 the day before in Mexico City', () => {
    expect(hasEventTime('2026-06-02T00:00:00.000Z')).toBe(true);
  });
});

describe('formatting', () => {
  it('formats the date on the Mexico City day', () => {
    const late = '2027-03-13T03:00:00.000Z'; // Fri 12 Mar, 21:00 in CDMX
    const label = formatEventDate(late, { weekday: 'short', day: 'numeric', month: 'short' });
    expect(label).toMatch(/vie/i);
    expect(label).toMatch(/12/);
  });

  it('formats the time as 24-hour Mexico City time', () => {
    expect(formatEventTime('2027-03-13T03:00:00.000Z')).toBe('21:00');
    expect(formatEventTime(eventInstant('2026-06-19', '20:30'))).toBe('20:30');
  });

  it('returns "" for a date without a time, and for missing dates', () => {
    expect(formatEventTime(eventInstant('2026-06-02'))).toBe('');
    expect(formatEventTime(null)).toBe('');
    expect(formatEventDate(undefined, { day: 'numeric' })).toBe('');
  });
});
