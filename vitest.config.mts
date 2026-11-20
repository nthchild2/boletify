import { defineConfig } from 'vitest/config';

// Unit tests for pure logic across the monorepo (no database, no network).
export default defineConfig({
  test: {
    include: ['packages/*/src/**/*.test.ts', 'apps/web/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
    environment: 'node',
  },
});
