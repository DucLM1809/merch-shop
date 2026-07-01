import { useState, type JSX } from "react";
import { Box, Flex, IconButton, Portal, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useAuth, useUser, useClerk } from "@clerk/react";
import { cartStore } from "../store/cart";
import { NavDrawerContent } from "./NavDrawerContent";
import { Gamepad2, LogIn, LogOut, Menu, ShoppingCart, User, UserPlus } from "lucide-react";

export function GlobalNav(): JSX.Element {
  const itemCount = useStore(cartStore, (s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSignOut = () => signOut();
  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);
  const userDisplayName = user?.firstName ?? user?.emailAddresses[0]?.emailAddress;

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
        Merch Shop
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
          <Link to="/">
            <Box _hover={{ opacity: 0.75 }} transition="opacity 0.15s">
              {logo}
            </Box>
          </Link>

          <Flex align="center" gap={4} hideBelow="sm">
            <Link to="/cart">
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
                  Cart
                </Text>
              </Flex>
            </Link>

            {isLoaded && isSignedIn ? (
              <Flex align="center" gap={3}>
                <Flex align="center" gap={2} color="gray.300" data-testid="nav-account-menu">
                  <User size={16} strokeWidth={1.5} />
                  <Text fontSize="sm" fontWeight="600">
                    {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}
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
                  aria-label="Sign out"
                  data-testid="nav-sign-out"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                  <Text fontSize="sm" fontWeight="600">
                    Sign out
                  </Text>
                </Box>
              </Flex>
            ) : isLoaded ? (
              <Flex align="center" gap={3} data-testid="nav-guest-links">
                <Link to="/sign-in">
                  <Flex
                    align="center"
                    gap={1.5}
                    color="gray.400"
                    _hover={{ color: "white" }}
                    transition="color 0.15s"
                  >
                    <LogIn size={16} strokeWidth={1.5} />
                    <Text fontSize="sm" fontWeight="600">
                      Sign in
                    </Text>
                  </Flex>
                </Link>
                <Link to="/sign-up">
                  <Flex
                    align="center"
                    gap={1.5}
                    color="blue.400"
                    _hover={{ color: "blue.300" }}
                    transition="color 0.15s"
                  >
                    <UserPlus size={16} strokeWidth={1.5} />
                    <Text fontSize="sm" fontWeight="600">
                      Sign up
                    </Text>
                  </Flex>
                </Link>
              </Flex>
            ) : null}
          </Flex>

          <IconButton
            aria-label="Open navigation"
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
