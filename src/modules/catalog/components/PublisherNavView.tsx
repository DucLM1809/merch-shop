import { Box, HStack, Skeleton, VStack } from "@chakra-ui/react";
import type { Publisher } from "@/api/types";
import type { FileRouteTypes } from "@/routeTree.gen";
import type { ReactNode } from "react";

// Route ids sourced from the generated route tree, not hand-maintained: if either id is
// renamed or removed, the Extract below resolves to `never` and every callsite that still
// names the old id fails to compile.
export type CatalogPublisherTo = Extract<FileRouteTypes["to"], "/$locale/$publisherSlug">;
export type CatalogGameTo = Extract<FileRouteTypes["to"], "/$locale/$publisherSlug/$gameSlug">;

export type CatalogPublisherLinkParams = { publisherSlug: string };
export type CatalogGameLinkParams = { publisherSlug: string; gameSlug: string };

export interface CatalogNavLinkRenderer {
  (
    to: CatalogPublisherTo,
    params: CatalogPublisherLinkParams,
    children: ReactNode,
    ariaCurrent?: "page" | undefined
  ): ReactNode;
  (
    to: CatalogGameTo,
    params: CatalogGameLinkParams,
    children: ReactNode,
    ariaCurrent?: "page" | undefined
  ): ReactNode;
}

export interface PublisherNavViewProps {
  publishers: Publisher[] | undefined;
  isLoading: boolean;
  activePublisherSlug?: string;
  activeGameSlug?: string;
  renderLink: CatalogNavLinkRenderer;
}

export function PublisherNavView({
  publishers,
  isLoading,
  activePublisherSlug,
  activeGameSlug,
  renderLink,
}: PublisherNavViewProps) {
  if (isLoading) {
    return (
      <Box w="56" p={4} borderRight="1px solid" borderColor="border" minH="100dvh" flexShrink={0}>
        <VStack gap={3} align="stretch" pt={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} h="5" borderRadius="md" />
          ))}
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      as="nav"
      w="56"
      py={5}
      px={3}
      borderRight="1px solid"
      borderColor="border"
      minH="100dvh"
      flexShrink={0}
    >
      <VStack gap={1} align="stretch">
        {publishers?.map((publisher) => {
          const isActivePublisher = activePublisherSlug === publisher.slug;
          const publisherLinkChildren = (
            <HStack gap={2.5} align="center">
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                flexShrink={0}
                transition="opacity 0.15s, box-shadow 0.15s"
                style={{
                  background: publisher.accentColor,
                  opacity: isActivePublisher ? 1 : 0.4,
                  boxShadow: isActivePublisher ? `0 0 8px ${publisher.accentColor}` : "none",
                }}
              />
              <Box
                fontSize="sm"
                fontWeight={isActivePublisher ? "700" : "500"}
                letterSpacing={isActivePublisher ? "-0.01em" : "normal"}
              >
                {publisher.name}
              </Box>
            </HStack>
          );

          return (
            <Box key={publisher.id} mb={0.5}>
              {renderLink(
                "/$locale/$publisherSlug",
                { publisherSlug: publisher.slug },
                publisherLinkChildren,
                isActivePublisher ? "page" : undefined
              )}
              {publisher.games.length > 0 && (
                <VStack gap={0} align="stretch" pl={4} pt={0.5}>
                  {publisher.games.map((game) => {
                    const isActiveGame = isActivePublisher && activeGameSlug === game.slug;
                    return (
                      <Box key={game.id}>
                        {renderLink(
                          "/$locale/$publisherSlug/$gameSlug",
                          { publisherSlug: publisher.slug, gameSlug: game.slug },
                          game.name,
                          isActiveGame ? "page" : undefined
                        )}
                      </Box>
                    );
                  })}
                </VStack>
              )}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
