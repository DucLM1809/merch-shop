import { useEffect, useRef, useState, type JSX, type ReactNode, type RefObject } from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Link as ChakraLink,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { ArrowRight, CreditCard, ImageOff, ShieldCheck, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useLocale } from "@/i18n/useLocale";
import { useFormatPrice } from "@/i18n/useFormatPrice";
import { ProductCard, useProducts, usePublishers } from "@/modules/catalog";

import type { Game, Product } from "@/api/types";

export const Route = createLazyFileRoute("/$locale/")({
  component: HomePage,
});

const GAME_TILE_SEED: Record<string, string> = {
  "league-of-legends": "merch-league-of-legends",
  valorant: "merch-valorant",
  cs2: "merch-cs2",
};

const GAME_ORDER = ["league-of-legends", "valorant", "cs2"];

type FeaturedGame = Game & { publisherName: string; accentColor: string | undefined };

/** Fades a section up into place the first time it enters the viewport. Fires once, then
 * disconnects — this never turns into a per-frame scroll listener. Reduced-motion viewers
 * get the final state immediately via the CSS override below. */
function useInView<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (older browsers, jsdom in tests) — show the content
    // immediately rather than leaving it invisible forever.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

const REDUCED_MOTION_OVERRIDE = {
  "@media (prefers-reduced-motion: reduce)": {
    opacity: 1,
    transform: "none",
    transition: "none",
  },
};

function Reveal({ children }: { children: ReactNode }): JSX.Element {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <Box
      ref={ref}
      opacity={inView ? 1 : 0}
      transform={inView ? "translateY(0)" : "translateY(20px)"}
      transition="opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
      css={REDUCED_MOTION_OVERRIDE}
    >
      {children}
    </Box>
  );
}

function HomePage(): JSX.Element {
  const locale = useLocale();
  const formatPrice = useFormatPrice();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: publishers, isLoading: publishersLoading } = usePublishers();

  const heroProduct =
    products?.find((p) => p.id === "1" && p.imageUrl) ??
    products?.find((p) => p.imageUrl) ??
    products?.[0];

  const allGames = (publishers ?? []).flatMap((p) =>
    p.games.map((g) => ({ ...g, publisherName: p.name, accentColor: p.accentColor }))
  );
  // Prefer the flagship titles in a fixed order, but fall back to whatever the catalog
  // actually has (fewer titles, or different ones) rather than pinning the rail to games
  // that were never going to arrive.
  const preferredGames = GAME_ORDER.map((slug) => allGames.find((g) => g.slug === slug)).filter(
    (g): g is FeaturedGame => Boolean(g)
  );
  const remainingGames = allGames.filter((g) => !preferredGames.some((p) => p.id === g.id));
  const orderedGames = [...preferredGames, ...remainingGames];

  return (
    <Box minH="100dvh">
      <HeroSection
        product={heroProduct}
        isLoading={productsLoading}
        locale={locale}
        price={heroProduct ? formatPrice(heroProduct.price) : undefined}
      />

      <Reveal>
        <GameRailSection games={orderedGames} isLoading={publishersLoading} locale={locale} />
      </Reveal>

      <Reveal>
        <TrustBar />
      </Reveal>

      <Reveal>
        <CatalogSection
          products={products ?? []}
          games={orderedGames}
          isLoading={productsLoading || publishersLoading}
          locale={locale}
        />
      </Reveal>

      <Reveal>
        <ManifestoBand />
      </Reveal>
    </Box>
  );
}

type HeroSectionProps = {
  product: Product | undefined;
  isLoading: boolean;
  locale: string;
  price: string | undefined;
};

