import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  timeout: 120000,
  workers: 1,
  use: { baseURL: 'http://localhost:8091', channel: 'chrome', headless: true },
  projects: [
    { name: 'mobile-393', use: { viewport: { width: 393, height: 852 }, isMobile: true } },
    { name: 'mobile-360', use: { viewport: { width: 360, height: 800 }, isMobile: true } },
  ],
  webServer: {
    command: 'npm start -- --port 8091 --localhost',
    url: 'http://localhost:8091',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
