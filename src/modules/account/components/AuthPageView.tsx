import { Flex } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function AuthPageView({ children }: Props) {
  return (
    <Flex justify="center" align="center" minH="80vh">
      {children}
    </Flex>
  )
}
