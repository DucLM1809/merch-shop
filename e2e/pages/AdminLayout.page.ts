import { type Locator, type Page } from "@playwright/test";

// Mirrors NAV_ITEMS in src/modules/admin/components/AdminLayout.tsx.
export const ADMIN_NAV_ITEMS = [
  { label: "Orders", to: "/en-US/admin/orders" },
  { label: "Publishers", to: "/en-US/admin/publishers" },
  { label: "Games", to: "/en-US/admin/games" },
  { label: "Teams", to: "/en-US/admin/teams" },
  { label: "Characters", to: "/en-US/admin/characters" },
  { label: "Products", to: "/en-US/admin/products" },
  { label: "SKUs", to: "/en-US/admin/skus" },
] as const;

export class AdminLayoutPage {
  readonly page: Page;
  readonly nav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.getByRole("navigation");
  }

  // TanStack Router's <Link> stamps the active anchor with aria-current="page" itself
  // (see @tanstack/react-router/link.js STATIC_ACTIVE_PROPS), so this needs no
  // data-testid of its own.
  navLink(label: string): Locator {
    return this.nav.getByRole("link", { name: label });
  }
}
