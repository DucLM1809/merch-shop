import { Box, Flex, Text } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { cartStore } from '../store/cart'
import { Gamepad2, ShoppingCart } from 'lucide-react'

export function GlobalNav() {
  const itemCount = useStore(cartStore, (s) => s.items.reduce((n, i) => n + i.quantity, 0))

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
      </Flex>
    </Box>
  )
}
