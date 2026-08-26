# Chakra UI v3 as design system

The frontend uses Chakra UI v3 for all UI components. Tailwind CSS is removed.

## Considered Options

- Chakra UI v3 ✓
- Tailwind CSS (incumbent)
- shadcn/ui
- MUI

Tailwind is utility-first and produces verbose markup with no component primitives — every interactive element (Modal, Select, Toast, Drawer) must be built from scratch, and accessibility is the developer's responsibility. shadcn/ui ships headless primitives with Tailwind; same accessibility burden. MUI has rich components but carries a heavy Material Design aesthetic that conflicts with the esports brand.

Chakra UI v3 ships fully accessible, composable components built on Ark UI, with a token-based theming system. This directly addresses the two gaps Tailwind left: component richness and ARIA compliance.

## Decisions

- **Version**: v3 (Ark UI + Panda CSS internals; no Emotion dependency).
- **Theme**: default Chakra system for now; extend with brand tokens when design identity is defined.
- **Color mode**: dark default, retained; a System/Light/Dark toggle was added afterward (see `merch-shop-0lf.16` and `src/colorMode/`) — a visitor can follow their OS live or override it explicitly, persisted via a cookie resolved server-side before render, the same pattern as the locale cookie.
- **Migration**: big-bang — one component existed at migration time, no coexistence debt.

## Consequences

All new components must use Chakra primitives. Raw HTML elements with utility classes are a code-smell in this repo going forward. Custom Tailwind classes are gone; spacing, color, and typography come from Chakra tokens. When brand tokens are introduced, they extend `createSystem` — no component rewrites needed, only token overrides.
