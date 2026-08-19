import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import {
  RouterContextProvider,
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { expect } from "vitest";
import { axe } from "vitest-axe";
import { DEFAULT_LOCALE, isSupportedLocale } from "./i18n/locales";
import { routeTree } from "./routeTree.gen";

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
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </ChakraProvider>
    </RouterContextProvider>
  );
}

/**
 * Every route lives under a `/$locale` segment, so a path given without one is
 * rendered under the default locale — callers only spell the locale out when the
 * test is about locale itself.
 */
function withDefaultLocale(path: string): string {
  const firstSegment = path.replace(/^\//, "").split(/[/?#]/, 1)[0];
  if (isSupportedLocale(firstSegment)) return path;

  return `/${DEFAULT_LOCALE}${path}`;
}

/** Render the full route tree at the given path (default: the default locale's root). */
export function renderRoute(path = "/") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const history = createMemoryHistory({ initialEntries: [withDefaultLocale(path)] });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history,
  });
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={defaultSystem}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </QueryClientProvider>
    ),
    router,
    queryClient,
  };
}

/** Assert zero axe accessibility violations against rendered DOM. Fails the test on violation. */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}