function HeroSection({ product, isLoading, locale, price }: HeroSectionProps): JSX.Element {
  const { t } = useTranslation("catalog");

  return (
    <Box as="section" px={{ base: 4, md: 8 }} pt={{ base: 8, md: 14 }} pb={{ base: 10, md: 16 }}>
      <Grid
        maxW="7xl"
        mx="auto"
        templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}
        gap={{ base: 10, lg: 16 }}
        alignItems="center"
      >
        <Box>
          <Heading
            as="h1"
            textStyle="display"
            color="fg"
            maxW="16ch"
            fontSize={{ base: "2.75rem", md: "3.5rem" }}
          >
            {t("home.hero.headline")}
          </Heading>
          <Text textStyle="body" color="fg.muted" mt={5} maxW="46ch" fontSize={{ md: "lg" }}>
            {t("home.hero.subtitle")}
          </Text>
          <Flex gap={4} mt={8} wrap="wrap">
            <Button asChild size="lg" colorPalette="blue" variant="solid">
              <Link to="/$locale/shop" params={{ locale }}>
                {t("home.hero.primaryCta")}
              </Link>
            </Button>
            <Button asChild size="lg" colorPalette="blue" variant="outline">
              <ChakraLink href="#shop-by-game">{t("home.hero.secondaryCta")}</ChakraLink>
            </Button>
          </Flex>
        </Box>

        <Box>
          {isLoading || !product ? (
            <Skeleton h={{ base: "280px", md: "420px" }} borderRadius="lg" />
          ) : (
            <>
              <Card clipCorner overflow="hidden">
                {product.imageUrl ? (
                  <OptimizedImage
                    src={product.imageUrl}
                    alt={product.name}
                    width={800}
                    eager
                    fallbackLabel={t("product.noImage")}
                    h={{ base: "280px", md: "420px" }}
                    w="full"
                    objectFit="cover"
                  />
                ) : (
                  <Flex
                    h={{ base: "280px", md: "420px" }}
                    align="center"
                    justify="center"
                    bg="bg.muted"
                  >
                    <EmptyState
                      title={t("product.noImage")}
                      icon={<ImageOff size={22} strokeWidth={1.5} />}
                    />
                  </Flex>
                )}
              </Card>
              <Flex justify="space-between" align="flex-end" mt={3} gap={3}>
                <Box>
                  <Text fontWeight="700" color="fg">
                    {product.name}
                  </Text>
                  <Text color="fg.muted" fontSize="sm" mt={0.5}>
                    {price}
                  </Text>
                </Box>
                <Link
                  to="/$locale/$publisherSlug/$gameSlug/products/$productSlug"
                  params={{
                    locale,
                    publisherSlug: product.publisherSlug,
                    gameSlug: product.gameSlug,
                    productSlug: product.slug,
                  }}
                >
                  <Flex
                    align="center"
                    gap={1.5}
                    color="blue.400"
                    _hover={{ color: "blue.300" }}
                    transition="color 0.15s"
                    fontWeight="600"
                    fontSize="sm"
                    whiteSpace="nowrap"
                  >
                    {t("home.hero.spotlightCta")}
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </Flex>
                </Link>
              </Flex>
            </>
          )}
        </Box>
      </Grid>
    </Box>
  );
}

// The reference's signature move: franchise entries as skewed parallelograms rather than
// upright cards. The angle is the whole identity of the rail, so it is one constant, and
// every child that carries content re-applies the inverse so type and photography stay
// upright inside the slanted frame.
const CHIP_SKEW = "skewX(-11deg)";
const CHIP_UNSKEW = "skewX(11deg)";
const CHIP_SCRIM =
  "linear-gradient(to top, rgba(10, 11, 16, 0.92) 12%, rgba(10, 11, 16, 0.55) 65%, rgba(10, 11, 16, 0.35) 100%)";

type GameRailSectionProps = {
  games: FeaturedGame[];
  isLoading: boolean;
  locale: string;
};

function GameRailSection({ games, isLoading, locale }: GameRailSectionProps): JSX.Element | null {
  const { t } = useTranslation("catalog");

  if (!isLoading && games.length === 0) return null;

  return (
    <Box as="section" id="shop-by-game" scrollMarginTop="80px" py={{ base: 8, md: 12 }}>
      <Box maxW="7xl" mx="auto" px={{ base: 4, md: 8 }}>
        <Heading as="h2" textStyle="h1" color="fg" mb={{ base: 5, md: 6 }}>
          {t("home.games.title")}
        </Heading>
      </Box>

      {/* Scrolls horizontally rather than wrapping: a rail that reflows into a second row
          loses the single continuous band that makes the shape read. The skew pushes each
          chip past its own box, so the track carries extra inline padding to keep the first
          and last from being clipped. */}
      <Flex
        gap={3}
        overflowX="auto"
        px={{ base: 6, md: 10 }}
        py={2}
        maxW="7xl"
        mx="auto"
        css={{
          scrollSnapType: "x proximity",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                flex="none"
                w={{ base: "180px", md: "216px" }}
                h={{ base: "76px", md: "88px" }}
                transform={CHIP_SKEW}
              />
            ))
          : games.map((game) => <GameChip key={game.id} game={game} locale={locale} />)}
      </Flex>
    </Box>
  );
}

