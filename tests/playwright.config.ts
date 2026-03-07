import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:8081",
    headless: true,
  },
  webServer: {
    command: "npm run web",
    url: "http://localhost:8081",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
