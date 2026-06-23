import { useQuery } from '@tanstack/react-query'
import { chakra } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { client } from '../api/client'
import { PublisherNavView } from './ui/PublisherNavView'
import type { ReactNode } from 'react'

const NavLink = chakra(Link)

interface Props {
  activePublisherSlug?: string
  activeGameSlug?: string
}

export function PublisherNav({ activePublisherSlug, activeGameSlug }: Props = {}) {
  const { data: publishers, isLoading } = useQuery({
    queryKey: ['publishers'],
    queryFn: () => client.getPublishers(),
  })

  function renderLink(
    to: string,
    params: Record<string, string>,
    children: ReactNode,
    ariaCurrent?: 'page' | undefined,
  ): ReactNode {
    const isActive = ariaCurrent === 'page'
    const isGame = 'gameSlug' in params

    if (isGame) {
      return (
        <NavLink
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          to={to as any}
          params={params}
          display="block"
          px={3}
          py={1}
          borderRadius="md"
          fontSize="sm"
          textDecoration="none"
          transition="background 0.15s, color 0.15s"
          color={isActive ? 'blue.300' : 'gray.500'}
          bg={isActive ? 'blue.950' : 'transparent'}
          fontWeight={isActive ? '600' : '400'}
          _hover={{ color: 'gray.200', bg: 'gray.800' }}
          aria-current={ariaCurrent}
        >
          {children}
        </NavLink>
      )
    }

    return (
      <NavLink
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        to={to as any}
        params={params}
        display="block"
        px={3}
        py={1.5}
        borderRadius="md"
        textDecoration="none"
        transition="background 0.15s, color 0.15s"
        color={isActive ? 'white' : 'gray.400'}
        bg={isActive ? 'gray.800' : 'transparent'}
        borderLeft={isActive ? '2px solid' : '2px solid transparent'}
        borderColor={isActive ? 'blue.500' : 'transparent'}
        _hover={{ color: 'white', bg: 'gray.800' }}
        aria-current={ariaCurrent}
      >
        {children}
      </NavLink>
    )
  }

  return (
    <PublisherNavView
      publishers={publishers}
      isLoading={isLoading}
      activePublisherSlug={activePublisherSlug}
      activeGameSlug={activeGameSlug}
      renderLink={renderLink}
    />
  )
}
