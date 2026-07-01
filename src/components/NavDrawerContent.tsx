import { useEffect, useRef, type JSX } from "react";
import { Box, CloseButton, Flex, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { Gamepad2, LogIn, LogOut, ShoppingCart, User, UserPlus } from "lucide-react";

type NavDrawerContentProps = {
  itemCount: number;
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  userDisplayName?: string;
  onClose: () => void;
  onSignOut: () => void;
};

export function NavDrawerContent({
  itemCount,
  isLoaded,
  isSignedIn,
  userDisplayName,
  onClose,
  onSignOut,
}: NavDrawerContentProps): JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = (): HTMLElement[] =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    getFocusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

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

  return (
    <>
      <Box position="fixed" inset={0} bg="blackAlpha.600" zIndex="overlay" onClick={onClose} />
      <Box
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        position="fixed"
        left={0}
        top={0}
        bottom={0}
        w="280px"
        bg="gray.900"
        zIndex="modal"
        display="flex"
        flexDirection="column"
      >
        <Flex
          align="center"
          justify="space-between"
          p={4}
          borderBottom="1px solid"
          borderColor="gray.800"
        >
          <Link to="/" onClick={onClose}>
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
          </Link>
          <CloseButton size="sm" onClick={onClose} />
        </Flex>

        <Flex direction="column" gap={6} pt={6} px={4} pb={4} flex={1} overflowY="auto">
          <Link to="/cart" onClick={onClose}>
            <Flex
              align="center"
              gap={2.5}
              color={itemCount > 0 ? "white" : "gray.500"}
              _hover={{ color: "white" }}
              transition="color 0.15s"
              data-testid="drawer-cart-link"
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
            <Flex direction="column" gap={4}>
              <Flex align="center" gap={2} color="gray.300">
                <User size={16} strokeWidth={1.5} />
                <Text fontSize="sm" fontWeight="600" data-testid="drawer-username">
                  {userDisplayName}
                </Text>
              </Flex>
              <Box
                as="button"
                onClick={onSignOut}
                display="flex"
                alignItems="center"
                gap={1.5}
                color="gray.500"
                _hover={{ color: "white" }}
                transition="color 0.15s"
                cursor="pointer"
                aria-label="Sign out"
                data-testid="drawer-sign-out"
              >
                <LogOut size={16} strokeWidth={1.5} />
                <Text fontSize="sm" fontWeight="600">
                  Sign out
                </Text>
              </Box>
            </Flex>
          ) : isLoaded ? (
            <Flex direction="column" gap={4} data-testid="drawer-guest-links">
              <Link to="/sign-in" onClick={onClose}>
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
              <Link to="/sign-up" onClick={onClose}>
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
      </Box>
    </>
  );
}
