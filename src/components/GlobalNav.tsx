import { useEffect, useState, type JSX } from "react";
import { Box, Button, Flex, IconButton, Portal, Separator, Text } from "@chakra-ui/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { useTranslation } from "react-i18next";
import { useLocale } from "../i18n/useLocale";
import { useAccount, useAuth, useLogout } from "../modules/account";
import { cartStore } from "../store/cart";
import { Badge } from "./Badge";
import { NavDrawerContent } from "./NavDrawerContent";
import { UtilityShelf } from "./UtilityShelf";
import { Gamepad2, LogIn, LogOut, Menu, ShoppingCart } from "lucide-react";

const UTILITY_DIVIDER_HEIGHT = "18px";

// Fixed rather than padding-derived: the bar's contents change height between the signed-in
// chip and the guest sign-up button, and a sticky header that resizes under the user is the
// jitter this redesign exists to remove.
const NAV_HEIGHT = "64px";

// One stroke weight for every glyph in the bar. The previous mix (2 on the logo, 1.5
// elsewhere, at 16/18/20px) was a large part of why the row read as lumpy.
const ICON_STROKE = 1.75;

export function GlobalNav(): JSX.Element | null {
  const { t } = useTranslation();
  const itemCount = useSelector(cartStore, (s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const { isSignedIn, isLoaded } = useAuth();
  const { data: account } = useAccount(isSignedIn);
  const logout = useLogout();
  const locale = useLocale();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // The (auth) routes render a full-viewport takeover (see `AuthPageView`): a brand panel
  // beside the form, carrying its own mark back to the shop and its own preferences shelf.
  // A second bar of storefront chrome above that competes with the single action those pages
  // have. Matching the route group rather than listing paths keeps every current and future
  // (auth) route covered from one place.
  const isAuthRoute = useRouterState({
    select: (state) => state.matches.some((match) => match.routeId.includes("/(auth)/")),
  });

  // The guest cart lives in sessionStorage, which the server can't see — it always
  // renders a count of 0. The client's first paint must match that, or React discards
  // and regenerates the tree on hydration; the real count only appears once mounted.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  const displayItemCount = hasMounted ? itemCount : 0;

  // After every hook above, so the bar mounting and unmounting across a navigation into or
  // out of the auth takeover never reorders them.
  if (isAuthRoute) return null;

  const handleSignOut = () => logout.mutate();
  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

  const userDisplayName = account?.email;
  // The bar showed the raw address truncated mid-domain ("admin.test@merch…"), which is
  // both ugly and uninformative. The local part identifies the signed-in user on its own;
  // the full address stays reachable as the chip's title and lives in full in the drawer.
  const accountHandle = userDisplayName?.split("@")[0] ?? userDisplayName;
  const accountInitial = userDisplayName?.[0]?.toUpperCase() ?? "";

  const cartBadge = displayItemCount > 0 && (
    <Box position="absolute" top="-8px" right="-10px">
      <Badge variant="count" tone="signal">
        {displayItemCount}
      </Badge>
    </Box>
  );

  const logo = (
    <Flex align="center" gap={2.5}>
      <Box color="blue.400" display="flex" alignItems="center">
        <Gamepad2 size={18} strokeWidth={ICON_STROKE} />
      </Box>
      <Text
        color="fg"
        fontFamily="heading"
        fontWeight="700"
        fontSize="sm"
        letterSpacing="0.1em"
        textTransform="uppercase"
      >
        {t("brand")}
      </Text>
    </Flex>
  );

  return (
    <>
      <Box
        as="nav"
        position="sticky"
        top={0}
        zIndex={10}
        h={NAV_HEIGHT}
        // A 2px full-bleed signal-orange rule used to sit here. `signal` is documented in
        // `theme/system.ts` as the narrow live-indicator accent and explicitly "never a
        // competing primary brand color" — at full width it was the loudest thing on the
        // page and read as a warning bar. The accent now appears only where it means
        // something: the cart count badge. Separation comes from surface + hairline.
        borderBottomWidth="1px"
        borderBottomColor="border"
        px={{ base: 4, md: 6 }}
        bg="bg/90"
        backdropFilter="blur(12px) saturate(180%)"
      >
        <Flex h="full" align="center" gap={8} maxW="7xl" mx="auto">
          {/* The brand mark is the storefront's entry point: it carries the one navigational
              destination the bar has, so a standalone "Shop" link next to it would be a
              second control pointing at the same page. */}
          <Link to="/$locale/shop" params={{ locale }}>
            <Box _hover={{ opacity: 0.75 }} transition="opacity 0.15s">
              {logo}
            </Box>
          </Link>

          <Box flex="1" />

          <Flex align="center" gap={4} hideBelow="lg">
            {/* Preferences. Both controls have to stay mounted in the nav (their tests query
                them synchronously), so instead of hiding them they're grouped into one
                recessed shelf that reads as a single settings object rather than as two
                more peers of the cart and account controls beside them. */}
            <UtilityShelf />

            {/* Commerce. The badge digit renders inside the link, so its computed name would
                otherwise read "1 Cart" — spell the count out instead. */}
            <Link
              to="/$locale/cart"
              params={{ locale }}
              aria-label={t("nav.cartItems", { count: displayItemCount })}
            >
              <Flex
                align="center"
                gap={2}
                color={displayItemCount > 0 ? "fg" : "fg.muted"}
                _hover={{ color: "blue.400" }}
                transition="color 0.15s"
              >
                <Box position="relative" display="flex" alignItems="center">
                  <ShoppingCart size={18} strokeWidth={ICON_STROKE} />
                  {cartBadge}
                </Box>
                <Text fontSize="sm" fontWeight="600">
                  {t("nav.cart")}
                </Text>
              </Flex>
            </Link>

            {/* Identity. The divider is inside the guard — auth resolves a beat
                after first paint, and hanging a hairline off the end of the bar with
                nothing behind it is the exact kind of stray mark this pass is removing. */}
            {isLoaded && (
              <Separator
                orientation="vertical"
                h={UTILITY_DIVIDER_HEIGHT}
                borderColor="border.emphasized"
              />
            )}

            {isLoaded && isSignedIn ? (
              <Flex align="center" gap={2}>
                <Flex
                  align="center"
                  gap={2.5}
                  maxW="11rem"
                  title={userDisplayName}
                  data-testid="nav-account-menu"
                >
                  <Flex
                    align="center"
                    justify="center"
                    flexShrink={0}
                    boxSize="26px"
                    borderRadius="full"
                    bg="bg.subtle"
                    borderWidth="1px"
                    borderColor="border.emphasized"
                    color="fg"
                    fontSize="11px"
                    fontWeight="700"
                    aria-hidden
                  >
                    {accountInitial}
                  </Flex>
                  <Text fontSize="sm" fontWeight="600" color="fg.muted" truncate>
                    {accountHandle}
                  </Text>
                </Flex>
                <IconButton
                  aria-label={t("nav.signOut")}
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  color="fg.subtle"
                  _hover={{ color: "fg", bg: "bg.muted" }}
                  data-testid="nav-sign-out"
                >
                  <LogOut size={16} strokeWidth={ICON_STROKE} />
                </IconButton>
              </Flex>
            ) : isLoaded ? (
              // Sign in and sign up used to be two text links differing only in color, so
              // the bar ended on no anchor at all. Sign-up is the conversion action, so it
              // takes the solid treatment and terminates the row.
              <Flex align="center" gap={3} data-testid="nav-guest-links">
                <Link to="/$locale/sign-in" params={{ locale }}>
                  <Flex
                    align="center"
                    gap={1.5}
                    color="fg.muted"
                    _hover={{ color: "fg" }}
                    transition="color 0.15s"
                  >
                    <LogIn size={16} strokeWidth={ICON_STROKE} />
                    <Text fontSize="sm" fontWeight="600">
                      {t("nav.signIn")}
                    </Text>
                  </Flex>
                </Link>
                <Button asChild size="sm" colorPalette="blue">
                  <Link to="/$locale/sign-up" params={{ locale }}>
                    {t("nav.signUp")}
                  </Link>
                </Button>
              </Flex>
            ) : null}
          </Flex>

          <IconButton
            aria-label={t("nav.openMenu")}
            variant="ghost"
            color="fg.muted"
            hideFrom="lg"
            onClick={handleOpenDrawer}
            data-testid="mobile-menu-button"
          >
            <Menu size={22} strokeWidth={ICON_STROKE} />
          </IconButton>
        </Flex>
      </Box>

      {drawerOpen && (
        <Portal>
          <NavDrawerContent
            itemCount={itemCount}
            isLoaded={isLoaded}
            isSignedIn={isSignedIn}
            userDisplayName={userDisplayName}
            onClose={handleCloseDrawer}
            onSignOut={handleSignOut}
          />
        </Portal>
      )}
    </>
  );
}
