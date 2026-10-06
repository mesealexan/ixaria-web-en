import { defineConfig, devices } from '@playwright/test';

// Verify the production output, using the same static pages as deployment.

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4330',
    trace: 'retain-on-failure',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node tests/serve-preview.mjs',
    url: 'http://127.0.0.1:4330',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
