import { Flex, Separator } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { ColorModeToggle } from "./ColorModeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

import type { JSX } from "react";

const DIVIDER_HEIGHT = "18px";

/**
 * The recessed color-mode + language shelf, grouped so the pair reads as a single settings
 * object rather than as two more peers of whatever sits beside it.
 *
 * Storefront-only, so unlike `ColorModeToggle` it translates its own copy — Admin, which
 * stays hardcoded English (see CLAUDE.md's i18n conventions), never renders this.
 *
 * It exists as a component because there are now two homes for it: the global nav, and the
 * auth takeover, which hides that nav and so has to carry preferences itself.
 */
export function UtilityShelf(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Flex align="center" gap={2} px={2.5} py={1} borderRadius="lg" bg="bg.muted">
      <ColorModeToggle
        label={t("colorModeToggle.label")}
        options={{
          system: t("colorModeToggle.options.system"),
          light: t("colorModeToggle.options.light"),
          dark: t("colorModeToggle.options.dark"),
        }}
      />
      <Separator orientation="vertical" h={DIVIDER_HEIGHT} borderColor="border.emphasized" />
      <LocaleSwitcher />
    </Flex>
  );
}
