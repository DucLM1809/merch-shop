import { createSystem, defaultConfig, defineConfig, defineRecipe } from "@chakra-ui/react";

// Design identity: a licensed esports-merch storefront. Dark is the only mode
// (see `__root.tsx`'s hardcoded `className="dark"`), so every semantic token
// below only needs its `_dark` branch to ever be seen — `_light` values are kept
// close to Chakra's own defaults purely so the shape stays valid if dark mode is
// ever toggled off, not because light mode is a supported surface.

// `gray` and `blue` are Chakra's own built-in scales, referenced everywhere in
// the app via bare literals (`gray.900`, `blue.400`, `colorPalette="blue"`).
// Retuning the raw scale here — rather than inventing a parallel token
// namespace — reskins every existing call site for free, including pages this
// redesign hasn't reached yet.
const gray = {
  50: { value: "#F4F5F7" },
  100: { value: "#E7E9EE" },
  200: { value: "#CDD1DC" },
  300: { value: "#A6ACBC" },
  400: { value: "#7B8296" },
  500: { value: "#5B6178" },
  600: { value: "#40465A" },
  700: { value: "#2A2F3E" },
  800: { value: "#1C1F2A" },
  900: { value: "#14161F" },
  950: { value: "#0A0B10" },
};

const blue = {
  50: { value: "#E9F4FF" },
  100: { value: "#CCE6FF" },
  200: { value: "#99CCFF" },
  300: { value: "#5CA8FF" },
  400: { value: "#3D96FF" },
  500: { value: "#2B8CFF" },
  600: { value: "#1E6FDB" },
  700: { value: "#1857AD" },
  800: { value: "#123F7E" },
  900: { value: "#0C2A57" },
};

