import React from "react";
import type { Preview } from "@storybook/tanstack-react";
import { ChakraProvider } from "@chakra-ui/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import { I18nextProvider } from "react-i18next";
import { system } from "../src/theme/system";
import { getI18n } from "../src/i18n/i18n";
import { DEFAULT_LOCALE } from "../src/i18n/locales";
import { handlers } from "../src/mocks/handlers";

initialize({ onUnhandledRequest: "bypass" });

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    msw: {
      handlers,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [
    (Story) => (
      // Stories render against the real default-locale resources, same as `renderWithProviders`
      // — a story showing raw `t()` keys is a story that can't be reviewed.
      <div
        data-theme="dark"
        style={{ minHeight: "100dvh", background: "var(--chakra-colors-gray-950, #0a0a0a)" }}
      >
        <I18nextProvider i18n={getI18n(DEFAULT_LOCALE)}>
          <ChakraProvider value={system}>
            <Story />
          </ChakraProvider>
        </I18nextProvider>
      </div>
    ),
  ],
};

export default preview;
