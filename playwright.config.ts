import { defineConfig, devices } from "@playwright/test";

/*
 * Two production builds are served side by side (see `npm run build:e2e`):
 *  - :3100 SITE_ENV=production — what visitors get; fixtures impossible.
 *  - :3101 SITE_ENV=test + AFFILIATE_TEST_FIXTURES=1 — fictional example.com
 *    operators, used only to exercise eligibility and the /go redirect.
 */
const PROD = "http://localhost:3100";
const FIXTURES = "http://localhost:3101";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: { trace: "retain-on-failure" },
  webServer: [
    {
      command: "NEXT_DIST_DIR=.next-e2e-prod SITE_ENV=production npx next start -p 3100",
      url: PROD,
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: "NEXT_DIST_DIR=.next-e2e-fixtures SITE_ENV=test AFFILIATE_TEST_FIXTURES=1 npx next start -p 3101",
      url: FIXTURES,
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
  projects: [
    { name: "unit", testMatch: /unit\.spec\.ts/ },
    { name: "desktop", testMatch: /site\.spec\.ts/, use: { ...devices["Desktop Chrome"], baseURL: PROD, viewport: { width: 1440, height: 900 } } },
    { name: "mobile", testMatch: /(site|responsive)\.spec\.ts/, use: { ...devices["Pixel 7"], baseURL: PROD } },
    { name: "fixtures", testMatch: /(affiliate|assets)\.spec\.ts/, use: { ...devices["Desktop Chrome"], baseURL: FIXTURES } },
    { name: "production-guard", testMatch: /production-guard\.spec\.ts/, use: { baseURL: PROD } },
  ],
});