function GameChip({ game, locale }: { game: FeaturedGame; locale: string }): JSX.Element {
  return (
    <Link to="/$locale/shop" params={{ locale }} search={{ game: game.id }}>
      <Box
        position="relative"
        flex="none"
        overflow="hidden"
        w={{ base: "180px", md: "216px" }}
        h={{ base: "76px", md: "88px" }}
        transform={CHIP_SKEW}
        borderWidth="1px"
        borderColor="border.emphasized"
        // Inked rather than `bg.muted`: the label is fixed white over the scrim, and under
        // light mode a muted-gray base would leave white-on-light-gray whenever the photo
        // fails to load (a dead URL, or `/_vercel/image` outside Vercel's runtime).
        bg="gray.950"
        transition="transform 0.18s ease, border-color 0.18s ease"
        _hover={{ borderColor: "blue.400", transform: `${CHIP_SKEW} translateY(-3px)` }}
        css={{ scrollSnapAlign: "start" }}
      >
        {/* Decorative texture behind the name, not a subject in its own right, so it is
            hidden from the accessibility tree and the link is named by its label alone.
            Inset past the edges because un-skewing inside a skewed frame would otherwise
            leave the two acute corners uncovered. */}
        <Box position="absolute" inset="-14% -20%" transform={CHIP_UNSKEW} aria-hidden>
          <OptimizedImage
            src={`https://picsum.photos/seed/${GAME_TILE_SEED[game.slug] ?? game.slug}/480/280`}
            alt=""
            width={480}
            h="full"
            w="full"
            objectFit="cover"
          />
        </Box>

        <Box position="absolute" inset={0} bgImage={CHIP_SCRIM} aria-hidden />

        {game.accentColor && (
          <Box
            position="absolute"
            insetInlineStart={0}
            top={0}
            bottom={0}
            w="4px"
            // Publisher accent is API-supplied runtime data, not a design token — the one
            // exception ADR 0008 allows, same as the catalog card's accent dot.
            style={{ background: game.accentColor }}
            aria-hidden
          />
        )}

        <Flex position="relative" h="full" align="flex-end" px={5} pb={3} transform={CHIP_UNSKEW}>
          <Text
            fontFamily="heading"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.06em"
            lineHeight="1.15"
            fontSize={{ base: "sm", md: "md" }}
            color="white"
          >
            {game.name}
          </Text>
        </Flex>
      </Box>
    </Link>
  );
}

