import { useState, type JSX } from "react";
import { Box, Flex, IconButton, Portal, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useTranslation } from "react-i18next";
import { useLocale } from "../i18n/useLocale";
import { useAccount, useAuth, useLogout } from "../modules/account";
import { cartStore } from "../store/cart";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NavDrawerContent } from "./NavDrawerContent";
import { Gamepad2, LogIn, LogOut, Menu, ShoppingCart, User, UserPlus } from "lucide-react";

export function GlobalNav(): JSX.Element {
  const { t } = useTranslation();
  const itemCount = useStore(cartStore, (s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const { isSignedIn, isLoaded } = useAuth();
  const { data: account } = useAccount(isSignedIn);
  const logout = useLogout();
  const locale = useLocale();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSignOut = () => logout.mutate();
  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);
  const userDisplayName = account?.email;

  const cartBadge = itemCount > 0 && (
    <Box
      position="absolute"
      top="-8px"
      right="-10px"
      bg="blue.500"
      color="white"
      borderRadius="full"
      minW="18px"
      h="18px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="3px"
    >
      <Text fontSize="10px" fontWeight="800" lineHeight="1">
        {itemCount}
      </Text>
    </Box>
  );

  const logo = (
    <Flex align="center" gap={2.5}>
      <Box color="blue.400" display="flex" alignItems="center">
        <Gamepad2 size={18} strokeWidth={2} />
      </Box>
      <Text
        color="white"
        fontWeight="800"
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
        borderBottom="1px solid"
        borderColor="gray.800"
        px={6}
        py={3.5}
        style={{ backgroundColor: "rgba(6, 6, 10, 0.95)", backdropFilter: "blur(12px)" }}
      >
        <Flex align="center" justify="space-between" maxW="7xl" mx="auto">
          <Link to="/$locale" params={{ locale }}>
            <Box _hover={{ opacity: 0.75 }} transition="opacity 0.15s">
              {logo}
            </Box>
          </Link>

          <Flex align="center" gap={4} hideBelow="sm">
            <LocaleSwitcher />

            {/* The badge digit renders inside the link, so its computed name would
                otherwise read "1 Cart" — spell the count out instead. */}
            <Link
              to="/$locale/cart"
              params={{ locale }}
              aria-label={t("nav.cartItems", { count: itemCount })}
            >
              <Flex
                align="center"
                gap={2.5}
                color={itemCount > 0 ? "white" : "gray.500"}
                _hover={{ color: "white" }}
                transition="color 0.15s"
              >
                <Box position="relative" display="flex" alignItems="center">
                  <ShoppingCart size={20} strokeWidth={1.5} />
                  {cartBadge}
                </Box>
                <Text fontSize="sm" fontWeight="600">
                  {t("nav.cart")}
                </Text>
              </Flex>
            </Link>

            {isLoaded && isSignedIn ? (
              <Flex align="center" gap={3}>
                <Flex align="center" gap={2} color="gray.300" data-testid="nav-account-menu">
                  <User size={16} strokeWidth={1.5} />
                  <Text fontSize="sm" fontWeight="600">
                    {userDisplayName}
                  </Text>
                </Flex>
                <Box
                  as="button"
                  onClick={handleSignOut}
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  color="gray.500"
                  _hover={{ color: "white" }}
                  transition="color 0.15s"
                  cursor="pointer"
                  aria-label={t("nav.signOut")}
                  data-testid="nav-sign-out"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                  <Text fontSize="sm" fontWeight="600">
                    {t("nav.signOut")}
                  </Text>
                </Box>
              </Flex>
            ) : isLoaded ? (
              <Flex align="center" gap={3} data-testid="nav-guest-links">
                <Link to="/$locale/sign-in" params={{ locale }}>
                  <Flex
                    align="center"
                    gap={1.5}
                    color="gray.400"
                    _hover={{ color: "white" }}
                    transition="color 0.15s"
                  >
                    <LogIn size={16} strokeWidth={1.5} />
                    <Text fontSize="sm" fontWeight="600">
                      {t("nav.signIn")}
                    </Text>
                  </Flex>
                </Link>
                <Link to="/$locale/sign-up" params={{ locale }}>
                  <Flex
                    align="center"
                    gap={1.5}
                    color="blue.400"
                    _hover={{ color: "blue.300" }}
                    transition="color 0.15s"
                  >
                    <UserPlus size={16} strokeWidth={1.5} />
                    <Text fontSize="sm" fontWeight="600">
                      {t("nav.signUp")}
                    </Text>
                  </Flex>
                </Link>
              </Flex>
            ) : null}
          </Flex>

          <IconButton
            aria-label={t("nav.openMenu")}
            variant="ghost"
            color="gray.400"
            hideFrom="sm"
            onClick={handleOpenDrawer}
            data-testid="mobile-menu-button"
          >
            <Menu size={22} strokeWidth={1.5} />
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
