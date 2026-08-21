import { describe, it, expect, afterEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import enUS from "../i18n/locales/en-US/common.json";
import frFR from "../i18n/locales/fr-FR/common.json";
import { LOCALE_COOKIE_NAME } from "../i18n/localeCookie";
import { localeStore } from "../store/locale";
import { renderRoute } from "../test-utils";

function localeCookie(): string | undefined {
  return document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${LOCALE_COOKIE_NAME}=`))
    ?.slice(LOCALE_COOKIE_NAME.length + 1);
}

afterEach(() => {
  document.cookie = `${LOCALE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  localeStore.setState(() => ({ preferred: undefined }));
});

async function switcher(): Promise<HTMLSelectElement> {
  const nav = await screen.findByRole("navigation");

  return within(nav).getByTestId<HTMLSelectElement>("locale-switcher");
}

describe("LocaleSwitcher", () => {
  it("offers every supported locale, named in the active language", async () => {
    renderRoute("/en-US");
    const control = await switcher();

    expect(control).toHaveAccessibleName(enUS.localeSwitcher.label);
    expect([...control.options].map((option) => option.text)).toEqual([
      enUS.localeSwitcher.options["en-US"],
      enUS.localeSwitcher.options["en-GB"],
      enUS.localeSwitcher.options["fr-FR"],
    ]);
  });

  it("names itself and its options in the active locale, not the default one", async () => {
    renderRoute("/fr-FR");
    const control = await switcher();

    expect(control).toHaveAccessibleName(frFR.localeSwitcher.label);
    expect([...control.options].map((option) => option.text)).toEqual([
      frFR.localeSwitcher.options["en-US"],
      frFR.localeSwitcher.options["en-GB"],
      frFR.localeSwitcher.options["fr-FR"],
    ]);
  });

  it("shows the locale the URL is already under as the current value", async () => {
    renderRoute("/en-GB/cart");

    expect(await switcher()).toHaveValue("en-GB");
  });

  it("navigates to the same page under the chosen locale", async () => {
    const { router } = renderRoute("/en-US/cart");

    await userEvent.selectOptions(await switcher(), "fr-FR");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/fr-FR/cart");
    });
  });

  it("keeps the search string when switching", async () => {
    const { router } = renderRoute("/en-US?team=t1");

    await userEvent.selectOptions(await switcher(), "fr-FR");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/fr-FR");
    });
    expect(router.state.location.search).toMatchObject({ team: "t1" });
  });

  it("persists the choice where the redirect for a bare URL will read it", async () => {
    renderRoute("/en-US/cart");

    await userEvent.selectOptions(await switcher(), "fr-FR");

    await waitFor(() => {
      expect(localeStore.state.preferred).toBe("fr-FR");
    });
    expect(localeCookie()).toBe("fr-FR");
  });

  it("re-renders the surrounding chrome in the chosen language", async () => {
    renderRoute("/en-US/cart");
    const nav = await screen.findByRole("navigation");

    expect(within(nav).getByText(enUS.nav.cart)).toBeInTheDocument();

    await userEvent.selectOptions(await switcher(), "fr-FR");

    await waitFor(() => {
      expect(within(nav).getByText(frFR.nav.cart)).toBeInTheDocument();
    });
  });
});
