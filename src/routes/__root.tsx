import { useEffect, useRef } from "react";
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { Alert, Box, ChakraProvider } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { system } from "../theme";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { GlobalNav } from "../components/GlobalNav";
import { Toaster } from "../components/Toaster";
import { env } from "../env";
import { getI18n } from "../i18n/i18n";
import { useLocale } from "../i18n/useLocale";
import { bootstrapAuth, useAuth } from "../modules/account";
import { cartStore } from "../store/cart";
import { registerHardSignOutHandler } from "../store/authToken";
import { useCartSync } from "../modules/cart";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Merch Shop",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function CartSyncEffect() {
  const { t } = useTranslation();
  const { isLoaded, isSignedIn } = useAuth();
  const prevSignedIn = useRef(false);
  const { mutate, isError } = useCartSync();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && !prevSignedIn.current) {
      const items = cartStore.state.items;
      if (items.length > 0) mutate(items);
    }
    prevSignedIn.current = isSignedIn ?? false;
  }, [isLoaded, isSignedIn, mutate]);

  if (!isError) return null;

  return (
    <Box position="fixed" top={0} left={0} right={0} zIndex="toast">
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>{t("cartSync.failed")}</Alert.Title>
      </Alert.Root>
    </Box>
  );
}

function AuthBootstrapEffect() {
  const queryClient = useQueryClient();

  useEffect(() => {
    registerHardSignOutHandler(() => queryClient.clear());
    void bootstrapAuth(queryClient);
  }, [queryClient]);

  return null;
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const i18n = getI18n(locale);

  useEffect(() => {
    if (env.VITE_ENABLE_MSW) {
      import("../mocks/browser")
        .then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }))
        .catch(() => {});
    }
  }, []);

  // In the real app the rendered <html> below *is* document.documentElement (SSR
  // hydrates/replaces the whole document), so these land there implicitly. The
  // Vitest unit project skips that element entirely (see below), so set them
  // explicitly here to keep the two paths equivalent.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.className = "dark";
  }, [locale]);

  const body = (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider value={system}>
        <AuthBootstrapEffect />
        <CartSyncEffect />
        <GlobalNav />
        {children}
        <Toaster />
      </ChakraProvider>
    </I18nextProvider>
  );

  // The unit project renders this tree with Testing Library's render(), which mounts
  // into a <div> under the real jsdom document — nesting a second <html> inside that
  // div corrupts jsdom's parentNode chain for descendant nodes (jsdom itself warns
  // "<html> cannot be a child of <div>"), and React DOM's event dispatch walks that
  // chain to find the nearest fiber, so a click can spin forever with no macrotask
  // ever running to time it out. Skip the outer <html>/<body> under Vitest, but keep
  // a bare <head> so HeadContent's <title>/<meta>/<script> tags still have a real
  // head element to land in — only <html> triggers the parentNode corruption above.
  if (import.meta.env.VITEST) {
    return (
      <>
        <head>
          <HeadContent />
        </head>
        {body}
      </>
    );
  }

  return (
    <html lang={locale} className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {body}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <SpeedInsights />
        <Scripts />
      </body>
    </html>
  );
}
