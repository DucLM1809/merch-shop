import type { JSX, ReactNode } from "react";

import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { Gamepad2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { UtilityShelf } from "@/components/UtilityShelf";
import { useLocale } from "@/i18n/useLocale";

type Props = {
  children: ReactNode;
};

// The brand panel is a permanently inked surface in both color modes, so its foreground
// colors are literal rather than the `fg`/`fg.muted` semantic tokens used everywhere else:
// those resolve to dark gray under light mode and would land dark-on-near-black here. Fixing
// them light keeps the panel AA-legible in both modes on one code path — the same reason a
// key-art panel stays key art regardless of the UI theme around it. This is a surface, not a
// theme flip: the form column beside it still follows the visitor's mode, which is where the
// semantic tokens belong.
const PANEL_INK = "gray.950";
const PANEL_FG = "white";
const PANEL_FG_MUTED = "gray.300";

// Two offset radials rather than one centered blur: offset reads as a field with depth,
// centered reads as the generic glow this redesign replaces. Built from the blue accent
// alone — `signal` is documented in `theme/system.ts` as the narrow live-indicator accent
// and explicitly never a competing brand color, so it stays off the panel entirely.
const PANEL_FIELD =
  "radial-gradient(ellipse 70% 55% at 12% 10%, rgba(43, 140, 255, 0.30), transparent 70%), " +
  "radial-gradient(ellipse 65% 60% at 88% 92%, rgba(24, 87, 173, 0.34), transparent 72%)";

// A faint access-panel grid, masked so it fades out toward the edges rather than
// hard-cropping. Decorative texture only, not a semantic UI color, so a literal rgba here
// follows the same convention as the rgba shadow tokens in theme.ts. Only one value is
// needed now that the panel no longer changes surface between modes.
const GRID_PATTERN = "radial-gradient(circle, rgba(123, 130, 150, 0.5) 1px, transparent 1px)";
const GRID_MASK = "radial-gradient(ellipse 75% 70% at 28% 38%, black 0%, transparent 78%)";

const PANEL_INLINE_PADDING = { base: 6, md: 10, xl: 16 };

/**
 * The full-viewport auth takeover: a brand panel that carries the storefront's identity, and
 * a quiet form column beside it. `GlobalNav` hides itself on `(auth)` routes so this page
 * owns the whole viewport, which is why the panel carries both the mark back to the shop and
 * the preferences shelf the nav would otherwise hold.
 *
 * The panel copy is deliberately constant across sign-in, sign-up, and the password and
 * verification flows — it speaks to what an account is for, while the heading inside
 * `children` says which step the visitor is on.
 */
export function AuthPageView({ children }: Props): JSX.Element {
  const { t } = useTranslation("account");
  const { t: tCommon } = useTranslation();
  const locale = useLocale();

  return (
    <Grid
      minH="100dvh"
      templateColumns={{ base: "1fr", lg: "minmax(0, 1.15fr) minmax(0, 1fr)" }}
      // Below lg the two zones stack as rows, and a grid stretches its rows to fill the
      // 100dvh above: the brand band claimed half the phone viewport and pushed the form
      // under the fold. Pinning the band to its content height gives the remainder to the
      // form. At lg there is a single row, so the value is inert.
      templateRows={{ base: "auto 1fr", lg: "1fr" }}
    >
      <Flex
        position="relative"
        overflow="hidden"
        direction="column"
        justify="space-between"
        gap={{ base: 8, lg: 0 }}
        bg={PANEL_INK}
        color={PANEL_FG}
        px={PANEL_INLINE_PADDING}
        py={{ base: 8, lg: 12 }}
        // Only the desktop panel is a full column; on mobile it collapses to a band above
        // the form and takes whatever height its two lines of content need.
        minH={{ base: "auto", lg: "100dvh" }}
        borderBottomWidth={{ base: "1px", lg: 0 }}
        borderInlineEndWidth={{ base: 0, lg: "1px" }}
        borderColor="whiteAlpha.200"
      >
        <Box position="absolute" inset={0} bgImage={PANEL_FIELD} pointerEvents="none" aria-hidden />
        <Box
          position="absolute"
          inset={0}
          bgImage={GRID_PATTERN}
          bgSize="28px 28px"
          opacity={0.45}
          maskImage={GRID_MASK}
          pointerEvents="none"
          aria-hidden
        />

        {/* With the nav hidden, this mark is the only way back to the storefront, so it is a
            real destination rather than the decorative lockup it would be beside a nav. */}
        <Link to="/$locale/shop" params={{ locale }}>
          <Flex
            position="relative"
            align="center"
            gap={2.5}
            opacity={0.9}
            _hover={{ opacity: 1 }}
            transition="opacity 0.15s"
          >
            <Box color="blue.300" display="flex" alignItems="center">
              <Gamepad2 size={20} strokeWidth={1.75} />
            </Box>
            <Text
              fontFamily="heading"
              fontWeight="700"
              fontSize="sm"
              letterSpacing="0.14em"
              textTransform="uppercase"
            >
              {tCommon("brand")}
            </Text>
          </Flex>
        </Link>

        <Box position="relative">
          {/* Brand copy, not a section title, so it stays out of the heading outline: the
              form column's own heading is the page's h1, and marking this up as a heading
              would put an h2 above it in DOM order. */}
          <Text
            textStyle="display"
            textTransform="uppercase"
            data-testid="auth-panel-headline"
            letterSpacing="0.02em"
            fontSize={{ base: "1.875rem", lg: "3.5rem" }}
            // A width rather than a `ch` count: the headline is translated, and the French
            // string is half again as long as the English one.
            maxW={{ base: "full", lg: "460px" }}
          >
            {t("panel.headline")}
          </Text>

          {/* The supporting line is the first thing to go on a phone — the band exists there
              to establish whose sign-in this is, and the form has to stay above the fold. */}
          <Text
            color={PANEL_FG_MUTED}
            mt={4}
            maxW="42ch"
            lineHeight="1.6"
            hideBelow="lg"
            data-testid="auth-panel-body"
          >
            {t("panel.body")}
          </Text>
        </Box>
      </Flex>

      <Flex
        direction="column"
        align="center"
        gap={8}
        // `bg.panel` rather than the page canvas: under dark mode the canvas is the same
        // near-black the brand panel is inked with, and the split collapsed into a single
        // dark field broken only by the seam. The panel surface lifts the form column off
        // the ink in dark and stays white in light, which is the reference's card-on-art
        // relationship in both modes.
        bg="bg.panel"
        px={{ base: 6, md: 10 }}
        py={{ base: 10, lg: 12 }}
        minH={{ base: "auto", lg: "100dvh" }}
      >
        <Flex flex="1" w="full" align="center" justify="center">
          <Box w="full" maxW="360px">
            {children}
          </Box>
        </Flex>

        <UtilityShelf />
      </Flex>
    </Grid>
  );
}
