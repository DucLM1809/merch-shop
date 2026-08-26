import type { JSX, ReactNode } from "react";

import { chakra } from "@chakra-ui/react";
import { Link, type CreateLinkProps } from "@tanstack/react-router";

import { useLocale } from "@/i18n/useLocale";

import {
  PublisherNavView,
  type CatalogGameLinkParams,
  type CatalogGameTo,
  type CatalogPublisherLinkParams,
  type CatalogPublisherTo,
} from "./PublisherNavView";

import { usePublishers } from "../hooks";

const NavLink = chakra(Link);

type Props = {
  activePublisherSlug?: string;
  activeGameSlug?: string;
};

export function PublisherNav({ activePublisherSlug, activeGameSlug }: Props = {}): JSX.Element {
  const { data: publishers, isLoading } = usePublishers();
  const locale = useLocale();

  function renderLink(
    to: CatalogPublisherTo | CatalogGameTo,
    params: CatalogPublisherLinkParams | CatalogGameLinkParams,
    children: ReactNode,
    ariaCurrent?: "page" | undefined
  ): ReactNode {
    const isActive = ariaCurrent === "page";
    const isGame = "gameSlug" in params;

    // The view names the full locale-prefixed route id and supplies the catalog params;
    // the locale itself is chrome-level state, so it's filled in here rather than
    // threaded through the presentational layer.
    // chakra() erases TanStack Router's typed `to`/`params` generics down to its wrapped
    // component's default signature; casting to the router's own link-prop shape (rather
    // than `any`, and narrowed to just these two keys so the cast doesn't also pull in
    // Link's `mask` option, which collides with Chakra's own `mask` style prop below) is
    // required at this boundary.
    const sharedNavProps = { to, params: { locale, ...params } } as Pick<
      CreateLinkProps,
      "to" | "params"
    >;

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
          color={isActive ? "blue.300" : "fg.subtle"}
          bg={isActive ? "blue.950" : "transparent"}
          fontWeight={isActive ? "600" : "400"}
          _hover={{ color: "fg", bg: "bg.muted" }}
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
        color={isActive ? "fg" : "fg.muted"}
        bg={isActive ? "bg.muted" : "transparent"}
        borderLeft={isActive ? "2px solid" : "2px solid transparent"}
        borderColor={isActive ? "blue.500" : "transparent"}
        _hover={{ color: "fg", bg: "bg.muted" }}
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
