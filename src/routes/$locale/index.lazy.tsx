import { useEffect, useRef, useState, type JSX, type ReactNode, type RefObject } from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link as ChakraLink,
  LinkOverlay,
  Skeleton,
  Text,
  type BoxProps,
} from "@chakra-ui/react";
import { ArrowRight, CreditCard, ImageOff, ShieldCheck, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useLocale } from "@/i18n/useLocale";
import { useFormatPrice } from "@/i18n/useFormatPrice";
import { useProducts, usePublishers } from "@/modules/catalog";

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

type FeaturedGame = Game & { publisherName: string };

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
    p.games.map((g) => ({ ...g, publisherName: p.name }))
  );
  // Prefer the three flagship titles in a fixed order, but fall back to whatever the
  // catalog actually has (fewer titles, or different ones) rather than getting stuck
  // showing skeletons for a game that was never going to arrive.
  const preferredGames = GAME_ORDER.map((slug) => allGames.find((g) => g.slug === slug)).filter(
    (g): g is FeaturedGame => Boolean(g)
  );
  const remainingGames = allGames.filter((g) => !preferredGames.some((p) => p.id === g.id));
  const featuredGames = [...preferredGames, ...remainingGames].slice(0, 3);

  return (
    <Box minH="100dvh">
      <HeroSection
        product={heroProduct}
        isLoading={productsLoading}
        locale={locale}
        price={heroProduct ? formatPrice(heroProduct.price) : undefined}
      />

      <Reveal>
        <ShopByGameSection games={featuredGames} isLoading={publishersLoading} locale={locale} />
      </Reveal>

      <Reveal>
        <ValueStrip />
      </Reveal>

      <Reveal>
        <FeaturedDropsSection
          products={products ?? []}
          isLoading={productsLoading}
          locale={locale}
          formatPrice={formatPrice}
        />
      </Reveal>

      <Reveal>
        <ManifestoSection />
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
    <Box as="section" px={{ base: 4, md: 8 }} pt={{ base: 8, md: 14 }} pb={{ base: 12, md: 20 }}>
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

type ShopByGameSectionProps = {
  games: FeaturedGame[];
  isLoading: boolean;
  locale: string;
};

// Bento layout per count — 3 titles get a wide flagship tile plus two stacked
// runners-up, 2 get an even split, 1 gets a single wide tile. Whatever the catalog
// actually has, every cell present gets filled; there's never an empty placeholder.
const BENTO_GRID_PROPS: Record<number, { templateColumns: object; templateRows?: object }> = {
  1: { templateColumns: { base: "1fr" } },
  2: { templateColumns: { base: "1fr", md: "1fr 1fr" } },
  3: { templateColumns: { base: "1fr", md: "2fr 1fr" }, templateRows: { md: "1fr 1fr" } },
};

function tileImageHeight(count: number, index: number): BoxProps["h"] {
  if (count === 3) return index === 0 ? { base: "220px", md: "404px" } : "192px";
  if (count === 2) return { base: "220px", md: "320px" };
  return { base: "260px", md: "420px" };
}

function ShopByGameSection({
  games,
  isLoading,
  locale,
}: ShopByGameSectionProps): JSX.Element | null {
  const { t } = useTranslation("catalog");

  if (!isLoading && games.length === 0) return null;

  const count = isLoading ? 3 : games.length;
  const gridProps = BENTO_GRID_PROPS[count] ?? BENTO_GRID_PROPS[3];

  return (
    <Box
      as="section"
      id="shop-by-game"
      scrollMarginTop="80px"
      px={{ base: 4, md: 8 }}
      py={{ base: 10, md: 16 }}
    >
      <Box maxW="7xl" mx="auto">
        <Heading as="h2" textStyle="h1" color="fg" mb={{ base: 6, md: 8 }}>
          {t("home.games.title")}
        </Heading>

        <Grid {...gridProps} gap={5}>
          {isLoading
            ? Array.from({ length: count }).map((_, index) => (
                <GridItem key={index} rowSpan={{ base: 1, md: count === 3 && index === 0 ? 2 : 1 }}>
                  <Skeleton h={tileImageHeight(count, index)} borderRadius="lg" />
                </GridItem>
              ))
            : games.map((game, index) => (
                <GridItem
                  key={game.id}
                  rowSpan={{ base: 1, md: count === 3 && index === 0 ? 2 : 1 }}
                >
                  <GameTile
                    game={game}
                    imageHeight={tileImageHeight(count, index)}
                    locale={locale}
                  />
                </GridItem>
              ))}
        </Grid>
      </Box>
    </Box>
  );
}

function GameTile({
  game,
  imageHeight,
  locale,
}: {
  game: FeaturedGame;
  imageHeight: BoxProps["h"];
  locale: string;
}): JSX.Element {
  const { t } = useTranslation("catalog");

  return (
    <Card interactive clipCorner overflow="hidden" h="full" display="flex" flexDirection="column">
      <Box h={imageHeight} bg="bg.muted" overflow="hidden">
        <OptimizedImage
          src={`https://picsum.photos/seed/${GAME_TILE_SEED[game.slug] ?? game.slug}/720/480`}
          alt={t("home.games.imageAlt", { game: game.name })}
          width={720}
          fallbackLabel={t("product.noImage")}
          h="full"
          w="full"
          objectFit="cover"
        />
      </Box>
      <Box p={4} flex="1">
        <LinkOverlay asChild>
          <Link to="/$locale/shop" params={{ locale }} search={{ game: game.id }}>
            <Heading as="h3" textStyle="h3" color="fg">
              {game.name}
            </Heading>
          </Link>
        </LinkOverlay>
        <Text color="fg.muted" fontSize="sm" mt={0.5}>
          {game.publisherName}
        </Text>
      </Box>
    </Card>
  );
}

function ValueStrip(): JSX.Element {
  const { t } = useTranslation("catalog");

  const items = [
    { icon: ShieldCheck, title: t("home.value.licensedTitle"), body: t("home.value.licensedBody") },
    { icon: Truck, title: t("home.value.shippingTitle"), body: t("home.value.shippingBody") },
    { icon: CreditCard, title: t("home.value.checkoutTitle"), body: t("home.value.checkoutBody") },
  ];

  return (
    <Box as="section" px={{ base: 4, md: 8 }} py={{ base: 10, md: 14 }} bg="bg.subtle">
      <Grid
        maxW="7xl"
        mx="auto"
        templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }}
        gap={{ base: 8, sm: 10 }}
      >
        {items.map(({ icon: Icon, title, body }) => (
          <Flex key={title} direction="column" gap={2}>
            <Box color="blue.400">
              <Icon size={22} strokeWidth={1.5} />
            </Box>
            <Heading as="h3" textStyle="h3" color="fg">
              {title}
            </Heading>
            <Text color="fg.muted" fontSize="sm" lineHeight="1.6">
              {body}
            </Text>
          </Flex>
        ))}
      </Grid>
    </Box>
  );
}

