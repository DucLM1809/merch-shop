// Lab-side Web Vitals gate for catalog/product SSR routes (docs/adr/0014).
// Lighthouse has no field-INP equivalent in a single synthetic run, so Total
// Blocking Time stands in as the lab proxy for INP; real INP is a later
// RUM-based slice.
module.exports = {
  ci: {
    collect: {
      startServerCommand: "PORT=3000 node .output/server/index.mjs",
      startServerReadyPattern: "Listening",
      startServerReadyTimeout: 20000,
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/riot/league-of-legends",
        "http://localhost:3000/riot/league-of-legends/products/faker-jersey",
      ],
      numberOfRuns: 3,
      settings: {
        // Desktop: stable, reproducible lab numbers for this gate. Mobile/CWV
        // field data (Google's mobile-first ranking signal) is the RUM slice.
        preset: "desktop",
        // CI runners have no sandbox namespace and tiny /dev/shm — Chrome
        // needs both flags or it crashes on launch.
        chromeFlags: ["--no-sandbox", "--disable-dev-shm-usage"],
      },
    },
    assert: {
      assertions: {
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
