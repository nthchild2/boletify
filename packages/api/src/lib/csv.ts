/**
 * CSV for spreadsheet apps (Excel, Google Sheets, Numbers).
 *
 * - UTF-8 with a byte-order mark, so Excel shows accents (é, ñ) correctly.
 * - RFC 4180 quoting: fields with commas, quotes or line breaks are quoted,
 *   and quotes are doubled. Rows end with CRLF.
 * - Formula injection guard: a cell starting with = + - @ (or a tab/CR,
 *   which some apps strip first) is prefixed with an apostrophe so the
 *   spreadsheet shows it as text instead of running it. Buyer names and
 *   emails are typed by the public, so this matters.
 */

export type CsvCell = string | number | boolean | null | undefined | Date;

const BOM = '﻿';
const FORMULA_START = /^[=+\-@\t\r]/;

export function escapeCsvCell(value: CsvCell): string {
  if (value === null || value === undefined) return '';
  let text: string;
  if (value instanceof Date) text = value.toISOString();
  else if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '';
  else if (typeof value === 'boolean') text = value ? 'true' : 'false';
  else text = value;

  if (FORMULA_START.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) || /^\s|\s$/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(headers: string[], rows: CsvCell[][]): string {
  const lines = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(','));
  return BOM + lines.join('\r\n') + '\r\n';
}
