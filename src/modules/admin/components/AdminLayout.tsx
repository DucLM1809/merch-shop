import type { ReactNode } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { Gamepad2, List, Package, ShoppingBag, Tags, TrendingUp, Users } from "lucide-react";

type NavItem = { label: string; to: string; icon: React.ElementType; live: boolean };

const NAV_ITEMS: NavItem[] = [
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag, live: true },
  { label: "Publishers", to: "/admin/publishers", icon: TrendingUp, live: true },
  { label: "Games", to: "/admin/games", icon: Gamepad2, live: true },
  { label: "Teams", to: "/admin/teams", icon: Users, live: true },
  { label: "Characters", to: "/admin/characters", icon: List, live: false },
  { label: "Products", to: "/admin/products", icon: Package, live: false },
  { label: "SKUs", to: "/admin/skus", icon: Tags, live: false },
];

type Props = { children: ReactNode };

export function AdminLayout({ children }: Props): React.JSX.Element {
  return (
    <Flex h="calc(100dvh - 57px)" overflow="hidden">
      <Box
        as="nav"
        w="220px"
        bg="gray.900"
        borderRight="1px solid"
        borderColor="gray.800"
        flexShrink={0}
        py={6}
      >
        <Text
          px={5}
          mb={4}
          fontSize="xs"
          fontWeight="800"
          letterSpacing="0.12em"
          textTransform="uppercase"
          color="gray.500"
        >
          Admin
        </Text>
        <VStack gap={0} align="stretch">
          {NAV_ITEMS.map(({ label, to, icon: Icon, live }) =>
            live ? (
              <Link key={label} to={to}>
                {({ isActive }) => (
                  <Flex
                    align="center"
                    gap={3}
                    px={5}
                    py={2.5}
                    bg={isActive ? "blue.950" : "transparent"}
                    color={isActive ? "blue.300" : "gray.500"}
                    _hover={{ bg: "gray.800", color: "white" }}
                    transition="all 0.1s"
                    borderLeft="2px solid"
                    borderColor={isActive ? "blue.400" : "transparent"}
                  >
                    <Icon size={15} strokeWidth={1.75} />
                    <Text fontSize="sm" fontWeight={isActive ? "600" : "500"}>
                      {label}
                    </Text>
                  </Flex>
                )}
              </Link>
            ) : (
              <Flex
                key={label}
                align="center"
                gap={3}
                px={5}
                py={2.5}
                color="gray.700"
                cursor="not-allowed"
                borderLeft="2px solid"
                borderColor="transparent"
                title="Coming soon"
              >
                <Icon size={15} strokeWidth={1.75} />
                <Text fontSize="sm" fontWeight="500">
                  {label}
                </Text>
              </Flex>
            )
          )}
        </VStack>
      </Box>

      <Box as="main" flex={1} overflow="auto">
        {children}
      </Box>
    </Flex>
  );
}