type FeaturedDropsSectionProps = {
  products: Product[];
  isLoading: boolean;
  locale: string;
  formatPrice: (amount: number) => string;
};

function FeaturedDropsSection({
  products,
  isLoading,
  locale,
  formatPrice,
}: FeaturedDropsSectionProps): JSX.Element {
  const { t } = useTranslation("catalog");

  return (
    <Box as="section" py={{ base: 10, md: 16 }}>
      <Box maxW="7xl" mx="auto" px={{ base: 4, md: 8 }}>
        <Heading as="h2" textStyle="h1" color="fg">
          {t("home.featured.title")}
        </Heading>
        <Text color="fg.muted" fontSize="sm" mt={2} maxW="60ch">
          {t("home.featured.subtitle")}
        </Text>
      </Box>

      <Box
        mt={{ base: 6, md: 8 }}
        px={{ base: 4, md: 8 }}
        overflowX="auto"
        css={{ scrollSnapType: "x mandatory" }}
      >
        <Flex gap={5} maxW="7xl" mx="auto" pb={2}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  flex="none"
                  w={{ base: "62%", sm: "240px" }}
                  h="300px"
                  borderRadius="lg"
                />
              ))
            : products.map((product) => (
                <Box
                  key={product.id}
                  flex="none"
                  w={{ base: "62%", sm: "240px" }}
                  css={{ scrollSnapAlign: "start" }}
                >
                  <Card as="article" interactive clipCorner overflow="hidden">
                    <Box h="240px" bg="bg.muted" overflow="hidden">
                      {product.imageUrl ? (
                        <OptimizedImage
                          src={product.imageUrl}
                          alt={product.name}
                          width={480}
                          fallbackLabel={t("product.noImage")}
                          h="full"
                          w="full"
                          objectFit="cover"
                        />
                      ) : (
                        <Flex h="full" align="center" justify="center">
                          <EmptyState
                            title={t("product.noImage")}
                            icon={<ImageOff size={22} strokeWidth={1.5} />}
                          />
                        </Flex>
                      )}
                    </Box>
                    <Box p={3.5}>
                      <LinkOverlay asChild>
                        <Link
                          to="/$locale/$publisherSlug/$gameSlug/products/$productSlug"
                          params={{
                            locale,
                            publisherSlug: product.publisherSlug,
                            gameSlug: product.gameSlug,
                            productSlug: product.slug,
                          }}
                        >
                          <Heading as="h3" textStyle="h3" color="fg" truncate>
                            {product.name}
                          </Heading>
                        </Link>
                      </LinkOverlay>
                      <Text color="fg.muted" fontWeight="700" fontSize="sm" mt={1}>
                        {formatPrice(product.price)}
                      </Text>
                    </Box>
                  </Card>
                </Box>
              ))}
        </Flex>
      </Box>
    </Box>
  );
}

function ManifestoSection(): JSX.Element {
  const { t } = useTranslation("catalog");

  return (
    <Box as="section" px={{ base: 4, md: 8 }} py={{ base: 12, md: 20 }}>
      <Grid
        maxW="7xl"
        mx="auto"
        templateColumns={{ base: "1fr", lg: "1.2fr 0.8fr" }}
        gap={{ base: 8, lg: 14 }}
        alignItems="center"
      >
        <Heading
          as="h2"
          textStyle="display"
          fontSize={{ base: "2rem", md: "2.75rem" }}
          color="fg"
          maxW="24ch"
        >
          {t("home.manifesto.body")}
        </Heading>
        <Card clipCorner overflow="hidden">
          <OptimizedImage
            src="https://picsum.photos/seed/merch-shop-stitch/720/560"
            alt={t("home.manifesto.imageAlt")}
            width={720}
            fallbackLabel={t("product.noImage")}
            h={{ base: "220px", md: "320px" }}
            w="full"
            objectFit="cover"
          />
        </Card>
      </Grid>
    </Box>
  );
}
