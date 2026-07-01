# Overlay (Dialog/Drawer) content is tested standalone; open/close interaction is not

For Chakra's Dialog/Drawer family (modals, sheets, drawers — not Popover/Menu/Tooltip), extract the overlay's body into its own component and unit-test it via direct render with props. Don't test the open/close click interaction in Vitest/JSDOM.

## Rationale

Chakra's Dialog/Drawer primitives run on Zag's presence state machine (`queueMicrotask` + `flushSync`), which deadlocks React 19's `act()` in JSDOM — see the `ponytail:` workaround in `GlobalNav.tsx`. Even hand-rolled overlays (plain `useState` + conditional `Portal`, avoiding Zag entirely) still make click-driven `renderRoute` integration tests slow, since each test pays for a full route mount, portal render, and interaction round-trip just to reveal content that could be asserted directly.

## Decision

- Overlay content (what renders inside, branching on auth state, counts, etc.) is "logic inside" per `CLAUDE.md`/ADR-0009's test mandate — extract it to a component (e.g. `NavDrawerContent`) and test it with direct prop-driven renders. No click needed.
- The open/close trigger wiring (button `onClick` → state → portal mount) is not covered in Vitest. Per ADR-0009, it's eligible for Playwright only if an issue is explicitly labeled `needs-e2e`.
- Applies retroactively: `GlobalNav`'s mobile drawer test drops its click-open/click-close assertions in favor of a standalone `NavDrawerContent` test; `GlobalNav.test.tsx` keeps only "hamburger button renders."

## Status

accepted
