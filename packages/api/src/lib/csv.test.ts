import { describe, expect, it } from 'vitest';
import { escapeCsvCell, toCsv } from './csv';

describe('escapeCsvCell', () => {
  it('leaves plain text alone', () => {
    expect(escapeCsvCell('Diego Martínez')).toBe('Diego Martínez');
    expect(escapeCsvCell('diego@example.com')).toBe('diego@example.com');
  });

  it('quotes commas, quotes and line breaks, doubling quotes', () => {
    expect(escapeCsvCell('Martínez, Diego')).toBe('"Martínez, Diego"');
    expect(escapeCsvCell('El "Flaco"')).toBe('"El ""Flaco"""');
    expect(escapeCsvCell('línea 1\nlínea 2')).toBe('"línea 1\nlínea 2"');
    expect(escapeCsvCell('a\r\nb')).toBe('"a\r\nb"');
  });

  it('quotes leading or trailing spaces so they survive', () => {
    expect(escapeCsvCell(' Ana ')).toBe('" Ana "');
  });

  it.each(['=1+1', '+52 55 1234', '-2+3', '@SUM(A1)', '\t=cmd', '\r=cmd'])(
    'neutralises spreadsheet formulas: %j',
    (value) => {
      const out = escapeCsvCell(value);
      expect(out.replace(/^"/, '').startsWith("'")).toBe(true);
    },
  );

  it('neutralises a formula that also needs quoting', () => {
    expect(escapeCsvCell('=HYPERLINK("http://x","y")')).toBe('"\'=HYPERLINK(""http://x"",""y"")"');
  });

  it('formats empty values, numbers, booleans and dates', () => {
    expect(escapeCsvCell(null)).toBe('');
    expect(escapeCsvCell(undefined)).toBe('');
    expect(escapeCsvCell(1500)).toBe('1500');
    expect(escapeCsvCell(-3)).toBe('-3');
    expect(escapeCsvCell(Number.NaN)).toBe('');
    expect(escapeCsvCell(true)).toBe('true');
    expect(escapeCsvCell(new Date('2026-11-20T06:00:00Z'))).toBe('2026-11-20T06:00:00.000Z');
  });
});

describe('toCsv', () => {
  it('starts with a UTF-8 BOM and ends rows with CRLF', () => {
    const csv = toCsv(['Nombre', 'Correo'], [['Ñoño', 'n@example.com']]);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv.slice(1)).toBe('Nombre,Correo\r\nÑoño,n@example.com\r\n');
  });

  it('writes only the header row when there is no data', () => {
    expect(toCsv(['A'], [])).toBe('﻿A\r\n');
  });
});
