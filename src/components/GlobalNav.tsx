import { Box, Flex, Text } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { useAuth, useUser, useClerk } from '@clerk/react'
import { cartStore } from '../store/cart'
import { Gamepad2, ShoppingCart, User, LogOut, LogIn, UserPlus } from 'lucide-react'

export function GlobalNav() {
  const itemCount = useStore(cartStore, (s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={10}
      borderBottom="1px solid"
      borderColor="gray.800"
      px={6}
      py={3.5}
      style={{ backgroundColor: 'rgba(6, 6, 10, 0.95)', backdropFilter: 'blur(12px)' }}
    >
      <Flex align="center" justify="space-between" maxW="7xl" mx="auto">
        <Link to="/">
          <Flex
            align="center"
            gap={2.5}
            transition="opacity 0.15s"
            _hover={{ opacity: 0.75 }}
          >
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

        <Flex align="center" gap={4}>
          <Link to="/cart">
            <Flex
              align="center"
              gap={2.5}
              color={itemCount > 0 ? 'white' : 'gray.500'}
              _hover={{ color: 'white' }}
              transition="color 0.15s"
            >
              <Box position="relative" display="flex" alignItems="center">
                <ShoppingCart size={20} strokeWidth={1.5} />
                {itemCount > 0 && (
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
                )}
              </Box>
              <Text fontSize="sm" fontWeight="600">
                Cart
              </Text>
            </Flex>
          </Link>

          {isLoaded && isSignedIn ? (
            <Flex align="center" gap={3}>
              <Flex
                align="center"
                gap={2}
                color="gray.300"
                data-testid="nav-account-menu"
              >
                <User size={16} strokeWidth={1.5} />
                <Text fontSize="sm" fontWeight="600">
                  {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}
                </Text>
              </Flex>
              <Box
                as="button"
                onClick={() => signOut()}
                display="flex"
                alignItems="center"
                gap={1.5}
                color="gray.500"
                _hover={{ color: 'white' }}
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
                  _hover={{ color: 'white' }}
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
                  _hover={{ color: 'blue.300' }}
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
      </Flex>
    </Box>
  )
}
