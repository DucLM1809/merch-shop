import { useEffect, useRef } from "react";
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { Alert, Box, ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider, useAuth } from "@clerk/react";
import { system } from "../theme";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { GlobalNav } from "../components/GlobalNav";
import { env } from "../env";
import { cartStore } from "../store/cart";
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
        <Alert.Title>Cart sync failed — your items have been preserved.</Alert.Title>
      </Alert.Root>
    </Box>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (env.VITE_ENABLE_MSW) {
      import("../mocks/browser")
        .then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }))
        .catch(() => {});
    }
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY ?? ""}>
          <ChakraProvider value={system}>
            <CartSyncEffect />
            <GlobalNav />
            {children}
          </ChakraProvider>
        </ClerkProvider>
        {!import.meta.env.VITEST && (
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
        )}
        <Scripts />
      </body>
    </html>
  );
}
