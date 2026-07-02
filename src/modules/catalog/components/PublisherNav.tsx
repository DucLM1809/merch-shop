import type { JSX, ReactNode } from "react";

import { chakra } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

import { PublisherNavView } from "./PublisherNavView";

import { usePublishers } from "../hooks";

const NavLink = chakra(Link);

type Props = {
  activePublisherSlug?: string;
  activeGameSlug?: string;
};

export function PublisherNav({ activePublisherSlug, activeGameSlug }: Props = {}): JSX.Element {
  const { data: publishers, isLoading } = usePublishers();

  function renderLink(
    to: string,
    params: Record<string, string>,
    children: ReactNode,
    ariaCurrent?: "page" | undefined
  ): ReactNode {
    const isActive = ariaCurrent === "page";
    const isGame = "gameSlug" in params;

    // chakra() erases TanStack Router's typed `to`/`params` generics; casts required
    const sharedNavProps = { to: to as any, params: params as any };

    if (isGame) {
      return (
        <NavLink
          {...sharedNavProps}
          display="block"
          px={3}
          py={1}
          borderRadius="md"
          fontSize="sm"
          textDecoration="none"
          transition="background 0.15s, color 0.15s"
          color={isActive ? "blue.300" : "gray.500"}
          bg={isActive ? "blue.950" : "transparent"}
          fontWeight={isActive ? "600" : "400"}
          _hover={{ color: "gray.200", bg: "gray.800" }}
          aria-current={ariaCurrent}
        >
          {children}
        </NavLink>
      );
    }

    return (
      <NavLink
        {...sharedNavProps}
        display="block"
        px={3}
        py={1.5}
        borderRadius="md"
        textDecoration="none"
        transition="background 0.15s, color 0.15s"
        color={isActive ? "white" : "gray.400"}
        bg={isActive ? "gray.800" : "transparent"}
        borderLeft={isActive ? "2px solid" : "2px solid transparent"}
        borderColor={isActive ? "blue.500" : "transparent"}
        _hover={{ color: "white", bg: "gray.800" }}
        aria-current={ariaCurrent}
      >
        {children}
      </NavLink>
    );
  }

  return (
    <PublisherNavView
      publishers={publishers}
      isLoading={isLoading}
      activePublisherSlug={activePublisherSlug}
      activeGameSlug={activeGameSlug}
      renderLink={renderLink}
    />
  );
}
