import { Flex, NativeSelect } from "@chakra-ui/react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SUPPORTED_LOCALES, isSupportedLocale } from "../i18n/locales";
import { hrefUnderLocale } from "../i18n/localeRedirect";
import { setPreferredLocale } from "../store/locale";
import { useLocale } from "../i18n/useLocale";

import type { ChangeEvent, JSX } from "react";

type LocaleSwitcherProps = {
  /** Called after a locale change is under way — lets the mobile drawer close itself. */
  onChanged?: () => void;
};

export function LocaleSwitcher({ onChanged }: LocaleSwitcherProps): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();
  const location = useRouterState({ select: (state) => state.location });

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const chosen = event.target.value;

    if (!isSupportedLocale(chosen) || chosen === locale) return;

    // Persist before navigating. The cookie is what decides the language of a later bare
    // URL, so it should hold even if this navigation never completes.
    setPreferredLocale(chosen);
    void navigate({ href: hrefUnderLocale(location, chosen) });
    onChanged?.();
  };

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
      <Globe size={16} strokeWidth={1.5} aria-hidden />
      <NativeSelect.Root size="sm" width="auto" variant="plain">
        <NativeSelect.Field
          value={locale}
          onChange={handleChange}
          aria-label={t("localeSwitcher.label")}
          color="fg.muted"
          fontSize="sm"
          // Matches `ColorModeToggle` — see the note there on why preferences sit a weight
          // below the nav's destinations.
          fontWeight="500"
          cursor="pointer"
          _hover={{ color: "fg" }}
          focusVisibleRing="none"
          data-testid="locale-switcher"
        >
          {SUPPORTED_LOCALES.map((supported) => (
            <option key={supported} value={supported}>
              {t(`localeSwitcher.options.${supported}`)}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator color="fg.subtle" />
      </NativeSelect.Root>
    </Flex>
  );
}