// The narrow-purpose warm accent — live/active indicators and the card/badge
// signature — never a competing primary brand color.
const signal = {
  50: { value: "#FFF1EC" },
  100: { value: "#FFDCCF" },
  200: { value: "#FFB69C" },
  300: { value: "#FF8E67" },
  400: { value: "#FF6E42" },
  500: { value: "#FF5A2E" },
  600: { value: "#DB4520" },
  700: { value: "#B3341A" },
  800: { value: "#872715" },
  900: { value: "#5C1A0F" },
};

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Rajdhani', system-ui, sans-serif" },
        body: { value: "'Geist Variable', system-ui, sans-serif" },
        mono: { value: "ui-monospace, 'Geist Mono Variable', monospace" },
      },
      colors: {
        gray,
        blue,
        signal,
      },
      shadows: {
        cardRest: { value: "0 1px 2px rgba(0, 0, 0, 0.45)" },
        cardHover: {
          value: "0 10px 28px -10px rgba(43, 140, 255, 0.35), 0 4px 10px rgba(0, 0, 0, 0.55)",
        },
        // Beacon glow for primary (solid blue) CTAs — on a near-black canvas a flat
        // fill reads as just another dark panel, so the halo is what actually pulls
        // the eye. Kept off every other variant/colorPalette so it stays a primary-
        // action signal rather than decoration.
        ctaRest: {
          value: "0 0 0 1px rgba(61, 150, 255, 0.5), 0 6px 18px -6px rgba(43, 140, 255, 0.6)",
        },
        ctaHover: {
          value: "0 0 0 1px rgba(61, 150, 255, 0.75), 0 10px 26px -6px rgba(43, 140, 255, 0.8)",
        },
      },
    },
    semanticTokens: {
      colors: {
        signal: {
          contrast: { value: { _light: "white", _dark: "white" } },
          fg: { value: { _light: "{colors.signal.700}", _dark: "{colors.signal.300}" } },
          subtle: { value: { _light: "{colors.signal.100}", _dark: "{colors.signal.900}" } },
          muted: { value: { _light: "{colors.signal.200}", _dark: "{colors.signal.800}" } },
          emphasized: {
            value: { _light: "{colors.signal.300}", _dark: "{colors.signal.700}" },
          },
          solid: { value: { _light: "{colors.signal.500}", _dark: "{colors.signal.500}" } },
          focusRing: {
            value: { _light: "{colors.signal.500}", _dark: "{colors.signal.500}" },
          },
          border: { value: { _light: "{colors.signal.500}", _dark: "{colors.signal.600}" } },
        },
        // Status colorPalettes, same shape as `signal` above so `colorPalette="success"` etc.
        // work everywhere a Chakra colorPalette is accepted (Badge, Alert, Button...). Built on
        // Chakra's own green/red/orange scales rather than inventing new hex values — there's no
        // brand reason to retune these the way gray/blue were retuned.
        success: {
          contrast: { value: { _light: "white", _dark: "white" } },
          fg: { value: { _light: "{colors.green.700}", _dark: "{colors.green.300}" } },
          subtle: { value: { _light: "{colors.green.100}", _dark: "{colors.green.900}" } },
          muted: { value: { _light: "{colors.green.200}", _dark: "{colors.green.800}" } },
          emphasized: { value: { _light: "{colors.green.300}", _dark: "{colors.green.700}" } },
          solid: { value: { _light: "{colors.green.500}", _dark: "{colors.green.500}" } },
          focusRing: { value: { _light: "{colors.green.500}", _dark: "{colors.green.500}" } },
          border: { value: { _light: "{colors.green.500}", _dark: "{colors.green.600}" } },
        },
        danger: {
          contrast: { value: { _light: "white", _dark: "white" } },
          fg: { value: { _light: "{colors.red.700}", _dark: "{colors.red.300}" } },
          subtle: { value: { _light: "{colors.red.100}", _dark: "{colors.red.900}" } },
          muted: { value: { _light: "{colors.red.200}", _dark: "{colors.red.800}" } },
          emphasized: { value: { _light: "{colors.red.300}", _dark: "{colors.red.700}" } },
          solid: { value: { _light: "{colors.red.500}", _dark: "{colors.red.500}" } },
          focusRing: { value: { _light: "{colors.red.500}", _dark: "{colors.red.500}" } },
          border: { value: { _light: "{colors.red.500}", _dark: "{colors.red.600}" } },
        },
        warning: {
          contrast: { value: { _light: "white", _dark: "black" } },
          fg: { value: { _light: "{colors.orange.700}", _dark: "{colors.orange.300}" } },
          subtle: { value: { _light: "{colors.orange.100}", _dark: "{colors.orange.900}" } },
          muted: { value: { _light: "{colors.orange.200}", _dark: "{colors.orange.800}" } },
          emphasized: { value: { _light: "{colors.orange.300}", _dark: "{colors.orange.700}" } },
          solid: { value: { _light: "{colors.orange.500}", _dark: "{colors.orange.500}" } },
          focusRing: { value: { _light: "{colors.orange.500}", _dark: "{colors.orange.500}" } },
          border: { value: { _light: "{colors.orange.500}", _dark: "{colors.orange.600}" } },
        },
        // Retuned to the app's actual visual hierarchy: canvas (page) → panel
        // (card/nav/drawer surface) → muted (hover/raised surface).
        bg: {
          DEFAULT: { value: { _light: "{colors.white}", _dark: "{colors.gray.950}" } },
          panel: { value: { _light: "{colors.white}", _dark: "{colors.gray.900}" } },
          muted: { value: { _light: "{colors.gray.100}", _dark: "{colors.gray.800}" } },
          subtle: { value: { _light: "{colors.gray.50}", _dark: "{colors.gray.900}" } },
        },
        fg: {
          DEFAULT: { value: { _light: "{colors.gray.900}", _dark: "white" } },
          muted: { value: { _light: "{colors.gray.600}", _dark: "{colors.gray.400}" } },
          subtle: { value: { _light: "{colors.gray.400}", _dark: "{colors.gray.500}" } },
        },
        border: {
          DEFAULT: { value: { _light: "{colors.gray.200}", _dark: "{colors.gray.800}" } },
          muted: { value: { _light: "{colors.gray.100}", _dark: "{colors.gray.800}" } },
          emphasized: { value: { _light: "{colors.gray.300}", _dark: "{colors.gray.700}" } },
        },
      },
    },
    textStyles: {
      display: {
        value: {
          fontFamily: "heading",
          fontWeight: "700",
          fontSize: { base: "2.5rem", md: "3.5rem" },
          lineHeight: "1.05",
          letterSpacing: "-0.01em",
        },
      },
      h1: {
        value: {
          fontFamily: "heading",
          fontWeight: "700",
          fontSize: { base: "1.75rem", md: "2.25rem" },
          lineHeight: "1.15",
        },
      },
      h2: {
        value: {
          fontFamily: "heading",
          fontWeight: "600",
          fontSize: { base: "1.375rem", md: "1.625rem" },
          lineHeight: "1.2",
        },
      },
      h3: {
        value: {
          fontFamily: "heading",
          fontWeight: "600",
          fontSize: "1.125rem",
          lineHeight: "1.3",
        },
      },
      body: {
        value: {
          fontFamily: "body",
          fontWeight: "400",
          fontSize: "1rem",
          lineHeight: "1.6",
        },
      },
      caption: {
        value: {
          fontFamily: "body",
          fontWeight: "500",
          fontSize: "0.8125rem",
          lineHeight: "1.4",
          letterSpacing: "0.01em",
        },
      },
    },
    recipes: {
      // Primary storefront/admin actions (Add to Cart, Checkout, Save...) all use
      // `colorPalette="blue"` with the default `solid` variant. Chakra's stock
      // recipe renders that as a flat fill, which loses definition against this
      // theme's near-black surfaces — bumping weight and adding the glow shadow
      // above is what makes it actually read as *the* button on the page.
      button: defineRecipe({
        compoundVariants: [
          {
            colorPalette: "blue",
            variant: "solid",
            css: {
              fontWeight: "bold",
              shadow: "ctaRest",
              _hover: { shadow: "ctaHover" },
              _expanded: { shadow: "ctaHover" },
            },
          },
        ],
      }),
    },
  },
  globalCss: {
    // Chakra's own recipes (Button, IconButton, Link, Input...) already draw their
    // focus-visible ring from `colorPalette.focusRing`; the default `colorPalette` is
    // "gray", which reads as barely-there against this dark theme. Rescoping it to the
    // brand accent here makes every recipe-driven component's focus ring visible for
    // free, without touching each component.
    html: {
      colorPalette: "signal",
    },
    // Nav links and other custom interactive elements are plain `Box`/`Link` markup, not
    // Chakra recipes, so they never pick up `focusVisibleRing` — give them the same ring
    // directly. `colorPalette.focusRing` still resolves relative to whatever colorPalette
    // is in scope (e.g. a `colorPalette="danger"` destructive action gets a red ring).
    'a:focus-visible, button:focus-visible, [role="button"]:focus-visible, [tabindex]:focus-visible':
      {
        outline: "2px solid",
        outlineColor: "colorPalette.focusRing",
        outlineOffset: "2px",
      },
  },
});

export const system = createSystem(defaultConfig, config);
