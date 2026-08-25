import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import {
  RouterContextProvider,
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import type { ReactElement } from "react";
import { expect } from "vitest";
import { axe } from "vitest-axe";
import { DEFAULT_LOCALE } from "./i18n/locales";
import { formatPrice } from "./i18n/formatPrice";
import { getI18n } from "./i18n/i18n";
import { routeTree } from "./routeTree.gen";
import { system } from "./theme";

import type { SupportedLocale } from "./i18n/locales";

/**
 * Render a component outside the route tree, against the real default-locale resources —
 * no translation mock, so a test sees exactly the copy a visitor would.
 *
 * `renderRoute` needs no equivalent: the root shell provides the instance for whichever
 * locale the path resolves to.
 */
export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory(),
  });
  return render(
    <RouterContextProvider router={router}>
      <I18nextProvider i18n={getI18n(DEFAULT_LOCALE)}>
        <ChakraProvider value={system}>
          <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
        </ChakraProvider>
      </I18nextProvider>
    </RouterContextProvider>
  );
}

/**
 * Render the full route tree at the given path (default: the root).
 *
 * A path given without a locale segment is redirected onto one by the app itself
 * (jsdom offers no locale cookie, so that lands on the default locale) — callers
 * only spell the locale out when the test is about locale itself.
 */
export function renderRoute(path = "/") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const history = createMemoryHistory({ initialEntries: [path] });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history,
  });
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={system}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </QueryClientProvider>
    ),
    router,
    queryClient,
  };
}

/** Every kind of space `Intl` may emit, flattened to one plain space. */
function flattenSpaces(text: string): string {
  return text.replace(/\s+/gu, " ").trim();
}

/**
 * A Testing Library text matcher for a locale-formatted price.
 *
 * `Intl` separates a French amount from its currency symbol with a narrow no-break space
 * (U+202F). Testing Library's default normalizer collapses that in the DOM text but leaves
 * it intact in the expected string, so `getByText(formatPrice(59.99, "fr-FR"))` misses a
 * page that rendered exactly the right thing. Comparing with every space flattened asserts
 * what the reader actually sees.
 */
export function priceText(amount: number, locale: SupportedLocale): (content: string) => boolean {
  const expected = flattenSpaces(formatPrice(amount, locale));

  return (content: string) => flattenSpaces(content) === expected;
}

/** Assert zero axe accessibility violations against rendered DOM. Fails the test on violation. */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}
