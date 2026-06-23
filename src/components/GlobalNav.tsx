import { Box, Flex, Text } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { cartStore } from '../store/cart'

export function GlobalNav() {
  const itemCount = useStore(cartStore, (s) => s.items.reduce((n, i) => n + i.quantity, 0))

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={10}
      bg="gray.950"
      borderBottom="1px solid"
      borderColor="gray.800"
      px={6}
      py={3}
    >
      <Flex align="center" justify="space-between" maxW="7xl" mx="auto">
        <Link to="/">
          <Text color="white" fontWeight="bold" fontSize="lg" letterSpacing="-0.02em">
            Merch Shop
          </Text>
        </Link>

        <Link to="/cart">
          <Flex align="center" gap={2} color={itemCount > 0 ? 'white' : 'gray.400'} _hover={{ color: 'white' }}>
            <Text fontSize="sm">Cart</Text>
            {itemCount > 0 && (
              <Box
                bg="green.500"
                color="white"
                borderRadius="full"
                minW={5}
                h={5}
                px={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xs" fontWeight="bold" lineHeight="1">{itemCount}</Text>
              </Box>
            )}
          </Flex>
        </Link>
      </Flex>
    </Box>
  )
}
