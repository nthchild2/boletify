import { describe, expect, it } from 'vitest';
import { profileInputSchema } from './organiser-profile';

const base = { organiserName: 'Foro Indie', bio: '', logoUrl: '', slug: 'foro-indie' };

describe('profileInputSchema', () => {
  it('accepts a valid profile and turns empty optional fields into null', () => {
    expect(profileInputSchema.parse(base)).toEqual({ organiserName: 'Foro Indie', bio: null, logoUrl: null, slug: 'foro-indie' });
  });

  it('trims and lowercases the slug', () => {
    expect(profileInputSchema.parse({ ...base, slug: '  Foro-Indie ' }).slug).toBe('foro-indie');
  });

  it.each(['ab', '-foro', 'foro-', 'foro indie', 'foro_indie', 'forö', 'a'.repeat(41)])('rejects slug %j', (slug) => {
    expect(profileInputSchema.safeParse({ ...base, slug }).success).toBe(false);
  });

  it.each(['abc', 'foro-indie-2026', 'a'.repeat(40)])('accepts slug %j', (slug) => {
    expect(profileInputSchema.safeParse({ ...base, slug }).success).toBe(true);
  });

  it('only accepts https logo URLs', () => {
    expect(profileInputSchema.safeParse({ ...base, logoUrl: 'https://cdn.example.com/logo.png' }).success).toBe(true);
    expect(profileInputSchema.safeParse({ ...base, logoUrl: 'http://cdn.example.com/logo.png' }).success).toBe(false);
    expect(profileInputSchema.safeParse({ ...base, logoUrl: 'javascript:alert(1)' }).success).toBe(false);
  });

  it('requires a name of 2 to 80 characters and a bio of at most 500', () => {
    expect(profileInputSchema.safeParse({ ...base, organiserName: ' A ' }).success).toBe(false);
    expect(profileInputSchema.safeParse({ ...base, organiserName: 'x'.repeat(81) }).success).toBe(false);
    expect(profileInputSchema.safeParse({ ...base, bio: 'x'.repeat(501) }).success).toBe(false);
  });
});
