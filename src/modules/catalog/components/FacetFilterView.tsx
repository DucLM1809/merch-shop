import { useEffect, useRef, useState, type JSX, type ReactNode } from "react";
import { Box, Checkbox, CloseButton, Flex, Portal, Stack, Text } from "@chakra-ui/react";
import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Character, Game, Team } from "@/api/types";

export interface FacetFilterViewProps {
  games: Game[];
  teams: Team[];
  characters: Character[];
  selectedGame: string | undefined;
  selectedTeam: string | undefined;
  selectedCharacter: string | undefined;
  onGameChange: (gameId: string | undefined) => void;
  onTeamChange: (teamId: string | undefined) => void;
  onCharacterChange: (characterId: string | undefined) => void;
}

export function FacetFilterView(props: FacetFilterViewProps): JSX.Element {
  const { games, teams, characters } = props;
  const { t } = useTranslation("catalog");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hasFacets = games.length > 0 || teams.length > 0 || characters.length > 0;

  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

  return (
    <>
      {hasFacets && (
        <Flex
          as="button"
          onClick={handleOpenDrawer}
          hideFrom="md"
          align="center"
          gap={2}
          w="full"
          px={4}
          py={3}
          borderBottomWidth="1px"
          borderColor="border.muted"
          color="fg.muted"
          _hover={{ color: "fg" }}
          transition="color 0.15s"
          cursor="pointer"
          data-testid="facet-filter-trigger"
        >
          <SlidersHorizontal size={16} strokeWidth={1.75} />
          <Text fontSize="sm" fontWeight="600">
            {t("filters.title")}
          </Text>
        </Flex>
      )}

      <Box
        hideBelow="md"
        w="56"
        flexShrink={0}
        px={4}
        py={6}
        borderRight="1px solid"
        borderColor="border.muted"
        minH="100%"
      >
        <FacetGroups {...props} />
      </Box>

      {drawerOpen && (
        <Portal>
          <FacetDrawer onClose={handleCloseDrawer}>
            <FacetGroups {...props} />
          </FacetDrawer>
        </Portal>
      )}
    </>
  );
}

function FacetGroups({
  games,
  teams,
  characters,
  selectedGame,
  selectedTeam,
  selectedCharacter,
  onGameChange,
  onTeamChange,
  onCharacterChange,
}: FacetFilterViewProps): JSX.Element {
  const { t } = useTranslation("catalog");

  return (
    <>
      <FacetGroup
        label={t("filters.game")}
        items={games.map((game) => ({ id: game.id, label: game.name }))}
        selected={selectedGame}
        onChange={onGameChange}
      />
      <FacetGroup
        label={t("filters.team")}
        items={teams.map((team) => ({ id: team.id, label: team.name }))}
        selected={selectedTeam}
        onChange={onTeamChange}
      />
      <FacetGroup
        label={t("filters.character")}
        items={characters.map((character) => ({ id: character.id, label: character.name }))}
        selected={selectedCharacter}
        onChange={onCharacterChange}
      />
    </>
  );
}

interface FacetGroupProps {
  label: string;
  items: { id: string; label: string }[];
  selected: string | undefined;
  onChange: (id: string | undefined) => void;
}

function FacetGroup({ label, items, selected, onChange }: FacetGroupProps) {
  if (!items.length) return null;

  return (
    <Box mb={7}>
      <Text
        fontSize="10px"
        fontWeight="800"
        color="fg.subtle"
        textTransform="uppercase"
        letterSpacing="0.12em"
        mb={3}
      >
        {label}
      </Text>
      <Stack gap={1.5}>
        {items.map((item) => {
          const isSelected = selected === item.id;
          const handleCheckedChange = () => onChange(isSelected ? undefined : item.id);

          return (
            <Checkbox.Root
              key={item.id}
              colorPalette="blue"
              checked={isSelected}
              onCheckedChange={handleCheckedChange}
            >
              <Checkbox.HiddenInput aria-label={item.label} />
              <Checkbox.Control borderColor="border.emphasized" borderRadius="sm" />
              <Checkbox.Label>
                <Text
                  fontSize="xs"
                  color={isSelected ? "fg" : "fg.muted"}
                  fontWeight={isSelected ? "600" : "400"}
                  transition="color 0.1s, font-weight 0.1s"
                >
                  {item.label}
                </Text>
              </Checkbox.Label>
            </Checkbox.Root>
          );
        })}
      </Stack>
    </Box>
  );
}

type FacetDrawerProps = {
  onClose: () => void;
  children: ReactNode;
};

function FacetDrawer({ onClose, children }: FacetDrawerProps): JSX.Element {
  const { t } = useTranslation("catalog");
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

  return (
    <>
      <Box
        position="fixed"
        inset={0}
        bg="blackAlpha.600"
        zIndex="overlay"
        onClick={onClose}
        data-testid="facet-drawer-overlay"
      />
      <Box
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("filters.title")}
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
          <Text textStyle="h3" color="fg">
            {t("filters.title")}
          </Text>
          <CloseButton size="sm" onClick={onClose} />
        </Flex>
        <Box flex={1} overflowY="auto" px={4} py={6}>
          {children}
        </Box>
      </Box>
    </>
  );
}
