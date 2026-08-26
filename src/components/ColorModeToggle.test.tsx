import { describe, it, expect, afterEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import enUS from "../i18n/locales/en-US/common.json";
import { COLOR_MODE_COOKIE_NAME } from "../colorMode/colorModeCookie";
import { colorModeStore } from "../store/colorMode";
import { renderRoute } from "../test-utils";

function colorModeCookie(): string | undefined {
  return document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${COLOR_MODE_COOKIE_NAME}=`))
    ?.slice(COLOR_MODE_COOKIE_NAME.length + 1);
}

afterEach(() => {
  document.cookie = `${COLOR_MODE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  colorModeStore.setState(() => ({ preferred: undefined }));
});

async function toggle(): Promise<HTMLSelectElement> {
  const nav = await screen.findByRole("navigation");

  return within(nav).getByTestId<HTMLSelectElement>("color-mode-toggle");
}

describe("ColorModeToggle", () => {
  it("offers System, Light and Dark, named in the active language", async () => {
    renderRoute("/en-US");
    const control = await toggle();

    expect(control).toHaveAccessibleName(enUS.colorModeToggle.label);
    expect([...control.options].map((option) => option.text)).toEqual([
      enUS.colorModeToggle.options.system,
      enUS.colorModeToggle.options.light,
      enUS.colorModeToggle.options.dark,
    ]);
  });

  it("shows System as the value when no preference has been chosen", async () => {
    renderRoute("/en-US");

    expect(await toggle()).toHaveValue("system");
    expect(document.documentElement.className).toBe("dark");
  });

  it("applies the chosen mode to the document and persists it to a cookie", async () => {
    renderRoute("/en-US");

    await userEvent.selectOptions(await toggle(), "light");

    await waitFor(() => {
      expect(document.documentElement.className).toBe("light");
    });
    expect(colorModeStore.state.preferred).toBe("light");
    expect(colorModeCookie()).toBe("light");
  });

  it("switching back to System clears the stored override", async () => {
    renderRoute("/en-US");

    await userEvent.selectOptions(await toggle(), "dark");
    await waitFor(() => expect(colorModeCookie()).toBe("dark"));

    await userEvent.selectOptions(await toggle(), "system");

    await waitFor(() => {
      expect(colorModeStore.state.preferred).toBeUndefined();
    });
    expect(colorModeCookie()).toBeUndefined();
  });
});
