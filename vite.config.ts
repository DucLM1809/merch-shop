/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
const dirname =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const isTest = !!process.env.VITEST;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    // ponytail: skip heavy build plugins in unit tests — tanstackStart regenerates the route tree
    // per worker and emits 28+ warnings; babel/reactCompiler adds ~400ms transform per file
    !isTest && devtools(),
    !isTest && tanstackStart(),
    !isTest && nitro(),
    viteReact(),
    !isTest &&
      babel({
        presets: [reactCompilerPreset()],
      }),
  ],
  test: {
    coverage: {
      provider: "v8",
      exclude: ["**/*.test.{ts,tsx}", "**/mocks/**", "src/routeTree.gen.ts", "src/test-setup.tsx"],
      thresholds: {
        branches: 80,
        lines: 80,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./src/test-setup.tsx"],
          // ponytail: pending MSW handlers (never-resolving promises) keep sockets open; force exit so Vitest doesn't hang waiting for the event loop to drain
          forceExit: true,
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
});
export default config;
