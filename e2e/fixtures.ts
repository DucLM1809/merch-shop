import { test as base, expect } from "@playwright/test";

import { GlobalNavPage } from "./pages/GlobalNav.page";

export const GUEST_STORAGE_STATE = { cookies: [], origins: [] };

type Fixtures = {
  nav: GlobalNavPage;
};

export const test = base.extend<Fixtures>({
  nav: async ({ page }, use) => {
    await use(new GlobalNavPage(page));
  },
});

export { expect };