function TrustBar(): JSX.Element {
  const { t } = useTranslation("catalog");

  const items = [
    { icon: ShieldCheck, title: t("home.value.licensedTitle") },
    { icon: Truck, title: t("home.value.shippingTitle") },
    { icon: CreditCard, title: t("home.value.checkoutTitle") },
  ];

  return (
    <Box
      as="section"
      bg="bg.subtle"
      borderYWidth="1px"
      borderColor="border.muted"
      px={{ base: 4, md: 8 }}
      py={{ base: 4, md: 3.5 }}
    >
      <Flex
        maxW="7xl"
        mx="auto"
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        // Grouped, not spread: pushed to the corners of a 7xl container the three claims
        // stop reading as one bar and start reading as three unrelated labels.
        justify={{ base: "flex-start", md: "center" }}
        gap={{ base: 3, md: 12 }}
      >
        {items.map(({ icon: Icon, title }) => (
          <Flex key={title} align="center" gap={2.5}>
            <Box color="blue.400" display="flex" alignItems="center">
              <Icon size={18} strokeWidth={1.75} />
            </Box>
            <Text fontSize="sm" fontWeight="600" color="fg">
              {title}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}

/** Two full rows at the widest grid. */
const MAX_PRODUCTS_PER_GAME = 6;

type CatalogSectionProps = {
  products: Product[];
  games: FeaturedGame[];
  isLoading: boolean;
  locale: string;
};

function CatalogSection({ products, games, isLoading, locale }: CatalogSectionProps): JSX.Element {
  const { t } = useTranslation("catalog");

  // Group in the rail's order so the two sections agree, and drop titles that have nothing
  // in stock rather than printing an empty heading over an empty grid. Each group is capped
  // at two full rows: the landing page is a way into the catalog, not the catalog itself,
  // and against a real backend an uncapped grid would put hundreds of cards above the fold
  // of every visit. The rail chip directly above each title is the route to the rest.
  const groups = games
    .map((game) => ({
      game,
      items: products.filter((p) => p.gameId === game.id).slice(0, MAX_PRODUCTS_PER_GAME),
    }))
    .filter((group) => group.items.length > 0);

  const renderProductLink = (product: Product, children: ReactNode): ReactNode => (
    <Link
      to="/$locale/$publisherSlug/$gameSlug/products/$productSlug"
      params={{
        locale,
        publisherSlug: product.publisherSlug,
        gameSlug: product.gameSlug,
        productSlug: product.slug,
      }}
    >
      {children}
    </Link>
  );

  return (
    <Box as="section" px={{ base: 4, md: 8 }} py={{ base: 12, md: 16 }}>
      <Box maxW="7xl" mx="auto">
        <Heading as="h2" textStyle="h1" color="fg">
          {t("home.catalog.title")}
        </Heading>
        <Text color="fg.muted" fontSize="sm" mt={2} maxW="60ch">
          {t("home.catalog.subtitle")}
        </Text>

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={5} mt={{ base: 8, md: 10 }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} h="72" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : (
          <Box data-testid="catalog-grid">
            {groups.map(({ game, items }) => (
              <Box key={game.id} mt={{ base: 8, md: 10 }}>
                <Flex align="center" gap={4} mb={5}>
                  <Heading
                    as="h3"
                    fontFamily="heading"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    fontSize="sm"
                    color="fg.muted"
                    flexShrink={0}
                  >
                    {game.name}
                  </Heading>
                  <Box flex="1" h="1px" bg="border.muted" />
                </Flex>

                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={5}>
                  {items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      renderLink={renderProductLink}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// The closing statement sits on the photograph rather than beside it. The hero already
// spends its width on a text/image split, and repeating that shape here would make the
// page's first and last sections read as the same block twice.
const MANIFESTO_SCRIM =
  "linear-gradient(to right, rgba(10, 11, 16, 0.94) 0%, rgba(10, 11, 16, 0.82) 45%, rgba(10, 11, 16, 0.45) 100%)";

function ManifestoBand(): JSX.Element {
  const { t } = useTranslation("catalog");

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      minH={{ base: "340px", md: "420px" }}
      // Same reasoning as the rail chips: the statement is fixed white, so the band needs an
      // ink floor of its own for the case where the photograph never arrives.
      bg="gray.950"
    >
      <Box position="absolute" inset={0} aria-hidden>
        <OptimizedImage
          src="https://picsum.photos/seed/merch-shop-stitch/1600/720"
          alt=""
          width={1600}
          h="full"
          w="full"
          objectFit="cover"
        />
      </Box>
      <Box position="absolute" inset={0} bgImage={MANIFESTO_SCRIM} aria-hidden />

      <Flex
        position="relative"
        maxW="7xl"
        mx="auto"
        minH={{ base: "340px", md: "420px" }}
        align="center"
        px={{ base: 6, md: 8 }}
        py={{ base: 12, md: 16 }}
      >
        <Heading
          as="h2"
          textStyle="display"
          fontSize={{ base: "1.75rem", md: "2.75rem" }}
          color="white"
          maxW="22ch"
        >
          {t("home.manifesto.body")}
        </Heading>
      </Flex>
    </Box>
  );
}
