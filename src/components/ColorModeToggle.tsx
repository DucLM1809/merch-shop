import { useEffect, useState } from "react";
import { Flex, NativeSelect } from "@chakra-ui/react";
import { useSelector } from "@tanstack/react-store";
import { Monitor, Moon, Sun } from "lucide-react";

import { colorModeStore, setPreferredColorMode, setSystemColorMode } from "../store/colorMode";

import type { ChangeEvent, JSX } from "react";
import type { ColorMode } from "../theme/resolveColorMode";

type ColorModeOption = "system" | ColorMode;

function isColorModeOption(value: string): value is ColorModeOption {
  return value === "system" || value === "light" || value === "dark";
}

// The leading icon tracks the selected mode, so this control reads apart from
// `LocaleSwitcher`'s static globe at a glance, not just by its text.
const MODE_ICON = { system: Monitor, light: Sun, dark: Moon };

type ColorModeToggleProps = {
  /** Accessible name for the control. */
  label: string;
  /** Option copy, in System / Light / Dark order — each caller supplies its own since
   * Admin stays hardcoded English while the storefront translates (see CLAUDE.md's i18n
   * conventions), and this component has no opinion on either. */
  options: { system: string; light: string; dark: string };
};

/**
 * System / Light / Dark control, same `NativeSelect` widget `LocaleSwitcher` uses.
 * "System" is `preferred === undefined` in the store — selecting it clears the stored
 * override so the page goes back to following the OS live (see `useColorMode`).
 */
export function ColorModeToggle({ label, options }: ColorModeToggleProps): JSX.Element {
  const preferred = useSelector(colorModeStore, (state) => state.preferred);

  // The cookie lives in the request the server already has, but `colorModeStore` is a
  // plain module-level singleton with no per-request access to it (unlike the root
  // loader, which reads it correctly via `getCookie`) — so the server always renders this
  // control as "System", regardless of any actual cookie. Matching that on the very first
  // client paint, then correcting once mounted, avoids a React hydration mismatch on the
  // native `<select>` (which — unlike other controls — doesn't reliably self-correct
  // during hydration); same idea as the guest cart count in `GlobalNav.tsx`.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  const selected: ColorModeOption = hasMounted ? (preferred ?? "system") : "system";

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const chosen = event.target.value;
    if (!isColorModeOption(chosen)) return;

    if (chosen === "system") {
      setSystemColorMode();
    } else {
      setPreferredColorMode(chosen);
    }
  };

  const ModeIcon = MODE_ICON[selected];

  return (
    <Flex
      align="center"
      gap={1.5}
      color="fg.subtle"
      borderRadius="md"
      _focusWithin={{
        outline: "2px solid",
        outlineColor: "colorPalette.focusRing",
        outlineOffset: "2px",
      }}
    >
      <ModeIcon size={16} strokeWidth={1.5} aria-hidden />
      <NativeSelect.Root size="sm" width="auto" variant="plain">
        <NativeSelect.Field
          value={selected}
          onChange={handleChange}
          aria-label={label}
          color="fg.muted"
          fontSize="sm"
          // A step below the 600 the nav's destinations carry: a preference the visitor sets
          // once should not read as a peer of the links they navigate with.
          fontWeight="500"
          cursor="pointer"
          _hover={{ color: "fg" }}
          focusVisibleRing="none"
          data-testid="color-mode-toggle"
        >
          <option value="system">{options.system}</option>
          <option value="light">{options.light}</option>
          <option value="dark">{options.dark}</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator color="fg.subtle" />
      </NativeSelect.Root>
    </Flex>
  );
}
