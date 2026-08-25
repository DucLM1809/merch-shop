import { useEffect, useRef, type JSX } from "react";
import { Box, CloseButton, Flex, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { Gamepad2, LogIn, LogOut, ShoppingCart, User, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLocale } from "../i18n/useLocale";
import { Badge } from "./Badge";
import { LocaleSwitcher } from "./LocaleSwitcher";

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
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

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
    <Box position="absolute" top="-8px" right="-10px">
      <Badge variant="count" tone="signal">
        {itemCount}
      </Badge>
    </Box>
  );

  return (
    <>
      <Box
        position="fixed"
        inset={0}
        bg="blackAlpha.600"
        zIndex="overlay"
        onClick={onClose}
        data-testid="nav-drawer-overlay"
      />
      <Box
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.menuLabel")}
        position="fixed"
        left={0}
        top={0}
        bottom={0}
        w="280px"
        bg="bg.panel"
        zIndex="modal"
        display="flex"
        flexDirection="column"
      >
        <Flex
          align="center"
          justify="space-between"
          p={4}
          borderBottomWidth="1px"
          borderColor="border.muted"
        >
          <Link to="/$locale" params={{ locale }} onClick={onClose}>
            <Flex align="center" gap={2.5}>
              <Box color="blue.400" display="flex" alignItems="center">
                <Gamepad2 size={18} strokeWidth={2} />
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
          </Link>
          <CloseButton size="sm" onClick={onClose} />
        </Flex>

        <Flex direction="column" gap={6} pt={6} px={4} pb={4} flex={1} overflowY="auto">
          <Link to="/$locale/cart" params={{ locale }} onClick={onClose}>
            <Flex
              align="center"
              gap={2.5}
              color={itemCount > 0 ? "fg" : "fg.subtle"}
              _hover={{ color: "fg" }}
              transition="color 0.15s"
              data-testid="drawer-cart-link"
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
            <Flex direction="column" gap={4}>
              <Flex align="center" gap={2} color="fg.muted">
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
                color="fg.subtle"
                _hover={{ color: "fg" }}
                transition="color 0.15s"
                cursor="pointer"
                aria-label={t("nav.signOut")}
                data-testid="drawer-sign-out"
              >
                <LogOut size={16} strokeWidth={1.5} />
                <Text fontSize="sm" fontWeight="600">
                  {t("nav.signOut")}
                </Text>
              </Box>
            </Flex>
          ) : isLoaded ? (
            <Flex direction="column" gap={4} data-testid="drawer-guest-links">
              <Link to="/$locale/sign-in" params={{ locale }} onClick={onClose}>
                <Flex
                  align="center"
                  gap={1.5}
                  color="fg.muted"
                  _hover={{ color: "fg" }}
                  transition="color 0.15s"
                >
                  <LogIn size={16} strokeWidth={1.5} />
                  <Text fontSize="sm" fontWeight="600">
                    {t("nav.signIn")}
                  </Text>
                </Flex>
              </Link>
              <Link to="/$locale/sign-up" params={{ locale }} onClick={onClose}>
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

          <LocaleSwitcher onChanged={onClose} />
        </Flex>
      </Box>
    </>
  );
}
