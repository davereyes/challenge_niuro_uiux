/// <reference types="vitest/config" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const src = (p: string) => path.resolve(dirname, 'src', p);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Keep in sync with "paths" in tsconfig.app.json
    alias: {
      '@app': src('app'),
      '@domain': src('domain'),
      '@application': src('application'),
      '@infrastructure': src('infrastructure'),
      '@presentation': src('presentation'),
      '@ds': src('presentation/design-system'),
      '@shared': src('shared'),
    },
  },
  test: {
    projects: [
      {
        // Pure TS tests: domain, application, infrastructure, shared
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        // Every story is a test (render + play + a11y) in a real browser
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
