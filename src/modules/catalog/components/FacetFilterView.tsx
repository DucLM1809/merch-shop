import { Box, Checkbox, Stack, Text } from '@chakra-ui/react'
import type { Character, Game, Team } from '@/api/types'

export interface FacetFilterViewProps {
  games: Game[]
  teams: Team[]
  characters: Character[]
  selectedGame: string | undefined
  selectedTeam: string | undefined
  selectedCharacter: string | undefined
  onGameChange: (gameId: string | undefined) => void
  onTeamChange: (teamId: string | undefined) => void
  onCharacterChange: (characterId: string | undefined) => void
}

export function FacetFilterView({
  games,
  teams,
  characters,
  selectedGame,
  selectedTeam,
  selectedCharacter,
  onGameChange,
  onTeamChange,
  onCharacterChange,
}: FacetFilterViewProps) {
  return (
    <Box
      w="56"
      flexShrink={0}
      px={4}
      py={6}
      borderRight="1px solid"
      borderColor="gray.800"
      minH="100%"
    >
      <FacetGroup
        label="Game"
        items={games.map((g) => ({ id: g.id, label: g.name }))}
        selected={selectedGame}
        onChange={onGameChange}
      />
      <FacetGroup
        label="Team"
        items={teams.map((t) => ({ id: t.id, label: t.name }))}
        selected={selectedTeam}
        onChange={onTeamChange}
      />
      <FacetGroup
        label="Character"
        items={characters.map((c) => ({ id: c.id, label: c.name }))}
        selected={selectedCharacter}
        onChange={onCharacterChange}
      />
    </Box>
  )
}

interface FacetGroupProps {
  label: string
  items: { id: string; label: string }[]
  selected: string | undefined
  onChange: (id: string | undefined) => void
}

function FacetGroup({ label, items, selected, onChange }: FacetGroupProps) {
  if (!items.length) return null

  return (
    <Box mb={7}>
      <Text
        fontSize="10px"
        fontWeight="800"
        color="gray.600"
        textTransform="uppercase"
        letterSpacing="0.12em"
        mb={3}
      >
        {label}
      </Text>
      <Stack gap={1.5}>
        {items.map((item) => (
          <Checkbox.Root
            key={item.id}
            colorPalette="blue"
            checked={selected === item.id}
            onCheckedChange={() => onChange(selected === item.id ? undefined : item.id)}
          >
            <Checkbox.HiddenInput aria-label={item.label} />
            <Checkbox.Control
              borderColor="gray.700"
              borderRadius="sm"
            />
            <Checkbox.Label>
              <Text
                fontSize="xs"
                color={selected === item.id ? 'white' : 'gray.400'}
                fontWeight={selected === item.id ? '600' : '400'}
                transition="color 0.1s, font-weight 0.1s"
              >
                {item.label}
              </Text>
            </Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Stack>
    </Box>
  )
}
