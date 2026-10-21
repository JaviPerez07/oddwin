import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", testMatch: /spain\.spec\.ts/, fullyParallel: true, reporter: "list",
  use: { baseURL: "http://127.0.0.1:3102" },
  webServer: { command: "SITE_ENV=production npx next start --hostname 127.0.0.1 -p 3102", url: "http://127.0.0.1:3102", reuseExistingServer: false },
});
