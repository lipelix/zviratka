import { defineConfig, devices } from "@playwright/test";

// The specs run at 1x device pixels: smaller screenshots, faster software rendering.
const oneX = { deviceScaleFactor: 1 };

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  use: { baseURL: "http://localhost:5181", trace: "retain-on-failure" },
  webServer: [
    {
      command: "npm run dev -- --port 5181 --strictPort",
      url: "http://localhost:5181",
      reuseExistingServer: !process.env["CI"],
    },
    // The production build in a sub-folder, as GitHub Pages serves it: the installable,
    // offline game (service worker, no dev hooks).
    {
      command:
        "npm run build && npm run preview -- --base /zviratka/ --port 4181 --strictPort",
      url: "http://localhost:4181/zviratka/",
      reuseExistingServer: !process.env["CI"],
      timeout: 180_000,
    },
  ],
  projects: [
    {
      name: "phone-landscape",
      testIgnore: /pwa\.spec\.ts/,
      use: { ...devices["Pixel 7 landscape"], ...oneX },
    },
    {
      name: "phone-portrait",
      testIgnore: /pwa\.spec\.ts/,
      use: { ...devices["Pixel 7"], ...oneX },
    },
    {
      name: "tablet",
      testIgnore: /pwa\.spec\.ts/,
      use: { ...devices["Galaxy Tab S9 landscape"], ...oneX },
    },
    // Safari (iPhone, iPad): WebKit lacks APIs Chromium has, e.g. navigator.vibrate.
    {
      name: "iphone",
      testIgnore: /pwa\.spec\.ts/,
      use: { ...devices["iPhone 13 landscape"], ...oneX },
    },
    {
      name: "pwa",
      testMatch: /pwa\.spec\.ts/,
      use: {
        ...devices["Pixel 7 landscape"],
        baseURL: "http://localhost:4181/zviratka/",
        serviceWorkers: "allow",
      },
    },
  ],
});
